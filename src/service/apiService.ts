import {
  API_CONFIG,
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './apiConfig';
import { showCustomFlash } from '../utils/flash';
import { authService } from './authService';
import {
  TodayTasksResponse,
  IrrigationPlanDetailsDto,
  WeatherResponse,
  AnalysisHistoryItem,
  CompleteTaskRequest,
} from '../types/dashboard.types';

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Test connectivity to backend (DEPRECATED - no longer used automatically)
  // This was causing unnecessary API calls before every registration.
  // Keep for manual testing if needed.
  async testConnection(): Promise<boolean> {
    console.log(
      '[API WARNING] testConnection called - this creates an extra API call. Should only be used for manual testing.',
    );
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 3000);
      });

      const fetchPromise = fetch(`${this.baseURL}/Auth/register`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await Promise.race([fetchPromise, timeoutPromise]);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    const requestId = `${method} ${endpoint} - ${Date.now()}`;

    try {
      // Log request details
      const requestPayload: any = {};
      if (options.body) {
        try {
          requestPayload.body = JSON.parse(options.body as string);
        } catch {
          requestPayload.body = options.body;
        }
      }

      console.log(`[API REQUEST] ${requestId}`);
      console.log(`URL: ${url}`);
      console.log(`Method: ${method}`);
      console.log(
        `Payload:`,
        JSON.stringify(requestPayload.body || {}, null, 2),
      );
      console.log(`Headers:`, JSON.stringify(options.headers || {}, null, 2));

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

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.log(`[API TIMEOUT] ${requestId}`);
          reject(new Error('Request timeout'));
        }, this.timeout);
      });

      const fetchPromise = fetch(url, config);
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const textResponse = await response.text();
        console.log(`[API RESPONSE - TEXT] ${requestId}`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Response:`, textResponse);
        throw new Error(`Invalid JSON response: ${textResponse}`);
      }

      // Log response details
      console.log(`[API RESPONSE] ${requestId}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Response:`, JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.log(`[API ERROR] ${requestId} - Request failed`);
        const error = new Error(
          data.MessageEnglish ||
            data.messageEnglish ||
            data.Message ||
            data.message ||
            data.title ||
            `HTTP error! status: ${response.status}`,
        );
        (error as any).response = { data };
        throw error;
      }

      console.log(
        `[API SUCCESS] ${requestId} - Request completed successfully`,
      );
      return data;
    } catch (error: any) {
      console.log(`[API FAILED] ${requestId}`);
      console.log(`Error:`, error.message || error);
      if (error.response?.data) {
        console.log(
          `Error Response Data:`,
          JSON.stringify(error.response.data, null, 2),
        );
      }
      if (error.message === 'Request timeout') {
        const timeoutError = new Error(
          'Request timeout. Please check your internet connection.',
        );
        throw timeoutError;
      }
      throw error;
    }
  }

  // Register new user
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.makeRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify(userData),
        },
      );

      // Flash message will be shown by the UI after loader completes
      return response;
    } catch (error: any) {
      // Flash message will be shown by the UI after loader completes
      throw error;
    }
  }

  // Change password
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    try {
      // Get auth token for authorization header
      const token = await authService.getAuthToken();
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        },
      );

      // Flash message will be shown by the UI
      return response;
    } catch (error: any) {
      // Flash message will be shown by the UI
      throw error;
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.makeRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
        },
      );

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );

      if (response.success) {
        showCustomFlash(
          response.message || 'Password reset instructions sent to your email.',
          'success',
        );
      } else {
        showCustomFlash(
          response.message || 'Failed to send reset instructions.',
          'danger',
        );
      }

      return response;
    } catch (error: any) {
      showCustomFlash(
        error.message || 'Failed to send reset instructions.',
        'danger',
      );
      throw error;
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.RESET_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );

      if (response.success) {
        showCustomFlash(
          response.message || 'Password updated successfully!',
          'success',
        );
      } else {
        showCustomFlash(
          response.message || 'Failed to reset password.',
          'danger',
        );
      }

      return response;
    } catch (error: any) {
      showCustomFlash(error.message || 'Failed to reset password.', 'danger');
      throw error;
    }
  }

  // Dashboard API Methods

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<any>> {
    try {
      const token = await authService.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      return await this.makeRequest('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  // Get today's tasks
  async getTodayTasks(): Promise<ApiResponse<TodayTasksResponse>> {
    try {
      const token = await authService.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      return await this.makeRequest<TodayTasksResponse>(
        '/imageanalysis/today',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      throw error;
    }
  }

  // Get weather data
  async getWeather(city: string): Promise<ApiResponse<WeatherResponse>> {
    try {
      const token = await authService.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      return await this.makeRequest<WeatherResponse>(`/weather/${city}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  // Get irrigation plans
  async getMyIrrigationPlans(): Promise<
    ApiResponse<IrrigationPlanDetailsDto[]>
  > {
    try {
      const token = await authService.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      return await this.makeRequest<IrrigationPlanDetailsDto[]>(
        '/irrigationplan/my-plans',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      throw error;
    }
  }

  // Get analysis history
  async getAnalysisHistory(): Promise<ApiResponse<AnalysisHistoryItem[]>> {
    try {
      const token = await authService.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      return await this.makeRequest<AnalysisHistoryItem[]>(
        '/imageanalysis/history',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      throw error;
    }
  }

  // Complete task
  async completeTask(data: CompleteTaskRequest): Promise<ApiResponse> {
    try {
      const token = await authService.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await this.makeRequest('/irrigationplan/complete', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.success) {
        showCustomFlash('Task completed successfully!', 'success');
      }

      return response;
    } catch (error: any) {
      showCustomFlash('Failed to complete task', 'danger');
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
