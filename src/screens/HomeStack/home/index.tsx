import { StyleSheet, Text, View } from 'react-native';

import Button from '../../../components/ThemeComponents/ThemeButton';
import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React from 'react';
import { logout } from '../../../service/signUp';
import { routes } from '../../../utils/routes';
import { showCustomFlash } from '../../../utils/flash';

const Index = ({ navigation }: any) => {
  const handleLogout = async () => {
    await logout();
    showCustomFlash('logged Out', 'success');
    navigation.replace(routes.auth, {
      Screen: routes.signin,
    });
  };
  return (
    <HomeWrapper>
      <Text>index</Text>
      <Button onPress={handleLogout} title="logout" />
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
