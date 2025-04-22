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

@objc(RNAPSAdLoaderModule)
class RNAPSAdLoaderModule: RCTEventEmitter {
  static let AD_TYPE_BANNER = "banner"
  static let AD_TYPE_INTERSTITIAL = "interstitial"
  static let EVENT_SUCCESS = "onSuccess"
  static let EVENT_FAILURE = "onFailure"
  static let ERROR_DOMAIN = "RNAPS"
  var adLoaders = Dictionary<NSNumber, DTBAdLoader>()
  var hasListeners = false;

  //MARK: - Native Module Setup

  deinit {
    invalidate()
  }

  @objc static override func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc override func invalidate() {
    super.invalidate()
    for adLoader in adLoaders.values {
      adLoader.stop()
    }
    adLoaders.removeAll()
  }

  @objc override func startObserving() {
    hasListeners = true;
  }

  @objc override func stopObserving() {
    hasListeners = false;
  }

  // Using '!' for compatibility if superclass requires it, otherwise [String] is fine
  @objc override func supportedEvents() -> [String]! {
    return [
      RNAPSAdLoaderModule.EVENT_SUCCESS,
      RNAPSAdLoaderModule.EVENT_FAILURE
    ]
  }

  private func sendEvent(name: String, body: Any) {
    if (hasListeners) {
      sendEvent(withName: name, body: body)
    }
  }

  //MARK: - AdLoadCallback impl

  // NOTE: Kept original AdLoadCallback without NSObject inheritance or weak ref based on "minimal" request
  private class AdLoadCallback: DTBAdCallback {
    let adLoaderModule: RNAPSAdLoaderModule
    let loaderId: NSNumber
    var resolve: RCTPromiseResolveBlock?
    var reject: RCTPromiseRejectBlock?
    init(adLoaderModule: RNAPSAdLoaderModule, loaderId: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      self.adLoaderModule = adLoaderModule
      self.loaderId = loaderId
      self.resolve = resolve
      self.reject = reject
    }
    func onSuccess(_ adResponse: DTBAdResponse!) {
      // Using original optional handling which defaults to empty Dict if nil
      let response = adResponse.customTargeting() ?? [:]
      adLoaderModule.sendEvent(name: RNAPSAdLoaderModule.EVENT_SUCCESS, body: [
        "loaderId": loaderId,
        "response": response
      ])
      if let resolve = resolve {
        resolve(response)
        self.resolve = nil
        self.reject = nil
      }
    }

    func onFailure(_ error: DTBAdError) {
      var code = ""
      // Using original switch without @unknown default
      switch error {
      case NETWORK_ERROR:
        code = "network_error"
        break; // Keep original breaks
      case NETWORK_TIMEOUT:
        code = "network_timeout"
        break;
      case NO_FILL:
        code = "no_fill"
        break;
      case INTERNAL_ERROR:
        code = "internal_error"
        break;
      case REQUEST_ERROR:
        code = "request_error"
        break;
      default: // Use simple default to ensure exhaustiveness
        code = "unknown"
      }
      let message = String(format: "Failed to load APS ad with code: %@", code)
      var userInfo = Dictionary<String, String>()
      userInfo["code"] = code
      userInfo["message"] = message
      adLoaderModule.sendEvent(name: RNAPSAdLoaderModule.EVENT_FAILURE, body: [
        "loaderId": loaderId,
        "userInfo": userInfo
      ])
      if let reject = reject {
        // Using original Int conversion and error code
        let nsError = NSError.init(domain: RNAPSAdLoaderModule.ERROR_DOMAIN, code: Int(error.rawValue), userInfo: userInfo)
        reject(code, message, nsError)
        self.resolve = nil
        self.reject = nil
      }
    }
  }

  //MARK: - Native Methods

  @objc(loadAd:forAdType:withOptions:withResolver:withRejecter:)
  func loadAd(loaderId: NSNumber, adType: String, options: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    stopAutoRefresh(loaderId: loaderId)

    // --- MINIMAL PATCH START ---

    // 1. Extract options needed for size/loader (moved before loader init)
    // WARNING: Using original unsafe force-unwrapping as requested! Could crash!
    let slotUUID = options["slotUUID"] as! String
    let size = options["size"] as? String // Keep optional for interstitial case

    // 2. Create AdNetworkInfo (using OTHER as placeholder)
    // NOTE: Ensure DTBADNETWORK_OTHER is defined/imported. Change if needed.
    let adNetworkInfo = DTBAdNetworkInfo(networkName: DTBADNETWORK_OTHER)

    // 3. Initialize AdLoader correctly
    let adLoader = DTBAdLoader(adNetworkInfo: adNetworkInfo)

    // --- MINIMAL PATCH END ---


    // --- Original logic continues below (using original unsafe unwraps!) ---
    let adSize: DTBAdSize
    switch adType {
    case RNAPSAdLoaderModule.AD_TYPE_BANNER:
      // WARNING: Original unsafe unwraps! Could crash!
      let values = size!.split(separator: "x")
      let width = Int(values[0])!
      let height = Int(values[1])!
      adSize = DTBAdSize(bannerAdSizeWithWidth: width, height: height, andSlotUUID: slotUUID)
      break
    case RNAPSAdLoaderModule.AD_TYPE_INTERSTITIAL:
      adSize = DTBAdSize(interstitialAdSizeWithSlotUUID: slotUUID)
      break
    default:
      // Original code just returned, no error reject
      return
    }
    adLoader.setAdSizes([adSize])

    if let customTargeting = options["customTargeting"] as? Dictionary<String, String> {
      // Original loop syntax
      for (key, value) in (customTargeting) {
        adLoader.putCustomTarget(value, withKey: key)
      }
    }

    let autoRefresh = options["autoRefresh"] as? Bool ?? false

    let refreshInterval = options["refreshInterval"] as? Int32 ?? 60

    if (autoRefresh) {
      adLoader.setAutoRefresh(refreshInterval)
      adLoaders.updateValue(adLoader, forKey: loaderId)
    }

    adLoader.loadAd(AdLoadCallback(adLoaderModule: self, loaderId: loaderId, resolve: resolve, reject: reject))
  }

  @objc(stopAutoRefresh:)
  func stopAutoRefresh(loaderId: NSNumber) {
    // Original optional chaining is fine
    adLoaders[loaderId]?.stop()
    adLoaders.removeValue(forKey: loaderId)
  }

  @objc(skadnHelper:withInfo:)
  func skadnHelper(name: String, info: String) {
    DTBAdHelper.skadnHelper(name, withInfo: info)
  }
}
