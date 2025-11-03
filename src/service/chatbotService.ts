import axios, { AxiosError } from 'axios';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  language?: string; // 'ur', 'en', 'hi' for Urdu, English, Hindi
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
  error?: string;
}

class ChatbotService {
  private axiosInstance;

  constructor() {
    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 60000, // 60 second timeout for AI responses
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(
    message: string,
    language: string = 'en',
    conversationHistory: ChatMessage[] = [],
  ): Promise<ChatResponse> {
    try {
      const token = await authService.getAuthToken();

      if (!token) {
        console.error(
          '❌ [ChatbotService] No authentication token found',
        );
        throw new Error('No authentication token found');
      }

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_ASSISTANT}`;

      const requestBody: ChatRequest = {
        message,
        language,
        conversationHistory,
      };

      console.log(`🌐 [Chatbot] Calling API: POST ${url}`);

      const response = await this.axiosInstance.post<ChatResponse>(
        API_CONFIG.ENDPOINTS.CHAT_ASSISTANT,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000, // 60 second timeout for AI responses
        },
      );

      const result = response.data;
      console.log('✅ [ChatbotService] Chat response received:', {
        success: result.success || (result as any).Success,
        hasResponse: !!result.response || !!(result as any).Response,
      });

      // Handle both camelCase and PascalCase responses from backend
      return {
        success: result.success || (result as any).Success || false,
        message: result.message || (result as any).Message || '',
        response: result.response || (result as any).Response || result.message || (result as any).Message || 'No response received',
        error: result.error || (result as any).Error,
      };
    } catch (error: any) {
      const axiosError = error as AxiosError<ChatResponse>;
      
      console.error('💥 [ChatbotService] Chat error:', {
        name: axiosError?.name || error?.name || 'Unknown',
        message: axiosError?.message || error?.message || 'Unknown error',
        status: axiosError.response?.status,
        stack: axiosError?.stack || error?.stack || 'No stack trace',
      });

      // Handle axios error response
      if (axiosError.response) {
        const errorText = axiosError.response.data
          ? JSON.stringify(axiosError.response.data)
          : 'No error details';
        console.error('❌ [ChatbotService] API Error Response:', {
          status: axiosError.response.status,
          errorText: errorText,
        });
        throw new Error(`API request failed: ${axiosError.response.status}`);
      }

      throw error;
    }
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;

