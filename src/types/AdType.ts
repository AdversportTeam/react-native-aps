/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export enum AdType {
  BANNER = 'banner',
  INTERSTITIAL = 'interstitial',
}

export function isAdType(value: any): value is AdType {
  return Object.values(AdType).includes(value);
}
