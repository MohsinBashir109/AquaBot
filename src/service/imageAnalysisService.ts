import { API_CONFIG } from './apiConfig';
import { authService } from './authService';
import { AnalyzeAndPlanResponse } from '../types/imageAnalysis.types';

class ImageAnalysisService {
  async analyzeAndPlan(formData: FormData): Promise<AnalyzeAndPlanResponse> {
    try {
      const token = await authService.getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/ImageAnalysis/analyze-and-plan`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let the browser set it with boundary
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Image analysis successful:', result);

      return result;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  }
}

export const imageAnalysisService = new ImageAnalysisService();
export default imageAnalysisService;
