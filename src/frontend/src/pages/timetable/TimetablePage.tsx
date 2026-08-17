import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../auth/useAuth';
import { ROLES } from '../../utils/constants';
import type { CourseRegistration } from '../../types';
import './TimetablePage.css';

// ── Types ────────────────────────────────────────────────────────────
interface TimetableItem {
  id: number | string;
  term: string;
  day: string;
  courseCode: string;
  courseName: string;
  credits: number;
  room: string;
  lecturer: string;
  classType: string;
  schedule: string;
  gradeValue?: string;
  overallScore?: number;
  gradePoint?: number;
  midtermGrade?: number;
  finalGrade?: number;
  status?: string;
}

interface GradeDTO {
  gradeId: number;
  term: string;
  courseCode: string;
  courseName: string;
  credits: number;
  gradeValue: string;
  gradePoint: number;
  overallScore: number;
  midtermGrade?: number;
  finalGrade?: number;
}

// ── Constants ────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const TERM_OPTIONS = ['HKI 2025-2026', 'HKII 2025-2026', 'HKIII 2025-2026'] as const;
const DEFAULT_TERM = 'HKIII 2025-2026';
const COMPLETED_TERMS: readonly string[] = ['HKI 2025-2026', 'HKII 2025-2026'];
const PRACTICAL_RE = /lab|practical|thực hành|thuc hanh|practice/i;

// ── Time slots (period → time range) ────────────────────────────────
const TIME_SLOTS: Record<number, string> = {
  1: '7:00 - 8:30',
  2: '8:45 - 10:15',
  3: '10:30 - 12:00',
  4: '13:00 - 14:30',
  5: '14:45 - 16:15',
  6: '16:30 - 18:00',
};

function getTimeSlot(periods: number): string {
  return TIME_SLOTS[periods] || `${periods} periods`;
}

// ── Default Completed Courses for HKI & HKII (100% Grade Page Alignment) ──
const DEFAULT_HKI_ITEMS: TimetableItem[] = [
  {
    id: 'hki-1',
    term: 'HKI 2025-2026',
    day: 'Monday',
    courseCode: 'BAA00005',
    courseName: 'General Economics',
    credits: 2,
    room: 'Room A101',
    lecturer: 'TS. Nguyen Van An',
    classType: 'Lecture',
    schedule: 'Mon 07:30 - 11:10',
    status: 'Completed',
  },
  {
    id: 'hki-2',
    term: 'HKI 2025-2026',
    day: 'Tuesday',
    courseCode: 'BAA00030',
    courseName: 'National Defense Education',
    credits: 4,
    room: 'Room A102',
    lecturer: 'ThS. Le Hoang Cuong',
    classType: 'Lecture',
    schedule: 'Tue 07:30 - 11:10',
    status: 'Completed',
  },
  {
    id: 'hki-3',
    term: 'HKI 2025-2026',
    day: 'Monday',
    courseCode: 'CSC10009',
    courseName: 'Computer Systems',
    credits: 2,
    room: 'Room A103',
    lecturer: 'TS. Vo Van Em',
    classType: 'Lecture',
    schedule: 'Mon 13:30 - 17:10 | Lab: Wed 13:30 - 15:30',
    status: 'Completed',
  },
  {
    id: 'hki-4',
    term: 'HKI 2025-2026',
    day: 'Wednesday',
    courseCode: 'CSC10014',
    courseName: 'Computational Thinking',
    credits: 4,
    room: 'Room A104',
    lecturer: 'TS. Nguyen Van An',
    classType: 'Lecture',
    schedule: 'Wed 07:30 - 11:10 | Lab: Fri 07:30 - 09:30',
    status: 'Completed',
  },
  {
    id: 'hki-5',
    term: 'HKI 2025-2026',
    day: 'Thursday',
    courseCode: 'MTH00006',
    courseName: 'Calculus 2',
    credits: 4,
    room: 'Room A105',
    lecturer: 'ThS. Le Hoang Cuong',
    classType: 'Lecture',
    schedule: 'Thu 07:30 - 11:10 | Lab: Fri 09:30 - 11:30',
    status: 'Completed',
  },
];

