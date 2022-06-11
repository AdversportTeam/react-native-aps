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
