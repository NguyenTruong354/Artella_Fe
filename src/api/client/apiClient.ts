import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../types';
import config from '../../config/env';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = config.API_BASE_URL) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add IP address if needed (for rate limiting)
        // Note: IP will be automatically detected by backend
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) => {
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
        };

        if (error.response?.data) {
          apiError.message = error.response.data.message || apiError.message;
          apiError.errors = error.response.data.errors;
        } else if (error.message) {
          apiError.message = error.message;
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        } else if (error.response?.status === 429) {
          // Rate limited
          apiError.message = 'Too many requests. Please try again later.';
        }

        return Promise.reject(apiError);
      }
    );
  }
  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.request<ApiResponse<T>>(config);
    return response.data;
  }
  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    console.log('🔍 API GET Request:', {
      url: `${this.baseURL}${url}`,
      config
    });
    
    try {
      const result = await this.request<T>({ ...config, method: 'GET', url });
      console.log('✅ API GET Success:', result);
      return result;
    } catch (error) {
      console.error('❌ API GET Error:', error);
      throw error;
    }
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // Set base URL
  public setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.instance.defaults.baseURL = baseURL;
  }

  // Set auth token
  public setAuthToken(token: string): void {
    this.instance.defaults.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  }

  // Clear auth token
  public clearAuthToken(): void {
    delete this.instance.defaults.headers.Authorization;
    localStorage.removeItem('auth_token');
  }
  // Public endpoints without authentication
  public async postPublic<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    // Create a new axios instance for public requests without default auth headers
    const publicInstance = axios.create({
      baseURL: this.baseURL,
      timeout: config?.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    try {
      const response = await publicInstance.post<ApiResponse<T>>(url, data, config);
      return response.data;    } catch (error: unknown) {
      // Handle errors similar to main interceptor
      const axiosError = error as AxiosError;
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: axiosError?.response?.status,
      };      if (axiosError?.response?.data) {
        const responseData = axiosError.response.data as Record<string, unknown>;
        apiError.message = (responseData.message as string) || apiError.message;
        apiError.errors = responseData.errors as Record<string, string[]>;
      } else if (axiosError?.message) {
        apiError.message = axiosError.message;
      }

      return Promise.reject(apiError);
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
