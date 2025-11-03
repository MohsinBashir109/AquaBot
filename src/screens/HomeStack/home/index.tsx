import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React, { useState, useCallback, useRef } from 'react';
import { UserHeader } from '../../../components/Header';
import { useLanguage } from '../../../context/LanguageContext';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { apiService } from '../../../service/apiService';
import { showCustomFlash } from '../../../utils/flash';
import {
  setPlans,
  setLoading as setPlansLoading,
  setError,
  setOffline,
  loadPlansFromCache,
} from '../../../store/irrigationPlansSlice';
import { irrigationPlansCache } from '../../../service/irrigationPlansCache';
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
import AnalysisHistoryCard from '../../../components/Dashboard/AnalysisHistoryCard';
import IrrigationPlanCard from '../../../components/Dashboard/IrrigationPlanCard';

const Index = () => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user);
  const {
    plans,
    loading: plansLoading,
    error: plansError,
    isOffline,
  } = useAppSelector(state => state.irrigationPlans);

  const [todayTasks, setTodayTasks] = useState<TodayTasksResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const lastFarmLocationRef = useRef<string | undefined>(user?.farmLocation);

  const loadDashboardData = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('⏸️ [Dashboard] Already loading, skipping duplicate call');
      return;
    }

    // Check if farm location actually changed
    const currentFarmLocation = user?.farmLocation;
    if (
      hasLoadedRef.current &&
      lastFarmLocationRef.current === currentFarmLocation
    ) {
      console.log(
        '⏸️ [Dashboard] Data already loaded for this location, skipping',
      );
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      dispatch(setPlansLoading(true));
      const city = user?.farmLocation || 'Lahore';

      console.log('🔄 [Dashboard] Loading dashboard data...', {
        city,
        previousLocation: lastFarmLocationRef.current,
      });

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

      if (weatherRes.status === 'fulfilled') {
        // Handle both direct weather data and wrapped response
        const response = weatherRes.value;
        let weatherData: WeatherResponse | null = null;

        // Check if response has main and weather properties (direct weather data)
        if (
          response &&
          typeof response === 'object' &&
          'main' in response &&
          'weather' in response &&
          'name' in response
        ) {
          weatherData = response as unknown as WeatherResponse;
        } else if (
          response.data &&
          typeof response.data === 'object' &&
          'main' in response.data &&
          'weather' in response.data
        ) {
          weatherData = response.data as WeatherResponse;
        } else if (
          response.Data &&
          typeof response.Data === 'object' &&
          'main' in response.Data &&
          'weather' in response.Data
        ) {
          weatherData = response.Data as WeatherResponse;
        }

        if (
          weatherData &&
          response.success !== false &&
          response.Success !== false
        ) {
          setWeather(weatherData);
        } else {
          // Error response or no data
          if (response.success === false || response.Success === false) {
            console.error(
              'Weather API error:',
              response.message || response.Message,
            );
          }
          setWeather(null);
        }
      }

      if (plansRes.status === 'fulfilled') {
        const response = plansRes.value;
        let plansData: IrrigationPlanDetailsDto[] | null = null;

        // Check if response is directly an array (unwrapped)
        if (Array.isArray(response)) {
          plansData = response;
        }
        // Check if response has data wrapped
        else if (response.data && Array.isArray(response.data)) {
          plansData = response.data;
        }
        // Check if response has Data wrapped (PascalCase)
        else if (response.Data && Array.isArray(response.Data)) {
          plansData = response.Data;
        }
        // Check if success is true and extract data
        else if (response.success === true || response.Success === true) {
          plansData = (response.data ||
            response.Data ||
            []) as IrrigationPlanDetailsDto[];
        }

        if (plansData && Array.isArray(plansData) && plansData.length > 0) {
          // Save to Redux store
          dispatch(setPlans(plansData));
          // Cache for offline access
          await irrigationPlansCache.savePlans(plansData);
          dispatch(setOffline(false));
          console.log(
            `✅ [Dashboard] Loaded ${plansData.length} irrigation plans`,
          );
        } else {
          // No data or error
          if (response.success === false || response.Success === false) {
            console.error(
              '❌ [Dashboard] Irrigation Plans API error:',
              response.message || response.Message || 'Unknown error',
            );
            dispatch(
              setError(response.message || response.Message || 'Unknown error'),
            );
            if (
              response.message?.includes('authenticated') ||
              response.Message?.includes('authenticated')
            ) {
              showCustomFlash(
                'Authentication required. Please log in again.',
                'warning',
              );
            }
          } else {
            // Empty response, try to load from cache
            const cachedPlans = await irrigationPlansCache.loadPlans();
            if (cachedPlans && cachedPlans.length > 0) {
              dispatch(loadPlansFromCache(cachedPlans));
              console.log(
                `📦 [Dashboard] Loaded ${cachedPlans.length} plans from cache (offline mode)`,
              );
            } else {
              dispatch(setPlans([]));
            }
          }
        }
      } else if (plansRes.status === 'rejected') {
        console.error('❌ [Dashboard] Failed to fetch plans:', plansRes.reason);
        // Try to load from cache when API fails
        const cachedPlans = await irrigationPlansCache.loadPlans();
        if (cachedPlans && cachedPlans.length > 0) {
          dispatch(loadPlansFromCache(cachedPlans));
          dispatch(setOffline(true));
          console.log(
            `📦 [Dashboard] Loaded ${cachedPlans.length} plans from cache (offline mode)`,
          );
          showCustomFlash(
            'Showing cached plans. Connect to internet to refresh.',
            'warning',
          );
        } else {
          dispatch(setPlans([]));
          dispatch(setError('Failed to fetch plans'));
        }
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
      isLoadingRef.current = false;
      hasLoadedRef.current = true;
      lastFarmLocationRef.current = user?.farmLocation;
    }
  }, [user?.farmLocation, dispatch]);

  // Load cached plans on mount for offline support
  React.useEffect(() => {
    const loadCachedPlans = async () => {
      try {
        const cachedPlans = await irrigationPlansCache.loadPlans();
        if (cachedPlans && cachedPlans.length > 0) {
          dispatch(loadPlansFromCache(cachedPlans));
          console.log(
            `📦 [Dashboard] Loaded ${cachedPlans.length} plans from cache on mount`,
          );
        }
      } catch (error) {
        console.error('Error loading cached plans:', error);
      }
    };

    loadCachedPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only load once on mount - don't reload on every focus
  React.useEffect(() => {
    console.log('📱 [Dashboard] Component mounted, loading data once');

    // Only load if not already loaded
    if (!hasLoadedRef.current && !isLoadingRef.current) {
      const timeoutId = setTimeout(() => {
        loadDashboardData();
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

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

      // Handle different response formats
      let weatherData: WeatherResponse | null = null;

      // Check if response is direct weather data (has main, weather, and name properties)
      if (
        response &&
        typeof response === 'object' &&
        'main' in response &&
        'weather' in response &&
        'name' in response
      ) {
        weatherData = response as unknown as WeatherResponse;
      } else if (
        response.data &&
        typeof response.data === 'object' &&
        'main' in response.data &&
        'weather' in response.data
      ) {
        weatherData = response.data as WeatherResponse;
      } else if (
        response.Data &&
        typeof response.Data === 'object' &&
        'main' in response.Data &&
        'weather' in response.Data
      ) {
        weatherData = response.Data as WeatherResponse;
      }

      if (
        weatherData &&
        response.success !== false &&
        response.Success !== false
      ) {
        setWeather(weatherData);
      } else {
        // Error response
        console.error(
          'Weather API error:',
          response.message || response.Message || 'Unknown error',
        );
        setWeather(null);
      }
    } catch (error: any) {
      console.error('Error refreshing weather:', error);
      setWeather(null);
      showCustomFlash(
        error.message || 'Could not fetch weather data.',
        'danger',
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  // Calculate stats from irrigation plans API
  // Active Plans: Count only plans where isActive === true
  const activePlansCount = plans.filter(plan => plan.isActive === true).length;

  // Today Buckets: Sum waterAmountLiters from schedules where isToday === true, convert to buckets (15L per bucket)
  const totalWaterBuckets = plans.reduce((totalBuckets, plan) => {
    if (!plan.schedules || !Array.isArray(plan.schedules)) return totalBuckets;
    const todayWaterLiters = plan.schedules
      .filter(schedule => schedule.isToday === true)
      .reduce((sum, schedule) => sum + (schedule.waterAmountLiters || 0), 0);
    // Convert liters to buckets (15L per bucket)
    return totalBuckets + Math.round(todayWaterLiters / 15);
  }, 0);

  // Pending Tasks: Sum pendingSchedules from all plans
  const pendingTasks = plans.reduce(
    (sum, plan) => sum + (plan.summary?.pendingSchedules || 0),
    0,
  );

  // Completion Rate: Average completion rate across all plans
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

          {/* Quick Stats - 2x2 Grid */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              {t('home.quickStats') || 'QUICK STATS'}
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statRow}>
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
                    value={totalWaterBuckets}
                    icon="💧"
                    color="#10B981"
                  />
                </View>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statCardWrapper}>
                  <StatCard
                    title={t('home.pendingTasks')}
                    value={pendingTasks}
                    icon="⏳"
                    color="#F59E0B"
                  />
                </View>
                <View style={styles.statCardWrapper}>
                  <StatCard
                    title={t('home.completionRate')}
                    value={`${Math.round(completionRate)}%`}
                    icon="📈"
                    color="#8B5CF6"
                  />
                </View>
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
          {plans.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: themeColors.text }]}
                >
                  {t('home.irrigationPlans') || 'IRRIGATION PLANS'}
                </Text>
                {isOffline && (
                  <Text
                    style={[
                      styles.offlineBadge,
                      { color: themeColors.secondaryText },
                    ]}
                  >
                    📦 Offline
                  </Text>
                )}
              </View>
              <View style={styles.plansContainer}>
                {plans.map(plan => (
                  <IrrigationPlanCard
                    key={plan.id}
                    plan={plan}
                    navigation={undefined}
                  />
                ))}
              </View>
            </View>
          )}
          {plansLoading && plans.length === 0 && (
            <View style={styles.section}>
              <ActivityIndicator
                size="large"
                color={themeColors.primary}
                style={styles.loadingIndicator}
              />
            </View>
          )}
          {plansError && plans.length === 0 && !plansLoading && (
            <View style={styles.section}>
              <Text style={[styles.errorText, { color: '#EF4444' }]}>
                {plansError}
              </Text>
            </View>
          )}

          {/* Recent Analysis History */}
          {history.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                {t('home.recentAnalysis') || 'RECENT ANALYSIS HISTORY'}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalScrollContent}
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
    paddingHorizontal: widthPixel(16),
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
  },
  sectionTitle: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.bold,
    marginBottom: heightPixel(12),
    textTransform: 'uppercase',
  },
  statsGrid: {
    gap: heightPixel(12),
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: widthPixel(12),
  },
  statCardWrapper: {
    flex: 1,
  },
  emptyState: {
    padding: heightPixel(40),
    alignItems: 'center',
    borderRadius: widthPixel(12),
  },
  emptyText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
  },
  horizontalScroll: {
    width: '100%',
  },
  horizontalScrollContent: {
    paddingRight: widthPixel(16),
    gap: widthPixel(12),
  },
  plansContainer: {
    gap: heightPixel(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(12),
  },
  offlineBadge: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
  },
  loadingIndicator: {
    paddingVertical: heightPixel(40),
  },
  errorText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    textAlign: 'center',
    paddingVertical: heightPixel(20),
  },
});

export default Index;
