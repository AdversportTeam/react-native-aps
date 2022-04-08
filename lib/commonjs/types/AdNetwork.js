"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdNetwork = void 0;
exports.isAdNetwork = isAdNetwork;

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const AdNetwork = {
  GOOGLE_AD_MANAGER: 'GOOGLE_AD_MANAGER',
  ADMOB: 'ADMOB',
  AD_GENERATION: 'AD_GENERATION',
  IRON_SOURCE: 'IRON_SOURCE',
  MAX: 'MAX',
  NIMBUS: 'NIMBUS',
  OTHER: 'OTHER'
};
exports.AdNetwork = AdNetwork;

function isAdNetwork(value) {
  return Object.values(AdNetwork).includes(value);
}
//# sourceMappingURL=AdNetwork.js.map