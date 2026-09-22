import { NativeEventEmitter } from 'react-native';

import { AdError } from '../AdError';
import { AdLoader } from '../AdLoader';
import { TestIds } from '../TestIds';
import { AdLoaderEvent } from '../types/AdLoaderEvent';
import AdLoaderModule from '../internal/AdLoaderModule';
import {
  resetBidRequestQueue,
  setBidRequestConcurrency,
} from '../internal/BidRequestQueue';

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
    beforeEach(function () {
      resetBidRequestQueue();
      (AdLoaderModule.loadAd as jest.Mock).mockClear();
      (AdLoaderModule.stopAutoRefresh as jest.Mock).mockClear();
    });
    it('throws if options is invalid', function () {
      const adLoader = AdLoader.createBannerAdLoader({
        slotUUID: TestIds.APS_SLOT_BANNER_320x50,
        size: '320x50',
      });
      // @ts-ignore
      expect(() => adLoader.loadAd(123)).toThrowError(
        "AdLoader.loadAd(*) 'options' expected an object value"
      );
      // @ts-ignore
      expect(() => adLoader.loadAd({ priority: 'high' })).toThrowError(
        "AdLoader.loadAd(*) 'options.priority' expected a finite number"
      );
      // @ts-ignore
      expect(() => adLoader.loadAd({ signal: {} })).toThrowError(
        "AdLoader.loadAd(*) 'options.signal' expected an AbortSignal"
      );
      expect(() =>
        adLoader.loadAd({
          // @ts-ignore
          signal: { aborted: false, addEventListener: () => {} },
        })
      ).toThrowError(
        "AdLoader.loadAd(*) 'options.signal' expected an AbortSignal"
      );
    });
    it('rejects with an AdError aborted when the signal fires while queued', async function () {
      setBidRequestConcurrency(1);
      const blocking = AdLoader.createBannerAdLoader({
        slotUUID: TestIds.APS_SLOT_BANNER_320x50,
        size: '320x50',
      });
      const queued = AdLoader.createBannerAdLoader({
        slotUUID: TestIds.APS_SLOT_BANNER_320x50,
        size: '320x50',
      });
      let release!: (v: { [key: string]: string }) => void;
      (AdLoaderModule.loadAd as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((res) => {
            release = res;
          })
      );
      const first = blocking.loadAd();
      const controller = new AbortController();
      const second = queued.loadAd({ priority: 1, signal: controller.signal });
      controller.abort();
      await expect(second).rejects.toMatchObject({
        name: 'AdError',
        code: 'aborted',
      });
      release({ key: 'value' });
      await expect(first).resolves.toEqual({ key: 'value' });
      expect(AdLoaderModule.loadAd).toHaveBeenCalledTimes(1);
    });
    it('stopAutoRefresh drops a request still queued', async function () {
      setBidRequestConcurrency(1);
      const blocking = AdLoader.createBannerAdLoader({
        slotUUID: TestIds.APS_SLOT_BANNER_320x50,
        size: '320x50',
      });
      const queued = AdLoader.createBannerAdLoader({
        slotUUID: TestIds.APS_SLOT_BANNER_320x50,
        size: '320x50',
        autoRefresh: true,
      });
      let release!: (v: { [key: string]: string }) => void;
      (AdLoaderModule.loadAd as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((res) => {
            release = res;
          })
      );
      const first = blocking.loadAd();
      const second = queued.loadAd();
      queued.stopAutoRefresh();
      await expect(second).rejects.toMatchObject({ code: 'aborted' });
      release({ key: 'value' });
      await first;
      expect(AdLoaderModule.loadAd).toHaveBeenCalledTimes(1);
      expect(AdLoaderModule.stopAutoRefresh).toHaveBeenCalled();
    });
    it('exposes the queue stats', function () {
      expect(AdLoader.getQueueStats()).toMatchObject({
        concurrency: 1,
        noResponseMs: 8000,
        inFlight: 0,
        queued: 0,
      });
      expect(AdLoader.NO_RESPONSE_MS).toBe(8000);
    });
    it('drops the native one-shot request when it never answers', async function () {
      (jest.useFakeTimers as unknown as (config: object) => void)({
        doNotFake: ['performance'],
      });
      try {
        const adLoader = AdLoader.createBannerAdLoader({
          slotUUID: TestIds.APS_SLOT_BANNER_320x50,
          size: '320x50',
        });
        (AdLoaderModule.loadAd as jest.Mock).mockImplementationOnce(
          () => new Promise(() => {})
        );
        const pending = adLoader.loadAd();
        jest.advanceTimersByTime(AdLoader.NO_RESPONSE_MS);
        await expect(pending).rejects.toMatchObject({ code: 'no_response' });
        expect(AdLoaderModule.stopAutoRefresh).toHaveBeenCalledTimes(1);
      } finally {
        jest.useRealTimers();
      }
    });
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
