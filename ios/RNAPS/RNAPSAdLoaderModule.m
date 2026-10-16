/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE (RNAPSAdLoaderModule, RCTEventEmitter)

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXTERN_METHOD(loadAd
                  : (nonnull NSNumber *)loaderId forAdType
                  : (nonnull NSString *)adType withOptions
                  : (nonnull NSDictionary *)options withResolver
                  : (RCTPromiseResolveBlock)resolve withRejecter
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopAutoRefresh : (nonnull NSNumber *)loaderId)

RCT_EXTERN_METHOD(skadnHelper : (nonnull NSString *)name withInfo : (NSString *)info)

@end
