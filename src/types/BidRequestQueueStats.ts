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
 * Counters of the bid request queue, see `AdLoader.getQueueStats`.
 */
export interface BidRequestQueueStats {
  /** Bid requests the native SDK is allowed to have in flight. */
  concurrency: number;
  /** Delay after which an emitted request with no native answer is rejected. */
  noResponseMs: number;
  inFlight: number;
  queued: number;
  /** Requests handed to the native side since startup. */
  emitted: number;
  /** Requests aborted (signal, stopAutoRefresh) while still queued: never emitted. */
  abortedBeforeEmit: number;
  /** Emitted requests the native side had not answered within `noResponseMs`. */
  unanswered: number;
  maxQueueDepth: number;
}
