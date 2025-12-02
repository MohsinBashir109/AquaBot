import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import HomeWrapper from '../../../../Wrappers/HomeWrapper';
import { fontPixel, heightPixel, widthPixel } from '../../../utils/constants';
import { fontFamilies } from '../../../utils/fontfamilies';
import { colors } from '../../../utils/colors';
import { useThemeContext } from '../../../theme/ThemeContext';
import Button from '../../../components/ThemeComponents/ThemeButton';
import ThemeText from '../../../components/ThemeComponents/ThemeText';
import { imageAnalysisService } from '../../../service/imageAnalysisService';
import { AnalyzeAndPlanResponse, IrrigationScheduleItem } from '../../../types/imageAnalysis.types';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { showCustomFlash } from '../../../utils/flash';
import { UserHeader } from '../../../components/Header';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../store/hooks';
import { setScheduleItems, setLoading as setScheduleLoading } from '../../../store/irrigationScheduleSlice';

const Index = () => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeAndPlanResponse | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Form fields
  const [cropName, setCropName] = useState('');
  const [fieldArea, setFieldArea] = useState('');
  const [fieldName, setFieldName] = useState('');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: t('analyze.cameraPermission'),
            message: t('analyze.cameraPermissionMessage'),
            buttonNeutral: t('analyze.askMeLater'),
            buttonNegative: t('common.cancel'),
            buttonPositive: t('analyze.ok'),
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;

        // Android 13+ (API 33+) uses READ_MEDIA_IMAGES
        if (apiLevel >= 33) {
          const granted = await PermissionsAndroid.request(
            'android.permission.READ_MEDIA_IMAGES' as any,
            {
              title: t('analyze.galleryPermission'),
              message: t('analyze.galleryPermissionMessage'),
              buttonNeutral: t('analyze.askMeLater'),
              buttonNegative: t('common.cancel'),
              buttonPositive: t('analyze.ok'),
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // For older Android versions, use READ_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: t('analyze.galleryPermission'),
              message: t('analyze.galleryPermissionMessage'),
              buttonNeutral: t('analyze.askMeLater'),
              buttonNegative: t('common.cancel'),
              buttonPositive: t('analyze.ok'),
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

  const openCamera = useCallback(async () => {
    // For Android 13+, react-native-image-picker handles permissions automatically
    // Only manually request for older Android versions
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          t('analyze.permissionDenied'),
          t('analyze.cameraPermissionRequired'),
        );
        return;
      }
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          // User cancelled - no action needed
          return;
        } else if (response.errorCode) {
          // Handle specific error codes
          let errorMessage = t('analyze.failedToOpenCamera');
          if (response.errorCode === 'permission') {
            errorMessage = t('analyze.cameraPermissionError');
          } else if (response.errorMessage) {
            errorMessage = response.errorMessage;
          }
          Alert.alert(t('analyze.error'), errorMessage);
        } else if (response.assets && response.assets[0]) {
          setSelectedImage(response.assets[0]);
          setAnalysisResult(null);
        }
      },
    );
  }, []);

  const openGallery = useCallback(async () => {
    // For Android 13+, react-native-image-picker handles permissions automatically
    // Only manually request for older Android versions
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        Alert.alert(
          t('analyze.permissionDenied'),
          t('analyze.galleryPermissionRequired'),
        );
        return;
      }
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          // User cancelled - no action needed
          return;
        } else if (response.errorCode) {
          // Handle specific error codes
          let errorMessage = t('analyze.failedToPickImage');
          if (response.errorCode === 'permission') {
            errorMessage = t('analyze.galleryPermissionError');
          } else if (response.errorMessage) {
            errorMessage = response.errorMessage;
          }
          Alert.alert(t('analyze.error'), errorMessage);
        } else if (response.assets && response.assets[0]) {
          setSelectedImage(response.assets[0]);
          setAnalysisResult(null);
        } else {
          // No assets but no error - might be a permission issue
          Alert.alert(
            t('analyze.error'),
            t('analyze.noImageSelected'),
          );
        }
      },
    );
  }, []);

  const pickImage = useCallback(() => {
    // Prevent multiple simultaneous calls
    if (isPickerOpen) {
      return;
    }

    setIsPickerOpen(true);
    Alert.alert(
      t('analyze.selectImage'),
      t('analyze.chooseImageSource'),
      [
        {
          text: t('analyze.camera'),
          onPress: () => {
            setIsPickerOpen(false);
            openCamera();
          },
        },
        {
          text: t('analyze.gallery'),
          onPress: () => {
            setIsPickerOpen(false);
            openGallery();
          },
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => {
            setIsPickerOpen(false);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          setIsPickerOpen(false);
        },
      },
    );
  }, [isPickerOpen, openCamera, openGallery]);

  const handleAnalyze = async () => {
    if (!selectedImage) {
      showCustomFlash(t('analyze.selectImageFirst'), 'warning');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add image
      const imageData = {
        uri:
          Platform.OS === 'android'
            ? selectedImage.uri
            : selectedImage.uri.replace('file://', ''),
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || 'field-image.jpg',
      };

      formData.append('Image', imageData as any);

      // Add optional fields
      if (cropName) {
        formData.append('CropName', cropName);
      }
      if (fieldArea) {
        formData.append('FieldAreaM2', fieldArea);
      }
      if (fieldName) {
        formData.append('FieldName', fieldName);
      }

      console.log('🚀 [ImageAnalysis] Starting analysis...');
      console.log(
        '⏰ [ImageAnalysis] API call started at:',
        new Date().toISOString(),
      );

      const result = await imageAnalysisService.analyzeAndPlan(formData);

      console.log(
        '⏰ [ImageAnalysis] API call completed at:',
        new Date().toISOString(),
      );

      // Log the complete response received in UI
      console.log('📱 [ImageAnalysis] UI received response:', result);

      // Check if result is an array (new format) or object (old format)
      let scheduleItems: IrrigationScheduleItem[] = [];
      
      if (Array.isArray(result)) {
        // New format: Direct array of irrigation schedule items
        console.log('📋 [ImageAnalysis] Received array format, storing in Redux');
        scheduleItems = result as IrrigationScheduleItem[];
        dispatch(setScheduleItems(scheduleItems));
        dispatch(setScheduleLoading(false));
        showCustomFlash(t('analyze.irrigationScheduleLoaded'), 'success');
        console.log('✅ [ImageAnalysis] Stored', scheduleItems.length, 'schedule items in Redux');
      } else if (result && typeof result === 'object') {
        // Old format: AnalyzeAndPlanResponse object
        console.log('📋 [ImageAnalysis] Received object format');
        
        // Log the complete response received in UI
        console.log('📱 [ImageAnalysis] UI received response:', {
          success: result.success,
          message: result.message,
          analysisId: result.analysisId,
          confidence: result.confidence,
          hasImmediateAction: !!result.immediateAction,
          hasFieldInfo: !!result.fieldInfo,
          hasIrrigationSchedule: !!result.irrigationSchedule,
        });

        // Log detailed UI response data
        console.log('🎯 [ImageAnalysis] UI Response Data:');
        console.log('- Success:', result.success);
        console.log('- Message:', result.message);
        console.log('- Analysis ID:', result.analysisId);
        console.log('- Confidence:', result.confidence);

        if (result.immediateAction) {
          console.log('- Immediate Action Data:', result.immediateAction);
        }

        if (result.fieldInfo) {
          console.log('- Field Info Data:', result.fieldInfo);
        }

        if (result.irrigationSchedule) {
          console.log('- Irrigation Schedule Data:', result.irrigationSchedule);
        }

        if (result.success) {
          setAnalysisResult(result);
          showCustomFlash(result.message, 'success');
          console.log('✅ [ImageAnalysis] Analysis completed successfully');
        } else {
          showCustomFlash(t('analyze.analysisFailed'), 'danger');
        }
      } else {
        console.error('❌ [ImageAnalysis] Unexpected response format:', typeof result);
        showCustomFlash(t('analyze.unexpectedResponseFormat'), 'danger');
      }
    } catch (error: any) {
      // Enhanced error logging for debugging
      console.error('❌ [ImageAnalysis] Analysis failed in UI:');
      console.error('❌ [ImageAnalysis] Error message:', error.message);
      console.error('❌ [ImageAnalysis] Error name:', error.name);
      console.error('❌ [ImageAnalysis] Error code:', error.code);
      console.error('❌ [ImageAnalysis] Full error object:', error);
      
      if (error.originalError) {
        console.error('❌ [ImageAnalysis] Original error:', error.originalError);
      }
      if (error.attemptedUrl) {
        console.error('❌ [ImageAnalysis] Attempted URL:', error.attemptedUrl);
      }

      // Show user-friendly error message
      const errorMessage = error.message || t('analyze.failedToAnalyzeImage');
      showCustomFlash(errorMessage, 'danger');
    } finally {
      console.log(
        '🏁 [ImageAnalysis] Analysis process completed, setting loading to false',
      );
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FFA500';
      case 'low':
        return '#4CAF50';
      default:
        return colors[isDark ? 'dark' : 'light'].primary;
    }
  };

  // Header handlers
  const handleSettingsPress = () => {
    navigation.navigate('Settings' as never);
  };

  return (
    <HomeWrapper>
      <UserHeader showDrawerButton={true} showBackButton={false} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemeText color="text" style={styles.title}>
          {t('analyze.title')}
        </ThemeText>
        <ThemeText color="desText" style={styles.subtitle}>
          {t('analyze.subtitle')}
        </ThemeText>

        {/* Image Selection */}
        <TouchableOpacity
          style={[
            styles.imagePickerContainer,
            { borderColor: colors[isDark ? 'dark' : 'light'].primary },
          ]}
          onPress={pickImage}
          activeOpacity={0.7}
          disabled={isPickerOpen || loading}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.selectedImage}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <ThemeText color="primary" style={styles.placeholderIcon}>
                📷
              </ThemeText>
              <ThemeText color="text" style={styles.placeholderText}>
                {t('analyze.tapToSelect')}
              </ThemeText>
              <ThemeText color="desText" style={styles.placeholderSubtext}>
                {t('analyze.cameraOrGallery')}
              </ThemeText>
            </View>
          )}
        </TouchableOpacity>

        {/* Optional Form Fields */}
        <View style={styles.formContainer}>
          <ThemeText color="text" style={styles.formLabel}>
            {t('analyze.cropName')}
          </ThemeText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors[isDark ? 'dark' : 'light'].white,
                color: colors[isDark ? 'dark' : 'light'].dark,
                borderWidth: 1,
                borderColor: colors[isDark ? 'dark' : 'light'].gray3,
              },
            ]}
            placeholder={t('analyze.cropPlaceholder')}
            placeholderTextColor={colors[isDark ? 'dark' : 'light'].gray2}
            value={cropName}
            onChangeText={setCropName}
          />

          <ThemeText color="text" style={styles.formLabel}>
            {t('analyze.fieldName')}
          </ThemeText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors[isDark ? 'dark' : 'light'].white,
                color: colors[isDark ? 'dark' : 'light'].dark,
                borderWidth: 1,
                borderColor: colors[isDark ? 'dark' : 'light'].gray3,
              },
            ]}
            placeholder={t('analyze.fieldNamePlaceholder')}
            placeholderTextColor={colors[isDark ? 'dark' : 'light'].gray2}
            value={fieldName}
            onChangeText={setFieldName}
          />

          <ThemeText color="text" style={styles.formLabel}>
            {t('analyze.fieldArea')}
          </ThemeText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors[isDark ? 'dark' : 'light'].white,
                color: colors[isDark ? 'dark' : 'light'].dark,
                borderWidth: 1,
                borderColor: colors[isDark ? 'dark' : 'light'].gray3,
              },
            ]}
            placeholder={t('analyze.fieldAreaPlaceholder')}
            placeholderTextColor={colors[isDark ? 'dark' : 'light'].gray2}
            value={fieldArea}
            onChangeText={setFieldArea}
            keyboardType="numeric"
          />
        </View>

        {/* Analyze Button */}
        <Button
          title={loading ? t('analyze.analyzingShort') : t('analyze.analyzeButton')}
          onPress={handleAnalyze}
          buttonStyle={styles.analyzeButton}
          bgColor="primary"
          textColor="white"
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors[isDark ? 'dark' : 'light'].primary}
            />
            <ThemeText color="primary" style={styles.loadingText}>
              {t('analyze.analyzing')}
            </ThemeText>
          </View>
        )}

        {/* Results */}
        {analysisResult && !loading && (
          <View style={styles.resultsContainer}>
            {/* Immediate Action Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors[isDark ? 'dark' : 'light'].white,
                  borderLeftColor: getUrgencyColor(
                    analysisResult.immediateAction.urgencyLevel,
                  ),
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <ThemeText color="text" style={styles.cardTitle}>
                  {t('analyze.immediateAction')}
                </ThemeText>
                <View
                  style={[
                    styles.urgencyBadge,
                    {
                      backgroundColor: getUrgencyColor(
                        analysisResult.immediateAction.urgencyLevel,
                      ),
                    },
                  ]}
                >
                  <Text style={styles.urgencyText}>
                    {analysisResult.immediateAction.urgencyLevel}
                  </Text>
                </View>
              </View>

              <ThemeText color="text" style={styles.instructionText}>
                {analysisResult.immediateAction.simpleInstruction}
              </ThemeText>

              <View style={styles.waterInfoRow}>
                <View style={styles.waterInfoItem}>
                  <ThemeText color="desText" style={styles.waterLabel}>
                    {t('analyze.buckets')}
                  </ThemeText>
                  <ThemeText color="primary" style={styles.waterValue}>
                    {analysisResult.immediateAction.waterAmountBuckets}
                  </ThemeText>
                </View>
                <View style={styles.waterInfoItem}>
                  <ThemeText color="desText" style={styles.waterLabel}>
                    {t('analyze.cans')}
                  </ThemeText>
                  <ThemeText color="primary" style={styles.waterValue}>
                    {analysisResult.immediateAction.waterAmountCans}
                  </ThemeText>
                </View>
                <View style={styles.waterInfoItem}>
                  <ThemeText color="desText" style={styles.waterLabel}>
                    {t('analyze.totalLiters')}
                  </ThemeText>
                  <ThemeText color="primary" style={styles.waterValue}>
                    {analysisResult.immediateAction.waterAmountLiters.toFixed(
                      1,
                    )}
                    L
                  </ThemeText>
                </View>
              </View>
            </View>

            {/* Field Info Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: colors[isDark ? 'dark' : 'light'].white },
              ]}
            >
              <ThemeText color="text" style={styles.cardTitle}>
                {t('analyze.fieldInformation')}
              </ThemeText>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.cropType')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.cropType}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.soilCondition')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.soilCondition}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.soilMoisture')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.soilMoisture}%
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.cropHealth')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.cropHealth}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.temperature')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.temperature.toFixed(1)}°C
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.weather')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.weather}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.location')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.location}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    {t('analyze.fieldArea')}
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.fieldAreaM2} m²
                  </ThemeText>
                </View>
              </View>
            </View>

            {/* Irrigation Schedule Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: colors[isDark ? 'dark' : 'light'].white },
              ]}
            >
              <ThemeText color="text" style={styles.cardTitle}>
                {t('analyze.irrigationSchedule')} (
                {analysisResult.irrigationSchedule.totalDays} {t('analyze.days')})
              </ThemeText>

              {analysisResult.irrigationSchedule.upcomingIrrigations.map(
                (irrigation, index) => (
                  <View
                    key={index}
                    style={[
                      styles.scheduleItem,
                      {
                        backgroundColor:
                          colors[isDark ? 'dark' : 'light'].gray6,
                        borderLeftColor: getUrgencyColor(irrigation.urgency),
                      },
                    ]}
                  >
                    <View style={styles.scheduleHeader}>
                      <ThemeText color="text" style={styles.scheduleDate}>
                        {irrigation.dateDisplay}
                      </ThemeText>
                      <View
                        style={[
                          styles.scheduleUrgencyBadge,
                          {
                            backgroundColor: getUrgencyColor(
                              irrigation.urgency,
                            ),
                          },
                        ]}
                      >
                        <Text style={styles.scheduleUrgencyText}>
                          {irrigation.urgency}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.scheduleDetails}>
                      <ThemeText color="text" style={styles.scheduleDetailText}>
                        💧 {irrigation.waterBuckets} buckets (
                        {irrigation.waterLiters.toFixed(1)}L)
                      </ThemeText>
                      <ThemeText color="text" style={styles.scheduleDetailText}>
                        🌡️ {irrigation.expectedTemp.toFixed(1)}°C •{' '}
                        {irrigation.expectedWeather}
                      </ThemeText>
                    </View>
                  </View>
                ),
              )}
            </View>

            {/* Confidence Badge */}
            <View style={styles.confidenceContainer}>
              <ThemeText color="desText" style={styles.confidenceText}>
                {t('analyze.analysisConfidence')} {analysisResult.confidence.toFixed(1)}%
              </ThemeText>
            </View>
          </View>
        )}

        <View style={{ height: heightPixel(30) }} />
      </ScrollView>
    </HomeWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingTop: heightPixel(10),
    paddingBottom: heightPixel(20),
  },
  title: {
    fontSize: fontPixel(28),
    fontFamily: fontFamilies.bold,
    marginTop: heightPixel(10),
    marginBottom: heightPixel(8),
  },
  subtitle: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(20),
    lineHeight: fontPixel(20),
  },
  imagePickerContainer: {
    width: '100%',
    height: heightPixel(200),
    borderRadius: widthPixel(12),
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: heightPixel(20),
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: fontPixel(48),
    marginBottom: heightPixel(8),
  },
  placeholderText: {
    fontSize: fontPixel(16),
    fontFamily: fontFamilies.medium,
  },
  placeholderSubtext: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginTop: heightPixel(4),
  },
  formContainer: {
    marginBottom: heightPixel(20),
  },
  formLabel: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.medium,
    marginBottom: heightPixel(8),
    elevation: 1,
  },
  input: {
    height: heightPixel(45),
    borderRadius: widthPixel(8),
    paddingHorizontal: widthPixel(12),
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(15),
  },
  analyzeButton: {
    marginBottom: heightPixel(20),
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: heightPixel(30),
  },
  loadingText: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.medium,
    marginTop: heightPixel(10),
  },
  resultsContainer: {
    marginTop: heightPixel(10),
  },
  card: {
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(16),
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(12),
  },
  cardTitle: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
  },
  urgencyBadge: {
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(4),
    borderRadius: widthPixel(12),
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.semibold,
  },
  instructionText: {
    fontSize: fontPixel(15),
    fontFamily: fontFamilies.medium,
    marginBottom: heightPixel(16),
    lineHeight: fontPixel(22),
  },
  waterInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waterInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  waterLabel: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(4),
  },
  waterValue: {
    fontSize: fontPixel(18),
    fontFamily: fontFamilies.bold,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: heightPixel(12),
  },
  infoItem: {
    width: '50%',
    marginBottom: heightPixel(16),
  },
  infoLabel: {
    fontSize: fontPixel(12),
    fontFamily: fontFamilies.regular,
    marginBottom: heightPixel(4),
  },
  infoValue: {
    fontSize: fontPixel(15),
    fontFamily: fontFamilies.semibold,
  },
  scheduleItem: {
    borderRadius: widthPixel(8),
    padding: widthPixel(12),
    marginBottom: heightPixel(12),
    borderLeftWidth: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(8),
  },
  scheduleDate: {
    fontSize: fontPixel(14),
    fontFamily: fontFamilies.semibold,
  },
  scheduleUrgencyBadge: {
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(3),
    borderRadius: widthPixel(8),
  },
  scheduleUrgencyText: {
    color: '#FFFFFF',
    fontSize: fontPixel(10),
    fontFamily: fontFamilies.semibold,
  },
  scheduleDetails: {
    gap: heightPixel(4),
  },
  scheduleDetailText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.regular,
  },
  confidenceContainer: {
    alignItems: 'center',
    marginTop: heightPixel(10),
  },
  confidenceText: {
    fontSize: fontPixel(13),
    fontFamily: fontFamilies.medium,
  },
});
