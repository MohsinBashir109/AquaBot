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
import { useLanguage } from '../../../context/LanguageContext';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import OnboardingCard from '../../../components/ThemeComponents/OnboardingCard';

const OnBoarding = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { t, locale, setLocale } = useLanguage();
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
        {t('onboarding.welcome')}
      </ThemeText>
      <ThemeText style={styles.desTitle} color="text">
        {t('onboarding.tagline')}
      </ThemeText>

      {/* Language Radio */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: heightPixel(6) }}>
        <ThemeText color="text" style={{ marginRight: widthPixel(8) }}>
          {t('onboarding.chooseLanguage')}
        </ThemeText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: widthPixel(12) }}>
            <View
              onTouchEnd={() => setLocale('en')}
              style={{
                width: widthPixel(20), height: widthPixel(20), borderRadius: widthPixel(10),
                borderWidth: 1, borderColor: '#2E7CF6', alignItems: 'center', justifyContent: 'center', marginRight: widthPixel(6)
              }}
            >
              <View style={{ width: widthPixel(10), height: widthPixel(10), borderRadius: widthPixel(5), backgroundColor: locale === 'en' ? '#2E7CF6' : 'transparent' }} />
            </View>
            <ThemeText color="text" onPress={() => setLocale('en')}>EN</ThemeText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              onTouchEnd={() => setLocale('ur')}
              style={{
                width: widthPixel(20), height: widthPixel(20), borderRadius: widthPixel(10),
                borderWidth: 1, borderColor: '#2E7CF6', alignItems: 'center', justifyContent: 'center', marginRight: widthPixel(6)
              }}
            >
              <View style={{ width: widthPixel(10), height: widthPixel(10), borderRadius: widthPixel(5), backgroundColor: locale === 'ur' ? '#2E7CF6' : 'transparent' }} />
            </View>
            <ThemeText color="text" onPress={() => setLocale('ur')}>اردو</ThemeText>
          </View>
        </View>
      </View>
      <View>
        <OnboardingCard data={dataOnboarding} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={handleSignUp}
          title={t('onboarding.register')}
          buttonStyle={styles.buttonStyle1}
          titleStyle={styles.buttonStyle}
        />
        <Button
          buttonStyle={styles.buttonStyle2}
          onPress={handleSignin}
          title={t('onboarding.login')}
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
