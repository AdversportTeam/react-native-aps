import { NativeModules, Platform } from 'react-native';
import type { AdLoaderInterface } from './AdLoader.interface';

const { RNAPSAdLoaderModule } = NativeModules;

const LINKING_ERROR =
  `The package 'react-native-aps' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

if (RNAPSAdLoaderModule == null) {
  console.error(LINKING_ERROR);
}

export default RNAPSAdLoaderModule as AdLoaderInterface;
