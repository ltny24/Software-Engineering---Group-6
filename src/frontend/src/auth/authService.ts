import axiosInstance from '../api/axiosInstance';
import { saveSession, clearSession } from '../utils/tokenUtils';
import type { LoginRequest, LoginResponse, AuthUser } from '../types';

// ============================================================
// Auth Service – wraps /api/auth/* endpoints
// ============================================================

/**
 * Normalize the backend role string (e.g. "ROLE_STUDENT") to the
 * frontend role enum value ("STUDENT").
 */
function normalizeRole(rawRole: string): 'STUDENT' | 'ADMIN' {
  if (rawRole === 'ROLE_ADMINISTRATOR' || rawRole === 'ADMINISTRATOR' || rawRole === 'ADMIN') {
    return 'ADMIN';
  }
  return 'STUDENT';
}

/**
 * POST /api/auth/login
 * Persists tokens to localStorage and returns the login response.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/api/auth/login', credentials);

  // Map the backend UserInfo to the frontend AuthUser shape
  if (data.user) {
    const backendUser = data.user as Record<string, unknown>;
    const mappedUser: AuthUser = {
      id: String(backendUser.id ?? ''),
      username: String(backendUser.username ?? credentials.username),
      email: String(backendUser.email ?? ''),
      role: normalizeRole(String(backendUser.role ?? 'STUDENT')),
      displayName: String(backendUser.displayName ?? backendUser.username ?? credentials.username),
    };

    saveSession(
      {
        accessToken: data.accessToken,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
      },
      mappedUser
    );

    return { ...data, user: mappedUser };
  }

  return data;
}

/**
 * POST /api/auth/logout
 * Clears local session regardless of server response.
 */
export async function logout(): Promise<void> {
  try {
    await axiosInstance.post('/api/auth/logout');
  } finally {
    clearSession();
  }
}
