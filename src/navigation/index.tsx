import { AuthNavigation } from './authFlow';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MyStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <MyStack.Navigator
        initialRouteName="AuthFlow"
        screenOptions={{ headerShown: false }}
      >
        <MyStack.Screen name="AuthFlow" component={AuthNavigation} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};
