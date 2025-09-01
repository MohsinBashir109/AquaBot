import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { aquaLogo, authBackGround } from '../src/assets/images/images';
import { fontPixel, heightPixel, widthPixel } from '../src/utils/constants';

import React from 'react';
import ThemeText from '../src/components/ThemeComponents/ThemeText';
import { colors } from '../src/utils/colors';
import { fontFamilies } from '../src/utils/fontfamilies';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../src/theme/ThemeContext';

type props = {
  text?: string;
  children: React.ReactNode;
  desText?: string;
};

const AuthWrapper = ({ children, text, desText }: props) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeContext();
  return (
    <ImageBackground
      source={authBackGround}
      style={[
        styles.background,
        {
          paddingTop: insets.top,
          backgroundColor: colors[isDark ? 'dark' : 'light'].background,
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: heightPixel(40),
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={aquaLogo} resizeMode="contain" style={styles.image} />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          {text && (
            <ThemeText color="text" style={styles.textChildern}>
              {text}
            </ThemeText>
          )}
          {desText && (
            <ThemeText color="desText" style={styles.desText}>
              {desText}
            </ThemeText>
          )}
        </View>
      </View>
      {children}
    </ImageBackground>
  );
};

export default AuthWrapper;

const styles = StyleSheet.create({
  image: {
    width: widthPixel(80),
    height: heightPixel(110),
    marginBottom: heightPixel(40),
  },
  background: {
    flex: 1,
    paddingHorizontal: widthPixel(25),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: fontPixel(24),
    fontFamily: fontFamilies.bold,
    color: '#000000',
  },
  textChildern: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.bold,
    color: '#000000',
  },
  children: {
    flex: 1,
    width: '100%',
    marginTop: heightPixel(50),
  },
  desText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    color: '#000000',
  },
});
