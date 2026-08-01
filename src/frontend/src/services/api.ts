import axios, { type AxiosRequestConfig } from 'axios';
import { getAccessToken } from '../utils/tokenUtils';
import { API_BASE_URL } from '../utils/constants';

// Create an Axios instance
const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout after 10 seconds
});

// --------------------------------------------------------
// REQUEST INTERCEPTOR: Automatically attach Token
// --------------------------------------------------------
baseApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------------
// RESPONSE INTERCEPTOR: Global error handling
// --------------------------------------------------------
baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error('Error 401: Token expired or unauthorized.');
        // Clear token and redirect to login
        localStorage.removeItem('myus_access_token');
        localStorage.removeItem('myus_user');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Error 403: Forbidden. You do not have permission.');
      } else if (status >= 500) {
        console.error('Error 5xx: Backend server error.');
      }
    } else {
      console.error('Network error or server is unresponsive!');
    }

    // Forward the error so the calling component can handle the UI (e.g., Toast)
    return Promise.reject(error);
  }
);

const api = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await baseApi.get<T>(url, config);
    return response.data as T;
  },
  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await baseApi.post<T>(url, data, config);
    return response.data as T;
  },
  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await baseApi.put<T>(url, data, config);
    return response.data as T;
  },
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await baseApi.delete<T>(url, config);
    return response.data as T;
  },
};

export default api;
