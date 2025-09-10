import * as Home from '../../screens/HomeStack';

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { routes } from '../../utils/routes';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={routes.home} component={Home.home} />
      <Tab.Screen name={routes.guidelines} component={Home.guidelines} />
      <Tab.Screen name={routes.settings} component={Home.settings} />
      <Tab.Screen name={routes.chatbot} component={Home.chatBot} />
      <Tab.Screen name={routes.profile} component={Home.profile} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
