import axios, { AxiosError } from 'axios';
import { API_CONFIG } from './apiConfig';
import { authService } from './authService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// New API Request Format
export interface ChatRequest {
  sessionId: string; // Required
  message: string; // Required
  language: string; // Required: "english" or "urdu"
}

// New API Response Format
export interface ChatResponse {
  response: string; // AI response text from Gemini
}

// Error Response Format
export interface ChatErrorResponse {
  error?: string;
  response?: string; // For 500 errors
}

// Service Response Format (for internal use)
export interface ChatServiceResponse {
  success: boolean;
  replyText: string;
  error?: string;
  errorCode?: number;
}

class ChatbotService {
  private axiosInstance;

  constructor() {
    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 120000, // 2 minutes timeout for AI responses
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(
    message: string,
    conversationId?: string,
    conversationHistory: ChatMessage[] = [],
    language?: string | null, // "en", "ur", or null for auto-detect
  ): Promise<ChatServiceResponse> {
    try {
      const token = await authService.getAuthToken();

      if (!token) {
        console.error('❌ [ChatbotService] No authentication token found');
        throw {
          message: 'Please login to continue.',
          errorCode: 401,
          isAuthError: true,
        };
      }

      // Use conversationId as sessionId, or generate a new one if not provided
      const sessionId = conversationId || `session-${Date.now()}`;

      // Normalize language value to "english" or "urdu" (required, defaults to "english")
      // Note: This controls the RESPONSE language, not the query language.
      // The chatbot understands queries in both languages but responds in the specified language.
      let normalizedLanguage: string = 'english'; // Default to "english"
      if (language) {
        const langLower = language.toLowerCase();
        if (langLower === 'en' || langLower === 'english') {
          normalizedLanguage = 'english';
        } else if (
          langLower === 'ur' ||
          langLower === 'urdu' ||
          langLower === 'اردو'
        ) {
          normalizedLanguage = 'urdu';
        }
        // If language is provided but doesn't match, keep default "english"
      }

      // Build request body according to new API format
      const requestBody: ChatRequest = {
        sessionId: sessionId,
        message: message.trim(),
        language: normalizedLanguage, // Always included - controls response language
      };

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_SEND_TEXT}`;
      console.log(`🌐 [Chatbot] Calling API: POST ${url}`);
      console.log(`📝 [Chatbot] Request payload:`, {
        sessionId: requestBody.sessionId,
        messageLength: requestBody.message.length,
        language: requestBody.language, // Response language
      });

      const response = await this.axiosInstance.post<ChatResponse>(
        API_CONFIG.ENDPOINTS.CHAT_SEND_TEXT,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          timeout: 120000, // 2 minutes
        },
      );

      // Success response
      const result = response.data;
      const replyText = result.response || '';
      console.log('✅ [ChatbotService] Chat response received:', {
        hasResponse: !!replyText,
        replyLength: replyText.length,
      });

      return {
        success: true,
        replyText: replyText,
      };
    } catch (error: any) {
      const axiosError = error as AxiosError<ChatErrorResponse>;

      console.error('💥 [ChatbotService] Chat error:', {
        name: axiosError?.name || error?.name || 'Unknown',
        message: axiosError?.message || error?.message || 'Unknown error',
        status: axiosError.response?.status,
      });

      // Handle HTTP error responses
      if (axiosError.response) {
        const status = axiosError.response.status;
        const errorData = axiosError.response.data;

        let errorMessage = 'An error occurred. Please try again.';
        let errorCode = status;

        switch (status) {
          case 400:
            // Bad Request
            if (errorData?.error === 'Request body is required') {
              errorMessage = 'Request body is required. Please try again.';
            } else if (
              errorData?.error?.toLowerCase().includes('message') ||
              errorData?.error?.toLowerCase().includes('sessionid')
            ) {
              errorMessage =
                errorData.error || 'Please check your input and try again.';
            } else {
              errorMessage =
                errorData?.error || 'Invalid request. Please check your input.';
            }
            break;

          case 401:
            // Unauthorized
            errorMessage = 'Please login to continue.';
            break;

          case 500:
            // Server Error
            if (errorData?.response) {
              errorMessage =
                errorData.response || 'An error occurred. Please try again.';
            } else {
              errorMessage = 'An error occurred. Please try again.';
            }
            break;

          case 408:
            // Request Timeout
            errorMessage =
              'Request timed out. The AI is taking too long to respond. Please try again.';
            break;

          default:
            errorMessage = errorData?.error || 'An unexpected error occurred.';
        }

        throw {
          message: errorMessage,
          errorCode: status,
          isAuthError: status === 401,
        };
      }

      // Handle network errors
      if (
        error.name === 'TypeError' ||
        error.message?.includes('fetch') ||
        error.message?.includes('Network')
      ) {
        throw {
          message:
            'Unable to connect to server. Please check your internet connection.',
          errorCode: 0,
          isNetworkError: true,
        };
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw {
          message:
            'Request timed out. The AI is taking too long to respond. Please try again.',
          errorCode: 408,
          isTimeoutError: true,
        };
      }

      // Generic error
      throw {
        message: error.message || 'An error occurred. Please try again.',
        errorCode: 0,
      };
    }
  }
}

export const chatbotService = new ChatbotService();
export default chatbotService;
