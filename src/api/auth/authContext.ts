import { createContext } from 'react';
import { AuthState, EmailLoginData, WalletLoginData, UserRegistrationRequest, RegisterResponse } from '../types';

// Context interface
export interface AuthContextType {
  state: AuthState;
  loginWithEmail: (credentials: EmailLoginData) => Promise<void>;
  loginWithWallet: (credentials: WalletLoginData) => Promise<void>;
  register: (data: UserRegistrationRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
