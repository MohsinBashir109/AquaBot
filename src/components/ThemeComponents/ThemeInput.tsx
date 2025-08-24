import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import { Text } from 'react-native-gesture-handler';
import { fontFamilies } from '../../utils/fontfamilies';

type InputFieldProps = {
  inputStyle?: any;
  noTitle?: boolean;
  title?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  onChangeText?: any;
  value?: any;
  leftIcon?: any;
  rightIcon?: any;
  rightText?: string;
  rightIconPress?: any;
  containerStyle?: any;
  placeholderTextColor?: any;
  multiline?: boolean;
  maxLength?: number;
  inputContainerStyle?: any;
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  onBlur?: () => void;
  onFocus?: () => void;
};
export const ThemeInput = (props: InputFieldProps) => {
  return (
    <View>
      {!props.noTitle && <Text style={[styles.title]}>{props.title}</Text>}
      <View style={[styles.inputContainer, props.inputContainerStyle]}>
        {props.leftIcon && (
          <Image source={props.leftIcon} style={styles.leftIcon} />
        )}
        <TextInput
          editable={props?.editable}
          style={[styles.input, props.inputStyle]}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor || '#5E5E5E'}
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          value={props.value}
          multiline={props.multiline}
          maxLength={props.maxLength}
          autoCapitalize={props.autoCapitalize}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        />
        <Pressable onPress={props.rightIconPress}>
          <Image source={props.rightIcon} style={styles.rightIcon} />
        </Pressable>
      </View>
      {props.error && (
        <Text
          style={[
            styles.errorText,
            {
              marginTop: heightPixel(-5),
              marginLeft: widthPixel(10),
              marginBottom: heightPixel(10),
            },
          ]}
        >
          {props.error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.seniregular,
    marginVertical: heightPixel(6),
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: heightPixel(10),
    borderWidth: 1,
    marginBottom: heightPixel(1),
    paddingHorizontal: widthPixel(10),
  },
  input: {
    height: heightPixel(50),
    flex: 1,
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.regular,

    // textAlignVertical: "center",
  },
  leftIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    resizeMode: 'contain',
    marginHorizontal: widthPixel(3),
    marginRight: widthPixel(5),
  },
  rightIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
    resizeMode: 'contain',
  },
  rightText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.seniregular,
    textAlignVertical: 'center',
  },
  errorText: {},
});
