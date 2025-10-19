import { StatusBar, StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../utils/constants';

import { AuthNavigation } from './AuthFlow';
import FlashMessage from 'react-native-flash-message';
import { HomeNavigation } from './HomeFlow';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../utils/routes';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, Text } from 'react-native';

const MyStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      key={isAuthenticated ? 'authenticated' : 'unauthenticated'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <MyStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? routes.home : routes.auth}
      >
        {isAuthenticated ? (
          <MyStack.Screen name={routes.home} component={HomeNavigation} />
        ) : (
          <MyStack.Screen name={routes.auth} component={AuthNavigation} />
        )}
      </MyStack.Navigator>

      <FlashMessage
        position="top"
        style={styles.flashContainer}
        floating
        autoHide
        duration={1850}
      />
    </NavigationContainer>
  );
};

export const MainNavigator = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  flashContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPixel(15),
    height: heightPixel(40),
  },
});
