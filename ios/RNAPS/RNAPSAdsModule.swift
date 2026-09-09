/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This file is part of react-native-aps.
 *
 * react-native-aps is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * react-native-aps is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Foobar. If not, see <https://www.gnu.org/licenses/>.
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

  // The setters below still go through the deprecated DTBAds singleton on purpose.
  //
  // Their replacements are not setters at all: APS 5.6.4 moved testMode, useGeolocation,
  // mraidPolicy and mraidSupportedVersions onto APSInitConfig, an object handed once to
  // +[APS initializeWithAppKey:config:completion:]. Adopting them means reshaping this
  // bridge's contract — JS calls initialize() first and these setters afterwards, which
  // the config model cannot express — so it belongs in its own change, not here.
  //
  // Do not trust the deprecation text: it points at +[APS setTestMode:] and friends, which
  // are declared nowhere in APS.h (the selectors do exist in the binary). Read APSInitConfig.h.
  //
  // removeCustomAttribute has no replacement at all, on APS or on APSInitConfig.
  @objc(setUseGeoLocation:)
  func setUseGeoLocation(enabled: Bool) -> Void {
    DTBAds.sharedInstance().useGeoLocation = enabled
  }

  @objc(addCustomAttribute:value:)
  func addCustomAttribute(key: String, value: String) {
    APS.setCustomAttribute(value, forKey: key)
  }

  @objc(removeCustomAttribute:)
  func removeCustomAttribute(key: String) {
    DTBAds.sharedInstance().removeCustomAttribute(key)
  }

  // Third-party identifiers (ID5, LiveRamp...), forwarded by Amazon to the TAM/UAM bidders
  // the publisher has enabled. Set once per user session; call again when an id changes.
  // Passing an empty array clears them, which is what a consent withdrawal must do.
  @objc(setExternalUserIds:)
  func setExternalUserIds(externalUserIds: [[String: Any]]) {
    let ids: [APSExternalUserId] = externalUserIds.compactMap { entry in
      guard let source = entry["source"] as? String,
            let uids = entry["uids"] as? [[String: Any]], !uids.isEmpty else {
        return nil
      }
      let builder = APSExternalUserIdBuilder.builder()
      _ = builder.addSource(source)
      for uid in uids {
        guard let id = uid["id"] as? String else { continue }
        _ = builder.addUniqueId(id, atype: uid["atype"] as? NSNumber, ext: uid["ext"] as? [String: String])
      }
      return builder.build()
    }
    APS.setExternalUserIds(ids)
  }

}
