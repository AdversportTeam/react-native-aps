import { NativeModules, Platform } from 'react-native';

import type { AdNetworkInfo } from '../types';

const { RNAPSAdsModule } = NativeModules;

const LINKING_ERROR =
  `The package 'react-native-aps' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

if (RNAPSAdsModule == null) {
  console.error(LINKING_ERROR);
}

export interface AdsModule {
  initialize: (appKey: string) => Promise<void>;

  setAdNetworkInfo: (adNetworkInfo: AdNetworkInfo) => void;

  setTestMode: (enabled: boolean) => void;

  setUseGeoLocation: (enabled: boolean) => void;

  addCustomAttribute: (key: string, value: string) => void;

  removeCustomAttribute: (key: string) => void;
}

export default RNAPSAdsModule as AdsModule;
