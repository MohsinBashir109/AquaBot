import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React from 'react';
import { UserHeader } from '../../../components/Header';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppDispatch } from '../../../store/hooks';
import { updateUserAvatar } from '../../../store/userSlice';
import { useLanguage } from '../../../context/LanguageContext';

const Index = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const { t } = useLanguage();

  // navigation actions are provided via header buttons

  return (
    <HomeWrapper>
      <UserHeader
        showDrawerButton={true}
        showBackButton={false}
        screenTitle={t('profile.title')}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          {/* Avatar with camera button */}
          <View style={styles.avatarUploadContainer}>
            <View
              style={[styles.bigAvatar, { borderColor: themeColors.primary }]}
            >
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: widthPixel(50),
                  }}
                />
              ) : (
                <Text
                  style={[styles.avatarLetter, { color: themeColors.text }]}
                >
                  {(user?.userName || t('profile.defaultName'))
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={async () => {
                const res = await launchImageLibrary({
                  mediaType: 'photo',
                  selectionLimit: 1,
                });
                const uri = res.assets && res.assets[0]?.uri;
                if (uri) {
                  dispatch(updateUserAvatar(uri));
                }
              }}
              activeOpacity={0.8}
              style={[
                styles.cameraButton,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <Text style={{ color: 'white' }}>📷</Text>
            </TouchableOpacity>
          </View>
          {/* Account details */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>
              {t('profile.accountDetails')}
            </Text>
            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: themeColors.secondaryText },
                ]}
              >
                {t('profile.email')}
              </Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: themeColors.secondaryText },
                ]}
              >
                {t('profile.location')}
              </Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>
                —
              </Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity activeOpacity={0.8} style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: themeColors.secondaryText },
                ]}
              >
                {t('profile.changePassword')}
              </Text>
              <Text style={{ opacity: 0.5 }}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Logout removed per request */}
        </View>
      </ScrollView>
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // Removed paddingHorizontal as it's already handled by HomeWrapper
  },
  scrollContent: {
    width: '100%',
    paddingBottom: heightPixel(30),
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: heightPixel(10), // Reduced top margin for better spacing
  },
  avatarUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(16),
  },
  bigAvatar: {
    width: widthPixel(100),
    height: widthPixel(100),
    borderRadius: widthPixel(50),
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F0FF',
  },
  avatarLetter: {
    fontSize: fontPixel(36),
    fontFamily: fontFamilies.bold,
  },
  cameraButton: {
    position: 'absolute',
    right: widthPixel(8),
    bottom: widthPixel(0),
    width: widthPixel(32),
    height: widthPixel(32),
    borderRadius: widthPixel(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    width: '100%',
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(16),
  },
  card: {
    width: '100%',
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(16),
  },
  cardTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(10),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: heightPixel(10),
  },
  statIcon: {
    marginBottom: heightPixel(6),
  },
  statLabel: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(4),
  },
  statValue: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
  },
  detailRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: heightPixel(10),
  },
  detailLabel: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
  },
  detailValue: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.medium,
  },
  divider: {
    height: 1,
    opacity: 0.1,
    backgroundColor: '#000',
  },
  logoutTile: {
    width: '100%',
    borderRadius: widthPixel(12),
    alignItems: 'center',
    paddingVertical: heightPixel(12),
  },
  logoutText: {
    color: 'white',
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(12),
  },
  avatar: {
    width: widthPixel(56),
    height: widthPixel(56),
    borderRadius: widthPixel(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthPixel(12),
  },
  avatarText: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
  },
  title: {
    fontSize: fontPixel(24),
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    marginBottom: heightPixel(8),
  },
  subtitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
    marginBottom: heightPixel(30),
  },
  editBtn: {
    alignSelf: 'flex-start',
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(14),
  },
  editBtnText: {
    color: 'white',
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(14),
  },
  comingSoonCard: {
    padding: widthPixel(20),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    width: '100%',
  },
  comingSoonText: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.semibold,
    textAlign: 'center',
    marginBottom: heightPixel(8),
  },
  comingSoonSubtext: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
    lineHeight: fontPixel(20),
  },
});
