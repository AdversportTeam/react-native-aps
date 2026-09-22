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
 * Per-request options of `AdLoader.loadAd`.
 */
export interface LoadAdOptions {
  /**
   * Order among the requests waiting for a free slot of the native SDK: lower
   * is emitted first, ties keep arrival order. Only matters while requests
   * queue, i.e. when more are pending than the SDK serves concurrently (see
   * `bidRequestConcurrency`). Default 0.
   */
  priority?: number;
  /**
   * Aborts the request while it is still queued: it is never handed to the
   * SDK and the promise rejects with an AdError `aborted`. Ignored once the
   * request is emitted, the SDK cannot cancel it; drop its answer on your side.
   */
  signal?: AbortSignal;
}

/**
 * @internal
 */
export function validateLoadAdOptions(options: unknown): LoadAdOptions {
  if (options === undefined) {
    return {};
  }
  if (
    typeof options !== 'object' ||
    options === null ||
    Array.isArray(options)
  ) {
    throw new Error("'options' expected an object value");
  }
  const { priority, signal } = options as LoadAdOptions;
  if (priority !== undefined && !Number.isFinite(priority)) {
    throw new Error("'options.priority' expected a finite number");
  }
  if (
    signal !== undefined &&
    (typeof signal !== 'object' ||
      signal === null ||
      typeof (signal as AbortSignal).aborted !== 'boolean' ||
      typeof (signal as AbortSignal).addEventListener !== 'function' ||
      typeof (signal as AbortSignal).removeEventListener !== 'function')
  ) {
    throw new Error("'options.signal' expected an AbortSignal");
  }
  return options as LoadAdOptions;
}
