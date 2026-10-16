/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export enum MRAIDPolicy {
  NONE = 'NONE',
  DFP = 'DFP',
  CUSTOM = 'CUSTOM',
}

export function isMRAIDPolicy(value: any): value is MRAIDPolicy {
  return Object.values(MRAIDPolicy).includes(value);
}
