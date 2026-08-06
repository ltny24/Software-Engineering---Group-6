import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { useTheme } from '../context/ThemeContext';
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

type TimeSlotKey = 'Morning' | 'Afternoon' | 'Evening';

interface ScheduleRow {
  timeLabel: string;
  cells: Record<DayKey, ScheduleCell | null>;
}

const DEMO_SCHEDULE: ScheduleRow[] = [
  {
    timeLabel: 'Morning',
    cells: {
      Mon: {
        courseName: 'Advanced Database Systems',
        courseCode: 'CS301',
        timeRange: '08:00 - 09:30',
        room: 'Room 304, Building A',
        colorIndex: 0,
      },
      Tue: {
        courseName: 'Linear Algebra',
        courseCode: 'MATH230',
        timeRange: '08:00 - 09:30',
        room: 'B108',
        colorIndex: 1,
      },
      Wed: null,
      Thu: {
        courseName: 'Advanced Database Systems',
        courseCode: 'CS301',
        timeRange: '08:00 - 09:30',
        room: 'Room 304, Building A',
        colorIndex: 0,
      },
      Fri: {
        courseName: 'Physics Lab',
        courseCode: 'PHYS140',
        timeRange: '10:00 - 12:00',
        room: 'Lab 3',
        colorIndex: 3,
      },
      Sat: null,
    },
  },
  {
    timeLabel: 'Afternoon',
    cells: {
      Mon: null,
      Tue: {
        courseName: 'Software Engineering',
        courseCode: 'SE401',
        timeRange: '13:30 - 15:00',
        room: 'Lab 2, Building C',
        colorIndex: 2,
      },
      Wed: {
        courseName: 'Linear Algebra',
        courseCode: 'MATH230',
        timeRange: '14:00 - 15:30',
        room: 'B108',
        colorIndex: 1,
      },
      Thu: null,
      Fri: {
        courseName: 'Software Engineering',
        courseCode: 'SE401',
        timeRange: '13:30 - 15:00',
        room: 'Lab 2, Building C',
        colorIndex: 2,
      },
      Sat: null,
    },
  },
  {
    timeLabel: 'Evening',
    cells: {
      Mon: null,
      Tue: null,
      Wed: null,
      Thu: null,
      Fri: null,
      Sat: null,
    },
  },
];

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

function parseSchedule(scheduleStr: string): { days: DayKey[]; timeRange: string } | null {
  const match = scheduleStr
    .trim()
    .match(/^([A-Za-z/,\s]+?)\s+(\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2})$/);
  if (!match) return null;
  const timeRange = match[2].replace(/\s*[-–—]\s*/, ' - ');
  const days = match[1]
    .split(/[/,\s]+/)
    .map((d) => parseDayAbbr(d))
    .filter((d): d is DayKey => d !== null);
  return days.length > 0 ? { days, timeRange } : null;
}

function getTimeSlot(timeRange: string): TimeSlotKey {
  const startHour = parseInt(timeRange.split(':')[0], 10);
  if (startHour < 12) return 'Morning';
  if (startHour < 17) return 'Afternoon';
  return 'Evening';
}

function buildScheduleRows(registrations: CourseRegistration[]): ScheduleRow[] {
  const timeSlots: TimeSlotKey[] = ['Morning', 'Afternoon', 'Evening'];
  const rows: ScheduleRow[] = timeSlots.map((label) => ({
    timeLabel: label,
    cells: Object.fromEntries(DAYS.map((d) => [d, null])) as Record<DayKey, ScheduleCell | null>,
  }));
  const enrolled = registrations.filter((r) => r.status === 'ENROLLED');
  let colorIdx = 0;
  const courseColorMap = new Map<string, number>();
  enrolled.forEach((reg) => {
    const parsed = parseSchedule(reg.offering.schedule);
    if (!parsed) return;
    const courseKey = reg.offering.course.courseCode;
    if (!courseColorMap.has(courseKey)) courseColorMap.set(courseKey, colorIdx++);
    const { days, timeRange } = parsed;
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
      rows[rowIdx].cells[day] = cell;
    });
  });
  return rows;
}

