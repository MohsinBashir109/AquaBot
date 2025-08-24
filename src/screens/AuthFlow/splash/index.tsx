import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextBase,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { routes } from '../../../utils/routes';
import { useNavigation } from '@react-navigation/native';

const Splash = ({ navigation }: any) => {
  console.log('splash');

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes?.onboarding);
        }}
      >
        <Text>login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
