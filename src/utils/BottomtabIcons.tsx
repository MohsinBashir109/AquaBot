import { Image, StyleSheet, Text, View } from 'react-native';
import {
  chatbot,
  guide,
  home,
  profile,
  settings,
} from '../components/assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from './constants';

import { colors } from './colors';
import { fontFamilies } from './fontfamilies';
import { useThemeContext } from '../theme/ThemeContext';

type Props = {
  focused: boolean;
  screenName: string;
};

export const GetBottomTabIcons = ({ focused, screenName }: Props) => {
  const { isDark } = useThemeContext();

  const getIcon = () => {
    switch (screenName) {
      case 'Home':
        return home;
      case 'Guidelines':
        return guide;
      case 'ChatBot':
        return chatbot;
      case 'Settings':
        return settings;
      case 'Profile':
        return profile;
      default:
        return home; // fallback icon
    }
  };

  return (
    <View style={styles.simpleIcon}>
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
            styles.iconStyle,
            {
              tintColor: focused
                ? colors[isDark ? 'dark' : 'light'].primary
                : colors[isDark ? 'dark' : 'light'].gray1,
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.textstyle,
          {
            color: focused
              ? colors[isDark ? 'dark' : 'light'].primary
              : colors[isDark ? 'dark' : 'light'].gray1,
          },
        ]}
      >
        {screenName}
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
    height: heightPixel(35),
    alignItems: 'center',
    marginTop: heightPixel(15),
  },
});
