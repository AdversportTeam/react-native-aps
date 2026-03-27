import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AdNetwork, APSAds, MRAIDPolicy, TestIds } from 'react-native-aps';

type Step = {
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
  detail?: string;
};

export default function APSAdsDemo() {
  const [steps, setSteps] = useState<Step[]>([
    { label: 'Initialize SDK', status: 'pending' },
    { label: 'Set Ad Network', status: 'pending' },
    { label: 'Set MRAID Policy', status: 'pending' },
    { label: 'Enable Test Mode', status: 'pending' },
  ]);

  const updateStep = useCallback(
    (index: number, update: Partial<Step>) =>
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...update } : s))
      ),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        updateStep(0, {
          status: 'running',
          detail: `App Key: ${TestIds.APS_APP_KEY?.slice(0, 8)}...`,
        });
        await APSAds.initialize(TestIds.APS_APP_KEY);
        updateStep(0, { status: 'done' });

        updateStep(1, {
          status: 'running',
          detail: AdNetwork.GOOGLE_AD_MANAGER,
        });
        APSAds.setAdNetworkInfo({ adNetwork: AdNetwork.GOOGLE_AD_MANAGER });
        updateStep(1, { status: 'done' });

        updateStep(2, { status: 'running', detail: 'DFP' });
        APSAds.setMRAIDPolicy(MRAIDPolicy.DFP);
        updateStep(2, { status: 'done' });

        updateStep(3, { status: 'running', detail: 'true' });
        APSAds.setTestMode(true);
        updateStep(3, { status: 'done' });
      } catch (e: any) {
        const failedIdx = steps.findIndex(
          (s) => s.status === 'running' || s.status === 'pending'
        );
        if (failedIdx >= 0) {
          updateStep(failedIdx, {
            status: 'error',
            detail: e?.message ?? 'Unknown error',
          });
        }
      }
    })();
  }, []);

  const allDone = steps.every((s) => s.status === 'done');
  const hasError = steps.some((s) => s.status === 'error');

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configuration</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform</Text>
          <Text style={styles.infoValue}>{Platform.OS}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Key</Text>
          <Text style={styles.infoValueMono}>
            {TestIds.APS_APP_KEY?.slice(0, 12)}...
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ad Network</Text>
          <Text style={styles.infoValue}>Google Ad Manager</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Initialization Steps</Text>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              {step.status === 'running' ? (
                <ActivityIndicator size="small" color="#6366f1" />
              ) : (
                <View
                  style={[
                    styles.stepDot,
                    step.status === 'done' && styles.stepDotDone,
                    step.status === 'error' && styles.stepDotError,
                  ]}
                />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepLabel,
                  step.status === 'done' && styles.stepLabelDone,
                ]}
              >
                {step.label}
              </Text>
              {step.detail && (
                <Text style={styles.stepDetail}>{step.detail}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.statusBanner,
          allDone && styles.statusSuccess,
          hasError && styles.statusError,
        ]}
      >
        <Text
          testID="initStatus_text"
          style={[
            styles.statusText,
            allDone && styles.statusTextSuccess,
            hasError && styles.statusTextError,
          ]}
        >
          {hasError
            ? 'Initialization failed'
            : allDone
              ? 'APS SDK ready'
              : 'Initializing...'}
        </Text>
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
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  stepIndicator: {
    width: 28,
    alignItems: 'center',
    paddingTop: 2,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#cbd5e1',
  },
  stepDotDone: {
    backgroundColor: '#4ade80',
  },
  stepDotError: {
    backgroundColor: '#f87171',
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
    color: '#475569',
  },
  stepLabelDone: {
    color: '#1e293b',
    fontWeight: '500',
  },
  stepDetail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusBanner: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: '#ecfdf5',
  },
  statusError: {
    backgroundColor: '#fef2f2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  statusTextSuccess: {
    color: '#16a34a',
  },
  statusTextError: {
    color: '#dc2626',
  },
});
