import { Dimensions, PixelRatio } from 'react-native';
import {
  building,
  feedback,
  flower,
  mind,
  money,
} from '../assets/images/images';

// import { ob1, ob2, ob3, ob4, ob5 } from '../assets/images/images';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const widthBaseScale = SCREEN_WIDTH / 390;
const heightBaseScale = SCREEN_HEIGHT / 844;
export const waterGlassSize = 250;
export const wp = (p: any) => WINDOW_WIDTH * (p / 100);
export const hp = (p: any) => WINDOW_HEIGHT * (p / 100);

function normalize(size: any, based = 'width') {
  // Ensure size is a valid number
  const validSize =
    typeof size === 'number' && !isNaN(size) && isFinite(size) ? size : 0;

  const newSize =
    based === 'height'
      ? validSize * heightBaseScale
      : validSize * widthBaseScale;

  // Ensure the result is a valid number
  const result = Math.round(PixelRatio.roundToNearestPixel(newSize));
  return isNaN(result) || !isFinite(result) ? validSize : result;
}

export const widthPixel = (size: any) => {
  const result = normalize(size, 'width');
  return isNaN(result) || !isFinite(result) ? 0 : result;
};
export const heightPixel = (size: any) => {
  const result = normalize(size, 'height');
  return isNaN(result) || !isFinite(result) ? 0 : result;
};
export const fontPixel = (size: any) => {
  return heightPixel(size);
};

export const gmailOnly = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
export const regexPass =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const username = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;

export const dataOnboarding = [
  {
    title: 'Smart AI-Powered Irrigation System',
    image: flower,
  },
  {
    title: 'Accurate Real-Time Data Insights',
    image: mind,
  },
  {
    title: 'Affordable Sensor-Free Water Management',
    image: money,
  },
  {
    title: 'Boost Crop Yield Efficiently',
    image: building,
  },
  {
    title: 'Supports Multiple Languages Offline',
    image: feedback,
  },
];
