// API Configuration for .NET Backend
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:5065/api', // Android emulator - maps to localhost:5065
  ENDPOINTS: {
    REGISTER: '/Auth/register',
    LOGIN: '/Auth/login',
    FORGOT_PASSWORD: '/Auth/forgot-password',
    RESET_PASSWORD: '/Auth/reset-password',
  },
  TIMEOUT: 10000, // 10 seconds
};

// Debug log to verify config is loaded correctly
console.log('🔧 API_CONFIG loaded:', API_CONFIG);
console.log('🔧 BASE_URL:', API_CONFIG.BASE_URL);

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
  newPassword: string;
}
