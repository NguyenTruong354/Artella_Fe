// Utility functions for API handling

/**
 * Format error messages for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Object) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }

    if ('errors' in error && typeof error.errors === 'object' && error.errors) {
      // Handle validation errors
      const errorMessages = Object.values(error.errors).flat();
      return errorMessages.join(', ');
    }
  }

  return 'An unexpected error occurred';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Object) {
        return (
            ('code' in error && error.code === 'NETWORK_ERROR') ||
            ('message' in error &&
                typeof error.message === 'string' &&
                error.message.includes('Network Error')) ||
            !('status' in error)
        );
    }
    return !error;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
    if (error instanceof Object && 'status' in error) {
        return error.status === 401 || error.status === 403;
    }
    return false;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
    if (error instanceof Object && 'status' in error && 'errors' in error) {
        return error.status === 400 && !!error.errors;
    }
    return false;
};

/**
 * Check if error is a rate limit error
 */
export const isRateLimitError = (error: unknown): boolean => {
    if (error instanceof Object && 'status' in error) {
        return error.status === 429;
    }
    return false;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Don't retry on certain errors
      if (isAuthError(error) || isValidationError(error)) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Debounce function for API calls
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Storage utilities with error handling
 */
export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to set item in localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove item from localStorage:', error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }
};

/**
 * Generate random request ID for tracking
 */
export const generateRequestId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate wallet address format (basic validation)
 */
export const isValidWalletAddress = (address: string): boolean => {
  // Basic Ethereum address validation
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
};
