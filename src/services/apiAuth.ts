import apiClient, { ApiResponse, setAuthToken, removeAuthToken } from './apiClient';

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface LoginData {
  email: string; // Can be email OR phone number
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  name?: string;
  full_name?: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    
    if (response.data.success && response.data.data) {
      // Store token
      setAuthToken(response.data.data.token);
      
      // Store user
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Registration failed',
    };
  }
}

/**
 * Login user with email or phone number
 * @param data.email - Can be either email address or phone number
 * @param data.password - User password
 */
export async function login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    
    if (response.data.success && response.data.data) {
      // Store token
      setAuthToken(response.data.data.token);
      
      // Store user
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Login failed',
    };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    
    if (response.data.success && response.data.data) {
      // Update stored user
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get user',
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  try {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    
    if (response.data.success && response.data.data) {
      // Update stored user
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update profile',
    };
  }
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse> {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to change password',
    };
  }
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Check if email is available (not already registered)
 */
export async function checkEmailAvailability(email: string): Promise<ApiResponse<{ available: boolean }>> {
  try {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to check email availability',
    };
  }
}

/**
 * Check if phone is available (not already registered)
 */
export async function checkPhoneAvailability(phone: string): Promise<ApiResponse<{ available: boolean }>> {
  try {
    const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
      `/auth/check-phone?phone=${encodeURIComponent(phone)}`
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to check phone availability',
    };
  }
}


