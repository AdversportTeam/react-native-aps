"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAdSlot = validateAdSlot;

var _AdType = require("./AdType");

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const sizeRegex = /([0-9]+)x([0-9]+)/;

function validateAdSlot(adSlot) {
  if (typeof adSlot !== 'object') {
    throw new Error("'adSlot' expected an object value");
  }

  if (typeof adSlot.slotUUID !== 'string') {
    throw new Error("'adSlot.slotUUID' expected a string value");
  }

  if (!(0, _AdType.isAdType)(adSlot.type)) {
    throw new Error("'adSlot.type' expected one of AdType values");
  }

  if (adSlot.type === _AdType.AdType.BANNER && (!adSlot.size || !sizeRegex.test(adSlot.size))) {
    throw new Error("'adSlot.size' expected a valid size string.");
  }
}
//# sourceMappingURL=AdSlot.js.map