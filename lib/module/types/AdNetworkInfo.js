/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { isAdNetwork } from './AdNetwork';
/**
 * @public
 */

/**
 * @internal
 */
export function validateAdNetworkInfo(adNetworkInfo) {
  if (typeof adNetworkInfo !== 'object') {
    throw new Error("'adNetworkInfo' expected an object value");
  }

  if (!isAdNetwork(adNetworkInfo.adNetwork)) {
    throw new Error("'adNetworkInfo.adNetwork' expected one of AdNetwork values");
  }

  if (adNetworkInfo.adNetworkProperties && typeof adNetworkInfo.adNetworkProperties !== 'object') {
    throw new Error("'adNetworkInfo.adNetworkProperties' expected an object value");
  }
}
//# sourceMappingURL=AdNetworkInfo.js.map