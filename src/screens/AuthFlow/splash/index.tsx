import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {
  aquaLogo,
  authBackGround,
} from '../../../components/assets/images/images';
import React, { useEffect, useRef } from 'react';
import { heightPixel, widthPixel } from '../../../utils/constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../utils/colors';
import { routes } from '../../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../theme/ThemeContext';

const Splash = ({ navigation }: any) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const slideRightAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // First: Logo and text fade in and slide up together
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then: Loading text slide in from right
      Animated.timing(slideRightAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Finally: Gentle pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    // Navigate after 4 seconds
    const timeout = setTimeout(async () => {
      const USER_KEY = 'user_session';
      const token = await AsyncStorage.getItem(USER_KEY);
      console.log(token);
      if (token) {
        //@ts-ignore
        navigation.replace(routes?.home);
      } else {
        //@ts-ignore
        navigation.replace(routes?.onboarding);
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={authBackGround}
      style={[
        styles.background,
        {
          paddingTop: insets.top,
          backgroundColor: colors[isDark ? 'dark' : 'light'].background,
        },
      ]}
    >
      <View style={styles.container}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />

        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }, { translateY: slideUpAnim }],
            },
          ]}
        >
          <Image
            source={aquaLogo}
            resizeMode="contain"
            style={styles.splashImage}
          />
        </Animated.View>

        {/* Animated App Name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <Text style={styles.appName}>AquaBot</Text>
          <Text style={styles.tagline}>Smart Irrigation Solutions</Text>
        </Animated.View>

        {/* Catchy Loading Text */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              transform: [{ translateX: slideRightAnim }],
            },
          ]}
        >
          <Text style={styles.loadingSubtext}>
            Preparing your irrigation assistant...
          </Text>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(30),
  },
  splashImage: {
    width: widthPixel(250),
    height: heightPixel(280),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: heightPixel(40),
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#30A7FB',
    marginBottom: heightPixel(8),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: heightPixel(100),
    alignItems: 'center',
  },
  loadingTextContainer: {
    marginBottom: heightPixel(8),
  },
  loadingSubtextContainer: {
    // No margin needed as it's the last element
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#30A7FB',
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  background: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
