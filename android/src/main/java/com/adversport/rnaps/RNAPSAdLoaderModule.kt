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
import java.util.regex.Matcher
import java.util.regex.Pattern

@ReactModule(name = RNAPSAdLoaderModule.MODULE_NAME)
class RNAPSAdLoaderModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = MODULE_NAME

  @ReactMethod
  fun loadAd(options: ReadableMap, promise: Promise) {
    val adLoader = DTBAdRequest()

    val slots = options.getArray("slots")?.toArrayList()
      ?: return rejectPromiseWithCodeAndMessage(
        promise,
        "invalid_slots",
        "The slots argument is invalid."
      )

    val sizes = slots.map {
      val slot = it as Map<*, *>
      val slotUUID = slot["slotUUID"] as String?
      val type = slot["type"] as String?
      val size = slot["size"] as String? ?: ""

      when (type) {
        AD_TYPE_BANNER -> {
          val pattern: Pattern = Pattern.compile("([0-9]+)x([0-9]+)")
          val matcher: Matcher = pattern.matcher(size)

          if (matcher.find()) {
            val width = matcher.group(1)?.toInt() ?: 0
            val height = matcher.group(2)?.toInt() ?: 0
            DTBAdSize(width, height, slotUUID)
          } else {
            return rejectPromiseWithCodeAndMessage(
              promise,
              "invalid_size",
              "The size argument is invalid."
            )
          }
        }
        AD_TYPE_INTERSTITIAL -> DTBAdSize.DTBInterstitialAdSize(slotUUID)
        else -> return rejectPromiseWithCodeAndMessage(
          promise,
          "invalid_type",
          "The type argument is invalid."
        )
      }
    }
    adLoader.setSizes(*sizes.toTypedArray())

    if (options.hasKey("customTargeting")) {
      val customTargeting = options.getMap("customTargeting")!!.toHashMap()

      for ((key, value) in customTargeting) {
        adLoader.putCustomTarget(key, value as String)
      }
    }

    if (options.hasKey("slotGroupName")) {
      val slotGroupName = options.getString("slotGroupName")
      adLoader.setSlotGroup(slotGroupName)
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
