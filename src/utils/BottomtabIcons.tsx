import { Image, StyleSheet, Text, View } from 'react-native';
import {
  chatbot,
  email,
  eyes,
  google,
  guide,
  hide,
  home,
  profile,
  settings,
  tickCircle,
} from '../assets/icons/icons';
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
    <View style={styles.simpleIcon}>
      <Image
        source={getIcon()}
        style={[
          {
            tintColor: focused
              ? colors[isDark ? 'dark' : 'light'].primary
              : colors[isDark ? 'dark' : 'light'].gray2,
          },
          styles.iconStyle,
        ]}
      />
      <Text
        style={[
          styles?.textstyle,
          {
            color: focused
              ? colors[isDark ? 'dark' : 'light'].primary
              : colors[isDark ? 'dark' : 'light'].gray2,
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
  iconStyle: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
    marginBottom: heightPixel(5),
  },

  gradient: {
    borderRadius: heightPixel(25),
    marginBottom: heightPixel(5),
    elevation: 3,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  textstyle: {
    width: widthPixel(75),
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(12),
    textAlign: 'center',
  },

  simpleIcon: {
    height: heightPixel(27),
    alignItems: 'center',
    marginTop: heightPixel(15),
  },
});
