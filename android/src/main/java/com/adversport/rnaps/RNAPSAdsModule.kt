package com.adversport.rnaps

import com.amazon.device.ads.AdRegistration
import com.amazon.device.ads.DTBAdNetwork
import com.amazon.device.ads.DTBAdNetworkInfo
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNAPSAdsModule.MODULE_NAME)
class RNAPSAdsModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = MODULE_NAME

  @ReactMethod
  fun initialize(appKey: String, promise: Promise) {
    AdRegistration.getInstance(appKey, reactApplicationContext)
    promise.resolve(null)
  }

  @ReactMethod
  fun setAdNetworkInfo(adNetworkInfoMap: ReadableMap) {
    if (!adNetworkInfoMap.hasKey("adNetwork")) {
      throw Error()
    }

    val adNetwork = when (adNetworkInfoMap.getString("adNetwork")) {
      "GOOGLE_AD_MANAGER" -> DTBAdNetwork.GOOGLE_AD_MANAGER
      "ADMOB" -> DTBAdNetwork.ADMOB
      "AD_GENERATION" -> DTBAdNetwork.AD_GENERATION
      "IRON_SOURCE" -> DTBAdNetwork.IRON_SOURCE
      "MAX" -> DTBAdNetwork.MAX
      "NIMBUS" -> DTBAdNetwork.NIMBUS
      else -> DTBAdNetwork.OTHER
    }
    val adNetworkInfo = DTBAdNetworkInfo(adNetwork)

    if (adNetworkInfoMap.hasKey("adNetworkProperties")) {
      val properties = adNetworkInfoMap.getMap("adNetworkProperties")!!.toHashMap()

      for ((key, value) in properties) {
        adNetworkInfo.setAdNetworkProperties(key, value as String)
      }
    }

    AdRegistration.setAdNetworkInfo(adNetworkInfo)
  }

  @ReactMethod
  fun setTestMode(enabled: Boolean) {
    AdRegistration.enableTesting(enabled)
  }

  @ReactMethod
  fun setUseGeoLocation(enabled: Boolean) {
    AdRegistration.useGeoLocation(enabled)
  }

  companion object {
    const val MODULE_NAME = "RNAPSAdsModule"
  }
}
