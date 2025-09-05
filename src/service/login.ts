import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import { showCustomFlash } from '../utils/flash.tsx';

type LoginProps = {
  email: string;
  password: string;
};

//  Register new user

//  Login
export const login = async ({ email, password }: LoginProps) => {
  try {
    //user doesnot exists
    const loginQuery = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (loginQuery.empty) {
      showCustomFlash('No user found with this email', 'danger');
      return { flag: true, user: null };
    }
    // if exists brings the first  one with the email
    const loginDoc = loginQuery.docs[0];
    const loginData = loginDoc.data();
    // if password is not equal to the confirmm passwrod
    if (loginData.password !== password) {
      showCustomFlash('Invalid password', 'danger');
      return { flag: true, user: loginData.userName };
    }
    showCustomFlash(
      ` Login successful. Welcome back, ${loginData.userName}!`,
      'success',
    );
    // console.log('Login successful for:', loginData.userName);
    return { flag: false, user: loginData.userName };
  } catch (error) {
    console.error(' Firestore login error:', error);
    showCustomFlash('Oops! An unknown error happened. Kindly retry.', 'danger');
    throw error;
  }
};

//  Logout
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

    const { email, name } = user;
    // Check if email exist already
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
