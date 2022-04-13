/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import DTBiOSSDK
import Foundation

@objc(RNAPSAdLoaderModule)
class RNAPSAdLoaderModule: NSObject {
  static let AD_TYPE_BANNER = "banner"
  static let AD_TYPE_INTERSTITIAL = "interstitial"
  static let ERROR_DOMAIN = "RNAPS"
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc(loadAd:withResolver:withRejecter:)
  func loadAd(options: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    let adLoader = DTBAdLoader()
    
    let slotUUID = options["slotUUID"] as! String
    let type = options["type"] as! String
    let size = options["size"] as? String
    let adSize: DTBAdSize
    switch type {
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
    
    adLoader.loadAd(AdLoadCallback(resolve: resolve, reject: reject))
  }
  
  class AdLoadCallback: DTBAdCallback {
    let resolve: RCTPromiseResolveBlock
    let reject: RCTPromiseRejectBlock
    init(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      self.resolve = resolve
      self.reject = reject
    }
    func onSuccess(_ adResponse: DTBAdResponse!) {
      resolve(adResponse.customTargeting())
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
      RNAPSAdLoaderModule.rejectPromise(reject: reject, code: code, message: message)
    }
  }
  
  static func rejectPromise(reject: RCTPromiseRejectBlock, code: String, message: String) -> Void {
    var userInfo = Dictionary<String, String>()
    userInfo["code"] = code
    userInfo["message"] = message
    let error = NSError.init(domain: RNAPSAdLoaderModule.ERROR_DOMAIN, code: 666, userInfo: userInfo)
    reject(code, message, error)
  }
}
