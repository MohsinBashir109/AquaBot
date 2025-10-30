import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { email, eyes, padlock, userName } from '../../../assets/icons/icons';
import {
  fontPixel,
  gmailOnly,
  heightPixel,
  regexPass,
  username,
  widthPixel,
} from '../../../utils/constants';
import { register } from '../../../service/signUp';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';
import { useLanguage } from '../../../context/LanguageContext';

const Index = ({ navigation }: any) => {
  const { t } = useLanguage();
  const handleLogin = () => {
    navigation.navigate(routes.signin);
  };
  const [details, setDetails] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignUp = async () => {
    if (
      !details.email ||
      !details.password ||
      !details.confirmPassword ||
      !details.userName
    ) {
      showCustomFlash(t('auth.allFieldsRequired'), 'danger');
      return;
    }

    // Commented out for testing - uncomment when ready for production
    // if (!username.test(details.userName)) {
    //   showCustomFlash('Please enter a valid username', 'danger');
    //   return;
    // }

    // if (!gmailOnly.test(details.email)) {
    //   showCustomFlash('Please enter a valid  Email', 'danger');
    //   return;
    // }

    // if (!regexPass.test(details.password)) {
    //   showCustomFlash('Please enter a valid Password', 'danger');
    //   return;
    // }

    if (details.confirmPassword !== details.password) {
      showCustomFlash(t('auth.passwordsDoNotMatch'), 'danger');
      return;
    }

    try {
      const result = await register(details);

      if (result === false) {
        // Registration successful
        setDetails({
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        navigation.replace(routes.signin);
      } else {
        // Registration failed - this shouldn't happen as errors should be thrown
        showCustomFlash('Registration failed. Please try again.', 'danger');
      }
    } catch (error: any) {
      // Do not show a flash message here! signUp.ts handles all registration errors
      // Optionally log the error for debugging:
      // console.error('Registration error:', error);
    }
  };

  const [isHidden, setIsHidden] = useState({
    password: true,
    confirmPassword: true,
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AuthWrapper
        text={t('auth.signupTitle')}
        desText={t('auth.signupDesc')}
      >
        <ThemeInput
          title={t('auth.username')}
          value={details.userName}
          onChangeText={(text: string) =>
            setDetails({ ...details, userName: text })
          }
          placeholder={t('auth.usernamePlaceholder')}
          leftIcon={userName}
        />
        <ThemeInput
          title={t('auth.email')}
          value={details.email}
          onChangeText={(text: string) =>
            setDetails({ ...details, email: text })
          }
          placeholder={t('auth.emailPlaceholder')}
          leftIcon={email}
          containerStyleOuter={styles.containerStyle}
        />
        <ThemeInput
          title={t('auth.password')}
          value={details.password}
          onChangeText={(text: string) =>
            setDetails({ ...details, password: text })
          }
          placeholder={t('auth.passwordPlaceholder')}
          leftIcon={padlock}
          rightIcon={eyes}
          secureTextEntry={isHidden.password}
          onPressRightIcon={() =>
            setIsHidden({ ...isHidden, password: !isHidden.password })
          }
        />
        <ThemeInput
          title={t('auth.confirmPassword')}
          value={details.confirmPassword}
          onChangeText={(text: string) =>
            setDetails({ ...details, confirmPassword: text })
          }
          placeholder={t('auth.confirmPasswordPlaceholder')}
          leftIcon={padlock}
          containerStyleOuter={styles.containerStyle}
          rightIcon={eyes}
          secureTextEntry={isHidden.confirmPassword}
          onPressRightIcon={() =>
            setIsHidden({
              ...isHidden,
              confirmPassword: !isHidden.confirmPassword,
            })
          }
        />
        <Button
          title={t('auth.signup')}
          bgColor="primary"
          buttonStyle={styles.buttonStyle}
          onPress={handleSignUp}
        />

        <View
          style={{
            marginVertical: heightPixel(10),
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <ThemeText style={styles.accountText} color="text">
            {t('auth.dontHaveAccount')}
          </ThemeText>
          <TouchableOpacity onPress={handleLogin}>
            <ThemeText color="fogotText" style={styles.signUp}>
              {t('auth.login')}
            </ThemeText>
          </TouchableOpacity>
        </View>
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: heightPixel(10),
  },
  buttonStyle: {
    marginTop: heightPixel(15),
  },

  accountText: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(13),
  },
  signUp: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(13),
  },
  checkBoxView: { flexDirection: 'row', paddingHorizontal: widthPixel(5) },

  Row: {
    flexDirection: 'row',
  },
  textStyle: {
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(14),
  },
  containerStyleOuter: {},
  containerStyleOuter2: {
    marginVertical: heightPixel(10),
  },
  forgotText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(14),
  },
});
