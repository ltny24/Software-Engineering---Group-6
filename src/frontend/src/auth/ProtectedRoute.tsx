import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '../utils/constants';
import type { UserRole } from '../types';
import UnauthorizedScreen from '../components/UnauthorizedScreen/UnauthorizedScreen';

// ============================================================
// ProtectedRoute – guards routes by authentication & role
// ============================================================

interface ProtectedRouteProps {
  children: React.ReactElement;
  /** If provided, only users with this role may access the route. */
  requiredRole?: UserRole;
  /** Human-readable name of the resource (shown in the Unauthorized screen). */
  resourceName?: string;
  /** Required permission code (shown in the Unauthorized screen). */
  requiredPermission?: string;
  /** UC reference string (shown in the Unauthorized screen). */
  ucReference?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  resourceName,
  requiredPermission,
  ucReference,
}: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login, preserving the attempted URL for post-login redirect.
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Authenticated but wrong role – show the Access Denied screen in-place.
    return (
      <UnauthorizedScreen
        resourceName={resourceName}
        requiredPermission={requiredPermission}
        ucReference={ucReference}
      />
    );
  }

  return children;
}
