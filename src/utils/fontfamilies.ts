import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';
export const fontFamilies = {
  regular: isAndroid ? 'Inter_28pt-Light' : 'Inter_28pt-Light',
  seniregular: isAndroid ? 'Inter_28pt-Regular' : 'Inter_28pt-Regular',
  medium: isAndroid ? 'Inter_28pt-Medium' : 'Inter_28pt-Medium',
  semibold: isAndroid ? 'Inter_28pt-SemiBold' : 'Inter_28pt-SemiBold',
  bold: isAndroid ? 'Inter_28pt-Bold' : 'Inter_28pt-Bold',
  extrabold: isAndroid
    ? 'Inter_28pt-ExtraBold.ttf'
    : 'Inter_28pt-ExtraBold.ttf',
};
