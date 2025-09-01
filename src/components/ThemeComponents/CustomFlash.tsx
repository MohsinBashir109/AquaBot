import { StyleSheet, Text, View } from 'react-native';
import { fontPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import { fontFamilies } from '../../utils/fontfamilies';

type FlashProps = {
  message: string;
  type?: 'success' | 'danger';
};

const CustomFlash = ({ message, type = 'success' }: FlashProps) => {
  return (
    <View style={styles.box}>
      <Text
        style={[styles.text, { color: type === 'success' ? 'green' : 'red' }]}
      >
        {message}
      </Text>
    </View>
  );
};
export default CustomFlash;

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(15),

    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontPixel(16),
    textAlign: 'center',
  },
});
