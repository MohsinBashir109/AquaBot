import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';
import { TodayTasksResponse } from '../../types/dashboard.types';
import { apiService } from '../../service/apiService';

interface TodayTasksCardProps {
  data: TodayTasksResponse | null;
  onRefresh?: () => void;
  loading?: boolean;
}

const TodayTasksCard: React.FC<TodayTasksCardProps> = ({
  data,
  onRefresh,
  loading = false,
}) => {
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return '#EF4444';
      case 'High':
        return '#F59E0B';
      case 'Medium':
        return '#3B82F6';
      case 'Low':
        return '#10B981';
      default:
        return '#10B981';
    }
  };

  const handleMarkComplete = async (scheduleId: number) => {
    try {
      await apiService.completeTask({ scheduleId });
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.white }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (!data || !data.hasTask) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.white }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          TODAY'S TASKS
        </Text>
        <View style={styles.emptyState}>
          <Text
            style={[styles.emptyText, { color: themeColors.secondaryText }]}
          >
            No watering today! ✅
          </Text>
          {data?.nextTaskDate && (
            <Text
              style={[
                styles.nextTaskText,
                { color: themeColors.secondaryText },
              ]}
            >
              Next task: {new Date(data.nextTaskDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.white }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>
        TODAY'S TASKS
      </Text>

      <View style={styles.summaryContainer}>
        <Text
          style={[styles.summaryText, { color: themeColors.text }]}
          numberOfLines={2}
        >
          Total Water: {data.totalWaterLiters.toLocaleString()}L (
          {data.totalWaterBuckets.toLocaleString()} buckets)
        </Text>
      </View>

      {data.fields.map((field, index) => (
        <View
          key={index}
          style={[styles.fieldCard, { backgroundColor: themeColors.gray6 }]}
        >
          <View style={styles.fieldHeader}>
            <View style={styles.fieldInfo}>
              <Text style={[styles.fieldName, { color: themeColors.text }]}>
                {field.fieldName}
              </Text>
              <Text
                style={[styles.cropType, { color: themeColors.secondaryText }]}
              >
                🌾 {field.cropType}
              </Text>
            </View>
            <View
              style={[
                styles.urgencyBadge,
                { backgroundColor: getUrgencyColor(field.urgency) },
              ]}
            >
              <Text style={styles.urgencyText}>{field.urgency}</Text>
            </View>
          </View>

          <View style={styles.fieldDetails}>
            <Text
              style={[styles.waterAmount, { color: themeColors.text }]}
              numberOfLines={2}
            >
              {field.waterLiters.toLocaleString()}L (
              {field.waterBuckets.toLocaleString()} buckets)
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              { backgroundColor: themeColors.primary },
            ]}
            onPress={() => handleMarkComplete(index + 1)}
          >
            <Text style={styles.completeButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    marginBottom: heightPixel(16),
    width: '100%',
    minHeight: heightPixel(200),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(12),
  },
  summaryContainer: {
    marginBottom: heightPixel(12),
    paddingBottom: heightPixel(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  summaryText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.semibold,
  },
  emptyState: {
    paddingVertical: heightPixel(20),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(8),
  },
  nextTaskText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
  },
  fieldCard: {
    padding: widthPixel(12),
    borderRadius: widthPixel(8),
    marginBottom: heightPixel(10),
    width: '100%',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: heightPixel(8),
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(4),
  },
  cropType: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
  },
  urgencyBadge: {
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(4),
  },
  urgencyText: {
    fontSize: fontPixel(10),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
  fieldDetails: {
    marginBottom: heightPixel(10),
  },
  waterAmount: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.regular,
  },
  completeButton: {
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(6),
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
});

export default TodayTasksCard;
