/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import AdsModule from './internal/AdsModule';
import {
  type AdNetworkInfo,
  validateAdNetworkInfo,
} from './types/AdNetworkInfo';
import { isMRAIDPolicy, MRAIDPolicy } from './types/MRAIDPolicy';

export class APSAds {
  private static _nativeModule = AdsModule;

  /**
   * Initializes the APSAds SDK.
   */
  static initialize(appKey: string): Promise<void> {
    if (typeof appKey !== 'string') {
      throw new Error("APSAds.initialze(*) 'appKey' expected a string value");
    }
    return this._nativeModule.initialize(appKey);
  }

  /**
   * Sets the primary ad server or mediator.
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
