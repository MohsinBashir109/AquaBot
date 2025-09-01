import { FirebaseError } from 'firebase/app';
import auth from '@react-native-firebase/auth';
import { showCustomFlash } from '../utils/flash.tsx';

type Props = {
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

export const register = async ({ email, password }: Props) => {
  try {
    const signUp = await auth().createUserWithEmailAndPassword(email, password);
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

export const login = async ({ email, password }: Props) => {
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
