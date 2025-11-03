import axios, { AxiosError } from 'axios';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';
import { AnalyzeAndPlanResponse } from '../types/imageAnalysis.types';

class ImageAnalysisService {
  private axiosInstance;

  constructor() {
    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 30000, // 30 seconds timeout for image uploads
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.axiosInstance.get('/Auth/login', {
        timeout: 5000,
      });
      return true;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      // 405 Method Not Allowed is expected for GET on login endpoint
      // This means the server is running and accessible
      if (axiosError.response?.status === 405) {
        return true;
      }
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
      
      console.log(`🌐 [ImageAnalysis] Calling API: POST ${url}`);
      console.log(`🔑 [ImageAnalysis] Token present: ${!!token}`);

      const response = await this.axiosInstance.post<AnalyzeAndPlanResponse>(
        '/ImageAnalysis/analyze-and-plan',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let axios set it with boundary for FormData
          },
          timeout: 30000, // 30 second timeout
        },
      );

      const result = response.data;
      console.log('✅ [ImageAnalysisService] Analysis successful:', {
        success: result.success,
        confidence: result.confidence,
      });

      return result;
    } catch (error: any) {
      const axiosError = error as AxiosError<AnalyzeAndPlanResponse>;
      const errorName = axiosError?.name || error?.name || 'Unknown';
      const errorMessage = axiosError?.message || error?.message || 'Unknown error';
      
      console.error('💥 [ImageAnalysisService] Image analysis error:', {
        name: errorName,
        message: errorMessage,
        url: `${API_CONFIG.BASE_URL}/ImageAnalysis/analyze-and-plan`,
        baseUrl: API_CONFIG.BASE_URL,
        status: axiosError.response?.status,
      });

      // Handle axios error response
      if (axiosError.response) {
        const errorText = axiosError.response.data
          ? JSON.stringify(axiosError.response.data)
          : 'No error details';
        console.error('❌ [ImageAnalysisService] API Error Response:', {
          status: axiosError.response.status,
          errorText: errorText,
        });
        throw new Error(`API request failed: ${axiosError.response.status}`);
      }
      
      // Provide specific guidance for network errors
      if (
        errorName === 'TypeError' ||
        axiosError.code === 'ECONNREFUSED' ||
        axiosError.code === 'ETIMEDOUT' ||
        axiosError.code === 'ENOTFOUND' ||
        errorMessage.includes('Network request failed') ||
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('timeout')
      ) {
        console.error('❌ [ImageAnalysisService] Network connection failed!');
        console.error('❌ [ImageAnalysisService] Troubleshooting steps:');
        console.error('   1. Check if API server is running on http://192.168.2.11:5065');
        console.error('   2. Verify your computer IP is still 192.168.2.11');
        console.error('   3. Ensure device and computer are on same Wi-Fi network');
        console.error('   4. Check Windows Firewall allows port 5065');
        console.error('   5. Try pinging 192.168.2.11 from your device');
        console.error('   6. Update BASE_URL in src/service/apiConfig.ts if IP changed');
      }
      
      throw error;
    }
  }
}

export const imageAnalysisService = new ImageAnalysisService();
export default imageAnalysisService;
