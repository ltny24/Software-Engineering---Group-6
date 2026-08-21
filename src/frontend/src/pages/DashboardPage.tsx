import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { getMyRegistrations } from '../services/courseService';
import type { CourseRegistration } from '../types';
import {
  FaCalendarDays,
  FaLocationDot,
  FaCircleCheck,
  FaClock,
  FaGraduationCap,
  FaChartLine,
  FaMoneyBillWave,
  FaTriangleExclamation,
  FaBullhorn,
  FaMoon,
  FaSun,
} from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import './DashboardPage.css';

// ── Demo schedule data ──────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
type DayKey = (typeof DAYS)[number];

interface ScheduleCell {
  courseName: string;
  courseCode: string;
  timeRange: string;
  room: string;
  colorIndex: number;
}

type TimeSlotKey = 'Morning' | 'Afternoon';

interface ScheduleRow {
  timeLabel: string;
  cells: Record<DayKey, ScheduleCell | null>;
}

// ── Helpers ─────────────────────────────────────────────────────────
function parseDayAbbr(day: string): DayKey | null {
  const map: Record<string, DayKey> = {
    mon: 'Mon',
    monday: 'Mon',
    tue: 'Tue',
    tuesday: 'Tue',
    wed: 'Wed',
    wednesday: 'Wed',
    thu: 'Thu',
    thursday: 'Thu',
    fri: 'Fri',
    friday: 'Fri',
    sat: 'Sat',
    saturday: 'Sat',
  };
  return map[day.toLowerCase().trim()] ?? null;
}

function parseScheduleEntries(scheduleStr: string): { days: DayKey[]; timeRange: string }[] {
  if (!scheduleStr) return [];
  const parts = scheduleStr.split('|');
  const results: { days: DayKey[]; timeRange: string }[] = [];
  for (const part of parts) {
    const cleaned = part.replace(/^.*?Lab:\s*/i, '').trim();
    const match = cleaned.match(/([A-Za-z/,\s]+?)\s+(\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2})/);
    if (match) {
      const timeRange = match[2].replace(/\s*[-–—]\s*/, ' - ');
      const days = match[1]
        .split(/[/,\s]+/)
        .map((d) => parseDayAbbr(d))
        .filter((d): d is DayKey => d !== null);
      if (days.length > 0) {
        results.push({ days, timeRange });
      }
    }
  }
  return results;
}

function getTimeSlot(timeRange: string): TimeSlotKey {
  const startHour = parseInt(timeRange.split(':')[0], 10);
  if (startHour < 12) return 'Morning';
  return 'Afternoon'; // afternoon + evening courses all go into Afternoon row
}

function buildScheduleRows(registrations: CourseRegistration[]): ScheduleRow[] {
  const timeSlots: TimeSlotKey[] = ['Morning', 'Afternoon'];
  const rows: ScheduleRow[] = timeSlots.map((label) => ({
    timeLabel: label,
    cells: Object.fromEntries(DAYS.map((d) => [d, null])) as Record<DayKey, ScheduleCell | null>,
  }));
  const enrolled = registrations.filter((r) => r.status?.toLowerCase() === 'enrolled');
  let colorIdx = 0;
  const courseColorMap = new Map<string, number>();
  enrolled.forEach((reg) => {
    const entries = parseScheduleEntries(reg.offering.schedule);
    const courseKey = reg.offering.course.courseCode;
    if (!courseColorMap.has(courseKey)) courseColorMap.set(courseKey, colorIdx++);
    entries.forEach(({ days, timeRange }) => {
      const slot = getTimeSlot(timeRange);
      const rowIdx = timeSlots.indexOf(slot);
      const cell: ScheduleCell = {
        courseName: reg.offering.course.courseName,
        courseCode: reg.offering.course.courseCode,
        timeRange,
        room: reg.offering.room
          ? `${reg.offering.location || ''} ${reg.offering.room}`.trim()
          : reg.offering.location || '—',
        colorIndex: courseColorMap.get(courseKey)! % 4,
      };
      days.forEach((day) => {
        if (rowIdx !== -1) {
          rows[rowIdx].cells[day] = cell;
        }
      });
    });
  });
  return rows;
}

