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
