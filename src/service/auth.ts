import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { FirebaseError } from 'firebase/app';
import auth from '@react-native-firebase/auth';
import { showCustomFlash } from '../utils/flash.tsx';
import { useEffect } from 'react';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '820550510501-cen042hj386u8j1hju659ev97d3svnvm.apps.googleusercontent.com',

  // offlineAccess: true, // optional
});

type SignUpProps = {
  email: string;
  password: string;
  userName: string;
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

export const register = async ({ email, password, userName }: SignUpProps) => {
  try {
    const signUp = await auth().createUserWithEmailAndPassword(email, password);
    await signUp.user.updateProfile({
      displayName: userName,
    });
    await signUp.user.sendEmailVerification();
    showCustomFlash(
      'Verification email sent! Please check your inbox.',
      'success',
    );
  } catch (error) {
    const err = error as FirebaseError;

    switch (err.code) {
      case errors.emailAlreadyInUse:
        showCustomFlash('This email is already registered.', 'danger');
        break;

      case errors.invalidEmail:
        showCustomFlash('Invalid email address.', 'danger');
        break;

      case errors.weakPassword:
        showCustomFlash('Password should be at least 6 characters.', 'danger');
        break;

      default:
        showCustomFlash(
          'Oops! An unknown error happened. Kindly retry.',
          'danger',
        );
    }

    throw error;
  }
  console.log(auth().currentUser?.displayName);
  console.log(auth().currentUser?.email);
  console.log(auth().currentUser?.emailVerified);
};
type LoginProps = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginProps) => {
  try {
    const loginRes = await auth().signInWithEmailAndPassword(email, password);
    const user = loginRes.user;

    if (!user.emailVerified) {
      showCustomFlash('Please verify your email before logging in.', 'danger');
    }

    return { user, emailVerified: user.emailVerified };
  } catch (error) {
    const err = error as FirebaseError;

    switch (err.code) {
      case errors.wrongPassword:
        showCustomFlash('Incorrect password. Please try again.', 'danger');
        break;

      case errors.userNotFound:
        showCustomFlash('No account found with this email.', 'danger');
        break;

      case errors.invalidEmail:
        showCustomFlash('Please enter a valid email address.', 'danger');
        break;

      default:
        showCustomFlash(
          'Oops! An unknown error happened. Kindly retry.',
          'danger',
        );
    }

    throw error;
  }
};

export const handleSignInGoogle = async () => {
  try {
    // Ensure Play Services are available
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    console.log('Play Services available:', hasPlayServices);

    if (!hasPlayServices) {
      showCustomFlash(
        'Please install or update Google Play Services to continue.',
        'danger',
      );
      return null;
    }

    // Sign in with Google
    const userInfo = await GoogleSignin.signIn();
    // console.log('userInfo:', userInfo);

    const { data } = userInfo;
    const { idToken }: any = data;
    if (!idToken) {
      showCustomFlash('Failed to get Google ID token.', 'danger');
      return null;
    }
    // console.log('idToken:', idToken);

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);

    showCustomFlash(
      `Welcome ${userCredential.user.displayName || 'User'}!`,
      'success',
    );
    return userCredential.user;
  } catch (error: any) {
    console.error(' Google Sign-In error:', error);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      showCustomFlash('Google Sign-In was cancelled.', 'danger');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      showCustomFlash(
        'Google Play Services not available or outdated.',
        'danger',
      );
    } else {
      showCustomFlash('Something went wrong with Google Sign-In.', 'danger');
    }
    return null;
  }
};

export const logout = async () => {
  try {
    await auth().signOut();

    const isGoogleSignedIn = GoogleSignin.getCurrentUser();
    if (isGoogleSignedIn) {
      await GoogleSignin.signOut();
    }

    showCustomFlash('Successfully logged out!', 'success');
  } catch (error) {
    console.error('Logout error:', error);
    showCustomFlash('Something went wrong during logout.', 'danger');
  }
};
