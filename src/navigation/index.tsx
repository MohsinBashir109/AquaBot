import { AuthNavigation } from './authFlow';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../utils/routes';

const MyStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <MyStack.Navigator
        initialRouteName="AuthFlow"
        screenOptions={{ headerShown: false }}
      >
        <MyStack.Screen name={routes.auth} component={AuthNavigation} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};
