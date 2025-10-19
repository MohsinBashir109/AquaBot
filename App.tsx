/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { MainNavigator } from './src/navigation';
import { store } from './src/store';
LogBox.ignoreAllLogs();

function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}

export default App;
