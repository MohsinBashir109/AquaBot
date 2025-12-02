import { Platform, StatusBar } from 'react-native';

import CustomFlash from '../components/ThemeComponents/CustomFlash';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

type FlashType = 'success' | 'danger' | 'warning';

const normalizeMessage = (value: any): string => {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map(item => normalizeMessage(item))
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    // Common backend shapes
    const possibleKeys = [
      'message',
      'Message',
      'messageEnglish',
      'MessageEnglish',
      'error',
      'Error',
    ];

    for (const key of possibleKeys) {
      if (value[key]) {
        return normalizeMessage(value[key]);
      }
    }

    try {
      return JSON.stringify(value);
    } catch (err) {
      console.warn('⚠️ [Flash] Unable to stringify message object:', err);
      return '';
    }
  }

  return String(value);
};

export const showCustomFlash = (
  message: any,
  type: FlashType = 'success',
) => {
  const normalizedMessage = normalizeMessage(message);
  const finalMessage = normalizedMessage || 'Something went wrong';

  if (__DEV__ && typeof message !== 'string') {
    console.log('🔔 [Flash] Non-string message payload detected:', message);
  }

  // Update the custom component regardless of platform
  showMessage({
    message: finalMessage,
    floating: true,
    duration: 2000,
    titleStyle: { display: 'none' },
    renderCustomContent: () => (
      <CustomFlash message={finalMessage} type={type} />
    ),
    style: {
      marginTop:
        Platform.OS === 'android'
          ? (StatusBar.currentHeight ?? 0) + 28
          : 44,
      marginHorizontal: 12,
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
    },
  });
};
