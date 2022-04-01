import { Platform } from 'react-native';
import NativeAPSModule from './turbomodules/NativeAPSModule';

const LINKING_ERROR =
  `The package 'react-native-aps' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ApsModule =
  NativeAPSModule ||
  (new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  ) as unknown);

export default ApsModule;
