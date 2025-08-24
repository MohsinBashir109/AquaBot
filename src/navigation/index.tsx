import { AuthNavigation } from './authFlow';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const MyStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />

      <MyStack.Navigator
        initialRouteName="AuthFlow"
        screenOptions={{ headerShown: false }}
      >
        <MyStack.Screen name="AuthFlow" component={AuthNavigation} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
};
