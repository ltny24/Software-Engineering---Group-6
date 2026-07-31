import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import './SupportPage.css';

/**
 * Support hub – T034
 * Entry point for self-service support: the searchable FAQ library (T039)
 * and the AI learning path chatbot (T037, not yet implemented).
 */
export default function SupportPage() {
  return (
    <div className="support-hub">
      <div className="support-hub-header">
        <h2>💬 Help &amp; Support</h2>
        <p>Get instant answers or chat with our AI learning assistant.</p>
      </div>

      <div className="support-hub-grid">
        <Link to={ROUTES.SUPPORT_FAQ} className="support-hub-card">
          <span className="support-hub-icon" aria-hidden="true">
            ❓
          </span>
          <h3>Help &amp; FAQ</h3>
          <p>Search university policies, academic rules, and IT support answers.</p>
        </Link>

        <div className="support-hub-card support-hub-card-disabled">
          <span className="support-hub-icon" aria-hidden="true">
            🤖
          </span>
          <h3>AI Learning Assistant</h3>
          <p>Personalized course suggestions and graduation roadmaps.</p>
          <span className="badge badge--warning">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
