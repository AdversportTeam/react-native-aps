/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AdError class
 *
 * @public
 */
export class AdError extends Error {
  /**
   * @internal
   */
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = 'AdError';
  }

  /**
   * @internal
   */
  static fromNativeError(error: any): AdError {
    const { code, message } = error.userInfo;
    return new AdError(code, message);
  }
}

/**
 * Type guard for AdError.
 * @param error - Uknown error object
 * @returns Whether the error is an AdError
 *
 * @public
 */
export function isAdError(error: unknown): error is AdError {
  return error instanceof AdError;
}
