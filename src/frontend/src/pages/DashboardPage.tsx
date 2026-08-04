import React from 'react';
import { useAuth } from '../auth';
import { ROLES } from '../utils/constants';
import './DashboardPage.css';

const scheduleTable = [
  {
    time: 'Morning',
    Mon: 'CS101 - R204',
    Tue: 'MATH230 - R108',
    Wed: '—',
    Thu: 'CS101 - R204',
    Fri: 'PHYS140 - Lab3',
    Sat: '—',
  },
  {
    time: 'Afternoon',
    Mon: '—',
    Tue: 'ENG201 - R305',
    Wed: 'MATH230 - R108',
    Thu: '—',
    Fri: 'ENG201 - R305',
    Sat: '—',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName ?? 'User';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="dash">
      <div className="dash__welcome">
        <div>
          <h1 className="dash__title">
            {greeting}, {displayName}!
          </h1>
          <p className="dash__subtitle">Here&apos;s your academic overview for this semester.</p>
        </div>
        <span className="dash__semester-badge"> Semester 2 · 2024-2025</span>
      </div>

      <div className="dash__stats">
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--blue"></div>
          <div>
            <div className="dash__stat-label">Registered Courses</div>
            <div className="dash__stat-value">5</div>
          </div>
          <span className="dash__stat-badge dash__stat-badge--up">Enrolled</span>
        </div>
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--clock"></div>
          <div>
            <div className="dash__stat-label">Total Credits</div>
            <div className="dash__stat-value">17</div>
          </div>
          <span className="dash__stat-badge dash__stat-badge--info">Current</span>
        </div>
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--star"></div>
          <div>
            <div className="dash__stat-label">Current GPA</div>
            <div className="dash__stat-value">7.8</div>
          </div>
          <span className="dash__stat-badge dash__stat-badge--trend">Cumulative</span>
        </div>
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--check"></div>
          <div>
            <div className="dash__stat-label">Completion</div>
            <div className="dash__stat-value">62%</div>
          </div>
          <div className="dash__mini-progress">
            <div className="dash__mini-fill" style={{ width: '62%' }} />
          </div>
        </div>
      </div>

      <div className="dash__schedule">
        <div className="dash__schedule-header">
          <h3 className="dash__schedule-title">Weekly Class Schedule</h3>
          <span className="dash__schedule-sub">Semester 2 · 2024-2025</span>
        </div>
        <div className="dash__schedule-table-wrapper">
          <table className="dash__schedule-table">
            <thead>
              <tr>
                <th></th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {scheduleTable.map((row) => (
                <tr key={row.time}>
                  <td className="dash__time-cell">{row.time}</td>
                  <td className={row.Mon !== '—' ? 'dash__class-cell' : 'dash__empty-cell'}>
                    {row.Mon}
                  </td>
                  <td className={row.Tue !== '—' ? 'dash__class-cell' : 'dash__empty-cell'}>
                    {row.Tue}
                  </td>
                  <td className={row.Wed !== '—' ? 'dash__class-cell' : 'dash__empty-cell'}>
                    {row.Wed}
                  </td>
                  <td className={row.Thu !== '—' ? 'dash__class-cell' : 'dash__empty-cell'}>
                    {row.Thu}
                  </td>
                  <td className={row.Fri !== '—' ? 'dash__class-cell' : 'dash__empty-cell'}>
                    {row.Fri}
                  </td>
                  <td className={row.Sat !== '—' ? 'dash__class-cell' : 'dash__empty-cell'}>
                    {row.Sat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
