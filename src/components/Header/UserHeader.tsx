import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../context/LanguageContext';

interface UserHeaderProps {
  onSettingsPress?: () => void;
  onBackPress?: () => void;
  screenTitle?: string;
  showBackButton?: boolean;
  showDrawerButton?: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  onSettingsPress,
  onBackPress,
  screenTitle: _screenTitle,
  showBackButton = false,
  showDrawerButton = false,
}) => {
  const { user } = useAppSelector(state => state.user);
  const { isDark } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useLanguage();

  const themeColors = colors[isDark ? 'dark' : 'light'];

  // Debug logging removed in production UI

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDrawerToggle = () => {
    console.log('Drawer toggle pressed');
    console.log('Navigation object:', navigation);
    console.log('Navigation state:', navigation.getState());

    try {
      console.log('Attempting to open drawer...');
      (navigation as any).openDrawer();
      console.log('Drawer opened successfully');
    } catch (error) {
      console.error('Error opening drawer:', error);
      console.log('Available navigation methods:', Object.keys(navigation));
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.transparent,
          paddingTop: heightPixel(5), // Reduced top padding
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      {/* User Profile Header */}
      <View style={styles.userHeaderRow}>
        <View style={styles.userInfoSection}>
          {showBackButton && onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              style={[styles.backButton, { backgroundColor: 'transparent' }]}
            >
              <Text style={[styles.backIcon, { color: themeColors.icon }]}>
                ←
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.userAvatar,
                {
                  backgroundColor: themeColors.primary,
                  shadowColor: themeColors.primary,
                },
              ]}
            >
              {user.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: widthPixel(22.5),
                  }}
                />
              ) : (
                <Text style={[styles.avatarText, { color: 'white' }]}>
                  {getInitials(user.userName)}
                </Text>
              )}
            </View>
            <View
              style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]}
            />
          </View>

          <View style={styles.userDetails}>
            <Text
              style={[
                styles.greetingText,
                { color: themeColors.secondaryText },
              ]}
            >
              {t('home.welcomeBack')}
            </Text>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {user.userName}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          {/* Always show drawer button for testing */}
          <TouchableOpacity
            onPress={handleDrawerToggle}
            style={[
              styles.actionButton,
              {
                backgroundColor: 'transparent',
              },
            ]}
          >
            <Text style={[styles.actionIcon, { color: themeColors.text }]}>
              ≡
            </Text>
          </TouchableOpacity>

          {showDrawerButton && (
            <TouchableOpacity
              onPress={handleDrawerToggle}
              style={[
                styles.actionButton,
                {
                  backgroundColor: 'transparent',
                },
              ]}
            >
              <Text style={[styles.actionIcon, { color: themeColors.text }]}>
                ≡
              </Text>
            </TouchableOpacity>
          )}
          {onSettingsPress && !showDrawerButton && (
            <TouchableOpacity
              onPress={onSettingsPress}
              style={[styles.actionButton, { backgroundColor: 'transparent' }]}
            >
              <Text style={[styles.actionIcon, { color: themeColors.icon }]}>
                ⚙️
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthPixel(0), // Remove horizontal padding as HomeWrapper already provides it
    paddingBottom: heightPixel(15),
    width: '100%',
  },
  userHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: heightPixel(8),
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthPixel(10),
  },
  backIcon: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.bold,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: widthPixel(12),
  },
  userAvatar: {
    width: widthPixel(45),
    height: widthPixel(45),
    borderRadius: widthPixel(22.5),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  avatarText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: widthPixel(12),
    height: widthPixel(12),
    borderRadius: widthPixel(6),
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  greetingText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(2),
  },
  userName: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    lineHeight: fontPixel(20),
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  actionButton: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: fontPixel(20),
  },
});

export default UserHeader;
