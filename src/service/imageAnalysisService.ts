import { API_CONFIG } from './apiConfig';
import { authService } from './authService';
import { AnalyzeAndPlanResponse } from '../types/imageAnalysis.types';

class ImageAnalysisService {
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/Auth/login`, {
        method: 'GET',
        timeout: 5000,
      });

      // 405 Method Not Allowed is expected for GET on login endpoint
      // This means the server is running and accessible
      const isServerRunning = response.status === 405 || response.ok;
      return isServerRunning;
    } catch (error) {
      console.error('❌ [ImageAnalysisService] Connection test failed:', error);
      return false;
    }
  }

  async analyzeAndPlan(formData: FormData): Promise<AnalyzeAndPlanResponse> {
    // Removed testConnection call - it was causing automatic API calls
    // The actual API call will handle connectivity issues properly
    try {
      const token = await authService.getAuthToken();

      if (!token) {
        console.error(
          '❌ [ImageAnalysisService] No authentication token found',
        );
        throw new Error('No authentication token found');
      }

      const url = `${API_CONFIG.BASE_URL}/ImageAnalysis/analyze-and-plan`;

      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let the browser set it with boundary
        },
        body: formData,
      };

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(
          '⏰ [ImageAnalysisService] Request timeout after 30 seconds',
        );
        controller.abort();
      }, 30000); // 30 second timeout

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ImageAnalysisService] API Error Response:', {
          status: response.status,
          errorText: errorText,
        });
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ [ImageAnalysisService] Analysis successful:', {
        success: result.success,
        confidence: result.confidence,
      });

      return result;
    } catch (error: any) {
      console.error('💥 [ImageAnalysisService] Image analysis error:', {
        name: error?.name || 'Unknown',
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
      });
      throw error;
    }
  }
}

export const imageAnalysisService = new ImageAnalysisService();
export default imageAnalysisService;
