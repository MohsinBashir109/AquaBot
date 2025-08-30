import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import { colors } from '../../utils/colors';
import { fontFamilies } from '../../utils/fontfamilies';
import { useThemeContext } from '../../theme/ThemeContext';

type TextInputField = {
  onPressLeftIcon?: () => void;
  placeholder?: string;
  value?: any;
  placeHolderColor?: string;
  styleContainer?: ViewStyle;
  onFocus?: any;
  onBlur?: any;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  title?: string;
  secureTextEntry?: boolean;
  leftIcon?: any;
  rightIcon?: any;
  containerStyleOuter?: any;
};

const ThemeInput = (props: TextInputField) => {
  const { isDark } = useThemeContext();
  return (
    <View style={[style.containerOuter, props.containerStyleOuter]}>
      {props.title && (
        <Text
          style={[
            style.title,
            { color: colors[isDark ? 'dark' : 'light'].secondaryText },
          ]}
        >
          {props.title}
        </Text>
      )}

      <View
        style={[
          style.mainConatiner,
          {
            backgroundColor: colors[isDark ? 'dark' : 'light'].background,
          },
        ]}
      >
        <Image
          resizeMode="contain"
          style={style.leftIcon}
          source={props.leftIcon}
        />
        <TextInput
          placeholder={props.placeholder}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          value={props.value}
          onChangeText={props.onChangeText}
          editable={props.editable}
          placeholderTextColor={colors[isDark ? 'dark' : 'light'].gray1}
          style={[
            style.container,
            props.styleContainer,
            { color: colors[isDark ? 'dark' : 'light'].desText },
          ]}
          secureTextEntry={props.secureTextEntry}
        />
        <TouchableOpacity onPress={props.onPressLeftIcon} style={style.Touch}>
          <Image
            resizeMode="contain"
            style={style.rightIcon}
            source={props.rightIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThemeInput;
const style = StyleSheet.create({
  Touch: {
    marginHorizontal: widthPixel(10),
  },

  containerOuter: {},
  leftIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginHorizontal: widthPixel(10),
  },
  title: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(14),
    marginLeft: widthPixel(5),
    marginBottom: heightPixel(5),
  },
  mainConatiner: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    height: heightPixel(53),
  },
  rightIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
});
