import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import { UserHeader } from '../../../components/Header';
import { useLanguage } from '../../../context/LanguageContext';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { apiService } from '../../../service/apiService';
import { RecommendationsResponse } from '../../../types/dashboard.types';
import { showCustomFlash } from '../../../utils/flash';
import LinearGradient from 'react-native-linear-gradient';

const Index = () => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const [recommendations, setRecommendations] =
    useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getRecommendations();

      if (response.success !== false && response.Success !== false) {
        const data =
          response.data || response.Data || (response as any);
        if (data && typeof data === 'object' && 'seasonalRecommendations' in data) {
          setRecommendations(data as RecommendationsResponse);
        } else {
          setRecommendations(null);
          showCustomFlash(t('recommendations.noDataAvailable'), 'warning');
        }
      } else {
        setRecommendations(null);
        showCustomFlash(
          response.message || response.Message || t('recommendations.failedToLoad'),
          'danger',
        );
      }
    } catch (error: any) {
      console.error('❌ [Recommendations] Error loading recommendations:', error);
      setRecommendations(null);
      
      // Show user-friendly error messages
      const errorMessage = error.message || t('recommendations.couldNotFetch');
      let displayMessage = errorMessage;
      
      if (errorMessage.includes('timeout') || errorMessage.includes('too long')) {
        displayMessage = t('recommendations.requestTimeout');
      } else if (errorMessage.includes('Network error') || errorMessage.includes('internet connection')) {
        displayMessage = t('recommendations.networkError');
      } else if (errorMessage.includes('Not authenticated')) {
        displayMessage = t('recommendations.authenticationError');
      }
      
      showCustomFlash(displayMessage, 'danger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  if (loading && !recommendations) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <HomeWrapper>
          <UserHeader showBackButton={false} showDrawerButton={true} />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              {t('recommendations.loading')}
            </Text>
          </View>
        </HomeWrapper>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <HomeWrapper>
        <UserHeader showBackButton={false} showDrawerButton={true} />
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {recommendations ? (
            <>
              {/* Summary Section */}
              {recommendations.summary && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>📋</Text>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: themeColors.text },
                      ]}
                    >
                      {t('recommendations.summary')}
                    </Text>
                  </View>
                  <LinearGradient
                    colors={['#3B82F6', '#60A5FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientCard}
                  >
                    <Text style={styles.summaryText}>
                      {recommendations.summary}
                    </Text>
                  </LinearGradient>
                </View>
              )}

              {/* Key Takeaways */}
              {recommendations.keyTakeaways &&
                recommendations.keyTakeaways.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>💡</Text>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: themeColors.text },
                        ]}
                      >
                        {t('recommendations.keyTakeaways')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.card,
                        styles.elevatedCard,
                        { 
                          backgroundColor: themeColors.background,
                          borderColor: colors.light.gray3 + '30',
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={['#F59E0B', '#FBBF24']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.takeawayHeader}
                      >
                        <Text style={styles.takeawayHeaderText}>
                          {t('recommendations.importantPoints')}
                        </Text>
                      </LinearGradient>
                      <View style={styles.cardContent}>
                        {recommendations.keyTakeaways.map((takeaway, index) => (
                          <View key={index} style={styles.takeawayItem}>
                            <View
                              style={[
                                styles.checkIconContainer,
                                {
                                  backgroundColor: '#F59E0B' + '20',
                                },
                              ]}
                            >
                              <Text style={styles.checkIcon}>✓</Text>
                            </View>
                            <View style={styles.takeawayTextContainer}>
                              <Text
                                style={[
                                  styles.takeawayText,
                                  { color: themeColors.text },
                                ]}
                              >
                                {takeaway}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}

              {/* Seasonal Recommendations */}
              {recommendations.seasonalRecommendations &&
                recommendations.seasonalRecommendations.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>🌾</Text>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: themeColors.text },
                        ]}
                      >
                        {t('recommendations.seasonalRecommendations')}
                      </Text>
                    </View>
                    {recommendations.seasonalRecommendations.map(
                      (season, index) => (
                        <View
                          key={index}
                          style={[
                            styles.card,
                            styles.elevatedCard,
                            { 
                              backgroundColor: themeColors.background,
                              borderColor: colors.light.gray3 + '30',
                            },
                          ]}
                        >
                          <LinearGradient
                            colors={['#10B981', '#34D399']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.seasonHeader}
                          >
                            <Text style={styles.seasonTitle}>
                              {season.season} {t('recommendations.season')}
                            </Text>
                          </LinearGradient>
                          <View style={styles.cardContent}>
                            <Text
                              style={[
                                styles.description,
                                { color: themeColors.text },
                              ]}
                            >
                              {season.description}
                            </Text>
                            {season.topCrops && season.topCrops.length > 0 && (
                              <View style={styles.cropsContainer}>
                                <Text
                                  style={[
                                    styles.label,
                                    { color: themeColors.secondaryText },
                                  ]}
                                >
                                  🌱 {t('recommendations.topCrops')}
                                </Text>
                                <View style={styles.chipContainer}>
                                  {season.topCrops.map((crop, i) => (
                                    <View
                                      key={i}
                                      style={[
                                        styles.chip,
                                        {
                                          backgroundColor:
                                            themeColors.primary + '15',
                                        },
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.chipText,
                                          { color: themeColors.primary },
                                        ]}
                                      >
                                        {crop}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                            <View style={styles.infoGrid}>
                              {season.sowingWindow && (
                                <View style={styles.infoCard}>
                                  <Text style={styles.infoIcon}>🌱</Text>
                                  <Text
                                    style={[
                                      styles.infoLabel,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    {t('recommendations.sowing')}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.infoValue,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {season.sowingWindow}
                                  </Text>
                                </View>
                              )}
                              {season.harvestingWindow && (
                                <View style={styles.infoCard}>
                                  <Text style={styles.infoIcon}>✂️</Text>
                                  <Text
                                    style={[
                                      styles.infoLabel,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    {t('recommendations.harvesting')}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.infoValue,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {season.harvestingWindow}
                                  </Text>
                                </View>
                              )}
                            </View>
                            {season.keyInsights &&
                              season.keyInsights.length > 0 && (
                                <View style={styles.insightsContainer}>
                                  <Text
                                    style={[
                                      styles.label,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    💡 {t('recommendations.keyInsights')}
                                  </Text>
                                  {season.keyInsights.map((insight, i) => (
                                    <View key={i} style={styles.insightItem}>
                                      <View style={styles.insightBullet} />
                                      <Text
                                        style={[
                                          styles.insightText,
                                          { color: themeColors.text },
                                        ]}
                                      >
                                        {insight}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              )}
                          </View>
                        </View>
                      ),
                    )}
                  </View>
                )}

              {/* Regional Highlights */}
              {recommendations.regionalHighlights &&
                recommendations.regionalHighlights.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>🗺️</Text>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: themeColors.text },
                        ]}
                      >
                        {t('recommendations.regionalHighlights')}
                      </Text>
                    </View>
                    {recommendations.regionalHighlights.map((region, index) => (
                      <View
                        key={index}
                        style={[
                          styles.card,
                          styles.elevatedCard,
                          { 
                            backgroundColor: themeColors.background,
                            borderColor: colors.light.gray3 + '30',
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['#8B5CF6', '#A78BFA']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.regionHeader}
                        >
                          <Text style={styles.regionTitle}>{region.region}</Text>
                        </LinearGradient>
                        <View style={styles.cardContent}>
                          <Text
                            style={[
                              styles.description,
                              { color: themeColors.text },
                            ]}
                          >
                            {region.description}
                          </Text>
                          {region.bestCrops && region.bestCrops.length > 0 && (
                            <View style={styles.cropsContainer}>
                              <Text
                                style={[
                                  styles.label,
                                  { color: themeColors.secondaryText },
                                ]}
                              >
                                🌾 {t('recommendations.bestCrops')}
                              </Text>
                              <View style={styles.chipContainer}>
                                {region.bestCrops.map((crop, i) => (
                                  <View
                                    key={i}
                                    style={[
                                      styles.chip,
                                      {
                                        backgroundColor:
                                          themeColors.primary + '15',
                                      },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.chipText,
                                        { color: themeColors.primary },
                                      ]}
                                    >
                                      {crop}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                          {region.specialNotes &&
                            region.specialNotes.length > 0 && (
                              <View style={styles.insightsContainer}>
                                  <Text
                                    style={[
                                      styles.label,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    📝 {t('recommendations.specialNotes')}
                                  </Text>
                                {region.specialNotes.map((note, i) => (
                                  <View key={i} style={styles.insightItem}>
                                    <View style={styles.insightBullet} />
                                    <Text
                                      style={[
                                        styles.insightText,
                                        { color: themeColors.text },
                                      ]}
                                    >
                                      {note}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

              {/* Top Crops */}
              {recommendations.topCrops &&
                recommendations.topCrops.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>⭐</Text>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: themeColors.text },
                        ]}
                      >
                        {t('recommendations.topRecommendedCrops')}
                      </Text>
                    </View>
                    {recommendations.topCrops.map((crop, index) => (
                      <View
                        key={index}
                        style={[
                          styles.card,
                          styles.elevatedCard,
                          { 
                            backgroundColor: themeColors.background,
                            borderColor: colors.light.gray3 + '30',
                          },
                        ]}
                      >
                        <View style={styles.cropHeader}>
                          <View style={styles.cropHeaderLeft}>
                            <Text style={styles.cropIcon}>🌾</Text>
                            <Text
                              style={[
                                styles.cropName,
                                { color: themeColors.text },
                              ]}
                            >
                              {crop.cropName}
                            </Text>
                          </View>
                          <LinearGradient
                            colors={['#F59E0B', '#FBBF24']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.scoreBadge}
                          >
                            <Text style={styles.scoreText}>
                              {crop.suitabilityScore}%
                            </Text>
                          </LinearGradient>
                        </View>
                        <View style={styles.cardContent}>
                          <View style={styles.infoGrid}>
                            {crop.regions && crop.regions.length > 0 && (
                              <View style={styles.infoCard}>
                                <Text style={styles.infoIcon}>📍</Text>
                                <Text
                                  style={[
                                    styles.infoLabel,
                                    { color: themeColors.secondaryText },
                                  ]}
                                >
                                  {t('recommendations.regions')}
                                </Text>
                                <View style={styles.chipContainer}>
                                  {crop.regions.map((region, i) => (
                                    <View
                                      key={i}
                                      style={[
                                        styles.smallChip,
                                        {
                                          backgroundColor:
                                            themeColors.primary + '10',
                                        },
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.smallChipText,
                                          { color: themeColors.primary },
                                        ]}
                                      >
                                        {region}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                            {crop.seasons && crop.seasons.length > 0 && (
                              <View style={styles.infoCard}>
                                <Text style={styles.infoIcon}>📅</Text>
                                <Text
                                  style={[
                                    styles.infoLabel,
                                    { color: themeColors.secondaryText },
                                  ]}
                                >
                                  {t('recommendations.seasons')}
                                </Text>
                                <View style={styles.chipContainer}>
                                  {crop.seasons.map((season, i) => (
                                    <View
                                      key={i}
                                      style={[
                                        styles.smallChip,
                                        {
                                          backgroundColor:
                                            '#10B981' + '15',
                                        },
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.smallChipText,
                                          { color: '#10B981' },
                                        ]}
                                      >
                                        {season}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                          </View>
                          {crop.keyBenefits && crop.keyBenefits.length > 0 && (
                            <View style={styles.insightsContainer}>
                              <Text
                                style={[
                                  styles.label,
                                  { color: themeColors.secondaryText },
                                ]}
                              >
                                ✨ {t('recommendations.keyBenefits')}
                              </Text>
                              {crop.keyBenefits.map((benefit, i) => (
                                <View key={i} style={styles.insightItem}>
                                  <View style={styles.insightBullet} />
                                  <Text
                                    style={[
                                      styles.insightText,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {benefit}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                          {crop.requirements && (
                            <View style={styles.requirementsContainer}>
                              <Text
                                style={[
                                  styles.label,
                                  { color: themeColors.secondaryText },
                                ]}
                              >
                                🔬 {t('recommendations.requirements')}
                              </Text>
                              <View style={styles.requirementsGrid}>
                                <View style={styles.requirementCard}>
                                  <Text style={styles.requirementIcon}>🧪</Text>
                                  <Text
                                    style={[
                                      styles.requirementLabel,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    {t('recommendations.soilPH')}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.requirementValue,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {crop.requirements.soilPH}
                                  </Text>
                                </View>
                                <View style={styles.requirementCard}>
                                  <Text style={styles.requirementIcon}>💧</Text>
                                  <Text
                                    style={[
                                      styles.requirementLabel,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    {t('recommendations.moisture')}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.requirementValue,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {crop.requirements.moisture}
                                  </Text>
                                </View>
                                <View style={styles.requirementCard}>
                                  <Text style={styles.requirementIcon}>🌿</Text>
                                  <Text
                                    style={[
                                      styles.requirementLabel,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    {t('recommendations.nitrogen')}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.requirementValue,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {crop.requirements.nitrogen}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

              {/* Farming Calendar */}
              {recommendations.farmingCalendar &&
                recommendations.farmingCalendar.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionIcon}>📅</Text>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: themeColors.text },
                        ]}
                      >
                        {t('recommendations.farmingCalendar')}
                      </Text>
                    </View>
                    {recommendations.farmingCalendar.map((month, index) => (
                      <View
                        key={index}
                        style={[
                          styles.card,
                          styles.elevatedCard,
                          { 
                            backgroundColor: themeColors.background,
                            borderColor: colors.light.gray3 + '30',
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['#EC4899', '#F472B6']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.monthHeader}
                        >
                          <Text style={styles.monthTitle}>{month.month}</Text>
                        </LinearGradient>
                        <View style={styles.cardContent}>
                          {month.activities && month.activities.length > 0 && (
                            <View style={styles.activitiesContainer}>
                              <Text
                                style={[
                                  styles.label,
                                  { color: themeColors.secondaryText },
                                ]}
                              >
                                🔨 {t('recommendations.activities')}
                              </Text>
                              {month.activities.map((activity, i) => (
                                <View key={i} style={styles.insightItem}>
                                  <View style={styles.insightBullet} />
                                  <Text
                                    style={[
                                      styles.insightText,
                                      { color: themeColors.text },
                                    ]}
                                  >
                                    {activity}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                          <View style={styles.calendarGrid}>
                            {month.cropsToSow && month.cropsToSow.length > 0 && (
                              <View style={styles.calendarCard}>
                                <Text style={styles.calendarIcon}>🌱</Text>
                                <Text
                                  style={[
                                    styles.calendarLabel,
                                    { color: themeColors.secondaryText },
                                  ]}
                                >
                                  {t('recommendations.cropsToSow')}
                                </Text>
                                <View style={styles.chipContainer}>
                                  {month.cropsToSow.map((crop, i) => (
                                    <View
                                      key={i}
                                      style={[
                                        styles.smallChip,
                                        {
                                          backgroundColor: '#10B981' + '15',
                                        },
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          styles.smallChipText,
                                          { color: '#10B981' },
                                        ]}
                                      >
                                        {crop}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                            {month.cropsToHarvest &&
                              month.cropsToHarvest.length > 0 && (
                                <View style={styles.calendarCard}>
                                  <Text style={styles.calendarIcon}>✂️</Text>
                                  <Text
                                    style={[
                                      styles.calendarLabel,
                                      { color: themeColors.secondaryText },
                                    ]}
                                  >
                                    {t('recommendations.cropsToHarvest')}
                                  </Text>
                                  <View style={styles.chipContainer}>
                                    {month.cropsToHarvest.map((crop, i) => (
                                      <View
                                        key={i}
                                        style={[
                                          styles.smallChip,
                                          {
                                            backgroundColor:
                                              '#F59E0B' + '15',
                                          },
                                        ]}
                                      >
                                        <Text
                                          style={[
                                            styles.smallChipText,
                                            { color: '#F59E0B' },
                                          ]}
                                        >
                                          {crop}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text
                style={[styles.emptyText, { color: themeColors.secondaryText }]}
              >
                {t('recommendations.noRecommendations')}
              </Text>
            </View>
          )}
        </ScrollView>
      </HomeWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: widthPixel(16),
    paddingBottom: heightPixel(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightPixel(100),
  },
  loadingText: {
    marginTop: heightPixel(16),
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
  },
  section: {
    marginTop: heightPixel(20),
    marginBottom: heightPixel(4),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(12),
  },
  sectionIcon: {
    fontSize: fontPixel(24),
    marginRight: widthPixel(10),
  },
  sectionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: widthPixel(12),
    marginBottom: heightPixel(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.gray3 + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevatedCard: {
    // Same as card, kept for backward compatibility
  },
  gradientCard: {
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    marginBottom: heightPixel(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: fontPixel(15),
    fontFamily: fontFamilies.regular,
    lineHeight: heightPixel(24),
    color: '#FFFFFF',
  },
  takeawayHeader: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(14),
  },
  takeawayHeaderText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  takeawayItem: {
    flexDirection: 'row',
    marginBottom: heightPixel(12),
    alignItems: 'flex-start',
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(4),
    borderRadius: widthPixel(8),
    backgroundColor: colors.light.gray6 + '50',
  },
  checkIconContainer: {
    width: widthPixel(28),
    height: widthPixel(28),
    borderRadius: widthPixel(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: widthPixel(12),
    marginTop: heightPixel(2),
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  checkIcon: {
    fontSize: fontPixel(16),
    color: '#F59E0B',
    fontFamily: fontFamilies.bold,
  },
  takeawayTextContainer: {
    flex: 1,
    paddingTop: heightPixel(2),
  },
  takeawayText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    lineHeight: heightPixel(20),
  },
  cardContent: {
    padding: widthPixel(16),
  },
  seasonHeader: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(14),
  },
  seasonTitle: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  regionHeader: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(14),
  },
  regionTitle: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  monthHeader: {
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(14),
  },
  monthTitle: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  seasonTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(8),
  },
  regionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(8),
  },
  monthTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(8),
  },
  description: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(12),
    lineHeight: heightPixel(20),
  },
  label: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(8),
    marginTop: heightPixel(2),
  },
  cropsContainer: {
    marginBottom: heightPixel(12),
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: heightPixel(8),
    gap: widthPixel(8),
  },
  chip: {
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(20),
    marginRight: widthPixel(6),
    marginBottom: heightPixel(6),
  },
  chipText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
  },
  smallChip: {
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(16),
    marginRight: widthPixel(6),
    marginBottom: heightPixel(6),
  },
  smallChipText: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.medium,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: heightPixel(12),
    gap: widthPixel(10),
  },
  infoCard: {
    flex: 1,
    minWidth: widthPixel(140),
    padding: widthPixel(12),
    borderRadius: widthPixel(12),
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.gray3 + '50',
  },
  infoIcon: {
    fontSize: fontPixel(24),
    marginBottom: heightPixel(6),
  },
  infoLabel: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(6),
    textAlign: 'center',
  },
  infoValue: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
  },
  insightsContainer: {
    marginTop: heightPixel(6),
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: heightPixel(8),
    alignItems: 'flex-start',
  },
  insightBullet: {
    width: widthPixel(6),
    height: widthPixel(6),
    borderRadius: widthPixel(3),
    backgroundColor: colors.light.primary,
    marginRight: widthPixel(12),
    marginTop: heightPixel(8),
  },
  insightText: {
    flex: 1,
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.regular,
    lineHeight: heightPixel(20),
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(16),
    paddingTop: widthPixel(16),
    paddingBottom: heightPixel(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.light.gray3 + '30',
    marginBottom: heightPixel(4),
  },
  cropHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cropIcon: {
    fontSize: fontPixel(24),
    marginRight: widthPixel(10),
  },
  cropName: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(20),
  },
  scoreText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
  },
  requirementsContainer: {
    marginTop: heightPixel(12),
    paddingTop: heightPixel(12),
    borderTopWidth: 1,
    borderTopColor: colors.light.gray3 + '30',
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: heightPixel(12),
    gap: widthPixel(10),
  },
  requirementCard: {
    flex: 1,
    minWidth: widthPixel(100),
    padding: widthPixel(12),
    borderRadius: widthPixel(12),
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.gray3 + '50',
  },
  requirementIcon: {
    fontSize: fontPixel(20),
    marginBottom: heightPixel(6),
  },
  requirementLabel: {
    fontSize: fontPixel(11),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(4),
    textAlign: 'center',
  },
  requirementValue: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
  },
  activitiesContainer: {
    marginBottom: heightPixel(12),
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: heightPixel(12),
    gap: widthPixel(12),
  },
  calendarCard: {
    flex: 1,
    minWidth: widthPixel(150),
    padding: widthPixel(14),
    borderRadius: widthPixel(12),
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: colors.light.gray3 + '50',
  },
  calendarIcon: {
    fontSize: fontPixel(24),
    marginBottom: heightPixel(8),
    textAlign: 'center',
  },
  calendarLabel: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
    marginBottom: heightPixel(8),
    textAlign: 'center',
  },
  emptyContainer: {
    padding: heightPixel(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
  },
});

export default Index;

