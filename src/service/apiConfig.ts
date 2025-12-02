// API Configuration for .NET Backend
// const BASE_URL = 'http://172.27.168.240:5065/api'; // Hotspot/WiFi network IP (PHYSICAL DEVICE) - CURRENT
// const BASE_URL = 'http://172.17.254.58:5065/api'; // Office network IP (PHYSICAL DEVICE)
// const BASE_URL = 'http://192.168.2.11:5065/api'; // Home network IP (PHYSICAL DEVICE)
// const BASE_URL = 'http://localhost:5065/api'; // For iOS Simulator
// const BASE_URL = 'http://10.0.2.2:5065/api'; // For Android Emulator
// const BASE_URL = 'http://DESKTOP-0DDVPED:5065/api'; // Physical device with hostname
// const BASE_URL = 'https://conflictedly-vigorly-katia.ngrok-free.dev/api';
const BASE_URL = 'https://conflictedly-vigorless-katia.ngrok-free.dev/api';

// Log the configured URL when module loads
console.log('🔧 [API Config] Base URL configured:', BASE_URL);
console.log('⚠️ [API Config] Make sure:');
console.log('   1. API server is running on localhost:5065');
console.log(
  '   2. You are using Android Emulator (10.0.2.2 points to host machine localhost)',
);
console.log('   3. For physical device, change to your computer IP address');
console.log(
  '   4. API should be accessible at http://localhost:5065/api on your computer',
);

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 10000, // 10 seconds timeout
  // Enable verbose logging for debugging (set to false in production)
  ENABLE_VERBOSE_LOGGING: __DEV__, // Automatically true in development, false in production
  ENDPOINTS: {
    // Authentication
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',

    // Image Analysis
    IMAGE_ANALYSIS: '/ImageAnalysis/analyze-and-plan',
    // UPLOAD_IMAGE: '/ImageAnalysis/upload',

    // // Weather
    // CURRENT_WEATHER: '/Weather/current',
    // WEATHER_FORECAST: '/Weather/forecast',

    // // Irrigation Planning
    // CREATE_IRRIGATION_PLAN: '/IrrigationPlan/create',
    // GET_IRRIGATION_PLANS: '/IrrigationPlan/user-plans',

    // Chat Assistant
    CHAT_SEND_TEXT: '/Aquachatbot',
  },
};

// API Response Types
export interface ApiResponse<T = any> {
  Success: boolean;
  Message: string;
  MessageEnglish?: string;
  ErrorCode?: string;
  Data?: T;
  Errors?: string[];
  Token?: string;
  User?: any;
  // Also support lowercase for backward compatibility
  success?: boolean;
  message?: string;
  messageEnglish?: string;
  errorCode?: string;
  data?: T;
  errors?: string[];
  token?: string;
  user?: any;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    userName: string;
    email: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}
