/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This file is part of react-native-aps.
 *
 * react-native-aps is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * react-native-aps is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Foobar. If not, see <https://www.gnu.org/licenses/>.
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
