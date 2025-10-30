import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';
import { AnalysisHistoryItem } from '../../types/dashboard.types';

interface AnalysisHistoryCardProps {
  item: AnalysisHistoryItem;
  onPress?: () => void;
}

const AnalysisHistoryCard: React.FC<AnalysisHistoryCardProps> = ({
  item,
  onPress,
}) => {
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return '#10B981';
      case 'Warning':
        return '#F59E0B';
      case 'Critical':
        return '#EF4444';
      default:
        return '#10B981';
    }
  };

  const statusColor = getStatusColor(item.cropHealthStatus);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: themeColors.white }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.date, { color: themeColors.text }]}>
        {formatDate(item.date)}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.textDetails}>
          <Text style={[styles.detailText, { color: themeColors.text }]}>
            Soil Type: {item.soilType}
          </Text>
          <Text style={[styles.detailText, { color: themeColors.text }]}>
            Crop Type: {item.cropType}
          </Text>
          <Text style={[styles.detailText, { color: themeColors.text }]}>
            Moisture: {item.moisturePercentage}%
          </Text>
        </View>

        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: themeColors.gray5 },
            ]}
          >
            <Text style={styles.placeholderText}>🌾</Text>
          </View>
        )}
      </View>

      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{item.cropHealthStatus}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthPixel(150),
    minWidth: widthPixel(140),
    maxWidth: widthPixel(180),
    padding: widthPixel(12),
    borderRadius: widthPixel(10),
    marginRight: widthPixel(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  date: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(8),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightPixel(10),
  },
  textDetails: {
    flex: 1,
    marginRight: widthPixel(8),
  },
  detailText: {
    fontSize: fontPixel(9),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(4),
  },
  image: {
    width: widthPixel(50),
    height: widthPixel(50),
    borderRadius: widthPixel(25),
  },
  imagePlaceholder: {
    width: widthPixel(50),
    height: widthPixel(50),
    borderRadius: widthPixel(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: fontPixel(24),
  },
  statusBadge: {
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(4),
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: fontPixel(9),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
});

export default AnalysisHistoryCard;
