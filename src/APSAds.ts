/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AdsModule from './internal/AdsModule';
import { AdNetworkInfo, validateAdNetworkInfo } from './types/AdNetworkInfo';

export class APSAds {
  protected static _nativeModule = AdsModule;

  static initialize(appKey: string) {
    if (typeof appKey !== 'string') {
      throw new Error("APSAds.initialze(*) 'appKey' expected a string value");
    }
    return this._nativeModule.initialize(appKey);
  }

  static setAdNetworkInfo(adNetworkInfo: AdNetworkInfo) {
    try {
      validateAdNetworkInfo(adNetworkInfo);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`APSAds.setAdNetworkInfo(*) ${e.message}`);
      }
    }
    return this._nativeModule.setAdNetworkInfo(adNetworkInfo);
  }

  static setTestMode(enabled: boolean) {
    if (typeof enabled !== 'boolean') {
      throw new Error(
        "APSAds.setTestMode(*) 'enabled' expected a boolean value"
      );
    }
    return this._nativeModule.setTestMode(enabled);
  }

  static setUseGeoLocation(enabled: boolean) {
    if (typeof enabled !== 'boolean') {
      throw new Error(
        "APSAds.setUseGeoLocation(*) 'enabled' expected a boolean value"
      );
    }
    return this._nativeModule.setUseGeoLocation(enabled);
  }

  static addCustomAttribute(key: string, value: string) {
    if (typeof key !== 'string') {
      throw new Error(
        "APSAds.addCustomAttribute(*) 'key' expected a string value"
      );
    }
    if (typeof value !== 'string') {
      throw new Error(
        "APSAds.addCustomAttribute(_, *) 'value' expected a string value"
      );
    }
    return this._nativeModule.addCustomAttribute(key, value);
  }

  static removeCustomAttribute(key: string) {
    if (typeof key !== 'string') {
      throw new Error(
        "APSAds.removeCustomAttribute(*) 'key' expected a string value"
      );
    }
    return this._nativeModule.removeCustomAttribute(key);
  }
}
