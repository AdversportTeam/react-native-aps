import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AdNetwork, APSAds, MRAIDPolicy, TestIds } from 'react-native-aps';

export default function Banner() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    APSAds.initialize(TestIds.APS_APP_KEY).then(() => {
      APSAds.setAdNetworkInfo({ adNetwork: AdNetwork.GOOGLE_AD_MANAGER });
      APSAds.setMRAIDPolicy(MRAIDPolicy.DFP);
      APSAds.setTestMode(true);
      setInitialized(true);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text testID="initStatus_text">{`initialized : ${initialized}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
