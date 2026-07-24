import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { ROUTES, ROLES } from '../../utils/constants';
import './Sidebar.css';

const studentNav = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: '🏠' },
  { label: 'My Profile', to: ROUTES.PROFILE, icon: '👤' },
  { label: 'Courses', to: ROUTES.COURSES, icon: '📚' },
  { label: 'Timetable', to: ROUTES.TIMETABLE, icon: '🗓️' },
  { label: 'Grades', to: ROUTES.GRADES, icon: '📊' },
  { label: 'Tuition', to: ROUTES.TUITION, icon: '💳' },
  { label: 'Appeals', to: ROUTES.APPEALS, icon: '📝' },
  { label: 'Support', to: ROUTES.SUPPORT, icon: '💬' },
];

const adminNav = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: '🏠' },
  { label: 'Students', to: ROUTES.ADMIN_STUDENTS, icon: '👥' },
  { label: 'Bulk Import', to: ROUTES.ADMIN_IMPORT, icon: '📥' },
  { label: 'Transfers', to: ROUTES.ADMIN_TRANSFERS, icon: '🔄' },
  { label: 'Appeals', to: ROUTES.ADMIN_APPEALS, icon: '⚖️' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === ROLES.ADMIN ? adminNav : studentNav;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Backend không có API logout, tự động xóa session local.');
    } finally {
      localStorage.clear();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__brand">
        <span className="sidebar__logo">🎓</span>
        <span className="sidebar__app-name">MyUS Portal</span>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {navItems.map(({ label, to, icon }) => (
            <li key={to} className="sidebar__item">
              <NavLink
                to={to}
                end={to === ROUTES.DASHBOARD}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                <span className="sidebar__icon" aria-hidden="true">
                  {icon}
                </span>
                <span className="sidebar__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__user-name">{user?.displayName}</span>
          <span className="sidebar__user-role">{user?.role}</span>
        </div>
        <button
          id="btn-logout"
          className="sidebar__logout"
          onClick={handleLogout}
          aria-label="Logout"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
