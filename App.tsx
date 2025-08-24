/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { LogBox, StyleSheet, Text, View, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { MainNavigator } from './src/navigation';

LogBox.ignoreAllLogs();
function App() {
  return <MainNavigator />;
}

export default App;
