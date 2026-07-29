import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '../utils/constants';
import type { UserRole } from '../types';

// ============================================================
// ProtectedRoute – guards routes by authentication & role
// ============================================================

interface ProtectedRouteProps {
  children: React.ReactElement;
  /** If provided, only users with this role may access the route. */
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login, preserving the attempted URL for post-login redirect.
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Authenticated but wrong role – redirect to dashboard.
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
