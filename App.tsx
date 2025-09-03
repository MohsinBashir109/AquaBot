import { getApps, initializeApp } from 'firebase/app';

import { LogBox } from 'react-native';
import { MainNavigator } from './src/navigation';
import React from 'react';
import { firebaseConfig } from './src/firebase/config';
import { useAuthListener } from './src/hooks/AuthListner';

// ✅ Firebase init
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  console.log('✅ Firebase Initialized');
} else {
  console.log('⚡ Firebase already running');
}

LogBox.ignoreAllLogs();

function App() {
  const { user, initializing } = useAuthListener();

  return <MainNavigator user={user} initializing={initializing} />;
}

export default App;
