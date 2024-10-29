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
