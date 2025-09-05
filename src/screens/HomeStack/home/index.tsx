import { StyleSheet, Text, View } from 'react-native';

import Button from '../../../components/ThemeComponents/ThemeButton';
import React from 'react';
import { logout } from '../../../service/signUp';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';

const index = ({ navigation }: any) => {
  const handleLogout = async () => {
    await logout();
    showCustomFlash('logged Out', 'success');
    navigation.replace(routes.auth, {
      Screen: routes.signin,
    });
  };
  return (
    <View style={styles.container}>
      <Text>index</Text>
      <Button onPress={handleLogout} title="logout" />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
