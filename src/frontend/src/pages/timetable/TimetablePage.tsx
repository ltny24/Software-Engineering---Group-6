import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../auth';
import { ROLES } from '../../utils/constants';
import './TimetablePage.css';

interface TimetableItem {
  id: number;
  term: string;
  day: string;
  courseCode: string;
  courseName: string;
  periods: number;
  room: string;
  lecturer: string;
  classType: string;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function TimetablePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const [schedule, setSchedule] = useState<TimetableItem[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('2024-2025-HK2');
  const [loading, setLoading] = useState<boolean>(true);

  const getTimeSlot = (periods: number): string => {
    const timeSlots: Record<number, string> = {
      1: '7:00 - 8:30',
      2: '8:45 - 10:15',
      3: '10:30 - 12:00',
      4: '13:00 - 14:30',
      5: '14:45 - 16:15',
      6: '16:30 - 18:00',
      7: '18:15 - 19:45',
    };
    return timeSlots[periods] || 'N/A';
  };

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        setLoading(true);
        let rawData: any[] = [];

        if (isAdmin) {
          const res = await api.get<any>('/api/courses?size=1000');
          rawData = res.content || [];
        } else {
          const res = await api.get<any[]>('/api/registrations/me');
          rawData = res || [];
        }

        const mappedSchedule: TimetableItem[] = rawData.map((item: any, index: number) => {
          const offering = item.offering || item.courseOffering || item;
          const course = offering.course || item.course || {};

          let rawDay = offering.day || offering.dayOfWeek || 'Monday';
          if (!offering.day && offering.schedule) {
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
              if (offering.schedule.includes(key)) {
                rawDay = value;
                break;
              }
            }
          }

          return {
            id: item.registrationId || item.id || index,
            term: offering.term || offering.semester || item.term || '2024-2025-HK2',
            day: rawDay,
            courseCode: course.courseCode || offering.courseCode || 'N/A',
            courseName: course.courseName || course.name || offering.courseName || 'N/A',
            periods: course.credits || offering.credits || offering.periods || 3,
            room: offering.room || offering.location || 'Online',
            lecturer: offering.instructor || offering.lecturer || offering.teacher || 'N/A',
            classType: offering.classType || 'Lecture',
          };
        });

        setSchedule(mappedSchedule);
      } catch (error) {
        toast.error('Unable to load timetable data from the server.');
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="timetable-loading">
        <span className="spinner" /> Loading timetable...
      </div>
    );
  }

  const filteredSchedule = schedule.filter((item) => item.term === selectedTerm);
  const totalCourses = filteredSchedule.length;
  const totalPeriods = filteredSchedule.reduce((sum, item) => sum + item.periods, 0);

  const renderWeeklyTable = (title: string, schedulesToRender: TimetableItem[]) => (
    <div className="timetable-weekly-table" key={title}>
      <div className="timetable-weekly-table__header">
        <h2>{title}</h2>
      </div>
      <div className="timetable-weekly-table__wrapper">
        <table className="timetable-weekly-table__grid">
          <thead>
            <tr>
              {DAYS_OF_WEEK.map((dayName) => (
                <th key={dayName}>{dayName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS_OF_WEEK.map((dayName) => {
                const coursesOnDay = schedulesToRender.filter((item) => item.day === dayName);
                return (
                  <td
                    key={dayName}
                    className={
                      coursesOnDay.length > 0 ? 'timetable-cell--filled' : 'timetable-cell--empty'
                    }
                  >
                    {coursesOnDay.length > 0
                      ? coursesOnDay.map((course) => (
                          <div key={course.id} className="timetable-course-block">
                            {isAdmin ? (
                              <div className="timetable-course-block__name">
                                {course.courseName} {getTimeSlot(course.periods)}
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
                                  {getTimeSlot(course.periods)}
                                </div>
                                <div className="timetable-course-block__detail">
                                  {course.room} | {course.periods} periods
                                </div>
                              </>
                            )}
                          </div>
                        ))
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
      {/* Header */}
      <div className="timetable-page__header">
        <div>
          <h1 className="timetable-page__title">Academic Timetable</h1>
          <p className="timetable-page__subtitle">
            Track study schedules by semester and classrooms
          </p>
        </div>

        <div className="timetable-page__term-select">
          <label htmlFor="timetable-term-select">Semester:</label>
          <select
            id="timetable-term-select"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="2024-2025-HK2">Semester 2 (2024 - 2025)</option>
            <option value="2024-2025-HK1">Semester 1 (2024 - 2025)</option>
          </select>
        </div>
      </div>

      {/* Stat cards */}
      <div className="timetable-stats">
        <div className="timetable-stat-card">
          <div className="timetable-stat-label">Total Courses</div>
          <div className="timetable-stat-number">{totalCourses}</div>
        </div>

        <div className="timetable-stat-card timetable-stat-card--blue">
          <div className="timetable-stat-label">Total Periods / Week</div>
          <div className="timetable-stat-number">{totalPeriods}</div>
        </div>
      </div>

      {/* Weekly Timetable */}
      {isAdmin ? (
        <>
          {renderWeeklyTable(
            'Weekly Timetable - Morning',
            filteredSchedule.filter((item) => item.periods <= 3)
          )}
          {renderWeeklyTable(
            'Weekly Timetable - Afternoon',
            filteredSchedule.filter((item) => item.periods > 3)
          )}
        </>
      ) : (
        <>
          {renderWeeklyTable('Weekly Timetable', filteredSchedule)}

          {/* Detailed table */}
          <div className="timetable-detailed-table">
            <div className="timetable-detailed-table__header">
              <h2>Detailed Timetable</h2>
            </div>
            <div className="timetable-detailed-table__wrapper">
              <table className="timetable-detailed-table__grid">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Lecturer</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.length > 0 ? (
                    filteredSchedule.map((item) => (
                      <tr key={item.id}>
                        <td className="cell-day">{item.day}</td>
                        <td className="cell-mono">{item.courseCode}</td>
                        <td className="cell-name">{item.courseName}</td>
                        <td className="cell-text">{getTimeSlot(item.periods)}</td>
                        <td className="cell-text">{item.room}</td>
                        <td className="cell-text">{item.lecturer}</td>
                        <td>
                          <span className="timetable-type-badge">{item.classType}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="timetable-empty">
                        No timetable data available for this semester.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TimetablePage;
