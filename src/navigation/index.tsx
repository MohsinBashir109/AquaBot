import * as Auth from '../screens/AuthFlow';

import { StatusBar, StyleSheet } from 'react-native';
import { heightPixel, widthPixel } from '../utils/constants';

import { AuthNavigation } from './authFlow';
import FlashMessage from 'react-native-flash-message';
import { HomeNavigation } from './homeFlow';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routes } from '../utils/routes';

const MyStack = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <MyStack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={routes.auth}
        >
          <MyStack.Screen name={routes.home} component={HomeNavigation} />

          <MyStack.Screen name={routes.auth} component={AuthNavigation} />
        </MyStack.Navigator>

        <FlashMessage
          position="top"
          style={styles.flashContainer}
          floating
          autoHide
          duration={1850}
        />
      </NavigationContainer>
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
