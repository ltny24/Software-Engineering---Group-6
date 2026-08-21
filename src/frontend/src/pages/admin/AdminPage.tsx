import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaUpload,
  FaRightLeft,
  FaFilePen,
  FaBookOpen,
  FaCalendarDays,
  FaDownload,
  FaMoon,
  FaSun,
} from 'react-icons/fa6';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import AdminAppealsPage from './AdminAppealsPage';
import AdminAppealDetailPage from './AdminAppealDetailPage';
import AdminStudentsPage from './AdminStudentsPage';
import AdminStudentDetailPage from './AdminStudentDetailPage';
import ScheduleUploadPage from './ScheduleUploadPage';
import ClassTransferPage from './ClassTransferPage';
import BulkImportPage from './BulkImportPage';
import PlaceholderPage from '../../components/PlaceholderPage/PlaceholderPage';

import './AdminAppeals.css';
import './AdminStudents.css';
import './AdminPage.css';

const ADMIN_MODULES = [
  { label: 'Students', to: ROUTES.ADMIN_STUDENTS, icon: <FaUsers /> },
  { label: 'Bulk Import', to: ROUTES.ADMIN_IMPORT, icon: <FaUpload /> },
  { label: 'Transfers', to: ROUTES.ADMIN_TRANSFERS, icon: <FaRightLeft /> },
  { label: 'Appeals', to: ROUTES.ADMIN_APPEALS, icon: <FaFilePen /> },
  { label: 'Schedule Upload', to: ROUTES.ADMIN_SCHEDULE_UPLOAD, icon: <FaDownload /> },
  { label: 'Courses', to: ROUTES.COURSES, icon: <FaBookOpen /> },
  { label: 'Timetable', to: ROUTES.TIMETABLE, icon: <FaCalendarDays /> },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const { mode, toggle } = useTheme();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-top">
          <button type="button" className="theme-toggle" onClick={toggle}>
            {mode === 'day' ? (
              <FaMoon className="theme-toggle-icon" />
            ) : (
              <FaSun className="theme-toggle-icon theme-toggle-icon--sun" />
            )}
            <span>{mode === 'day' ? 'Night Mode' : 'Day Mode'}</span>
          </button>
        </div>
        <h1 className="admin-title">Administrator Dashboard</h1>
        <p className="admin-subtitle">Select a module to manage.</p>
      </div>

      <div className="admin-modules">
        {ADMIN_MODULES.map(({ label, to, icon }) => (
          <button key={to} type="button" className="admin-module-card" onClick={() => navigate(to)}>
            <span className="module-icon">{icon}</span>
            <span className="module-label">{label}</span>
          </button>
        ))}
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
      <Route path="/students" element={<AdminStudentsPage />} />
      <Route path="/students/:id" element={<AdminStudentDetailPage />} />
      <Route path="/schedule-upload" element={<ScheduleUploadPage />} />
      <Route path="/transfers" element={<ClassTransferPage />} />
      <Route path="/import" element={<BulkImportPage />} />
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
