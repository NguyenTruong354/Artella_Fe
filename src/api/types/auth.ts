// Authentication related types
export interface LoginRequest {
  loginMethod: 'email' | 'wallet';
  email?: string;
  password?: string;
  walletAddress?: string;
  signedMessage?: string;
}

export interface LoginResponse {
  message: string;
  data: string; // JWT token
  success: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
  timestamp?: string;
  path?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  walletAddress?: string;
  loginMethod: 'email' | 'wallet';
  isAuthenticated: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface WalletLoginData {
  walletAddress: string;
  signedMessage: string;
}

export interface EmailLoginData {
  email: string;
  password: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}
