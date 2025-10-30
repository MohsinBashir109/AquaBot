import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React, { useState, useEffect, useCallback } from 'react';
import { UserHeader } from '../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../../context/LanguageContext';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useAppSelector } from '../../../store/hooks';
import { apiService } from '../../../service/apiService';
import { showCustomFlash } from '../../../utils/flash';
import {
  TodayTasksResponse,
  IrrigationPlanDetailsDto,
  WeatherResponse,
  AnalysisHistoryItem,
} from '../../../types/dashboard.types';

// Dashboard Components
import WeatherWidget from '../../../components/Dashboard/WeatherWidget';
import StatCard from '../../../components/Dashboard/StatCard';
import TodayTasksCard from '../../../components/Dashboard/TodayTasksCard';
import IrrigationPlanCard from '../../../components/Dashboard/IrrigationPlanCard';
import AnalysisHistoryCard from '../../../components/Dashboard/AnalysisHistoryCard';

const Index = () => {
  const navigation = useNavigation();
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const { user } = useAppSelector(state => state.user);

  const [todayTasks, setTodayTasks] = useState<TodayTasksResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [plans, setPlans] = useState<IrrigationPlanDetailsDto[]>([]);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const city = user?.farmLocation || 'Lahore';

      // Load all data in parallel
      const [tasksRes, weatherRes, plansRes, historyRes] =
        await Promise.allSettled([
          apiService.getTodayTasks(),
          apiService.getWeather(city),
          apiService.getMyIrrigationPlans(),
          apiService.getAnalysisHistory(),
        ]);

      if (tasksRes.status === 'fulfilled' && tasksRes.value.success) {
        setTodayTasks(tasksRes.value.data || tasksRes.value.Data || null);
      }

      if (weatherRes.status === 'fulfilled' && weatherRes.value.success) {
        setWeather(weatherRes.value.data || weatherRes.value.Data || null);
      }

      if (plansRes.status === 'fulfilled' && plansRes.value.success) {
        const plansData = plansRes.value.data || plansRes.value.Data || [];
        setPlans(Array.isArray(plansData) ? plansData : []);
      }

      if (historyRes.status === 'fulfilled' && historyRes.value.success) {
        const historyData =
          historyRes.value.data || historyRes.value.Data || [];
        setHistory(Array.isArray(historyData) ? historyData : []);
      }
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      showCustomFlash('Failed to load dashboard data', 'danger');
    } finally {
      setLoading(false);
    }
  }, [user?.farmLocation]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleWeatherRefresh = async () => {
    setWeatherLoading(true);
    try {
      const city = user?.farmLocation || 'Lahore';
      const response = await apiService.getWeather(city);
      if (response.success) {
        setWeather(response.data || response.Data || null);
      }
    } catch (error) {
      console.error('Error refreshing weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Calculate stats
  const activePlansCount = plans.length;
  const totalWaterBuckets = todayTasks?.totalWaterBuckets || 0;
  const pendingTasks = plans.reduce(
    (sum, plan) => sum + (plan.summary?.pendingSchedules || 0),
    0,
  );
  const completionRate =
    plans.reduce((sum, plan) => {
      const total = plan.summary?.totalSchedules || 0;
      const completed = plan.summary?.completedSchedules || 0;
      return total > 0 ? sum + (completed / total) * 100 : sum;
    }, 0) / (plans.length || 1);

  if (loading && !todayTasks && !weather) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <HomeWrapper>
          <UserHeader showBackButton={false} showDrawerButton={true} />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
          </View>
        </HomeWrapper>
      </View>
    );
  }

  const { t } = useLanguage();
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
          {/* Weather Widget */}
          <WeatherWidget
            data={weather}
            city={user?.farmLocation || 'Lahore'}
            onRefresh={handleWeatherRefresh}
            loading={weatherLoading}
          />

          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t('home.quickStats') || 'QUICK STATS'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title={t('home.activePlans')}
                  value={activePlansCount}
                  icon="📊"
                  color="#3B82F6"
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title={t('home.todayBuckets')}
                  value={`${totalWaterBuckets}d`}
                  icon="💧"
                  color="#F59E0B"
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title={t('home.pendingTasks')}
                  value={pendingTasks}
                  icon="⏳"
                  color="#60A5FA"
                />
              </View>
              <View style={styles.statCardWrapper}>
                <StatCard
                  title={t('home.completionRate')}
                  value={`${Math.round(completionRate)}%`}
                  icon="📈"
                  color="#60A5FA"
                />
              </View>
            </View>
          </View>

          {/* Today's Tasks */}
          <TodayTasksCard
            data={todayTasks}
            onRefresh={loadDashboardData}
            loading={loading}
          />

          {/* Irrigation Plans */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t('home.quickStats') || 'QUICK STATS'}
            </Text>
            {plans.length === 0 ? (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyText,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  {t('home.noPlans') || 'No irrigation plans yet'}
                </Text>
              </View>
            ) : (
              plans
                .slice(0, 2)
                .map(plan => (
                  <IrrigationPlanCard
                    key={plan.id}
                    plan={plan}
                    navigation={navigation}
                  />
                ))
            )}
          </View>

          {/* Recent Analysis History */}
          {history.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                RECENT ANALYSIS HISTORY
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {history.slice(0, 5).map(item => (
                  <AnalysisHistoryCard
                    key={item.id}
                    item={item}
                    onPress={() => {
                      // Navigate to analysis details when implemented
                      console.log('View analysis details:', item.id);
                    }}
                  />
                ))}
              </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightPixel(100),
  },
  section: {
    marginTop: heightPixel(20),
    marginBottom: heightPixel(10),
    minHeight: heightPixel(180),
  },
  sectionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(12),
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightPixel(10),
    width: '100%',
    marginHorizontal: widthPixel(-3),
  },
  statCardWrapper: {
    flex: 1,
    marginHorizontal: widthPixel(3),
  },
  emptyState: {
    padding: heightPixel(40),
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: widthPixel(12),
  },
  emptyText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
  },
  horizontalScroll: {
    width: '100%',
  },
});

export default Index;
