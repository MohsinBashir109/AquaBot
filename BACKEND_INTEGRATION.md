# .NET Backend Integration Guide

## Overview

This project has been updated to use a .NET backend instead of Firebase for authentication. All Firebase dependencies have been removed and replaced with a custom API service.

## Changes Made

### 1. Removed Firebase Dependencies

- Removed all Firebase packages from `package.json`
- Deleted Firebase configuration files
- Removed Google Sign-in functionality
- Updated Android build configuration

### 2. Created New API Services

- **`src/service/apiConfig.ts`**: API configuration and type definitions
- **`src/service/apiService.ts`**: Main API service for HTTP requests
- **`src/service/authService.ts`**: Authentication service wrapper

### 3. Updated Authentication Services

- **`src/service/signUp.ts`**: Updated to use .NET backend
- **`src/service/login.ts`**: Updated to use .NET backend
- Removed Google Sign-in functionality from all screens

### 4. Updated UI Screens

- Removed Google Sign-in buttons from sign-in and sign-up screens
- Updated forgot password flow to use new backend
- Updated password reset functionality

## API Endpoints Required

Your .NET backend should implement the following endpoints:

### 1. User Registration

```
POST /api/auth/register
Content-Type: application/json

{
  "userName": "string (3-50 characters)",
  "email": "string (valid email format)",
  "password": "string (min 6 chars, must contain uppercase, lowercase, and number)"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "userName": "username",
      "email": "user@example.com"
    }
  }
}
```

### 2. User Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "userName": "username",
      "email": "user@example.com"
    }
  }
}
```

### 3. Forgot Password

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "string"
}

Response:
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

### 4. Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "string",
  "newPassword": "string"
}

Response:
{
  "success": true,
  "message": "Password updated successfully"
}
```

## Configuration

### 1. Update API Base URL

In `src/service/apiConfig.ts`, update the `BASE_URL` with your actual API endpoint:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com/api', // Replace with your actual API URL
  // ... rest of config
};
```

### 2. Install Dependencies

Run the following command to install the updated dependencies:

```bash
npm install
# or
yarn install
```

### 3. Clean Build (Android)

For Android, clean and rebuild the project:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Error Handling

The API service includes comprehensive error handling:

- Network timeouts (10 seconds)
- HTTP error responses
- JSON parsing errors
- User-friendly error messages

## Session Management

User sessions are managed using AsyncStorage:

- User data and JWT tokens are stored locally
- Automatic session restoration on app restart
- Secure logout functionality

## Testing

To test the integration:

1. Update the `BASE_URL` in `apiConfig.ts`
2. Ensure your .NET backend is running
3. Test registration, login, and password reset flows
4. Verify session persistence across app restarts

## Security Notes

- JWT tokens are stored securely in AsyncStorage
- All API requests include proper error handling
- Password validation follows the specified requirements
- Network requests have timeout protection

## Troubleshooting

### Common Issues:

1. **Network Errors**: Check if the API base URL is correct and accessible
2. **CORS Issues**: Ensure your .NET backend allows requests from your app
3. **Token Issues**: Verify JWT token format and expiration
4. **Build Errors**: Clean and rebuild the project after dependency changes

### Debug Mode:

Enable console logging by checking the browser/app console for detailed error messages.

## Support

If you encounter any issues with the integration, check:

1. API endpoint responses match the expected format
2. Network connectivity
3. Backend server status
4. Console logs for detailed error information
