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
    const sdkCode =
      typeof ui?.sdkCode === 'string' ? ui.sdkCode : undefined;
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
