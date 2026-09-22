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

import { Platform } from 'react-native';
import { AdError } from '../AdError';
import type { BidRequestQueueStats } from '../types/BidRequestQueueStats';

/**
 * Floor of the delay the queue waits for the native side to answer a bid
 * request it emitted, measured from emission (bridge hop and SDK dispatch
 * included). The Android SDK bounds its own HTTP call with a 1 s connect
 * timeout and a read timeout equal to the bid timeout, 5 s by default and
 * server-configurable; the queue takes `bidTimeout + 3 s` when the SDK reports
 * it, this floor otherwise. A promise still pending past that point is one the
 * native side will never settle: it is rejected with an AdError `no_response`
 * and its slot of the concurrency cap is freed. A late native answer, which
 * can still happen on a slow network, is then ignored by the promise but
 * still reaches `addListener` listeners.
 */
export const BID_REQUEST_NO_RESPONSE_MS = 8000;

/** Margin added to the SDK bid timeout to derive the no-response delay. */
const NO_RESPONSE_MARGIN_MS = 3000;

/** Priority of a request that does not set one. Lower is emitted first. */
export const DEFAULT_BID_REQUEST_PRIORITY = 0;

type Entry = {
  loaderId: number;
  priority: number;
  seq: number;
  emit: () => void;
  cancel: (error: AdError) => void;
};

const defaultConcurrency = () =>
  Platform.OS === 'android' ? 1 : Number.POSITIVE_INFINITY;

let concurrency = defaultConcurrency();
let noResponseMs = BID_REQUEST_NO_RESPONSE_MS;
let inFlight = 0;
let seqCounter = 0;
const queue: Entry[] = [];

let emitted = 0;
let abortedBeforeEmit = 0;
let unanswered = 0;
let maxQueueDepth = 0;

/**
 * Sets how many bid requests may be in flight on the native side. Called by
 * `APSAds.initialize` with what the SDK really serves; a raised value drains the
 * queue immediately.
 */
export function setBidRequestConcurrency(value: number): void {
  if (
    value === Number.POSITIVE_INFINITY ||
    (Number.isInteger(value) && value >= 1)
  ) {
    concurrency = value;
    pump();
  }
}

/**
 * Derives the no-response delay from the bid timeout the SDK reports (Android
 * persists the server value); anything not above the floor keeps the floor.
 */
export function setBidRequestTimeout(bidTimeoutMs: number | undefined): void {
  if (Number.isFinite(bidTimeoutMs) && (bidTimeoutMs as number) > 0) {
    noResponseMs = Math.max(
      BID_REQUEST_NO_RESPONSE_MS,
      (bidTimeoutMs as number) + NO_RESPONSE_MARGIN_MS
    );
  }
}

export function getBidRequestQueueStats(): BidRequestQueueStats {
  return {
    concurrency,
    noResponseMs,
    inFlight,
    queued: queue.length,
    emitted,
    abortedBeforeEmit,
    unanswered,
    maxQueueDepth,
  };
}

/** Test only. */
export function resetBidRequestQueue(): void {
  concurrency = defaultConcurrency();
  noResponseMs = BID_REQUEST_NO_RESPONSE_MS;
  inFlight = 0;
  seqCounter = 0;
  queue.length = 0;
  emitted = 0;
  abortedBeforeEmit = 0;
  unanswered = 0;
  maxQueueDepth = 0;
}

/**
 * Drops every queued request of a loader (`stopAutoRefresh` before emission).
 * Requests already handed to the native side are not affected.
 */
export function abortQueuedBidRequests(loaderId: number, reason: string): void {
  for (let i = queue.length - 1; i >= 0; i--) {
    const entry = queue[i];
    if (entry && entry.loaderId === loaderId) {
      queue.splice(i, 1);
      entry.cancel(new AdError('aborted', reason));
    }
  }
}

const pump = () => {
  while (inFlight < concurrency && queue.length > 0) {
    // A handful of entries per screen: sorting on every dequeue is cheaper
    // than a heap. Ties keep arrival order.
    queue.sort((a, b) => a.priority - b.priority || a.seq - b.seq);
    const next = queue.shift();
    if (next) {
      next.emit();
    }
  }
};

type EnqueueArgs<T> = {
  loaderId: number;
  priority: number;
  signal?: AbortSignal;
  /** The native call. */
  run: () => Promise<T>;
};

/**
 * Runs one bid request under the concurrency cap.
 *
 * - Emitted at once when a slot is free, otherwise queued by priority (lower
 *   first, then arrival order).
 * - Rejected with AdError `aborted` if `signal` fires, or `stopAutoRefresh` is
 *   called, while it is still queued. Once emitted, an abort is ignored: the SDK
 *   cannot cancel a request it has accepted.
 * - Rejected with AdError `no_response` when the native side has not settled
 *   the request within BID_REQUEST_NO_RESPONSE_MS. A late native answer is then
 *   ignored.
 */
export function enqueueBidRequest<T>({
  loaderId,
  priority,
  signal,
  run,
}: EnqueueArgs<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      abortedBeforeEmit += 1;
      reject(new AdError('aborted', 'Bid request aborted before emission'));
      return;
    }

    let onAbort: (() => void) | undefined;
    const detach = () => {
      if (signal && onAbort) {
        signal.removeEventListener('abort', onAbort);
        onAbort = undefined;
      }
    };

    const entry: Entry = {
      loaderId,
      priority,
      seq: seqCounter,
      emit: () => {
        detach();
        inFlight += 1;
        emitted += 1;

        // Settles this request THEN pumps the next one: the caller's promise
        // must not depend on what the next entry does.
        let settled = false;
        const finish = (settle: () => void) => {
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timer);
          inFlight -= 1;
          settle();
          pump();
        };
        const delay = noResponseMs;
        const timer = setTimeout(() => {
          finish(() => {
            unanswered += 1;
            reject(
              new AdError(
                'no_response',
                `No answer from the native side within ${delay} ms`
              )
            );
          });
        }, delay);

        let native: Promise<T>;
        try {
          native = Promise.resolve(run());
        } catch (error) {
          native = Promise.reject(error);
        }
        native.then(
          (value) => finish(() => resolve(value)),
          (error) => finish(() => reject(error))
        );
      },
      cancel: (error) => {
        detach();
        abortedBeforeEmit += 1;
        reject(error);
      },
    };
    seqCounter += 1;

    if (signal) {
      onAbort = () => {
        const index = queue.indexOf(entry);
        if (index >= 0) {
          queue.splice(index, 1);
          entry.cancel(
            new AdError('aborted', 'Bid request aborted before emission')
          );
        }
      };
      signal.addEventListener('abort', onAbort);
    }

    queue.push(entry);
    pump();
    // Measured after the pump: an entry emitted at once never waited.
    maxQueueDepth = Math.max(maxQueueDepth, queue.length);
  });
}
