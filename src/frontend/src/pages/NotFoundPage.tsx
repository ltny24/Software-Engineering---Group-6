import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import './NotFoundPage.css';

/** 404 fallback page shown for unmatched routes. */
export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">Page Not Found</h1>
      <p className="not-found__message">
        The page you're looking for doesn't exist or you don't have permission to access it.
      </p>
      <Link id="link-go-home" to={ROUTES.DASHBOARD} className="not-found__btn">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
