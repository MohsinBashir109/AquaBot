import * as Auth from '../../screens/AuthFlow';
import * as Home from '../../screens/HomeStack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../../utils/routes';

const HomeStack = createNativeStackNavigator();
export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      // initialRouteName={routes.splash}
    >
      {/* <HomeStack.Screen name={routes.splash} component={Auth.Splash} /> */}
      <HomeStack.Screen name={routes.home} component={Home.home} />
    </HomeStack.Navigator>
  );
};
