"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MRAIDPolicy = void 0;
exports.isMRAIDPolicy = isMRAIDPolicy;

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const MRAIDPolicy = {
  NONE: 'NONE',
  AUTO_DETECT: 'AUTO_DETECT',
  DFP: 'DFP',
  CUSTOM: 'CUSTOM'
};
exports.MRAIDPolicy = MRAIDPolicy;

function isMRAIDPolicy(value) {
  return Object.values(MRAIDPolicy).includes(value);
}
//# sourceMappingURL=MRAIDPolicy.js.map