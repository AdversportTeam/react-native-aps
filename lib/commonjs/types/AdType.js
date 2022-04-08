"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdType = void 0;
exports.isAdType = isAdType;

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const AdType = {
  BANNER: 'banner',
  INTERSTITIAL: 'interstitial'
};
exports.AdType = AdType;

function isAdType(value) {
  return Object.values(AdType).includes(value);
}
//# sourceMappingURL=AdType.js.map