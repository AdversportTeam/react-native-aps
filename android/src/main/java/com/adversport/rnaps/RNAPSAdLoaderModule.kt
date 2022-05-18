package com.adversport.rnaps

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

import android.util.SparseArray
import com.amazon.device.ads.*
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

@ReactModule(name = RNAPSAdLoaderModule.MODULE_NAME)
class RNAPSAdLoaderModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = MODULE_NAME

  private fun sendEvent(eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  @ReactMethod
  fun addListener(eventName: String) {
  }

  @ReactMethod
  fun removeListeners(count: Int) {
  }

  private inner class AdCallback(private val loaderId: Int, private var promise: Promise?) : DTBAdCallback {
    override fun onFailure(adError: AdError) {
      val code = when (adError.code ?: AdError.ErrorCode.NO_ERROR) {
        AdError.ErrorCode.NO_ERROR -> "no_error"
        AdError.ErrorCode.NETWORK_ERROR -> "network_error"
        AdError.ErrorCode.NETWORK_TIMEOUT -> "network_timeout"
        AdError.ErrorCode.NO_FILL -> "no_fill"
        AdError.ErrorCode.INTERNAL_ERROR -> "internal_error"
        AdError.ErrorCode.REQUEST_ERROR -> "request_error"
      }
      val userInfoMap = Arguments.createMap()
      userInfoMap.putString("code", code)
      userInfoMap.putString("message", adError.message)

      val payload = Arguments.createMap()
      payload.putInt("loaderId", loaderId)
      payload.putMap("userInfo", userInfoMap.copy())

      sendEvent(EVENT_FAILURE, payload)
      promise?.reject(code, adError.message, userInfoMap)
      promise = null
    }

    override fun onSuccess(response: DTBAdResponse) {
      val responseMap = Arguments.createMap()
      response.defaultDisplayAdsRequestCustomParams.forEach {
        responseMap.putString(it.key, it.value.joinToString(postfix = ","))
      }

      val payload = Arguments.createMap()
      payload.putInt("loaderId", loaderId)
      payload.putMap("response", responseMap.copy())

      sendEvent(EVENT_SUCCESS, payload)
      promise?.resolve(responseMap)
      promise = null
    }
  }

  @ReactMethod
  fun loadAd(loaderId: Int, adType: String, options: ReadableMap, promise: Promise) {
    stopAutoRefresh(loaderId)

    val adLoader = DTBAdRequest()

    val slotUUID = options.getString("slotUUID")!!
    val size = options.getString("size")
    val adSize = when (adType) {
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

    val autoRefresh = options.hasKey("autoRefresh").let {
      if (it) {
        options.getBoolean("autoRefresh")
      } else {
        false
      }
    }

    val refreshInterval = options.hasKey("refreshInterval").let {
      if (it) {
        options.getInt("refreshInterval")
      } else {
        60
      }
    }

    if (autoRefresh) {
      adLoader.setAutoRefresh(refreshInterval)
      adLoaders.put(loaderId, adLoader)
    }

    adLoader.loadAd(AdCallback(loaderId, promise))
  }

  @ReactMethod
  fun stopAutoRefresh(loaderId: Int) {
    adLoaders.get(loaderId)?.stop()
    adLoaders.remove(loaderId)
  }

  companion object {
    const val MODULE_NAME = "RNAPSAdLoaderModule"
    const val AD_TYPE_BANNER = "banner"
    const val AD_TYPE_INTERSTITIAL = "interstitial"
    const val EVENT_SUCCESS = "onSuccess"
    const val EVENT_FAILURE = "onFailure"

    val adLoaders = SparseArray<DTBAdRequest>()
  }
}
