import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { showCustomFlash } from '../../../utils/flash';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { UserHeader } from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../theme/ThemeContext';

const Index = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            showCustomFlash('Logged out successfully!', 'success');
          } catch (error) {
            console.error('Logout error:', error);
            showCustomFlash('Logout failed. Please try again.', 'danger');
          }
        },
      },
    ]);
  };

  const handleSettingsPress = () => {
    // Already on settings page
    showCustomFlash('You are already on the settings page!', 'success');
  };

  return (
    <HomeWrapper>
      <UserHeader
        showDrawerButton={true}
        showBackButton={false}
        screenTitle="Settings"
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.userInfo}>
            <Text style={[styles.welcomeText, { color: themeColors.text }]}>
              Welcome back!
            </Text>
            <Text style={[styles.userName, { color: themeColors.primary }]}>
              {user?.userName || 'User'}
            </Text>
            <Text
              style={[styles.userEmail, { color: themeColors.secondaryText }]}
            >
              {user?.email || 'user@example.com'}
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
  },
  container: {
    flex: 1,
    padding: widthPixel(20),
    justifyContent: 'space-between',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: heightPixel(20),
  },
  welcomeText: {
    fontSize: fontPixel(24),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(10),
  },
  userName: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.medium,
    marginBottom: heightPixel(5),
  },
  userEmail: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(30),
    borderRadius: widthPixel(10),
    alignItems: 'center',
    marginBottom: heightPixel(50),
  },
  logoutButtonText: {
    color: 'white',
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
  },
});
