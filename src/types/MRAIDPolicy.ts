/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const MRAIDPolicy = {
  NONE: 'NONE',
  DFP: 'DFP',
  CUSTOM: 'CUSTOM',
} as const;

export type MRAIDPolicy = typeof MRAIDPolicy[keyof typeof MRAIDPolicy];

export function isMRAIDPolicy(value: any): value is MRAIDPolicy {
  return Object.values(MRAIDPolicy).includes(value);
}
