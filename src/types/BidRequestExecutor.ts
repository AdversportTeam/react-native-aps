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

/**
 * Options accepted by `APSAds.initialize`.
 */
export interface APSAdsInitOptions {
  /**
   * Android only. Number of bid requests the APS SDK may process at the same time.
   *
   * The Android SDK runs every bid request, blocking HTTP call included, on a single
   * thread: concurrent `loadAd()` calls are answered one after another, in call order,
   * and a slot can miss its render deadline while it waits behind off-screen ones. A
   * value above 1 widens the SDK executor to that many threads before anything is
   * queued. On any failure the SDK default is kept and
   * `APSAds.getBidRequestExecutorStatus()` says why.
   *
   * Ignored on iOS, whose SDK does not serialise requests. Integer between 1 and 16.
   * Default: 1, the SDK behaviour.
   */
  bidRequestConcurrency?: number;
}

/**
 * What `APSAds.getBidRequestExecutorStatus` resolves with.
 */
export interface BidRequestExecutorStatus {
  /**
   * Bid requests the native SDK processes concurrently. Android: 1, or the
   * `bidRequestConcurrency` passed to `initialize` once widened. iOS: `Infinity`,
   * requests go through NSURLSession and are not serialised.
   */
  concurrency: number;
  /** Android: true once the SDK executor has been widened. Always false on iOS. */
  widened: boolean;
  /** Android: why the executor is not widened (not requested, reflection error...). */
  detail?: string;
}

export const MAX_BID_REQUEST_CONCURRENCY = 16;

/**
 * @internal
 */
export function validateInitOptions(options: unknown): APSAdsInitOptions {
  if (options === undefined) {
    return {};
  }
  if (
    typeof options !== 'object' ||
    options === null ||
    Array.isArray(options)
  ) {
    throw new Error("'options' expected an object value");
  }
  const { bidRequestConcurrency } = options as APSAdsInitOptions;
  if (bidRequestConcurrency !== undefined) {
    if (
      !Number.isInteger(bidRequestConcurrency) ||
      bidRequestConcurrency < 1 ||
      bidRequestConcurrency > MAX_BID_REQUEST_CONCURRENCY
    ) {
      throw new Error(
        `'options.bidRequestConcurrency' expected an integer between 1 and ${MAX_BID_REQUEST_CONCURRENCY}`
      );
    }
  }
  return options as APSAdsInitOptions;
}

/**
 * @internal Maps the native payload (`concurrency` below 1 means "not bounded", the
 * iOS answer) to the public shape.
 */
export function toBidRequestExecutorStatus(
  status: unknown
): BidRequestExecutorStatus {
  const raw = status as
    | { concurrency?: unknown; widened?: unknown; detail?: unknown }
    | null
    | undefined;
  if (!raw || typeof raw.concurrency !== 'number') {
    return {
      concurrency: 1,
      widened: false,
      detail: 'no status from the native module',
    };
  }
  return {
    concurrency:
      raw.concurrency >= 1 ? raw.concurrency : Number.POSITIVE_INFINITY,
    widened: raw.widened === true,
    ...(typeof raw.detail === 'string' && raw.detail
      ? { detail: raw.detail }
      : {}),
  };
}
