import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from '../../utils/colors';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import { fontFamilies } from '../../utils/fontfamilies';
import { useThemeContext } from '../../theme/ThemeContext';

interface ButtonProps {
  title: string;
  buttonStyle?: any;
  bgColor?: keyof typeof colors.light | keyof typeof colors.dark | string;
  textColor?: keyof typeof colors.light | keyof typeof colors.dark | string;
  titleStyle?: any;
  onPress: () => void;
  disabled?: boolean;
  rightIcon?: any;
  leftIcon?: any;
}

const Button = (props: ButtonProps) => {
  const {
    title,
    buttonStyle,
    titleStyle,
    onPress,
    disabled,
    rightIcon,
    leftIcon,
    bgColor,
    textColor,
  } = props;
  const { isDark } = useThemeContext();
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        buttonStyle,
        {
          backgroundColor: isDark
            ? colors.dark[
                bgColor ? (bgColor as keyof typeof colors.dark) : 'primary'
              ]
            : colors.light[
                bgColor ? (bgColor as keyof typeof colors.light) : 'primary'
              ],
        },
        disabled && {
          backgroundColor: isDark ? colors.dark.gray1 : colors.light.gray1,
          opacity: 0.5,
        },
      ]}
    >
      {leftIcon && (
        <Image
          source={leftIcon}
          style={[styles.icon, { marginRight: widthPixel(8) }]}
        />
      )}
      <Text
        numberOfLines={1}
        style={[
          styles?.buttonTitle,
          titleStyle,
          {
            color: isDark
              ? colors.dark[
                  textColor ? (textColor as keyof typeof colors.dark) : 'white'
                ]
              : colors.light[
                  textColor ? (textColor as keyof typeof colors.light) : 'white'
                ],
          },
        ]}
      >
        {title}
      </Text>
      {rightIcon && (
        <Image
          source={rightIcon}
          style={[styles.icon, { marginLeft: widthPixel(8) }]}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(50),
    width: '100%',
    borderRadius: widthPixel(10),
    alignSelf: 'center',
    backgroundColor: colors.light.primary,
    ...globalStyles.shadow,
    elevation: 5,
    // higher = more shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: fontPixel(16),

    fontFamily: fontFamilies.semibold,
  },
  icon: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
  },
});

export default Button;
