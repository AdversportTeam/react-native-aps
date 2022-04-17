/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AdsModule from './internal/AdsModule';
import { AdNetworkInfo, validateAdNetworkInfo } from './types/AdNetworkInfo';
import { isMRAIDPolicy, MRAIDPolicy } from './types/MRAIDPolicy';

/**
 * @public
 */
export class APSAds {
  private static _nativeModule = AdsModule;

  /**
   * Initializes the APSAds SDK.
   * @param appKey - Generated APS app key from the APS portal
   *
   * @public
   */
  static initialize(appKey: string): Promise<void> {
    if (typeof appKey !== 'string') {
      throw new Error("APSAds.initialze(*) 'appKey' expected a string value");
    }
    return this._nativeModule.initialize(appKey);
  }

  /**
   * Sets the primary ad server or mediator.
   * @param adNetworkInfo - `AdNetworkInfo` object containing the primary ad network and its properties
   *
   * @public
   */
  static setAdNetworkInfo(adNetworkInfo: AdNetworkInfo): void {
    try {
      validateAdNetworkInfo(adNetworkInfo);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`APSAds.setAdNetworkInfo(*) ${e.message}`);
      }
    }
    return this._nativeModule.setAdNetworkInfo(adNetworkInfo);
  }

  /**
   * Sets the MRAID versions supported by user ad server.
   * @param versions - Array of supported versions
   *
   * @public
   */
  static setMRAIDSupportedVersions(versions: string[]): void {
    if (
      !Array.isArray(versions) ||
      !versions.every((v) => typeof v === 'string')
    ) {
      throw new Error(
        "APSAds.setMRAIDSupportedVersions(*) 'versions' expected an array of string values"
      );
    }
    return this._nativeModule.setMRAIDSupportedVersions(versions);
  }

  /**
   * Sets the MRAID policy.
   * @param policy - MRAIDPolicy value. `MRAIDPolicy.DFP` for Google Ad Manager and `MRAIDPolicy.CUSTOM` for other ad server / mediation.
   *
   * @public
   */
  static setMRAIDPolicy(policy: MRAIDPolicy): void {
    if (!isMRAIDPolicy(policy)) {
      throw new Error(
        "APSAds.setMRAIDPolicy(*) 'policy' expected one of MRAIDPolicy values"
      );
    }
    return this._nativeModule.setMRAIDPolicy(policy);
  }

  /**
   * Enable / disable the test mode for APSAds.
   * @param enabled - Whether to enable or disable the test mode.
   *
   * @public
   */
  static setTestMode(enabled: boolean): void {
    if (typeof enabled !== 'boolean') {
      throw new Error(
        "APSAds.setTestMode(*) 'enabled' expected a boolean value"
      );
    }
    return this._nativeModule.setTestMode(enabled);
  }

  /**
   * Enable / disable the geo location tracking for APSAds.
   * @param enabled - Whether to enable or disable the geo location tracking.
   *
   * @public
   */
  static setUseGeoLocation(enabled: boolean): void {
    if (typeof enabled !== 'boolean') {
      throw new Error(
        "APSAds.setUseGeoLocation(*) 'enabled' expected a boolean value"
      );
    }
    return this._nativeModule.setUseGeoLocation(enabled);
  }

  /**
   * Adds a custom attribute to the APSAds SDK.
   * @param key - The key of the custom attribute
   * @param value - The value of the custom attribute
   *
   * @public
   */
  static addCustomAttribute(key: string, value: string): void {
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

  /**
   * Removes a custom attribute from the APSAds SDK.
   * @param key - The key of the custom attribute
   *
   * @public
   */
  static removeCustomAttribute(key: string): void {
    if (typeof key !== 'string') {
      throw new Error(
        "APSAds.removeCustomAttribute(*) 'key' expected a string value"
      );
    }
    return this._nativeModule.removeCustomAttribute(key);
  }
}
