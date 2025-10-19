import { StyleSheet, Text, View } from 'react-native';
import { fontPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import { fontFamilies } from '../../utils/fontfamilies';

type FlashProps = {
  message: string;
  type?: 'success' | 'danger' | 'warning';
};

const CustomFlash = ({ message, type = 'success' }: FlashProps) => {
  const getStyle = () => {
    switch (type) {
      case 'success':
        return { container: styles.success, text: styles.successText };
      case 'danger':
        return { container: styles.danger, text: styles.dangerText };
      case 'warning':
        return { container: styles.warning, text: styles.warningText };
      default:
        return { container: styles.success, text: styles.successText };
    }
  };

  const style = getStyle();

  return (
    <View style={[styles.container, style.container]}>
      <Text style={[styles.text, style.text]}>{message}</Text>
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
  warning: {
    backgroundColor: '#fff4e6',
    borderColor: '#FFA500',
    borderWidth: 1,
  },
  warningText: {
    color: '#cc8400',
  },
});
