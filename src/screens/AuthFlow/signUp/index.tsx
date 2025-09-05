import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import {
  email,
  eyes,
  google,
  padlock,
  userName,
} from '../../../assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { handleSignUpGoogle, register } from '../../../service/auth';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';

const Index = ({ navigation }: any) => {
  const handleLogin = () => {
    navigation.navigate(routes.signin);
  };
  const [details, setDetails] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handleGoogleSignUp = async () => {
    const userExits = await handleSignUpGoogle();
    // console.log('Google user:', userExits);
    if (!userExits) {
      navigation.replace(routes.home);
    }
    {
      return;
    }
  };

  const handleSignUp = async () => {
    if (
      !details.email ||
      !details.password ||
      !details.confirmPassword ||
      !details.userName
    ) {
      showCustomFlash(
        'All fields are required. Please complete them.',
        'danger',
      );

      return;
    }
    if (details.confirmPassword !== details.password) {
      showCustomFlash('Passwords do not match. Please try again.', 'danger');

      return;
    }
    try {
      await register(details);

      setDetails({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      showCustomFlash(error.message, 'danger');
    }
  };

  const [isHidden, setIsHidden] = useState({
    password: true,
    confirmPassword: true,
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AuthWrapper
        text="SignUp"
        desText="Please enter your credentials here to register."
      >
        <ThemeInput
          title="Username"
          value={details.userName}
          onChangeText={(text: string) =>
            setDetails({ ...details, userName: text })
          }
          placeholder="Enter your Username"
          leftIcon={userName}
        />
        <ThemeInput
          title="Email"
          value={details.email}
          onChangeText={(text: string) =>
            setDetails({ ...details, email: text })
          }
          placeholder="Enter your Email"
          leftIcon={email}
          containerStyleOuter={styles.containerStyle}
        />
        <ThemeInput
          title="Password"
          value={details.password}
          onChangeText={(text: string) =>
            setDetails({ ...details, password: text })
          }
          placeholder="Enter your PassWord"
          leftIcon={padlock}
          rightIcon={eyes}
          secureTextEntry={isHidden.password}
          onPressRightIcon={() =>
            setIsHidden({ ...isHidden, password: !isHidden.password })
          }
        />
        <ThemeInput
          title="Confirm Password"
          value={details.confirmPassword}
          onChangeText={(text: string) =>
            setDetails({ ...details, confirmPassword: text })
          }
          placeholder="Confirm Password"
          leftIcon={padlock}
          containerStyleOuter={styles.containerStyle}
          rightIcon={eyes}
          secureTextEntry={isHidden.confirmPassword}
          onPressRightIcon={() =>
            setIsHidden({
              ...isHidden,
              confirmPassword: !isHidden.confirmPassword,
            })
          }
        />
        <Button
          title="Signup"
          bgColor="primary"
          buttonStyle={styles.buttonStyle}
          onPress={handleSignUp}
        />

        <ThemeText style={styles.or} color="orColor">
          OR
        </ThemeText>
        <TouchableOpacity style={styles.touchable} onPress={handleGoogleSignUp}>
          <ThemeText style={styles.googleSignin} color="text">
            Sign in with
          </ThemeText>
          <Image
            source={google}
            style={styles.imageGoogle}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View
          style={{
            marginVertical: heightPixel(10),
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <ThemeText style={styles.accountText} color="text">
            Have an account?
          </ThemeText>
          <TouchableOpacity onPress={handleLogin}>
            <ThemeText color="fogotText" style={styles.signUp}>
              Login
            </ThemeText>
          </TouchableOpacity>
        </View>
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: heightPixel(10),
  },
  buttonStyle: {
    marginTop: heightPixel(15),
  },

  accountText: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(13),
  },
  signUp: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(13),
  },
  imageGoogle: {
    width: widthPixel(45),
    height: heightPixel(45),
    marginLeft: widthPixel(5),
  },
  touchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleSignin: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(14),
  },
  or: {
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(14),
    marginVertical: heightPixel(20),
  },
  checkBoxView: { flexDirection: 'row', paddingHorizontal: widthPixel(5) },

  Row: {
    flexDirection: 'row',
  },
  textStyle: {
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(14),
  },
  containerStyleOuter: {},
  containerStyleOuter2: {
    marginVertical: heightPixel(10),
  },
  forgotText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(14),
  },
});
