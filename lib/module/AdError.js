/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export class AdError extends Error {
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
export function isAdError(error) {
  return error instanceof AdError;
}
//# sourceMappingURL=AdError.js.map