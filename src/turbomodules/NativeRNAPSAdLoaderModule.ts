/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

interface AdLoaderOptions {
  /**
   * The slotUUID of the ad slot.
   */
  slotUUID: string;
  /**
   * The optional custom targeting key value pairs for the bid request.
   */
  customTargeting?: { [key: string]: string };
}

interface BannerAdLoaderOptions extends AdLoaderOptions {
  /**
   * The size of the banner ad slot. Required for banner ad slots.
   */
  size?: string;

  /**
   * Whether the banner ad to be automatically refreshed. Defaults to `false`.
   */
  autoRefresh?: boolean;

  /**
   * The time interval in seconds between refreshes. Defaults to `60` seconds if autoRefresh enabled. The minimum auto-refresh time supported is `20` seconds.
   */
  refreshInterval?: number;
}

export interface Spec extends TurboModule {
  loadAd: (
    loaderId: number,
    adType: string,
    options: BannerAdLoaderOptions
  ) => Promise<{ [key: string]: string }>;

  stopAutoRefresh: (loaderId: number) => void;

  skadnHelper: (name: string, info?: string) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNAPSAdLoaderModule');
