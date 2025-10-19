# Field Image Analysis Feature

## Overview

The Field Image Analysis feature allows farmers to upload photos of their fields and receive AI-powered irrigation recommendations.

## Location

The feature is implemented in the **Government Guidelines** screen, accessible from the bottom tab navigation.

## Features

### 1. Image Upload

- **Camera**: Take a photo directly from the camera
- **Gallery**: Select an existing image from the device gallery
- Supports JPEG and PNG formats (max 10MB)

### 2. Optional Form Fields

- **Crop Name**: e.g., Wheat, Rice, Corn
- **Field Name**: e.g., North Field
- **Field Area**: Size in square meters

### 3. AI Analysis Results

#### Immediate Action Card

- **Water urgency level**: High, Medium, or Low (color-coded)
- **Water amounts**: Displayed in buckets (15L), cans (10L), and total liters
- **Simple instructions**: Clear, actionable recommendations

#### Field Information

- Crop type and health status
- Soil condition and moisture percentage
- Current temperature and weather
- Field location and area

#### Irrigation Schedule

- 6-day irrigation plan with daily recommendations
- Each day shows:
  - Date and urgency level
  - Water amount needed
  - Expected temperature and weather

### 4. Analysis Confidence

- Displays ML model confidence percentage
- Higher confidence means more accurate recommendations

## Technical Details

### API Endpoint

```
POST /api/ImageAnalysis/analyze-and-plan
```

### Request Format (FormData)

```javascript
{
  Image: File,                    // Required
  CropName?: string,              // Optional
  FieldAreaM2?: number,           // Optional
  FieldName?: string,             // Optional
  CropPlantedDate?: string,       // Optional
  Latitude?: number,              // Optional
  Longitude?: number              // Optional
}
```

### Response Format

```json
{
  "success": true,
  "message": "Immediate watering needed for Wheat",
  "immediateAction": {
    "needWaterNow": true,
    "waterAmountLiters": 450.5,
    "waterAmountBuckets": 30,
    "waterAmountCans": 45,
    "urgencyLevel": "High",
    "simpleInstruction": "Your Wheat needs water today. Apply 30 buckets."
  },
  "fieldInfo": {
    "soilCondition": "Dry",
    "soilMoisture": 35,
    "cropType": "Wheat",
    "cropHealth": "Good",
    "fieldAreaM2": 1500,
    "location": "Lahore",
    "temperature": 32.5,
    "weather": "Clear"
  },
  "irrigationSchedule": {
    "planId": 123,
    "totalDays": 6,
    "nextIrrigationDate": "2024-10-20T00:00:00Z",
    "upcomingIrrigations": [...]
  },
  "analysisId": 456,
  "confidence": 85.5,
  "analyzedAt": "2024-10-19T12:30:00Z"
}
```

## Files Created/Modified

### New Files

1. `src/types/imageAnalysis.types.ts` - TypeScript type definitions
2. `src/service/imageAnalysisService.ts` - API service for image analysis

### Modified Files

1. `src/screens/HomeStack/GovernmentGuidelines/Index.tsx` - Main screen implementation
2. `src/utils/flash.tsx` - Added 'warning' flash type
3. `src/components/ThemeComponents/CustomFlash.tsx` - Added warning styling
4. `src/service/apiConfig.ts` - Added IMAGE_ANALYSIS endpoint
5. `android/app/src/main/AndroidManifest.xml` - Added camera and storage permissions
6. `package.json` - Added react-native-image-picker dependency

## Dependencies

- `react-native-image-picker` - For image selection from camera/gallery

## Permissions Required

### Android

- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- READ_MEDIA_IMAGES

### iOS (if needed in future)

Add to Info.plist:

- NSCameraUsageDescription
- NSPhotoLibraryUsageDescription

## Usage Flow

1. User opens "Guidelines" tab
2. Taps on image picker area
3. Selects image source (Camera or Gallery)
4. Optionally fills in crop details
5. Taps "Analyze Field" button
6. System uploads image to backend
7. AI analyzes the image
8. Results displayed in beautiful cards
9. User can view irrigation schedule and take immediate action

## Color Coding

- **High Urgency**: Red (#FF4444)
- **Medium Urgency**: Orange (#FFA500)
- **Low Urgency**: Green (#4CAF50)

## Error Handling

- No image selected warning
- API connection errors
- Invalid image format warnings
- File size limit enforcement (10MB)

## Future Enhancements

- GPS location integration
- Save analysis history
- Compare multiple field analyses
- Export irrigation plan as PDF
- Push notifications for irrigation reminders
