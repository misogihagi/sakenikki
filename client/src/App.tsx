import React from 'react';
import { StyleSheet, View } from 'react-native';

import Write from './components/Write';
// export { default } from '../.storybook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Write />
    </View>
  );
}
