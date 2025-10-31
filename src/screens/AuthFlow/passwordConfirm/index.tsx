import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useRef } from 'react';
import { resetPassword } from '../../../service/signUp';
import { eyes, padlock } from '../../../assets/icons/icons';
import { fontPixel, heightPixel } from '../../../utils/constants';
import { useNavigation, useRoute } from '@react-navigation/native';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { VerificationField } from '../../../components/ThemeComponents/VerificationField';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';
import { useLanguage } from '../../../context/LanguageContext';
import { useThemeContext } from '../../../theme/ThemeContext';
import { colors } from '../../../utils/colors';

const SignIn = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  // Extract email from route params - code will be entered by user
  const { email } = route.params || {};

  const [isHidden, setIsHidden] = useState(true);
  const [isHidden2, setIsHidden2] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState({
    confirmPassword: '',
    password: '',
  });
  const isRequestInProgress = useRef(false);

  const handleReset = async () => {
    // Prevent multiple simultaneous API calls
    if (isRequestInProgress.current || isLoading) {
      console.log(
        '[RESET PASSWORD] API call already in progress, skipping duplicate request',
      );
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      showCustomFlash(
        t('auth.verificationCodeRequired') ||
          'Please enter the 6-digit code from your email',
        'danger',
      );
      return;
    }

    if (!details.password || !details.confirmPassword) {
      showCustomFlash(t('auth.fillBothFields'), 'danger');
      return;
    }

    if (details.password !== details.confirmPassword) {
      showCustomFlash(t('auth.passwordsDoNotMatch'), 'danger');
      return;
    }

    if (!email) {
      showCustomFlash(t('auth.emailRequired') || 'Email is required', 'danger');
      return;
    }

    try {
      isRequestInProgress.current = true;
      setIsLoading(true);

      console.log('[RESET PASSWORD] Starting API call');
      console.log('[RESET PASSWORD] Payload:', {
        email,
        code: verificationCode,
        newPassword: '***',
        confirmPassword: '***',
      });

      const success = await resetPassword(
        email,
        verificationCode,
        details.password,
        details.confirmPassword,
      );

      console.log('[RESET PASSWORD] API call completed, success:', success);

      if (success) {
        showCustomFlash(t('auth.passwordResetSuccess'), 'success');
        // Navigate to sign in after successful reset
        setTimeout(() => {
          navigation.replace(routes.signin);
        }, 1500);
      } else {
        showCustomFlash(t('auth.passwordResetFailed'), 'danger');
      }
    } catch (error) {
      console.error('[RESET PASSWORD] API call failed:', error);
      showCustomFlash(t('auth.passwordResetFailed'), 'danger');
    } finally {
      isRequestInProgress.current = false;
      setIsLoading(false);
    }
  };

  const handleHide = () => {
    setIsHidden(!isHidden);
  };
  const handleHide2 = () => {
    setIsHidden2(!isHidden2);
  };
  const handleBack = () => {
    navigation.navigate(routes.signin);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent}>
      <AuthWrapper
        text={t('auth.resetPasswordTitle')}
        desText={t('auth.resetPasswordDesc')}
      >
        {/* Verification Code Input */}
        <View style={styles.codeContainer}>
          <VerificationField
            title={t('auth.verificationCode') || 'Verification Code'}
            value={verificationCode}
            onChangeText={(code: string) => setVerificationCode(code)}
            leftUnderTitle={
              t('auth.enterCodeFromEmail') ||
              'Enter the 6-digit code sent to your email'
            }
          />
        </View>

        <ThemeInput
          leftIcon={padlock}
          title={t('auth.newPassword')}
          value={details.password}
          onChangeText={(text: string) =>
            setDetails({ ...details, password: text })
          }
          placeHolderColor="green"
          placeholder={t('auth.newPasswordPlaceholder')}
          containerStyleOuter={styles.containerStyleOuter}
          rightIcon={eyes}
          secureTextEntry={isHidden2}
          onPressRightIcon={handleHide2}
        />
        <ThemeInput
          title={t('auth.confirmPassword')}
          leftIcon={padlock}
          rightIcon={eyes}
          value={details.confirmPassword}
          onChangeText={(text: string) =>
            setDetails({ ...details, confirmPassword: text })
          }
          containerStyleOuter={styles.containerStyleOuter2}
          placeHolderColor="green"
          placeholder={t('auth.confirmPasswordPlaceholder')}
          secureTextEntry={isHidden}
          onPressRightIcon={handleHide}
        />

        <Button
          onPress={handleReset}
          title={
            isLoading ? t('auth.loading') || 'Loading...' : t('auth.confirm')
          }
          buttonStyle={styles.buttonStyle1}
          titleStyle={styles.buttonStyle}
          disabled={isLoading}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <ThemeText color="primary" style={styles.loadingText}>
              {t('auth.resettingPasswordMessage') ||
                'Resetting your password...'}
            </ThemeText>
          </View>
        )}
        <Button
          buttonStyle={styles.buttonStyle2}
          onPress={handleBack}
          title={t('auth.backToLogin')}
          textColor="text"
          titleStyle={styles.buttonStyle}
          bgColor="white"
        />
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  containerStyleOuter: {
    marginTop: heightPixel(10),
  },
  containerStyleOuter2: {
    marginVertical: heightPixel(10),
  },
  codeContainer: {
    marginBottom: heightPixel(10),
  },
  buttonStyle1: {
    marginTop: heightPixel(42),
  },
  buttonStyle2: {
    marginVertical: heightPixel(15),
  },
  buttonStyle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
  },
  loadingContainer: {
    marginTop: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: heightPixel(10),
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(14),
  },
});
