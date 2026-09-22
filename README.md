<p align="center">
  <a href="https://github.com/AdversportTeam/react-native-aps/README.md">
    <img width="500px" src="./website/static/img/logo_aps.png" /><br/>
  </a>
  <h2 align="center">React Native Amazon Publisher Services</h2>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-aps"><img src="https://img.shields.io/npm/v/react-native-aps.svg?style=flat-square" alt="NPM version" /></a>
  <a href="/LICENSE"><img src="https://img.shields.io/npm/l/react-native-aps.svg?style=flat-square" alt="License" /></a>
  <a href="https://app.codecov.io/gh/AdversportTeam/react-native-aps/"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/AdversportTeam/react-native-aps?style=flat-square" /></a>
</p>

---

**React Native Amazon Publisher Services** allows you to add demand partners via Amazon Publisher Services; a React Native wrapper around the native Amazon Publisher Services SDKs for both iOS and Android.

## Documentation

- [Guides](https://AdversportTeam.github.io/react-native-aps/docs/guides)
- [API Reference](https://AdversportTeam.github.io/react-native-aps/docs/api)

## Content URL (Amazon DSP)

Amazon DSP requires in-app bid requests to carry the public web URL of the
content the user is viewing, so that AmazonAdBot can crawl the page and verify
what surrounds the ad. Inventory it cannot verify progressively loses
eligibility with Amazon advertisers.

Pass it per bid request through `contentUrl`:

```ts
const adLoader = AdLoader.createBannerAdLoader({
  slotUUID: 'your-slot-uuid',
  size: '320x50',
  contentUrl: 'https://yourdomain.com/article/12345',
});
```

The URL must match the in-app content — not a deep link, not a store URL, not
the app home page — and must be publicly reachable. Omit the option entirely
when you have no reliable URL: a missing field is neutral, a wrong one is an
active non-compliance signal.

### Platform support

| Platform | Behaviour |
| --- | --- |
| iOS | Applied through `+[APS setContentUrl:]`, immediately before `loadAd` and inside the same native call. |
| Android | **Ignored.** The Android APS SDK exposes no equivalent. |

Two caveats worth knowing on iOS:

- `+[APS setContentUrl:]` is a class method, so the value is process-global and
  **sticky** — it cannot be cleared, and the last URL set stays attached to
  subsequent requests until another one replaces it.
- The SDK throws an `NSException` in development builds when given an empty or
  nil value, so an empty `contentUrl` is skipped rather than forwarded.

Both the Android gap and the iOS stickiness have been raised with Amazon APS.

## Bid requests: concurrency and queue

The APS Android SDK runs every bid request, blocking HTTP call included, on a
single thread: concurrent `loadAd()` calls are answered one after another, in
call order. On a screen with several slots, the last one waits for the sum of
the previous latencies and can miss its render deadline while its answer is
still in the queue. The iOS SDK does not serialise requests.

### Widen the Android executor

`initialize` accepts an option that widens the SDK executor before anything
is queued:

```js
await APSAds.initialize(APS_APP_KEY, { bidRequestConcurrency: 3 });
```

- Android only; ignored on iOS.
- Integer between 1 and 16. Default 1 keeps the SDK behaviour.
- The executor is swapped by reflection, the SDK exposing no API for it. On
  any failure the SDK default is kept and the reason is reported, never thrown.
- Verified against aps-sdk 11.1.1, 12.0.1 and 12.0.2; a JVM unit test in the
  module pins the SDK members it relies on and proves three requests run at
  once (`cd example/android && ./gradlew :react-native-aps:testDebugUnitTest`,
  also run by the Android CI workflow).

Read back what the SDK really serves:

```js
const { concurrency, widened, detail } =
  await APSAds.getBidRequestExecutorStatus();
// Android: { concurrency: 3, widened: true } once widened,
//          { concurrency: 1, widened: false, detail: '...' } otherwise.
// iOS:     { concurrency: Infinity, widened: false, detail: '...' }.
```

### The request queue

`loadAd()` never hands the SDK more requests than it serves concurrently:
the rest wait in a queue sized by `initialize` on the value above (1 on
Android unless widened, unbounded on iOS). While a request waits it can be
ordered and aborted:

```js
const controller = new AbortController();

const kvs = await loader.loadAd({
  priority: 0,               // lower is emitted first, ties keep arrival order (default 0)
  signal: controller.signal, // aborts while queued: rejects with AdError `aborted`
});
```

- An abort after emission is ignored: the SDK cannot cancel a request it has
  accepted. Drop the answer on your side.
- The promise always settles. An emitted request the native side never answers
  is rejected with an AdError `no_response` and its slot is freed. The delay,
  measured from emission, is the SDK bid timeout plus 3 s when the SDK reports
  it (Android: 5 s by default, server-configurable, persisted by the SDK) and
  never below `AdLoader.NO_RESPONSE_MS` (8 s); `getQueueStats().noResponseMs`
  is the value in force. A late native answer still reaches `addListener`
  listeners.
- `stopAutoRefresh()` on a loader whose request is still queued drops it
  (AdError `aborted`). To get a single bid, use `autoRefresh: false` rather
  than stopping an auto-refreshing loader right after `loadAd()`.
- Auto-refresh re-requests are issued by the SDK itself and bypass the queue:
  on Android they share the SDK executor with queued requests.

`AdLoader.getQueueStats()` returns `{ concurrency, noResponseMs, inFlight,
queued, emitted, abortedBeforeEmit, unanswered, maxQueueDepth }` for your
debug screens.

Behaviour change since 2.5.0: `loadAd()` can now reject with the AdError codes
`aborted` and `no_response`, so give every call a `.catch`, as for `no_fill`.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

LGPL-3.0
