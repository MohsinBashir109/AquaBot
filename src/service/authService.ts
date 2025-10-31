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
        const userData = response.data || response.Data;
        if (userData) {
          await this.storeUserSession(userData);
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
      const response = await apiService.login(credentials);

      // Check for success and user data (your backend returns Success, User, Token)
      const isSuccess =
        (response.success || response.Success) &&
        (response.data || response.Data || response.user || response.User);

      if (isSuccess) {
        // Your backend returns User and Token directly
        let userData =
          response.data || response.Data || response.user || response.User;
        const token = response.token || response.Token;

        // If we have user data from backend, use it directly
        if (userData) {
          userData = {
            user: userData,
            token: token,
          };
        } else if (token) {
          // Fallback: decode JWT if no user data
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(
                Buffer.from(tokenParts[1], 'base64').toString(),
              );

              userData = {
                user: {
                  userName:
                    payload[
                      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                    ] || 'User',
                  email:
                    payload[
                      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
                    ] || 'user@example.com',
                  id:
                    payload[
                      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                    ] || '1',
                },
                token: token,
              };
            } else {
              throw new Error('Invalid JWT format');
            }
          } catch (error) {
            console.error('Error decoding JWT:', error);
            // Fallback to basic user data
            userData = {
              user: {
                userName: 'User',
                email: 'user@example.com',
                id: '1',
              },
              token: token,
            };
          }
        }

        // Store user session data
        await this.storeUserSession(userData);
        return { flag: false, user: userData.user.userName };
      }

      console.log('❌ Login failed');
      return { flag: true, user: null };
    } catch (error) {
      console.error('Login error:', error);
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
