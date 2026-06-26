import { TOKEN_KEY, USER_KEY } from './constants';
import type { AuthUser, AuthTokens } from '../types';

// ============================================================
// JWT / Session token utilities
// ============================================================

/** Persist the auth tokens and user profile returned by the login API. */
export function saveSession(tokens: AuthTokens, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Retrieve the raw JWT access token from local storage. */
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Retrieve the stored user object, or null if not authenticated. */
export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Return true when a valid (non-expired) token is present. */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  try {
    // Decode the payload (no crypto verification – server is the authority).
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry: number = payload.exp ?? 0;
    return Date.now() / 1000 < expiry;
  } catch {
    return false;
  }
}

/** Clear all session data from local storage (logout). */
export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Build an Authorization header value for Axios requests. */
export function bearerHeader(): string {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : '';
}
