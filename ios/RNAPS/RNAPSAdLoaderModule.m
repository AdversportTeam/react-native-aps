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

// Bid requests leave from a private serial queue, not from the main queue.
// -[DTBAdLoader loadAd:] registers the device and builds the bid payload
// synchronously on the calling thread: on the main queue, every slot first
// waited for the main thread to be free, then did that work on it, behind
// whatever UI work was running (Fabric mounts, GAM banner requests, creative
// rendering). DTBiOSSDK 5.6.4 supports off-main callers: it hops to the main
// queue itself for the UIKit/WebKit reads it needs (user agent, orientation)
// and still delivers every callback on the main queue.
// Serial on purpose: +[APS setContentUrl:] is process-global and must pair
// with the loadAd of the same call.
- (dispatch_queue_t)methodQueue {
  static dispatch_queue_t queue;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dispatch_queue_attr_t attr =
        dispatch_queue_attr_make_with_qos_class(DISPATCH_QUEUE_SERIAL, QOS_CLASS_USER_INITIATED, 0);
    queue = dispatch_queue_create("com.adversport.rnaps.adloader", attr);
  });
  return queue;
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
