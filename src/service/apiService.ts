import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {
  API_CONFIG,
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
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
  private axiosInstance;
  private workingURL: string | null = null; // Cache the working URL
  private urlAttemptIndex: number = 0; // Track which URL we're trying

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;

    // Create axios instance with default config
    // Note: We'll use full URLs in requests, so baseURL is optional
    this.axiosInstance = axios.create({
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Add request interceptor to log all outgoing requests
    this.axiosInstance.interceptors.request.use(
      config => {
        console.log('🔵 [AXIOS INTERCEPTOR] Request being sent:');
        console.log('🔵 [AXIOS] URL:', config.url);
        console.log('🔵 [AXIOS] Method:', config.method);
        console.log(
          '🔵 [AXIOS] Headers:',
          JSON.stringify(config.headers, null, 2),
        );
        console.log(
          '🔵 [AXIOS] Data:',
          config.data ? JSON.stringify(config.data, null, 2) : 'No data',
        );
        return config;
      },
      error => {
        console.error('🔴 [AXIOS INTERCEPTOR] Request error:', error);
        return Promise.reject(error);
      },
    );

    // Add response interceptor to log all responses
    this.axiosInstance.interceptors.response.use(
      response => {
        console.log('🟢 [AXIOS INTERCEPTOR] Response received:');
        console.log('🟢 [AXIOS] Status:', response.status);
        console.log('🟢 [AXIOS] Data:', JSON.stringify(response.data, null, 2));
        return response;
      },
      error => {
        console.error('🔴 [AXIOS INTERCEPTOR] Response error:');
        console.error('🔴 [AXIOS] Error message:', error.message);
        console.error('🔴 [AXIOS] Error code:', error.code);
        if (error.response) {
          console.error('🔴 [AXIOS] Response status:', error.response.status);
          console.error('🔴 [AXIOS] Response data:', error.response.data);
        }
        if (error.request) {
          console.error('🔴 [AXIOS] Request was made but no response received');
          console.error('🔴 [AXIOS] Request details:', error.request);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseURL;
  }

  /**
   * Try to find a working URL by testing all configured URLs
   * This enables automatic network detection across different networks
   */
  private async findWorkingURL(): Promise<string | null> {
    // If using ngrok, just return it
    if ((API_CONFIG as any).USE_NGROK && (API_CONFIG as any).NGROK_URL) {
      return (API_CONFIG as any).NGROK_URL;
    }

    // If we already found a working URL, use it
    if (this.workingURL) {
      return this.workingURL;
    }

    // If NETWORK_URLS doesn't exist, just use BASE_URL (no connectivity test needed)
    if (
      !(API_CONFIG as any).NETWORK_URLS ||
      !Array.isArray((API_CONFIG as any).NETWORK_URLS)
    ) {
      console.log(`✅ [API] Using configured BASE_URL: ${API_CONFIG.BASE_URL}`);
      return API_CONFIG.BASE_URL;
    }

    // Try all URLs in order (skip connectivity test to avoid 405 errors)
    const primaryUrl = (API_CONFIG as any).PRIMARY_URL || API_CONFIG.BASE_URL;
    const networkUrls = ((API_CONFIG as any).NETWORK_URLS as string[]) || [];
    const urlsToTry = [
      primaryUrl,
      ...networkUrls.filter((url: string) => url !== primaryUrl),
    ];

    console.log('🔍 [API] Available URLs:', urlsToTry);

    // Just return the primary URL without testing (testing causes 405 errors on POST-only endpoints)
    // The actual request will fail if the URL is wrong, and we'll handle that in makeRequest
    console.log(`✅ [API] Using primary URL: ${primaryUrl}`);
    this.workingURL = primaryUrl;
    this.baseURL = primaryUrl;
    return primaryUrl;
  }

  // Test connectivity to backend (DEPRECATED - no longer used automatically)
  // This was causing unnecessary API calls before every registration.
  // Keep for manual testing if needed.
  async testConnection(): Promise<boolean> {
    console.log(
      '[API WARNING] testConnection called - this creates an extra API call. Should only be used for manual testing.',
    );
    try {
      await this.axiosInstance.get('/Auth/register', {
        timeout: 3000,
      });
      return true;
    } catch (error: any) {
      return false;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
    retryCount: number = 0,
    urlIndex: number = 0,
  ): Promise<ApiResponse<T>> {
    // If this is the first attempt and we don't have a working URL, try to find one
    if (
      retryCount === 0 &&
      urlIndex === 0 &&
      !this.workingURL &&
      !(API_CONFIG as any).USE_NGROK
    ) {
      const workingUrl = await this.findWorkingURL();
      if (workingUrl) {
        this.baseURL = workingUrl;
      }
    }

    // Determine which URL to use
    let currentBaseURL = this.baseURL;
    if (!(API_CONFIG as any).USE_NGROK && !this.workingURL) {
      // If NETWORK_URLS doesn't exist, just use BASE_URL
      if (
        !(API_CONFIG as any).NETWORK_URLS ||
        !Array.isArray((API_CONFIG as any).NETWORK_URLS)
      ) {
        currentBaseURL = API_CONFIG.BASE_URL;
      } else {
        // Try URLs in order if we haven't found a working one
        const primaryUrl =
          (API_CONFIG as any).PRIMARY_URL || API_CONFIG.BASE_URL;
        const networkUrls =
          ((API_CONFIG as any).NETWORK_URLS as string[]) || [];
        const urlsToTry = [
          primaryUrl,
          ...networkUrls.filter((url: string) => url !== primaryUrl),
        ];
        if (urlIndex < urlsToTry.length) {
          currentBaseURL = urlsToTry[urlIndex];
          console.log(
            `🔄 [API] Attempting URL ${urlIndex + 1}/${
              urlsToTry.length
            }: ${currentBaseURL}`,
          );
        }
      }
    }

    const url = `${currentBaseURL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const requestId = `${method} ${endpoint} - ${Date.now()}`;

    try {
      // Always log the URL being called for debugging
      console.log(`🌐 [API] Calling: ${method} ${url}`);
      console.log(`🌐 [API] Base URL: ${currentBaseURL}`);
      console.log(`🌐 [API] Endpoint: ${endpoint}`);
      console.log(`🌐 [API] Full URL will be: ${currentBaseURL}${endpoint}`);

      // Merge headers - ensure Content-Type is always set for JSON requests
      const mergedHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      };

      // Log request details (always log for debugging network issues)
      console.log(`📤 [API REQUEST] ${requestId}`);
      console.log(`📤 [API] URL: ${url}`);
      console.log(`📤 [API] Method: ${method}`);
      console.log(`📤 [API] Headers:`, JSON.stringify(mergedHeaders, null, 2));
      if (options.data) {
        console.log(`📤 [API] Payload:`, JSON.stringify(options.data, null, 2));
      }
      console.log(
        `📤 [API] Axios instance baseURL:`,
        this.axiosInstance.defaults.baseURL,
      );
      console.log(`📤 [API] Making request now...`);

      // Make the request using axios
      // Construct full URL using currentBaseURL (not this.baseURL which might be outdated)
      const fullUrl = `${currentBaseURL}${endpoint}`.trim();
      console.log(`📤 [API] Final request URL: ${fullUrl}`);
      console.log(`📤 [API] Request config before axios:`, {
        url: fullUrl,
        method: method,
        hasData: !!options.data,
        headers: mergedHeaders,
      });

      // Use axios.post/get/put/delete directly based on method
      let response;
      const requestConfig: any = {
        url: fullUrl,
        method: method.toLowerCase(),
        headers: mergedHeaders,
        timeout: options.timeout || this.timeout,
        validateStatus: (status: number) => status < 500, // Don't throw on 4xx
      };

      if (options.data) {
        requestConfig.data = options.data;
      }
      if (options.params) {
        requestConfig.params = options.params;
      }

      console.log(
        `📤 [API] Calling axios with config:`,
        JSON.stringify(requestConfig, null, 2),
      );

      response = await this.axiosInstance.request<T>(requestConfig);

      console.log(`✅ [API] Request completed! Status: ${response.status}`);

      // Cache the working URL for future requests
      if (!this.workingURL && currentBaseURL) {
        this.workingURL = currentBaseURL;
        this.baseURL = currentBaseURL;
        console.log(`✅ [API] Cached working URL: ${currentBaseURL}`);
      }

      const data = response.data as ApiResponse<T>;

      // Log response details only if verbose logging is enabled
      if (API_CONFIG.ENABLE_VERBOSE_LOGGING) {
        console.log(`[API RESPONSE] ${requestId}`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Response:`, JSON.stringify(data, null, 2));
      }

      // If request failed with network/server error and we haven't retried yet, retry once
      if (response.status >= 500 && retryCount === 0) {
        console.log(
          `🔄 [ApiService] Request failed with status ${response.status}, retrying...`,
        );
        // Retry the request once
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      // Only log success if verbose logging is enabled
      if (API_CONFIG.ENABLE_VERBOSE_LOGGING) {
        console.log(
          `[API SUCCESS] ${requestId} - Request completed successfully`,
        );
      }
      return data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse<T>>;
      console.error(`❌ [API FAILED] ${requestId}`);
      console.error(
        `❌ [API] Error name:`,
        error.name || axiosError.name || 'Unknown',
      );
      console.error(`❌ [API] Error message:`, error.message || error);
      console.error(
        `❌ [API] Error code:`,
        axiosError.code || error.code || 'No code',
      );
      console.error(`❌ [API] URL was: ${url}`);
      console.error(`❌ [API] Base URL: ${currentBaseURL}`);
      console.error(`❌ [API] Endpoint: ${endpoint}`);

      // Log error details safely
      try {
        console.error(`❌ [API] Error stack:`, error.stack);
        if (error.response) {
          console.error(`❌ [API] Response status:`, error.response.status);
          console.error(`❌ [API] Response data:`, error.response.data);
        }
        if (error.request) {
          console.error(`❌ [API] Request was made but no response received`);
          console.error(
            `❌ [API] This usually means: Network error, CORS issue, or server not reachable`,
          );
        }
      } catch (e) {
        console.error(`❌ [API] Could not log full error details`);
      }

      // Check for common connection errors and try fallback URLs
      const errorMsg = String(error.message || '').toLowerCase();
      const isNetworkError =
        errorMsg.includes('network request failed') ||
        errorMsg.includes('fetch failed') ||
        errorMsg.includes('networkerror') ||
        errorMsg.includes('timeout') ||
        errorMsg.includes('econnrefused') ||
        axiosError.code === 'ECONNREFUSED' ||
        axiosError.code === 'ETIMEDOUT' ||
        axiosError.code === 'ERR_NETWORK' ||
        !error.response; // No response usually means network issue

      if (isNetworkError) {
        console.error(`❌ [API] Network error detected`);
        console.error(`❌ [API] Failed URL: ${currentBaseURL}`);

        // Try fallback URLs if not using ngrok and we haven't exhausted all URLs
        if (!(API_CONFIG as any).USE_NGROK) {
          // If NETWORK_URLS doesn't exist, can't try fallback URLs
          if (
            !(API_CONFIG as any).NETWORK_URLS ||
            !Array.isArray((API_CONFIG as any).NETWORK_URLS)
          ) {
            console.error(
              `❌ [API] Network error - using BASE_URL: ${API_CONFIG.BASE_URL}`,
            );
            console.error(`❌ [API] ⚠️ TROUBLESHOOTING STEPS:`);
            console.error(
              `   1. Verify phone and laptop are on the SAME WiFi network`,
            );
            console.error(
              `   2. Check if API server is running: netstat -an | findstr 5065`,
            );
            console.error(
              `   3. Test from phone browser: Open http://${API_CONFIG.BASE_URL.replace(
                'http://',
                '',
              ).replace('/api', '')} in phone browser`,
            );
            console.error(
              `   4. Verify Windows Firewall allows port 5065 (already configured ✅)`,
            );
            console.error(
              `   5. Check if IP address changed: Run ipconfig to get current IP`,
            );
            console.error(`   6. If on different networks, use ngrok instead`);
          } else {
            const primaryUrl =
              (API_CONFIG as any).PRIMARY_URL || API_CONFIG.BASE_URL;
            const networkUrls =
              ((API_CONFIG as any).NETWORK_URLS as string[]) || [];
            const urlsToTry = [
              primaryUrl,
              ...networkUrls.filter(
                (networkUrl: string) => networkUrl !== primaryUrl,
              ),
            ];

            if (urlIndex < urlsToTry.length - 1) {
              console.log(
                `🔄 [API] Trying next URL (${urlIndex + 2}/${
                  urlsToTry.length
                })...`,
              );
              // Try next URL
              return this.makeRequest<T>(
                endpoint,
                options,
                retryCount,
                urlIndex + 1,
              );
            } else {
              console.error(
                `❌ [API] All URLs exhausted. Tried: ${urlsToTry.join(', ')}`,
              );
              console.error(`❌ [API] Is the API server running?`);
              console.error(
                `❌ [API] For ngrok (works from any network), set USE_NGROK = true in apiConfig.ts`,
              );
            }
          }
        } else {
          console.error(
            `❌ [API] Network error with ngrok - check if ngrok is running`,
          );
        }
      }

      // Handle axios error response
      if (axiosError.response) {
        const responseData = axiosError.response.data;
        console.error(
          `Error Response Data:`,
          JSON.stringify(responseData, null, 2),
        );

        // If request failed with server error and we haven't retried yet, retry once
        if (axiosError.response.status >= 500 && retryCount === 0) {
          console.log(
            `🔄 [ApiService] Request failed with status ${axiosError.response.status}, retrying...`,
          );
          return this.makeRequest<T>(endpoint, options, retryCount + 1);
        }

        // Extract error message from response
        const errorMessage =
          (responseData as any)?.MessageEnglish ||
          (responseData as any)?.messageEnglish ||
          (responseData as any)?.Message ||
          (responseData as any)?.message ||
          (responseData as any)?.title ||
          `HTTP error! status: ${axiosError.response.status}`;

        const apiError = new Error(errorMessage);
        (apiError as any).response = { data: responseData };
        throw apiError;
      }

      if (
        error.message?.includes('timeout') ||
        axiosError.code === 'ETIMEDOUT'
      ) {
        const timeoutError = new Error(
          `Request timeout. API URL: ${this.baseURL} - Check if server is running and URL is correct.`,
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
          data: userData,
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
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
        {
          method: 'POST',
          headers,
          data,
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
      console.log('🔐 [API Login] Starting login request');
      console.log('🔐 [API Login] Endpoint:', API_CONFIG.ENDPOINTS.LOGIN);
      console.log(
        '🔐 [API Login] Full URL:',
        `${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`,
      );
      console.log('🔐 [API Login] Credentials email:', credentials.email);
      console.log(
        '🔐 [API Login] Credentials password length:',
        credentials.password?.length || 0,
      );

      const response = await this.makeRequest<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          data: credentials,
        },
      );

      console.log('✅ [API Login] Login request successful');
      console.log(
        '✅ [API Login] Response success:',
        response.success || response.Success,
      );
      console.log(
        '✅ [API Login] Has token:',
        !!(response.token || response.Token),
      );
      console.log(
        '✅ [API Login] Has user data:',
        !!(response.user || response.User || response.data || response.Data),
      );

      return response;
    } catch (error: any) {
      console.error('❌ [API Login] Login request failed');
      console.error('❌ [API Login] Error message:', error.message);
      console.error('❌ [API Login] Error stack:', error.stack);
      if (error.response) {
        console.error(
          '❌ [API Login] Error response status:',
          error.response.status,
        );
        console.error(
          '❌ [API Login] Error response data:',
          JSON.stringify(error.response.data, null, 2),
        );
      }
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
          data,
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
          data,
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

  // Verify email
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse> {
    try {
      const response = await this.makeRequest(
        API_CONFIG.ENDPOINTS.VERIFY_EMAIL,
        {
          method: 'POST',
          data,
        },
      );

      return response;
    } catch (error: any) {
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
        console.error('❌ [WeatherAPI] No authentication token found');
        throw new Error('Not authenticated');
      }

      const endpoint = `/weather/${city}`;
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log(`🌤️ [WeatherAPI] Fetching weather for city: ${city}`);
      console.log(`🌤️ [WeatherAPI] URL: ${fullUrl}`);

      const response = await this.makeRequest<WeatherResponse>(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        `🌤️ [WeatherAPI] Response received:`,
        JSON.stringify(response, null, 2),
      );

      // Handle both direct weather data and wrapped response
      // If response has main property, it's direct weather data
      if (
        response &&
        typeof response === 'object' &&
        'main' in response &&
        !('success' in response)
      ) {
        // Direct weather data, wrap it
        console.log(
          '🌤️ [WeatherAPI] Direct weather data detected, wrapping response',
        );
        return {
          success: true,
          Success: true,
          data: response as unknown as WeatherResponse,
          Data: response as unknown as WeatherResponse,
          message: 'Weather data retrieved successfully',
          Message: 'Weather data retrieved successfully',
        };
      }

      // Normal wrapped response
      console.log('🌤️ [WeatherAPI] Wrapped response detected');
      return response;
    } catch (error: any) {
      console.error('❌ [WeatherAPI] Error fetching weather:', error);

      // If error response contains weather-like structure, extract it
      if (
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'main' in error.response.data
      ) {
        console.log(
          '🌤️ [WeatherAPI] Weather data found in error response, extracting',
        );
        return {
          success: true,
          Success: true,
          data: error.response.data as WeatherResponse,
          Data: error.response.data as WeatherResponse,
          message: 'Weather data retrieved successfully',
          Message: 'Weather data retrieved successfully',
        };
      }
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
        console.error('❌ [PlansAPI] No authentication token found');
        throw new Error('Not authenticated');
      }

      const endpoint = '/irrigationplan/my-plans';
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log(`📋 [PlansAPI] Fetching irrigation plans`);
      console.log(`📋 [PlansAPI] URL: ${fullUrl}`);

      const response = await this.makeRequest<IrrigationPlanDetailsDto[]>(
        endpoint,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(
        `📋 [PlansAPI] Response received:`,
        JSON.stringify(response, null, 2),
      );

      // Handle both direct array response and wrapped response
      if (Array.isArray(response)) {
        // Direct array response
        console.log('📋 [PlansAPI] Direct array response detected, wrapping');
        return {
          success: true,
          Success: true,
          data: response,
          Data: response,
          message: 'Irrigation plans retrieved successfully',
          Message: 'Irrigation plans retrieved successfully',
        };
      }

      // Normal wrapped response
      console.log('📋 [PlansAPI] Wrapped response detected');
      return response;
    } catch (error: any) {
      console.error('❌ [PlansAPI] Error fetching irrigation plans:', error);

      // If error response contains plans data, extract it
      if (error.response?.data && Array.isArray(error.response.data)) {
        console.log(
          '📋 [PlansAPI] Plans data found in error response, extracting',
        );
        return {
          success: true,
          Success: true,
          data: error.response.data,
          Data: error.response.data,
          message: 'Irrigation plans retrieved successfully',
          Message: 'Irrigation plans retrieved successfully',
        };
      }
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
        data,
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
