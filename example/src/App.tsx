import React, { useEffect } from 'react';
import { View } from 'react-native';
import MobileAds from 'react-native-google-mobile-ads';

import Banner from './Banner/Banner.component';
import Interstitial from './Interstitial/Interstitial.component';

export default function App() {
  useEffect(() => {
    MobileAds().initialize();
  }, []);
  return (
    <View>
      <Banner />
      <Interstitial />
    </View>
  );
}
