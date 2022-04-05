import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import APSAds, { AdNetwork, TestIds } from 'react-native-aps';
import MobileAds from 'react-native-google-mobile-ads';

import Banner from './Banner/Banner.component';
import Interstitial from './Interstitial/Interstitial.component';

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    Promise.all([
      MobileAds().initialize(),
      APSAds.initialize(TestIds.APS_APP_KEY),
    ]).then(() => {
      APSAds.setAdNetworkInfo({ adNetwork: AdNetwork.GOOGLE_AD_MANAGER });
      setInitialized(true);
    });
  }, []);

  return (
    <View>
      {initialized && (
        <>
          <Banner />
          <Interstitial />
        </>
      )}
    </View>
  );
}
