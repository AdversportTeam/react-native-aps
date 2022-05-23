import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AdError,
  AdLoader,
  AdLoaderEvent,
  BannerAdLoaderOptions,
  TestIds,
} from 'react-native-aps';
import { GAMBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adLoaderOptions: BannerAdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_BANNER_320x50,
  size: '320x50',
};

const adLoader = AdLoader.createBannerAdLoader(adLoaderOptions);

export default function Banner() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>(
    {}
  );
  const [apsBidError, setApsBidError] = useState<AdError>();
  const apsBidDone =
    Object.keys(apsBidResult).length > 0 || apsBidError !== undefined;

  useEffect(() => {
    const unsubSuccess = adLoader.addListener(
      AdLoaderEvent.SUCCESS,
      (result) => {
        setApsBidResult(result);
      }
    );
    const unsubFailure = adLoader.addListener(
      AdLoaderEvent.FAILURE,
      (error) => {
        setApsBidError(error);
      }
    );

    adLoader.loadAd();

    return () => {
      unsubSuccess();
      unsubFailure();
    };
  }, []);

  return (
    <View style={styles.container}>
      {apsBidDone && (
        <GAMBannerAd
          unitId={TestIds.GAM_BANNER}
          sizes={[BannerAdSize.BANNER]}
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
