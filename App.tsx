import React, { useEffect, useState } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

import { LogBox } from 'react-native';
import { MainNavigator } from './src/navigation';
import { configureGoogleSignIn } from './src/service/googleConfig';

// ✅ Firebase init
// if (getApps().length === 0) {
//   initializeApp(firebaseConfig);
//   console.log('✅ Firebase Initialized');
// } else {
//   console.log('⚡ Firebase already running');
// }

LogBox.ignoreAllLogs();

export default function App() {
  useEffect(() => {
    configureGoogleSignIn(); // ✅ Call once when app starts
  }, []);
  return <MainNavigator />;
}
