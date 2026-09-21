const AdsModule = {
  initialize: jest.fn((_, __) => Promise.resolve()),
  getBidRequestExecutorStatus: jest.fn(() =>
    Promise.resolve({ concurrency: 1, widened: false, detail: 'mock' })
  ),
  setAdNetworkInfo: jest.fn(),
  setMRAIDSupportedVersions: jest.fn(),
  setMRAIDPolicy: jest.fn(),
  setTestMode: jest.fn(),
  setUseGeoLocation: jest.fn(),
  addCustomAttribute: jest.fn(),
  removeCustomAttribute: jest.fn(),
  setExternalUserIds: jest.fn(),
};

export default AdsModule;
