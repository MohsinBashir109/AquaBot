import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Logo, authBackGround } from '../../../assets/images/images';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';

import Button from '../../../components/ThemeComponents/ThemeButton';
import React from 'react';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OnBoarding = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const handleSignUp = () => {
    navigation.navigate(routes.signin);
  };
  const handleSignin = () => {
    navigation.navigate(routes.signin);
  };
  return (
    <ImageBackground
      source={authBackGround}
      style={[styles.background, { paddingTop: insets.top }]}
    >
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <Image source={Logo} style={styles.imageLogo} />
      <ThemeText style={styles.title} color="text">
        Welcome
      </ThemeText>
      <ThemeText style={styles.desTitle} color="secondary">
        Water less. Grow best.
      </ThemeText>
      <Button
        onPress={handleSignUp}
        title="Register"
        buttonStyle={styles.buttonStyle1}
        titleStyle={styles.buttonStyle}
      />
      <Button
        buttonStyle={styles.buttonStyle2}
        onPress={handleSignin}
        title="Login"
        disabled
        textColor="text"
        titleStyle={styles.buttonStyle}
      />
    </ImageBackground>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  buttonStyle1: {},
  buttonStyle2: {
    marginVertical: heightPixel(15),
  },
  buttonStyle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
  },
  title: { fontFamily: fontFamilies.semibold, fontSize: fontPixel(32) },
  desTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(16),
  },
  background: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
  },
  imageLogo: {
    width: widthPixel(120),
    height: heightPixel(220),
  },
});
