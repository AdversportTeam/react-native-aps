const AdsModule = {
  initialize: jest.fn((_) => Promise.resolve()),
  setAdNetworkInfo: jest.fn(),
  setMRAIDSupportedVersions: jest.fn(),
  setMRAIDPolicy: jest.fn(),
  setTestMode: jest.fn(),
  setUseGeoLocation: jest.fn(),
  addCustomAttribute: jest.fn(),
  removeCustomAttribute: jest.fn(),
};

export default AdsModule;