// ── Component ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName ?? 'Nguyen Anh Tuan';
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(DEMO_SCHEDULE);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [totalCredits, setTotalCredits] = useState(96);
  const [registeredCount, setRegisteredCount] = useState(5);
  const [gpa] = useState(3.85);
  const { mode, toggle } = useTheme();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setScheduleLoading(true);
        const data = await getMyRegistrations();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const enrolled = data.filter((r) => r.status === 'ENROLLED');
          setRegisteredCount(enrolled.length);
          const credits = enrolled.reduce((sum, r) => sum + (r.offering.course.credits || 0), 0);
          setTotalCredits(credits);
          setScheduleRows(buildScheduleRows(data));
        }
      } catch {
        /* keep demo */
      } finally {
        if (!cancelled) setScheduleLoading(false);
      }
    }
    load();
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
          Here&apos;s an overview of your academic progress for Fall 2023.
        </p>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* ── Today's Classes (8 cols) ── */}
        <div className="md:col-span-8 bg-surface-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border-card p-lg">
          <div className="flex justify-between items-center mb-md border-b border-border-card pb-3">
            <h2 className="text-title-md text-text-primary flex items-center gap-2">
              <FaCalendarDays className="text-primary-container text-xl" /> Lịch học hôm nay
            </h2>
            <a
              className="text-label-md text-primary-container hover:underline font-medium"
              href="/timetable"
            >
              View Timetable
            </a>
          </div>
          <div className="space-y-4">
            {/* Class 1 — Ongoing */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-dim rounded-xl border border-border-card hover:bg-surface-container-low transition-colors">
              <div className="flex items-start gap-4 mb-3 sm:mb-0">
                <div className="bg-primary-container text-white px-3 py-1.5 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-label-md font-bold">08:00</span>
                  <span className="text-[10px] opacity-80">AM</span>
                </div>
                <div>
                  <h3 className="text-title-md text-text-primary font-bold">
                    Advanced Database Systems
                  </h3>
                  <p className="text-body-md text-text-secondary flex items-center gap-1 mt-1">
                    <FaLocationDot className="inline text-xs mr-1" /> Room 304, Building A
                  </p>
                </div>
              </div>
              <span className="bg-success-soft text-success px-3 py-1 rounded-full text-label-md inline-flex items-center gap-1 w-fit">
                <FaCircleCheck className="mr-1" /> Ongoing
              </span>
            </div>
            {/* Class 2 — Upcoming */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-white rounded-xl border border-outline-variant hover:bg-surface-dim transition-colors">
              <div className="flex items-start gap-4 mb-3 sm:mb-0">
                <div className="bg-surface-container-high text-text-secondary px-3 py-1.5 rounded-lg flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-label-md font-bold">13:30</span>
                  <span className="text-[10px] opacity-80">PM</span>
                </div>
                <div>
                  <h3 className="text-title-md text-text-primary font-bold">
                    Software Engineering
                  </h3>
                  <p className="text-body-md text-text-secondary flex items-center gap-1 mt-1">
                    📍 Lab 2, Building C
                  </p>
                </div>
              </div>
              <span className="bg-warning-soft text-warning px-3 py-1 rounded-full text-label-md inline-flex items-center gap-1 w-fit">
                <FaClock className="mr-1" /> Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* ── Academic Summary (4 cols) ── */}
        <div className="md:col-span-4 bg-primary-container text-white rounded-xl shadow-card p-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-[150px]">
            <FaGraduationCap />
          </div>
          <div className="relative z-10">
            <h2 className="text-title-md mb-4 flex items-center gap-2 font-semibold">
              <FaChartLine /> Kết quả học tập
            </h2>
            <div className="mb-6">
              <p className="text-label-md opacity-80 mb-1">Current CGPA</p>
              <p className="text-hero font-bold">
                {gpa.toFixed(2)}
                <span className="text-title-lg opacity-80 font-normal">/4.0</span>
              </p>
            </div>
            <div className="space-y-3 border-t border-white/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-body-md opacity-90">Credits Earned</span>
                <span className="text-title-md font-semibold">{totalCredits} / 120</span>
              </div>
              <div className="w-full bg-white/15 rounded-full h-2">
                <div
                  className="bg-surface-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((totalCredits / 120) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Tuition Status (6 cols) ── */}
        <div className="md:col-span-6 bg-surface-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border-card p-lg">
          <div className="flex justify-between items-center mb-md border-b border-border-card pb-3">
            <h2 className="text-title-md text-text-primary flex items-center gap-2 font-semibold">
              <FaMoneyBillWave /> Tình trạng học phí
            </h2>
          </div>
          <div className="flex flex-col justify-between min-h-[120px]">
            <div>
              <p className="text-label-md text-text-secondary mb-1">Outstanding Balance</p>
              <p className="text-headline-md text-warning font-bold">15,000,000 VND</p>
              <p className="text-body-md text-text-secondary mt-2 flex items-center gap-1">
                <FaTriangleExclamation className="text-error mr-1" /> Deadline:{' '}
                <strong className="text-text-primary font-semibold">Oct 15, 2023</strong> (5 days
                left)
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-primary-container text-white py-2.5 px-4 rounded-full text-title-md font-semibold hover:opacity-90 transition-opacity active:scale-95">
                Pay Now
              </button>
              <button className="flex-1 border-2 border-primary-container text-primary-container py-2.5 px-4 rounded-full text-title-md font-semibold hover:bg-surface-container-low transition-colors active:scale-95">
                Details
              </button>
            </div>
          </div>
        </div>

        {/* ── Recent Notifications (6 cols) ── */}
        <div className="md:col-span-6 bg-surface-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border-card p-lg">
          <div className="flex justify-between items-center mb-md border-b border-border-card pb-3">
            <h2 className="text-title-md text-text-primary flex items-center gap-2 font-semibold">
              <FaBullhorn /> Thông báo mới
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
          <span className="text-label-md text-text-muted">Semester 2 · 2024-2025</span>
        </div>
        {scheduleLoading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-text-muted text-body-md">
            <span className="spinner" /> Loading schedule...
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
                          <div className="text-xs opacity-70 font-mono">{cell.room}</div>
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
