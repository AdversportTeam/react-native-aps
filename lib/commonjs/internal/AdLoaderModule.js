"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {
  RNAPSAdLoaderModule
} = _reactNative.NativeModules;
const LINKING_ERROR = `The package 'react-native-aps' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';

if (RNAPSAdLoaderModule == null) {
  console.error(LINKING_ERROR);
}

var _default = RNAPSAdLoaderModule;
exports.default = _default;
//# sourceMappingURL=AdLoaderModule.js.map