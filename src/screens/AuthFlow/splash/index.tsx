import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Logo, authBackGround } from '../../../assets/images/images';
import { heightPixel, widthPixel } from '../../../utils/constants';

import React from 'react';
import { colors } from '../../../utils/colors';
import { routes } from '../../../utils/routes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../theme/ThemeContext';

const Splash = ({ navigation }: any) => {
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={authBackGround}
      style={[
        styles.background,
        {
          paddingTop: insets.top,
          backgroundColor: colors[isDark ? 'dark' : 'light'].background,
        },
      ]}
    >
      <View style={styles.container}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <Image source={Logo} resizeMode="contain" style={styles.splashImage} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.onboarding);
          }}
        >
          <Text>splash</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  splashImage: {
    width: widthPixel(300),
    height: heightPixel(350),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    paddingHorizontal: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
