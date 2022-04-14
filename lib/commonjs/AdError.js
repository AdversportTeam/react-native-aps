"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdError = void 0;
exports.isAdError = isAdError;

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class AdError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'AdError';
  }

  static fromNativeError(error) {
    const {
      code,
      message
    } = error.userInfo;
    return new AdError(code, message);
  }

}
/**
 * Type guard for AdError.
 * @param error Uknown error object
 * @returns Whether the error is an AdError
 */


exports.AdError = AdError;

function isAdError(error) {
  return error instanceof AdError;
}
//# sourceMappingURL=AdError.js.map