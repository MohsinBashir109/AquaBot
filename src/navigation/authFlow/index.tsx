import * as Auth from '../../screens/AuthFlow';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();
export const AuthNavigation = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="splash"
    >
      <AuthStack.Screen name="onBoarding" component={Auth.OnBoarding} />
      <AuthStack.Screen name="splash" component={Auth.Splash} />
      <AuthStack.Screen name="SignIn" component={Auth.SignIn} />
    </AuthStack.Navigator>
  );
};
