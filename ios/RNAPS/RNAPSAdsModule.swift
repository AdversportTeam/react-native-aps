/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DTBiOSSDK
import Foundation

@objc(RNAPSAdsModule)
class RNAPSAdsModule: NSObject {
  
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
    case "IRON_SOURCE":
      networkName = DTBADNETWORK_IRON_SOURCE
      break;
    case "MAX":
      networkName = DTBADNETWORK_MAX
      break;
    case "NIMBUS":
      networkName = DTBADNETWORK_NIMBUS
      break;
    default:
      networkName = DTBADNETWORK_OTHER
    }
    let adNetworkInfo = DTBAdNetworkInfo(networkName: networkName)
    if let adNetworkProperties = adNetworkInfoDic["adNetworkProperties"] as? Dictionary<String, String> {
      for (key, value) in (adNetworkProperties) {
        adNetworkInfo.setAdNetworkProperties(key, adNetworkValue: value)
      }
    }
    DTBAds.sharedInstance().setAdNetworkInfo(adNetworkInfo)
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
    case "AUTO_DETECT":
      mraidPolicy = AUTO_DETECT_MRAID
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
