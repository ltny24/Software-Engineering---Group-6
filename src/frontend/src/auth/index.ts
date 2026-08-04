// ============================================================
// Auth Module – centralized exports
// ============================================================

export { AuthProvider, useAuth } from './useAuth';
export { login, logout, forgotPassword, resetPassword } from './authService';
export { default as ProtectedRoute } from './ProtectedRoute';
