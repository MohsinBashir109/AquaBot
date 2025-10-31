// API Configuration for .NET Backend
export const API_CONFIG = {
  // BASE_URL: 'http://localhost:5065/api',
  // BASE_URL: 'http://192.168.2.11:5065/api', // Physical device with host IP
  // BASE_URL: 'http://DESKTOP-0DDVPED:5065/api', // Physical device with hostname
  BASE_URL: 'http://10.0.2.2:5065/api', // Android emulator
  TIMEOUT: 10000, // 10 seconds timeout
  // Enable verbose logging for debugging (set to false in production)
  ENABLE_VERBOSE_LOGGING: __DEV__, // Automatically true in development, false in production
  ENDPOINTS: {
    // Authentication
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',

    // Image Analysis
    IMAGE_ANALYSIS: '/ImageAnalysis/analyze-and-plan',
    // UPLOAD_IMAGE: '/ImageAnalysis/upload',

    // // Weather
    // CURRENT_WEATHER: '/Weather/current',
    // WEATHER_FORECAST: '/Weather/forecast',

    // // Irrigation Planning
    // CREATE_IRRIGATION_PLAN: '/IrrigationPlan/create',
    // GET_IRRIGATION_PLANS: '/IrrigationPlan/user-plans',

    // // Assistant
    // CHAT_ASSISTANT: '/Assistant/chat',
    // VOICE_ASSISTANT: '/Assistant/voice',
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
