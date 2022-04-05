import { AdError } from './AdError';
import RNAPSAdLoaderModule from './internal/AdLoaderModule';
import type { AdLoaderOptions } from './types';

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
