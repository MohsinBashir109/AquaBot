import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useRef } from 'react';
import { fontPixel, heightPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { authService } from '../../../service/authService';
import { email } from '../../../components/assets/icons/icons';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';
import { useLanguage } from '../../../context/LanguageContext';
import { useThemeContext } from '../../../theme/ThemeContext';
import { colors } from '../../../utils/colors';

const Index = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const [varEmail, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isRequestInProgress = useRef(false);

  const handleSignUp = () => {
    if (!varEmail) {
      showCustomFlash(t('auth.fillInputField'), 'danger');
      return;
    }
    // Commented out for testing - uncomment when ready for production
    // if (!gmailOnly.test(varEmail)) {
    //   showCustomFlash(t('auth.validEmailRequired'), 'danger');
    //   return;
    // }
    handleCheckEmail();
  };
  const handleSignin = () => {
    navigation.navigate(routes.signin);
  };
  const handleCheckEmail = async () => {
    // Prevent multiple simultaneous API calls
    if (isRequestInProgress.current || isLoading) {
      console.log(
        '[FORGOT PASSWORD] API call already in progress, skipping duplicate request',
      );
      return;
    }

    try {
      isRequestInProgress.current = true;
      setIsLoading(true);
      console.log('[FORGOT PASSWORD] Starting API call for email:', varEmail);

      const success = await authService.forgotPassword(varEmail);

      console.log('[FORGOT PASSWORD] API call completed, success:', success);

      if (success) {
        // Navigate to reset password screen where user enters code from email
        navigation.navigate(routes.resetpassword, { email: varEmail });
      } else {
        // Error message is already shown by apiService
        showCustomFlash(t('auth.noAccountWithEmail'), 'danger');
      }
    } catch (error: any) {
      console.error('[FORGOT PASSWORD] API call failed:', error);
      // Error message is already shown by apiService, but add fallback
      const errorMessage =
        error?.message || 'Something went wrong. Please try again.';
      showCustomFlash(errorMessage, 'danger');
    } finally {
      isRequestInProgress.current = false;
      setIsLoading(false);
    }
  };

  return (
    <AuthWrapper
      text={t('auth.forgotPasswordTitle')}
      desText={t('auth.forgotPasswordDesc')}
    >
      <ThemeInput
        leftIcon={email}
        title={t('auth.emailAddress')}
        value={varEmail}
        onChangeText={text => setEmail(text)}
        placeHolderColor="green"
        placeholder={t('auth.emailAddressPlaceholder')}
        containerStyleOuter={styles.containerStyleOuter}
        underLefttitle={t('auth.validEmailHint')}
      />
      <Button
        onPress={handleSignUp}
        title={
          isLoading ? t('auth.loading') || 'Loading...' : t('auth.continue')
        }
        buttonStyle={styles.buttonStyle1}
        titleStyle={styles.buttonStyle}
        disabled={isLoading}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <ThemeText color="primary" style={styles.loadingText}>
            {t('auth.sendingCodeMessage') || 'Sending verification code...'}
          </ThemeText>
        </View>
      )}
      <Button
        buttonStyle={styles.buttonStyle2}
        onPress={handleSignin}
        title={t('auth.backToLogin')}
        textColor="text"
        titleStyle={styles.buttonStyle}
        bgColor="white"
      />
    </AuthWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  containerStyleOuter: {},
  buttonStyle1: {
    marginTop: heightPixel(10),
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
