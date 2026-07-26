import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser } from '../types';
import { getStoredUser, isAuthenticated, clearSession } from '../utils/tokenUtils';
import { logout as logoutApi } from '../services/authService';

// ============================================================
// Auth Context – global authentication state
// ============================================================

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Rehydrate from localStorage on first render.
    return isAuthenticated() ? getStoredUser() : null;
  });

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth state anywhere in the component tree. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
