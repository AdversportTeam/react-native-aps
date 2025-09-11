package com.adversport.rnaps;

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

import android.util.SparseArray;
import com.amazon.device.ads.*;
import com.facebook.react.bridge.*;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import java.util.List;
import java.util.Map;

@ReactModule(name = RNAPSAdLoaderModule.MODULE_NAME)
public class RNAPSAdLoaderModule extends ReactContextBaseJavaModule {

  public static final String MODULE_NAME = "RNAPSAdLoaderModule";
  public static final String AD_TYPE_BANNER = "banner";
  public static final String AD_TYPE_INTERSTITIAL = "interstitial";
  public static final String EVENT_SUCCESS = "onSuccess";
  public static final String EVENT_FAILURE = "onFailure";

  private static final SparseArray<DTBAdRequest> adLoaders = new SparseArray<>();
  private final ReactApplicationContext reactContext;

  public RNAPSAdLoaderModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  private void sendEvent(String eventName, WritableMap params) {
    reactContext.getJSModule(RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Required for event emitter
  }

  @ReactMethod
  public void removeListeners(double count) {
    // Required for event emitter
  }

  private class AdCallback implements DTBAdCallback {
    private final int loaderId;
    private Promise promise;

    public AdCallback(int loaderId, Promise promise) {
      this.loaderId = loaderId;
      this.promise = promise;
    }

    @Override
    public void onFailure(AdError adError) {
      String code;
      AdError.ErrorCode errorCode = adError.getCode();
      if (errorCode == null) {
        errorCode = AdError.ErrorCode.NO_ERROR;
      }

      switch (errorCode) {
        case NO_ERROR:
          code = "no_error";
          break;
        case NETWORK_ERROR:
          code = "network_error";
          break;
        case NETWORK_TIMEOUT:
          code = "network_timeout";
          break;
        case NO_FILL:
          code = "no_fill";
          break;
        case INTERNAL_ERROR:
          code = "internal_error";
          break;
        case REQUEST_ERROR:
          code = "request_error";
          break;
        default:
          code = "unknown_error";
          break;
      }

      WritableMap userInfoMap = Arguments.createMap();
      userInfoMap.putString("code", code);
      userInfoMap.putString("message", adError.getMessage());

      WritableMap payload = Arguments.createMap();
      payload.putInt("loaderId", loaderId);
      payload.putMap("userInfo", userInfoMap);

      sendEvent(EVENT_FAILURE, payload);
      if (promise != null) {
        // Créer une copie pour promise.reject car userInfoMap est déjà utilisé
        WritableMap userInfoCopy = Arguments.createMap();
        userInfoCopy.putString("code", code);
        userInfoCopy.putString("message", adError.getMessage());
        promise.reject(code, adError.getMessage(), userInfoCopy);
        promise = null;
      }
    }

    @Override
    public void onSuccess(DTBAdResponse response) {
      WritableMap responseMap = Arguments.createMap();
      Map<String, List<String>> customParams = response.getDefaultDisplayAdsRequestCustomParams();

      for (Map.Entry<String, List<String>> entry : customParams.entrySet()) {
        List<String> values = entry.getValue();
        StringBuilder valueBuilder = new StringBuilder();
        for (int i = 0; i < values.size(); i++) {
          valueBuilder.append(values.get(i));
          if (i < values.size() - 1) {
            valueBuilder.append(",");
          }
        }
        responseMap.putString(entry.getKey(), valueBuilder.toString());
      }

      WritableMap payload = Arguments.createMap();
      payload.putInt("loaderId", loaderId);
      payload.putMap("response", responseMap);

      sendEvent(EVENT_SUCCESS, payload);
      if (promise != null) {
        // Créer une copie pour promise.resolve car responseMap est déjà utilisé
        WritableMap responseCopy = Arguments.createMap();
        for (Map.Entry<String, List<String>> entry : customParams.entrySet()) {
          List<String> values = entry.getValue();
          StringBuilder valueBuilder = new StringBuilder();
          for (int i = 0; i < values.size(); i++) {
            valueBuilder.append(values.get(i));
            if (i < values.size() - 1) {
              valueBuilder.append(",");
            }
          }
          responseCopy.putString(entry.getKey(), valueBuilder.toString());
        }
        promise.resolve(responseCopy);
        promise = null;
      }
    }
  }

  @ReactMethod
  public void loadAd(int loaderId, String adType, ReadableMap options, Promise promise) {
    stopAutoRefresh(loaderId);

    DTBAdRequest adLoader = new DTBAdRequest();

    String slotUUID = options.getString("slotUUID");
    if (slotUUID == null) {
      promise.reject("invalid_slot_uuid", "slotUUID is required");
      return;
    }

    DTBAdSize adSize;
    switch (adType) {
      case AD_TYPE_BANNER:
        String size = options.getString("size");
        if (size == null) {
          promise.reject("invalid_size", "size is required for banner ads");
          return;
        }
        String[] dimensions = size.split("x");
        if (dimensions.length != 2) {
          promise.reject("invalid_size", "size must be in format 'WIDTHxHEIGHT'");
          return;
        }
        try {
          int width = Integer.parseInt(dimensions[0]);
          int height = Integer.parseInt(dimensions[1]);
          adSize = new DTBAdSize(width, height, slotUUID);
        } catch (NumberFormatException e) {
          promise.reject("invalid_size", "invalid size format: " + size);
          return;
        }
        break;
      case AD_TYPE_INTERSTITIAL:
        adSize = new DTBAdSize.DTBInterstitialAdSize(slotUUID);
        break;
      default:
        promise.reject("invalid_ad_type", "unsupported ad type: " + adType);
        return;
    }

    adLoader.setSizes(adSize);

    if (options.hasKey("customTargeting")) {
      ReadableMap customTargeting = options.getMap("customTargeting");
      if (customTargeting != null) {
        ReadableMapKeySetIterator iterator = customTargeting.keySetIterator();
        while (iterator.hasNextKey()) {
          String key = iterator.nextKey();
          String value = customTargeting.getString(key);
          if (value != null) {
            adLoader.putCustomTarget(key, value);
          }
        }
      }
    }

    boolean autoRefresh = options.hasKey("autoRefresh") && options.getBoolean("autoRefresh");
    int refreshInterval =
        options.hasKey("refreshInterval") ? options.getInt("refreshInterval") : 60;

    if (autoRefresh) {
      adLoader.setAutoRefresh(refreshInterval);
      adLoaders.put(loaderId, adLoader);
    }

    adLoader.loadAd(new AdCallback(loaderId, promise));
  }

  @ReactMethod
  public void stopAutoRefresh(int loaderId) {
    DTBAdRequest adLoader = adLoaders.get(loaderId);
    if (adLoader != null) {
      adLoader.stop();
      adLoaders.remove(loaderId);
    }
  }
}
