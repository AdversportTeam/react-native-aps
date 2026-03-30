/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import DTBiOSSDK
import Foundation

@objc(RNAPSAdsModule)
class RNAPSAdsModule: NSObject {

  static var cachedAdNetworkInfo: DTBAdNetworkInfo?

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc(initialize:withResolver:withRejecter:)
  func initialize(appKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    DTBAds.sharedInstance().setAppKey(appKey)
    resolve(nil)
  }

  @objc(setAdNetworkInfo:)
  func setAdNetworkInfo(adNetworkInfoDic: Dictionary<String, Any>) -> Void {
    guard let adNetworkString = adNetworkInfoDic["adNetwork"] as? String else {
      return
    }
    var networkName: DTBAdNetwork
    switch adNetworkString {
    case "GOOGLE_AD_MANAGER":
      networkName = DTBADNETWORK_GOOGLE_AD_MANAGER
      break;
    case "ADMOB":
      networkName = DTBADNETWORK_ADMOB
      break;
    case "AD_GENERATION":
      networkName = DTBADNETWORK_AD_GENERATION
      break;
    case "IRON_SOURCE", "UNITY_LEVELPLAY":
      networkName = DTBADNETWORK_UNITY_LEVELPLAY
    case "UNKNOWN":
      networkName = DTBADNETWORK_OTHER
    case "CUSTOM_MEDIATION":
      networkName = DTBADNETWORK_OTHER
    case "MAX":
      networkName = DTBADNETWORK_MAX
    case "NIMBUS":
      networkName = DTBADNETWORK_NIMBUS
    default:
      networkName = DTBADNETWORK_OTHER
    }
    let adNetworkInfo = DTBAdNetworkInfo(networkName: networkName)
    if let adNetworkProperties = adNetworkInfoDic["adNetworkProperties"] as? Dictionary<String, String> {
      for (key, value) in (adNetworkProperties) {
        adNetworkInfo.setAdNetworkProperties(key, adNetworkValue: value)
      }
    }
    RNAPSAdsModule.cachedAdNetworkInfo = adNetworkInfo
  }

  @objc(setMRAIDSupportedVersions:)
  func setMRAIDSupportedVersions(versions: Array<String>) -> Void {
    DTBAds.sharedInstance().mraidCustomVersions = versions
  }

  @objc(setMRAIDPolicy:)
  func setMRAIDPolicy(policy: String) -> Void {
    var mraidPolicy: DTBMRAIDPolicy
    switch (policy) {
    case "NONE":
      mraidPolicy = NONE_MRAID
      break;
    case "DFP":
      mraidPolicy = DFP_MRAID
      break;
    default:
      mraidPolicy = CUSTOM_MRAID
    }
    DTBAds.sharedInstance().mraidPolicy = mraidPolicy
  }

  @objc(setTestMode:)
  func setTestMode(enabled: Bool) -> Void {
    DTBAds.sharedInstance().testMode = enabled
  }

  @objc(setUseGeoLocation:)
  func setUseGeoLocation(enabled: Bool) -> Void {
    DTBAds.sharedInstance().useGeoLocation = enabled
  }

  @objc(addCustomAttribute:value:)
  func addCustomAttribute(key: String, value: String) {
    DTBAds.sharedInstance().addCustomAttribute(key, value: value)
  }

  @objc(removeCustomAttribute:)
  func removeCustomAttribute(key: String) {
    DTBAds.sharedInstance().removeCustomAttribute(key)
  }

}
