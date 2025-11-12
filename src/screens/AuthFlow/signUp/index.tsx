import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import {
  email,
  eyes,
  padlock,
  userName,
} from '../../../components/assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
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
import { useThemeContext } from '../../../theme/ThemeContext';
import { colors } from '../../../utils/colors';

const Index = ({ navigation }: any) => {
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const handleLogin = () => {
    navigation.navigate(routes.signin);
  };
  const [details, setDetails] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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

    if (isLoading) {
      return;
    }

    // Set loading state immediately to show loader
    setIsLoading(true);
    console.log('[SIGNUP] Starting registration process...');
    console.log('[SIGNUP] isLoading set to:', true);
    console.log('[SIGNUP] Loader should be visible now');

    // Track start time to ensure loader is visible for minimum duration
    const startTime = Date.now();
    const minLoadingTime = 2500; // 2.5 seconds to see the loader and flash message

    try {
      const result = await register(details);

      console.log('[SIGNUP] Registration response received, result:', result);

      // Calculate elapsed time and ensure minimum display time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      if (result === false) {
        // Registration successful
        console.log(
          '[SIGNUP] Registration successful, clearing form and navigating...',
        );
        setDetails({
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Wait for loader timeout to complete, then show flash message and navigate
        setTimeout(() => {
          setIsLoading(false);
          // Show success message after loader hides
          showCustomFlash('Registration successful!', 'success');
          // Navigate after a brief moment to show the flash message
          setTimeout(() => {
            navigation.replace(routes.signin);
          }, 500); // Small delay to show flash message before navigating
        }, remainingTime);
      } else {
        // Registration failed - this shouldn't happen as errors should be thrown
        console.log('[SIGNUP] Registration returned true (error state)');
        setTimeout(() => {
          setIsLoading(false);
          // Show error message after loader hides
          showCustomFlash('Registration failed. Please try again.', 'danger');
        }, remainingTime);
      }
    } catch (error: any) {
      console.log('[SIGNUP] Registration error caught:', error);
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      // Extract error message with detailed handling
      let errorMessage = 'Registration failed. Please try again.';

      if (error?.response?.data) {
        const d = error.response.data;
        const message = String(d.message || d.Message || '').toLowerCase();
        const code = d.errorCode || d.ErrorCode || '';

        // Priority: Check errors array for meaningful detail
        if (
          Array.isArray(d.errors) &&
          d.errors.length > 0 &&
          typeof d.errors[0] === 'string'
        ) {
          const err = d.errors[0];
          // Try to extract username if it's a 'Username ... is already taken' message
          const match = err.match(/username '([^']+)' is already taken/i);
          if (match) {
            errorMessage = `User with the username '${match[1]}' already exists.`;
          } else {
            errorMessage = err;
          }
        } else if (message.includes('already exists')) {
          errorMessage = 'User with this email already exists.';
        } else if (
          message.includes('username') &&
          message.includes('already taken')
        ) {
          // Extract username from the message if possible
          const match = (d.message || d.Message || '').match(
            /username '([^']+)' is already taken/i,
          );
          if (match) {
            errorMessage = `User with the username '${match[1]}' already exists.`;
          } else {
            errorMessage = 'Username is already taken.';
          }
        } else if (code === 'USER_EXISTS') {
          errorMessage = 'User with this email already exists.';
        } else if (d.message) {
          errorMessage = d.message;
        } else if (typeof d === 'string') {
          errorMessage = d;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (!errorMessage || errorMessage.trim() === '') {
        errorMessage = 'Registration failed. Please try again.';
      }

      // Wait for loader timeout to complete, then show flash message
      setTimeout(() => {
        setIsLoading(false);
        showCustomFlash(errorMessage, 'danger');
      }, remainingTime);
    }
  };

  const [isHidden, setIsHidden] = useState({
    password: true,
    confirmPassword: true,
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AuthWrapper text={t('auth.signupTitle')} desText={t('auth.signupDesc')}>
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
          title={
            isLoading
              ? t('auth.signingUp') || 'Signing up...'
              : t('auth.signup')
          }
          bgColor="primary"
          buttonStyle={styles.buttonStyle}
          onPress={handleSignUp}
          disabled={isLoading}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={themeColors.primary || '#2E7CF6'}
              animating={true}
            />
            <ThemeText color="primary" style={styles.loadingText}>
              {t('auth.signingUpMessage') || 'Creating your account...'}
            </ThemeText>
          </View>
        ) : null}

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
  loadingContainer: {
    marginTop: heightPixel(20),
    marginBottom: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(30),
    width: '100%',
    minHeight: heightPixel(120),
  },
  loadingText: {
    marginTop: heightPixel(15),
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(15),
  },
});
