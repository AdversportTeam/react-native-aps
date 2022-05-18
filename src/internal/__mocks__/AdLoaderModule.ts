import type { AdLoaderOptions } from '../../types/AdLoaderOptions';

const AdLoaderModule = {
  loadAd: jest.fn((_, __, options: AdLoaderOptions) => {
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
  stopAutoRefresh: jest.fn(),
  skadnHelper: jest.fn(),
};

export default AdLoaderModule;
