package com.adversport.rnaps

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import com.amazon.device.ads.*
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNAPSAdLoaderModule.MODULE_NAME)
class RNAPSAdLoaderModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = MODULE_NAME

  @ReactMethod
  fun loadAd(options: ReadableMap, promise: Promise) {
    val adLoader = DTBAdRequest()

    val slotUUID = options.getString("slotUUID")!!
    val type = options.getString("type")!!
    val size = options.getString("size")
    val adSize = when (type) {
      AD_TYPE_BANNER -> {
        size!!.split("x").let {
          DTBAdSize(it[0].toInt(), it[1].toInt(), slotUUID)
        }
      }
      AD_TYPE_INTERSTITIAL -> DTBAdSize.DTBInterstitialAdSize(slotUUID)
      else -> return
    }
    adLoader.setSizes(adSize)

    options.getMap("customTargeting")?.let {
      for ((key, value) in it.toHashMap()) {
        adLoader.putCustomTarget(key, value as String)
      }
    }

    adLoader.loadAd(object : DTBAdCallback {
      override fun onFailure(adError: AdError) {
        val code = when (adError.code ?: AdError.ErrorCode.NO_ERROR) {
          AdError.ErrorCode.NO_ERROR -> "no_error"
          AdError.ErrorCode.NETWORK_ERROR -> "network_error"
          AdError.ErrorCode.NETWORK_TIMEOUT -> "network_timeout"
          AdError.ErrorCode.NO_FILL -> "no_fill"
          AdError.ErrorCode.INTERNAL_ERROR -> "internal_error"
          AdError.ErrorCode.REQUEST_ERROR -> "request_error"
        }
        rejectPromiseWithCodeAndMessage(promise, code, adError.message)
      }

      override fun onSuccess(response: DTBAdResponse) {
        val responseMap = Arguments.createMap()
        response.defaultDisplayAdsRequestCustomParams.forEach {
          responseMap.putString(it.key, it.value.joinToString(postfix = ","))
        }
        promise.resolve(responseMap)
      }
    })
  }

  fun rejectPromiseWithCodeAndMessage(promise: Promise, code: String?, message: String?) {
    val userInfoMap = Arguments.createMap()
    userInfoMap.putString("code", code)
    userInfoMap.putString("message", message)
    promise.reject(code, message, userInfoMap)
  }

  companion object {
    const val MODULE_NAME = "RNAPSAdLoaderModule"
    const val AD_TYPE_BANNER = "banner"
    const val AD_TYPE_INTERSTITIAL = "interstitial"
  }
}
