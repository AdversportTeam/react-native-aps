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
  AdLoaderOptions,
  BannerAdLoaderOptions,
  validateAdLoaderOptions,
  validateBannerAdLoaderOptions,
} from './types/AdLoaderOptions';
import { AdType } from './types/AdType';

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
   */
  async loadAd() {
    try {
      return await AdLoader._nativeModule.loadAd(
        this.loaderId,
        this.adType,
        this.adLoaderOptions
      );
    } catch (error) {
      if ((error as any).userInfo) {
        throw AdError.fromNativeError(error);
      } else {
        throw error;
      }
    }
  }

  /**
   * Stop the auto refresh of the ad.
   *
   */
  stopAutoRefresh() {
    AdLoader._nativeModule.stopAutoRefresh(this.loaderId);
  }

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
