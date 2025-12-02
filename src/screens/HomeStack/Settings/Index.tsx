import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { UserHeader } from '../../../components/Header';
import SettingsRow from '../../../components/Settings/SettingsRow';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import ChangePasswordModal from '../../../components/ChangePasswordModal';
import LogoutConfirmationModal from '../../../components/LogoutConfirmationModal';
import { showCustomFlash } from '../../../utils/flash';

const Index = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const { t, locale, setLocale } = useLanguage();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // No notifications toggle in settings

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
  };

  const handleNavigate = (feature: string) => {
    showCustomFlash(t('common.comingSoon', { feature }), 'success');
  };

  return (
    <HomeWrapper>
      <UserHeader
        showDrawerButton={true}
        showBackButton={false}
        screenTitle={t('settings.title')}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Navigation section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.secondaryText },
              ]}
            >
              {t('settings.title')}
            </Text>

            <SettingsRow
              icon="👤"
              label={t('settings.accountProfile')}
              onPress={() => navigation.navigate('Profile' as never)}
            />

            {/* Removed Zones & Schedules and Plant Preferences per request */}
          </View>

          {/* App settings */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: themeColors.secondaryText },
              ]}
            >
              {t('settings.appSettings')}
            </Text>

            {/* Removed Notifications row per request */}

            <SettingsRow
              icon={isDark ? '🌙' : '☀️'}
              label={t('common.darkMode')}
              rightElement={
                <Switch value={isDark} onValueChange={toggleTheme} />
              }
              showChevron={false}
            />

            <SettingsRow
              icon="🔒"
              label={t('settings.updatePassword')}
              onPress={() => setShowChangePasswordModal(true)}
            />

            <SettingsRow
              icon="🌐"
              label={t('common.language')}
              rightElement={
                <>
                  <Text style={{ marginRight: widthPixel(8) }}>
                    {locale === 'ur' ? t('common.urdu') : t('common.english')}
                  </Text>
                  <Switch
                    value={locale === 'ur'}
                    onValueChange={v => setLocale(v ? 'ur' : 'en')}
                  />
                </>
              }
              showChevron={false}
            />

            <SettingsRow
              icon="❓"
              label={t('settings.helpCenter')}
              onPress={() => handleNavigate(t('settings.helpCenter'))}
            />
          </View>

          {/* Logout (styled like other tiles) */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: themeColors.background }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={[styles.itemIcon]}>🚪</Text>
            <Text style={[styles.itemText, { color: themeColors.text }]}>
              {t('settings.logout')}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isVisible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onPasswordChanged={() => {
          setShowChangePasswordModal(false);
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isVisible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // ScrollView takes full width from wrapper
  },
  scrollContent: {
    paddingBottom: heightPixel(30),
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  contentInner: {},
  card: {
    width: '100%',
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginTop: heightPixel(10),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(4),
  },
  avatar: {
    width: widthPixel(48),
    height: widthPixel(48),
    borderRadius: widthPixel(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
  },
  userName: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(2),
  },
  userEmail: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.regular,
  },
  section: {
    width: '100%',
    marginTop: heightPixel(18),
  },
  sectionTitle: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.medium,
    marginBottom: heightPixel(6),
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(14),
    borderRadius: widthPixel(10),
    marginBottom: heightPixel(8),
  },
  itemIcon: {
    width: widthPixel(24),
    textAlign: 'center',
    marginRight: widthPixel(10),
  },
  itemText: {
    flex: 1,
    fontSize: fontPixel(15),
    fontFamily: fontFamilies.regular,
  },
  chevron: {
    fontSize: fontPixel(18),
    opacity: 0.5,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(30),
    borderRadius: widthPixel(10),
    alignItems: 'center',
    marginBottom: heightPixel(50),
    width: '100%',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
  },
});
