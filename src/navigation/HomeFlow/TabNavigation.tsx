import React from 'react';
import { routes } from '../../utils/routes';
import * as Home from '../../screens/HomeStack';

import { StyleSheet, View, Text, Image, Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { fontFamilies } from '../../utils/fontfamilies';

import {
  chatbot,
  guide,
  home,
  profile,
  settings,
} from '../../assets/icons/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

export const TabNavigation = () => {
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors[isDark ? 'dark' : 'light'].background,
      }}
    >
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
            flexDirection: 'row',
            height:
              Platform.OS === 'android'
                ? heightPixel(60) + insets.bottom
                : heightPixel(50) + insets.bottom,
            alignItems: 'center',
            paddingTop: Platform.OS === 'ios' ? heightPixel(20) : 0,
          },
        }}
        initialRouteName={routes.home}
      >
        <Tab.Screen
          name={routes.home}
          component={Home.home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  focused ? styles.selectedIconView : styles.simpleIcon,
                  { height: heightPixel(27) },
                ]}
              >
                {focused ? (
                  <LinearGradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#90DDF6', '#3D84F6']}
                    style={styles.gradient}
                  >
                    <Image source={home} style={styles.iconSelected} />
                  </LinearGradient>
                ) : (
                  <Image source={home} style={styles.iconStyle} />
                )}
                <Text
                  style={[
                    styles.textstyle,
                    focused && styles.selectedTextStyle,
                  ]}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={routes.analyze}
          component={Home.analyze}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  focused ? styles.selectedIconView : styles.simpleIcon,
                  { height: heightPixel(27) },
                ]}
              >
                {focused ? (
                  <LinearGradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#90DDF6', '#3D84F6']}
                    style={styles.gradient}
                  >
                    <Image source={guide} style={styles.iconSelected} />
                  </LinearGradient>
                ) : (
                  <Image source={guide} style={styles.iconStyle} />
                )}
                <Text
                  style={[
                    styles.textstyle,
                    focused && styles.selectedTextStyle,
                  ]}
                >
                  Analyze
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={routes.chatbot}
          component={Home.chatBot}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  focused ? styles.selectedIconView : styles.simpleIcon,
                  { height: heightPixel(27) },
                ]}
              >
                {focused ? (
                  <LinearGradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#90DDF6', '#3D84F6']}
                    style={styles.gradient}
                  >
                    <Image source={chatbot} style={styles.iconSelected} />
                  </LinearGradient>
                ) : (
                  <Image source={chatbot} style={styles.iconStyle} />
                )}
                <Text
                  style={[
                    styles.textstyle,
                    focused && styles.selectedTextStyle,
                  ]}
                >
                  AI Chat
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={routes.settings}
          component={Home.settings}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  focused ? styles.selectedIconView : styles.simpleIcon,
                  { height: heightPixel(27) },
                ]}
              >
                {focused ? (
                  <LinearGradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#90DDF6', '#3D84F6']}
                    style={styles.gradient}
                  >
                    <Image source={settings} style={styles.iconSelected} />
                  </LinearGradient>
                ) : (
                  <Image source={settings} style={styles.iconStyle} />
                )}
                <Text
                  style={[
                    styles.textstyle,
                    focused && styles.selectedTextStyle,
                  ]}
                >
                  Settings
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={routes.profile}
          component={Home.profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  focused ? styles.selectedIconView : styles.simpleIcon,
                  { height: heightPixel(27) },
                ]}
              >
                {focused ? (
                  <LinearGradient
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#90DDF6', '#3D84F6']}
                    style={styles.gradient}
                  >
                    <Image source={profile} style={styles.iconSelected} />
                  </LinearGradient>
                ) : (
                  <Image source={profile} style={styles.iconStyle} />
                )}
                <Text
                  style={[
                    styles.textstyle,
                    focused && styles.selectedTextStyle,
                  ]}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  iconStyle: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
    marginBottom: heightPixel(5),
    tintColor: colors.light.gray3,
  },
  gradient: {
    borderRadius: heightPixel(25),
    marginBottom: heightPixel(5),
    elevation: 3,
    shadowColor: colors.light.dark,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedTextStyle: {
    color: colors.light.primary,
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(9),
  },
  textstyle: {
    fontSize: fontPixel(9),
    fontFamily: fontFamilies.medium,
    width: widthPixel(75),
    textAlign: 'center',
    color: colors.light.gray3,
  },
  iconSelected: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
    tintColor: 'white',
    margin: heightPixel(12),
  },
  simpleIcon: {
    alignItems: 'center',
    marginTop: heightPixel(15),
  },
  selectedIconView: {
    alignItems: 'center',
    borderRadius: heightPixel(5),
    borderColor: colors.light.primary,
    marginBottom: heightPixel(20),
  },
});
