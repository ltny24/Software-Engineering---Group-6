import axios from 'axios';
import { API_BASE_URL, ROUTES } from '../utils/constants';
import { getAccessToken, clearSession } from '../utils/tokenUtils';

// ============================================================
// Axios Instance – pre-configured for the MyUS backend
// ============================================================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ----- Request interceptor – attach JWT bearer token -----
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response interceptor – handle 401 globally -----
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid – clear session and redirect to login.
      clearSession();
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
