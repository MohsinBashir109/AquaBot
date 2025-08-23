/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { MainNavigator } from './src/navigation';

function App() {
  return <MainNavigator />;
}

export default App;
