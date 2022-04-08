import { AdError } from '../AdError';
import { AdLoader } from '../AdLoader';
import { AdType } from '../types';
import { TestIds } from '../TestIds';

describe('AdLoader', function () {
  describe('loadAd', function () {
    it('throws if adLoaderOptions is invalid', function () {
      // @ts-ignore
      expect(AdLoader.loadAd(123)).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions' expected an object value"
      );
    });
    it('throws if slots is invalid', function () {
      // @ts-ignore
      expect(AdLoader.loadAd({ slots: 'invalid' })).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots' expected an array of AdSlot values"
      );
    });
    it('throws if adSlot is invalid', function () {
      expect(
        AdLoader.loadAd({
          slots: [
            // @ts-ignore
            'invalid',
          ],
        })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0]' expected an object value"
      );
    });
    it('throws if slotUUID is invalid', function () {
      expect(
        AdLoader.loadAd({
          slots: [
            // @ts-ignore
            { slotUUID: 123 },
          ],
        })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].slotUUID' expected a string value"
      );
    });
    it('throws if type is invalid', function () {
      expect(
        AdLoader.loadAd({
          slots: [
            // @ts-ignore
            { slotUUID: 'uuid', type: 'invalid' },
          ],
        })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].type' expected one of AdType values"
      );
    });
    it('throws if size is invalid', function () {
      expect(
        AdLoader.loadAd({
          slots: [
            // @ts-ignore
            { slotUUID: 'uuid', type: AdType.BANNER },
          ],
        })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].size' expected a valid size string"
      );
      expect(
        AdLoader.loadAd({
          slots: [
            // @ts-ignore
            { slotUUID: 'uuid', type: AdType.BANNER, size: 'invalid' },
          ],
        })
      ).rejects.toMatch(
        "AdLoader.loadAd(*) 'adLoaderOptions.slots[0].size' expected a valid size string"
      );
    });
    it('throws AdError if got native Error', function () {
      expect(
        AdLoader.loadAd({
          slots: [
            {
              slotUUID: 'ad-error-throwing-slot-uuid',
              type: AdType.BANNER,
              size: '320x50',
            },
          ],
        })
      ).rejects.toBeInstanceOf(AdError);
    });
    it('returns Promise with key value pair', function () {
      expect(
        AdLoader.loadAd({
          slots: [
            {
              slotUUID: TestIds.APS_SLOT_BANNER,
              type: AdType.BANNER,
              size: '320x50',
            },
          ],
        })
      ).resolves.toReturnWith({ key: 'value' });
    });
  });
});
