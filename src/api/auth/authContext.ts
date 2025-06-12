import { createContext } from 'react';
import { AuthState, EmailLoginData, WalletLoginData } from '../types';

// Context interface
export interface AuthContextType {
  state: AuthState;
  loginWithEmail: (credentials: EmailLoginData) => Promise<void>;
  loginWithWallet: (credentials: WalletLoginData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
