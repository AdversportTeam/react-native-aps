/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (RNAPSAdsModule, NSObject)

RCT_EXTERN_METHOD(initialize
                  : (nonnull NSString *)appKey withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAdNetworkInfo : (nonnull NSDictionary *)adNetworkInfoDic)

RCT_EXTERN_METHOD(setMRAIDSupportedVersions : (nonnull NSArray *)versions)

RCT_EXTERN_METHOD(setMRAIDPolicy : (nonnull NSString *)policy)

RCT_EXTERN_METHOD(setTestMode : (BOOL)enabled)

RCT_EXTERN_METHOD(setUseGeoLocation : (BOOL)enabled)

RCT_EXTERN_METHOD(addCustomAttribute : (nonnull NSString *)key value : (nonnull NSString *)value)

RCT_EXTERN_METHOD(removeCustomAttribute : (nonnull NSString *)key)

@end
