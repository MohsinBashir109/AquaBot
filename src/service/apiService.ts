import {
  API_CONFIG,
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './apiConfig';
import { showCustomFlash } from '../utils/flash';

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    console.log('🔧 ApiService initialized with:', {
      baseURL: this.baseURL,
      timeout: this.timeout,
    });
    console.log('🔧 API_CONFIG.BASE_URL from config:', API_CONFIG.BASE_URL);
  }

  // Test connectivity to backend
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing connection to backend...');
      console.log('🌐 Testing URL:', `${this.baseURL}/auth/register`);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });

      // Try a simple OPTIONS request to test connectivity
      const fetchPromise = fetch(`${this.baseURL}/auth/register`, {
        method: 'OPTIONS',
      });

      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;
      console.log('✅ Backend is reachable!', response.status);
      return true;
    } catch (error: any) {
      console.error('❌ Backend connection failed:', error.message);
      console.log(
        '🔧 Make sure your .NET backend is running on localhost:5065',
      );
      console.log('🔧 And configured to accept external connections');
      return false;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('🌐 Making HTTP request to:', url);

      const defaultHeaders = {
        'Content-Type': 'application/json',
      };

      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      console.log('📤 Request config:', {
        method: config.method,
        headers: config.headers,
        body: config.body,
        timeout: this.timeout,
      });

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), this.timeout);
      });

      // Make the fetch request
      const fetchPromise = fetch(url, config);

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      console.log(
        '📡 HTTP Response status:',
        response.status,
        response.statusText,
      );

      // Log response headers for debugging
      console.log(
        '📋 Response headers:',
        Object.fromEntries(response.headers.entries()),
      );

      let data;
      try {
        data = await response.json();
        console.log('📥 Response data:', data);
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        // Try to get text response instead
        const textResponse = await response.text();
        console.log('📄 Raw response text:', textResponse);
        throw new Error(`Invalid JSON response: ${textResponse}`);
      }

      if (!response.ok) {
        console.log('❌ HTTP Error - Status:', response.status);
        console.log('📋 Error Response Details:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          url: url,
        });

        // Show detailed validation errors if available
        if (data.errors) {
          console.log('🔍 Validation Errors:', data.errors);
        }

        // Create an error with the full response data
        const error = new Error(
          data.MessageEnglish ||
            data.messageEnglish ||
            data.Message ||
            data.message ||
            data.title ||
            `HTTP error! status: ${response.status}`,
        );
        // Attach the full response data to the error for proper handling
        (error as any).response = { data };
        throw error;
      }

      console.log('✅ HTTP Request successful');
      return data;
    } catch (error: any) {
      console.error('💥 API Request Error:', error);

      if (error.message === 'Request timeout') {
        console.log('⏰ Request timeout');
        throw new Error(
          'Request timeout. Please check your internet connection.',
        );
      }

      throw error;
    }
  }

  // Register new user
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    console.log('🌐 apiService.register called');
    console.log('🔗 API Config:', {
      baseURL: this.baseURL,
      endpoint: API_CONFIG.ENDPOINTS.REGISTER,
      fullURL: `${this.baseURL}${API_CONFIG.ENDPOINTS.REGISTER}`,
    });
    console.log('📤 Request data:', {
      userName: userData.userName,
      email: userData.email,
      password: userData.password ? '***' : 'empty',
    });

    try {
      const response = await this.makeRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify(userData),
        },
      );

      console.log('📥 API Response received:', response);
      console.log('📋 Full response details:', {
        success: response.success,
        message: response.message,
        data: response.data,
        errors: response.errors,
      });

      if (response.success) {
        console.log('✅ Registration API call successful');
        showCustomFlash(
          response.message || 'Success! Your account has been created.',
          'success',
        );
      } else {
        console.log('❌ Registration API call failed:', response.message);
        showCustomFlash(
          response.message || 'Registration failed. Please try again.',
          'danger',
        );
      }

      return response;
    } catch (error: any) {
      console.error('💥 apiService.register error:', error);
      showCustomFlash(
        error.message || 'Registration failed. Please try again.',
        'danger',
      );
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('🌐 apiService.login called');
    console.log('🔗 API Config:', {
      baseURL: this.baseURL,
      endpoint: API_CONFIG.ENDPOINTS.LOGIN,
      fullURL: `${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`,
    });
    console.log('📤 Request data:', {
      email: credentials.email,
      password: credentials.password ? '***' : 'empty',
    });

    try {
      const response = await this.makeRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        },
      );

      console.log('📥 Login API Response received:', response);
      console.log('📋 Full login response details:', {
        success: response.success,
        message: response.message,
        data: response.data,
        errors: response.errors,
      });

      if (response.success && response.data) {
        console.log('✅ Login API call successful');
        // Don't show flash message here - let the signin screen handle it
      } else {
        console.log('❌ Login API call failed:', response.message);
        // Don't show flash message here - let the signin screen handle it
      }

      return response;
    } catch (error: any) {
      console.error('💥 apiService.login error:', error);
      // Don't show flash message here - let the signin screen handle the specific error
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    console.log('🌐 apiService.forgotPassword called');
    console.log('📤 Request data:', { email: data.email });

    try {
      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );

      console.log('📥 Forgot Password API Response received:', response);
      console.log('📋 Full forgot password response details:', {
        success: response.success,
        message: response.message,
        data: response.data,
        errors: response.errors,
      });

      if (response.success) {
        console.log('✅ Forgot Password API call successful');
        showCustomFlash(
          response.message || 'Password reset instructions sent to your email.',
          'success',
        );
      } else {
        console.log('❌ Forgot Password API call failed:', response.message);
        showCustomFlash(
          response.message || 'Failed to send reset instructions.',
          'danger',
        );
      }

      return response;
    } catch (error: any) {
      console.error('💥 apiService.forgotPassword error:', error);
      showCustomFlash(
        error.message || 'Failed to send reset instructions.',
        'danger',
      );
      throw error;
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    console.log('🌐 apiService.resetPassword called');
    console.log('📤 Request data:', {
      email: data.email,
      newPassword: data.newPassword ? '***' : 'empty',
    });

    try {
      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.RESET_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );

      console.log('📥 Reset Password API Response received:', response);
      console.log('📋 Full reset password response details:', {
        success: response.success,
        message: response.message,
        data: response.data,
        errors: response.errors,
      });

      if (response.success) {
        console.log('✅ Reset Password API call successful');
        showCustomFlash(
          response.message || 'Password updated successfully!',
          'success',
        );
      } else {
        console.log('❌ Reset Password API call failed:', response.message);
        showCustomFlash(
          response.message || 'Failed to reset password.',
          'danger',
        );
      }

      return response;
    } catch (error: any) {
      console.error('💥 apiService.resetPassword error:', error);
      showCustomFlash(error.message || 'Failed to reset password.', 'danger');
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
