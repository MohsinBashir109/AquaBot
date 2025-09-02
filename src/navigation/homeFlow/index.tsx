import * as Home from '../../screens/HomeStack';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../../utils/routes';

const HomeStack = createNativeStackNavigator();
export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name={routes.home} component={Home.home} />
    </HomeStack.Navigator>
  );
};
