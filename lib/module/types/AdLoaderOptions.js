/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AdType, isAdType } from './AdType';
/**
 * @public
 */

const sizeRegex = /([0-9]+)x([0-9]+)/;
/**
 * @internal
 */

export function validateAdLoaderOptions(adLoaderOptions) {
  if (typeof adLoaderOptions !== 'object') {
    throw new Error("'adLoaderOptions' expected an object value");
  }

  if (typeof adLoaderOptions.slotUUID !== 'string') {
    throw new Error("'adLoaderOptions.slotUUID' expected a string value");
  }

  if (!isAdType(adLoaderOptions.type)) {
    throw new Error("'adLoaderOptions.type' expected one of AdType values");
  }

  if (adLoaderOptions.type === AdType.BANNER && (!adLoaderOptions.size || !sizeRegex.test(adLoaderOptions.size))) {
    throw new Error("'adLoaderOptions.size' expected a valid size string.");
  }
}
//# sourceMappingURL=AdLoaderOptions.js.map