import { apiClient } from '../client';
import { 
  LoginRequest, 
  LoginResponse, 
  EmailLoginData, 
  WalletLoginData, 
  UserRegistrationRequest, 
  RegisterResponse, 
  User, 
  ApiResponse,
  VerificationRequest,
  AuthUser,
  PasswordResetRequest,
  PasswordResetConfirmRequest
} from '../types';

export class AuthService {  private readonly endpoints = {
    login: '/api/users/login',
    register: '/api/users/register',
    logout: '/api/users/logout',
    refresh: '/api/users/refresh',
    verify: '/api/users/verify',
    verifyEmail: '/api/users/verify',
    resendVerification: '/api/users/resend-verification',
    forgotPassword: '/api/users/forgot-password',
    resetPassword: '/api/users/reset-password',
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
  }  /**
   * Verify current token
   */
  async verifyToken(): Promise<AuthUser | boolean> {
    try {
      const response = await apiClient.get(this.endpoints.verify);
      if (response.success) {
        // If we get a success response, we assume the token is valid
        // Return a mock user object since we don't have detailed user info
        const userData: AuthUser = {
          id: 'current_user',
          email: 'user@example.com', // This will be replaced with actual data from backend
          walletAddress: undefined,
          loginMethod: 'email',
          isAuthenticated: true,
        };
        return userData;
      } else {
        return false;
      }
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

  /**
   * Verify email using verification code
   * 
   * @param email User's email
   * @param code 6-digit verification code
   * @returns ApiResponse with success/error message
   */
  async verifyEmail(email: string, code: string): Promise<ApiResponse<boolean>> {
    const verificationRequest: VerificationRequest = {
      email,
      code
    };

    try {
      // Debug log
      console.log('🔍 Verification Request:', JSON.stringify(verificationRequest, null, 2));
      
      const response = await apiClient.post<boolean>(this.endpoints.verifyEmail, verificationRequest);
      
      return {
        message: response.message,
        data: response.data || false,
        success: response.success
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      console.error('❌ Email verification error:', errorMessage);
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  }

  /**
   * Resend verification code to user's email
   * 
   * @param email User's email address
   * @returns ApiResponse with success/error message
   */
  async resendVerificationCode(email: string): Promise<ApiResponse<boolean>> {
    try {
      // Debug log
      console.log('🔍 Resending verification code to:', email);
      
      const response = await apiClient.post<boolean>(`${this.endpoints.resendVerification}?email=${encodeURIComponent(email)}`);
      
      return {
        message: response.message,
        data: response.data || false,
        success: response.success
      };
    } catch (error: unknown) {      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification code';
      console.error('❌ Resend verification code error:', errorMessage);
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  }

  /**
   * Request password reset email
   * 
   * @param email User's email address
   * @returns ApiResponse with success/error message
   */
  async forgotPassword(email: string): Promise<ApiResponse<boolean>> {
    const request: PasswordResetRequest = {
      email
    };    try {
      // Debug log
      console.log('🔍 Forgot Password Request:', JSON.stringify(request, null, 2));
      console.log('🔍 Forgot Password URL:', this.endpoints.forgotPassword);
      
      // Use postPublic to avoid sending authentication token
      const response = await apiClient.postPublic<boolean>(this.endpoints.forgotPassword, request);
      
      return {
        message: response.message,
        data: response.data || false,
        success: response.success
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      console.error('❌ Forgot password error:', errorMessage);
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  }

  /**
   * Reset password with verification code
   * 
   * @param email User's email address
   * @param code Verification code from email
   * @param newPassword New password to set
   * @returns ApiResponse with success/error message
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<ApiResponse<boolean>> {
    const request: PasswordResetConfirmRequest = {
      email,
      code,
      newPassword
    };

    try {      // Debug log (excluding password for security)
      console.log('🔍 Reset Password Request:', JSON.stringify({
        email: request.email,
        code: request.code,
        newPassword: '[HIDDEN]'
      }, null, 2));
      
      // Use postPublic to avoid sending authentication token
      const response = await apiClient.postPublic<boolean>(this.endpoints.resetPassword, request);
      
      return {
        message: response.message,
        data: response.data || false,
        success: response.success
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      console.error('❌ Reset password error:', errorMessage);
      
      return {
        message: errorMessage,
        data: false,
        success: false
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
