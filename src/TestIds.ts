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

import { Platform } from 'react-native';

export const TestIds = {
  APS_APP_KEY: '',
  APS_SLOT_BANNER_320x50: '',
  APS_SLOT_BANNER_728x90: '',
  APS_SLOT_INTERSTITIAL: '',
  GAM_BANNER: '/116082170/Mobile_SampleApp',
  GAM_INTERSTITIAL: '/116082170/Mobile_SampleApp',
  ...Platform.select({
    android: {
      APS_APP_KEY: '7873ab072f0647b8837748312c7b8b5a',
      APS_SLOT_BANNER_320x50: 'ed3b9f16-4497-4001-be7d-2e8ca679ee73',
      APS_SLOT_BANNER_728x90: '9f44e677-c186-416b-8ef7-a4adf584ebcb',
      APS_SLOT_INTERSTITIAL: '394133e6-27fe-477d-816b-4a00cdaa54b6',
    },
    ios: {
      APS_APP_KEY: 'c5f20fe6e37146b08749d09bb2b6a4dd',
      APS_SLOT_BANNER_320x50: '88e6293b-0bf0-43fc-947b-925babe7bf3f',
      APS_SLOT_BANNER_728x90: '05474a0b-d343-471c-bdb0-07a9ed643074',
      APS_SLOT_INTERSTITIAL: '424c37b6-38e0-4076-94e6-0933a6213496',
    },
  }),
};
