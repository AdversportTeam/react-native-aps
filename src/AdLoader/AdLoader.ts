import { AdError } from '../AdError';
import type { AdLoaderOptions } from './AdLoaderOptions';
import RNAPSAdLoaderModule from './RNAPSAdLoaderModule';

export class AdLoader {
  protected static _nativeModule = RNAPSAdLoaderModule;

  static async loadAd(options: AdLoaderOptions) {
    try {
      const keyValuePairs = await AdLoader._nativeModule.loadAd(options);
      return keyValuePairs;
    } catch (error) {
      if ((error as any).userInfo) {
        throw AdError.fromNativeError(error);
      } else {
        throw error;
      }
    }
  }
}
