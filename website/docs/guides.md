---
sidebar_position: 0
---

# Guides

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
addCustomAttribute('key', 'value');
removeCustomAttribute('key');
```

### Requesting Bid (Key-Value pairs)

Below example shows displaying banner ad with `react-native-google-mobile-ads` library.

```js
import {
  AdLoader,
  BannerAdLoaderOptions,
  TestIds,
} from 'react-native-aps';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

// ...

const apsOptions: BannerAdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_BANNER_320x50,
  size: '320x50',
};

const adLoader = AdLoader.createBannerAdLoader(apsOptions)
adLoader
  .loadAd()
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

#### Create ad loader

First, create AdLoader instance by calling `AdLoader.createBannerAdLoader` with `BannerAdLoaderOptions`.

```js
const adLoader = AdLoader.createBannerAdLoader({
  slotUUID: TestIds.APS_SLOT_BANNER_320x50,
  size: '320x50',
});
```

BannerAdLoaderOptions has following properties:
- `slotUUID`: The slotUUID of the ad slot.
- `size`: The size of the banner ad slot.
- `customTargeting`: The optional custom targeting key value pairs for the bid request.

#### Requesting Bid

Request bid to APS via calling `loadAd` method on `AdLoader` instance.

```js
adLoader
  .loadAd()
  .then((result) => {
    setApsBidResult(result);
  });
```

`AdLoader.loadAd` returns a promise that resolves to object containing key-value pairs. Using them, request ad with your ad server.

In case of Google Ad Manager, pass the key value pairs to `requestOptions.customTargeting`.

```js
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
