import * as Auth from '../../screens/AuthFlow';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../../utils/routes';

const AuthStack = createNativeStackNavigator();
export const AuthNavigation = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={routes.splash}
    >
      <AuthStack.Screen name={routes.onboarding} component={Auth.OnBoarding} />
      <AuthStack.Screen name={routes.splash} component={Auth.Splash} />
      <AuthStack.Screen name={routes.signin} component={Auth.SignIn} />
      <AuthStack.Screen name={routes.signup} component={Auth.SignUp} />
      <AuthStack.Screen name={routes.forgot} component={Auth.Forgot} />
      <AuthStack.Screen
        name={routes.emailverification}
        component={Auth.emailVerification}
      />
      <AuthStack.Screen
        name={routes.resetpassword}
        component={Auth.resetPassword}
      />
    </AuthStack.Navigator>
  );
};
