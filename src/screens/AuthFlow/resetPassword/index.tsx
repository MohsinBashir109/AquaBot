import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { email, padlock } from '../../../assets/icons/icons';
import { fontPixel, heightPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';

const index = ({ navigation }: any) => {
  const [details, setDetails] = useState({
    password: '',
    confirmPassword: '',
  });
  const handleSignUp = () => {
    navigation.navigate(routes.resetpassword);
    console.log('pressed');
  };
  const handleSignin = () => {
    navigation.navigate(routes.signin);
  };
  return (
    <AuthWrapper
      text="Forget Password"
      desText="Please enter your email address for verification."
    >
      <ThemeInput
        leftIcon={padlock}
        title="New Password "
        value={details.password}
        onChangeText={(text: string) =>
          setDetails({ ...details, password: text })
        }
        placeHolderColor="green"
        placeholder="Enter your email"
        containerStyleOuter={styles.containerStyleOuter}
      />
      <ThemeInput
        leftIcon={padlock}
        title="Confirm Password"
        value={details.confirmPassword}
        onChangeText={(text: string) =>
          setDetails({ ...details, confirmPassword: text })
        }
        placeHolderColor="green"
        placeholder="Enter your email"
        containerStyleOuter={styles.containerStyleOuter}
      />
      <Button
        onPress={handleSignUp}
        title="Continue "
        buttonStyle={styles.buttonStyle1}
        titleStyle={styles.buttonStyle}
      />
      <Button
        buttonStyle={styles.buttonStyle2}
        onPress={handleSignin}
        title="Back to login"
        disabled
        textColor="text"
        titleStyle={styles.buttonStyle}
      />
    </AuthWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  containerStyleOuter: {},
  buttonStyle1: {
    marginTop: heightPixel(36),
  },
  buttonStyle2: {
    marginVertical: heightPixel(15),
  },
  buttonStyle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
  },
});