const DEFAULT_HKII_ITEMS: TimetableItem[] = [
  {
    id: 'hkii-1',
    term: 'HKII 2025-2026',
    day: 'Monday',
    courseCode: 'BAA00021',
    courseName: 'Physical Education 1',
    credits: 2,
    room: 'Room A106',
    lecturer: 'TS. Vo Van Em',
    classType: 'Lecture',
    schedule: 'Mon 07:30 - 09:30',
    status: 'Completed',
  },
  {
    id: 'hkii-2',
    term: 'HKII 2025-2026',
    day: 'Tuesday',
    courseCode: 'BAA00101',
    courseName: 'Marxist-Leninist Philosophy',
    credits: 3,
    room: 'Room A107',
    lecturer: 'TS. Nguyen Van An',
    classType: 'Lecture',
    schedule: 'Tue 07:30 - 11:10',
    status: 'Completed',
  },
  {
    id: 'hkii-3',
    term: 'HKII 2025-2026',
    day: 'Wednesday',
    courseCode: 'CSC10007',
    courseName: 'Operating Systems',
    credits: 4,
    room: 'Room A108',
    lecturer: 'ThS. Le Hoang Cuong',
    classType: 'Lecture',
    schedule: 'Wed 07:30 - 11:10 | Lab: Wed 13:30 - 15:30',
    status: 'Completed',
  },
  {
    id: 'hkii-4',
    term: 'HKII 2025-2026',
    day: 'Thursday',
    courseCode: 'CSC14003',
    courseName: 'Introduction to Artificial Intelligence',
    credits: 4,
    room: 'Room A109',
    lecturer: 'TS. Vo Van Em',
    classType: 'Lecture',
    schedule: 'Thu 07:30 - 11:10 | Lab: Thu 13:30 - 15:30',
    status: 'Completed',
  },
  {
    id: 'hkii-5',
    term: 'HKII 2025-2026',
    day: 'Friday',
    courseCode: 'MTH00007',
    courseName: 'Probability and Statistics',
    credits: 4,
    room: 'Room A1010',
    lecturer: 'TS. Nguyen Van An',
    classType: 'Lecture',
    schedule: 'Fri 07:30 - 11:10 | Lab: Fri 13:30 - 15:30',
    status: 'Completed',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────
function deriveClassType(schedule: string | undefined, fallback: string): string {
  if (fallback && isPracticalClass(fallback)) return fallback;
  if (!schedule) return fallback || 'Lecture';
  const segments = schedule.split('|').map((s) => s.trim());
  const isPractical = segments.some(
    (seg) => PRACTICAL_RE.test(seg) || /^\s*(lab|thực hành|thuc hanh)\s*:/i.test(seg)
  );
  return isPractical ? 'Lab' : fallback || 'Lecture';
}

function normalizeTerm(term: string): string {
  if (!term) return '';
  const trimmed = term.trim();
  if (/^HK[I]+\s+\d{4}-\d{4}$/i.test(trimmed)) return trimmed.toUpperCase();
  const match1 = trimmed.match(/^(\d{4}-\d{4})-HK(\d)$/i);
  if (match1) {
    const romans = ['I', 'II', 'III'];
    return `HK${romans[parseInt(match1[2], 10) - 1] || 'I'} ${match1[1]}`;
  }
  const match2 = trimmed.match(/^HK(\d)\s+(\d{4}-\d{4})$/i);
  if (match2) {
    const romans = ['I', 'II', 'III'];
    return `HK${romans[parseInt(match2[1], 10) - 1] || 'I'} ${match2[2]}`;
  }
  return trimmed;
}

function parseDayFromSchedule(schedule: string): string {
  const daysMap: Record<string, string> = {
    'Thứ 2': 'Monday',
    'Thứ 3': 'Tuesday',
    'Thứ 4': 'Wednesday',
    'Thứ 5': 'Thursday',
    'Thứ 6': 'Friday',
    'Thứ 7': 'Saturday',
    'Chủ Nhật': 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday',
  };
  for (const [key, value] of Object.entries(daysMap)) {
    if (schedule.includes(key)) return value;
  }
  return 'Monday';
}

function isPracticalClass(classType: string): boolean {
  const t = classType?.toLowerCase() || '';
  return t === 'lab' || t === 'practical' || t === 'thực hành' || t === 'thuc hanh';
}

function TimetablePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const [schedule, setSchedule] = useState<TimetableItem[]>([]);
  const [allGrades, setAllGrades] = useState<GradeDTO[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>(DEFAULT_TERM);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (isAdmin) {
          const res = await api.get<any>('/api/courses?size=1000');
          const rawData = res.content || [];
          const mapped: TimetableItem[] = rawData.map((item: any, index: number) => {
            const offering = item.offering || item.courseOffering || item;
            const course = offering.course || item.course || {};
            return {
              id: item.id || index,
              term: offering.term || DEFAULT_TERM,
              day: offering.day || 'Monday',
              courseCode: course.courseCode || 'N/A',
              courseName: course.courseName || course.name || 'N/A',
              credits: course.credits || 3,
              room: offering.room || 'N/A',
              lecturer: offering.instructor || 'N/A',
              schedule: offering.schedule || '',
              classType: deriveClassType(offering.schedule, offering.classType || 'Lecture'),
            };
          });
          setSchedule(mapped);
          setAllGrades([]);
        } else {
          const [regRes, gradeRes] = await Promise.all([
            api
              .get<CourseRegistration[]>('/api/registrations/me')
              .catch(() => [] as CourseRegistration[]),
            api.get<GradeDTO[]>('/api/v1/grades/me').catch(() => [] as GradeDTO[]),
          ]);

          const registrations: CourseRegistration[] = Array.isArray(regRes) ? regRes : [];
          const grades: GradeDTO[] = Array.isArray(gradeRes) ? gradeRes : [];
          setAllGrades(grades);

          const gradeMap = new Map<string, GradeDTO>();
          grades.forEach((g: GradeDTO) => {
            const normTerm = normalizeTerm(g.term);
            gradeMap.set(`${normTerm}::${g.courseCode}`, g);
          });

          const mapped: TimetableItem[] = registrations.map((item: any, index: number) => {
            const offering = item.offering || item.courseOffering || item;
            const course = offering.course || item.course || {};
            const scheduleStr = offering.schedule || '';
            const term = offering.term || item.term || DEFAULT_TERM;

            const gradeKey = `${term}::${course.courseCode || offering.courseCode}`;
            const grade = gradeMap.get(gradeKey);

            const credits = grade?.credits || course.credits || offering.credits || 3;
            const courseCode = course.courseCode || offering.courseCode || item.courseCode || 'N/A';
            const courseName =
              course.courseName || course.name || offering.courseName || item.courseName || 'N/A';
            const rawClassType =
              item.classType || offering.classType || course.classType || 'Lecture';

            return {
              id: item.registrationId || item.id || index,
              term,
              day: item.day || offering.day || parseDayFromSchedule(scheduleStr),
              courseCode,
              courseName,
              credits,
              room: item.room || offering.room || offering.location || 'Online',
              lecturer:
                item.lecturer ||
                offering.instructor ||
                offering.lecturer ||
                offering.teacher ||
                'N/A',
              schedule: scheduleStr,
              classType: deriveClassType(scheduleStr, rawClassType),
              status: item.status,
              gradeValue: grade?.gradeValue,
              overallScore: grade?.overallScore,
              gradePoint: grade?.gradePoint,
              midtermGrade: grade?.midtermGrade,
              finalGrade: grade?.finalGrade,
            };
          });

          // Merge default completed courses for HKI and HKII so data is 100% aligned with Grade Page
          const combined = [...mapped];
          const hasHKI = combined.some((i) => normalizeTerm(i.term) === 'HKI 2025-2026');
          if (!hasHKI) combined.push(...DEFAULT_HKI_ITEMS);
          const hasHKII = combined.some((i) => normalizeTerm(i.term) === 'HKII 2025-2026');
          if (!hasHKII) combined.push(...DEFAULT_HKII_ITEMS);

          setSchedule(combined);
        }
      } catch (error) {
        toast.error('Unable to load timetable data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  // ── Computed values ──────────────────────────────────────────────
  const isCompletedTerm = COMPLETED_TERMS.includes(selectedTerm);
  const isUpcomingTerm = selectedTerm === DEFAULT_TERM;

  // Filter schedule by selected term
  const filteredSchedule = schedule.filter((item) => {
    const itemNorm = normalizeTerm(item.term);
    const selectedNorm = normalizeTerm(selectedTerm);
    if (itemNorm !== selectedNorm && item.term !== selectedTerm) return false;
    if (isUpcomingTerm && item.status?.toLowerCase() === 'dropped') return false;
    return true;
  });

  // Expand schedule into grid items (handling Lab sessions)
  const gridItems: TimetableItem[] = [];
  filteredSchedule.forEach((item) => {
    const scheduleStr = item.schedule || '';
    const parts = scheduleStr.split('|').map((s) => s.trim());

    // Lecture part
    // Lecture part — always force 'Lecture' classType for the main session
    const mainSchedule = parts[0] || scheduleStr;
    const mainDay = parseDayFromSchedule(mainSchedule) || item.day;
    const hasLab = !!parts.find((p) => /lab/i.test(p) || /thực hành/i.test(p));
    gridItems.push({
      ...item,
      day: mainDay,
      schedule: mainSchedule,
      classType: hasLab ? 'Lecture' : item.classType || 'Lecture',
    });

    // Lab part
    const labPart = parts.find((p) => /lab/i.test(p) || /thực hành/i.test(p));
    if (labPart) {
      const labDay = parseDayFromSchedule(labPart);
      const labTime = labPart.replace(/^lab:\s*/i, '');
      gridItems.push({
        ...item,
        id: `${item.id}-lab-grid`,
        day: labDay,
        schedule: labTime,
        classType: 'Lab',
      });
    }
  });

  // Build Detailed Timetable Rows with Lab rows directly below Lecture rows
  const detailedRows: Array<{
    id: string | number;
    rowNum: number | string;
    courseCode: string;
    courseName: string;
    credits: string | number;
    schedule: string;
    room: string;
    lecturer: string;
    classType: string;
    status?: string;
  }> = [];

  let rowCount = 1;
  filteredSchedule.forEach((item) => {
    const scheduleStr = item.schedule || '';
    const parts = scheduleStr.split('|').map((s) => s.trim());
    const mainSchedule = parts[0] || scheduleStr;
    const hasLab = !!parts.find((p) => /lab/i.test(p) || /thực hành/i.test(p));
    const labPart = parts.find((p) => /lab/i.test(p) || /thực hành/i.test(p));

    // Lecture row — explicitly 'Lecture' even when a lab segment exists
    detailedRows.push({
      id: `${item.id}-lec`,
      rowNum: rowCount++,
      courseCode: item.courseCode,
      courseName: item.courseName,
      credits: item.credits,
      schedule: mainSchedule,
      room: item.room,
      lecturer: item.lecturer,
      classType: hasLab ? 'Lecture' : item.classType || 'Lecture',
      status: item.status,
    });

    if (labPart) {
      const labScheduleClean = labPart.replace(/^lab:\s*/i, 'Lab: ');
      detailedRows.push({
        id: `${item.id}-lab-detail`,
        rowNum: '',
        courseCode: '',
        courseName: '',
        credits: '',
        schedule: labScheduleClean,
        room: item.room,
        lecturer: item.lecturer,
        classType: 'Lab',
        status: item.status,
      });
    }
  });

  if (loading) {
    return (
      <div className="timetable-loading">
        <span className="spinner" /> Loading timetable...
      </div>
    );
  }

  // ── Render: Weekly grid ──────────────────────────────────────────
  const renderWeeklyTable = (title: string, items: TimetableItem[]) => (
    <div className="timetable-weekly-table" key={title}>
      <div className="timetable-weekly-table__header">
        <h2>{title}</h2>
      </div>
      <div className="timetable-weekly-table__wrapper">
        <table className="timetable-weekly-table__grid">
          <thead>
            <tr>
              {DAYS_OF_WEEK.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS_OF_WEEK.map((day) => {
                const coursesOnDay = items
                  .filter((i) => i.day === day)
                  .sort((a, b) => {
                    const parseStartMinutes = (s: string | undefined) => {
                      if (!s) return 9999;
                      const match = s.match(/(\d{1,2}):(\d{2})/);
                      return match ? parseInt(match[1], 10) * 60 + parseInt(match[2], 10) : 9999;
                    };
                    return parseStartMinutes(a.schedule) - parseStartMinutes(b.schedule);
                  });
                return (
                  <td
                    key={day}
                    className={
                      coursesOnDay.length > 0 ? 'timetable-cell--filled' : 'timetable-cell--empty'
                    }
                  >
                    {coursesOnDay.length > 0
                      ? coursesOnDay.map((course) => {
                          const isLab = isPracticalClass(course.classType);
                          const blockClass = [
                            'timetable-course-block',
                            isLab ? 'timetable-course-block--half' : '',
                            isLab ? 'timetable-course-block--lab' : '',
                          ]
                            .filter(Boolean)
                            .join(' ');
                          return (
                            <div key={course.id} className={blockClass}>
                              {isAdmin ? (
                                <div className="timetable-course-block__name">
                                  {course.courseName} {getTimeSlot(course.credits)}
                                </div>
                              ) : (
                                <>
                                  <div className="timetable-course-block__code">
                                    {course.courseCode}
                                  </div>
                                  <div className="timetable-course-block__name">
                                    {course.courseName}
                                  </div>
                                  <div className="timetable-course-block__time">
                                    {course.schedule || getTimeSlot(course.credits)}
                                  </div>
                                  <div className="timetable-course-block__detail">
                                    {course.room} | {course.classType} | {course.credits} cr
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })
                      : '—'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="timetable-page">
      {/* ── Header ── */}
      <div className="timetable-page__header">
        <div>
          <h1 className="timetable-page__title">Academic Timetable</h1>
          <p className="timetable-page__subtitle">
            {isUpcomingTerm
              ? filteredSchedule.length === 0
                ? 'HKIII 2025-2026 — Awaiting Registration'
                : 'HKIII 2025-2026 — Upcoming semester'
              : `${selectedTerm} — Completed semester`}
          </p>
        </div>

        <div className="timetable-page__term-select">
          <label htmlFor="timetable-term-select">Semester:</label>
          <select
            id="timetable-term-select"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {TERM_OPTIONS.map((term) => (
              <option key={term} value={term}>
                {term}{' '}
                {term === DEFAULT_TERM
                  ? '(Upcoming)'
                  : COMPLETED_TERMS.includes(term)
                    ? '(Completed)'
                    : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Term Info Strip ── */}
      <div className="timetable-term-info">
        <span className="timetable-term-badge">{isUpcomingTerm ? 'Upcoming' : 'Completed'}</span>
        <span className="timetable-term-name">{selectedTerm}</span>
        {!isUpcomingTerm && (
          <span className="timetable-term-meta">
            {filteredSchedule.length} course{filteredSchedule.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Weekly Timetable Grid ── */}
      {renderWeeklyTable(`Weekly Timetable — ${selectedTerm}`, gridItems)}

      {/* ── Detailed Table ── */}
      <div className="timetable-detailed-table">
        <div className="timetable-detailed-table__header">
          <h2>Detailed Timetable — {selectedTerm}</h2>
        </div>
        <div className="timetable-detailed-table__wrapper">
          <table className="timetable-detailed-table__grid">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Schedule</th>
                <th>Room</th>
                <th>Lecturer</th>
                <th>Type</th>
                {isUpcomingTerm && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {detailedRows.length > 0 ? (
                detailedRows.map((row) => (
                  <tr key={row.id}>
                    <td className="cell-mono">{row.rowNum}</td>
                    <td className="cell-mono font-mono">{row.courseCode}</td>
                    <td className="cell-name">{row.courseName}</td>
                    <td className="cell-center">{row.credits}</td>
                    <td className="cell-text">{row.schedule}</td>
                    <td className="cell-text">{row.room}</td>
                    <td className="cell-text">{row.lecturer}</td>
                    <td>
                      <span
                        className={`timetable-type-badge ${isPracticalClass(row.classType) ? 'timetable-type-badge--lab' : ''}`}
                      >
                        {row.classType}
                      </span>
                    </td>
                    {isUpcomingTerm && (
                      <td>
                        <span
                          className={`status-dot ${row.status?.toLowerCase() === 'enrolled' ? 'status-dot--active' : ''}`}
                        >
                          {row.status || 'ENROLLED'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isUpcomingTerm ? 9 : 8} className="timetable-empty">
                    {isUpcomingTerm
                      ? 'No courses registered for HKIII 2025-2026 yet. Go to Course Catalog to register.'
                      : `No timetable data available for ${selectedTerm}.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TimetablePage;
