import { authService } from './authService';
import { showCustomFlash } from '../utils/flash.tsx';

// Props for manual login
type LoginProps = {
  email: string;
  password: string;
};

//
// 🔹 Manual Email/Password Login using .NET backend
//
export const login = async ({ email, password }: LoginProps) => {
  try {
    const result = await authService.login({ email, password });
    return result;
  } catch (error) {
    console.error('Login error:', error);
    // Don't show generic flash message here - let the signin screen handle the specific error
    throw error;
  }
};

//
// 🔹 AsyncStorage Helpers (using authService)
//

// Store user data (email or doc) locally
export const storeData = async (_email: any) => {
  try {
    // This function is kept for backward compatibility
    // The actual storage is now handled by authService
    console.log('User data stored via authService');
  } catch (error) {
    console.log(error);
  }
};

// Remove stored user data (logout helper)
export const removeValue = async () => {
  try {
    await authService.logout();
    console.log('User logged out successfully');
  } catch (e) {
    console.log(e);
  }
};

// Get stored user data for debugging or restoring session
export const getData = async () => {
  try {
    const userData = await authService.getStoredUser();
    if (userData !== null) {
      console.log('Current stored user:', userData);
      return userData.email;
    } else {
      console.log('No user found in local storage.');
      return null;
    }
  } catch (e) {
    console.log('Error reading user data', e);
    return null;
  }
};
