import { createContext } from 'react';
import { AuthState, EmailLoginData, WalletLoginData, UserRegistrationRequest, RegisterResponse, ApiResponse } from '../types';

// Context interface
export interface AuthContextType {
  state: AuthState;
  loginWithEmail: (credentials: EmailLoginData) => Promise<void>;
  loginWithWallet: (credentials: WalletLoginData) => Promise<void>;
  register: (data: UserRegistrationRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<ApiResponse<boolean>>;
  resendVerificationCode: (email: string) => Promise<ApiResponse<boolean>>;
  clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
