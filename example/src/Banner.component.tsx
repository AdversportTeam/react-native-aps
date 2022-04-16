import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AdError,
  AdLoader,
  AdLoaderOptions,
  AdType,
  isAdError,
  TestIds,
} from 'react-native-aps';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const apsOptions: AdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_BANNER,
  type: AdType.BANNER,
  size: '320x50',
};

export default function Banner() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>(
    {}
  );
  const [apsBidError, setApsBidError] = useState<AdError>();
  const [apsBidDone, setApsBidDone] = useState(false);

  useEffect(() => {
    AdLoader.loadAd(apsOptions)
      .then((result) => {
        setApsBidResult(result);
      })
      .catch((error) => {
        if (isAdError(error)) {
          setApsBidError(error);
        }
      })
      .finally(() => {
        setApsBidDone(true);
      });
  }, []);

  return (
    <View style={styles.container}>
      {apsBidDone && (
        <BannerAd
          unitId={TestIds.GAM_BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={{ customTargeting: apsBidResult }}
          onAdFailedToLoad={(error) => console.debug(error)}
        />
      )}
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
