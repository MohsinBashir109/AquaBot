import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import React from 'react';
import { authBackGround } from '../src/assets/images/images';
import { widthPixel } from '../src/utils/constants';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={authBackGround}
      style={{
        flex: 1,

        paddingHorizontal: widthPixel(20),
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
        }}
      >
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
        {children}
      </View>
    </ImageBackground>
  );
};

export default AuthWrapper;

const styles = StyleSheet.create({});
