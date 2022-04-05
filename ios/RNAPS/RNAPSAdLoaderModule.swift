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
    
    guard let slots = options["slots"] as? Array<Dictionary<String, String>> else {
      RNAPSAdLoaderModule.rejectPromise(reject: reject, code: "invalid_slots", message: "The slots argument is invalid.")
      return
    }
    let sizes = slots.compactMap { (slot) -> DTBAdSize? in
      let slotUUID = slot["slotUUID"]
      let type = slot["type"]
      let size = slot["size"] ?? ""
      
      switch type {
      case RNAPSAdLoaderModule.AD_TYPE_BANNER:
        guard let _ = size.range(of: "^([0-9]+)x([0-9]+)$", options: .regularExpression) else {
          return nil
        }
        let values = size.split(separator: "x")
        let width = Int(values[0])!
        let height = Int(values[1])!
        return DTBAdSize(bannerAdSizeWithWidth: width, height: height, andSlotUUID: slotUUID)
      case RNAPSAdLoaderModule.AD_TYPE_INTERSTITIAL:
        return DTBAdSize(interstitialAdSizeWithSlotUUID: slotUUID)
      default:
        return nil
      }
    }
    adLoader.setAdSizes(sizes as [Any])
    
    if let customTargeting = options["customTargeting"] as? Dictionary<String, String> {
      for (key, value) in (customTargeting) {
        adLoader.putCustomTarget(value, withKey: key)
      }
    }
    
    if let slotGroupName = options["slotGroupName"] {
      adLoader.slotGroup = slotGroupName as? String
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
