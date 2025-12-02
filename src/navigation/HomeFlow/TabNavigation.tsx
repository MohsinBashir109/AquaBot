import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { routes } from '../../utils/routes';
import * as Home from '../../screens/HomeStack';

import { StyleSheet, View, Text, Image, Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { fontFamilies } from '../../utils/fontfamilies';

import {
  chatbot,
  guide,
  home,
  profile,
} from '../../components/assets/icons/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

// Nested stack for chat functionality
const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={routes.chatList}
    >
      <ChatStack.Screen name={routes.chatList} component={Home.chatList} />
      <ChatStack.Screen name={routes.chatbot} component={Home.chatBot} />
    </ChatStack.Navigator>
  );
};

export const TabNavigation = () => {
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors[isDark ? 'dark' : 'light'].background,
        width: '100%',
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
            flex: 1,
            paddingHorizontal: 0,
            paddingVertical: 0,
            margin: 0,
            minWidth: 0,
          },
          tabBarStyle: {
            flexDirection: 'row',
            width: '100%',
            height:
              Platform.OS === 'android'
                ? heightPixel(60) + insets.bottom
                : heightPixel(50) + insets.bottom,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: Platform.OS === 'ios' ? heightPixel(20) : 0,
            paddingHorizontal: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: insets.bottom,
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
            backgroundColor: colors[isDark ? 'dark' : 'light'].white,
            borderTopWidth: 1,
            borderTopColor: colors[isDark ? 'dark' : 'light'].gray3,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        }}
        initialRouteName={routes.home}
      >
        <Tab.Screen
          name={routes.home}
          component={Home.home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
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
                  numberOfLines={1}
                >
                  {t('drawer.home')}
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
              <View style={styles.iconContainer}>
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
                  numberOfLines={1}
                >
                  {t('drawer.moments')}
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={routes.chatbot}
          component={ChatStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
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
                    styles.aquaBotText,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  AquaBot
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
              <View style={styles.iconContainer}>
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
                  numberOfLines={1}
                >
                  {t('drawer.profile')}
                </Text>
              </View>
            ),
          }}
        />
        {/* Hidden tabs - accessible via drawer but not shown in tab bar */}
        <Tab.Screen
          name={routes.settings}
          component={Home.settings}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name={routes.recommendations}
          component={Home.recommendations}
          options={{
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(4),
    paddingHorizontal: widthPixel(2),
    width: '100%',
    minWidth: 0,
  },
  iconStyle: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
    marginBottom: heightPixel(4),
    tintColor: colors.light.gray3,
  },
  gradient: {
    borderRadius: heightPixel(25),
    marginBottom: heightPixel(4),
    elevation: 3,
    shadowColor: colors.light.dark,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedTextStyle: {
    color: colors.light.primary,
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(8),
    width: '100%',
    paddingHorizontal: widthPixel(1),
  },
  textstyle: {
    fontSize: fontPixel(8),
    fontFamily: fontFamilies.medium,
    textAlign: 'center',
    color: colors.light.gray3,
    marginTop: heightPixel(2),
    width: '100%',
    paddingHorizontal: widthPixel(1),
  },
  aquaBotText: {
    fontSize: fontPixel(7),
  },
  iconSelected: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
    tintColor: 'white',
    margin: heightPixel(12),
  },
});
