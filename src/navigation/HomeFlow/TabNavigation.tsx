import * as Home from '../../screens/HomeStack';

import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  chatbot,
  guide,
  home,
  profile,
  settings,
} from '../../assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import React from 'react';
import ThemeText from '../../components/ThemeComponents/ThemeText';
import { colors } from '../../utils/colors';
import { fontFamilies } from '../../utils/fontfamilies';
import { routes } from '../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme/ThemeContext';

const TabNavigation = ({ navigation }: any) => {
  const tabArray = [
    {
      route: routes.home,
      icon: home,
      component: Home.home,
      type: 'LEFT',
    },
    {
      route: routes.guidelines,
      icon: guide,
      component: Home.guidelines,
      type: 'LEFT',
    },
    {
      route: routes.chatbot,
      icon: chatbot,
      component: Home.chatBot,
      type: 'CIRCLE',
    },
    {
      route: routes.settings,
      icon: settings,
      component: Home.settings,
      type: 'RIGHT',
    },
    {
      route: routes.profile,
      icon: profile,
      component: Home.profile,
      type: 'RIGHT',
    },
  ];

  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();

  const safeNumber =
    Platform.OS == 'android'
      ? heightPixel(80) + insets.bottom
      : heightPixel(60) + insets.bottom;
  console.log('insets.bottom:', safeNumber);
  const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
    const currentTab = tabArray.find(tab => tab.route === routeName);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        <Image
          source={currentTab?.icon}
          resizeMode="contain"
          style={
            selectedTab === routeName
              ? [
                  styles.selectedIconStyle,
                  { tintColor: colors[isDark ? 'dark' : 'light'].white },
                ]
              : [
                  styles.iconStyle,
                  { tintColor: colors[isDark ? 'dark' : 'light'].gray1 },
                ]
          }
        />
        <Text
          style={
            selectedTab === routeName
              ? [
                  styles.selectedTextStyle,
                  { color: colors[isDark ? 'dark' : 'light'].white },
                ]
              : [
                  styles.textstyle,
                  { color: colors[isDark ? 'dark' : 'light'].gray1 },
                ]
          }
        >
          {routeName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      screenListeners={{}}
      id="TabNavigator"
      style={{ flex: 1 }}
      width={0}
      borderWidth={1}
      borderColor="green"
      circlePosition="CENTER"
      borderTopLeftRight={false}
      shadowStyle={{}}
      defaultScreenOptions={{}}
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
      }}
      type="UP"
      height={safeNumber}
      circleWidth={60}
      bgColor={colors[isDark ? 'dark' : 'light'].bottomTab}
      initialRouteName={routes.home}
      renderCircle={({ routeName, navigate, selectedTab }: any) => (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigate(routes.chatbot)}
        >
          <View style={styles.btnCircleUp}>
            <Image
              source={chatbot}
              style={
                selectedTab === routeName
                  ? [
                      styles.selectedIconStyle,
                      { tintColor: colors[isDark ? 'dark' : 'light'].white },
                    ]
                  : [
                      styles.iconStyle,
                      { tintColor: colors[isDark ? 'dark' : 'light'].gray1 },
                    ]
              }
            />
          </View>
        </TouchableOpacity>
      )}
      tabBar={renderTabBar}
    >
      {tabArray.map((item, index) => (
        <CurvedBottomBar.Screen
          key={index}
          name={item.route}
          position={item.type}
          component={item.component}
        />
      ))}
    </CurvedBottomBar.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  btnCircleUp: {
    width: widthPixel(45),
    height: widthPixel(45),
    borderRadius: widthPixel(30),
    alignItems: 'center',
    // backgroundColor: '#30A7FB',
    justifyContent: 'center',
    bottom: heightPixel(20),
  },
  iconStyle: {
    width: heightPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
  },
  selectedIconStyle: {
    width: heightPixel(25),
    height: heightPixel(25),
    resizeMode: 'contain',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textstyle: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.bold,
    marginTop: heightPixel(5),
  },
  selectedTextStyle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontPixel(12),
  },
});
