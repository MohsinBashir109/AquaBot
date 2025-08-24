import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import React from 'react';
import { routes } from '../../../utils/routes';

const OnBoarding = ({ navigation }: any) => {
  return (
    <AuthWrapper text="Welcome to AquaBot " desText="">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.signin);
        }}
      >
        <Text>onboarding</Text>
      </TouchableOpacity>
    </AuthWrapper>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({});
