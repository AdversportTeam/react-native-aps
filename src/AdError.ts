/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class AdError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = 'AdError';
  }

  static fromNativeError(error: any): AdError {
    const { code, message } = error.userInfo;
    return new AdError(code, message);
  }
}

export function isAdError(error: unknown): error is AdError {
  return error instanceof AdError;
}
