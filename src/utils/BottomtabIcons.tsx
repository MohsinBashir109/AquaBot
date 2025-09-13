import { Image, StyleSheet, Text, View } from 'react-native';
import { chatbot, guide, home, profile, settings } from '../assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from './constants';

import { colors } from './colors';
import { fontFamilies } from './fontfamilies';
import { useThemeContext } from '../theme/ThemeContext';

export const GetBottomTabIcons = ({
  focused,
  screenName,
}: {
  focused: boolean;
  screenName: string;
}) => {
  const { isDark } = useThemeContext();
  const getIcon = () => {
    switch (screenName) {
      case 'Home':
        return home;
      case 'ChatBot':
        return chatbot;
      case 'Profile':
        return profile;
      case 'Settings':
        return settings;
      case 'Guidelines':
        return guide;
    }
  };
  return (
    <View style={[styles.simpleIcon]}>
      <View
        style={[
          styles.circle,
          {
            borderColor: focused
              ? colors[isDark ? 'dark' : 'light'].primary
              : colors[isDark ? 'dark' : 'light'].gray1,
          },
        ]}
      >
        <Image
          source={getIcon()}
          style={[
            {
              tintColor: focused
                ? colors[isDark ? 'dark' : 'light'].primary
                : colors[isDark ? 'dark' : 'light'].gray1,
            },
            styles.iconStyle,
          ]}
        />
      </View>
      <Text
        style={[
          styles?.textstyle,
          {
            color: focused
              ? colors[isDark ? 'dark' : 'light'].primary
              : colors[isDark ? 'dark' : 'light'].gray1,
          },
        ]}
      >
        {screenName}
        {/* {t(`BottomTabs.${screenName}`)} */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  iconStyle: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
    marginBottom: heightPixel(5),
  },

  textstyle: {
    width: widthPixel(75),
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(12),
    textAlign: 'center',
  },

  simpleIcon: {
    // backgroundColor: 'pink',
    height: heightPixel(35),
    alignItems: 'center',
    marginTop: heightPixel(15),
  },
});
