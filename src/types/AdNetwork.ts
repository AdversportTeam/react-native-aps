/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export enum AdNetwork {
  UNKNOWN = 'UNKNOWN',
  GOOGLE_AD_MANAGER = 'GOOGLE_AD_MANAGER',
  ADMOB = 'ADMOB',
  AD_GENERATION = 'AD_GENERATION',
  UNITY_LEVELPLAY = 'UNITY_LEVELPLAY',
  MAX = 'MAX',
  NIMBUS = 'NIMBUS',
  CUSTOM_MEDIATION = 'CUSTOM_MEDIATION',
  OTHER = 'OTHER',
}

export function isAdNetwork(value: any): value is AdNetwork {
  return Object.values(AdNetwork).includes(value);
}
