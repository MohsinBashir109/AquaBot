import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authService } from '../service/authService';
import { useAppDispatch } from '../store/hooks';
import { setUser as setReduxUser, clearUser } from '../store/userSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      const userData = await authService.getStoredUser();

      if (isLoggedIn && userData) {
        setIsAuthenticated(true);
        setUser(userData);

        // Update Redux store - ensure userData has required fields
        if (userData && userData.userName && userData.email) {
          dispatch(setReduxUser(userData));
        } else {
          console.warn('User data missing required fields:', userData);
          dispatch(clearUser());
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // Clear Redux store
        dispatch(clearUser());
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Check if user is already logged in on app startup
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const result = await authService.login(credentials);

      // Check if login was successful (flag: false means success)
      if (result.flag === false && result.user) {
        const userData = await authService.getStoredUser();
        setIsAuthenticated(true);
        setUser(userData);

        // Update Redux store - ensure userData has required fields
        if (userData && userData.userName && userData.email) {
          dispatch(setReduxUser(userData));
        } else {
          console.warn(
            'User data missing required fields after login:',
            userData,
          );
        }
        console.log('✅ Login successful');
        return true;
      } else {
        console.log('❌ Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw the error so the signIn screen can handle the specific error message
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      // Clear Redux store
      dispatch(clearUser());
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the local state even if logout fails
      setIsAuthenticated(false);
      setUser(null);
      dispatch(clearUser());
      throw error; // Re-throw so calling components can handle the error
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
