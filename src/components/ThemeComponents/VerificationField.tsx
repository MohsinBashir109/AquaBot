import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import { colors } from '../../utils/colors';
import { fontFamilies } from '../../utils/fontfamilies';
import { useThemeContext } from '../../theme/ThemeContext';

const CELL_COUNT = 6; // Number of digits in the code
type VerificationInputField = {
  onPressRightIcon?: () => void;
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
  rightUnderTitle?: string;
  leftUnderTitle?: string;
};

export const VerificationField = (prop: VerificationInputField) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { isDark } = useThemeContext();
  return (
    <View style={styles.root}>
      {prop.title && (
        <Text
          style={[
            styles.title,
            { color: colors[isDark ? 'dark' : 'light'].secondaryText },
          ]}
        >
          {prop.title}
        </Text>
      )}
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <View style={styles.rowView}>
        {prop.leftUnderTitle && (
          <TouchableOpacity>
            <Text
              style={[
                styles.underTitleLeft,
                { color: colors[isDark ? 'dark' : 'light'].secondaryText },
              ]}
            >
              {prop.leftUnderTitle}
            </Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}></View>
        {prop.rightUnderTitle && (
          <TouchableOpacity>
            <Text
              style={[
                styles.underTitleRight,
                { color: colors[isDark ? 'dark' : 'light'].primary },
              ]}
            >
              {prop.rightUnderTitle}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { justifyContent: 'center', width: '100%' },

  codeFieldRoot: {},
  rowView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightPixel(10),
  },
  underTitleLeft: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(14),
    marginLeft: widthPixel(10),
  },
  underTitleRight: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(14),
    marginRight: widthPixel(10),
  },
  cell: {
    width: widthPixel(45),
    height: heightPixel(50),
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    marginHorizontal: widthPixel(5),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
  Touch: {
    marginHorizontal: widthPixel(10),
  },

  containerOuter: {},

  title: {
    fontFamily: fontFamilies.seniregular,
    fontSize: fontPixel(14),
    marginLeft: widthPixel(10),
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
