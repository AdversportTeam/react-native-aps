/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { type NativeModule, NativeModules, Platform } from 'react-native';

import type { Spec } from '../turbomodules/NativeRNAPSAdsModule';

const { RNAPSAdsModule } = NativeModules;

const LINKING_ERROR =
  `The package 'react-native-aps' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

if (RNAPSAdsModule == null) {
  console.error(LINKING_ERROR);
}

export default RNAPSAdsModule as Spec & NativeModule;
