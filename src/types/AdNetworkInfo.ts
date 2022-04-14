/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AdNetwork, isAdNetwork } from './AdNetwork';

export interface AdNetworkInfo {
  /**
   * The name of the primary ad server or mediator
   */
  adNetwork: AdNetwork;
  adNetworkProperties?: { [key: string]: string };
}

export function validateAdNetworkInfo(adNetworkInfo: AdNetworkInfo) {
  if (typeof adNetworkInfo !== 'object') {
    throw new Error("'adNetworkInfo' expected an object value");
  }
  if (!isAdNetwork(adNetworkInfo.adNetwork)) {
    throw new Error(
      "'adNetworkInfo.adNetwork' expected one of AdNetwork values"
    );
  }
  if (
    adNetworkInfo.adNetworkProperties &&
    typeof adNetworkInfo.adNetworkProperties !== 'object'
  ) {
    throw new Error(
      "'adNetworkInfo.adNetworkProperties' expected an object value"
    );
  }
}
