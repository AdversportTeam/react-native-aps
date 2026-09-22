import { AdError } from '../AdError';
import {
  BID_REQUEST_NO_RESPONSE_MS,
  abortQueuedBidRequests,
  enqueueBidRequest,
  getBidRequestQueueStats,
  resetBidRequestQueue,
  setBidRequestConcurrency,
  setBidRequestTimeout,
} from '../internal/BidRequestQueue';

/** Deferred whose settlement the test drives by hand. */
const controllable = <T>() => {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

// Promise callbacks are microtasks: a few turns settle everything the queue
// chained, without touching the (faked) timers.
const flush = async () => {
  for (let i = 0; i < 6; i++) {
    await Promise.resolve();
  }
};

const request = (
  priority: number,
  run: () => Promise<string>,
  extra: { loaderId?: number; signal?: AbortSignal } = {}
) =>
  enqueueBidRequest({
    loaderId: extra.loaderId ?? 1,
    priority,
    signal: extra.signal,
    run,
  });

// jest 28 runs here with @types/jest 27, whose signature predates the object
// form. Modern fake timers must leave `performance` alone (read-only on Node
// 20) and `setImmediate` real is not needed: flush() only spins microtasks.
const useModernFakeTimers = () =>
  (jest.useFakeTimers as unknown as (config: object) => void)({
    doNotFake: ['performance'],
  });

describe('BidRequestQueue', function () {
  beforeEach(function () {
    useModernFakeTimers();
    resetBidRequestQueue();
    setBidRequestConcurrency(1);
  });
  afterEach(function () {
    jest.useRealTimers();
  });

  describe('concurrency cap', function () {
    it('keeps a single native call in flight with concurrency 1 (Android default)', async function () {
      const first = controllable<string>();
      const runA = jest.fn(() => first.promise);
      const runB = jest.fn(() => Promise.resolve('B'));

      const a = request(0, runA);
      const b = request(0, runB);
      await flush();

      expect(runA).toHaveBeenCalledTimes(1);
      expect(runB).not.toHaveBeenCalled();
      expect(getBidRequestQueueStats()).toMatchObject({
        inFlight: 1,
        queued: 1,
      });

      first.resolve('A');
      await expect(a).resolves.toBe('A');
      await flush();
      expect(runB).toHaveBeenCalledTimes(1);
      await expect(b).resolves.toBe('B');
      expect(getBidRequestQueueStats().inFlight).toBe(0);
    });

    it('emits everything at once when unbounded (iOS)', async function () {
      setBidRequestConcurrency(Number.POSITIVE_INFINITY);
      const pending = [
        controllable<string>(),
        controllable<string>(),
        controllable<string>(),
      ];
      const runs = pending.map((p) => jest.fn(() => p.promise));
      const results = runs.map((run, i) => request(2 - i, run));
      await flush();

      runs.forEach((run) => expect(run).toHaveBeenCalledTimes(1));
      expect(getBidRequestQueueStats().inFlight).toBe(3);
      pending.forEach((p, i) => p.resolve(`r${i}`));
      await expect(Promise.all(results)).resolves.toEqual(['r0', 'r1', 'r2']);
    });

    it('drains the queue as soon as the cap is raised (initialize reporting a widened pool)', async function () {
      const held = [
        controllable<string>(),
        controllable<string>(),
        controllable<string>(),
      ];
      const runs = held.map((p) => jest.fn(() => p.promise));
      runs.forEach((run) => request(0, run));
      await flush();
      expect(getBidRequestQueueStats().inFlight).toBe(1);

      setBidRequestConcurrency(3);
      await flush();
      expect(getBidRequestQueueStats().inFlight).toBe(3);
      runs.forEach((run) => expect(run).toHaveBeenCalledTimes(1));
    });

    it('ignores invalid concurrency values', function () {
      setBidRequestConcurrency(0);
      setBidRequestConcurrency(1.5);
      setBidRequestConcurrency(NaN);
      expect(getBidRequestQueueStats().concurrency).toBe(1);
    });

    it('surfaces a synchronous throw of the native call and frees the slot', async function () {
      const runThrows = jest.fn(() => {
        throw new Error('bridge missing');
      });
      const runB = jest.fn(() => Promise.resolve('B'));
      const a = request(0, runThrows);
      const b = request(0, runB);
      await expect(a).rejects.toThrow('bridge missing');
      await expect(b).resolves.toBe('B');
      expect(getBidRequestQueueStats().inFlight).toBe(0);
    });
  });

  describe('priority', function () {
    it('emits the lowest priority first when a slot frees up, arrival order on ties', async function () {
      const first = controllable<string>();
      const runA = jest.fn(() => first.promise);
      const runLow = jest.fn(() => Promise.resolve('low'));
      const runHigh = jest.fn(() => Promise.resolve('high'));
      const runLow2 = jest.fn(() => Promise.resolve('low2'));

      const a = request(2, runA);
      const low = request(2, runLow);
      const high = request(0, runHigh);
      const low2 = request(2, runLow2);
      await flush();

      expect(runA).toHaveBeenCalledTimes(1);
      expect(runHigh).not.toHaveBeenCalled();
      expect(getBidRequestQueueStats().queued).toBe(3);

      first.resolve('A');
      await a;
      await flush();
      // priority 0 jumps ahead of the two entries queued before it
      expect(runHigh).toHaveBeenCalledTimes(1);
      await high;
      await flush();
      expect(runLow).toHaveBeenCalledTimes(1);
      await low;
      await flush();
      expect(runLow2).toHaveBeenCalledTimes(1);
      await expect(low2).resolves.toBe('low2');
      expect(getBidRequestQueueStats()).toMatchObject({
        emitted: 4,
        maxQueueDepth: 3,
      });
    });

    it('does not count an entry emitted at once as queued (unbounded)', async function () {
      setBidRequestConcurrency(Number.POSITIVE_INFINITY);
      await expect(request(0, () => Promise.resolve('A'))).resolves.toBe('A');
      expect(getBidRequestQueueStats().maxQueueDepth).toBe(0);
    });
  });

  describe('abort', function () {
    it('never emits a request whose signal fired while it was queued', async function () {
      const first = controllable<string>();
      const runA = jest.fn(() => first.promise);
      const runB = jest.fn(() => Promise.resolve('B'));
      const runC = jest.fn(() => Promise.resolve('C'));
      const controller = new AbortController();

      const a = request(0, runA);
      const b = request(0, runB, { signal: controller.signal });
      const c = request(1, runC);
      await flush();

      controller.abort();
      await expect(b).rejects.toMatchObject({
        name: 'AdError',
        code: 'aborted',
      });
      expect(runB).not.toHaveBeenCalled();

      first.resolve('A');
      await a;
      await flush();
      expect(runC).toHaveBeenCalledTimes(1);
      await expect(c).resolves.toBe('C');
      expect(getBidRequestQueueStats()).toMatchObject({
        abortedBeforeEmit: 1,
        emitted: 2,
        queued: 0,
      });
    });

    it('rejects at once when the signal is already aborted', async function () {
      const controller = new AbortController();
      controller.abort();
      const run = jest.fn(() => Promise.resolve('A'));
      await expect(
        request(0, run, { signal: controller.signal })
      ).rejects.toBeInstanceOf(AdError);
      expect(run).not.toHaveBeenCalled();
    });

    it('ignores an abort once the request is emitted', async function () {
      const first = controllable<string>();
      const runA = jest.fn(() => first.promise);
      const controller = new AbortController();
      const a = request(0, runA, { signal: controller.signal });
      await flush();
      expect(runA).toHaveBeenCalledTimes(1);

      controller.abort();
      first.resolve('A');
      await expect(a).resolves.toBe('A');
      expect(getBidRequestQueueStats().abortedBeforeEmit).toBe(0);
    });

    it('drops the queued requests of a loader on abortQueuedBidRequests (stopAutoRefresh)', async function () {
      const first = controllable<string>();
      const runA = jest.fn(() => first.promise);
      const runB = jest.fn(() => Promise.resolve('B'));
      const runC = jest.fn(() => Promise.resolve('C'));

      const a = request(0, runA, { loaderId: 7 });
      const b = request(0, runB, { loaderId: 8 });
      const c = request(0, runC, { loaderId: 9 });
      await flush();

      abortQueuedBidRequests(8, 'stopped');
      await expect(b).rejects.toMatchObject({
        code: 'aborted',
        message: 'stopped',
      });
      expect(runB).not.toHaveBeenCalled();

      first.resolve('A');
      await expect(a).resolves.toBe('A');
      await expect(c).resolves.toBe('C');
    });
  });

  describe('settlement guarantee', function () {
    it('rejects with no_response and frees the slot when the native side never answers', async function () {
      const never = controllable<string>();
      const runA = jest.fn(() => never.promise);
      const runB = jest.fn(() => Promise.resolve('B'));

      const a = request(0, runA);
      const b = request(0, runB);
      await flush();
      expect(runB).not.toHaveBeenCalled();

      jest.advanceTimersByTime(BID_REQUEST_NO_RESPONSE_MS);
      await expect(a).rejects.toMatchObject({
        name: 'AdError',
        code: 'no_response',
      });
      await flush();
      expect(runB).toHaveBeenCalledTimes(1);
      await expect(b).resolves.toBe('B');
      expect(getBidRequestQueueStats()).toMatchObject({
        unanswered: 1,
        inFlight: 0,
      });

      // a late native answer is ignored, without an unhandled rejection
      never.reject(new Error('late'));
      await flush();
    });

    it('derives the delay from the SDK bid timeout when reported, never below the floor', async function () {
      expect(getBidRequestQueueStats().noResponseMs).toBe(
        BID_REQUEST_NO_RESPONSE_MS
      );
      setBidRequestTimeout(2000);
      expect(getBidRequestQueueStats().noResponseMs).toBe(
        BID_REQUEST_NO_RESPONSE_MS
      );
      setBidRequestTimeout(10000);
      expect(getBidRequestQueueStats().noResponseMs).toBe(13000);
      setBidRequestTimeout(undefined);
      setBidRequestTimeout(-1);
      expect(getBidRequestQueueStats().noResponseMs).toBe(13000);

      const never = controllable<string>();
      const a = request(0, () => never.promise);
      await flush();
      jest.advanceTimersByTime(BID_REQUEST_NO_RESPONSE_MS);
      await flush();
      expect(getBidRequestQueueStats().unanswered).toBe(0);
      jest.advanceTimersByTime(13000 - BID_REQUEST_NO_RESPONSE_MS);
      await expect(a).rejects.toMatchObject({ code: 'no_response' });
    });

    it('settles the caller before pumping the next entry', async function () {
      const first = controllable<string>();
      const order: string[] = [];
      const a = request(0, () => first.promise).then((v) => {
        order.push(`a:${v}`);
        return v;
      });
      const b = request(0, () => {
        order.push('b:emitted');
        return Promise.resolve('B');
      });
      await flush();
      first.resolve('A');
      await a;
      await b;
      // b is emitted synchronously right after a's resolve() call; a's own
      // continuation runs on the next microtask, so the emission comes first
      // in the log, but a's settlement was no longer contingent on b.
      expect(order).toEqual(['b:emitted', 'a:A']);
    });

    it('does not fire the no_response net when the native side answered in time', async function () {
      const first = controllable<string>();
      const a = request(0, () => first.promise);
      await flush();
      first.resolve('A');
      await expect(a).resolves.toBe('A');
      jest.advanceTimersByTime(BID_REQUEST_NO_RESPONSE_MS);
      expect(getBidRequestQueueStats().unanswered).toBe(0);
    });
  });
});
