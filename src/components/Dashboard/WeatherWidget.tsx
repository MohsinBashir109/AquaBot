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
import { WeatherResponse } from '../../types/dashboard.types';
import LinearGradient from 'react-native-linear-gradient';

interface WeatherWidgetProps {
  data: WeatherResponse | null;
  city: string;
  onRefresh?: () => void;
  loading?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  data,
  city,
  onRefresh,
  loading = false,
}) => {
  const { isDark } = useThemeContext();
  const themeColors = colors[isDark ? 'dark' : 'light'];

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'partly cloudy':
        return '🌤️';
      default:
        return '🌤️';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
        </LinearGradient>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.errorText}>Weather data unavailable</Text>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Text style={styles.refreshText}>⟳ Refresh</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    );
  }

  const weatherIcon = getWeatherIcon(data.weather[0]?.main || 'Clear');
  const weatherCondition = data.weather[0]?.main || 'Clear';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>WEATHER</Text>
            <Text style={styles.location}>{city}, Pakistan</Text>
          </View>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshIcon}>
              <Text style={styles.refreshIconText}>⟳</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.mainTempContainer}>
            <Text style={styles.temperature}>
              {Math.round(data.main.temp)}°C
            </Text>
            <View style={styles.conditionContainer}>
              <Text style={styles.weatherIcon}>{weatherIcon}</Text>
              <Text style={styles.condition}>{weatherCondition}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>
              Humidity: {data.main.humidity}%
            </Text>
            <Text style={styles.tempRange}>
              {Math.round(data.main.tempMin)}°C -{' '}
              {Math.round(data.main.tempMax)}
              °C
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: heightPixel(16),
    borderRadius: widthPixel(12),
    overflow: 'hidden',
    width: '100%',
    minHeight: heightPixel(200),
  },
  gradient: {
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    minHeight: heightPixel(200),
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: heightPixel(15),
  },
  title: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    marginBottom: heightPixel(4),
  },
  location: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  refreshIcon: {
    width: widthPixel(32),
    height: widthPixel(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIconText: {
    fontSize: fontPixel(18),
    color: '#FFFFFF',
  },
  content: {
    marginTop: heightPixel(10),
  },
  mainTempContainer: {
    marginBottom: heightPixel(15),
  },
  temperature: {
    fontSize: fontPixel(36),
    fontFamily: fontFamilies.bold,
    color: '#FFFFFF',
    marginBottom: heightPixel(8),
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
  },
  weatherIcon: {
    fontSize: fontPixel(20),
  },
  condition: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tempRange: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  errorText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: heightPixel(10),
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: widthPixel(8),
    alignSelf: 'center',
  },
  refreshText: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
    color: '#FFFFFF',
  },
});

export default WeatherWidget;
