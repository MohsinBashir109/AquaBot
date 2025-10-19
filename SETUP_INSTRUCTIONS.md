# Setup Instructions for Image Analysis Feature

## What Was Implemented

✅ **Complete Field Image Analysis Screen** in the Government Guidelines tab with:

- Beautiful, modern UI using your theme colors
- Image picker (Camera & Gallery support)
- Optional form fields for crop details
- AI-powered analysis results display
- Irrigation schedule with color-coded urgency levels
- Real-time feedback with loading states

## Changes Made

### 1. Dependencies Installed

- ✅ `react-native-image-picker` - Already installed via npm

### 2. Files Created

- `src/types/imageAnalysis.types.ts` - TypeScript types for API
- `src/service/imageAnalysisService.ts` - API service layer
- `docs/IMAGE_ANALYSIS_FEATURE.md` - Complete feature documentation

### 3. Files Updated

- `src/screens/HomeStack/GovernmentGuidelines/Index.tsx` - Complete screen implementation
- `src/screens/HomeStack/index.tsx` - Fixed case sensitivity issue
- `src/utils/routes.ts` - Removed circular dependency
- `src/utils/flash.tsx` - Added 'warning' type support
- `src/components/ThemeComponents/CustomFlash.tsx` - Added warning styling
- `src/service/apiConfig.ts` - Added IMAGE_ANALYSIS endpoint
- `android/app/src/main/AndroidManifest.xml` - Added required permissions

## Next Steps

### 1. Link Native Dependencies (Required for Android)

Run this command to link the image picker:

```bash
npx react-native run-android
```

### 2. Test the Feature

1. Open the app
2. Navigate to the **"Guide"** tab (bottom navigation)
3. Tap the image picker area
4. Select Camera or Gallery
5. Take/select a field photo
6. Optionally fill in crop details
7. Tap **"Analyze Field"**
8. View the beautiful results!

### 3. Backend Requirements

Make sure your .NET backend is running on `localhost:5065` with the endpoint:

```
POST /api/ImageAnalysis/analyze-and-plan
```

If your backend is on a different port, update:

```typescript
// src/service/apiConfig.ts
BASE_URL: 'http://10.0.2.2:YOUR_PORT/api';
```

### 4. For Physical Device Testing

If testing on a physical Android device (not emulator), change the BASE_URL:

```typescript
// src/service/apiConfig.ts
BASE_URL: 'http://YOUR_COMPUTER_IP:5065/api';
// Example: 'http://192.168.1.100:5065/api'
```

## Troubleshooting

### Camera Permissions Issue

If camera doesn't work:

1. Manually enable camera permissions in device settings
2. Or request permissions programmatically (already handled by the library)

### Image Upload Fails

- Check backend is running
- Verify API endpoint URL
- Check authentication token is valid
- Ensure image is under 10MB

### Metro Bundler Cache Issues

If you see module resolution errors:

```bash
# Stop the current Metro bundler (Ctrl+C)
# Then run:
npx react-native start --reset-cache
```

### Build Errors

If you get build errors after installing image-picker:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## UI Features

### Color-Coded Urgency

- 🔴 **High**: Red - Water needed immediately
- 🟠 **Medium**: Orange - Water needed soon
- 🟢 **Low**: Green - Field is okay for now

### Cards Display

1. **Immediate Action Card**

   - Urgency level badge
   - Simple instruction
   - Water amounts (buckets, cans, liters)

2. **Field Info Card**

   - Crop type and health
   - Soil condition and moisture
   - Temperature and weather
   - Location and field area

3. **Irrigation Schedule Card**
   - 6-day irrigation plan
   - Daily water requirements
   - Expected weather conditions

## API Integration

The screen automatically:

- ✅ Gets auth token from storage
- ✅ Builds FormData with image and optional fields
- ✅ Handles loading states
- ✅ Shows success/error messages
- ✅ Displays results in beautiful cards
- ✅ Uses your existing theme colors

## Design Highlights

- Uses your existing color scheme (`colors.light.primary`, etc.)
- Consistent with your app's typography (`fontFamilies`)
- Responsive sizing with `fontPixel`, `heightPixel`, `widthPixel`
- Beautiful shadows and elevation
- Smooth scrolling experience
- Professional card-based layout

## Ready to Test! 🚀

The implementation is complete and ready to use. Just run:

```bash
npx react-native run-android
```

Then navigate to the "Guide" tab and start analyzing your fields!
