import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useAuth } from '../../auth';
import { useTheme } from '../../context/ThemeContext';
import { FaStar } from 'react-icons/fa6';
import { ROUTES } from '../../utils/constants';
import './Layout.css';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PROFILE]: 'My Profile',
  [ROUTES.COURSES]: 'Course Catalog',
  [ROUTES.TIMETABLE]: 'Academic Timetable',
  [ROUTES.GRADES]: 'Grades & GPA',
  [ROUTES.TUITION]: 'Tuition & Fees',
  [ROUTES.APPEALS]: 'Grade Appeals',
  [ROUTES.SUPPORT]: 'Help & Support',
  [ROUTES.SUPPORT_FAQ]: 'FAQ',
  [ROUTES.SUPPORT_AI_CHATBOT]: 'AI Assistant',
  [ROUTES.ADMIN_STUDENTS]: 'Student Records',
  [ROUTES.ADMIN_IMPORT]: 'Reports',
  [ROUTES.ADMIN_TRANSFERS]: 'Class Transfers',
  [ROUTES.ADMIN_APPEALS]: 'Appeals',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const subPath = location.pathname;
  const title = PAGE_TITLES[subPath] || 'Dashboard';

  const { mode, bgDensity, setBgDensity } = useTheme();
  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() ?? 'A';

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <header className="layout__topbar">
          <h1 className="layout__topbar-title">{title}</h1>
          <div className="flex items-center gap-4 ml-auto mr-4">
            {mode === 'night' && (
              <div className="flex items-center gap-2 bg-surface-elevated/60 backdrop-blur rounded-full px-3 py-1 border border-border-card shadow-sm">
                <FaStar className="text-primary-container text-sm" />
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={bgDensity}
                  onChange={(e) => setBgDensity(Number(e.target.value))}
                  className="w-20 h-1.5 rounded-full accent-primary cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="topbar__actions">
            <Link to={ROUTES.PROFILE} className="topbar__user">
              <div className="topbar__user-avatar">{userInitial}</div>
              <div className="topbar__user-info">
                <span className="topbar__user-name">{user?.displayName}</span>
                <span className="topbar__user-role">{user?.role}</span>
              </div>
            </Link>
          </div>
        </header>
        <main id="main-content" className="layout__content">
          <div className="layout__container">{children}</div>
        </main>
      </div>
    </div>
  );
}
