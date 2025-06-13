import React, { useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthUser, EmailLoginData, WalletLoginData, UserRegistrationRequest, RegisterResponse, ApiResponse } from '../types';
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
  | { type: 'VERIFICATION_START' }
  | { type: 'VERIFICATION_SUCCESS' }
  | { type: 'VERIFICATION_FAILURE'; payload: string }
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
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'VERIFICATION_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'VERIFICATION_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case 'VERIFICATION_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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

  // Check for existing token on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = authService.getToken();
      if (token) {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
          const isValid = await authService.verifyToken();
          if (isValid) {
            // Token is valid, create user object
            // Note: In a real app, you might want to fetch user details from API
            const user: AuthUser = {
              id: 'user_id', // This should come from token or API
              isAuthenticated: true,
              loginMethod: 'email', // This should be determined from token
            };
            
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { token, user },
            });        } else {
            // Token is invalid, clear it
            authService.logout();
            dispatch({ type: 'LOGOUT' });
          }
        } catch {
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    checkExistingAuth();
  }, []);

  // Login with email
  const loginWithEmail = async (credentials: EmailLoginData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.loginWithEmail(credentials);
      
      const user: AuthUser = {
        id: 'user_id', // This should come from token or API response
        email: credentials.email,
        loginMethod: 'email',
        isAuthenticated: true,
      };
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.data,
          user,        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Login with wallet
  const loginWithWallet = async (credentials: WalletLoginData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.loginWithWallet(credentials);
      
      const user: AuthUser = {
        id: 'user_id', // This should come from token or API response
        walletAddress: credentials.walletAddress,
        loginMethod: 'wallet',
        isAuthenticated: true,
      };
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.data,
          user,        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Wallet login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
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
  
  // Verify email with verification code
  const verifyEmail = async (email: string, code: string): Promise<ApiResponse<boolean>> => {
    dispatch({ type: 'VERIFICATION_START' });
    
    try {
      const response = await authService.verifyEmail(email, code);
      
      if (response.success) {
        dispatch({ type: 'VERIFICATION_SUCCESS' });
      } else {
        dispatch({
          type: 'VERIFICATION_FAILURE',
          payload: response.message,
        });
      }
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      dispatch({
        type: 'VERIFICATION_FAILURE',
        payload: errorMessage,
      });
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  };
  
  // Resend verification code
  const resendVerificationCode = async (email: string): Promise<ApiResponse<boolean>> => {
    dispatch({ type: 'VERIFICATION_START' });
    
    try {
      const response = await authService.resendVerificationCode(email);
      
      if (response.success) {
        dispatch({ type: 'VERIFICATION_SUCCESS' });
      } else {
        dispatch({
          type: 'VERIFICATION_FAILURE',
          payload: response.message,
        });
      }
      
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code';
      dispatch({
        type: 'VERIFICATION_FAILURE',
        payload: errorMessage,
      });
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  };

  const contextValue: AuthContextType = {
    state,
    loginWithEmail,
    loginWithWallet,
    register,
    logout,
    clearError,
    verifyEmail,
    resendVerificationCode,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
