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

import { AdType, isAdType } from './AdType';

/**
 * @public
 */
export interface AdLoaderOptions {
  /**
   * The slotUUID of the ad slot.
   */
  slotUUID: string;
  /**
   * The ad type of the ad slot. One of `AdType.BANNER`, `AdType.INTERSTITIAL`.
   */
  type: AdType;
  /**
   * The size of the banner ad slot. Required for banner ad slots.
   */
  size?: string;
  /**
   * The optional custom targeting key value pairs for the bid request.
   */
  customTargeting?: { [key: string]: string };
}

const sizeRegex = /([0-9]+)x([0-9]+)/;

/**
 * @internal
 */
export function validateAdLoaderOptions(adLoaderOptions: AdLoaderOptions) {
  if (typeof adLoaderOptions !== 'object') {
    throw new Error("'adLoaderOptions' expected an object value");
  }
  if (typeof adLoaderOptions.slotUUID !== 'string') {
    throw new Error("'adLoaderOptions.slotUUID' expected a string value");
  }
  if (!isAdType(adLoaderOptions.type)) {
    throw new Error("'adLoaderOptions.type' expected one of AdType values");
  }
  if (
    adLoaderOptions.type === AdType.BANNER &&
    (!adLoaderOptions.size || !sizeRegex.test(adLoaderOptions.size))
  ) {
    throw new Error("'adLoaderOptions.size' expected a valid size string.");
  }
}
