import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import AdminAppealsPage from './AdminAppealsPage';
import AdminAppealDetailPage from './AdminAppealDetailPage';
import PlaceholderPage from '../../components/PlaceholderPage/PlaceholderPage';

import './AdminAppeals.css';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 className="admin-title">Administrator Dashboard</h1>
        <p className="admin-subtitle">Manage student records, bulk data, and appeals.</p>
      </div>

      <div className="admin-modules">
        <div className="admin-module-card" onClick={() => navigate(`${ROUTES.ADMIN}/appeals`)}>
          <div className="module-icon">⚖️</div>
          <h3>Appeal Processing Management</h3>
          <p>
            Review and process student grade appeals, set fee deadlines, and update appeal statuses.
          </p>
        </div>

        <div className="admin-module-card disabled">
          <div className="module-icon">👥</div>
          <h3>Student Data Administration</h3>
          <p>Search student records and manage data privacy (Coming soon).</p>
        </div>

        <div className="admin-module-card disabled">
          <div className="module-icon">📥</div>
          <h3>Bulk Data Import</h3>
          <p>Import course offerings, students, and grades (Coming soon).</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/appeals" element={<AdminAppealsPage />} />
      <Route path="/appeals/:id" element={<AdminAppealDetailPage />} />
      <Route
        path="*"
        element={
          <PlaceholderPage
            icon="⚠️"
            title="Admin Page Not Found"
            description="The requested admin module does not exist."
          />
        }
      />
    </Routes>
  );
}
