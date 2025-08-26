import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { heightPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import { colors } from '../../utils/colors';
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
};

const ThemeInput = (props: TextInputField) => {
  const { isDark } = useThemeContext();
  return (
    <View>
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
            borderColor: colors[isDark ? 'dark' : 'light'].gray3,
          },
        ]}
      >
        <Image style={style.leftIcon} source={props.leftIcon} />
        <TextInput
          placeholder={props.placeholder}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          value={props.value}
          onChangeText={props.onChangeText}
          editable={props.editable}
          placeholderTextColor={colors[isDark ? 'dark' : 'light'].gray1}
          style={[style.container, props.styleContainer]}
          secureTextEntry={props.secureTextEntry}
        />
        <TouchableOpacity onPress={props.onPressLeftIcon}>
          <Image style={style.rightIcon} source={props.rightIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThemeInput;
const style = StyleSheet.create({
  leftIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    resizeMode: 'contain',
    marginHorizontal: widthPixel(3),
    marginRight: widthPixel(5),
  },
  title: {},
  mainConatiner: {
    flexDirection: 'row',
    width: '100%',

    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    height: heightPixel(50),
    color: 'green',
  },
  rightIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    resizeMode: 'contain',
  },
});
