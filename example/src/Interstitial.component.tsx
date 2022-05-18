import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  AdError,
  AdLoader,
  AdLoaderOptions,
  isAdError,
  TestIds,
} from 'react-native-aps';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

const adLoaderOptions: AdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_INTERSTITIAL,
};

const adLoader = AdLoader.createInterstitialAdLoader(adLoaderOptions);

export default function Interstitial() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>(
    {}
  );
  const [apsBidError, setApsBidError] = useState<AdError>();
  const [apsBidDone, setApsBidDone] = useState(false);
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd>();
  const [isLoaded, setLoaded] = useState(false);

  const loadApsBid = () => {
    adLoader
      .loadAd()
      .then((result) => {
        setApsBidResult(result);
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
          setApsBidError(error);
        }
        const interstitial = InterstitialAd.createForAdRequest(
          TestIds.GAM_INTERSTITIAL
        );
        setInterstitialAd(interstitial);
      })
      .finally(() => {
        setApsBidDone(true);
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
      <View style={styles.bidResponseContainer}>
        <Text style={styles.title}>Bid status</Text>
        <Text testID="status_text" style={styles.description}>
          {apsBidDone ? (apsBidError ? 'fail' : 'success') : 'loading'}
        </Text>
        <Text style={styles.title}>Bid response Key-Values</Text>
        <Text testID="kvs_text" style={styles.description}>
          {JSON.stringify(apsBidResult)}
        </Text>
        <Text style={styles.title}>Bid error code</Text>
        <Text testID="error_text" style={styles.description}>
          {apsBidError?.code || '-'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidResponseContainer: {
    paddingTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 18,
  },
  description: {
    color: '#333333',
    marginBottom: 16,
  },
});
