import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AuthWrapper from '../../../../Wrappers/AuthWrapper';
import React from 'react';
import { routes } from '../../../utils/routes';

const index = ({ navigation }: any) => {
  return (
    <AuthWrapper>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.signup);
        }}
      >
        <Text>signup</Text>
      </TouchableOpacity>
    </AuthWrapper>
  );
};

export default index;

const styles = StyleSheet.create({});
