import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { IrrigationScheduleItem } from '../../types/imageAnalysis.types';
import { fontPixel, heightPixel, widthPixel } from '../../utils/constants';
import { fontFamilies } from '../../utils/fontfamilies';
import { colors } from '../../utils/colors';
import { useThemeContext } from '../../theme/ThemeContext';
import ThemeButton from '../ThemeComponents/ThemeButton';

interface IrrigationScheduleCardProps {
  item: IrrigationScheduleItem;
  index: number;
}

// Helper function to get status accent color
const getStatusAccentColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'complete':
      return '#22C55E';
    case 'inprogress':
      return '#E08C07';
    case 'expired':
      return '#EF4444';
    case 'locked':
      return '#9CA3AF';
    default:
      return '#9CA3AF';
  }
};

// Helper function to get urgency color
const getUrgencyColor = (urgency: string): string => {
  switch (urgency.toLowerCase()) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#E08C07';
    case 'low':
      return '#4CAF50';
    default:
      return '#9CA3AF';
  }
};

const IrrigationScheduleCard: React.FC<IrrigationScheduleCardProps> = ({
  item,
  index,
}) => {
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const [expanded, setExpanded] = useState(false);

  const statusAccentColor = useMemo(
    () => getStatusAccentColor(item.status),
    [item.status],
  );

  const urgencyColor = useMemo(
    () => getUrgencyColor(item.urgencyLevel),
    [item.urgencyLevel],
  );

  const toggleExpand = () => {
    if (item.status !== 'locked') {
      setExpanded(!expanded);
    }
  };

  const getStatusBackgroundColor = () => {
    switch (item.status.toLowerCase()) {
      case 'complete':
        return '#D8FFE6';
      case 'inprogress':
        return '#FFF4E2';
      case 'expired':
        return '#FFE5E5';
      case 'locked':
        return '#F2F2F2';
      default:
        return '#F2F2F2';
    }
  };

  const getStatusTextColor = () => {
    switch (item.status.toLowerCase()) {
      case 'complete':
        return '#22C55E';
      case 'inprogress':
        return '#E08C07';
      case 'expired':
        return '#EF4444';
      case 'locked':
        return '#9CA3AF';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <Pressable
      onPress={toggleExpand}
      style={{ flex: 1, marginBottom: heightPixel(16) }}
      disabled={item.status === 'locked'}
    >
      <View style={{ flex: 1 }}>
        {/* Main Card */}
        <View
          style={[
            styles.card,
            { borderColor: statusAccentColor, backgroundColor: themeColors.background },
            expanded && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomWidth: 0,
            },
          ]}
        >
          {/* Day Number Circle */}
          <View
            style={[
              styles.imageContainer,
              {
                backgroundColor:
                  item.status === 'complete'
                    ? '#22C55E'
                    : item.status === 'inprogress'
                    ? '#E08C07'
                    : item.status === 'expired'
                    ? '#EF4444'
                    : '#F2F2F2',
              },
            ]}
          >
            {item.isCompleted ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : (
              <Text style={styles.imageText}>{index + 1}</Text>
            )}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {item.day}
            </Text>
            {item.cropName && (
              <Text style={[styles.cropName, { color: themeColors.secondaryText }]}>
                {item.cropName}
              </Text>
            )}
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.buttonContainer,
              {
                backgroundColor: getStatusBackgroundColor(),
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: getStatusTextColor(),
                },
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          {/* Expand Icon */}
          <View style={styles.expIconContainer}>
            <Text style={[styles.expandIcon, { color: themeColors.text }]}>
              {expanded ? '▼' : '▶'}
            </Text>
          </View>
        </View>

        {/* Expanded Details */}
        {expanded && (
          <View
            style={[
              styles.extraDetailsContainer,
              {
                borderColor: statusAccentColor,
                borderTopWidth: 0,
                backgroundColor: themeColors.background,
              },
            ]}
          >
            {/* Status-specific content */}
            {item.status === 'complete' && (
              <>
                <View style={styles.expandedTextRow}>
                  <Text style={[styles.expandedText, { color: themeColors.text }]}>
                    {item.text}
                  </Text>
                </View>
                <View style={styles.expandedTextRow}>
                  <Text style={[styles.expandedTextMedium, { color: themeColors.secondaryText }]}>
                    Water Amount:
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.expandedTextBold, { color: themeColors.text }]}>
                    {item.waterAmountBuckets} buckets ({item.waterAmountLiters}L)
                  </Text>
                </View>
                <View style={styles.expandedTextRow}>
                  <Text style={[styles.expandedTextMedium, { color: themeColors.secondaryText }]}>
                    Date:
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.expandedTextBold, { color: themeColors.text }]}>
                    {item.dateDisplay}
                  </Text>
                </View>
                <ThemeButton
                  title="Completed"
                  onPress={() => {}}
                  disabled={true}
                  buttonStyle={[
                    styles.button,
                    {
                      backgroundColor: '#22C55E',
                    },
                  ]}
                />
              </>
            )}

            {item.status === 'inprogress' && (
              <>
                <View>
                  <Text style={[styles.expandedTextProgress, { color: themeColors.text }]}>
                    {item.instruction}
                  </Text>
                </View>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: themeColors.secondaryText }]}>
                      Water Amount
                    </Text>
                    <Text style={[styles.detailValue, { color: themeColors.text }]}>
                      {item.waterAmountBuckets} buckets
                    </Text>
                    <Text style={[styles.detailSubValue, { color: themeColors.secondaryText }]}>
                      {item.waterAmountLiters} liters
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: themeColors.secondaryText }]}>
                      Urgency
                    </Text>
                    <View
                      style={[
                        styles.urgencyBadge,
                        { backgroundColor: urgencyColor },
                      ]}
                    >
                      <Text style={styles.urgencyText}>{item.urgencyLevel}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.goalsPerHour}>
                  <Text style={[styles.goal, { color: themeColors.secondaryText }]}>
                    Date
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.stepsText, { color: themeColors.text }]}>
                    {item.dateDisplay}
                  </Text>
                </View>
                <View style={styles.goalsPerHour}>
                  <Text style={[styles.goal, { color: themeColors.secondaryText }]}>
                    Expected Weather
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.stepsText, { color: themeColors.text }]}>
                    {item.expectedWeather} at {item.expectedTemperature}°C
                  </Text>
                </View>
                <View style={[styles.goalsPerHour, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.progressText, { color: themeColors.secondaryText }]}>
                    Status
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.progressText, { color: themeColors.text }]}>
                    {item.statusMessage}
                  </Text>
                </View>
                <ThemeButton
                  title="Mark as Complete"
                  onPress={() => {}}
                  buttonStyle={[
                    styles.button,
                    {
                      backgroundColor: themeColors.primary,
                    },
                  ]}
                />
              </>
            )}

            {item.status === 'expired' && (
              <>
                <View>
                  <Text style={[styles.expandedTextProgress, { color: themeColors.text }]}>
                    {item.instruction}
                  </Text>
                </View>
                <View style={styles.goalsPerHour}>
                  <Text style={[styles.goal, { color: themeColors.secondaryText }]}>
                    Scheduled Date
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.stepsText, { color: themeColors.text }]}>
                    {item.dateDisplay}
                  </Text>
                </View>
                <View style={styles.goalsPerHour}>
                  <Text style={[styles.goal, { color: themeColors.secondaryText }]}>
                    Water Amount
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.stepsText, { color: themeColors.text }]}>
                    {item.waterAmountBuckets} buckets ({item.waterAmountLiters}L)
                  </Text>
                </View>
                <View style={[styles.goalsPerHour, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.progressText, { color: themeColors.secondaryText }]}>
                    Status
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.progressText, { color: '#EF4444' }]}>
                    {item.statusMessage}
                  </Text>
                </View>
              </>
            )}

            {item.status === 'locked' && (
              <>
                <View>
                  <Text style={[styles.expandedTextProgress, { color: themeColors.text }]}>
                    {item.instruction}
                  </Text>
                </View>
                <View style={styles.goalsPerHour}>
                  <Text style={[styles.goal, { color: themeColors.secondaryText }]}>
                    Status
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[styles.stepsText, { color: themeColors.secondaryText }]}>
                    {item.statusMessage}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    borderWidth: 2,
    marginBottom: heightPixel(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthPixel(12),
  },
  imageText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  checkmark: {
    fontSize: fontPixel(20),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(4),
  },
  cropName: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
  },
  buttonContainer: {
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(12),
    marginRight: widthPixel(8),
  },
  buttonText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
  },
  expIconContainer: {
    marginLeft: widthPixel(8),
  },
  expandIcon: {
    fontSize: fontPixel(12),
  },
  extraDetailsContainer: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: widthPixel(12),
    borderBottomRightRadius: widthPixel(12),
    padding: widthPixel(16),
    marginTop: heightPixel(-5),
  },
  expandedTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(12),
  },
  expandedText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    flex: 1,
  },
  expandedTextMedium: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.medium,
  },
  expandedTextBold: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.bold,
  },
  expandedTextProgress: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(16),
    lineHeight: fontPixel(20),
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: heightPixel(16),
    gap: widthPixel(12),
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(4),
  },
  detailValue: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(2),
  },
  detailSubValue: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
  },
  urgencyBadge: {
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(4),
    alignSelf: 'flex-start',
    marginTop: heightPixel(4),
  },
  urgencyText: {
    fontSize: fontPixel(10),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
  goalsPerHour: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  goal: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
  },
  stepsText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.semibold,
  },
  progressText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
  },
  button: {
    marginTop: heightPixel(16),
    paddingVertical: heightPixel(12),
    borderRadius: widthPixel(8),
  },
});

export default IrrigationScheduleCard;

