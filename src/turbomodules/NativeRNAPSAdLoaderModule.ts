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

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export enum AdType {
  BANNER = 'banner',
  INTERSTITIAL = 'interstitial',
}

export interface AdLoaderOptions {
  /**
   * The slotUUID of the ad slot.
   */
  slotUUID: string;
  /**
   * The optional custom targeting key value pairs for the bid request.
   */
  customTargeting?: { [key: string]: string };
}

export interface BannerAdLoaderOptions extends AdLoaderOptions {
  /**
   * The size of the banner ad slot. Required for banner ad slots.
   */
  size: string;

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
    adType: AdType,
    options: AdLoaderOptions | BannerAdLoaderOptions
  ) => void;

  stopAutoRefresh: (loaderId: number) => void;

  skadnHelper: (name: string, info?: string) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNAPSAdLoaderModule');
