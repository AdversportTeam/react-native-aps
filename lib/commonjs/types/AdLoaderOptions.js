"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAdLoaderOptions = validateAdLoaderOptions;

var _AdSlot = require("./AdSlot");

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function validateAdLoaderOptions(adLoaderOptions) {
  if (typeof adLoaderOptions !== 'object') {
    throw new Error("'adLoaderOptions' expected an object value");
  }

  if (!Array.isArray(adLoaderOptions.slots)) {
    throw new Error("'adLoaderOptions.slots' expected an array of AdSlot values");
  }

  adLoaderOptions.slots.forEach((adSlot, index) => {
    try {
      (0, _AdSlot.validateAdSlot)(adSlot);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`'adLoaderOptions.slots[${index}]${e.message.substring(7)}`);
      }
    }
  });
}
//# sourceMappingURL=AdLoaderOptions.js.map