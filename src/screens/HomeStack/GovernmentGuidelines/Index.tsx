import React, { useState } from 'react';
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
import { AnalyzeAndPlanResponse } from '../../../types/imageAnalysis.types';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { showCustomFlash } from '../../../utils/flash';
import { UserHeader } from '../../../components/Header';
import { useLanguage } from '../../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';

const Index = () => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeAndPlanResponse | null>(null);

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
            title: 'Camera Permission',
            message:
              'AquaBot needs access to your camera to take photos of your field.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
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
              title: 'Gallery Permission',
              message:
                'AquaBot needs access to your photos to analyze your field.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // For older Android versions, use READ_EXTERNAL_STORAGE
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Gallery Permission',
              message:
                'AquaBot needs access to your photos to analyze your field.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
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

  const pickImage = () => {
    Alert.alert('Select Image', 'Choose image source', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos. Please enable it in your device settings.',
      );
      return;
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
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.error(
            'Camera Error:',
            response.errorCode,
            response.errorMessage,
          );
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to open camera',
          );
        } else if (response.assets && response.assets[0]) {
          console.log('Image selected:', response.assets[0]);
          setSelectedImage(response.assets[0]);
          setAnalysisResult(null);
        }
      },
    );
  };

  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Gallery permission is required to select photos. Please enable it in your device settings.',
      );
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        selectionLimit: 1,
      },
      response => {
        console.log('📱 [ImagePicker] Response received:', {
          didCancel: response.didCancel,
          errorCode: response.errorCode,
          errorMessage: response.errorMessage,
          hasAssets: response.assets && response.assets.length > 0,
          assetCount: response.assets?.length || 0,
        });

        if (response.didCancel) {
          console.log('❌ [ImagePicker] User cancelled image picker');
        } else if (response.errorCode) {
          console.error('💥 [ImagePicker] Error occurred:', {
            errorCode: response.errorCode,
            errorMessage: response.errorMessage,
          });
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        } else if (response.assets && response.assets[0]) {
          const selectedAsset = response.assets[0];
          console.log('✅ [ImagePicker] Image selected successfully:', {
            uri: selectedAsset.uri,
            type: selectedAsset.type,
            fileName: selectedAsset.fileName,
            fileSize: selectedAsset.fileSize,
            width: selectedAsset.width,
            height: selectedAsset.height,
          });
          setSelectedImage(selectedAsset);
          setAnalysisResult(null);
          console.log(
            '🔄 [ImagePicker] UI state updated - analysis result cleared',
          );
        } else {
          console.log('⚠️ [ImagePicker] No assets in response');
        }
      },
    );
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      showCustomFlash('Please select an image first', 'warning');
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
        showCustomFlash('Analysis failed. Please try again.', 'danger');
      }
    } catch (error: any) {
      // Only show user-friendly error message, detailed logging is handled in service layer
      console.log('❌ [ImageAnalysis] Analysis failed:', error.message);

      showCustomFlash(
        error.message || 'Failed to analyze image. Please try again.',
        'danger',
      );
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
          title={loading ? 'Analyzing...' : t('analyze.analyzeButton')}
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
              Analyzing your field...
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
                  Immediate Action
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
                    Buckets (15L)
                  </ThemeText>
                  <ThemeText color="primary" style={styles.waterValue}>
                    {analysisResult.immediateAction.waterAmountBuckets}
                  </ThemeText>
                </View>
                <View style={styles.waterInfoItem}>
                  <ThemeText color="desText" style={styles.waterLabel}>
                    Cans (10L)
                  </ThemeText>
                  <ThemeText color="primary" style={styles.waterValue}>
                    {analysisResult.immediateAction.waterAmountCans}
                  </ThemeText>
                </View>
                <View style={styles.waterInfoItem}>
                  <ThemeText color="desText" style={styles.waterLabel}>
                    Total Liters
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
                Field Information
              </ThemeText>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Crop Type
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.cropType}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Soil Condition
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.soilCondition}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Soil Moisture
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.soilMoisture}%
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Crop Health
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.cropHealth}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Temperature
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.temperature.toFixed(1)}°C
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Weather
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.weather}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Location
                  </ThemeText>
                  <ThemeText color="text" style={styles.infoValue}>
                    {analysisResult.fieldInfo.location}
                  </ThemeText>
                </View>

                <View style={styles.infoItem}>
                  <ThemeText color="desText" style={styles.infoLabel}>
                    Field Area
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
                Irrigation Schedule (
                {analysisResult.irrigationSchedule.totalDays} days)
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
                Analysis Confidence: {analysisResult.confidence.toFixed(1)}%
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
    elevation: 5,
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
