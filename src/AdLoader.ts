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

import { Platform } from 'react-native';
import { AdError } from './AdError';
import RNAPSAdLoaderModule from './internal/AdLoaderModule';
import {
  AdLoaderOptions,
  validateAdLoaderOptions,
} from './types/AdLoaderOptions';

/**
 * @public
 */
export class AdLoader {
  private static _nativeModule = RNAPSAdLoaderModule;

  /**
   * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
   * @param adLoaderOptions - `AdLoaderOptions` object used to configure the bid request.
   * @returns Key value pairs of returned bid response.
   *
   * @public
   */
  static async loadAd(
    adLoaderOptions: AdLoaderOptions
  ): Promise<{ [key: string]: string }> {
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

  /**
   * In order for SKAdNetwork to work, pass the app event.
   * @param name - The name of the event.
   * @param info - The data/info with the event.
   *
   * @public
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
