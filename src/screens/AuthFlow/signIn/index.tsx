import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { email, eyes, google, padlock } from './../../../assets/icons/icons';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import ThemedCheckbox from '../../../components/ThemeComponents/ThemeCheckBox';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignIn = ({ navigation }: any) => {
  const [details, setDetails] = useState({
    email: '',
    password: '',
  });
  const [isHidden, setIsHidden] = useState(true);
  const handleHide = () => {
    setIsHidden(!isHidden);
  };
  const onCheckHandle = () => {
    setChecked(!checked);
  };
  const handleCheckBoxPress = () => {
    setChecked(!checked);
  };
  const handleGoogleSignIn = () => {};
  const handleForgotPass = () => {
    navigation.navigate(routes.forgot);
  };
  const [checked, setChecked] = useState(false);
  // console.log('email', details);
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AuthWrapper
        text="Login"
        desText="Enter your email and password for Login."
      >
        <ThemeInput
          leftIcon={email}
          title="Email"
          value={details.email}
          onChangeText={(text: string) =>
            setDetails({ ...details, email: text })
          }
          placeHolderColor="green"
          placeholder="Enter your email"
          containerStyleOuter={styles.containerStyleOuter}
        />
        <ThemeInput
          title="Password"
          leftIcon={padlock}
          rightIcon={eyes}
          value={details.password}
          onChangeText={(text: string) =>
            setDetails({ ...details, password: text })
          }
          containerStyleOuter={styles.containerStyleOuter2}
          placeHolderColor="green"
          placeholder="Enter your password"
          secureTextEntry={isHidden}
          onPressRightIcon={handleHide}
        />
        <View style={styles.checkBoxView}>
          <ThemedCheckbox
            checked={checked}
            onPress={handleCheckBoxPress}
            label="Remember Me"
            onCheck={onCheckHandle}
          />
          <View style={{ flex: 1 }}></View>
          <TouchableOpacity onPress={handleForgotPass}>
            <ThemeText style={styles.forgotText} color="fogotText">
              Forgot Password?
            </ThemeText>
          </TouchableOpacity>
        </View>
        <Button
          title="Login"
          bgColor="buttonBackGround"
          buttonStyle={styles.buttonStyle}
          onPress={() => {
            navigation.navigate(routes.signup);
          }}
        />
        <ThemeText style={styles.or} color="orColor">
          OR
        </ThemeText>
        <TouchableOpacity style={styles.touchable} onPress={handleGoogleSignIn}>
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
            Don’t have an account?
          </ThemeText>
          <TouchableOpacity>
            <ThemeText color="fogotText" style={styles.signUp}>
              Signup
            </ThemeText>
          </TouchableOpacity>
        </View>
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
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
  buttonStyle: {
    marginTop: heightPixel(30),
  },

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
