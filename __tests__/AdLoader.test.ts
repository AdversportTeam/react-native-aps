import { AdError } from '../src/AdError';
import { AdLoader } from '../src/AdLoader';
import { AdType } from '../src/types';
import { TestIds } from '../src/TestIds';

describe('AdLoader', function () {
  describe('loadAd', function () {
    it('throws if adLoaderOptions is invalid', function () {
      // @ts-ignore
      expect(AdLoader.loadAd(123)).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions' expected an object value"
      );
    });
    it('throws if slotUUID is invalid', function () {
      // @ts-ignore
      expect(AdLoader.loadAd({ slotUUID: 123 })).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].slotUUID' expected a string value"
      );
    });
    it('throws if type is invalid', function () {
      expect(
        // @ts-ignore
        AdLoader.loadAd({ slotUUID: 'uuid', type: 'invalid' })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].type' expected one of AdType values"
      );
    });
    it('throws if size is invalid', function () {
      expect(
        // @ts-ignore
        AdLoader.loadAd({ slotUUID: 'uuid', type: AdType.BANNER })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].size' expected a valid size string"
      );
      expect(
        // @ts-ignore
        AdLoader.loadAd({
          slotUUID: 'uuid',
          type: AdType.BANNER,
          size: 'invalid',
        })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].size' expected a valid size string"
      );
    });
    it('throws AdError if got native Error', function () {
      expect(
        AdLoader.loadAd({
          slotUUID: 'ad-error-throwing-slot-uuid',
          type: AdType.BANNER,
          size: '320x50',
        })
      ).rejects.toBeInstanceOf(AdError);
    });
    it('returns Promise with key value pair', function () {
      expect(
        AdLoader.loadAd({
          slotUUID: TestIds.APS_SLOT_BANNER,
          type: AdType.BANNER,
          size: '320x50',
        })
      ).resolves.toReturnWith({ key: 'value' });
    });
  });
});
