/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export type AdErrorExtras = {
  /** Amazon SDK error label (e.g. iOS `String(describing:)`, Android `ErrorCode.name()`). */
  sdkCode?: string;
  /** Raw / ordinal value from the native SDK when available. */
  rawValue?: number;
};

/**
 * AdError class — normalized `code` from the bridge, plus optional native details for debugging.
 */
export class AdError extends Error {
  readonly code: string;
  readonly sdkCode?: string;
  readonly rawValue?: number;

  constructor(code: string, message: string, extras?: AdErrorExtras) {
    super(message);
    this.name = 'AdError';
    this.code = code;
    this.sdkCode = extras?.sdkCode;
    this.rawValue = extras?.rawValue;
  }

  /** Compact label for UI (badge, logs). */
  formatShortLabel(): string {
    const parts = [this.code];
    if (this.sdkCode) {
      parts.push(this.sdkCode);
    }
    if (this.rawValue !== undefined) {
      parts.push(`#${this.rawValue}`);
    }
    return parts.join(' · ');
  }

  static fromNativeError(error: any): AdError {
    const ui = error?.userInfo;
    const code = typeof ui?.code === 'string' ? ui.code : 'unknown';
    const message =
      typeof ui?.message === 'string' ? ui.message : String(ui?.message ?? '');
    const sdkCode = typeof ui?.sdkCode === 'string' ? ui.sdkCode : undefined;
    let rawValue: number | undefined;
    if (typeof ui?.rawValue === 'number' && !Number.isNaN(ui.rawValue)) {
      rawValue = ui.rawValue;
    } else if (typeof ui?.rawValue === 'string' && ui.rawValue !== '') {
      const n = Number(ui.rawValue);
      if (!Number.isNaN(n)) {
        rawValue = n;
      }
    }
    const extras =
      sdkCode !== undefined || rawValue !== undefined
        ? { sdkCode, rawValue }
        : undefined;
    return new AdError(code, message, extras);
  }
}

/**
 * Type guard for AdError.
 */
export function isAdError(error: unknown): error is AdError {
  return error instanceof AdError;
}
