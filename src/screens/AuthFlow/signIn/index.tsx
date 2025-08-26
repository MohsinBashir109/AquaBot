import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { email, hide, padlock } from './../../../assets/icons/icons';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ThemeInput from '../../../components/ThemeComponents/ThemeInput';
import { routes } from '../../../utils/routes';

const SignIn = ({ navigation }: any) => {
  const [details, setDetails] = useState({
    email: '',
    password: '',
  });
  const [isHidden, setIsHidden] = useState(true);
  const handleHide = () => {
    setIsHidden(!isHidden);
  };
  console.log('email', details);
  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <AuthWrapper text="Login" desText="Enter your credientials.">
        <ThemeInput
          leftIcon={email}
          title="Email"
          value={details.email}
          onChangeText={(text: string) =>
            setDetails({ ...details, email: text })
          }
          placeHolderColor="green"
          placeholder="Enter your email"
          styleContainer={styles.styleContainer}
        />
        <ThemeInput
          title="Password"
          leftIcon={padlock}
          rightIcon={padlock}
          value={details.password}
          onChangeText={(text: string) =>
            setDetails({ ...details, password: text })
          }
          placeHolderColor="green"
          placeholder="Enter your password"
          styleContainer={styles.styleContainer}
          secureTextEntry={isHidden}
          onPressLeftIcon={handleHide}
        />

        {/* <ThemeInput
          placeholder="Email"
          leftIcon={email}
          value={details.email}
          onChangeText={(text: string) =>
            setDetails({
              ...details,
              email: text,
            })
          }
        /> */}
        {/* <ThemeInput
          placeholder="Password"
          leftIcon={padlock}
          rightIcon={hide}
          onChangeText={(text: string) =>
            setDetails({
              ...details,
              password: text,
            })
          }
          rightIconPress={handleHide}
          secureTextEntry={isHidden}
        /> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.signup);
          }}
        >
          <Text>Signin</Text>
        </TouchableOpacity>
      </AuthWrapper>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  styleContainer: {
    backgroundColor: '#f3f4f6',
  },
});
