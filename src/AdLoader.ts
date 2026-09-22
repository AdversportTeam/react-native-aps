/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This file is part of react-native-aps.
 *
 * react-native-aps is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * react-native-aps is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Foobar. If not, see <https://www.gnu.org/licenses/>.
 */

import { NativeEventEmitter, Platform } from 'react-native';
import { AdError } from './AdError';
import AdLoaderModule from './internal/AdLoaderModule';
import { AdLoaderEvent, isAdLoaderEvent } from './types/AdLoaderEvent';
import type { AdLoaderListener } from './types/AdLoaderListener';
import {
  type AdLoaderOptions,
  type BannerAdLoaderOptions,
  validateAdLoaderOptions,
  validateBannerAdLoaderOptions,
} from './types/AdLoaderOptions';
import { AdType } from './types';
import {
  abortQueuedBidRequests,
  BID_REQUEST_NO_RESPONSE_MS,
  DEFAULT_BID_REQUEST_PRIORITY,
  enqueueBidRequest,
  getBidRequestQueueStats,
} from './internal/BidRequestQueue';
import type { BidRequestQueueStats } from './types/BidRequestQueueStats';
import {
  type LoadAdOptions,
  validateLoadAdOptions,
} from './types/LoadAdOptions';

export class AdLoader {
  private static readonly _nativeModule = AdLoaderModule;
  private static readonly _eventEmitter = new NativeEventEmitter(
    AdLoaderModule
  );
  private static _adLoaders = 0;
  private loaderId: number;

  private constructor(
    public readonly adType: AdType,
    public readonly adLoaderOptions: AdLoaderOptions
  ) {
    this.loaderId = AdLoader._adLoaders++;
  }

  /**
   * Create a banner AdLoader instance.
   */
  static createBannerAdLoader(adLoaderOptions: BannerAdLoaderOptions) {
    try {
      validateBannerAdLoaderOptions(adLoaderOptions as BannerAdLoaderOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`AdLoader.createBannerAdLoader(*) ${e.message}`);
      }
    }
    const adLoader = new AdLoader(AdType.BANNER, adLoaderOptions);
    return adLoader;
  }

  /**
   * Create a interstitial AdLoader instance.
   */
  static createInterstitialAdLoader(adLoaderOptions: AdLoaderOptions) {
    try {
      validateAdLoaderOptions(adLoaderOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`AdLoader.createInterstitialAdLoader(*) ${e.message}`);
      }
    }
    const adLoader = new AdLoader(AdType.INTERSTITIAL, adLoaderOptions);
    return adLoader;
  }

  /**
   * Add a listener for the bid response. Supported events are:
   * - `AdLoaderEvent.SUCCESS`
   * - `AdLoaderEvent.FAILURE`
   */
  addListener<E extends AdLoaderEvent>(
    eventName: E,
    listener: AdLoaderListener<E>
  ) {
    if (!isAdLoaderEvent(eventName)) {
      throw new Error(
        `AdLoader.addListener(*) 'eventName' expected one of AdLoaderEvent values`
      );
    }
    if (typeof listener !== 'function') {
      throw new Error(
        `AdLoader.addListener(_, *) 'listener' expected a function`
      );
    }
    const subscribtion = AdLoader._eventEmitter.addListener(
      eventName,
      (payload) => {
        if (payload.loaderId !== this.loaderId) {
          return;
        }
        let error;
        if (payload.userInfo) {
          error = AdError.fromNativeError(payload);
        }
        listener(error || payload.response);
      }
    );
    return () => subscribtion.remove();
  }

  /**
   * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
   * This method will return a promise that resolves a bid response requested by this call.
   * In order to receive further bid responses returned by auto refresh, you must register listeners via `addListener()`.
   *
   * Requests go through a queue bounded by what the native SDK serves
   * concurrently (the Android SDK answers one request at a time unless
   * `bidRequestConcurrency` widened it; iOS is unbounded). While queued, a
   * request can be aborted through `options.signal` and is ordered by
   * `options.priority`. The promise always settles: an emitted request the
   * native side never answers is rejected with an AdError `no_response` after
   * `AdLoader.NO_RESPONSE_MS` at least (`getQueueStats().noResponseMs` is the
   * delay in force). Auto-refresh re-requests are issued by the SDK itself and
   * do not go through the queue.
   */
  loadAd(options?: LoadAdOptions): Promise<{ [key: string]: string }> {
    let validated: LoadAdOptions;
    try {
      validated = validateLoadAdOptions(options);
    } catch (e) {
      throw new Error(
        `AdLoader.loadAd(*) ${e instanceof Error ? e.message : String(e)}`
      );
    }
    return this.loadAdQueued(validated);
  }

  private async loadAdQueued(
    options: LoadAdOptions
  ): Promise<{ [key: string]: string }> {
    try {
      return await enqueueBidRequest({
        loaderId: this.loaderId,
        priority: options.priority ?? DEFAULT_BID_REQUEST_PRIORITY,
        signal: options.signal,
        run: () =>
          AdLoader._nativeModule.loadAd(
            this.loaderId,
            this.adType,
            this.adLoaderOptions
          ),
      });
    } catch (error) {
      if (
        error instanceof AdError &&
        error.code === 'no_response' &&
        !(this.adLoaderOptions as BannerAdLoaderOptions).autoRefresh
      ) {
        // The native side keeps a one-shot request until its callback, which
        // will not come: drop it (stop() is a no-op on a one-shot request).
        AdLoader._nativeModule.stopAutoRefresh(this.loaderId);
      }
      if ((error as any).userInfo) {
        throw AdError.fromNativeError(error);
      } else {
        throw error;
      }
    }
  }

  /**
   * Stop the auto refresh of the ad. A request of this loader still waiting in
   * the queue is dropped (its promise rejects with an AdError `aborted`).
   */
  stopAutoRefresh() {
    abortQueuedBidRequests(
      this.loaderId,
      'stopAutoRefresh() called before the request was emitted'
    );
    AdLoader._nativeModule.stopAutoRefresh(this.loaderId);
  }

  /**
   * Counters of the bid request queue: what the native SDK serves
   * concurrently, what is in flight or waiting, and what the queue cost
   * (requests aborted before emission, requests the native side never
   * answered).
   */
  static getQueueStats(): BidRequestQueueStats {
    return getBidRequestQueueStats();
  }

  /**
   * Floor of the delay after which an emitted request with no native answer is
   * rejected; raised to the SDK bid timeout plus a margin when the SDK reports
   * it (see `getQueueStats().noResponseMs`).
   */
  static readonly NO_RESPONSE_MS = BID_REQUEST_NO_RESPONSE_MS;

  /**
   * In order for SKAdNetwork to work, pass the app event.
   */
  static skadnHelper(name: string, info?: string) {
    if (typeof name !== 'string') {
      throw new Error("AdLoader.skadnHelper(*) 'name' expected a string value");
    }
    if (info && typeof info !== 'string') {
      throw new Error("AdLoader.skadnHelper(*) 'info' expected a string value");
    }
    if (Platform.OS !== 'ios') {
      return;
    }
    return AdLoader._nativeModule.skadnHelper(name, info);
  }
}
