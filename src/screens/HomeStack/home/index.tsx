import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';

import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import React, { useState, useCallback, useRef } from 'react';
import { UserHeader } from '../../../components/Header';
import { useLanguage } from '../../../context/LanguageContext';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import { useAppSelector } from '../../../store/hooks';
import { apiService } from '../../../service/apiService';
import { WeatherResponse } from '../../../types/dashboard.types';
import { showCustomFlash } from '../../../utils/flash';

// Dashboard Components
import WeatherWidget from '../../../components/Dashboard/WeatherWidget';
import IrrigationScheduleCard from '../../../components/Dashboard/IrrigationScheduleCard';

const Index = () => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const themeColors = colors[isDark ? 'dark' : 'light'];
  const { user } = useAppSelector(state => state.user);
  const { items: scheduleItems } = useAppSelector(
    state => state.irrigationSchedule,
  );

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const lastFarmLocationRef = useRef<string | undefined>(user?.farmLocation);

  const loadWeatherData = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log(
        '⏸️ [Dashboard] Already loading weather, skipping duplicate call',
      );
      return;
    }

    // Check if farm location actually changed
    const currentFarmLocation = user?.farmLocation;
    if (
      hasLoadedRef.current &&
      lastFarmLocationRef.current === currentFarmLocation &&
      weather
    ) {
      console.log(
        '⏸️ [Dashboard] Weather already loaded for this location, skipping',
      );
      return;
    }

    try {
      isLoadingRef.current = true;
      const city = user?.farmLocation || 'Lahore';

      console.log('🔄 [Dashboard] Loading weather data...', {
        city,
        previousLocation: lastFarmLocationRef.current,
      });

      const weatherRes = await Promise.allSettled([
        apiService.getWeather(city),
      ]);

      if (weatherRes[0].status === 'fulfilled') {
        // Handle both direct weather data and wrapped response
        const response = weatherRes[0].value;
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
    } catch (error: any) {
      console.error('Error loading weather data:', error);
    } finally {
      isLoadingRef.current = false;
      hasLoadedRef.current = true;
      lastFarmLocationRef.current = user?.farmLocation;
    }
  }, [user?.farmLocation, weather]);

  // Load weather on mount
  React.useEffect(() => {
    console.log('📱 [Dashboard] Component mounted, loading weather');

    // Only load if not already loaded
    if (!hasLoadedRef.current && !isLoadingRef.current) {
      const timeoutId = setTimeout(() => {
        loadWeatherData();
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
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
        error.message || t('home.couldNotFetchWeather'),
        'danger',
      );
    } finally {
      setWeatherLoading(false);
    }
  };

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

          {/* Irrigation Schedule */}
          {scheduleItems.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                {t('home.irrigationSchedule')}
              </Text>
              <View style={styles.scheduleContainer}>
                {scheduleItems.map((item, index) => (
                  <IrrigationScheduleCard
                    key={`${item.planId}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </View>
            </View>
          )}

          {scheduleItems.length === 0 && (
            <View style={styles.section}>
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyText,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  {t('home.noSchedule')}
                </Text>
              </View>
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
  scheduleContainer: {
    gap: heightPixel(8),
  },
});

export default Index;
