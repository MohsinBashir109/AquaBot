import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';

interface UserHeaderProps {
  onProfilePress?: () => void;
  onLocationPress?: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  onProfilePress,
  onLocationPress,
}) => {
  const { user } = useAppSelector(state => state.user);
  const { isDark } = useThemeContext();

  // Debug Redux data
  console.log('🎨 UserHeader - Redux user data:', user);
  console.log('🎨 UserHeader - Redux user type:', typeof user);
  console.log(
    '🎨 UserHeader - Redux user keys:',
    user ? Object.keys(user) : 'null',
  );

  const themeColors = colors[isDark ? 'dark' : 'light'];

  if (!user) {
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatar, { backgroundColor: themeColors.primary }]}
          >
            <Text style={[styles.avatarText, { color: 'white' }]}>
              {user.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.userDetails}>
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.nameContainer}
          >
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {user.userName}
            </Text>
            <Text style={[styles.editIcon, { color: themeColors.gray3 }]}>
              ✏️
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLocationPress}
            style={styles.locationContainer}
          >
            <Text style={[styles.locationIcon, { color: themeColors.gray3 }]}>
              📍
            </Text>
            <Text style={[styles.location, { color: themeColors.gray3 }]}>
              {user.farmLocation || 'Location not set'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
        <Text style={[styles.statusText, { color: themeColors.gray3 }]}>
          Online
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: widthPixel(12),
  },
  avatar: {
    width: widthPixel(45),
    height: widthPixel(45),
    borderRadius: widthPixel(22.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.semibold,
  },
  userDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(2),
  },
  userName: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
    marginRight: widthPixel(5),
  },
  editIcon: {
    fontSize: fontPixel(12),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: fontPixel(12),
    marginRight: widthPixel(4),
  },
  location: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
    marginRight: widthPixel(5),
  },
  statusText: {
    fontSize: fontPixel(10),
    fontFamily: fontFamilies.medium,
  },
});

export default UserHeader;
