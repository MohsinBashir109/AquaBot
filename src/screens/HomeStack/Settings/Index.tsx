import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { showCustomFlash } from '../../../utils/flash';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';

const Index = () => {
  const { logout, user } = useAuth();

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

  return (
    <HomeWrapper>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.userName || 'User'}</Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: widthPixel(20),
    justifyContent: 'space-between',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: heightPixel(50),
  },
  welcomeText: {
    fontSize: fontPixel(24),
    fontFamily: fontFamilies.semibold,
    color: colors.light.text,
    marginBottom: heightPixel(10),
  },
  userName: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.medium,
    color: colors.light.primary,
    marginBottom: heightPixel(5),
  },
  userEmail: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    color: colors.light.gray3,
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
