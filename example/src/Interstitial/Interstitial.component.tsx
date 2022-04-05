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
  slots: [
    {
      slotUUID: TestIds.APS_SLOT_INTERSTITIAL,
      type: AdType.INTERSTITIAL,
    },
  ],
};

export default function Interstitial() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>();
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd>();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    AdLoader.loadAd(apsOptions)
      .then((result) => {
        setApsBidResult(result);
      })
      .catch((error) => {
        if (isAdError(error)) {
          console.debug(error);
        }
      })
      .finally(() => {
        const interstitial = InterstitialAd.createForAdRequest(
          TestIds.GAM_INTERSTITIAL,
          {
            customTargeting: apsBidResult,
          }
        );
        setInterstitialAd(interstitial);
      });
  }, []);

  useEffect(() => {
    if (!interstitialAd) {
      return;
    }
    const unsubscribe = interstitialAd.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        setLoaded(true);
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
