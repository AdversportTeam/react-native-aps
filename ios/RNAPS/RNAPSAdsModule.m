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

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (RNAPSAdsModule, NSObject)

RCT_EXTERN_METHOD(initialize
                  : (NSString)appKey withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAdNetworkInfo : (NSDictionary)adNetworkInfoDic)

RCT_EXTERN_METHOD(setMRAIDSupportedVersions : (NSArray)versions)

RCT_EXTERN_METHOD(setMRAIDPolicy : (NSString)policy)

RCT_EXTERN_METHOD(setTestMode : (BOOL)enabled)

RCT_EXTERN_METHOD(setUseGeoLocation : (BOOL)enabled)

RCT_EXTERN_METHOD(addCustomAttribute : (NSString)key value : (NSString)value)

RCT_EXTERN_METHOD(removeCustomAttribute : (NSString)key)

@end
