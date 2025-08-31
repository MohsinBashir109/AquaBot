import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';

import React from 'react';
import ThemeText from './ThemeText';
import { fontFamilies } from '../../utils/fontfamilies';

type OnboardingItem = {
  image: ImageSourcePropType;
  title: string;
};

type OnboardingProps = {
  data: OnboardingItem[];
};

const OnboardingCard = ({ data }: OnboardingProps) => (
  <ScrollView
    contentContainerStyle={styles.contentContainerStyle}
    scrollEnabled={false}
  >
    {data.map((item, index) => (
      <View key={index} style={styles.itemContainer}>
        <Image source={item.image} resizeMode="contain" style={styles.icon} />
        <ThemeText style={styles.textStyle} color="secondary">
          {item.title}
        </ThemeText>
      </View>
    ))}
  </ScrollView>
);

export default OnboardingCard;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(20),
  },
  icon: {
    width: widthPixel(30),
    height: heightPixel(30),
    marginRight: widthPixel(12), // replaces extra wrapper
  },
  contentContainerStyle: {
    marginTop: heightPixel(20),
    paddingHorizontal: widthPixel(5),
  },
  textStyle: {
    fontFamily: fontFamilies.medium,
    fontSize: fontPixel(14),
    flexShrink: 1, // ensures text adjusts well in smaller screens
  },
});
