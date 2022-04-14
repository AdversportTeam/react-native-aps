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

import { AdError } from './AdError';
import RNAPSAdLoaderModule from './internal/AdLoaderModule';
import {
  AdLoaderOptions,
  validateAdLoaderOptions,
} from './types/AdLoaderOptions';

export class AdLoader {
  protected static _nativeModule = RNAPSAdLoaderModule;

  /**
   * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
   * @param adLoaderOptions `AdLoaderOptions` object used to configure the bid request.
   * @returns Key value pairs of returned bid response.
   */
  static async loadAd(adLoaderOptions: AdLoaderOptions) {
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
      if ((error as any).userInfo) {
        throw AdError.fromNativeError(error);
      } else {
        throw error;
      }
    }
  }
}
