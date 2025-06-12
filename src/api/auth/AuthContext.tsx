import React, { useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthUser, EmailLoginData, WalletLoginData } from '../types';
import { authService } from '../services';
import { AuthContext, AuthContextType } from './authContext';

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: AuthUser } }
  | { type: 'LOGIN_FAILURE'; payload: string }
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
    default:
      return state;
  }
;

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
      await authService.logout();
    } finally {
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
