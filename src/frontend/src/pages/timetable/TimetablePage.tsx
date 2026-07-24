import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

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
        const res = await api.get<any[]>('/api/registrations/me');

        console.log(' Dữ liệu thô từ Backend:', res);

        const mappedSchedule: TimetableItem[] = (res || []).map((item: any, index: number) => {
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
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#64748b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Loading timetable...
      </div>
    );
  }

  const filteredSchedule = schedule.filter((item) => item.term === selectedTerm);
  const totalCourses = filteredSchedule.length;
  const totalPeriods = filteredSchedule.reduce((sum, item) => sum + item.periods, 0);

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '32px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}
            >
              Academic Timetable
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Track study schedules by semester and classrooms
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <label
              htmlFor="timetable-term-select"
              style={{ fontSize: '14px', fontWeight: '500', color: '#475569', marginRight: '8px' }}
            >
              Semester:
            </label>
            <select
              id="timetable-term-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="2024-2025-HK2">Semester 2 (2024 - 2025)</option>
              <option value="2024-2025-HK1">Semester 1 (2024 - 2025)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #6366f1',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Total Courses
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
              {totalCourses}
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '250px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderTop: '4px solid #0ea5e9',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Total Periods / Week
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
              {totalPeriods}
            </div>
          </div>
        </div>

        {/* Weekly Timetable */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: 0 }}>
              Weekly Timetable
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '2px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {DAYS_OF_WEEK.map((dayName) => (
                    <th
                      key={dayName}
                      style={{
                        padding: '14px 12px',
                        fontWeight: '600',
                        borderRight: '1px solid #e2e8f0',
                        minWidth: '150px',
                      }}
                    >
                      {dayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#ffffff' }}>
                  {DAYS_OF_WEEK.map((dayName) => {
                    const coursesOnDay = filteredSchedule.filter((item) => item.day === dayName);
                    return (
                      <td
                        key={dayName}
                        style={{
                          padding: '12px',
                          borderRight: '1px solid #e2e8f0',
                          borderBottom: '1px solid #f1f5f9',
                          verticalAlign: 'top',
                          backgroundColor: coursesOnDay.length > 0 ? '#ffffff' : '#fcfcfd',
                        }}
                      >
                        {coursesOnDay.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {coursesOnDay.map((course) => (
                              <div
                                key={course.id}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  borderLeft: '3px solid #2563eb',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#1e40af',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {course.courseCode}
                                </div>
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#1e293b',
                                    fontWeight: '500',
                                    marginBottom: '2px',
                                  }}
                                >
                                  {course.courseName}
                                </div>
                                <div
                                  style={{
                                    fontSize: '10px',
                                    color: '#64748b',
                                    marginBottom: '4px',
                                  }}
                                >
                                  {getTimeSlot(course.periods)}
                                </div>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>
                                  {course.room} | {course.periods} periods
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            style={{
                              color: '#cbd5e1',
                              fontSize: '12px',
                              padding: '20px 0',
                              textAlign: 'center',
                            }}
                          >
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginTop: '32px',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: 0 }}>
              Detailed Timetable
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '2px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Day</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Course Code</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Course Name</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Time</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Room</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Lecturer</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fcfcfd',
                      }}
                    >
                      <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: '600' }}>
                        {item.day}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          fontFamily: 'monospace',
                          color: '#475569',
                          fontWeight: '500',
                        }}
                      >
                        {item.courseCode}
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>
                        {item.courseName}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>
                        {getTimeSlot(item.periods)}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>{item.room}</td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>{item.lecturer}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '13px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          {item.classType}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}
                    >
                      No timetable data available for this semester.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetablePage;
