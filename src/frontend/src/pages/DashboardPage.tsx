import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaClock, FaStar, FaCircleCheck } from 'react-icons/fa6';
import { useAuth } from '../auth';
import { getMyRegistrations } from '../services/courseService';
import type { CourseRegistration } from '../types';
import './DashboardPage.css';

// ── Demo fallback schedule ──────────────────────────────────────────────────

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
        courseName: 'Introduction to Algorithms',
        courseCode: 'CS101',
        timeRange: '09:00 - 10:30',
        room: 'A204',
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
        courseName: 'Introduction to Algorithms',
        courseCode: 'CS101',
        timeRange: '09:00 - 10:30',
        room: 'A204',
        colorIndex: 0,
      },
      Fri: {
        courseName: 'Physics Lab',
        courseCode: 'PHYS140',
        timeRange: '10:00 - 12:00',
        room: 'Lab3',
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
        courseName: 'English Communication',
        courseCode: 'ENG201',
        timeRange: '13:00 - 14:30',
        room: 'B305',
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
        courseName: 'English Communication',
        courseCode: 'ENG201',
        timeRange: '13:00 - 14:30',
        room: 'B305',
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

const COLOR_CLASSES = [
  'dash__class-cell--blue',
  'dash__class-cell--purple',
  'dash__class-cell--teal',
  'dash__class-cell--amber',
];

// ── Helpers ─────────────────────────────────────────────────────────────────

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

/** "Mon/Wed 09:00 - 10:30" → { days: ['Mon','Wed'], time: '09:00 - 10:30' } */
function parseSchedule(scheduleStr: string): { days: DayKey[]; timeRange: string } | null {
  const cleaned = scheduleStr.trim();
  // Expected pattern: "Mon/Wed 09:00 - 10:30" or "Tue 08:00-10:00"
  const match = cleaned.match(/^([A-Za-z/,\s]+?)\s+(\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2})$/);
  if (!match) return null;
  const dayPart = match[1];
  const timeRange = match[2].replace(/\s*[-–—]\s*/, ' - ');
  const days = dayPart
    .split(/[/,\s]+/)
    .map((d) => parseDayAbbr(d))
    .filter((d): d is DayKey => d !== null);
  if (days.length === 0) return null;
  return { days, timeRange };
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

  // Only show ENROLLED courses
  const enrolled = registrations.filter((r) => r.status === 'ENROLLED');

  let colorIdx = 0;
  const courseColorMap = new Map<string, number>();

  enrolled.forEach((reg) => {
    const schedule = reg.offering.schedule;
    const parsed = parseSchedule(schedule);
    if (!parsed) return;

    const courseKey = reg.offering.course.courseCode;
    if (!courseColorMap.has(courseKey)) {
      courseColorMap.set(courseKey, colorIdx++ % COLOR_CLASSES.length);
    }
    const cellColorIndex = courseColorMap.get(courseKey)!;

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
      colorIndex: cellColorIndex,
    };

    days.forEach((day) => {
      rows[rowIdx].cells[day] = cell;
    });
  });

  return rows;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName ?? 'User';

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(DEMO_SCHEDULE);
  const [scheduleLoading, setScheduleLoading] = useState(false); // hiển thị demo ngay, fetch ngầm
  const [totalCredits, setTotalCredits] = useState(17);
  const [registeredCount, setRegisteredCount] = useState(5);

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
          const rows = buildScheduleRows(data);
          setScheduleRows(rows);
        }
      } catch {
        // Keep demo data on error
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
          <div className="dash__stat-icon dash__stat-icon--blue">
            <FaBookOpen />
          </div>
          <div>
            <div className="dash__stat-label">Registered Courses</div>
            <div className="dash__stat-value">{registeredCount}</div>
          </div>
          <span className="dash__stat-badge dash__stat-badge--up">Enrolled</span>
        </div>
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--clock">
            <FaClock />
          </div>
          <div>
            <div className="dash__stat-label">Total Credits</div>
            <div className="dash__stat-value">{totalCredits}</div>
          </div>
          <span className="dash__stat-badge dash__stat-badge--info">Current</span>
        </div>
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--star">
            <FaStar />
          </div>
          <div>
            <div className="dash__stat-label">Current GPA</div>
            <div className="dash__stat-value">7.8</div>
          </div>
          <span className="dash__stat-badge dash__stat-badge--trend">Cumulative</span>
        </div>
        <div className="dash__stat-card">
          <div className="dash__stat-icon dash__stat-icon--check">
            <FaCircleCheck />
          </div>
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
        {scheduleLoading ? (
          <div className="dash__schedule-loading">
            <span className="spinner" /> Loading schedule...
          </div>
        ) : (
          <div className="dash__schedule-table-wrapper">
            <table className="dash__schedule-table">
              <thead>
                <tr>
                  <th></th>
                  {DAYS.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => (
                  <tr key={row.timeLabel}>
                    <td className="dash__time-cell">{row.timeLabel}</td>
                    {DAYS.map((day) => {
                      const cell = row.cells[day];
                      if (!cell) {
                        return (
                          <td key={day} className="dash__empty-cell">
                            —
                          </td>
                        );
                      }
                      const colorClass = COLOR_CLASSES[cell.colorIndex] ?? COLOR_CLASSES[0];
                      return (
                        <td key={day} className={`dash__class-cell ${colorClass}`}>
                          <div className="dash__class-name">{cell.courseName}</div>
                          <div className="dash__class-time">{cell.timeRange}</div>
                          <div className="dash__class-room">{cell.room}</div>
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
