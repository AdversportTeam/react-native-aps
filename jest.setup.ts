import * as ReactNative from 'react-native';

import type { AdLoaderOptions } from './src/types';

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
          loadAd: jest.fn((options: AdLoaderOptions) => {
            if (options.slotUUID === 'ad-error-throwing-slot-uuid') {
              throw {
                code: 'mock_ad_error',
                message: 'AdError mocked successfully.',
                userInfo: {
                  code: 'mock_ad_error',
                  message: 'AdError mocked successfully.',
                },
              };
            }
            return Promise.resolve({ key: 'value' });
          }),
        },
        RNAPSAdsModule: {
          initialize: jest.fn((_) => Promise.resolve()),
          setAdNetworkInfo: jest.fn(),
          setMRAIDSupportedVersions: jest.fn(),
          setMRAIDPolicy: jest.fn(),
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
