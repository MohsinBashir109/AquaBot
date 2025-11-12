import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React, { useCallback, useState } from 'react';
import { authService } from '../service/authService';
import { fontPixel, heightPixel, widthPixel } from '../utils/constants';
import { showCustomFlash } from '../utils/flash';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../theme/ThemeContext';
import { colors } from '../utils/colors';
import { fontFamilies } from '../utils/fontfamilies';
import Button from './ThemeComponents/ThemeButton';
import ThemeText from './ThemeComponents/ThemeText';
import { VerificationField } from './ThemeComponents/VerificationField';

interface EmailVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
  email: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isVisible,
  onClose,
  onVerificationSuccess,
  email,
}) => {
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyEmail = async () => {
    // Validation
    if (!verificationCode || verificationCode.length !== 6) {
      showCustomFlash(
        t('auth.enterVerificationCode') ||
          'Please enter the 6-digit verification code',
        'danger',
      );
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const success = await authService.verifyEmail(email, verificationCode);

      if (success) {
        showCustomFlash(
          t('auth.emailVerifiedSuccess') ||
            'Your email has been verified successfully! You can now login',
          'success',
        );
        // Clear form
        setVerificationCode('');
        // Close modal and notify parent
        onClose();
        onVerificationSuccess();
      } else {
        showCustomFlash(
          t('auth.verificationFailed') ||
            'Verification failed. Please try again.',
          'danger',
        );
      }
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage =
        t('auth.verificationFailed') ||
        'Failed to verify email. Please try again.';

      if (error?.response?.data) {
        const responseData = error.response.data;

        // Check for specific error codes
        const errorCode =
          responseData.errorCode || responseData.ErrorCode || '';

        if (errorCode === 'USER_NOT_FOUND') {
          errorMessage =
            responseData.message ||
            responseData.Message ||
            t('auth.invalidVerificationRequest') ||
            'Invalid verification request';
        } else if (errorCode === 'CODE_EXPIRED') {
          errorMessage =
            responseData.message ||
            responseData.Message ||
            t('auth.verificationCodeExpired') ||
            'Verification code expired. Please request a new code';
        } else if (errorCode === 'INVALID_CODE') {
          errorMessage =
            responseData.message ||
            responseData.Message ||
            t('auth.invalidVerificationCode') ||
            'The verification code is invalid';
        } else {
          errorMessage =
            responseData.message ||
            responseData.Message ||
            responseData.messageEnglish ||
            responseData.MessageEnglish ||
            errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showCustomFlash(errorMessage, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setVerificationCode('');
      onClose();
    }
  }, [isLoading, onClose]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onSwipeComplete={handleClose}
      swipeDirection={['down']}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.7}
      backdropColor="#000"
      hasBackdrop={true}
      avoidKeyboard={true}
      coverScreen={true}
      statusBarTranslucent={true}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={false}
      propagateSwipe={false}
    >
      <View style={styles.modalWrapper}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          bounces={false}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themeColors.background },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <ThemeText style={styles.headerTitle} color="text">
                {t('auth.verifyEmailTitle') || 'Verify Your Email'}
              </ThemeText>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                style={styles.closeButton}
              >
                <ThemeText style={styles.closeButtonText} color="text">
                  ✕
                </ThemeText>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <ThemeText style={styles.description} color="secondaryText">
              {t('auth.verifyEmailDescription') ||
                `We've sent a 6-digit verification code to`}{' '}
              <ThemeText style={styles.emailText} color="primary">
                {email}
              </ThemeText>
              {'. '}
              {t('auth.verifyEmailDescription2') ||
                'Please enter it below to verify your email address.'}
            </ThemeText>

            {/* Verification Code Input */}
            <View style={styles.verificationContainer}>
              <VerificationField
                value={verificationCode}
                onChangeText={setVerificationCode}
                title={t('auth.verificationCode') || 'Verification Code'}
                editable={!isLoading}
              />
            </View>

            {/* Verify Button */}
            <Button
              title={
                isLoading
                  ? t('auth.verifying') || 'Verifying...'
                  : t('auth.verifyEmail') || 'Verify Email'
              }
              bgColor="primary"
              buttonStyle={styles.button}
              onPress={handleVerifyEmail}
              disabled={isLoading || verificationCode.length !== 6}
            />

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.primary} />
                <ThemeText color="primary" style={styles.loadingText}>
                  {t('auth.verifyingMessage') || 'Verifying your email...'}
                </ThemeText>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EmailVerificationModal;

const styles = StyleSheet.create({
  modal: {
    width: '95%',
    alignSelf: 'center',
    margin: 0,
    justifyContent: 'center',
  },
  modalWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: widthPixel(20),
    width: '100%',
  },
  modalContent: {
    width: '100%',
    borderRadius: widthPixel(16),
    padding: widthPixel(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    margin: 0,
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(20),
  },
  headerTitle: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.bold,
  },
  closeButton: {
    width: widthPixel(30),
    height: widthPixel(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontPixel(24),
    fontWeight: 'bold',
  },
  description: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(25),
    textAlign: 'center',
    lineHeight: fontPixel(20),
  },
  verificationContainer: {
    marginBottom: heightPixel(20),
  },
  button: {
    marginTop: heightPixel(10),
  },
  loadingContainer: {
    marginTop: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(10),
  },
  loadingText: {
    marginTop: heightPixel(10),
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(14),
  },
  emailText: {
    fontFamily: fontFamilies.semibold,
  },
});

