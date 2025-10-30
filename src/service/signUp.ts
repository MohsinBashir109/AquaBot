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
    showCustomFlash('Registration successful!', 'success');
    return false; // No error - registration successful
  } catch (error: any) {
    let errorMsg = 'Registration failed. Please try again.';

    // Debug output (keep for now!):
    console.log('Backend error response:', error?.response?.data);

    if (error?.response?.data) {
      const d = error.response.data;
      const message = String(d.message || d.Message || '').toLowerCase();
      const code = d.errorCode || d.ErrorCode || '';

      // Priority: Check errors array for meaningful detail
      if (
        Array.isArray(d.errors) &&
        d.errors.length > 0 &&
        typeof d.errors[0] === 'string'
      ) {
        const err = d.errors[0];
        // Try to extract username if it's a 'Username ... is already taken' message
        const match = err.match(/username '([^']+)' is already taken/i);
        if (match) {
          errorMsg = `User with the username '${match[1]}' already exists.`;
        } else {
          errorMsg = err;
        }
      } else if (message.includes('already exists')) {
        errorMsg = 'User with this email already exists.';
      } else if (
        message.includes('username') &&
        message.includes('already taken')
      ) {
        // Extract username from the message if possible
        const match = (d.message || d.Message || '').match(
          /username '([^']+)' is already taken/i,
        );
        if (match) {
          errorMsg = `User with the username '${match[1]}' already exists.`;
        } else {
          errorMsg = 'Username is already taken.';
        }
      } else if (code === 'USER_EXISTS') {
        errorMsg = 'User with this email already exists.';
      } else if (d.message) {
        errorMsg = d.message;
      } else if (typeof d === 'string') {
        errorMsg = d;
      }
    } else if (error.message) {
      errorMsg = error.message;
    }

    if (!errorMsg || errorMsg.trim() === '') {
      errorMsg = 'Registration failed. Please try again.';
    }

    console.log('Final error message:', errorMsg);
    showCustomFlash(errorMsg, 'danger');
    throw error;
  }
};

//  Reset password using .NET backend
export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const success = await authService.resetPassword(email, newPassword);
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
