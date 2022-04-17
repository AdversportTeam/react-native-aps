import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MobileAds from 'react-native-google-mobile-ads';

import APSAds from './APSAds.component';
import Banner from './Banner.component';
import Interstitial from './Interstitial.component';

interface Test {
  title: string;
  testId: string;
  description: string;
  render: () => JSX.Element;
}

const TESTS: { [key: string]: Test } = {
  APSAds: {
    title: 'APSAds',
    testId: 'aps-ads',
    description: 'Initialize APSAds SDK',
    render() {
      return <APSAds />;
    },
  },
  Banner: {
    title: 'Banner',
    testId: 'banner',
    description: 'Loads APS bid into banner ad',
    render() {
      return <Banner />;
    },
  },
  Interstitial: {
    title: 'Interstitial',
    testId: 'interstitial',
    description: 'Loads APS bid into interstitial ad',
    render() {
      return <Interstitial />;
    },
  },
};

export default function App() {
  const [currentTest, setCurrentTest] = useState(TESTS.APSAds);

  useEffect(() => {
    MobileAds().initialize();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.testPickerContainer}>
        {Object.values(TESTS).map((test) => (
          <Button
            key={test.testId}
            testID={`test_${test.testId}`}
            title={test.title}
            onPress={() => setCurrentTest(test)}
          />
        ))}
      </View>
      <View
        testID={`example_${currentTest.testId}`}
        style={styles.exampleContainer}
      >
        <Text style={styles.exampleTitle}>{currentTest.title}</Text>
        <Text style={styles.exampleDescription}>{currentTest.description}</Text>
        <View style={styles.exampleInnerContainer}>{currentTest.render()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 8,
  },
  exampleContainer: {
    padding: 4,
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flex: 1,
  },
  exampleTitle: {
    fontSize: 18,
  },
  exampleDescription: {
    color: '#333333',
    marginBottom: 16,
  },
  exampleInnerContainer: {
    borderColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 10,
    flex: 1,
  },
  testPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
