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
  // Loaders the SDK may still call back or refresh. Accessed from the module
  // queue (loadAd, stopAutoRefresh) and from the SDK callbacks: keep every
  // access under `adLoadersLock`. A one-shot loader (no auto-refresh) leaves
  // the dictionary on its first callback; an auto-refreshing one stays until
  // stopAutoRefresh().
  var adLoaders = Dictionary<NSNumber, DTBAdLoader>()
  private let adLoadersLock = NSLock()
  var hasListeners = false;

  // DTBiOSSDK delivers every callback on the main queue. The callbacks leave
  // it at once and settle the promise from this queue, so a slot's answer does
  // not hold the main thread (nor wait for it longer than the hop). Serial, so
  // answers keep their arrival order.
  fileprivate static let callbackQueue = DispatchQueue(
    label: "com.adversport.rnaps.callbacks",
    qos: .userInitiated
  )

  private func withAdLoaders<T>(_ body: (inout Dictionary<NSNumber, DTBAdLoader>) -> T) -> T {
    adLoadersLock.lock()
    defer { adLoadersLock.unlock() }
    return body(&adLoaders)
  }

  // Drops the loader unless the id was reused for a newer one in the meantime.
  fileprivate func forgetAdLoader(_ loaderId: NSNumber, ifStill adLoader: DTBAdLoader) {
    _ = withAdLoaders { dict in
      if dict[loaderId] === adLoader {
        dict.removeValue(forKey: loaderId)
      }
    }
  }

  //MARK: - Native Module Setup

  deinit {
    invalidate()
  }

  @objc static override func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc override func invalidate() {
    super.invalidate()
    let loaders: [DTBAdLoader] = withAdLoaders { dict in
      let values = Array(dict.values)
      dict.removeAll()
      return values
    }
    RNAPSAdLoaderModule.stopOnMain(loaders)
  }

  // -[DTBAdLoader stop] invalidates the auto-refresh NSTimer, which must happen
  // on the thread that armed it: the main thread (see loadAd). Also keeps stop
  // serialised with the SDK callbacks, which the SDK delivers on main.
  private static func stopOnMain(_ loaders: [DTBAdLoader]) {
    if loaders.isEmpty {
      return
    }
    if Thread.isMainThread {
      loaders.forEach { $0.stop() }
    } else {
      DispatchQueue.main.async { loaders.forEach { $0.stop() } }
    }
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
    let adLoader: DTBAdLoader
    let autoRefresh: Bool
    var resolve: RCTPromiseResolveBlock?
    var reject: RCTPromiseRejectBlock?
    init(adLoaderModule: RNAPSAdLoaderModule, loaderId: NSNumber, adLoader: DTBAdLoader, autoRefresh: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      self.adLoaderModule = adLoaderModule
      self.loaderId = loaderId
      self.adLoader = adLoader
      self.autoRefresh = autoRefresh
      self.resolve = resolve
      self.reject = reject
    }

    // A one-shot request is done after its first callback: drop our reference.
    private func forgetIfOneShot() {
      if !autoRefresh {
        adLoaderModule.forgetAdLoader(loaderId, ifStill: adLoader)
      }
    }
    func onSuccess(_ adResponse: DTBAdResponse!) {
      // Read on the SDK's thread (main), then leave it: see callbackQueue.
      // Using original optional handling which defaults to empty Dict if nil
      let response = adResponse.customTargeting() ?? [:]
      let resolve = self.resolve
      self.resolve = nil
      self.reject = nil
      RNAPSAdLoaderModule.callbackQueue.async {
        self.adLoaderModule.sendEvent(name: RNAPSAdLoaderModule.EVENT_SUCCESS, body: [
          "loaderId": self.loaderId,
          "response": response
        ])
        resolve?(response)
        self.forgetIfOneShot()
      }
    }

    func onFailure(_ error: DTBAdError) {
      let reject = self.reject
      self.resolve = nil
      self.reject = nil
      // Nothing below needs the main thread: see callbackQueue.
      RNAPSAdLoaderModule.callbackQueue.async {
        self.fail(error, reject: reject)
      }
    }

    private func fail(_ error: DTBAdError, reject: RCTPromiseRejectBlock?) {
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
      let sdkLabel = String(describing: error)
      let message = String(
        format: "Failed to load APS ad (mapped: %@, APS: %@, rawValue: %d)",
        code,
        sdkLabel,
        error.rawValue
      )
      let userInfo: [String: Any] = [
        "code": code,
        "message": message,
        "sdkCode": sdkLabel,
        "rawValue": error.rawValue,
      ]
      adLoaderModule.sendEvent(name: RNAPSAdLoaderModule.EVENT_FAILURE, body: [
        "loaderId": loaderId,
        "userInfo": userInfo
      ])
      if let reject = reject {
        // Using original Int conversion and error code
        let nsError = NSError.init(domain: RNAPSAdLoaderModule.ERROR_DOMAIN, code: Int(error.rawValue), userInfo: userInfo)
        reject(code, message, nsError)
      }
      forgetIfOneShot()
    }
  }

  //MARK: - Native Methods

  @objc(loadAd:forAdType:withOptions:withResolver:withRejecter:)
  func loadAd(loaderId: NSNumber, adType: String, options: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    let autoRefresh = options["autoRefresh"] as? Bool ?? false

    // The module runs on a private serial queue (RNAPSAdLoaderModule.m), but an
    // auto-refreshing loader arms an NSTimer on the calling thread's run loop,
    // and only the main thread runs one: keep those requests on the main queue.
    if autoRefresh && !Thread.isMainThread {
      DispatchQueue.main.async {
        self.loadAd(loaderId: loaderId, adType: adType, options: options, resolve: resolve, reject: reject)
      }
      return
    }

    stopAutoRefresh(loaderId: loaderId)

    let slotUUID = options["slotUUID"] as! String
    let size = options["size"] as? String

    let adNetworkInfo = RNAPSAdsModule.cachedAdNetworkInfo
        ?? DTBAdNetworkInfo(networkName: DTBADNETWORK_OTHER)
    let adLoader = DTBAdLoader(adNetworkInfo: adNetworkInfo)

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

    let refreshInterval = options["refreshInterval"] as? Int32 ?? 60

    if (autoRefresh) {
      adLoader.setAutoRefresh(refreshInterval)
    }

    // Amazon DSP requires the public web URL of the content being viewed, so
    // that AmazonAdBot can crawl it and verify the surroundings of the ad.
    //
    // +[APS setContentUrl:] is a CLASS method, i.e. process-global state. We set
    // it here, immediately before loadAd and inside the same native call, so it
    // cannot be overwritten by another slot between the two — every one-shot
    // request runs on the module's serial queue (auto-refresh ones run on main,
    // which is serial too).
    //
    // Empty or nil is skipped on purpose: the SDK header states it "will throw
    // an NSException in development" in that case. Callers with no reliable URL
    // simply omit the option.
    //
    // Known limitation: the setter is sticky and cannot be cleared, so the last
    // URL set stays attached to subsequent requests until another one replaces
    // it. Raised with Amazon APS.
    if let contentUrl = options["contentUrl"] as? String, !contentUrl.isEmpty {
      APS.setContentUrl(contentUrl)
    }

    _ = withAdLoaders { $0.updateValue(adLoader, forKey: loaderId) }
    adLoader.loadAd(AdLoadCallback(adLoaderModule: self, loaderId: loaderId, adLoader: adLoader, autoRefresh: autoRefresh, resolve: resolve, reject: reject))
  }

  @objc(stopAutoRefresh:)
  func stopAutoRefresh(loaderId: NSNumber) {
    if let adLoader = withAdLoaders({ $0.removeValue(forKey: loaderId) }) {
      RNAPSAdLoaderModule.stopOnMain([adLoader])
    }
  }

  @objc(skadnHelper:withInfo:)
  func skadnHelper(name: String, info: String) {
    // Unchanged behaviour: this used to run on the main queue with the rest
    // of the module, and nothing here is time-critical.
    DispatchQueue.main.async {
      DTBAdHelper.skadnHelper(name, withInfo: info)
    }
  }
}
