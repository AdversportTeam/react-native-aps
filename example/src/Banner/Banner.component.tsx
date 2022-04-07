import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AdLoader,
  AdLoaderOptions,
  AdType,
  isAdError,
  TestIds,
} from 'react-native-aps';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const apsOptions: AdLoaderOptions = {
  slots: [
    {
      slotUUID: TestIds.APS_SLOT_BANNER,
      type: AdType.BANNER,
      size: '320x50',
    },
  ],
};

export default function Banner() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>();
  const [apsBidDone, setApsBidDone] = useState(false);

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
