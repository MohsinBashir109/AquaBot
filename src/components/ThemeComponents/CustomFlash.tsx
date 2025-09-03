import { StyleSheet, Text, View } from 'react-native';
import { fontPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import { fontFamilies } from '../../utils/fontfamilies';

type FlashProps = {
  message: string;
  type?: 'success' | 'danger';
};

const CustomFlash = ({ message, type = 'success' }: FlashProps) => {
  const isSuccess = type === 'success';

  return (
    <View
      style={[styles.container, isSuccess ? styles.success : styles.danger]}
    >
      <Text
        style={[
          styles.text,
          isSuccess ? styles.successText : styles.dangerText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

export default CustomFlash;

const styles = StyleSheet.create({
  container: {
    minHeight: widthPixel(36),
    paddingHorizontal: widthPixel(12),
    paddingVertical: widthPixel(6),
    borderRadius: widthPixel(8),

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(13),
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#e6f9f0',
    borderColor: '#2ecc71',
    borderWidth: 1,
  },
  successText: {
    color: '#1e8e5c',
  },
  danger: {
    backgroundColor: '#fdecea',
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  dangerText: {
    color: '#b71c1c',
  },
});
