import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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

export default function BannerDemo() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>(
    {}
  );
  const [apsBidError, setApsBidError] = useState<AdError>();
  const [gamAdLoaded, setGamAdLoaded] = useState(false);

  const apsBidDone =
    Object.keys(apsBidResult).length > 0 || apsBidError !== undefined;
  const bidSuccess = apsBidDone && !apsBidError;

  useEffect(() => {
    const unsubSuccess = adLoader.addListener(
      AdLoaderEvent.SUCCESS,
      (result) => setApsBidResult(result)
    );
    const unsubFailure = adLoader.addListener(
      AdLoaderEvent.FAILURE,
      (error) => setApsBidError(error)
    );

    adLoader.loadAd();

    return () => {
      unsubSuccess();
      unsubFailure();
    };
  }, []);

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Slot Configuration</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Slot UUID</Text>
          <Text style={styles.infoValueMono}>
            {TestIds.APS_SLOT_BANNER_320x50?.slice(0, 8)}...
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Size</Text>
          <Text style={styles.infoValue}>320 x 50</Text>
        </View>
        <View style={[styles.infoRow, styles.infoRowLast]}>
          <Text style={styles.infoLabel}>GAM Unit</Text>
          <Text style={styles.infoValueMono}>
            {TestIds.GAM_BANNER?.slice(-20)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>APS Bid</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          {!apsBidDone ? (
            <View style={styles.badge}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.badgeTextLoading}>Bidding...</Text>
            </View>
          ) : bidSuccess ? (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeTextSuccess}>Won</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeError]}>
              <Text style={styles.badgeTextError}>
                Failed ({apsBidError?.code ?? '?'})
              </Text>
            </View>
          )}
        </View>

        {bidSuccess && Object.keys(apsBidResult).length > 0 && (
          <View style={styles.kvContainer}>
            <Text style={styles.kvTitle}>Targeting Key-Values</Text>
            {Object.entries(apsBidResult).map(([key, value]) => (
              <View key={key} style={styles.kvRow}>
                <Text style={styles.kvKey}>{key}</Text>
                <Text style={styles.kvValue} numberOfLines={1}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ad Preview</Text>
        {!apsBidDone ? (
          <View style={styles.adPlaceholder}>
            <ActivityIndicator color="#94a3b8" />
            <Text style={styles.placeholderText}>
              Waiting for APS bid...
            </Text>
          </View>
        ) : (
          <View style={styles.adWrapper}>
            <GAMBannerAd
              unitId={TestIds.GAM_BANNER}
              sizes={[BannerAdSize.BANNER]}
              requestOptions={{ customTargeting: apsBidResult }}
              onAdLoaded={() => setGamAdLoaded(true)}
              onAdFailedToLoad={(error) => console.debug(error)}
            />
            {gamAdLoaded && (
              <Text style={styles.adFooter}>Ad rendered via GAM</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  infoValueMono: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  badgeSuccess: {
    backgroundColor: '#ecfdf5',
  },
  badgeError: {
    backgroundColor: '#fef2f2',
  },
  badgeTextLoading: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '500',
  },
  badgeTextSuccess: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },
  badgeTextError: {
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '600',
  },
  kvContainer: {
    marginTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  kvTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  kvKey: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  kvValue: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    maxWidth: '55%',
    textAlign: 'right',
  },
  adPlaceholder: {
    height: 80,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  adWrapper: {
    alignItems: 'center',
  },
  adFooter: {
    marginTop: 8,
    fontSize: 11,
    color: '#94a3b8',
  },
});
