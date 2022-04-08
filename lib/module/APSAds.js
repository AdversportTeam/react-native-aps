function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import AdsModule from './internal/AdsModule';
import { validateAdNetworkInfo } from './types/AdNetworkInfo';
import { isMRAIDPolicy } from './types/MRAIDPolicy';
export class APSAds {
  static initialize(appKey) {
    if (typeof appKey !== 'string') {
      throw new Error("APSAds.initialze(*) 'appKey' expected a string value");
    }

    return this._nativeModule.initialize(appKey);
  }

  static setAdNetworkInfo(adNetworkInfo) {
    try {
      validateAdNetworkInfo(adNetworkInfo);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`APSAds.setAdNetworkInfo(*) ${e.message}`);
      }
    }

    return this._nativeModule.setAdNetworkInfo(adNetworkInfo);
  }

  static setMRAIDSupportedVersions(versions) {
    if (!Array.isArray(versions) || !versions.every(v => typeof v === 'string')) {
      throw new Error("APSAds.setMRAIDSupportedVersions(*) 'versions' expected an array of string values");
    }

    return this._nativeModule.setMRAIDSupportedVersions(versions);
  }

  static setMRAIDPolicy(policy) {
    if (!isMRAIDPolicy(policy)) {
      throw new Error("APSAds.setMRAIDPolicy(*) 'policy' expected one of MRAIDPolicy values");
    }

    return this._nativeModule.setMRAIDPolicy(policy);
  }

  static setTestMode(enabled) {
    if (typeof enabled !== 'boolean') {
      throw new Error("APSAds.setTestMode(*) 'enabled' expected a boolean value");
    }

    return this._nativeModule.setTestMode(enabled);
  }

  static setUseGeoLocation(enabled) {
    if (typeof enabled !== 'boolean') {
      throw new Error("APSAds.setUseGeoLocation(*) 'enabled' expected a boolean value");
    }

    return this._nativeModule.setUseGeoLocation(enabled);
  }

  static addCustomAttribute(key, value) {
    if (typeof key !== 'string') {
      throw new Error("APSAds.addCustomAttribute(*) 'key' expected a string value");
    }

    if (typeof value !== 'string') {
      throw new Error("APSAds.addCustomAttribute(_, *) 'value' expected a string value");
    }

    return this._nativeModule.addCustomAttribute(key, value);
  }

  static removeCustomAttribute(key) {
    if (typeof key !== 'string') {
      throw new Error("APSAds.removeCustomAttribute(*) 'key' expected a string value");
    }

    return this._nativeModule.removeCustomAttribute(key);
  }

}

_defineProperty(APSAds, "_nativeModule", AdsModule);
//# sourceMappingURL=APSAds.js.map