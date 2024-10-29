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

import { TurboModule, TurboModuleRegistry } from 'react-native';

import type { MRAIDPolicy } from '../types';

type AdNetwork = {
  GOOGLE_AD_MANAGER: 'GOOGLE_AD_MANAGER',
  ADMOB: 'ADMOB',
  AD_GENERATION: 'AD_GENERATION',
  IRON_SOURCE: 'IRON_SOURCE',
  MAX: 'MAX',
  NIMBUS: 'NIMBUS',
  OTHER: 'OTHER',
};

interface AdNetworkInfo {
  /**
   * The name of the primary ad server or mediator
   */
  adNetwork: AdNetwork;
  adNetworkProperties?: { [key: string]: string };
}

/**
 * @internal
 */
export interface Spec extends TurboModule {
  initialize: (appKey: string) => Promise<void>;

  setAdNetworkInfo: (adNetworkInfo: AdNetworkInfo) => void;

  setMRAIDSupportedVersions: (supportedVersions: string[]) => void;

  setMRAIDPolicy: (policy: MRAIDPolicy) => void;

  setTestMode: (enabled: boolean) => void;

  setUseGeoLocation: (enabled: boolean) => void;

  addCustomAttribute: (key: string, value: string) => void;

  removeCustomAttribute: (key: string) => void;
}

export default TurboModuleRegistry.get<Spec>('RNAPSAdsModule');
