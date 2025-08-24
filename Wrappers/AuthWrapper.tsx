import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { aquaBotwrapper, authBackGround } from '../src/assets/images/images';
import { fontPixel, heightPixel, widthPixel } from '../src/utils/constants';

import React from 'react';
import { fontFamilies } from '../src/utils/fontfamilies';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type props = {
  text?: string;
  children: React.ReactNode;
  desText?: string;
};

const AuthWrapper = ({ children, text, desText }: props) => {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={authBackGround}
      style={[styles.background, { paddingTop: insets.top }]}
    >
      <Image
        source={aquaBotwrapper}
        resizeMode="contain"
        style={styles.image}
      />
      <Text style={styles.text}>AI Irrigation Advisor</Text>

      <View style={styles.children}>
        {text && <Text style={styles.textChildern}>{text}</Text>}
        {desText && <Text style={styles.desText}>{desText}</Text>}
        {children}
      </View>
    </ImageBackground>
  );
};

export default AuthWrapper;

const styles = StyleSheet.create({
  image: {
    width: widthPixel(220),
    height: heightPixel(50),
    marginTop: heightPixel(30),
  },
  background: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'pink',
  },
  text: {
    fontSize: fontPixel(24),
    fontFamily: fontFamilies.bold,
    color: '#000000',
  },
  textChildern: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.semibold,
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
