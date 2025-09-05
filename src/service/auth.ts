import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { email } from '../assets/icons/icons.js';
import firestore from '@react-native-firebase/firestore';
import { showCustomFlash } from '../utils/flash.tsx';

//  Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '820550510501-cen042hj386u8j1hju659ev97d3svnvm.apps.googleusercontent.com',
  offlineAccess: true,
});

type SignUpProps = {
  email: string;
  password: string;
  userName: string;
};

type LoginProps = {
  email: string;
  password: string;
};

const errors = {
  // signIn
  wrongPassword: 'auth/wrong-password',
  userNotFound: 'auth/user-not-found',
  invalidEmail: 'auth/invalid-email',
  // signUp
  emailAlreadyInUse: 'auth/email-already-in-use',
  weakPassword: 'auth/weak-password',
};

//  Register new user
export const register = async ({ email, password, userName }: SignUpProps) => {
  try {
    const userQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!userQuery.empty) {
      showCustomFlash('This email is already registered', 'danger');
      return;
    }

    const docRef = await firestore().collection('users').add({
      email,
      password,
      userName,
      provider: 'Email/Password',
    });

    console.log('Generated UID:', docRef.id);
    showCustomFlash('Success! Your account has been created.', 'success');
  } catch (error) {
    console.error('🔥 Firestore Error:', error);
    showCustomFlash('Oops! Something went wrong. Please try again.', 'danger');
    throw error;
  }
};

//  Login
export const login = async ({ email, password }: LoginProps) => {
  try {
    const loginQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (loginQuery.empty) {
      showCustomFlash('No user found with this email', 'danger');
      return;
    }

    const loginDoc = loginQuery.docs[0];
    const loginData = loginDoc.data();
    console.log('=====================================DATA', loginData);

    if (loginData.password !== password) {
      showCustomFlash('Invalid password', 'danger');
      return;
    }
    showCustomFlash(
      ` Login successful. Welcome back, ${loginData.userName}!`,
      'success',
    );
    console.log('Login successful for:', loginData.userName);
  } catch (error) {
    console.error(' Firestore login error:', error);
    showCustomFlash('Oops! An unknown error happened. Kindly retry.', 'danger');
    throw error;
  }
};

//  Google Login
export const handleSignUpGoogle = async (): Promise<boolean> => {
  try {
    await GoogleSignin.signOut();
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    if (!hasPlayServices) {
      showCustomFlash(
        'Please install or update Google Play Services to continue.',
        'danger',
      );
      return false;
    }

    // Google Sign-In
    const userInfo = await GoogleSignin.signIn();
    const { data } = userInfo;
    const { user }: any = data;
    // console.log('userInfo ===================', userInfo);
    const { email, name } = user;
    // console.log(
    //   '=========================================================',
    //   email,
    //   name,
    // );

    const userQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();
    if (!userQuery.empty) {
      showCustomFlash('This email is already registered', 'danger');
      return true;
    }
    await firestore().collection('users').add({
      email: email,
      userName: name,
      password: null,
      provider: 'google',
    });
    showCustomFlash('Congratulations!Account created successfully.', 'success');
    return false;
  } catch (error: any) {
    console.error(' Google Sign-In error:', error);
    showCustomFlash('Something went wrong with Google Sign-In.', 'danger');
  }
  return false;
};

//  Logout

export const logout = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();

    if (currentUser) {
      await GoogleSignin.signOut();
      showCustomFlash(' Successfully logged out from Google!', 'success');
    } else {
      showCustomFlash(' No Google account is currently signed in.', 'danger');
    }
  } catch (error) {
    console.error('Google Logout error:', error);
    showCustomFlash(' Something went wrong during Google logout.', 'danger');
  }
};

export const handleLoginGoogle = async (): Promise<boolean> => {
  try {
    await GoogleSignin.signOut();
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    if (!hasPlayServices) {
      showCustomFlash('Google Play Services required.', 'danger');
      return false;
    }

    // Google Sign-In
    const userInfo = await GoogleSignin.signIn();
    const { data } = userInfo;
    const { user }: any = data;
    // console.log('userInfo ===================', userInfo);
    const { email, name } = user;
    // console.log(
    //   '=========================================================',
    //   email,
    //   name,
    // );

    const userQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (userQuery.empty) {
      showCustomFlash(
        'No account found for this email. Please sign up first.',
        'danger',
      );
      return false;
    }

    showCustomFlash(`👋 Welcome back, ${name}!`, 'success');
    return true;
  } catch (error) {
    console.error('Google Login error:', error);
    showCustomFlash('Something went wrong with Google Login.', 'danger');
    return false;
  }
};
