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

import com.amazon.device.ads.AdRegistration;
import com.amazon.device.ads.DTBAdNetwork;
import com.amazon.device.ads.DTBAdNetworkInfo;
import com.amazon.device.ads.MRAIDPolicy;
import com.facebook.react.bridge.*;
import com.facebook.react.module.annotations.ReactModule;
import java.util.ArrayList;

@ReactModule(name = RNAPSAdsModule.MODULE_NAME)
public class RNAPSAdsModule extends ReactContextBaseJavaModule {

  public static final String MODULE_NAME = "RNAPSAdsModule";

  public RNAPSAdsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void initialize(String appKey, Promise promise) {
    AdRegistration.getInstance(appKey, getReactApplicationContext());
    promise.resolve(null);
  }

  @ReactMethod
  public void setAdNetworkInfo(ReadableMap adNetworkInfoMap) {
    String adNetworkStr = adNetworkInfoMap.getString("adNetwork");
    DTBAdNetwork adNetwork;

    switch (adNetworkStr != null ? adNetworkStr : "OTHER") {
      case "GOOGLE_AD_MANAGER":
        adNetwork = DTBAdNetwork.GOOGLE_AD_MANAGER;
        break;
      case "ADMOB":
        adNetwork = DTBAdNetwork.ADMOB;
        break;
      case "AD_GENERATION":
        adNetwork = DTBAdNetwork.AD_GENERATION;
        break;
      case "IRON_SOURCE":
        adNetwork = DTBAdNetwork.IRON_SOURCE;
        break;
      case "MAX":
        adNetwork = DTBAdNetwork.MAX;
        break;
      case "NIMBUS":
        adNetwork = DTBAdNetwork.NIMBUS;
        break;
      default:
        adNetwork = DTBAdNetwork.OTHER;
        break;
    }

    DTBAdNetworkInfo adNetworkInfo = new DTBAdNetworkInfo(adNetwork);

    if (adNetworkInfoMap.hasKey("adNetworkProperties")) {
      ReadableMap propertiesMap = adNetworkInfoMap.getMap("adNetworkProperties");
      if (propertiesMap != null) {
        ReadableMapKeySetIterator iterator = propertiesMap.keySetIterator();
        while (iterator.hasNextKey()) {
          String key = iterator.nextKey();
          String value = propertiesMap.getString(key);
          if (value != null) {
            adNetworkInfo.setAdNetworkProperties(key, value);
          }
        }
      }
    }

    AdRegistration.setAdNetworkInfo(adNetworkInfo);
  }

  @ReactMethod
  public void setMRAIDSupportedVersions(ReadableArray versions) {
    ArrayList<Object> versionsList = versions.toArrayList();
    String[] versionsArray = new String[versionsList.size()];
    for (int i = 0; i < versionsList.size(); i++) {
      versionsArray[i] = (String) versionsList.get(i);
    }
    AdRegistration.setMRAIDSupportedVersions(versionsArray);
  }

  @ReactMethod
  public void setMRAIDPolicy(String policy) {
    MRAIDPolicy mraidPolicy;
    switch (policy) {
      case "NONE":
        mraidPolicy = MRAIDPolicy.NONE;
        break;
      case "DFP":
        mraidPolicy = MRAIDPolicy.DFP;
        break;
      default:
        mraidPolicy = MRAIDPolicy.CUSTOM;
        break;
    }
    AdRegistration.setMRAIDPolicy(mraidPolicy);
  }

  @ReactMethod
  public void setTestMode(boolean enabled) {
    AdRegistration.enableTesting(enabled);
  }

  @ReactMethod
  public void setUseGeoLocation(boolean enabled) {
    AdRegistration.useGeoLocation(enabled);
  }

  @ReactMethod
  public void addCustomAttribute(String key, String value) {
    AdRegistration.addCustomAttribute(key, value);
  }

  @ReactMethod
  public void removeCustomAttribute(String key) {
    AdRegistration.removeCustomAttribute(key);
  }
}
