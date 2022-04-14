# react-native-aps

Amazon Publisher Services SDK for React Native

## Installation

```sh
npm install react-native-aps
cd ios && bundle exec pod install
```

## Usage

### Initializing APS Ads SDK

```js
import APSAds, { AdNetwork, TestIds } from 'react-native-aps';

// ...

APSAds.initialize(TestIds.APS_APP_KEY)
  .then(() => {
    APSAds.setAdNetworkInfo({ adNetwork: AdNetwork.GOOGLE_AD_MANAGER });
    APSAds.setTestMode(true);
  })
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
  slotUUID: TestIds.APS_SLOT_BANNER,
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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
