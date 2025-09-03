import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseError } from 'firebase/app';
import auth from '@react-native-firebase/auth';
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
};

//  Email Login
export const login = async ({ email, password }: LoginProps) => {
  try {
    const loginRes = await auth().signInWithEmailAndPassword(email, password);
    const user = loginRes.user;

    if (!user.emailVerified) {
      showCustomFlash('Please verify your email before logging in.', 'danger');
    }

    //  Get fresh token
    const idToken = await user.getIdToken(true);

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      provider: 'email',
      idToken,
    };

    await AsyncStorage.setItem('user', JSON.stringify(userData));

    return { user, emailVerified: user.emailVerified, idToken };
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

//  Google Login
export const handleSignInGoogle = async () => {
  try {
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    if (!hasPlayServices) {
      showCustomFlash(
        'Please install or update Google Play Services to continue.',
        'danger',
      );
      return null;
    }

    // Google Sign-In
    const userInfo = await GoogleSignin.signIn();
    const { data } = userInfo;
    const { idToken }: any = data;

    if (!idToken) {
      showCustomFlash('Failed to get Google ID token.', 'danger');
      return null;
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);

    //  Get fresh Firebase token
    const freshIdToken = await userCredential.user.getIdToken(true);

    const userData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      provider: 'google',
      idToken: freshIdToken,
    };

    await AsyncStorage.setItem('user', JSON.stringify(userData));

    showCustomFlash(
      `Welcome ${userCredential.user.displayName || 'User'}!`,
      'success',
    );

    return userCredential.user;
  } catch (error: any) {
    console.error('Google Sign-In error:', error);

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

// 🔹 Logout
export const logout = async () => {
  try {
    await auth().signOut();

    const isGoogleSignedIn = await GoogleSignin.getCurrentUser();
    if (isGoogleSignedIn) {
      await GoogleSignin.signOut();
    }

    await AsyncStorage.removeItem('user');

    showCustomFlash('Successfully logged out!', 'success');
  } catch (error) {
    console.error('Logout error:', error);
    showCustomFlash('Something went wrong during logout.', 'danger');
  }
};

//  Get Fresh Token (helper for API calls)
export const getFreshIdToken = async () => {
  const currentUser = auth().currentUser;
  if (!currentUser) return null;

  const newToken = await currentUser.getIdToken(true);

  const storedUser = await AsyncStorage.getItem('user');
  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    parsed.idToken = newToken;
    await AsyncStorage.setItem('user', JSON.stringify(parsed));
  }

  return newToken;
};
