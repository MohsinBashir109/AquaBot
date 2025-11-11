import { API_CONFIG } from './apiConfig';
import { authService } from './authService';
import { AnalyzeAndPlanResponse } from '../types/imageAnalysis.types';

class ImageAnalysisService {
  constructor() {
    // Using fetch API for FormData uploads (better React Native support)
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = `${API_CONFIG.BASE_URL}/auth/login`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (response.status === 405) {
        return true;
      }
      return response.ok;
    } catch (error: any) {
      return false;
    }
  }

  async analyzeAndPlan(formData: FormData): Promise<AnalyzeAndPlanResponse> {
    try {
      const token = await authService.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      let baseURL = API_CONFIG.BASE_URL.trim();
      if ((API_CONFIG as any).USE_NGROK && (API_CONFIG as any).NGROK_URL) {
        baseURL = (API_CONFIG as any).NGROK_URL;
      }

      const endpoint = API_CONFIG.ENDPOINTS.IMAGE_ANALYSIS;
      const url = `${baseURL}${endpoint}`;

      const headers: any = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };

      if (baseURL.includes('ngrok')) {
        headers['ngrok-skip-browser-warning'] = 'true';
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000);

      try {
        const fetchResponse = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw new Error(
            `API request failed: ${fetchResponse.status} - ${errorText}`,
          );
        }

        const result = (await fetchResponse.json()) as AnalyzeAndPlanResponse;
        return result;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          throw new Error(
            'Request timeout after 60 seconds - no response received',
          );
        }

        throw fetchError;
      }
    } catch (error: any) {
      const errorName = error?.name || 'Unknown';
      const errorMessage = error?.message || 'Unknown error';
      const attemptedUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGE_ANALYSIS}`;

      if (
        errorName === 'TypeError' ||
        errorName === 'AbortError' ||
        error?.code === 'ECONNREFUSED' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ENOTFOUND' ||
        error?.code === 'ERR_NETWORK' ||
        errorMessage.includes('Network request failed') ||
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('Network Error') ||
        errorMessage.includes('aborted')
      ) {
        let userFriendlyMessage = 'Network connection failed. ';
        if (API_CONFIG.BASE_URL.includes('ngrok')) {
          userFriendlyMessage += 'Please check if ngrok is running.';
        } else {
          userFriendlyMessage +=
            'Please check your internet connection and try again.';
        }

        const networkError = new Error(userFriendlyMessage);
        (networkError as any).isNetworkError = true;
        (networkError as any).originalError = error;
        (networkError as any).attemptedUrl = attemptedUrl;
        throw networkError;
      }

      const enhancedError = new Error(
        errorMessage || 'Failed to analyze image. Please try again.',
      );
      (enhancedError as any).originalError = error;
      (enhancedError as any).attemptedUrl = attemptedUrl;
      throw enhancedError;
    }
  }
}

export const imageAnalysisService = new ImageAnalysisService();
export default imageAnalysisService;
