import { Platform } from 'react-native';

export const TestIds = {
  APS_SLOT_BANNER: '',
  APS_SLOT_INTERSTITIAL: '',
  GAM_BANNER: '/116082170/Mobile_SampleApp',
  GAM_INTERSTITIAL: '/116082170/Mobile_SampleApp',
  ...Platform.select({
    android: {
      APS_SLOT_BANNER: 'ed3b9f16-4497-4001-be7d-2e8ca679ee73',
      APS_SLOT_INTERSTITIAL: '394133e6-27fe-477d-816b-4a00cdaa54b6',
    },
    ios: {
      APS_SLOT_BANNER: '88e6293b-0bf0-43fc-947b-925babe7bf3f',
      APS_SLOT_INTERSTITIAL: '424c37b6-38e0-4076-94e6-0933a6213496',
    },
  }),
};
