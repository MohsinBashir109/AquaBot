import * as Auth from '../../screens/AuthFlow';
import * as Home from '../../screens/HomeStack';

import TabNavigation from './TabNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { routes } from '../../utils/routes';
import CustomDrawer from '../../components/Drawer/CustomDrawer';

const HomeStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator wrapping all tabs
const HomeDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '80%',
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      // initialRouteName={routes.splash}
    >
      <HomeStack.Screen name={routes.home} component={HomeDrawerNavigator} />
    </HomeStack.Navigator>
  );
};
