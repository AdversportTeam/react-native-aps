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
  
  @objc override func supportedEvents() -> [String] {
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
      let response = adResponse.customTargeting() ?? Dictionary()
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
      switch error {
      case NETWORK_ERROR:
        code = "network_error"
        break;
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
      default:
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
        let error = NSError.init(domain: RNAPSAdLoaderModule.ERROR_DOMAIN, code: 666, userInfo: userInfo)
        reject(code, message, error)
        self.resolve = nil
        self.reject = nil
      }
    }
  }
  
  //MARK: - Native Methods

  @objc(loadAd:forAdType:withOptions:withResolver:withRejecter:)
  func loadAd(loaderId: NSNumber, adType: String, options: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    stopAutoRefresh(loaderId: loaderId)
    
    let adLoader = DTBAdLoader()

    let slotUUID = options["slotUUID"] as! String
    let size = options["size"] as? String
    let adSize: DTBAdSize
    switch adType {
    case RNAPSAdLoaderModule.AD_TYPE_BANNER:
      let values = size!.split(separator: "x")
      let width = Int(values[0])!
      let height = Int(values[1])!
      adSize = DTBAdSize(bannerAdSizeWithWidth: width, height: height, andSlotUUID: slotUUID)
      break
    case RNAPSAdLoaderModule.AD_TYPE_INTERSTITIAL:
      adSize = DTBAdSize(interstitialAdSizeWithSlotUUID: slotUUID)
      break
    default:
      return
    }
    adLoader.setAdSizes([adSize])

    if let customTargeting = options["customTargeting"] as? Dictionary<String, String> {
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
    adLoaders[loaderId]?.stop()
    adLoaders.removeValue(forKey: loaderId)
  }

  @objc(skadnHelper:withInfo:)
  func skadnHelper(name: String, info: String) {
    DTBAdHelper.skadnHelper(name, withInfo: info)
  }
}
