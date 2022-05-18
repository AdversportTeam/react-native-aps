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

import { NativeModule, NativeModules, Platform } from 'react-native';

import type { AdLoaderModuleSpec } from '../turbomodules/NativeRNAPSAdLoaderModule';

const { RNAPSAdLoaderModule } = NativeModules;

const LINKING_ERROR =
  `The package 'react-native-aps' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

if (RNAPSAdLoaderModule == null) {
  console.error(LINKING_ERROR);
}

export default RNAPSAdLoaderModule as AdLoaderModuleSpec & NativeModule;
