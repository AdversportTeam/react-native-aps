import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MobileAds from 'react-native-google-mobile-ads';

import APSAdsDemo from './APSAds.component';
import BannerDemo from './Banner.component';
import InterstitialDemo from './Interstitial.component';

const TABS = [
  {
    key: 'init',
    label: 'SDK Init',
    description: 'Initialize APS SDK, configure ad network and MRAID policy.',
  },
  {
    key: 'banner',
    label: 'Banner',
    description:
      'Request an APS bid for a 320x50 banner slot, then render via GAM.',
  },
  {
    key: 'interstitial',
    label: 'Interstitial',
    description:
      'Request an APS bid for an interstitial slot, then show via GAM.',
  },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('init');
  const [gamReady, setGamReady] = useState(false);

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => setGamReady(true));
  }, []);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>react-native-aps</Text>
        <Text style={styles.headerSubtitle}>Example App</Text>
        <View style={styles.gamBadge}>
          <View
            style={[styles.dot, gamReady ? styles.dotSuccess : styles.dotWarn]}
          />
          <Text style={styles.gamBadgeText}>
            GAM {gamReady ? 'Ready' : 'Initializing...'}
          </Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            testID={`tab_${tab.key}`}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
      >
        <Text style={styles.sectionTitle}>{currentTab.label}</Text>
        <Text style={styles.sectionDescription}>
          {currentTab.description}
        </Text>

        <View style={styles.demoContainer}>
          {activeTab === 'init' && <APSAdsDemo />}
          {activeTab === 'banner' && <BannerDemo />}
          {activeTab === 'interstitial' && <InterstitialDemo />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8888aa',
    marginTop: 2,
  },
  gamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#16213e',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  dotSuccess: { backgroundColor: '#4ade80' },
  dotWarn: { backgroundColor: '#facc15' },
  gamBadgeText: {
    fontSize: 12,
    color: '#ccc',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8888aa',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  demoContainer: {
    flex: 1,
  },
});
