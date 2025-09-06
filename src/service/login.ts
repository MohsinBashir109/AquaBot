import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { showCustomFlash } from '../utils/flash.tsx';

// Props for manual login
type LoginProps = {
  email: string;
  password: string;
};

// Key used for AsyncStorage
const USER_KEY = 'Exists';

//
// 🔹 Manual Email/Password Login
//
export const login = async ({ email, password }: LoginProps) => {
  try {
    // Check if a user exists with given email
    const loginQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    // No user found
    if (loginQuery.empty) {
      showCustomFlash('No user found with this email', 'danger');
      return { flag: true, user: null };
    }

    // Take the first matching document
    const loginDoc = loginQuery.docs[0];
    const loginData = loginDoc.data();

    // Password mismatch
    if (loginData.password !== password) {
      showCustomFlash('Invalid password', 'danger');
      return { flag: true, user: loginData.userName };
    }

    // Successful login
    showCustomFlash(
      `Login successful. Welcome back, ${loginData.userName}!`,
      'success',
    );

    // Store user in AsyncStorage for session persistence

    await storeData(loginData.email);

    return { flag: false, user: loginData.userName };
  } catch (error) {
    console.error('Firestore login error:', error);
    showCustomFlash('Oops! An unknown error happened. Kindly retry.', 'danger');
    throw error;
  }
};

//
// 🔹 Google Login
//
export const handleLoginGoogle = async (): Promise<
  'cancelled' | 'not_found' | 'success'
> => {
  try {
    // Ensure fresh login (sign out first)
    await GoogleSignin.signOut();

    // Check if Google Play Services are available
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    if (!hasPlayServices) {
      showCustomFlash('Google Play Services required.', 'danger');
      return 'cancelled';
    }

    // Sign in with Google
    const userInfo = await GoogleSignin.signIn();
    const { data } = userInfo;
    const { user }: any = data;

    // Check if user cancelled or invalid
    if (!user || !user.email) {
      showCustomFlash('Google Sign-In cancelled.', 'danger');
      return 'cancelled';
    }

    const { email, name } = user;

    // Check if user exists in Firestore
    const userQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (userQuery.empty) {
      showCustomFlash(
        'No account found for this email. Please sign up first.',
        'danger',
      );
      return 'not_found';
    }

    // Store user email in AsyncStorage
    await storeData(email);

    // Success flash
    showCustomFlash(`👋 Welcome back, ${name}!`, 'success');
    return 'success';
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      showCustomFlash('Google Sign-In cancelled by user.', 'danger');
      return 'cancelled';
    }
    console.error('Google Login error:', error);
    showCustomFlash('Something went wrong with Google Login.', 'danger');
    return 'cancelled';
  }
};

//
// 🔹 AsyncStorage Helpers
//

// Store user data (email or doc) locally
export const storeData = async (email: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, email);
    await getData(); // Just for debug/logging
    console.log('Added to the local storage');
  } catch (error) {
    console.log(error);
  }
};

// Remove stored user data (logout helper)
export const removeValue = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.log(e);
  }
  console.log('Done.');
};

// Get stored user data for debugging or restoring session
export const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(USER_KEY);
    if (value !== null) {
      console.log('Current stored value:', value);
      return value;
    } else {
      console.log('No value found in local storage.');
      return null;
    }
  } catch (e) {
    console.log('Error reading value', e);
  }
};
