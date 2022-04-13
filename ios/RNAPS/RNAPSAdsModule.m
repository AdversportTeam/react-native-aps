/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
