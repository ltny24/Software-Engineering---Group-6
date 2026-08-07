import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarDays,
  FaGraduationCap,
  FaBookOpen,
  FaChartLine,
  FaCircleCheck,
  FaClock,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import api from '../../services/api';
import { getMyRegistrations } from '../../services/courseService';
import { useAuth } from '../../auth';
import { ROLES, ROUTES } from '../../utils/constants';
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
  // Grade info (for completed terms)
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

// ── Helpers ──────────────────────────────────────────────────────────
function deriveClassType(schedule: string | undefined, fallback: string): string {
  if (!schedule) return fallback;
  const segments = schedule.split('|').map(s => s.trim());
  const isPractical = segments.some(
    seg => PRACTICAL_RE.test(seg) || /^\s*(lab|thực hành|thuc hanh)\s*:/i.test(seg)
  );
  return isPractical ? 'Lab' : fallback;
}

function normalizeTerm(term: string): string {
  if (!term) return '';
  if (/^HK[I]+ \d{4}-\d{4}$/.test(term)) return term;
  const match = term.match(/^(\d{4}-\d{4})-HK(\d)$/);
  if (match) {
    const romans = ['I', 'II', 'III'];
    return `HK${romans[parseInt(match[2], 10) - 1] || 'I'} ${match[1]}`;
  }
  return term;
}

function parseDayFromSchedule(schedule: string): string {
  const daysMap: Record<string, string> = {
    'Thứ 2': 'Monday', 'Thứ 3': 'Tuesday', 'Thứ 4': 'Wednesday',
    'Thứ 5': 'Thursday', 'Thứ 6': 'Friday', 'Thứ 7': 'Saturday',
    'Chủ Nhật': 'Sunday',
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
    Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  };
  for (const [key, value] of Object.entries(daysMap)) {
    if (schedule.includes(key)) return value;
  }
  return 'Monday';
}

function estimatePeriod(timeRange: string, credits: number): number {
  const match = timeRange?.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    const hour = parseInt(match[1], 10);
    if (hour < 9) return 1;
    if (hour < 11) return 2;
    if (hour < 13) return 3;
    if (hour < 15) return 4;
    if (hour < 17) return 5;
    return 6;
  }
  return Math.min(credits, 6) || 3;
}

function isPracticalClass(classType: string): boolean {
  const t = classType?.toLowerCase() || '';
  return t === 'lab' || t === 'practical' || t === 'thực hành' || t === 'thuc hanh';
}

