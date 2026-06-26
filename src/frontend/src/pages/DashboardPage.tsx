import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { ROUTES, ROLES } from '../utils/constants';
import './DashboardPage.css';

// ── Student quick-access cards ──────────────────────────────

const studentCards = [
  {
    id:    'dash-card-profile',
    icon:  '👤',
    title: 'My Profile',
    desc:  'View and update your personal information.',
    to:    ROUTES.PROFILE,
  },
  {
    id:    'dash-card-courses',
    icon:  '📚',
    title: 'Course Registration',
    desc:  'Browse available courses and register for the semester.',
    to:    ROUTES.COURSES,
  },
  {
    id:    'dash-card-timetable',
    icon:  '🗓️',
    title: 'Timetable',
    desc:  'View your weekly class schedule.',
    to:    ROUTES.TIMETABLE,
  },
  {
    id:    'dash-card-grades',
    icon:  '📊',
    title: 'Grades & GPA',
    desc:  'Check your academic performance and GPA.',
    to:    ROUTES.GRADES,
  },
  {
    id:    'dash-card-tuition',
    icon:  '💳',
    title: 'Tuition & Fees',
    desc:  'Review your tuition balance and payment history.',
    to:    ROUTES.TUITION,
  },
  {
    id:    'dash-card-appeals',
    icon:  '📝',
    title: 'Grade Appeals',
    desc:  'Submit or track a grade appeal request.',
    to:    ROUTES.APPEALS,
  },
  {
    id:    'dash-card-support',
    icon:  '💬',
    title: 'Support & FAQs',
    desc:  'Access FAQs and the AI learning path chatbot.',
    to:    ROUTES.SUPPORT,
  },
];

// ── Admin quick-access cards ─────────────────────────────────

const adminCards = [
  {
    id:    'dash-card-students',
    icon:  '👥',
    title: 'Student Records',
    desc:  'Search and view detailed student records.',
    to:    ROUTES.ADMIN_STUDENTS,
  },
  {
    id:    'dash-card-import',
    icon:  '📥',
    title: 'Bulk Import',
    desc:  'Import student, course, and enrollment data in bulk.',
    to:    ROUTES.ADMIN_IMPORT,
  },
  {
    id:    'dash-card-transfers',
    icon:  '🔄',
    title: 'Class Transfers',
    desc:  'Review and manage class transfer requests.',
    to:    ROUTES.ADMIN_TRANSFERS,
  },
  {
    id:    'dash-card-admin-appeals',
    icon:  '⚖️',
    title: 'Grade Appeals',
    desc:  'Process pending grade appeals and record decisions.',
    to:    ROUTES.ADMIN_APPEALS,
  },
];

// ── Component ─────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin  = user?.role === ROLES.ADMIN;
  const cards    = isAdmin ? adminCards : studentCards;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="dashboard">
      {/* Hero banner */}
      <div className="dashboard__hero">
        <div className="dashboard__hero-text">
          <h1 className="dashboard__greeting">
            {greeting}, {user?.displayName ?? 'User'} 👋
          </h1>
          <p className="dashboard__tagline">
            {isAdmin
              ? 'Manage student records, bulk imports, class transfers, and grade appeals.'
              : 'Manage your courses, grades, tuition, and support resources in one place.'}
          </p>
        </div>
        <div className="dashboard__hero-badge">
          <span className="badge badge--primary">{user?.role}</span>
        </div>
      </div>

      {/* Quick-access grid */}
      <section aria-labelledby="dashboard-section-heading">
        <h2 id="dashboard-section-heading" className="dashboard__section-title">
          Quick Access
        </h2>
        <div className="dashboard__grid">
          {cards.map(({ id, icon, title, desc, to }) => (
            <Link key={id} id={id} to={to} className="dashboard__card">
              <span className="dashboard__card-icon" aria-hidden="true">
                {icon}
              </span>
              <div>
                <p className="dashboard__card-title">{title}</p>
                <p className="dashboard__card-desc">{desc}</p>
              </div>
              <span className="dashboard__card-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
