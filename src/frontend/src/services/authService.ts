import axiosInstance from '../api/axiosInstance';
import { saveSession, clearSession } from '../utils/tokenUtils';
import type { LoginRequest, LoginResponse } from '../types';

// ============================================================
// Auth Service – wraps /api/auth/* endpoints
// ============================================================

/**
 * POST /api/auth/login
 * Persists tokens to localStorage and returns the login response.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>(
    '/api/auth/login',
    credentials
  );
  saveSession(
    {
      accessToken: data.accessToken,
      tokenType: data.tokenType,
      expiresIn: data.expiresIn,
    },
    data.user
  );
  return data;
}

/**
 * POST /api/auth/logout
 * Clears local session regardless of server response.
 */
export async function logout(): Promise<void> {
  try {
    await axiosInstance.post('/api/auth/logout');
  } catch (error) {
    // Ignore server error on logout to ensure client session is always cleared
  } finally {
    clearSession();
  }
}