// ── Component ────────────────────────────────────────────────────────
function TimetablePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === ROLES.ADMIN;

  // Data state
  const [schedule, setSchedule] = useState<TimetableItem[]>([]);
  const [allGrades, setAllGrades] = useState<GradeDTO[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<CourseRegistration[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>(DEFAULT_TERM);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Data fetching ────────────────────────────────────────────────
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
          setAllRegistrations([]);
        } else {
          // Fetch all 3 data sources in parallel
          const [regRes, gradeRes] = await Promise.all([
            getMyRegistrations().catch(() => [] as CourseRegistration[]),
            api.get<GradeDTO[]>('/api/v1/grades/me').catch(() => [] as GradeDTO[]),
          ]);

          const registrations: CourseRegistration[] = Array.isArray(regRes) ? regRes : [];
          const grades: GradeDTO[] = Array.isArray(gradeRes) ? gradeRes : [];
          setAllRegistrations(registrations);
          setAllGrades(grades);

          // Build grade lookup
          const gradeMap = new Map<string, GradeDTO>();
          grades.forEach((g: GradeDTO) => {
            const normTerm = normalizeTerm(g.term);
            gradeMap.set(`${normTerm}::${g.courseCode}`, g);
          });

          // Map registrations → timetable items (only ENROLLED/DROPPED)
          const mapped: TimetableItem[] = registrations.map((item: any, index: number) => {
            const offering = item.offering || item.courseOffering || item;
            const course = offering.course || item.course || {};
            const scheduleStr = offering.schedule || '';
            const term = offering.term || item.term || DEFAULT_TERM;

            const gradeKey = `${term}::${course.courseCode || offering.courseCode}`;
            const grade = gradeMap.get(gradeKey);

            // Determine credits: prefer grade data for completed terms, otherwise course
            const credits = grade?.credits || course.credits || offering.credits || 3;
            // Estimate period from schedule time
            const parsed = scheduleStr.match(/(\d{1,2}):(\d{2})/);
            const periodNum = parsed
              ? estimatePeriod(`${parsed[1]}:${parsed[2]}`, credits)
              : credits;

            return {
              id: item.registrationId || item.id || index,
              term,
              day: offering.day || parseDayFromSchedule(scheduleStr),
              courseCode: course.courseCode || offering.courseCode || 'N/A',
              courseName: course.courseName || course.name || offering.courseName || 'N/A',
              credits,
              room: offering.room || offering.location || 'Online',
              lecturer: offering.instructor || offering.lecturer || offering.teacher || 'N/A',
              schedule: scheduleStr,
              classType: deriveClassType(scheduleStr, offering.classType || 'Lecture'),
              status: item.status,
              gradeValue: grade?.gradeValue,
              overallScore: grade?.overallScore,
              gradePoint: grade?.gradePoint,
              midtermGrade: grade?.midtermGrade,
              finalGrade: grade?.finalGrade,
            };
          });

          setSchedule(mapped);
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
    if (item.term !== selectedTerm) return false;
    if (isUpcomingTerm && item.status?.toLowerCase() === 'dropped') return false;
    return true;
  });

  // GPA calculation (10-point scale, all completed courses)
  const validGrades = allGrades.filter(g => Number(g.gradePoint) > 0);
  const earnedCredits = validGrades.reduce((sum, g) => sum + (g.credits || 0), 0);
  const weightedGp = validGrades.reduce((sum, g) => sum + (g.gradePoint || 0) * (g.credits || 0), 0);
  const gpa10 = earnedCredits > 0 ? weightedGp / earnedCredits : 0;

  // Active registrations (HKIII, non-dropped)
  const activeRegs = allRegistrations.filter(
    r => r.offering?.term === DEFAULT_TERM && r.status?.toLowerCase() !== 'dropped'
  );
  const activeRegCredits = activeRegs.reduce((sum, r) => sum + (r.offering?.course?.credits || 0), 0);

  // Stats for current view
  const viewCourses = filteredSchedule.length;
  const viewCredits = filteredSchedule.reduce((sum, item) => sum + item.credits, 0);
  const lectureCount = filteredSchedule.filter(i => !isPracticalClass(i.classType)).length;
  const labCount = filteredSchedule.filter(i => isPracticalClass(i.classType)).length;

  // ── GPA label ────────────────────────────────────────────────────
  const gpaLabel = gpa10 >= 8.5 ? 'Excellent' : gpa10 >= 7.0 ? 'Good' : gpa10 >= 5.0 ? 'Average' : '—';
  const gpa4 = (gpa10 * 0.4).toFixed(2);

  // ── Loading ──────────────────────────────────────────────────────
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
              {DAYS_OF_WEEK.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS_OF_WEEK.map(day => {
                const coursesOnDay = items.filter(i => i.day === day);
                return (
                  <td
                    key={day}
                    className={coursesOnDay.length > 0 ? 'timetable-cell--filled' : 'timetable-cell--empty'}
                  >
                    {coursesOnDay.length > 0
                      ? coursesOnDay.map(course => {
                          const halfBlock = isPracticalClass(course.classType);
                          const blockClass = halfBlock
                            ? 'timetable-course-block timetable-course-block--half'
                            : 'timetable-course-block';
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
                                    {isCompletedTerm && course.gradeValue && (
                                      <span className="timetable-course-block__grade">
                                        {' '}({course.gradeValue})
                                      </span>
                                    )}
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

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="timetable-page">
      {/* ── Header ── */}
      <div className="timetable-page__header">
        <div>
          <h1 className="timetable-page__title">
            <FaCalendarDays style={{ marginRight: 8 }} />
            Academic Timetable
          </h1>
          <p className="timetable-page__subtitle">
            {isUpcomingTerm
              ? 'HKIII 2025-2026 — Upcoming semester'
              : `${selectedTerm} — Completed semester`}
            {' · '}
            <span className="timetable-page__subtitle-link" onClick={() => navigate(ROUTES.COURSES)}>
              Go to Course Registration →
            </span>
          </p>
        </div>

        <div className="timetable-page__term-select">
          <label htmlFor="timetable-term-select">Semester:</label>
          <select
            id="timetable-term-select"
            value={selectedTerm}
            onChange={e => setSelectedTerm(e.target.value)}
          >
            {TERM_OPTIONS.map(term => (
              <option key={term} value={term}>
                {term} {term === DEFAULT_TERM ? '(Upcoming)' : COMPLETED_TERMS.includes(term) ? '(Completed)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Academic Overview Cards ── */}
      <div className="timetable-stats">
        {/* GPA Card (from grades) */}
        <div className="timetable-stat-card">
          <div className="timetable-stat-label">
            <FaGraduationCap style={{ marginRight: 4 }} />
            Cumulative GPA (10-scale)
          </div>
          <div className="timetable-stat-number">
            {gpa10.toFixed(2)}
            <span className="timetable-stat-badge--inline">{gpaLabel}</span>
          </div>
        </div>

        {/* GPA 4.0 Card */}
        <div className="timetable-stat-card timetable-stat-card--blue">
          <div className="timetable-stat-label">GPA (4.0 scale)</div>
          <div className="timetable-stat-number">
            {gpa4}
            <span className="timetable-stat-unit">/ 4.0</span>
          </div>
        </div>

        {/* Earned Credits Card */}
        <div className="timetable-stat-card timetable-stat-card--green">
          <div className="timetable-stat-label">
            <FaChartLine style={{ marginRight: 4 }} />
            Credits Earned
          </div>
          <div className="timetable-stat-number">
            {earnedCredits}
            <span className="timetable-stat-unit"> credits</span>
          </div>
        </div>

        {/* HKIII Registration Card */}
        {!isAdmin && (
          <div className={`timetable-stat-card ${activeRegCredits >= 24 ? 'timetable-stat-card--warn' : ''}`}>
            <div className="timetable-stat-label">
              <FaBookOpen style={{ marginRight: 4 }} />
              HKIII Registered
            </div>
            <div className="timetable-stat-number">
              {activeRegs.length}
              <span className="timetable-stat-unit"> courses ({activeRegCredits} cr / 24 max)</span>
            </div>
            {activeRegCredits >= 24 && (
              <span className="credits-warning-inline">
                <FaTriangleExclamation /> Credit limit reached
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── View-specific stats ── */}
      <div className="timetable-stats timetable-stats--secondary">
        <div className="timetable-stat-mini">
          <span className="mini-label">{isCompletedTerm ? 'Completed Courses' : 'Registered Courses'}</span>
          <span className="mini-value">{viewCourses}</span>
        </div>
        <div className="timetable-stat-mini">
          <span className="mini-label">Credits This Term</span>
          <span className="mini-value">{viewCredits}</span>
        </div>
        <div className="timetable-stat-mini">
          <span className="mini-label">Lectures</span>
          <span className="mini-value">{lectureCount}</span>
        </div>
        <div className="timetable-stat-mini">
          <span className="mini-label">Labs / Practical</span>
          <span className="mini-value">{labCount}</span>
        </div>
      </div>

      {/* ── Weekly Timetable Grid ── */}
      {renderWeeklyTable(
        isUpcomingTerm
          ? '📅 Weekly Timetable — HKIII (Upcoming)'
          : `📅 Weekly Timetable — ${selectedTerm}`,
        filteredSchedule
      )}

      {/* ── Detailed Table ── */}
      <div className="timetable-detailed-table">
        <div className="timetable-detailed-table__header">
          <h2>📋 Detailed Timetable — {selectedTerm}</h2>
        </div>
        <div className="timetable-detailed-table__wrapper">
          <table className="timetable-detailed-table__grid">
            <thead>
              <tr>
                <th>#</th>
                <th>Day</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Schedule</th>
                <th>Room</th>
                <th>Lecturer</th>
                <th>Type</th>
                {isCompletedTerm && (
                  <>
                    <th>Midterm</th>
                    <th>Final</th>
                    <th>Score</th>
                    <th>Grade</th>
                  </>
                )}
                {isUpcomingTerm && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="cell-mono">{idx + 1}</td>
                    <td className="cell-day">{item.day}</td>
                    <td className="cell-mono">{item.courseCode}</td>
                    <td className="cell-name">{item.courseName}</td>
                    <td className="cell-center">{item.credits}</td>
                    <td className="cell-text">{item.schedule || getTimeSlot(item.credits)}</td>
                    <td className="cell-text">{item.room}</td>
                    <td className="cell-text">{item.lecturer}</td>
                    <td>
                      <span className={`timetable-type-badge ${isPracticalClass(item.classType) ? 'timetable-type-badge--lab' : ''}`}>
                        {item.classType}
                      </span>
                    </td>
                    {isCompletedTerm && (
                      <>
                        <td className="cell-right">
                          {item.midtermGrade != null ? item.midtermGrade.toFixed(1) : '—'}
                        </td>
                        <td className="cell-right">
                          {item.finalGrade != null ? item.finalGrade.toFixed(1) : '—'}
                        </td>
                        <td className="cell-right">
                          {item.overallScore != null ? item.overallScore.toFixed(1) : '—'}
                        </td>
                        <td className="cell-right cell-grade">
                          {item.gradeValue ? (
                            <span className="grade-badge">{item.gradeValue}</span>
                          ) : '—'}
                        </td>
                      </>
                    )}
                    {isUpcomingTerm && (
                      <td>
                        <span className={`status-dot ${item.status?.toLowerCase() === 'enrolled' ? 'status-dot--active' : ''}`}>
                          <FaCircleCheck style={{ fontSize: 10, marginRight: 4 }} />
                          {item.status || 'ENROLLED'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isCompletedTerm ? 13 : isUpcomingTerm ? 10 : 9} className="timetable-empty">
                    {isUpcomingTerm
                      ? '📝 No courses registered for HKIII yet. Visit Course Registration to enroll.'
                      : `No timetable data available for ${selectedTerm}.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Cross-reference: all-term summary ── */}
      {!isAdmin && (
        <div className="timetable-cross-ref">
          <h3>📊 All-Term Academic Summary</h3>
          <div className="timetable-cross-ref__grid">
            {TERM_OPTIONS.map(term => {
              const termGrades = allGrades.filter(g => normalizeTerm(g.term) === term);
              const termRegs = schedule.filter(
                i => i.term === term && i.status?.toLowerCase() !== 'dropped'
              );
              const termCredits = termGrades.reduce((s, g) => s + (g.credits || 0), 0);
              const isCurrentCompleted = COMPLETED_TERMS.includes(term);
              return (
                <div
                  key={term}
                  className={`timetable-cross-ref__card ${selectedTerm === term ? 'timetable-cross-ref__card--active' : ''}`}
                  onClick={() => setSelectedTerm(term)}
                >
                  <div className="cross-ref__term">{term}</div>
                  <div className="cross-ref__courses">
                    {isCurrentCompleted
                      ? `${termGrades.length} courses graded`
                      : `${termRegs.length} courses registered`}
                  </div>
                  {isCurrentCompleted && termCredits > 0 && (
                    <div className="cross-ref__credits">{termCredits} credits earned</div>
                  )}
                  {!isCurrentCompleted && (
                    <div className="cross-ref__credits">
                      {termRegs.reduce((s, i) => s + i.credits, 0)} credits
                    </div>
                  )}
                  <div className="cross-ref__status">
                    {isCurrentCompleted ? (
                      <span className="cross-ref__badge cross-ref__badge--done">
                        <FaCircleCheck /> Completed
                      </span>
                    ) : (
                      <span className="cross-ref__badge cross-ref__badge--pending">
                        <FaClock /> Upcoming
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetablePage;
