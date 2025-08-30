import { fontPixel, heightPixel } from './constants';

import { fontFamilies } from './fontfamilies';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const colors = {
  light: {
    dark: '#0A2342',
    primary: '#30A7FB',
    secondary: '#6B7280AB',
    text: '#151522',
    background: '#FFFFFF',
    white: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gray1: '#9CA3AF',
    gray2: '#4B5563',
    gray3: '#D1D5DB',
    gray4: '#D9D9D9',
    gray5: '#EFEFEF',
    gray6: '#f3f4f6',
    secondaryText: '#6B7280A3',
    red: '#FF4444',
    error: '#FF0000',
    buttonBackGround: '#30A7FB',
    buttonBackGroundOther: '#D9D9D9',
    desText: '#666666',
    fogotText: '#067CCF',
    orColor: '#6B7280BD',
    transparent: 'transparent',
  },
  dark: {
    dark: '#0A2342',
    primary: '#22C55E',
    text: '#ECEDEE',
    background: '#151718',
    white: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gray1: '#F3F4F6',
    gray2: '#fff',
    gray2_1: '#1F2122',
    gray3: '#292B2C',
    gray4: '#333536',
    gray5: '#3D3F40',
    gray6: '#47494A',
    secondaryText: '#6B7280A3',
    red: '#FF4444',
    error: '#FF0000',
    buttonBackGround: '#148663',
    buttonBackGroundOther: '#D9D9D9',
    desText: '#666666',
    fogotText: '#067CCF',
    orColor: '#6B7280BD',
    transparent: 'transparent',
  },
};
export const globalStyles = {
  mediumHeading: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.semibold,
  },
  smallDescription: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    color: colors.light.secondaryText,
  },
  shadow: {
    boxShadow: '0px 1px 2px 2px rgba(210, 206, 206, 0.1)',
  },
  errorText: {
    fontSize: fontPixel(12),
    marginBottom: heightPixel(10),
  },
};
