import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import React from 'react';
import { routes } from '../../../utils/routes';

const SignIn = ({ navigation }: any) => {
  return (
    <AuthWrapper text="Login" desText="Enter your credientials.">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.signup);
        }}
      >
        <Text>Signin</Text>
      </TouchableOpacity>
    </AuthWrapper>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
