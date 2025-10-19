import { Platform, StatusBar } from 'react-native';

import CustomFlash from '../components/ThemeComponents/CustomFlash';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

type FlashType = 'success' | 'danger' | 'warning';

export const showCustomFlash = (
  message: string,
  type: FlashType = 'success',
) => {
  showMessage({
    message,
    floating: true,
    duration: 2000,
    titleStyle: { display: 'none' },
    renderCustomContent: () => <CustomFlash message={message} type={type} />,
    style: {
      marginTop:
        Platform.OS === 'android' ? (StatusBar.currentHeight = 28) : 44,
      marginHorizontal: 12,
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
    },
  });
};
