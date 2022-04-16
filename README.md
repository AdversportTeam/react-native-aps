<p align="center">
  <a href="https://github.com/AdversportTeam/react-native-aps/README.md">
    <img width="500px" src="./docs/img/logo_aps.png"><br/>
  </a>
  <h2 align="center">React Native Amazon Publisher Services</h2>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-aps"><img src="https://img.shields.io/npm/v/react-native-aps.svg?style=flat-square" alt="NPM version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/npm/l/react-native-aps.svg?style=flat-square" alt="License"></a>
</p>

---

**React Native Amazon Publisher Services** allows you to add demand partners via Amazon Publisher Services; a React Native wrapper around the native Amazon Publisher Services SDKs for both iOS and Android.

## Installation

```sh
npm install react-native-aps
cd ios && bundle exec pod install
```

## Usage

### Initializing APS Ads SDK

```js
import APSAds, { AdNetwork, MRAIDPolicy, TestIds } from 'react-native-aps';

// ...

APSAds.initialize(TestIds.APS_APP_KEY)
  .then(() => {
    APSAds.setAdNetworkInfo({ adNetwork: AdNetwork.GOOGLE_AD_MANAGER }); // Primary ad server / mediation
    APSAds.setMRAIDPolicy(MRAIDPolicy.DFP); // DFP for Google Ad Manager, Custom for others.
    APSAds.setMRAIDSupportedVersions(['1.0', '2.0', '3.0']);
    APSAds.setTestMode(true);
  })
```

#### Set your app id/key

First, you need to initialize SDK with your APS app id/key by calling `APSAds.initialize`.

```js
APSAds.initialize(TestIds.APS_APP_KEY);
```

#### Ad server/mediator identifier

Then, you must pass your primary ad server or mediator information with `APSAds.setAdNetworkInfo`.

List of possible ad networks:

```js
AdNetwork.GOOGLE_AD_MANAGER
AdNetwork.ADMOB
AdNetwork.AD_GENERATION
AdNetwork.IRON_SOURCE
AdNetwork.MAX
AdNetwork.NIMBUS
AdNetwork.OTHER
```

#### MRAID

You also need to pass MRAID info. For Google Ad Manager, you can skip this part.

For others, pass `MRAIDPolicy.CUSTOM` to `APSAds.setMRAIDPolicy` like following:

```js
APSAds.setMRAIDPolicy(MRAIDPolicy.CUSTOM);
```

Then, pass supported MRAID versions of your ad server to `setMRAIDSupportedVersions`.

```js
setMRAIDSupportedVersions(['1.0', '2.0', '3.0']);
```

#### Geo location tracking

If your app collects geo location to track users, you should call `setUseGeolocation`.

```js
setUseGeolocation(true); // false by default
```

#### Test mode

To enable test mode, call `setTestMode`.

```js
setTestMode(true); // false by default
```

Do not forget to remove or pass `false` to `setTestMode` in production, as the test ads are not eligible for monetization.

#### Custom attributes

You can also add/remove custom attributes by calling `addCustomAttribute` and `removeCustomAttribute`.
You can use this methods to pass contextual parameters or pass the OMID Partner information. More information is available in the APS SDK documentation.

```js

```js
addCustomAttribute('key', 'value');
removeCustomAttribute('key');
```

### Requesting Bid (Key-Value pairs)

Below example shows displaying banner ad with `react-native-google-mobile-ads` library.

```js
import {
  AdLoader,
  AdLoaderOptions,
  AdType,
  isAdError,
  TestIds,
} from 'react-native-aps';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// ...

const apsOptions: AdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_BANNER_320x50,
  type: AdType.BANNER,
  size: '320x50',
};

AdLoader.loadAd(apsOptions)
  .then((result) => {
    setApsBidResult(result);
  })
  .catch((error) => {
    if (isAdError(error)) {
      console.debug(error);
    }
  })
  .finally(() => {
    setApsBidDone(true);
  });

// ...

<View>
  {apsBidDone && (
    <BannerAd
      unitId={TestIds.GAM_BANNER}
      size={BannerAdSize.BANNER}
      requestOptions={{ customTargeting: apsBidResult }}
    />
  )}
</View>
```

#### Requesting Bid

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
