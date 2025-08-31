/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { LogBox } from 'react-native';
import { MainNavigator } from './src/navigation';
import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';

LogBox.ignoreAllLogs();
function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return <MainNavigator />;
}

export default App;
