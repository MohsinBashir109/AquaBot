/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { getApps, initializeApp } from 'firebase/app';

import { LogBox } from 'react-native';
import { MainNavigator } from './src/navigation';
import { firebaseConfig } from './src/firebase/config';
import { useEffect } from 'react';

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  console.log('✅ Firebase Initialized');
} else {
  console.log('⚡ Firebase already running');
}

console.log('Firebase apps:', getApps());

LogBox.ignoreAllLogs();

function App() {
  return <MainNavigator />;
}

export default App;
