import { apiClient } from '../client';
import { LoginRequest, LoginResponse, EmailLoginData, WalletLoginData, UserRegistrationRequest, RegisterResponse, User, ApiResponse } from '../types';

export class AuthService {  private readonly endpoints = {
    login: '/api/users/login',
    register: '/register',
    logout: '/api/users/logout',
    refresh: '/api/users/refresh',
    verify: '/api/users/verify',
  };

  /**
   * Login with email and password
   */
  async loginWithEmail(credentials: EmailLoginData): Promise<LoginResponse> {
    const loginRequest: LoginRequest = {
      loginMethod: 'email',
      email: credentials.email,
      password: credentials.password,
    };

    // Debug log để kiểm tra request body
    console.log('🔍 Login Request Body:', JSON.stringify(loginRequest, null, 2));    // Debug log để kiểm tra request body
    console.log('🔍 Login Request Body:', JSON.stringify(loginRequest, null, 2));

    try {
      const response = await apiClient.post<string>(this.endpoints.login, loginRequest);
      
      if (response.success && response.data) {
        // Store token
        apiClient.setAuthToken(response.data);
        
        return {
          message: response.message,
          data: response.data,
          success: true,
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email login failed';
      throw {
        message: errorMessage,
        success: false,
      };
    }
  }
  /**
   * Login with wallet address and signed message
   */
  async loginWithWallet(credentials: WalletLoginData): Promise<LoginResponse> {
    const loginRequest: LoginRequest = {
      loginMethod: 'wallet',
      walletAddress: credentials.walletAddress,
      signedMessage: credentials.signedMessage,
    };

    // Debug log để kiểm tra request body
    console.log('🔍 Wallet Login Request Body:', JSON.stringify(loginRequest, null, 2));

    try {
      const response = await apiClient.post<string>(this.endpoints.login, loginRequest);
      
      if (response.success && response.data) {
        // Store token
        apiClient.setAuthToken(response.data);
        
        return {
          message: response.message,
          data: response.data,
          success: true,
        };
      } else {
        throw new Error(response.message || 'Wallet login failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Wallet login failed';
      throw {
        message: errorMessage,
        success: false,
      };
    }
  }  /**
   * Register new user
   */
  async register(userData: UserRegistrationRequest): Promise<RegisterResponse> {
    // Debug log để kiểm tra request body
    console.log('🔍 Register Request Body:', JSON.stringify(userData, null, 2));

    try {
      // Spring Boot trả về ApiResponse<User> format
      const response = await apiClient.post<ApiResponse<User>>(this.endpoints.register, userData);
      
      if (response.success && response.data) {
        // Response từ Spring Boot đã là ApiResponse<User> format
        return {
          message: response.data.message,
          data: response.data.data,
          success: response.data.success,
          timestamp: response.data.timestamp,
          path: response.data.path,
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      throw {
        message: errorMessage,
        success: false,
      };
    }
  }
  /**
   * Logout user by invalidating JWT token
   * 
   * Even though JWT tokens are stateless, the backend maintains a blacklist of invalidated tokens
   * to ensure proper logout functionality
   */
  async logout(): Promise<ApiResponse<boolean>> {
    try {
      // Get the current token
      const token = this.getToken();
      
      if (!token) {
        console.warn('No token found during logout');
        // Clear any local auth data
        apiClient.clearAuthToken();
        return {
          message: 'Already logged out',
          data: true,
          success: true
        };
      }
      
      // Call logout API with the token
      const response = await apiClient.post<boolean>(this.endpoints.logout);
      
      if (response.success) {
        // Clear local storage on successful logout
        apiClient.clearAuthToken();
        return {
          message: response.message || 'Logged out successfully',
          data: true,
          success: true
        };
      } else {
        throw new Error(response.message || 'Logout failed');
      }
    } catch (error: unknown) {
      // Even if logout fails on server, clear local storage for security
      apiClient.clearAuthToken();
      
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      console.warn('Logout error:', errorMessage);
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post<string>(this.endpoints.refresh);
      
      if (response.success && response.data) {
        apiClient.setAuthToken(response.data);
        return response.data;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      apiClient.clearAuthToken();
      throw error;
    }
  }
  /**
   * Verify current token
   */
  async verifyToken(): Promise<boolean> {
    try {
      const response = await apiClient.get(this.endpoints.verify);
      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * Get current token from storage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
