import { Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { checkUserExists, resetPassword } from '../../../service/signUp';
import { email, eyes, padlock } from '../../../assets/icons/icons';
import { fontPixel, heightPixel } from '../../../utils/constants';
import { useNavigation, useRoute } from '@react-navigation/native';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import Button from '../../../components/ThemeComponents/ThemeButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import { fontFamilies } from '../../../utils/fontfamilies';
import { routes } from '../../../utils/routes';

const SignIn = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { email } = route.params; // ✅ get email from Forget screen

  const [isHidden, setIsHidden] = useState(true);
  const [isHidden2, setIsHidden2] = useState(true);
  const [details, setDetails] = useState({
    confirmPassword: '',
    password: '',
  });

  const handleReset = async () => {
    if (!details.password || !details.confirmPassword) {
      Alert.alert('Please fill in both fields');
      return;
    }

    if (details.password !== details.confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    const success = await resetPassword(email, details.password);
    if (success) {
      navigation.replace(routes.forgot);
    }
  };

  const handleHide = () => {
    setIsHidden(!isHidden);
  };
  const handleHide2 = () => {
    setIsHidden2(!isHidden2);
  };
  const handleBack = () => {
    navigation.navigate(routes.signin);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AuthWrapper text="Reset Password" desText="Enter your new Password.">
        <ThemeInput
          leftIcon={padlock}
          title="New Password"
          value={details.password}
          onChangeText={(text: string) =>
            setDetails({ ...details, password: text })
          }
          placeHolderColor="green"
          placeholder="New Password"
          containerStyleOuter={styles.containerStyleOuter}
          rightIcon={eyes}
          secureTextEntry={isHidden2}
          onPressRightIcon={handleHide2}
        />
        <ThemeInput
          title="Confirm Password"
          leftIcon={padlock}
          rightIcon={eyes}
          value={details.confirmPassword}
          onChangeText={(text: string) =>
            setDetails({ ...details, confirmPassword: text })
          }
          containerStyleOuter={styles.containerStyleOuter2}
          placeHolderColor="green"
          placeholder="Confirm Password"
          secureTextEntry={isHidden}
          onPressRightIcon={handleHide}
        />

        <Button
          onPress={handleReset}
          title="Confirm"
          buttonStyle={styles.buttonStyle1}
          titleStyle={styles.buttonStyle}
        />
        <Button
          buttonStyle={styles.buttonStyle2}
          onPress={handleBack}
          title="Back to login"
          textColor="text"
          titleStyle={styles.buttonStyle}
          bgColor="white"
        />
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  containerStyleOuter: {},
  containerStyleOuter2: {
    marginVertical: heightPixel(10),
  },

  buttonStyle1: {
    marginTop: heightPixel(42),
  },
  buttonStyle2: {
    marginVertical: heightPixel(15),
  },
  buttonStyle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
  },
});
