import { Dimensions, PixelRatio } from 'react-native';

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
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const widthPixel = (size: any) => {
  return normalize(size, 'width');
};
export const heightPixel = (size: any) => {
  return normalize(size, 'height');
};
export const fontPixel = (size: any) => {
  return heightPixel(size);
};
export const emailFormat =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordFormat =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{7,24}$/; // just one upper case alphabet/one lower case alpjhabet/number/special chars

export const alphabetRegex = /^[a-zA-Z\s]*$/; // Allows only alphabets
