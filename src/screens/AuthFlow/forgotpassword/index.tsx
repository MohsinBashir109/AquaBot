import { Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { fontPixel, gmailOnly, heightPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import { checkUserExists } from '../../../service/signUp';
import { email } from '../../../assets/icons/icons';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';

const Index = ({ navigation }: any) => {
  const [varEmail, setEmail] = useState('');
  const handleSignUp = () => {
    if (!varEmail) {
      showCustomFlash('Please fill the input field', 'danger');
      return;
    }
    if (!gmailOnly.test(varEmail)) {
      showCustomFlash('Please enter a valid  Email', 'danger');
      return;
    }
    handleCheckEmail();
  };
  const handleSignin = () => {
    navigation.navigate(routes.signin);
  };
  const handleCheckEmail = async () => {
    const userRef = await checkUserExists(varEmail);

    if (!userRef) {
      Alert.alert('No account with this email');
      return;
    }

    navigation.navigate(routes.emailverification, { email: varEmail });
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
        textColor="text"
        titleStyle={styles.buttonStyle}
        bgColor="white"
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
