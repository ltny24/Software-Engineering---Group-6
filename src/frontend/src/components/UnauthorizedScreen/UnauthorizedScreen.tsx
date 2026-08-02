import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { ROUTES } from '../../utils/constants';
import './UnauthorizedScreen.css';

// ── Inline SVG icons (no external dep needed) ──────────────────────────────

function IconLock() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconWarn() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ── Props ───────────────────────────────────────────────────────────────────

interface UnauthorizedScreenProps {
  /** Human-readable name of the resource the user tried to access. */
  resourceName?: string;
  /** The permission code required. */
  requiredPermission?: string;
  /** UC reference string (e.g. "UC07 · Alt Flow 2.1"). */
  ucReference?: string;
  /** Called when user clicks "Request Access". */
  onRequestAccess?: () => void;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function UnauthorizedScreen({
  resourceName = 'Admin Dashboard',
  requiredPermission = 'admin.access',
  ucReference = 'UC07 · Alt Flow 2.1',
  onRequestAccess,
}: UnauthorizedScreenProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const errorRef = `AUTH-${now.toISOString().slice(0, 10).replace(/-/g, '')}`;
  const timeStr = now.toLocaleTimeString();

  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : 'Student';

  const handleRequestAccess = () => {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      // Default: show a simple alert (can be wired to a real API later)
      alert('Access request submitted. A Super Administrator will be notified.');
    }
  };

  return (
    <div className="unauth-root">
      <div className="unauth-card">
        {/* ── Lock icon with X badge ── */}
        <div className="unauth-icon-wrap">
          <div className="unauth-lock-circle">
            <IconLock />
          </div>
          <div className="unauth-x-badge">
            <IconX />
          </div>
        </div>

        {/* ── Title & description ── */}
        <div className="unauth-heading">
          <h2 className="unauth-title">Access Denied</h2>
          <p className="unauth-desc">
            Your account does not have sufficient permissions to access{' '}
            <strong>{resourceName}</strong>.
          </p>
        </div>

        {/* ── Detail card ── */}
        <div className="unauth-detail-card">
          <div className="unauth-detail-row">
            <span className="unauth-detail-label">Signed in as</span>
            <span className="unauth-detail-value unauth-mono">
              {user?.email ?? user?.username ?? '—'}
            </span>
          </div>
          <div className="unauth-detail-row">
            <span className="unauth-detail-label">Role</span>
            <span className="unauth-role-badge">{roleLabel}</span>
          </div>
          <div className="unauth-detail-row">
            <span className="unauth-detail-label">Required permission</span>
            <span className="unauth-detail-value unauth-mono">{requiredPermission}</span>
          </div>
          <div className="unauth-detail-row">
            <span className="unauth-detail-label">UC Reference</span>
            <span className="unauth-detail-value unauth-violet">{ucReference}</span>
          </div>
        </div>

        {/* ── Warning note ── */}
        <div className="unauth-note">
          <span className="unauth-note-icon">
            <IconWarn />
          </span>
          <p className="unauth-note-text">
            This access attempt has been recorded in the audit log. Contact a{' '}
            <strong>Super Administrator</strong> or <strong>Administrator</strong> to request
            elevated permissions.
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="unauth-actions">
          <button className="unauth-btn-primary" onClick={handleRequestAccess}>
            Request Access from Administrator
          </button>
          <button className="unauth-btn-ghost" onClick={() => navigate(ROUTES.DASHBOARD)}>
            ← Return to Dashboard
          </button>
        </div>

        {/* ── Error ref ── */}
        <p className="unauth-error-ref">
          Error ref: {errorRef} · {timeStr}
        </p>
      </div>
    </div>
  );
}
