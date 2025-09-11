import * as Home from '../../screens/HomeStack';

import { GetBottomTabIcons } from '../../utils/BottomtabIcons';
import { Platform } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { heightPixel } from '../../utils/constants';
import { routes } from '../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme/ThemeContext';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const { isDark } = useThemeContext();

  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: heightPixel(60),
        },
        tabBarStyle: {
          backgroundColor: colors[isDark ? 'dark' : 'light'].white,
          flexDirection: 'row',
          height:
            Platform.OS === 'android'
              ? heightPixel(60) + insets.bottom
              : heightPixel(50) + insets.bottom,
          alignItems: 'center',
          paddingTop: Platform.OS === 'ios' ? heightPixel(20) : 0,
          //  paddingBottom:  insets?.bottom ,
        },
      }}
    >
      <Tab.Screen
        name={routes.home}
        component={Home.home}
        options={{
          tabBarIcon: ({ focused }) => (
            <GetBottomTabIcons focused={focused} screenName="Home" />
          ),
        }}
      />
      <Tab.Screen
        name={routes.guidelines}
        component={Home.guidelines}
        options={{
          tabBarIcon: ({ focused }) => (
            <GetBottomTabIcons focused={focused} screenName="Guidelines" />
          ),
        }}
      />
      <Tab.Screen
        name={routes.settings}
        component={Home.settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <GetBottomTabIcons focused={focused} screenName="Settings" />
          ),
        }}
      />
      <Tab.Screen
        name={routes.chatbot}
        component={Home.chatBot}
        options={{
          tabBarIcon: ({ focused }) => (
            <GetBottomTabIcons focused={focused} screenName="ChatBot" />
          ),
        }}
      />
      <Tab.Screen
        name={routes.profile}
        component={Home.profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <GetBottomTabIcons focused={focused} screenName="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
