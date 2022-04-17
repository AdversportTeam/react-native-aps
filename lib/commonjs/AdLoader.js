"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdLoader = void 0;

var _AdError = require("./AdError");

var _AdLoaderModule = _interopRequireDefault(require("./internal/AdLoaderModule"));

var _AdLoaderOptions = require("./types/AdLoaderOptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @public
 */
class AdLoader {
  /**
   * Request APS for a bid. Only a single ad size and slotUUID is supported per bid request.
   * @param adLoaderOptions - `AdLoaderOptions` object used to configure the bid request.
   * @returns Key value pairs of returned bid response.
   *
   * @public
   */
  static async loadAd(adLoaderOptions) {
    try {
      (0, _AdLoaderOptions.validateAdLoaderOptions)(adLoaderOptions);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`AdLoader.loadAd(*) ${e.message}`);
      }
    }

    try {
      return await AdLoader._nativeModule.loadAd(adLoaderOptions);
    } catch (error) {
      if (error.userInfo) {
        throw _AdError.AdError.fromNativeError(error);
      } else {
        throw error;
      }
    }
  }

}

exports.AdLoader = AdLoader;

_defineProperty(AdLoader, "_nativeModule", _AdLoaderModule.default);
//# sourceMappingURL=AdLoader.js.map