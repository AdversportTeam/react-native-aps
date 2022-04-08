"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AdsModule = _interopRequireDefault(require("./internal/AdsModule"));

var _AdNetworkInfo = require("./types/AdNetworkInfo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class APSAds {
  static initialize(appKey) {
    if (typeof appKey !== 'string') {
      throw new Error("APSAds.initialze(*) 'appKey' expected a string value");
    }

    return this._nativeModule.initialize(appKey);
  }

  static setAdNetworkInfo(adNetworkInfo) {
    try {
      (0, _AdNetworkInfo.validateAdNetworkInfo)(adNetworkInfo);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`APSAds.setAdNetworkInfo(*) ${e.message}`);
      }
    }

    return this._nativeModule.setAdNetworkInfo(adNetworkInfo);
  }

  static setTestMode(enabled) {
    if (typeof enabled !== 'boolean') {
      throw new Error("APSAds.setTestMode(*) 'enabled' expected a boolean value");
    }

    return this._nativeModule.setTestMode(enabled);
  }

  static setUseGeoLocation(enabled) {
    if (typeof enabled !== 'boolean') {
      throw new Error("APSAds.setUseGeoLocation(*) 'enabled' expected a boolean value");
    }

    return this._nativeModule.setUseGeoLocation(enabled);
  }

  static addCustomAttribute(key, value) {
    if (typeof key !== 'string') {
      throw new Error("APSAds.addCustomAttribute(*) 'key' expected a string value");
    }

    if (typeof value !== 'string') {
      throw new Error("APSAds.addCustomAttribute(_, *) 'value' expected a string value");
    }

    return this._nativeModule.addCustomAttribute(key, value);
  }

  static removeCustomAttribute(key) {
    if (typeof key !== 'string') {
      throw new Error("APSAds.removeCustomAttribute(*) 'key' expected a string value");
    }

    return this._nativeModule.removeCustomAttribute(key);
  }

}

exports.default = APSAds;

_defineProperty(APSAds, "_nativeModule", _AdsModule.default);
//# sourceMappingURL=APSAds.js.map