/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is not in use until the TurboModule becomes stable and support typescript officially.
 */

import { TurboModule, TurboModuleRegistry } from 'react-native';

import type { AdNetworkInfo, MRAIDPolicy } from '../types';

export interface AdsModuleSpec extends TurboModule {
  initialize: (appKey: string) => Promise<void>;

  setAdNetworkInfo: (adNetworkInfo: AdNetworkInfo) => void;

  setMRAIDSupportedVersions: (supportedVersions: string[]) => void;

  setMRAIDPolicy: (policy: MRAIDPolicy) => void;

  setTestMode: (enabled: boolean) => void;

  setUseGeoLocation: (enabled: boolean) => void;

  addCustomAttribute: (key: string, value: string) => void;

  removeCustomAttribute: (key: string) => void;
}

export default TurboModuleRegistry.get<AdsModuleSpec>('RNAPSAdsModule');
