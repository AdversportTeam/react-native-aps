/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is not in use until the TurboModule becomes stable and support typescript officially.
 */

import { TurboModule, TurboModuleRegistry } from 'react-native';

import type { AdLoaderOptions } from '../types';

/**
 * @internal
 */
export interface AdLoaderModuleSpec extends TurboModule {
  loadAd: (options: AdLoaderOptions) => Promise<{ [key: string]: string }>;
  skadnHelper: (name: string, info: string) => void;
}

export default TurboModuleRegistry.get<AdLoaderModuleSpec>(
  'RNAPSAdLoaderModule'
);
