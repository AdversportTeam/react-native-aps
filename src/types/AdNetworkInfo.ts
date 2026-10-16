/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
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
