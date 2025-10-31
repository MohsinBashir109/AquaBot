import { authService } from './authService';
import { showCustomFlash } from '../utils/flash.tsx';

type SignUpProps = {
  email: string;
  password: string;
  userName: string;
};

//  Register new user using .NET backend
export const register = async ({ email, password, userName }: SignUpProps) => {
  try {
    await authService.register({
      userName,
      email,
      password,
    });
    // Flash message will be shown by the UI after loader completes
    return false; // No error - registration successful
  } catch (error: any) {
    // Flash message will be shown by the UI after loader completes
    // Re-throw error so the UI can handle it and extract the error message
    throw error;
  }
};

//  Reset password using .NET backend
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    const success = await authService.resetPassword(
      email,
      code,
      newPassword,
      confirmPassword,
    );
    return success;
  } catch (error) {
    console.error('Reset password error:', error);
    showCustomFlash('Something went wrong!', 'danger');
    return false;
  }
};

// Logout user (wrapper for authService.logout)
export const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
