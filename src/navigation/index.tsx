import { NavigationContainer, ThemeContext } from '@react-navigation/native';

import { AuthNavigation } from './authFlow';
import { StatusBar } from 'react-native';
import { ThemeProvider } from '../theme/ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../utils/routes';

const MyStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MyStack.Navigator
          initialRouteName={routes.auth}
          screenOptions={{ headerShown: false }}
        >
          <MyStack.Screen name={routes.auth} component={AuthNavigation} />
        </MyStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};
