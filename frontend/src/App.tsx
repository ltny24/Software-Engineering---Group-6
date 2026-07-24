import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from './auth';
import Layout from './components/Layout/Layout';
import { ROUTES, ROLES } from './utils/constants';

// ============================================================
// Lazy-loaded pages – code splitting for faster initial load
// ============================================================

const LoginPage = lazy(() => import('./features/login/LoginPage'));
const NotFoundPage = lazy(() => import('./features/not-found/NotFoundPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));

// Student pages
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const CoursesPage = lazy(() => import('./features/courses/CoursesPage'));
const TimetablePage = lazy(() => import('./features/timetable/TimetablePage'));
const GradesPage = lazy(() => import('./features/grades/GradesPage'));
const TuitionPage = lazy(() => import('./features/tuition/TuitionPage'));
const AppealsPage = lazy(() => import('./features/appeals/AppealsPage'));
const SupportPage = lazy(() => import('./features/support/SupportPage'));

// Admin pages
const AdminPage = lazy(() => import('./features/admin/AdminPage'));

// ============================================================
// Global loading fallback
// ============================================================

function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <span className="spinner spinner--lg" aria-label="Loading page…" />
    </div>
  );
}

// ============================================================
// App – routing configuration
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
            },
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public ── */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            {/* ── Protected student & shared routes ── */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.COURSES}
              element={
                <ProtectedRoute>
                  <Layout>
                    <CoursesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TIMETABLE}
              element={
                <ProtectedRoute>
                  <Layout>
                    <TimetablePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.GRADES}
              element={
                <ProtectedRoute>
                  <Layout>
                    <GradesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TUITION}
              element={
                <ProtectedRoute>
                  <Layout>
                    <TuitionPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={`${ROUTES.APPEALS}/*`}
              element={
                <ProtectedRoute>
                  <Layout>
                    <AppealsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SUPPORT}
              element={
                <ProtectedRoute>
                  <Layout>
                    <SupportPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* ── Protected admin routes ── */}
            <Route
              path={`${ROUTES.ADMIN}/*`}
              element={
                <ProtectedRoute requiredRole={ROLES.ADMIN}>
                  <Layout>
                    <AdminPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* ── Fallbacks ── */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
