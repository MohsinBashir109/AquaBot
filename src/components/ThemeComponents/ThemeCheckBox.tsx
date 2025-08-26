import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../../utils/colors';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import ThemeText from './ThemeText';
import { fontFamilies } from '../../utils/fontfamilies';
import { useThemeContext } from '../../theme/ThemeContext';

const ThemedCheckbox = ({
  checked,
  onPress,
  onCheck,
  label,
  style,
  textStyle,
}: {
  checked: boolean;
  onPress: () => void;
  onCheck: () => void;
  label: string;
  style?: any;
  textStyle?: any;
}) => {
  const { isDark } = useThemeContext();
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onCheck}>
        <View
          style={[
            styles.checkbox,
            checked
              ? {
                  borderColor: colors.light.gray3,
                  backgroundColor: colors.light.primary,
                }
              : { borderColor: colors.light.gray3 },
          ]}
        >
          {checked && <Image style={styles.check} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress}>
        <ThemeText
          color="gray2"
          style={[globalStyles.smallDescription, styles.label, textStyle]}
        >
          {label}
        </ThemeText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkbox: {
    width: heightPixel(20),
    height: heightPixel(20),
    borderRadius: widthPixel(5),
    borderWidth: widthPixel(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    marginLeft: widthPixel(10),
  },
  check: {
    width: heightPixel(12),
    height: heightPixel(12),
    resizeMode: 'contain',
  },
});

export default ThemedCheckbox;
