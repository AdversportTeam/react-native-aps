import { AdError } from '../AdError';
import type { AdLoaderInterface } from './AdLoader.interface';
import type { AdLoaderOptions } from './AdLoaderOptions';
import RNAPSAdLoaderModule from './RNAPSAdLoaderModule';

export class AdLoader implements AdLoaderInterface {
  protected static _nativeModule = RNAPSAdLoaderModule;

  async loadAd(options: AdLoaderOptions) {
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
