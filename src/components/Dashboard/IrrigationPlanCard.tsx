import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';
import { IrrigationPlanDetailsDto } from '../../types/dashboard.types';

interface IrrigationPlanCardProps {
  plan: IrrigationPlanDetailsDto;
  navigation?: any;
}

const IrrigationPlanCard: React.FC<IrrigationPlanCardProps> = ({
  plan,
  navigation,
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

  const getProgressPercentage = () => {
    if (plan.summary.totalSchedules === 0) return 0;
    return (
      (plan.summary.completedSchedules / plan.summary.totalSchedules) * 100
    );
  };

  const progressPercentage = getProgressPercentage();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.white }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text
            style={[styles.fieldName, { color: themeColors.text }]}
            numberOfLines={2}
          >
            {plan.fieldName}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.growthStageBadge, styles.amberBadge]}>
              <Text style={styles.badgeText}>{plan.cropGrowthStage}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.infoIcon}>ⓘ</Text>
      </View>

      <Text
        style={[styles.dateRange, { color: themeColors.secondaryText }]}
        numberOfLines={2}
      >
        {formatDate(plan.planStartDate)} - {formatDate(plan.planEndDate)}
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              styles.amberProgressFill,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.detailText, { color: themeColors.text }]}>
          Total {plan.summary.totalSchedules}
        </Text>
        <Text style={[styles.detailText, { color: themeColors.text }]}>
          Completed: {plan.summary.completedSchedules} / Pending:{' '}
          {plan.summary.pendingSchedules}
        </Text>
        {plan.summary.nextScheduledDate && (
          <Text style={[styles.detailText, { color: themeColors.text }]}>
            {formatDate(plan.summary.nextScheduledDate)}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: themeColors.primary }]}
          onPress={() => {
            if (navigation) {
              // Navigate to plan details when implemented
              console.log('Navigate to plan details:', plan.id);
            }
          }}
        >
          <Text style={styles.buttonText}>View Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    marginBottom: heightPixel(16),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: heightPixel(8),
  },
  headerLeft: {
    flex: 1,
  },
  fieldName: {
    fontSize: fontPixel(15),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(6),
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: heightPixel(4),
  },
  growthStageBadge: {
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(4),
  },
  badgeText: {
    fontSize: fontPixel(10),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
  infoIcon: {
    fontSize: fontPixel(16),
    color: '#9CA3AF',
  },
  dateRange: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(12),
  },
  progressContainer: {
    marginBottom: heightPixel(12),
  },
  progressBar: {
    height: heightPixel(6),
    backgroundColor: '#E5E5E5',
    borderRadius: widthPixel(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: widthPixel(3),
  },
  detailsContainer: {
    marginBottom: heightPixel(12),
  },
  detailText: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(4),
  },
  buttonContainer: {
    marginTop: heightPixel(8),
  },
  viewButton: {
    paddingVertical: heightPixel(10),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(8),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
  amberBadge: {
    backgroundColor: '#F59E0B',
  },
  amberProgressFill: {
    backgroundColor: '#F59E0B',
  },
});

export default IrrigationPlanCard;
