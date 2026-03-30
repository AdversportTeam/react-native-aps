/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * AdError class
 *
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

/**
 * Type guard for AdError.
 */
export function isAdError(error: unknown): error is AdError {
  return error instanceof AdError;
}
