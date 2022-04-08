/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNAPSAdLoaderModule, NSObject)

RCT_EXTERN_METHOD(loadAd:(NSDictionary)options
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
