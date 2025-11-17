import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout (increased for database operations)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or cookies
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // Handle errors
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      // Timeout error - retry once for GET requests
      if (config && config.method === "get" && !config._retry) {
        config._retry = true;
        console.warn("Request timeout - Retrying...");
        
        try {
          return await apiClient.request(config);
        } catch (retryError) {
          console.error("Retry failed");
          return Promise.reject(new Error("Request timeout. Please try again."));
        }
      }
      
      console.warn("Request timeout - Backend might be slow or unavailable");
      return Promise.reject(new Error("Request timeout. Please try again."));
    } else if (error.response) {
      // Server responded with error
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "An error occurred";

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          // Redirect to login if needed
          // window.location.href = '/login';
        }
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      console.warn("No response from server - Backend might be offline");
      return Promise.reject(
        new Error(
          "Cannot connect to server. Please check if backend is running."
        )
      );
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default apiClient;

// Helper function to handle API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  error?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Helper to set auth token
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

// Helper to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }
};

// Helper to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};
