import { NativeEventEmitter } from 'react-native';

import { AdError } from '../AdError';
import { AdLoader } from '../AdLoader';
import { TestIds } from '../TestIds';
import { AdLoaderEvent } from '../types/AdLoaderEvent';

jest.mock('../internal/AdLoaderModule');

describe('AdLoader', function () {
  describe('createBannerAdLoader', function () {
    it('throws if adLoaderOptions is invalid', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createBannerAdLoader(123)
      ).toThrowError(
        "AdLoader.createBannerAdLoader(*) 'adLoaderOptions' expected an object value"
      );
    });
    it('throws if slotUUID is invalid', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createBannerAdLoader({ slotUUID: 123 })
      ).toThrowError(
        "AdLoader.createBannerAdLoader(*) 'adLoaderOptions.slotUUID' expected a string value"
      );
    });
    it('throws if size is invalid', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createBannerAdLoader({ slotUUID: 'uuid' })
      ).toThrowError(
        "AdLoader.createBannerAdLoader(*) 'adLoaderOptions.size' expected a valid size string"
      );
      expect(() =>
        // @ts-ignore
        AdLoader.createBannerAdLoader({
          slotUUID: 'uuid',
          size: 'invalid',
        })
      ).toThrowError(
        "AdLoader.createBannerAdLoader(*) 'adLoaderOptions.size' expected a valid size string"
      );
    });
  });

  describe('createInterstitialAdLoader', function () {
    it('throws if adLoaderOptions is invalid', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createInterstitialAdLoader(123)
      ).toThrowError(
        "AdLoader.createInterstitialAdLoader(*) 'adLoaderOptions' expected an object value"
      );
    });
  });

  describe('createVideoAdLoader', function () {
    it('throws if adLoaderOptions is invalid', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createVideoAdLoader(123)
      ).toThrowError(
        "AdLoader.createVideoAdLoader(*) 'adLoaderOptions' expected an object value"
      );
    });
    it('throws if slotUUID is invalid', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createVideoAdLoader({ slotUUID: 123 })
      ).toThrowError(
        "AdLoader.createVideoAdLoader(*) 'adLoaderOptions.slotUUID' expected a string value"
      );
    });
    it('throws if the player size is missing', function () {
      expect(() =>
        // @ts-ignore
        AdLoader.createVideoAdLoader({ slotUUID: 'uuid' })
      ).toThrowError(
        "AdLoader.createVideoAdLoader(*) 'adLoaderOptions.playerWidth' and 'adLoaderOptions.playerHeight' expected number values"
      );
    });
    it('throws if the player size is not numeric', function () {
      expect(() =>
        AdLoader.createVideoAdLoader({
          slotUUID: 'uuid',
          // @ts-ignore
          playerWidth: '640',
          playerHeight: 480,
        })
      ).toThrowError(
        "AdLoader.createVideoAdLoader(*) 'adLoaderOptions.playerWidth' and 'adLoaderOptions.playerHeight' expected number values"
      );
    });
    it('returns an AdLoader for a valid player size', function () {
      const adLoader = AdLoader.createVideoAdLoader({
        slotUUID: 'uuid',
        playerWidth: 640,
        playerHeight: 480,
      });
      expect(adLoader).toBeInstanceOf(AdLoader);
    });
  });

  describe('contentUrl', function () {
    it('throws if contentUrl is not a string', function () {
      expect(() =>
        AdLoader.createBannerAdLoader({
          slotUUID: 'uuid',
          size: '320x50',
          // @ts-ignore
          contentUrl: 123,
        })
      ).toThrowError(
        "AdLoader.createBannerAdLoader(*) 'adLoaderOptions.contentUrl' expected a string value"
      );
    });

    it('accepts a valid contentUrl and keeps it on the loader options', function () {
      const adLoader = AdLoader.createBannerAdLoader({
        slotUUID: 'uuid',
        size: '320x50',
        contentUrl: 'https://www.example.com/article/12345',
      });
      expect(adLoader.adLoaderOptions.contentUrl).toBe(
        'https://www.example.com/article/12345'
      );
    });

    it('is optional — omitting it stays valid', function () {
      const adLoader = AdLoader.createBannerAdLoader({
        slotUUID: 'uuid',
        size: '320x50',
      });
      expect(adLoader.adLoaderOptions.contentUrl).toBeUndefined();
    });

    it('is accepted on interstitial loaders too', function () {
      const adLoader = AdLoader.createInterstitialAdLoader({
        slotUUID: 'uuid',
        contentUrl: 'https://www.example.com/article/12345',
      });
      expect(adLoader.adLoaderOptions.contentUrl).toBe(
        'https://www.example.com/article/12345'
      );
    });
  });

  describe('addListener', function () {
    const adLoader = AdLoader.createBannerAdLoader({
      slotUUID: TestIds.APS_SLOT_BANNER_320x50,
      size: '320x50',
    });
    it('throws if eventName is invalid', function () {
      expect(() =>
        // @ts-ignore
        adLoader.addListener('invalid', () => {})
      ).toThrowError(
        "AdLoader.addListener(*) 'eventName' expected one of AdLoaderEvent values"
      );
    });
    it('throws if listener is invalid', function () {
      expect(() =>
        // @ts-ignore
        adLoader.addListener(AdLoaderEvent.SUCCESS, 123)
      ).toThrowError(
        "AdLoader.addListener(_, *) 'listener' expected a function"
      );
    });
    it('ignores different loaderIds', function () {
      const mockListener = jest.fn();
      adLoader.addListener(AdLoaderEvent.SUCCESS, mockListener);
      const emitter = new NativeEventEmitter();
      emitter.emit(AdLoaderEvent.SUCCESS, {
        loaderId: -1,
      });
      expect(mockListener).not.toBeCalled();
    });
    it('returns AdError if got native Error', function () {
      const mockError = {
        userInfo: {
          code: 'mock_ad_error',
          message: 'AdError mocked successfully.',
        },
      };
      const mockListener = jest.fn();
      adLoader.addListener(AdLoaderEvent.FAILURE, mockListener);
      const emitter = new NativeEventEmitter();
      emitter.emit(AdLoaderEvent.FAILURE, {
        // @ts-ignore
        loaderId: adLoader.loaderId,
        userInfo: mockError.userInfo,
      });
      expect(mockListener).toBeCalledWith(AdError.fromNativeError(mockError));
    });
  });

  describe('loadAd', function () {
    it('throws AdError if got native Error', async function () {
      const adLoader = AdLoader.createBannerAdLoader({
        slotUUID: 'ad-error-throwing-slot-uuid',
        size: '320x50',
      });
      await expect(adLoader.loadAd()).rejects.toBeInstanceOf(AdError);
    });
    it('returns Promise with key value pair', async function () {
      const adLoader = AdLoader.createBannerAdLoader({
        slotUUID: TestIds.APS_SLOT_BANNER_320x50,
        size: '320x50',
      });
      await expect(adLoader.loadAd()).resolves.toEqual({ key: 'value' });
    });
  });

  describe('skadnHelper', function () {
    it('throws if name is invalid', function () {
      // @ts-ignore
      expect(() => AdLoader.skadnHelper(123, 'info')).toThrowError(
        "AdLoader.skadnHelper(*) 'name' expected a string value"
      );
    });
    it('throws if info is invalid', function () {
      // @ts-ignore
      expect(() => AdLoader.skadnHelper('name', 123)).toThrowError(
        "AdLoader.skadnHelper(*) 'info' expected a string value"
      );
    });
    it('returns nothing', function () {
      expect(AdLoader.skadnHelper('name', 'info')).toBeUndefined();
    });
  });
});
