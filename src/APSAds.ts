import AdsModule from './internal/AdsModule';
import type { AdNetworkInfo } from './types';

export default class APSAds {
  protected static _nativeModule = AdsModule;

  static initialize(appKey: string) {
    return this._nativeModule.initialize(appKey);
  }

  static setAdNetworkInfo(adNetworkInfo: AdNetworkInfo) {
    return this._nativeModule.setAdNetworkInfo(adNetworkInfo);
  }

  static setTestMode(enabled: boolean) {
    return this._nativeModule.setTestMode(enabled);
  }

  static setUseGeoLocation(enabled: boolean) {
    return this._nativeModule.setUseGeoLocation(enabled);
  }

  static addCustomAttribute(key: string, value: string) {
    return this._nativeModule.addCustomAttribute(key, value);
  }

  static removeCustomAttribute(key: string) {
    return this._nativeModule.removeCustomAttribute(key);
  }
}
