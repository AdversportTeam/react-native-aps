/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @public
 */
export const MRAIDPolicy = {
  NONE: 'NONE',
  DFP: 'DFP',
  CUSTOM: 'CUSTOM'
};
/**
 * @public
 */

/**
 * @internal
 */
export function isMRAIDPolicy(value) {
  return Object.values(MRAIDPolicy).includes(value);
}
//# sourceMappingURL=MRAIDPolicy.js.map