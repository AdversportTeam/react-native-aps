import { APSAds } from '../src/APSAds';
import { AdNetwork } from '../src/types';

describe('APSAds', function () {
  describe('initialize', function () {
    it('throws if appKey is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.initialize(123)).toThrowError(
        "APSAds.initialze(*) 'appKey' expected a string value"
      );
    });
    it('returns Promise of void', function () {
      expect(APSAds.initialize('appKey')).resolves.toBeUndefined();
    });
  });
  describe('setAdNetworkInfo', function () {
    it('throws if adNetworkInfo is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.setAdNetworkInfo(123)).toThrowError(
        "APSAds.setAdNetworkInfo(*) 'adNetworkInfo' expected an object value"
      );
    });
    it('throws if adNetwork is invalid', function () {
      expect(() =>
        // @ts-ignore
        APSAds.setAdNetworkInfo({ adNetwork: 'invalid' })
      ).toThrowError(
        "APSAds.setAdNetworkInfo(*) 'adNetworkInfo.adNetwork' expected one of AdNetwork values"
      );
    });
    it('throws if adNetworkProperties is invalid', function () {
      expect(() =>
        APSAds.setAdNetworkInfo({
          adNetwork: AdNetwork.ADMOB,
          // @ts-ignore
          adNetworkProperties: 123,
        })
      ).toThrowError(
        "APSAds.setAdNetworkInfo(*) 'adNetworkInfo.adNetworkProperties' expected an object value"
      );
    });
    it('returns nothing', function () {
      expect(
        APSAds.setAdNetworkInfo({ adNetwork: AdNetwork.ADMOB })
      ).toBeUndefined();
    });
  });
  describe('setMRAIDSupportedVersions', function () {
    it('throws if supportedVersions is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.setMRAIDSupportedVersions(123)).toThrowError(
        "APSAds.setMRAIDSupportedVersions(*) 'versions' expected an array of string values"
      );
    });
  });
  describe('setMRAIDPolicy', function () {
    it('throws if policy is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.setMRAIDPolicy(123)).toThrowError(
        "APSAds.setMRAIDPolicy(*) 'policy' expected one of MRAIDPolicy values"
      );
    });
  });
  describe('setTestMode', function () {
    it('throws if enabled is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.setTestMode(123)).toThrowError(
        "APSAds.setTestMode(*) 'enabled' expected a boolean value"
      );
    });
    it('returns nothing', function () {
      expect(APSAds.setTestMode(true)).toBeUndefined();
    });
  });
  describe('setUseGeoLocation', function () {
    it('throws if enabled is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.setUseGeoLocation(123)).toThrowError(
        "APSAds.setUseGeoLocation(*) 'enabled' expected a boolean value"
      );
    });
    it('returns nothing', function () {
      expect(APSAds.setUseGeoLocation(true)).toBeUndefined();
    });
  });
  describe('addCustomAttribute', function () {
    it('throws if key is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.addCustomAttribute(123, 'value')).toThrowError(
        "APSAds.addCustomAttribute(*) 'key' expected a string value"
      );
    });
    it('throws if value is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.addCustomAttribute('key', 123)).toThrowError(
        "APSAds.addCustomAttribute(_, *) 'value' expected a string value"
      );
    });
    it('returns nothing', function () {
      expect(APSAds.addCustomAttribute('key', 'value')).toBeUndefined();
    });
  });
  describe('removeCustomAttribute', function () {
    it('throws if key is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.removeCustomAttribute(123)).toThrowError(
        "APSAds.removeCustomAttribute(*) 'key' expected a string value"
      );
    });
    it('returns nothing', function () {
      expect(APSAds.removeCustomAttribute('key')).toBeUndefined();
    });
  });
});
