import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.white,
          borderLeftWidth: widthPixel(4),
          borderLeftColor: color,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color: themeColors.text }]}>{value}</Text>
      <Text
        style={[styles.title, { color: themeColors.secondaryText }]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: widthPixel(10),
    borderRadius: widthPixel(10),
    marginBottom: heightPixel(8),
    minHeight: heightPixel(100),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: heightPixel(8),
  },
  icon: {
    fontSize: fontPixel(18),
  },
  value: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(4),
  },
  title: {
    fontSize: fontPixel(9),
    fontFamily: fontFamilies.regular,
    lineHeight: fontPixel(12),
  },
});

export default StatCard;
