import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { email, padlock } from '../../assets/icons/icons';
import { heightPixel, widthPixel } from '../../utils/constants';

import React from 'react';

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
  return (
    <View>
      {props.title && <Text>{props.title}</Text>}

      <View style={style.mainConatiner}>
        <Image style={style.image} source={props.leftIcon} />
        <TextInput
          placeholder={props.placeholder}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          value={props.value}
          onChangeText={props.onChangeText}
          editable={props.editable}
          placeholderTextColor={props.placeHolderColor}
          style={[style.container, props.styleContainer]}
          secureTextEntry={props.secureTextEntry}
        />
        <TouchableOpacity onPress={props.onPressLeftIcon}>
          <Image style={style.image} source={props.rightIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThemeInput;
const style = StyleSheet.create({
  mainConatiner: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f3f4f6',
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
  image: {
    marginHorizontal: widthPixel(10),
    width: widthPixel(20),
    height: heightPixel(20),
    zIndex: 333,
  },
});
