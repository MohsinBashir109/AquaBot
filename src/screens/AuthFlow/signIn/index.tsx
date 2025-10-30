import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { email, eyes, padlock } from './../../../assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import ThemedCheckbox from '../../../components/ThemeComponents/ThemeCheckBox';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

const SignIn = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const { t, locale, setLocale } = useLanguage();

  const handleSignUp = () => {
    navigation.navigate(routes.signup);
  };
  const [details, setDetails] = useState({
    email: '',
    password: '',
  });
  const [isHidden, setIsHidden] = useState(true);
  const [showSignupSuggestion, setShowSignupSuggestion] = useState(false);
  const handleHide = () => {
    setIsHidden(!isHidden);
  };
  const onCheckHandle = () => {
    setChecked(!checked);
  };
  const handleCheckBoxPress = () => {
    setChecked(!checked);
  };

  const handleSignIn = async () => {
    if (!details.email || !details.password) {
      showCustomFlash(t('auth.allFieldsRequired'), 'danger');

      return;
    }
    // Commented out for testing - uncomment when ready for production
    // if (!gmailOnly.test(details.email)) {
    //   showCustomFlash('Please enter a valid Email', 'danger');
    //   return;
    // }
    // if (!regexPass.test(details.password)) {
    //   showCustomFlash('Please enter a valid  Password', 'danger');
    //   return;
    // }
    try {
      const success = await login(details);
      if (success) {
        showCustomFlash(t('auth.loginSuccessful'), 'success');
      } else {
        showCustomFlash(t('auth.loginFailed'), 'danger');
      }
    } catch (error: any) {
      // Handle backend error response
      let errorMessage = t('auth.loginFailed');
      let errorType: 'success' | 'danger' = 'danger';

      if (error.response?.data) {
        const responseData = error.response.data;

        // Check for specific error codes (handle both ErrorCode and errorCode)
        const errorCode = responseData.ErrorCode || responseData.errorCode;

        if (errorCode === 'USER_NOT_FOUND') {
          errorMessage =
            responseData.MessageEnglish ||
            responseData.messageEnglish ||
            responseData.Message ||
            responseData.message ||
            'No account found with this email.';
          errorType = 'danger';
          setShowSignupSuggestion(true);
        } else if (errorCode === 'INVALID_CREDENTIALS') {
          errorMessage =
            responseData.MessageEnglish ||
            responseData.messageEnglish ||
            responseData.Message ||
            responseData.message ||
            'Invalid email or password';
          errorType = 'danger';
        } else if (errorCode === 'ACCOUNT_LOCKED') {
          errorMessage =
            responseData.MessageEnglish ||
            responseData.messageEnglish ||
            responseData.Message ||
            responseData.message ||
            'Account is temporarily locked';
          errorType = 'danger';
        } else {
          // Use messageEnglish if available, otherwise fallback to message
          errorMessage =
            responseData.messageEnglish ||
            responseData.MessageEnglish ||
            responseData.message ||
            responseData.Message ||
            error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showCustomFlash(errorMessage, errorType);
    }
  };
  const handleForgotPass = () => {
    navigation.navigate(routes.forgot);
  };
  const [checked, setChecked] = useState(false);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={0}
      enableAutomaticScroll={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <AuthWrapper
        text={t('auth.login')}
        desText={t('auth.loginDesc')}
      >
        {/* Language Radio */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: heightPixel(6) }}>
          <ThemeText color="text" style={{ marginRight: widthPixel(8) }}>
            {t('onboarding.chooseLanguage')}
          </ThemeText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: widthPixel(12) }}>
              <View onTouchEnd={() => setLocale('en')} style={{ width: widthPixel(20), height: widthPixel(20), borderRadius: widthPixel(10), borderWidth: 1, borderColor: '#2E7CF6', alignItems: 'center', justifyContent: 'center', marginRight: widthPixel(6) }}>
                <View style={{ width: widthPixel(10), height: widthPixel(10), borderRadius: widthPixel(5), backgroundColor: locale === 'en' ? '#2E7CF6' : 'transparent' }} />
              </View>
              <ThemeText color="text" onPress={() => setLocale('en')}>EN</ThemeText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View onTouchEnd={() => setLocale('ur')} style={{ width: widthPixel(20), height: widthPixel(20), borderRadius: widthPixel(10), borderWidth: 1, borderColor: '#2E7CF6', alignItems: 'center', justifyContent: 'center', marginRight: widthPixel(6) }}>
                <View style={{ width: widthPixel(10), height: widthPixel(10), borderRadius: widthPixel(5), backgroundColor: locale === 'ur' ? '#2E7CF6' : 'transparent' }} />
              </View>
              <ThemeText color="text" onPress={() => setLocale('ur')}>اردو</ThemeText>
            </View>
          </View>
        </View>
        <ThemeInput
          leftIcon={email}
          title={t('auth.email')}
          value={details.email}
          onChangeText={(text: string) => {
            setDetails({ ...details, email: text });
            setShowSignupSuggestion(false); // Reset suggestion when user types
          }}
          placeHolderColor="green"
          placeholder={t('auth.emailPlaceholder')}
          containerStyleOuter={styles.containerStyleOuter}
        />
        <ThemeInput
          title={t('auth.password')}
          leftIcon={padlock}
          rightIcon={eyes}
          value={details.password}
          onChangeText={(text: string) => {
            setDetails({ ...details, password: text });
            setShowSignupSuggestion(false); // Reset suggestion when user types
          }}
          containerStyleOuter={styles.containerStyleOuter2}
          placeHolderColor="green"
          placeholder={t('auth.passwordPlaceholder')}
          secureTextEntry={isHidden}
          onPressRightIcon={handleHide}
        />
        <View style={styles.checkBoxView}>
          <ThemedCheckbox
            checked={checked}
            onPress={handleCheckBoxPress}
            label={t('auth.rememberMe')}
            onCheck={onCheckHandle}
          />
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity onPress={handleForgotPass}>
            <ThemeText style={styles.forgotText} color="fogotText">
              {t('auth.forgotPassword')}
            </ThemeText>
          </TouchableOpacity>
        </View>
        <Button
          title={t('auth.login')}
          bgColor="buttonBackGround"
          buttonStyle={styles.buttonStyle}
          onPress={handleSignIn}
        />

        {showSignupSuggestion && (
          <View style={styles.signupSuggestion}>
            <ThemeText style={styles.suggestionText} color="text">
              {t('auth.dontHaveAccount')}
            </ThemeText>
            <TouchableOpacity onPress={handleSignUp}>
              <ThemeText color="fogotText" style={styles.signupLink}>
                {t('auth.createAccount')}
              </ThemeText>
            </TouchableOpacity>
          </View>
        )}

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
          <TouchableOpacity onPress={handleSignUp}>
            <ThemeText color="fogotText" style={styles.signUp}>
              {t('auth.signup')}
            </ThemeText>
          </TouchableOpacity>
        </View>
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  accountText: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(13),
  },
  signUp: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(13),
  },
  checkBoxView: { flexDirection: 'row', paddingHorizontal: widthPixel(5) },
  buttonStyle: {
    marginTop: heightPixel(30),
  },

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
    fontSize: fontPixel(13),
  },
  signupSuggestion: {
    marginTop: heightPixel(15),
    padding: widthPixel(15),
    backgroundColor: '#f8f9fa',
    borderRadius: widthPixel(8),
    alignItems: 'center',
  },
  suggestionText: {
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(12),
    marginBottom: heightPixel(5),
  },
  signupLink: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(13),
    textDecorationLine: 'underline',
  },
});
