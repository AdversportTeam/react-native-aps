import { AdError } from './AdError';
import RNAPSAdLoaderModule from './internal/AdLoaderModule';
import {
  AdLoaderOptions,
  validateAdLoaderOptions,
} from './types/AdLoaderOptions';

export class AdLoader {
  protected static _nativeModule = RNAPSAdLoaderModule;

  static async loadAd(adLoaderOptions: AdLoaderOptions) {
    try {
      validateAdLoaderOptions(adLoaderOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`AdLoader.loadAd(*) ${e.message}`);
      }
    }

    try {
      const keyValuePairs = await AdLoader._nativeModule.loadAd(
        adLoaderOptions
      );
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
