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
    var resolve: RCTPromiseResolveBlock?
    var reject: RCTPromiseRejectBlock?
    init(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      self.resolve = resolve
      self.reject = reject
    }
    func onSuccess(_ adResponse: DTBAdResponse!) {
      if let resolve = resolve {
        resolve(adResponse.customTargeting())
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
      if let reject = reject {
        RNAPSAdLoaderModule.rejectPromise(reject: reject, code: code, message: message)
        self.resolve = nil
        self.reject = nil
      }
    }
  }

  @objc(skadnHelper:withInfo:)
  func skadnHelper(name: String, info: String) {
    DTBAdHelper.skadnHelper(name, withInfo: info)
  }

  static func rejectPromise(reject: RCTPromiseRejectBlock, code: String, message: String) -> Void {
    var userInfo = Dictionary<String, String>()
    userInfo["code"] = code
    userInfo["message"] = message
    let error = NSError.init(domain: RNAPSAdLoaderModule.ERROR_DOMAIN, code: 666, userInfo: userInfo)
    reject(code, message, error)
  }
}
