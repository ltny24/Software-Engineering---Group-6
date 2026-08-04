import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { ROUTES, ROLES } from '../../utils/constants';
import './Sidebar.css';

interface NavItem {
  label: string;
  to: string;
  disabled?: boolean;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
  { label: 'Profile', to: ROUTES.PROFILE },
  { label: 'Courses', to: ROUTES.COURSES },
  { label: 'Timetable', to: ROUTES.TIMETABLE },
  { label: 'Grades', to: ROUTES.GRADES },
  { label: 'Tuition', to: ROUTES.TUITION },
  { label: 'Appeals', to: ROUTES.APPEALS },
  { label: 'Support', to: ROUTES.SUPPORT },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
  { label: 'Students', to: ROUTES.ADMIN_STUDENTS },
  { label: 'Bulk Import', to: ROUTES.ADMIN_IMPORT },
  { label: 'Transfers', to: ROUTES.ADMIN_TRANSFERS },
  { label: 'Appeals', to: ROUTES.ADMIN_APPEALS },
  { label: 'Courses', to: ROUTES.COURSES },
  { label: 'Timetable', to: ROUTES.TIMETABLE },
  { label: 'Support', to: ROUTES.SUPPORT },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === ROLES.ADMIN ? adminNav : studentNav;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* fallback */
    } finally {
      localStorage.clear();
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/hcmus-logo.png" alt="HCMUS Logo" className="sidebar__logo-img" />
        <span className="sidebar__app-name">MyUS Portal</span>
      </div>
      <nav className="sidebar__nav">
        {navItems.map(({ label, to, disabled }) => {
          if (disabled)
            return (
              <span key={label} className="sidebar__link sidebar__link--disabled">
                {label}
              </span>
            );
          return (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
