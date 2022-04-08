package com.adversport.rnaps

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import com.amazon.device.ads.AdRegistration
import com.amazon.device.ads.DTBAdNetwork
import com.amazon.device.ads.DTBAdNetworkInfo
import com.amazon.device.ads.MRAIDPolicy
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

    adNetworkInfoMap.getMap("adNetworkProperties")?.let {
      val properties = it.toHashMap()

      for ((key, value) in properties) {
        adNetworkInfo.setAdNetworkProperties(key, value as String)
      }
    }

    AdRegistration.setAdNetworkInfo(adNetworkInfo)
  }

  @ReactMethod
  fun setMRAIDSupportedVersions(versions: ReadableArray) {
    AdRegistration.setMRAIDSupportedVersions((versions.toArrayList() as List<String>).toTypedArray())
  }

  @ReactMethod
  fun setMRAIDPolicy(policy: String) {
    AdRegistration.setMRAIDPolicy(
      when (policy) {
        "NONE" -> MRAIDPolicy.NONE
        "AUTO_DETECT" -> MRAIDPolicy.AUTO_DETECT
        "DFP" -> MRAIDPolicy.DFP
        else -> MRAIDPolicy.CUSTOM
      }
    )
  }

  @ReactMethod
  fun setTestMode(enabled: Boolean) {
    AdRegistration.enableTesting(enabled)
  }

  @ReactMethod
  fun setUseGeoLocation(enabled: Boolean) {
    AdRegistration.useGeoLocation(enabled)
  }

  @ReactMethod
  fun addCustomAttribute(key: String, value: String) {
    AdRegistration.addCustomAttribute(key, value)
  }

  @ReactMethod
  fun removeCustomAttribute(key: String) {
    AdRegistration.removeCustomAttribute(key)
  }

  companion object {
    const val MODULE_NAME = "RNAPSAdsModule"
  }
}
