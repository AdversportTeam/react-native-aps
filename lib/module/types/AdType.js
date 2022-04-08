/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const AdType = {
  BANNER: 'banner',
  INTERSTITIAL: 'interstitial'
};
export function isAdType(value) {
  return Object.values(AdType).includes(value);
}
//# sourceMappingURL=AdType.js.map