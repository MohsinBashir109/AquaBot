import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './apiService';
import { RegisterRequest, LoginRequest, AuthResponse } from './apiConfig';

// Key used for AsyncStorage
const USER_KEY = 'user_session';
const TOKEN_KEY = 'auth_token';

// Authentication Service for .NET Backend
class AuthService {
  // Register new user
  async register(userData: RegisterRequest): Promise<boolean> {
    try {
      // Removed testConnection call - it was causing automatic API calls
      // The actual API call will handle connectivity issues properly
      const response = await apiService.register(userData);

      // Check for both success and Success properties (backend might use either)
      const isSuccess =
        (response.success || response.Success) &&
        (response.data || response.Data);

      if (isSuccess) {
        const registeredUserData = response.data || response.Data;
        if (registeredUserData) {
          await this.storeUserSession(registeredUserData);
          console.log('✅ Registration successful');
        }
        return false; // No error
      }

      console.log('❌ Registration failed');
      return true; // Error occurred
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(
    credentials: LoginRequest,
  ): Promise<{ flag: boolean; user: string | null }> {
    try {
      console.log(
        '🔐 [AuthService] Login called with email:',
        credentials.email,
      );
      const response = await apiService.login(credentials);

      console.log('🔐 [AuthService] Login response received');
      console.log('🔐 [AuthService] Response keys:', Object.keys(response));
      console.log('🔐 [AuthService] Response.success:', response.success);
      console.log('🔐 [AuthService] Response.Success:', response.Success);
      console.log('🔐 [AuthService] Response.data:', response.data);
      console.log('🔐 [AuthService] Response.Data:', response.Data);
      console.log('🔐 [AuthService] Response.user:', response.user);
      console.log('🔐 [AuthService] Response.User:', response.User);
      console.log(
        '🔐 [AuthService] Response.token:',
        response.token ? 'Present' : 'Missing',
      );
      console.log(
        '🔐 [AuthService] Response.Token:',
        response.Token ? 'Present' : 'Missing',
      );

      // Check for success and user data (your backend returns Success, User, Token)
      const isSuccess =
        (response.success || response.Success) &&
        (response.data || response.Data || response.user || response.User);

      console.log('🔐 [AuthService] isSuccess:', isSuccess);

      if (isSuccess) {
        // Your backend returns User and Token directly
        let userData =
          response.data || response.Data || response.user || response.User;
        const token = response.token || response.Token;

        console.log(
          '🔐 [AuthService] Extracted userData:',
          userData ? 'Present' : 'Missing',
        );
        console.log(
          '🔐 [AuthService] Extracted token:',
          token ? 'Present' : 'Missing',
        );

        // If we have user data from backend, use it directly
        if (userData) {
          userData = {
            user: userData,
            token: token,
          };
        } else if (token) {
          // Fallback: create basic user data if we only have token
          // The backend should provide user data, but if it doesn't, we'll use a basic structure
          console.warn(
            '⚠️ [AuthService] No user data in response, only token. Creating basic user object.',
          );
          userData = {
            user: {
              userName: 'User',
              email: credentials.email || 'user@example.com',
              id: '1',
            },
            token: token,
          };
        }

        // Store user session data
        await this.storeUserSession(userData);
        console.log('✅ [AuthService] Login successful, user stored');
        return { flag: false, user: userData.user.userName };
      }

      console.log('❌ [AuthService] Login failed - response indicates failure');
      console.log(
        '❌ [AuthService] Full response:',
        JSON.stringify(response, null, 2),
      );
      return { flag: true, user: null };
    } catch (error: any) {
      console.error('❌ [AuthService] Login error caught');
      console.error('❌ [AuthService] Error message:', error.message);
      console.error('❌ [AuthService] Error stack:', error.stack);
      if (error.response) {
        console.error(
          '❌ [AuthService] Error response:',
          JSON.stringify(error.response.data, null, 2),
        );
      }
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<boolean> {
    try {
      const response = await apiService.forgotPassword({ email });
      return response.success || false;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  }

  // Reset password
  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> {
    try {
      const response = await apiService.resetPassword({
        email,
        code,
        newPassword,
        confirmPassword,
      });
      return response.success || false;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<boolean> {
    try {
      const response = await apiService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.success || response.Success || false;
    } catch (error) {
      console.error('Change password error:', error);
      throw error; // Re-throw so UI can handle error messages
    }
  }

  // Store user session data
  private async storeUserSession(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(authData.user));
      await AsyncStorage.setItem(TOKEN_KEY, authData.token);
    } catch (error) {
      console.error('Error storing user session:', error);
    }
  }

  // Get stored user data
  async getStoredUser(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData !== null) {
        return JSON.parse(userData);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error reading user data:', error);
      return null;
    }
  }

  // Get stored auth token
  async getAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error reading auth token:', error);
      return null;
    }
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      const user = await this.getStoredUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Clear all stored data (for debugging)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
