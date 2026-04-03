/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

interface AdNetworkInfo {
  /**
   * The name of the primary ad server or mediator
   */
  adNetwork: string;
  adNetworkProperties?: { [key: string]: string };
}

/**
 * @internal
 */
export interface Spec extends TurboModule {
  initialize: (appKey: string) => Promise<void>;

  setAdNetworkInfo: (adNetworkInfo: AdNetworkInfo) => void;

  setMRAIDSupportedVersions: (supportedVersions: string[]) => void;

  setMRAIDPolicy: (policy: string) => void;

  setTestMode: (enabled: boolean) => void;

  setUseGeoLocation: (enabled: boolean) => void;

  addCustomAttribute: (key: string, value: string) => void;

  removeCustomAttribute: (key: string) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNAPSAdsModule');
