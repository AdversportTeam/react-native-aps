import * as ReactNative from 'react-native';

jest.doMock('react-native', () => {
  return Object.setPrototypeOf(
    {
      Platform: {
        OS: 'android',
        select: () => {},
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        RNAPSAdLoaderModule: {
          loadAd: jest.fn(),
        },
        RNAPSAdsModule: {
          initialize: jest.fn(),
          setAdNetworkInfo: jest.fn(),
          setTestMode: jest.fn(),
          setUseGeoLocation: jest.fn(),
          addCustomAttribute: jest.fn(),
          removeCustomAttribute: jest.fn(),
        },
      },
    },
    ReactNative
  );
});
