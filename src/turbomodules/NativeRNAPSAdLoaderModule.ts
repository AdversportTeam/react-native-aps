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

import type { AdLoaderOptions, BannerAdLoaderOptions } from '../types';

export interface Spec extends TurboModule {
  loadAd: (
    loaderId: number,
    adType: string,
    options: AdLoaderOptions | BannerAdLoaderOptions
  ) => Promise<{ [key: string]: string }>;

  stopAutoRefresh: (loaderId: number) => void;

  skadnHelper: (name: string, info?: string) => void;
}

export default TurboModuleRegistry.get<Spec>('RNAPSAdLoaderModule');