// ── Component ───────────────────────────────────────────────────────
const useSafeNavigate = () => {
  try {
    return useNavigate();
  } catch {
    return (path: string) => {
      if (typeof window !== 'undefined') {
        window.location.hash = path;
      }
    };
  }
};

interface TodayClassItem {
  courseCode: string;
  courseName: string;
  timeRange: string;
  timeLabel: string;
  ampm: string;
  room: string;
  status: 'Ongoing' | 'Upcoming' | 'Scheduled';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useSafeNavigate();
  const displayName = user?.displayName ?? 'Nguyen Anh Tuan';
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);
  const [todayClasses, setTodayClasses] = useState<TodayClassItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [totalCredits, setTotalCredits] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [gpa, setGpa] = useState(0); // 4.0-scale display value
  const [gpa10, setGpa10] = useState(0); // 10-point scale (for label)
  const [academicLoading, setAcademicLoading] = useState(true);
  const [tuitionBalance, setTuitionBalance] = useState<number | null>(null);
  const [tuitionLoading, setTuitionLoading] = useState(true);
  const { mode, toggle } = useTheme();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  // Fetch registrations for weekly schedule & today's schedule
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setScheduleLoading(true);
        const data = await getMyRegistrations();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const hkiiiEnrolled = data.filter((r) => {
            if (r.status?.toLowerCase() === 'dropped') return false;
            const term =
              r.offering?.term ||
              (r.offering as any)?.courseOffering?.term ||
              (r as any)?.term ||
              '';
            return (
              !term || term === 'HKIII 2025-2026' || term.includes('HKIII') || term.includes('HK3')
            );
          });
          setRegisteredCount(hkiiiEnrolled.length);
          if (hkiiiEnrolled.length > 0) {
            setScheduleRows(buildScheduleRows(hkiiiEnrolled));
            // Extract Today's classes
            const dayMap: Record<number, DayKey> = {
              1: 'Mon',
              2: 'Tue',
              3: 'Wed',
              4: 'Thu',
              5: 'Fri',
              6: 'Sat',
            };
            const todayDayIndex = new Date().getDay();
            const todayKey = dayMap[todayDayIndex] || 'Mon';
            const extractedToday: TodayClassItem[] = [];
            hkiiiEnrolled.forEach((reg) => {
              const entries = parseScheduleEntries(reg.offering?.schedule || '');
              entries.forEach(({ days, timeRange }) => {
                if (days.includes(todayKey)) {
                  const parts = timeRange.split('-');
                  const startTime = parts[0]?.trim() || '08:00';
                  const hour = parseInt(startTime.split(':')[0], 10);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  extractedToday.push({
                    courseCode: reg.offering?.course?.courseCode || '',
                    courseName: reg.offering?.course?.courseName || 'Registered Course',
                    timeRange,
                    timeLabel: startTime,
                    ampm,
                    room: reg.offering?.room
                      ? `${reg.offering.location || ''} ${reg.offering.room}`.trim()
                      : reg.offering?.location || 'Campus',
                    status: 'Scheduled',
                  });
                }
              });
            });
            setTodayClasses(extractedToday);
          } else {
            setScheduleRows([]);
            setTodayClasses([]);
          }
        } else {
          setRegisteredCount(0);
          setScheduleRows([]);
          setTodayClasses([]);
        }
      } catch {
        setRegisteredCount(0);
        setScheduleRows([]);
        setTodayClasses([]);
      } finally {
        if (!cancelled) setScheduleLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch grades for dynamic CGPA and credits earned
  useEffect(() => {
    let cancelled = false;
    async function loadGrades() {
      try {
        setAcademicLoading(true);
        const grades = await api.get<any[]>('/api/v1/grades/me');
        if (cancelled) return;
        const list = Array.isArray(grades) ? grades : [];
        // gradePoint from API is on the 10-point scale
        const valid = list.filter((g) => Number(g.gradePoint) > 0);
        const earned = valid.reduce((s: number, g: any) => s + (Number(g.credits) || 0), 0);
        const weighted10 = valid.reduce(
          (s: number, g: any) => s + (Number(g.gradePoint) || 0) * (Number(g.credits) || 0),
          0
        );
        const computed10 = earned > 0 ? weighted10 / earned : 0; // 10-pt CGPA
        const computed4 = parseFloat((computed10 * 0.4).toFixed(2)); // → 4.0 scale
        setTotalCredits(earned);
        setGpa10(parseFloat(computed10.toFixed(2)));
        setGpa(computed4); // 4.0-scale value shown in card
      } catch {
        // keep current defaults
      } finally {
        if (!cancelled) setAcademicLoading(false);
      }
    }
    loadGrades();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch tuition balance from /api/v1/finance/me
  useEffect(() => {
    let cancelled = false;
    async function loadTuition() {
      try {
        setTuitionLoading(true);
        const res: any = await api.get('/api/v1/finance/me');
        if (cancelled) return;
        if (res && typeof res.balance !== 'undefined') {
          setTuitionBalance(Number(res.balance) || 0);
        }
      } catch {
        setTuitionBalance(0);
      } finally {
        if (!cancelled) setTuitionLoading(false);
      }
    }
    loadTuition();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="dash relative z-[1] flex flex-col gap-lg">
      {/* ── Night Mode Toggle ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={toggle}
          className="flex items-center gap-2 bg-surface-white/90 backdrop-blur rounded-xl px-4 py-2 border border-border-card shadow-sm hover:shadow-card transition-all active:scale-95 cursor-pointer"
        >
          {mode === 'day' ? (
            <FaMoon className="text-primary-container text-lg" />
          ) : (
            <FaSun className="text-sun text-lg" />
          )}
          <span className="text-label-md text-text-secondary font-medium">
            {mode === 'day' ? 'Night Mode' : 'Day Mode'}
          </span>
        </button>
      </div>

      {/* ── Welcome Banner ── */}
      <div className="mb-0">
        <h1 className="text-headline-lg text-text-primary mb-2">
          {greeting}, {displayName}!
        </h1>
        <p className="text-body-lg text-text-secondary">
          Here&apos;s an overview of your academic progress for HKIII 2025-2026.
        </p>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* ── Today's Classes (8 cols) ── */}
        <div className="md:col-span-8 bg-surface-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border-card p-lg">
          <div className="flex justify-between items-center mb-md border-b border-border-card pb-3">
            <h2 className="text-title-md text-text-primary flex items-center gap-2">
              <FaCalendarDays className="text-primary-container text-xl" /> Today's Schedule
            </h2>
            <a
              className="text-label-md text-primary-container hover:underline font-medium"
              href="/timetable"
            >
              View Timetable
            </a>
          </div>
          <div className="space-y-4">
            {todayClasses.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-body-md bg-surface-dim rounded-xl border border-border-card">
                No classes scheduled for today.
              </div>
            ) : (
              todayClasses.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-dim rounded-xl border border-border-card hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className="bg-primary-container text-white px-3 py-1.5 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                      <span className="text-label-md font-bold">{item.timeLabel}</span>
                      <span className="text-[10px] opacity-80">{item.ampm}</span>
                    </div>
                    <div>
                      <h3 className="text-title-md text-text-primary font-bold">
                        {item.courseName}
                      </h3>
                      <p className="text-body-md text-text-secondary flex items-center gap-1 mt-1">
                        <FaLocationDot className="inline text-xs mr-1" /> {item.room}
                      </p>
                    </div>
                  </div>
                  <span className="bg-success-soft text-success px-3 py-1 rounded-full text-label-md inline-flex items-center gap-1 w-fit">
                    <FaCircleCheck className="mr-1" /> {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Academic Summary (4 cols) ── */}
        <div className="md:col-span-4 bg-primary-container text-white rounded-xl shadow-card p-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-[150px]">
            <FaGraduationCap />
          </div>
          <div className="relative z-10">
            <h2 className="text-title-md mb-4 flex items-center gap-2 font-semibold">
              <FaChartLine /> Academic Results
            </h2>
            <div className="mb-6">
              <p className="text-label-md opacity-80 mb-1">Current CGPA (4.0 Scale)</p>
              <p className="text-hero font-bold">
                {academicLoading ? '…' : gpa.toFixed(2)}
                <span className="text-title-lg opacity-80 font-normal">/4.0</span>
              </p>
              {!academicLoading && gpa10 > 0 && (
                <p className="text-label-md opacity-70 mt-1">
                  {gpa10.toFixed(2)} / 10 ·{' '}
                  {gpa10 >= 8.5
                    ? 'Excellent'
                    : gpa10 >= 7.0
                      ? 'Good'
                      : gpa10 >= 5.0
                        ? 'Average'
                        : 'Below Average'}
                </p>
              )}
            </div>
            <div className="space-y-3 border-t border-white/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-body-md opacity-90">Credits Earned</span>
                <span className="text-title-md font-semibold">
                  {academicLoading ? '…' : totalCredits} / 120
                </span>
              </div>
              <div className="w-full bg-white/15 rounded-full h-3 relative my-2">
                <div
                  className="bg-surface-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((totalCredits / 120) * 100)}%` }}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary-container shadow"
                  style={{ left: `calc(${Math.round((totalCredits / 120) * 100)}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-xs opacity-80 font-mono">
                <span>0</span>
                <span className="font-bold">{totalCredits}</span>
                <span>120</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tuition Status (6 cols) ── */}
        <div className="md:col-span-6 bg-surface-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border-card p-lg">
          <div className="flex justify-between items-center mb-md border-b border-border-card pb-3">
            <h2 className="text-title-md text-text-primary flex items-center gap-2 font-semibold">
              <FaMoneyBillWave /> Tuition Status
            </h2>
          </div>
          <div className="flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="text-label-md text-text-secondary mb-1">Outstanding Balance</p>
              <p
                className={`text-headline-md font-bold ${
                  tuitionBalance === 0 ? 'text-success' : 'text-warning'
                }`}
              >
                {tuitionLoading
                  ? '…'
                  : tuitionBalance !== null
                    ? `${new Intl.NumberFormat('en-US').format(tuitionBalance)} VND`
                    : '0 VND'}
              </p>
              {tuitionBalance && tuitionBalance > 0 ? (
                <p className="text-body-md text-text-secondary mt-2 flex items-center gap-1">
                  <FaTriangleExclamation className="text-error mr-1" /> Deadline:{' '}
                  <strong className="text-text-primary font-semibold">Oct 15, 2026</strong> (Payment
                  Pending)
                </p>
              ) : (
                <p className="text-body-md text-success mt-2 flex items-center gap-1">
                  <FaCircleCheck className="mr-1" /> Tuition status for current semester is clear.
                </p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 bg-primary-container text-white py-2.5 px-4 rounded-full text-title-md font-semibold hover:opacity-90 transition-opacity active:scale-95"
                onClick={() => navigate(ROUTES.TUITION)}
              >
                Pay Now
              </button>
              <button
                className="flex-1 border-2 border-primary-container text-primary-container py-2.5 px-4 rounded-full text-title-md font-semibold hover:bg-surface-container-low transition-colors active:scale-95"
                onClick={() => navigate(ROUTES.TUITION)}
              >
                Details
              </button>
            </div>
          </div>
        </div>

        {/* ── Recent Notifications (6 cols) ── */}
        <div className="md:col-span-6 bg-surface-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border-card p-lg">
          <div className="flex justify-between items-center mb-md border-b border-border-card pb-3">
            <h2 className="text-title-md text-text-primary flex items-center gap-2 font-semibold">
              <FaBullhorn /> New Notifications
            </h2>
            <a
              className="text-label-md text-primary-container hover:underline font-medium"
              href="/support"
            >
              View All
            </a>
          </div>
          <div className="space-y-0 divide-y divide-border-card">
            {/* Notification 1 */}
            <div className="py-3 flex gap-3 group cursor-pointer hover:bg-surface-dim -mx-2 px-2 rounded-lg transition-colors">
              <div className="mt-1">
                <span className="w-2 h-2 rounded-full bg-primary-container block" />
              </div>
              <div>
                <h3 className="text-body-md font-semibold text-text-primary group-hover:text-primary-container transition-colors">
                  Midterm Exam Schedule Released
                </h3>
                <p className="text-label-md text-text-secondary mt-1">
                  Check the updated timetable for your midterm exam dates and locations.
                </p>
                <p className="text-[10px] text-text-secondary opacity-70 mt-1">2 hours ago</p>
              </div>
            </div>
            {/* Notification 2 */}
            <div className="py-3 flex gap-3 group cursor-pointer hover:bg-surface-dim -mx-2 px-2 rounded-lg transition-colors opacity-70">
              <div className="mt-1">
                <span className="w-2 h-2 rounded-full bg-transparent border border-outline-variant block" />
              </div>
              <div>
                <h3 className="text-body-md font-medium text-text-primary">
                  Library Maintenance Notice
                </h3>
                <p className="text-label-md text-text-secondary mt-1">
                  The main library will be closed this weekend for system upgrades.
                </p>
                <p className="text-[10px] text-text-secondary opacity-70 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Weekly Schedule Table ── */}
      <div className="bg-surface-white rounded-xl shadow-card border border-border-card overflow-hidden">
        <div className="flex justify-between items-center p-lg pb-3 border-b border-border-card">
          <h3 className="text-title-md text-text-primary font-semibold flex items-center gap-2">
            <FaCalendarDays /> Weekly Class Schedule
          </h3>
          <span className="text-label-md text-text-muted">HKIII · 2025-2026</span>
        </div>
        {scheduleLoading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-text-muted text-body-md">
            <span className="spinner" /> Loading schedule...
          </div>
        ) : scheduleRows.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-text-muted text-body-md">
            No classes scheduled yet. Register for courses to see your weekly schedule.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-body-md">
              <thead>
                <tr>
                  <th className="p-3 text-center bg-surface-container-low text-text-secondary font-semibold text-label-md uppercase tracking-wider border-b border-border-card w-[100px]">
                    Time
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day}
                      className="p-3 text-center bg-surface-container-low text-text-secondary font-semibold text-label-md uppercase tracking-wider border-b border-border-card"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => (
                  <tr key={row.timeLabel}>
                    <td className="p-3 font-semibold text-text-primary bg-primary-soft border-b border-border-card text-left">
                      {row.timeLabel}
                    </td>
                    {DAYS.map((day) => {
                      const cell = row.cells[day];
                      if (!cell)
                        return (
                          <td
                            key={day}
                            className="p-3 text-center text-text-faint border-b border-border-card"
                          >
                            —
                          </td>
                        );
                      const colors = [
                        'text-blue-600 bg-blue-50',
                        'text-purple-600 bg-purple-50',
                        'text-teal-600 bg-teal-50',
                        'text-amber-600 bg-amber-50',
                      ];
                      return (
                        <td
                          key={day}
                          className={`p-3 border-b border-border-card ${colors[cell.colorIndex] || colors[0]}`}
                        >
                          <div className="font-semibold text-sm">{cell.courseName}</div>
                          <div className="text-xs opacity-80">{cell.timeRange}</div>
                          <div className="text-xs opacity-70">{cell.room}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
