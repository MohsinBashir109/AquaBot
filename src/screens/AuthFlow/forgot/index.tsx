import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontPixel, heightPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import { email } from '../../../assets/icons/icons';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';

const Index = ({ navigation }: any) => {
  const [varEmail, setEmail] = useState('');
  const handleSignUp = () => {
    navigation.navigate(routes.emailverification);
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
        leftIcon={email}
        title="Email Address"
        value={varEmail}
        onChangeText={text => setEmail(text)}
        placeHolderColor="green"
        placeholder="Enter your email"
        containerStyleOuter={styles.containerStyleOuter}
        underLefttitle="Please enter a valid email address."
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

export default Index;

const styles = StyleSheet.create({
  containerStyleOuter: {},
  buttonStyle1: {
    marginTop: heightPixel(10),
  },
  buttonStyle2: {
    marginVertical: heightPixel(15),
  },
  buttonStyle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
  },
});
