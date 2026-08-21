import axiosInstance from '../api/axiosInstance';
import type { AxiosRequestConfig } from 'axios';

// ============================================================
// Generic API wrapper – delegates to the shared Axios instance
// so every request uses the same timeout, auth token, and error
// handling defined in ../api/axiosInstance.
// ============================================================

const api = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data as T;
  },
  post: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data as T;
  },
  put: async <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data as T;
  },
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data as T;
  },
};

export default api;
