import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '820550510501-cen042hj386u8j1hju659ev97d3svnvm.apps.googleusercontent.com',
    offlineAccess: true,
  });
};
