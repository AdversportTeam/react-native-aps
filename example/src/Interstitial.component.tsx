import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AdError,
  AdLoader,
  AdLoaderOptions,
  isAdError,
  TestIds,
} from 'react-native-aps';
import { AdEventType, GAMInterstitialAd } from 'react-native-google-mobile-ads';

const adLoaderOptions: AdLoaderOptions = {
  slotUUID: TestIds.APS_SLOT_INTERSTITIAL,
};

const adLoader = AdLoader.createInterstitialAdLoader(adLoaderOptions);

type Phase = 'bidding' | 'loading_ad' | 'ready' | 'shown';

export default function InterstitialDemo() {
  const [apsBidResult, setApsBidResult] = useState<{ [key: string]: string }>(
    {}
  );
  const [apsBidError, setApsBidError] = useState<AdError>();
  const [interstitialAd, setInterstitialAd] = useState<GAMInterstitialAd>();
  const [phase, setPhase] = useState<Phase>('bidding');
  const [showCount, setShowCount] = useState(0);
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (msg: string) =>
    setEvents((prev) => [`${new Date().toLocaleTimeString()} ${msg}`, ...prev]);

  const loadApsBid = () => {
    setPhase('bidding');
    setApsBidError(undefined);
    addEvent('APS bid requested');

    adLoader
      .loadAd()
      .then((result) => {
        setApsBidResult(result);
        addEvent(`APS bid won (${Object.keys(result).length} KVs)`);
        const interstitial = GAMInterstitialAd.createForAdRequest(
          TestIds.GAM_INTERSTITIAL,
          { customTargeting: result }
        );
        setInterstitialAd(interstitial);
        setPhase('loading_ad');
      })
      .catch((error) => {
        if (isAdError(error)) {
          setApsBidError(error);
          addEvent(`APS bid failed (code: ${error.code})`);
        }
        const interstitial = GAMInterstitialAd.createForAdRequest(
          TestIds.GAM_INTERSTITIAL
        );
        setInterstitialAd(interstitial);
        setPhase('loading_ad');
      });
  };

  useEffect(() => {
    loadApsBid();
  }, []);

  useEffect(() => {
    if (!interstitialAd) return;

    const unsubscribe = interstitialAd.addAdEventsListener(
      ({ type, payload }) => {
        switch (type) {
          case AdEventType.LOADED:
            setPhase('ready');
            addEvent('GAM interstitial loaded');
            break;
          case AdEventType.OPENED:
            setPhase('shown');
            addEvent('Interstitial opened');
            break;
          case AdEventType.CLOSED:
            addEvent('Interstitial closed');
            setShowCount((c) => c + 1);
            loadApsBid();
            break;
          case AdEventType.ERROR:
            addEvent(`GAM error: ${(payload as any)?.message ?? 'unknown'}`);
            break;
        }
      }
    );
    interstitialAd.load();
    addEvent('GAM interstitial loading...');
    return () => unsubscribe();
  }, [interstitialAd]);

  const bidSuccess =
    Object.keys(apsBidResult).length > 0 && !apsBidError;

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Slot Configuration</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Slot UUID</Text>
          <Text style={styles.infoValueMono}>
            {TestIds.APS_SLOT_INTERSTITIAL?.slice(0, 8)}...
          </Text>
        </View>
        <View style={[styles.infoRow, styles.infoRowLast]}>
          <Text style={styles.infoLabel}>GAM Unit</Text>
          <Text style={styles.infoValueMono}>
            {TestIds.GAM_INTERSTITIAL?.slice(-20)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>APS Bid</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          {phase === 'bidding' ? (
            <View style={styles.badge}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.badgeTextLoading}>Bidding...</Text>
            </View>
          ) : bidSuccess ? (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeTextSuccess}>Won</Text>
            </View>
          ) : apsBidError ? (
            <View style={[styles.badge, styles.badgeError]}>
              <Text style={styles.badgeTextError}>
                Failed ({apsBidError.code})
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeTextSuccess}>No bid</Text>
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

      <Pressable
        testID="show_interstitial"
        style={[styles.showButton, phase !== 'ready' && styles.showButtonDisabled]}
        disabled={phase !== 'ready'}
        onPress={() => interstitialAd?.show()}
      >
        {phase === 'bidding' || phase === 'loading_ad' ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.showButtonText}>
            {phase === 'ready'
              ? 'Show Interstitial'
              : 'Reload in progress...'}
          </Text>
        )}
      </Pressable>

      {showCount > 0 && (
        <Text style={styles.showCountText}>
          Shown {showCount} time{showCount > 1 ? 's' : ''}
        </Text>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event Log</Text>
        {events.length === 0 ? (
          <Text style={styles.emptyLog}>No events yet</Text>
        ) : (
          events.slice(0, 10).map((event, i) => (
            <Text key={i} style={styles.logEntry}>
              {event}
            </Text>
          ))
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
  showButton: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  showButtonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  showButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  showCountText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 12,
  },
  emptyLog: {
    color: '#94a3b8',
    fontSize: 13,
    fontStyle: 'italic',
  },
  logEntry: {
    fontSize: 12,
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
});
