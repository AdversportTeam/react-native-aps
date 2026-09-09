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

import com.amazon.aps.ads.common.ApsExternalUserId;
import com.amazon.device.ads.AdRegistration;
import com.amazon.device.ads.DTBAdNetwork;
import com.amazon.device.ads.DTBAdNetworkInfo;
import com.amazon.device.ads.MRAIDPolicy;
import com.facebook.react.bridge.*;
import com.facebook.react.module.annotations.ReactModule;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ReactModule(name = RNAPSAdsModule.MODULE_NAME)
public class RNAPSAdsModule extends ReactContextBaseJavaModule {

  public static final String MODULE_NAME = "RNAPSAdsModule";

  private static DTBAdNetworkInfo cachedAdNetworkInfo = null;

  public static DTBAdNetworkInfo getCachedAdNetworkInfo() {
    return cachedAdNetworkInfo;
  }

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
      case "UNITY_LEVELPLAY":
        adNetwork = DTBAdNetwork.UNITY_LEVELPLAY;
        break;
      case "UNKNOWN":
        adNetwork = DTBAdNetwork.UNKNOWN;
        break;
      case "CUSTOM_MEDIATION":
        adNetwork = DTBAdNetwork.CUSTOM_MEDIATION;
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

    cachedAdNetworkInfo = adNetworkInfo;
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

  /**
   * Third-party identifiers (ID5, LiveRamp...), forwarded by Amazon to the TAM/UAM bidders the
   * publisher has enabled. Set once per user session; call again when an id changes. Passing an
   * empty array clears them, which is what a consent withdrawal must do.
   */
  @ReactMethod
  public void setExternalUserIds(ReadableArray externalUserIds) {
    List<ApsExternalUserId> ids = new ArrayList<>();

    for (int i = 0; i < externalUserIds.size(); i++) {
      ReadableMap entry = externalUserIds.getMap(i);
      if (entry == null || !entry.hasKey("source")) {
        continue;
      }
      String source = entry.getString("source");
      ReadableArray uids = entry.hasKey("uids") ? entry.getArray("uids") : null;
      if (source == null || uids == null || uids.size() == 0) {
        continue;
      }

      ApsExternalUserId.Builder builder = ApsExternalUserId.Companion.builder().addSource(source);
      boolean hasUid = false;

      for (int j = 0; j < uids.size(); j++) {
        ReadableMap uid = uids.getMap(j);
        if (uid == null || !uid.hasKey("id")) {
          continue;
        }
        String id = uid.getString("id");
        if (id == null) {
          continue;
        }
        Integer atype = uid.hasKey("atype") ? uid.getInt("atype") : null;
        builder.addUniqueId(id, atype, readStringMap(uid, "ext"));
        hasUid = true;
      }

      if (hasUid) {
        ids.add(builder.build());
      }
    }

    AdRegistration.setExternalUserIds(ids);
  }

  /**
   * Reads a nested string map, skipping any non-string value rather than failing the whole call.
   */
  private static Map<String, String> readStringMap(ReadableMap parent, String key) {
    if (!parent.hasKey(key)) {
      return null;
    }
    ReadableMap map = parent.getMap(key);
    if (map == null) {
      return null;
    }
    Map<String, String> out = new HashMap<>();
    ReadableMapKeySetIterator iterator = map.keySetIterator();
    while (iterator.hasNextKey()) {
      String k = iterator.nextKey();
      String v = map.getString(k);
      if (v != null) {
        out.put(k, v);
      }
    }
    return out.isEmpty() ? null : out;
  }
}
