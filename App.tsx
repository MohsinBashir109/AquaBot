/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { LogBox } from 'react-native';
import { MainNavigator } from './src/navigation';
import { configureGoogleSignIn } from './src/service/googleConfig';
import { useEffect } from 'react';

LogBox.ignoreAllLogs();

function App() {
  useEffect(() => {
    configureGoogleSignIn();
  });
  return <MainNavigator />;
}

export default App;
