import { Platform, StatusBar } from 'react-native';

import CustomFlash from '../components/ThemeComponents/CustomFlash';
import React from 'react';
import { showMessage } from 'react-native-flash-message';
import { widthPixel } from './constants';

type FlashType = 'success' | 'danger';

export const showCustomFlash = (
  message: string,
  type: FlashType = 'success',
) => {
  showMessage({
    message,
    floating: true,
    duration: 1800,
    titleStyle: { display: 'none' },
    renderCustomContent: () => <CustomFlash message={message} type={type} />,
    style: {
      marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 28 : 44,
      backgroundColor: '#FFFFFF',
      borderRadius: widthPixel(15),
      marginHorizontal: 12,
      justifyContent: 'center',
    },
  });
};
