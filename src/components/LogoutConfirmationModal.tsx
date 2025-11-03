import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React, { useCallback, useState } from 'react';
import { fontPixel, heightPixel, widthPixel } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../theme/ThemeContext';
import { colors } from '../utils/colors';
import { fontFamilies } from '../utils/fontfamilies';
import Button from './ThemeComponents/ThemeButton';
import ThemeText from './ThemeComponents/ThemeText';
import { showCustomFlash } from '../utils/flash';

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      await onConfirm();
      showCustomFlash(
        t('settings.logoutSuccess') || 'Logged out successfully!',
        'success',
      );
    } catch (error) {
      console.error('Logout error:', error);
      showCustomFlash(
        t('settings.logoutFailed') || 'Logout failed. Please try again.',
        'danger',
      );
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
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
        <View
          style={[
            styles.modalContent,
            { backgroundColor: themeColors.background },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemeText style={styles.headerTitle} color="text">
              {t('settings.logout') || 'Logout'}
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

          {/* Message */}
          <View style={styles.content}>
            <ThemeText style={styles.message} color="text">
              {t('settings.logoutConfirmation') ||
                'Are you sure you want to logout?'}
            </ThemeText>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title={t('common.cancel') || 'Cancel'}
                bgColor="secondary"
                buttonStyle={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isLoading}
              />
              <Button
                title={t('settings.logout') || 'Logout'}
                bgColor="primary"
                buttonStyle={styles.button}
                onPress={handleConfirm}
                disabled={isLoading}
              />
            </View>

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.primary} />
                <ThemeText color="primary" style={styles.loadingText}>
                  {t('settings.loggingOut') || 'Logging out...'}
                </ThemeText>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmationModal;

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
  content: {
    width: '100%',
  },
  message: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(24),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: widthPixel(12),
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: widthPixel(6),
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

