import { Text, View, StyleSheet } from 'react-native';

import Button from '../../../components/ThemeComponents/ThemeButton';
import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { showCustomFlash } from '../../../utils/flash';

const Index = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      showCustomFlash('Logged out successfully!', 'success');
      // Navigation will be handled automatically by AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      showCustomFlash('Logout failed. Please try again.', 'danger');
    }
  };

  return (
    <View style={styles.container}>
      <HomeWrapper>
        <Text>Welcome to AquaBot Home!</Text>
        <Button onPress={handleLogout} title="logout" />
      </HomeWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Index;
