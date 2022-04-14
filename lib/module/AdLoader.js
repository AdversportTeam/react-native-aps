function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AdError } from './AdError';
import RNAPSAdLoaderModule from './internal/AdLoaderModule';
import { validateAdLoaderOptions } from './types/AdLoaderOptions';
export class AdLoader {
  /**
   * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
   * @param adLoaderOptions `AdLoaderOptions` object used to configure the bid request.
   * @returns Key value pairs of returned bid response.
   */
  static async loadAd(adLoaderOptions) {
    try {
      validateAdLoaderOptions(adLoaderOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`AdLoader.loadAd(*) ${e.message}`);
      }
    }

    try {
      return await AdLoader._nativeModule.loadAd(adLoaderOptions);
    } catch (error) {
      if (error.userInfo) {
        throw AdError.fromNativeError(error);
      } else {
        throw error;
      }
    }
  }

}

_defineProperty(AdLoader, "_nativeModule", RNAPSAdLoaderModule);
//# sourceMappingURL=AdLoader.js.map