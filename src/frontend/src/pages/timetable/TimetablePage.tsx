import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyRegistrations } from '../../services/courseService';
import type { CourseRegistration } from '../../types';
import './TimetablePage.css';

interface TimetableEvent {
  id: number;
  title: string;
  courseCode?: string;
  type?: 'CLASS' | 'EXAM' | string;
  start: string; // ISO datetime
  end?: string; // ISO datetime
  location?: string;
  instructor?: string;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getNextWeekdayDate(weekday: number, hours: number, minutes: number) {
  const date = new Date();
  const currentDay = date.getDay();
  const delta = (weekday + 7 - currentDay) % 7;
  date.setDate(date.getDate() + delta);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const DEMO_EVENTS: TimetableEvent[] = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    courseCode: 'CS101',
    type: 'CLASS',
    start: getNextWeekdayDate(1, 9, 0).toISOString(),
    end: new Date(getNextWeekdayDate(1, 9, 0).getTime() + 90 * 60 * 1000).toISOString(),
    location: 'Room: 204',
    instructor: 'Lecturer: Nguyễn',
  },
  {
    id: 2,
    title: 'Linear Algebra',
    courseCode: 'MATH230',
    type: 'CLASS',
    start: getNextWeekdayDate(3, 11, 0).toISOString(),
    end: new Date(getNextWeekdayDate(3, 11, 0).getTime() + 90 * 60 * 1000).toISOString(),
    location: 'Room: 108',
    instructor: 'Lecturer: Trần',
  },
];

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

export default function TimetablePage() {
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const registrations = await getMyRegistrations();
        if (!mounted) return;

        const mappedEvents = (registrations || []).map((registration, index) => {
          const start = getNextWeekdayDate((index % 5) + 1, 9 + index * 2, 0);
          return {
            id: registration.registrationId,
            title: registration.offering.course.courseName,
            courseCode: registration.offering.course.courseCode,
            type: 'CLASS',
            start: start.toISOString(),
            end: new Date(start.getTime() + 90 * 60 * 1000).toISOString(),
            location: registration.offering.location || registration.offering.room,
            instructor: registration.offering.instructor,
          } as TimetableEvent;
        });

        if (mappedEvents.length > 0) {
          setEvents(mappedEvents);
        } else {
          setEvents(DEMO_EVENTS);
        }
      } catch (error) {
        if (!mounted) return;
        setEvents(DEMO_EVENTS);
        toast.error('Failed to load timetable. Showing demo schedule instead.');
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date());
    const d = new Date(base);
    d.setDate(base.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekEnd = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    return d;
  }, [weekStart]);

  const eventsByDay = useMemo(() => {
    const buckets: TimetableEvent[][] = [[], [], [], [], [], [], []];

    for (const ev of events) {
      const dt = new Date(ev.start);
      if (isNaN(dt.getTime())) continue;
      if (dt < weekStart || dt >= weekEnd) continue;
      // Map JS getDay (0=Sun..6=Sat) to Monday-first index
      const idx = (dt.getDay() + 6) % 7;
      buckets[idx].push(ev);
    }

    // Sort events by start time within each day
    for (const b of buckets) {
      b.sort((a, b2) => new Date(a.start).getTime() - new Date(b2.start).getTime());
    }

    return buckets;
  }, [events, weekStart, weekEnd]);

  const formatTime = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString()} — ${end.toLocaleDateString()}`;
  };

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h2>🗓️ My Timetable</h2>
        <div className="timetable-controls">
          <button className="btn-cancel" onClick={() => setWeekOffset((s) => s - 1)}>
            ‹ Prev
          </button>
          <div className="week-range">{formatDateRange(weekStart)}</div>
          <button className="btn-save" onClick={() => setWeekOffset((s) => s + 1)}>
            Next ›
          </button>
        </div>
      </div>

      <div className="timetable-card">
        {loading ? (
          <div className="profile-loading">
            <span className="spinner" /> Loading timetable...
          </div>
        ) : (
          <div className="timetable-grid" role="table">
            {DAY_NAMES.map((label, i) => {
              const date = new Date(weekStart);
              date.setDate(weekStart.getDate() + i);
              const dayEvents = eventsByDay[i] || [];

              return (
                <div className="day-column" key={label} role="column">
                  <div className="day-header">
                    <div className="day-name">{label}</div>
                    <div className="day-date">{date.toLocaleDateString()}</div>
                  </div>

                  {dayEvents.length === 0 ? (
                    <div className="empty-day">No events</div>
                  ) : (
                    <div className="events-list">
                      {dayEvents.map((ev) => (
                        <div className={`event-card ${ev.type?.toLowerCase()}`} key={ev.id}>
                          <div className="event-title-row">
                            {ev.courseCode && (
                              <span className="event-course-code">{ev.courseCode}</span>
                            )}
                            {ev.courseCode && ev.title && (
                              <span className="event-title-sep">-</span>
                            )}
                            <span className="event-title">{ev.title}</span>
                          </div>
                          <div className="event-time">
                            {formatTime(ev.start)}
                            {ev.end ? ` — ${formatTime(ev.end)}` : ''}
                          </div>
                          {(ev.instructor || ev.location) && (
                            <div className="event-meta">
                              {ev.instructor && <span>{ev.instructor}</span>}
                              {ev.location && <span>{ev.location}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
