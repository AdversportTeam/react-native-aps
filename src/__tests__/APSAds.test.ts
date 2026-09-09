import { APSAds } from '../APSAds';
import AdsModule from '../internal/AdsModule';
import { AdNetwork, MRAIDPolicy } from '../types';

jest.mock('../internal/AdsModule');

describe('APSAds', function () {
  describe('initialize', function () {
    it('throws if appKey is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.initialize(123)).toThrowError(
        "APSAds.initialze(*) 'appKey' expected a string value"
      );
    });
    it('returns Promise of void', async function () {
      await expect(APSAds.initialize('appKey')).resolves.toBeUndefined();
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
    it('returns nothing', function () {
      expect(APSAds.setMRAIDSupportedVersions(['1.0'])).toBeUndefined();
    });
  });
  describe('setMRAIDPolicy', function () {
    it('throws if policy is invalid', function () {
      // @ts-ignore
      expect(() => APSAds.setMRAIDPolicy(123)).toThrowError(
        "APSAds.setMRAIDPolicy(*) 'policy' expected one of MRAIDPolicy values"
      );
    });
    it('returns nothing', function () {
      expect(APSAds.setMRAIDPolicy(MRAIDPolicy.DFP)).toBeUndefined();
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
  describe('setExternalUserIds', function () {
    const anId5Eid = {
      source: 'id5-sync.com',
      uids: [{ id: 'ID5*abc', atype: 2, ext: { linkType: '2' } }],
    };

    it('throws if externalUserIds is not an array', function () {
      // @ts-ignore
      expect(() => APSAds.setExternalUserIds('nope')).toThrowError(
        "APSAds.setExternalUserIds(*) 'externalUserIds' expected an array value"
      );
    });
    it('throws if source is missing', function () {
      expect(() =>
        // @ts-ignore
        APSAds.setExternalUserIds([{ uids: [{ id: 'a' }] }])
      ).toThrowError(
        "APSAds.setExternalUserIds(*) 'externalUserIds[0].source' expected a string value"
      );
    });
    it('throws if uids is empty', function () {
      expect(() =>
        APSAds.setExternalUserIds([{ source: 'id5-sync.com', uids: [] }])
      ).toThrowError(
        "APSAds.setExternalUserIds(*) 'externalUserIds[0].uids' expected a non-empty array value"
      );
    });
    it('throws if a uid has no id', function () {
      expect(() =>
        APSAds.setExternalUserIds([
          // @ts-ignore
          { source: 'id5-sync.com', uids: [{ atype: 2 }] },
        ])
      ).toThrowError(
        "APSAds.setExternalUserIds(*) 'externalUserIds[0].uids[0].id' expected a string value"
      );
    });
    it('accepts an eid as returned by the issuer, untouched', function () {
      expect(APSAds.setExternalUserIds([anId5Eid])).toBeUndefined();
      expect(AdsModule.setExternalUserIds).toHaveBeenCalledWith([anId5Eid]);
    });
    it('accepts an empty array, which clears the ids', function () {
      expect(APSAds.setExternalUserIds([])).toBeUndefined();
      expect(AdsModule.setExternalUserIds).toHaveBeenCalledWith([]);
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
