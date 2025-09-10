import * as Auth from '../../screens/AuthFlow';
import * as Home from '../../screens/HomeStack';

import TabNavigation from './TabNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../../utils/routes';

const HomeStack = createNativeStackNavigator();
export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      // initialRouteName={routes.splash}
    >
      <HomeStack.Screen name={routes.home} component={TabNavigation} />
    </HomeStack.Navigator>
  );
};
