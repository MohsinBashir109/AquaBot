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
import { eyes, padlock } from '../assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from '../utils/constants';
import { showCustomFlash } from '../utils/flash';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../theme/ThemeContext';
import { colors } from '../utils/colors';
import { fontFamilies } from '../utils/fontfamilies';
import Button from './ThemeComponents/ThemeButton';
import ThemeInput from './ThemeComponents/ThemeInput';
import ThemeText from './ThemeComponents/ThemeText';

interface ChangePasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPasswordChanged: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isVisible,
  onClose,
  onPasswordChanged,
}) => {
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState({
    current: true,
    new: true,
    confirm: true,
  });

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      showCustomFlash(
        t('auth.fillAllFields') || 'Please fill in all fields',
        'danger',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showCustomFlash(
        t('auth.passwordsDoNotMatch') || 'New passwords do not match',
        'danger',
      );
      return;
    }

    if (currentPassword === newPassword) {
      showCustomFlash(
        t('auth.newPasswordMustBeDifferent') ||
          'New password must be different from current password',
        'danger',
      );
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const success = await authService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      if (success) {
        showCustomFlash(
          t('auth.passwordChangedSuccess') ||
            'Your password has been changed successfully',
          'success',
        );
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Close modal and notify parent
        onClose();
        onPasswordChanged();
      } else {
        showCustomFlash(
          t('auth.failedToChangePassword') ||
            'Failed to change password. Please check your current password',
          'danger',
        );
      }
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage =
        t('auth.failedToChangePassword') ||
        'Failed to change password. Please try again.';

      if (error?.response?.data) {
        const responseData = error.response.data;

        // Check for specific error codes
        const errorCode =
          responseData.errorCode || responseData.ErrorCode || '';

        if (errorCode === 'UNAUTHORIZED') {
          errorMessage =
            responseData.message ||
            responseData.Message ||
            t('auth.userNotAuthenticated') ||
            'User not authenticated';
        } else if (errorCode === 'PASSWORD_CHANGE_FAILED') {
          // Check for errors array
          if (
            Array.isArray(responseData.errors) &&
            responseData.errors.length > 0
          ) {
            errorMessage = responseData.errors[0];
          } else if (
            Array.isArray(responseData.Errors) &&
            responseData.Errors.length > 0
          ) {
            errorMessage = responseData.Errors[0];
          } else {
            errorMessage =
              responseData.message ||
              responseData.Message ||
              t('auth.incorrectCurrentPassword') ||
              'Incorrect password.';
          }
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
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
                {t('auth.changePasswordTitle') || 'Change Password'}
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

            {/* Form */}
            <View style={styles.form}>
              <ThemeInput
                title={t('auth.oldPassword') || 'Current Password'}
                leftIcon={padlock}
                rightIcon={eyes}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={
                  t('auth.oldPasswordPlaceholder') || 'Enter current password'
                }
                secureTextEntry={isHidden.current}
                onPressRightIcon={() =>
                  setIsHidden({ ...isHidden, current: !isHidden.current })
                }
                containerStyleOuter={styles.inputContainer}
              />

              <ThemeInput
                title={t('auth.newPassword') || 'New Password'}
                leftIcon={padlock}
                rightIcon={eyes}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={
                  t('auth.newPasswordPlaceholder') || 'Enter new password'
                }
                secureTextEntry={isHidden.new}
                onPressRightIcon={() =>
                  setIsHidden({ ...isHidden, new: !isHidden.new })
                }
                containerStyleOuter={styles.inputContainer}
              />

              <ThemeInput
                title={t('auth.confirmNewPassword') || 'Confirm New Password'}
                leftIcon={padlock}
                rightIcon={eyes}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={
                  t('auth.confirmNewPasswordPlaceholder') ||
                  'Confirm new password'
                }
                secureTextEntry={isHidden.confirm}
                onPressRightIcon={() =>
                  setIsHidden({ ...isHidden, confirm: !isHidden.confirm })
                }
                containerStyleOuter={styles.inputContainer}
              />

              {/* Change Password Button */}
              <Button
                title={
                  isLoading
                    ? t('auth.changingPassword') || 'Changing Password...'
                    : t('auth.changePasswordButton') || 'Change Password'
                }
                bgColor="primary"
                buttonStyle={styles.button}
                onPress={handleChangePassword}
                disabled={isLoading}
              />

              {/* Loading Indicator */}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={themeColors.primary} />
                  <ThemeText color="primary" style={styles.loadingText}>
                    {t('auth.changingPasswordMessage') ||
                      'Changing password...'}
                  </ThemeText>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;

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
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: heightPixel(15),
  },
  button: {
    marginTop: heightPixel(20),
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
});
