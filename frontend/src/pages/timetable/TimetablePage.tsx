import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyRegistrations } from '../../services/courseService';
import type { CourseRegistration } from '../../types';

interface TimetableSlot {
  id: number | string;
  registrationId: number | string;
  term: string;
  day: string;
  dayShort: string;
  courseCode: string;
  courseName: string;
  timeSlot: string;
  room: string;
  instructor: string;
  section: string; // Used for Class Name (e.g., 24CTT1, 24KHMT1)
  sessionType: 'Lecture' | 'Lab';
}

export const TimetablePage: React.FC = () => {
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('HKI 2025-2026');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTimetableData();
  }, []);

  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      const data = await getMyRegistrations();
      setRegistrations(data || []);

      if (data && data.length > 0) {
        const terms = Array.from(new Set(data.map((r) => r.offering?.term).filter(Boolean)));
        if (terms.includes('HKI 2025-2026')) {
          setSelectedTerm('HKI 2025-2026');
        } else if (terms.length > 0) {
          setSelectedTerm(terms[0] as string);
        }
      }
    } catch (error) {
      toast.error('Failed to load student timetable from server.');
      console.error('Error fetching timetable data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Standardize Instructor Titles: Only allow "ThS." or "TS." or plain full name
  const cleanInstructorName = (rawName: string): string => {
    if (!rawName) return 'TBD';
    return rawName
      .replace(/^PGS\.\s*TS\./i, 'TS.')
      .replace(/^Dr\./i, 'TS.')
      .replace(/^Prof\./i, 'TS.')
      .replace(/^DS\./i, 'TS.')
      .trim();
  };

  // Convert CourseRegistration into TimetableSlot objects (handles both Theory and Lab sessions)
  const parseScheduleItems = (regList: CourseRegistration[]): TimetableSlot[] => {
    const slots: TimetableSlot[] = [];

    const dayMap: Record<string, { full: string; short: string }> = {
      Mon: { full: 'Monday', short: 'MON' },
      Tue: { full: 'Tuesday', short: 'TUE' },
      Wed: { full: 'Wednesday', short: 'WED' },
      Thu: { full: 'Thursday', short: 'THU' },
      Fri: { full: 'Friday', short: 'FRI' },
      Sat: { full: 'Saturday', short: 'SAT' },
      Sun: { full: 'Sunday', short: 'SUN' },
    };

    const parseSession = (sessionStr: string) => {
      let assignedDay = 'Monday';
      let dayShort = 'MON';
      let timePart = sessionStr.trim();

      for (const dayKey of Object.keys(dayMap)) {
        if (sessionStr.includes(dayKey)) {
          assignedDay = dayMap[dayKey].full;
          dayShort = dayMap[dayKey].short;
          timePart = sessionStr.replace(dayKey, '').replace('Lab:', '').trim();
          break;
        }
      }

      return { day: assignedDay, dayShort, timeSlot: timePart || '07:30 - 11:10' };
    };

    regList.forEach((reg) => {
      const offering = reg.offering;
      if (!offering || !offering.term) return;

      const term = offering.term;
      const courseCode = offering.course?.courseCode || 'N/A';
      const courseName = offering.course?.courseName || 'Course';
      const rawInstructor = offering.instructor || 'TBD';
      const instructor = cleanInstructorName(rawInstructor);

      // Strip "Room " prefix from room strings (e.g. "Room A101" -> "A101")
      const rawRoom = offering.room || offering.location || 'TBD';
      const cleanRoom = rawRoom.replace(/^Room\s+/i, '').trim();

      const className = offering.section || 'N/A';
      const rawSchedule = offering.schedule || 'Mon 07:30 - 11:10';

      const parts = rawSchedule.split('|');
      const theoryStr = parts[0];
      const labStr = parts[1];

      // Theory session
      const theoryInfo = parseSession(theoryStr);
      slots.push({
        id: `${reg.registrationId}-lecture`,
        registrationId: reg.registrationId,
        term,
        day: theoryInfo.day,
        dayShort: theoryInfo.dayShort,
        courseCode,
        courseName,
        timeSlot: theoryInfo.timeSlot,
        room: cleanRoom,
        instructor,
        section: className,
        sessionType: 'Lecture',
      });

      // Lab session (if present)
      if (labStr) {
        const labInfo = parseSession(labStr);
        const labRoom = cleanRoom.startsWith('Lab') ? cleanRoom : `Lab ${cleanRoom}`;
        slots.push({
          id: `${reg.registrationId}-lab`,
          registrationId: reg.registrationId,
          term,
          day: labInfo.day,
          dayShort: labInfo.dayShort,
          courseCode,
          courseName,
          timeSlot: labInfo.timeSlot,
          room: labRoom,
          instructor,
          section: className,
          sessionType: 'Lab',
        });
      }
    });

    return slots;
  };

  const allSlots = parseScheduleItems(registrations);
  const filteredSlots = allSlots.filter((slot) => slot.term === selectedTerm);
  const totalCourses = Array.from(new Set(filteredSlots.map((s) => s.courseCode))).length;
  const totalSessions = filteredSlots.length;

  if (loading) {
    return (
      <div
        style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}
      >
        Loading student timetable...
      </div>
    );
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Group slots by registrationId for the Detailed Table (Lecture first, Lab directly below)
  const groupedCoursesMap = new Map<string | number, TimetableSlot[]>();
  filteredSlots.forEach((slot) => {
    const list = groupedCoursesMap.get(slot.registrationId) || [];
    list.push(slot);
    groupedCoursesMap.set(slot.registrationId, list);
  });

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
              Track theory and lab class schedules, rooms, and instructors by semester
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
              <option value="HKI 2025-2026">Semester I (2025-2026)</option>
              <option value="HKII 2025-2026">Semester II (2025-2026)</option>
              <option value="HKIII 2025-2026">Semester III (2025-2026)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1',
              minWidth: '220px',
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
              Enrolled Courses
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
              {totalCourses}
            </div>
          </div>

          <div
            style={{
              flex: '1',
              minWidth: '220px',
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
              Weekly Class Sessions (Theory + Lab)
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: '#1e293b' }}>
              {totalSessions}
            </div>
          </div>
        </div>

        {/* Weekly Timetable Grid */}
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
              Weekly Class Schedule
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
                  {daysOfWeek.map((dayName) => (
                    <th
                      key={dayName}
                      style={{
                        padding: '14px 12px',
                        fontWeight: '600',
                        borderRight: '1px solid #e2e8f0',
                        minWidth: '140px',
                      }}
                    >
                      {dayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: '#ffffff' }}>
                  {daysOfWeek.map((dayName) => {
                    const coursesOnDay = filteredSlots.filter((item) => item.day === dayName);
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
                            {coursesOnDay.map((item) => (
                              <div
                                key={item.id}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  backgroundColor:
                                    item.sessionType === 'Lab' ? '#f0fdf4' : '#eff6ff',
                                  border: `1px solid ${
                                    item.sessionType === 'Lab' ? '#bbf7d0' : '#bfdbfe'
                                  }`,
                                  borderLeft: `3px solid ${
                                    item.sessionType === 'Lab' ? '#16a34a' : '#2563eb'
                                  }`,
                                }}
                              >
                                {/* Line 1: Course Code & Name */}
                                <div
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: item.sessionType === 'Lab' ? '#15803d' : '#1e40af',
                                    marginBottom: '3px',
                                    lineHeight: '1.3',
                                  }}
                                >
                                  {item.courseCode} - {item.courseName}
                                </div>
                                {/* Line 2: Time slot (No Icon) */}
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#475569',
                                    fontWeight: '500',
                                    marginBottom: '3px',
                                  }}
                                >
                                  {item.timeSlot}
                                </div>
                                {/* Line 3: Room | Class (No "Room " prefix) */}
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#64748b',
                                    fontWeight: '500',
                                  }}
                                >
                                  {item.room} | {item.section}
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

        {/* Detailed Schedule Table */}
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
              Detailed Course Schedule
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
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Course Name</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Code</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Schedule</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Room</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Instructor</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Class Name</th>
                  <th style={{ padding: '14px 24px', fontWeight: '600' }}>Session Type</th>
                </tr>
              </thead>
              <tbody>
                {groupedCoursesMap.size > 0 ? (
                  Array.from(groupedCoursesMap.values()).flatMap((slotsGroup, groupIdx) =>
                    slotsGroup.map((slotItem, slotIdx) => {
                      const isFirstInGroup = slotIdx === 0;
                      return (
                        <tr
                          key={slotItem.id}
                          style={{
                            borderBottom:
                              slotIdx === slotsGroup.length - 1
                                ? '2px solid #e2e8f0'
                                : '1px solid #f1f5f9',
                            backgroundColor: groupIdx % 2 === 0 ? '#ffffff' : '#fcfcfd',
                          }}
                        >
                          {/* Column 1: Course Name (Blank for Lab row) */}
                          <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>
                            {isFirstInGroup ? slotItem.courseName : ''}
                          </td>

                          {/* Column 2: Code (Blank for Lab row) */}
                          <td
                            style={{
                              padding: '16px 24px',
                              fontFamily: 'monospace',
                              color: '#475569',
                              fontWeight: '500',
                            }}
                          >
                            {isFirstInGroup ? slotItem.courseCode : ''}
                          </td>

                          {/* Column 3: Schedule (Day + Time, e.g. TUE 13:30 - 17:10) */}
                          <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: '500' }}>
                            <strong>{slotItem.dayShort}</strong> {slotItem.timeSlot}
                          </td>

                          {/* Column 4: Room (No "Room " prefix, e.g. B201 or Lab B203) */}
                          <td style={{ padding: '16px 24px', color: '#475569' }}>
                            {slotItem.room}
                          </td>

                          {/* Column 5: Instructor (Standardized title: TS. / ThS. / Plain) */}
                          <td style={{ padding: '16px 24px', color: '#475569' }}>
                            {slotItem.instructor}
                          </td>

                          {/* Column 6: Class Name */}
                          <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>
                            {slotItem.section}
                          </td>

                          {/* Column 7: Session Type Badge */}
                          <td style={{ padding: '16px 24px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '13px',
                                backgroundColor:
                                  slotItem.sessionType === 'Lab' ? '#f0fdf4' : '#eff6ff',
                                color: slotItem.sessionType === 'Lab' ? '#16a34a' : '#2563eb',
                                border: `1px solid ${
                                  slotItem.sessionType === 'Lab' ? '#bbf7d0' : '#bfdbfe'
                                }`,
                              }}
                            >
                              {slotItem.sessionType}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}
                    >
                      No timetable records found for this semester.
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
};

export default TimetablePage;
