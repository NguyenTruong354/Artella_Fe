import React, { useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthUser, EmailLoginData, WalletLoginData, UserRegistrationRequest, RegisterResponse } from '../types';
import { authService } from '../services';
import { AuthContext, AuthContextType } from './authContext';

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: AuthUser } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: string }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
        // Don't auto-login after registration, just show success
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Auto-verify token on app start
      authService.verifyToken()
        .then((userData) => {
          const user: AuthUser = {
            id: userData.id,
            email: userData.email,
            walletAddress: userData.walletAddress,
            loginMethod: userData.email ? 'email' : 'wallet',
            isAuthenticated: true,
          };
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token, user },
          });
        })
        .catch(() => {
          // Invalid token, clear it
          localStorage.removeItem('auth_token');
          dispatch({ type: 'LOGOUT' });
        });
    }
  }, []);

  // Email login
  const loginWithEmail = async (credentials: EmailLoginData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.loginWithEmail(credentials);
      
      if (response.success && response.data) {
        // Create user object from credentials
        const user: AuthUser = {
          id: `email_${credentials.email}`, // Temporary ID until we get real user data
          email: credentials.email,
          loginMethod: 'email',
          isAuthenticated: true,
        };
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token: response.data, user },
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Wallet login  
  const loginWithWallet = async (credentials: WalletLoginData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.loginWithWallet(credentials);
      
      if (response.success && response.data) {
        // Create user object from credentials
        const user: AuthUser = {
          id: `wallet_${credentials.walletAddress}`, // Temporary ID until we get real user data
          walletAddress: credentials.walletAddress,
          loginMethod: 'wallet',
          isAuthenticated: true,
        };
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token: response.data, user },
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Wallet login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Register
  const register = async (data: UserRegistrationRequest): Promise<RegisterResponse> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      const response = await authService.register(data);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: response.message,
      });
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };
  // Logout
  const logout = async (): Promise<void> => {
    try {
      const response = await authService.logout();
      
      if (response.success) {
        console.log('Logout successful:', response.message);
      } else {
        console.warn('Logout had issues:', response.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always update local state regardless of server response
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    loginWithEmail,
    loginWithWallet,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
