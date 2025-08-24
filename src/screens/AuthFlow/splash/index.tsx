import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React from 'react';
import { routes } from '../../../utils/routes';

const Splash = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.onboarding);
        }}
      >
        <Text>splash</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#148663E0', // or your brand color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
