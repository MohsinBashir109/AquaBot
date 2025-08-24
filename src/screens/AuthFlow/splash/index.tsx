import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import { routes } from '../../../utils/routes';

const Splash = ({ navigation }: any) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.onboarding);
        }}
      >
        <Text>login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
