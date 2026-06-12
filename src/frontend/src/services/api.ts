import axios from 'axios';

// Get Base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout after 10 seconds
});

// --------------------------------------------------------
// REQUEST INTERCEPTOR: Automatically attach Token
// --------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // Retrieve JWT Token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------------
// RESPONSE INTERCEPTOR: Global error handling
// --------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    // Return only data on success
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error('Error 401: Token expired or unauthorized.');
        // Clear token and redirect to login
        localStorage.removeItem('accessToken');
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

export default api;
