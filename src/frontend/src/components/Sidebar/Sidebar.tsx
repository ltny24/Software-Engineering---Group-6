import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHouse,
  FaUser,
  FaBookOpen,
  FaCalendarDays,
  FaGraduationCap,
  FaMoneyBillWave,
  FaFilePen,
  FaCircleQuestion,
  FaUsers,
  FaUpload,
  FaRightLeft,
  FaRightFromBracket,
  FaClipboardList,
} from 'react-icons/fa6';
import { useAuth } from '../../auth';
import { ROUTES, ROLES } from '../../utils/constants';
import './Sidebar.css';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: <FaHouse /> },
  { label: 'Profile', to: ROUTES.PROFILE, icon: <FaUser /> },
  { label: 'Courses', to: ROUTES.COURSES, icon: <FaBookOpen /> },
  { label: 'Timetable', to: ROUTES.TIMETABLE, icon: <FaCalendarDays /> },
  { label: 'Grades', to: ROUTES.GRADES, icon: <FaGraduationCap /> },
  { label: 'Tuition', to: ROUTES.TUITION, icon: <FaMoneyBillWave /> },
  { label: 'Appeals', to: ROUTES.APPEALS, icon: <FaFilePen /> },
  { label: 'Evaluations', to: ROUTES.EVALUATIONS, icon: <FaClipboardList /> },
  { label: 'Support', to: ROUTES.SUPPORT, icon: <FaCircleQuestion /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: <FaHouse /> },
  { label: 'Students', to: ROUTES.ADMIN_STUDENTS, icon: <FaUsers /> },
  { label: 'Bulk Import', to: ROUTES.ADMIN_IMPORT, icon: <FaUpload /> },
  { label: 'Transfers', to: ROUTES.ADMIN_TRANSFERS, icon: <FaRightLeft /> },
  { label: 'Appeals', to: ROUTES.ADMIN_APPEALS, icon: <FaFilePen /> },
  { label: 'Courses', to: ROUTES.COURSES, icon: <FaBookOpen /> },
  { label: 'Timetable', to: ROUTES.TIMETABLE, icon: <FaCalendarDays /> },
  { label: 'Support', to: ROUTES.SUPPORT, icon: <FaCircleQuestion /> },
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
        {navItems.map(({ label, to, icon, disabled }) => {
          if (disabled)
            return (
              <span key={label} className="sidebar__link sidebar__link--disabled">
                <span className="sidebar__link-icon">{icon}</span>
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
              <span className="sidebar__link-icon">{icon}</span>
              {label}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout}>
          <FaRightFromBracket /> Logout
        </button>
      </div>
    </aside>
  );
}
