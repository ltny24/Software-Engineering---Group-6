// ============================================================
// MyUS University Portal – App-wide Constants
// ============================================================

/** Base URL of the Spring Boot backend. */
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080';

/** Local-storage key for the JWT access token. */
export const TOKEN_KEY = 'myus_access_token';

/** Local-storage key for the currently authenticated user object. */
export const USER_KEY = 'myus_user';

/** Default pagination page size used across list views. */
export const DEFAULT_PAGE_SIZE = 20;

/** Application display name (used in <title> and headings). */
export const APP_NAME = process.env.REACT_APP_APP_NAME ?? 'MyUS University Portal';

/** Front-end route paths – single source of truth for <Link> and navigate(). */
export const ROUTES = {
  // Public
  LOGIN: '/login',

  // Shared / root
  DASHBOARD: '/',

  // Student
  PROFILE: '/profile',
  COURSES: '/courses',
  TIMETABLE: '/timetable',
  GRADES: '/grades',
  TUITION: '/tuition',
  APPEALS: '/appeals',
  APPEALS_NEW: '/appeals/new',
  SUPPORT: '/support',

  // Admin
  ADMIN: '/admin',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_IMPORT: '/admin/import',
  ADMIN_TRANSFERS: '/admin/transfers',
  ADMIN_APPEALS: '/admin/appeals',

  // Fallback
  NOT_FOUND: '/404',
} as const;

/** User roles – must match backend enum values. */
export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const;
