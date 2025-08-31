import { StyleSheet, Text, View } from 'react-native';
import { fontPixel, heightPixel } from '../../../utils/constants';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import React from 'react';
import { VerificationField } from '../../../components/ThemeComponents/VerificationField';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';

const index = ({ navigation }: any) => {
  const handleSignUp = () => {
    navigation.navigate(routes.emailverification);
  };
  const handleSignin = () => {
    navigation.navigate(routes.signin);
  };

  return (
    <AuthWrapper text="Verification" desText="Enter your verification code.">
      <VerificationField
        title="Verfication Code"
        leftUnderTitle="Didn’t get the code?"
        rightUnderTitle="Resend code"
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
