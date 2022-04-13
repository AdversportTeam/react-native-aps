import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import {
  AdLoader,
  AdLoaderOptions,
  AdType,
  isAdError,
  TestIds,
} from 'react-native-aps';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

const apsOptions: AdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_INTERSTITIAL,
  type: AdType.INTERSTITIAL,
};

export default function Interstitial() {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd>();
  const [isLoaded, setLoaded] = useState(false);

  const loadApsBid = () => {
    AdLoader.loadAd(apsOptions)
      .then((result) => {
        const interstitial = InterstitialAd.createForAdRequest(
          TestIds.GAM_INTERSTITIAL,
          {
            customTargeting: result,
          }
        );
        setInterstitialAd(interstitial);
      })
      .catch((error) => {
        if (isAdError(error)) {
          console.debug(error);
        }
        const interstitial = InterstitialAd.createForAdRequest(
          TestIds.GAM_INTERSTITIAL
        );
        setInterstitialAd(interstitial);
      });
  };

  useEffect(() => {
    loadApsBid();
  }, []);

  useEffect(() => {
    if (!interstitialAd) {
      return;
    }
    const unsubscribe = interstitialAd.onAdEvent((type, error) => {
      switch (type) {
        case AdEventType.LOADED:
          setLoaded(true);
          break;
        case AdEventType.OPENED:
          setLoaded(false);
          break;
        case AdEventType.CLOSED:
          loadApsBid();
          break;
        case AdEventType.ERROR:
          console.debug(error);
      }
    });
    interstitialAd.load();
    return () => {
      unsubscribe();
    };
  }, [interstitialAd]);

  return (
    <View style={styles.container}>
      <Button
        title="Show Interstitial Ad"
        disabled={!isLoaded}
        onPress={() => interstitialAd?.show()}
      />
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
