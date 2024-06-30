import React from 'react';
import { StyleSheet, SafeAreaView,StatusBar } from 'react-native';

import Write from './components/Write';
// export { default } from '../.storybook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Write />
    </SafeAreaView>
  );
}
