/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const MRAIDPolicy = {
  NONE: 'NONE',
  AUTO_DETECT: 'AUTO_DETECT',
  DFP: 'DFP',
  CUSTOM: 'CUSTOM'
};
export function isMRAIDPolicy(value) {
  return Object.values(MRAIDPolicy).includes(value);
}
//# sourceMappingURL=MRAIDPolicy.js.map