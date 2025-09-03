import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Logo, authBackGround } from '../../../assets/images/images';
import {
  dataOnboarding,
  fontPixel,
  heightPixel,
  widthPixel,
} from '../../../utils/constants';

import Button from '../../../components/ThemeComponents/ThemeButton';
import OnboardingCard from '../../../components/ThemeComponents/OnboardingCard';
import React from 'react';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import OnboardingCard from '../../../components/ThemeComponents/OnboardingCard';

const OnBoarding = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const handleSignUp = () => {
    navigation.replace(routes.signup);
  };
  const handleSignin = () => {
    navigation.replace(routes.signin);
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
      <ThemeText style={styles.desTitle} color="text">
        Water less. Grow best.
      </ThemeText>
      <View>
        <OnboardingCard data={dataOnboarding} />
      </View>
      <View style={styles.buttonWrapper}>
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
          textColor="text"
          titleStyle={styles.buttonStyle}
          bgColor="white"
        />
      </View>
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
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontPixel(32),
    marginLeft: widthPixel(7),
  },
  desTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontPixel(16),
    marginLeft: widthPixel(10),
  },
  background: {
    flex: 1,
    paddingHorizontal: widthPixel(25),
  },
  imageLogo: {
    width: widthPixel(120),
    height: heightPixel(220),
  },

  buttonWrapper: { paddingVertical: heightPixel(15) },
});
