import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { getData, removeValue, storeData } from './login.ts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { showCustomFlash } from '../utils/flash.tsx';

type SignUpProps = {
  email: string;
  password: string;
  userName: string;
};

//  Register new user
export const register = async ({ email, password, userName }: SignUpProps) => {
  try {
    // user already exists
    const userQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!userQuery.empty) {
      showCustomFlash('This email is already registered', 'danger');
      return true;
    }

    // const docRef =
    await firestore().collection('users').add({
      email,
      password,
      userName,
      provider: 'Email/Password',
    });

    // console.log('Generated UID:', docRef.id);
    showCustomFlash('Success! Your account has been created.', 'success');
    return false;
  } catch (error) {
    console.error('🔥 Firestore Error:', error);
    showCustomFlash('Oops! Something went wrong. Please try again.', 'danger');
    throw error;
  }
};

//  Google Login

export const handleSignUpGoogle = async (): Promise<
  'cancelled' | 'exists' | 'success'
> => {
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
      return 'cancelled';
    }

    const userInfo = await GoogleSignin.signIn();
    const { data } = userInfo;
    const { user }: any = data;

    // Check if user cancelled manually or object is missing
    if (!user || !user.email) {
      showCustomFlash('Google Sign-In cancelled.', 'danger');
      return 'cancelled';
    }

    const { email, name } = user;

    const userQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!userQuery.empty) {
      showCustomFlash('This email is already registered', 'danger');
      return 'exists';
    }

    await firestore().collection('users').add({
      email,
      userName: name,
      password: null,
      provider: 'google',
    });

    showCustomFlash(
      'Congratulations! Account created successfully.',
      'success',
    );
    await storeData(email);
    return 'success';
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      showCustomFlash('Google Sign-In cancelled by user.', 'danger');
      return 'cancelled';
    }
    console.error('Google Sign-In error:', error);
    showCustomFlash('Something went wrong with Google Sign-In.', 'danger');
    return 'cancelled';
  }
};

//  Logout

export const logout = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    console.log(
      'before================================================',
      currentUser,
    );
    if (currentUser) {
      await GoogleSignin.signOut();

      showCustomFlash(' Successfully logged out from Google!', 'success');
      await getData();
    } else {
      showCustomFlash(' No Google account is currently signed in.', 'danger');
    }
    await removeValue();
    const afterUser = await GoogleSignin.getCurrentUser();
    console.log(
      'after ===============================================',
      afterUser,
    );
  } catch (error) {
    console.error('Google Logout error:', error);
    showCustomFlash(' Something went wrong during Google logout.', 'danger');
  }
};
