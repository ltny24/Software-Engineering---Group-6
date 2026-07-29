import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  dropRegistration,
  getCourses,
  getMyRegistrations,
  registerCourse,
} from '../../services/courseService';
import type { CourseOffering, CourseRegistration } from '../../types';
import './CoursesPage.css';

const PAGE_SIZE = 9;
const DEPARTMENTS = ['Computer Science', 'Mathematics', 'General Studies'];
const TERMS = ['HKI 2025-2026', 'HKII 2025-2026', 'HKIII 2025-2026'];

const DEMO_OFFERINGS: CourseOffering[] = [
  {
    offeringId: 21,
    section: '01',
    term: 'HKIII 2025-2026',
    schedule: 'Mon/Wed 07:30 - 09:10',
    instructor: 'Prof. John von Neumann',
    location: 'Main Campus',
    room: 'Room A101',
    enrolledCount: 0,
    availableSeats: 150,
    course: {
      courseId: 11,
      courseCode: 'BAA00022',
      courseName: 'Physical Education 2',
      description: 'Advanced physical education and team sports',
      credits: 2,
      prerequisites: 'Physical Education 1',
      department: 'General Studies',
      semester: 'HKIII 2025-2026',
      capacity: 150,
    },
  },
  {
    offeringId: 23,
    section: '01',
    term: 'HKIII 2025-2026',
    schedule: 'Mon/Wed 09:30 - 11:10',
    instructor: 'Dr. Alan Turing',
    location: 'Main Campus',
    room: 'Room A102',
    enrolledCount: 0,
    availableSeats: 120,
    course: {
      courseId: 12,
      courseCode: 'BAA00102',
      courseName: 'Political Economy of Marxism-Leninism',
      description: 'Economic theories of Marxism-Leninism and market dynamics',
      credits: 2,
      prerequisites: 'Marxist-Leninist Philosophy',
      department: 'General Studies',
      semester: 'HKIII 2025-2026',
      capacity: 120,
    },
  },
  {
    offeringId: 25,
    section: '01',
    term: 'HKIII 2025-2026',
    schedule: 'Tue/Thu 07:30 - 09:10',
    instructor: 'Prof. Barbara Liskov',
    location: 'Main Campus',
    room: 'Room B201',
    enrolledCount: 0,
    availableSeats: 100,
    course: {
      courseId: 13,
      courseCode: 'CSC10006',
      courseName: 'Database Systems',
      description: 'Relational database design, SQL querying, indexing, and transactions',
      credits: 4,
      prerequisites: 'Computer Systems',
      department: 'Computer Science',
      semester: 'HKIII 2025-2026',
      capacity: 100,
    },
  },
  {
    offeringId: 27,
    section: '01',
    term: 'HKIII 2025-2026',
    schedule: 'Tue/Thu 09:30 - 11:10',
    instructor: 'Dr. Donald Knuth',
    location: 'Main Campus',
    room: 'Room B202',
    enrolledCount: 0,
    availableSeats: 100,
    course: {
      courseId: 14,
      courseCode: 'CSC13002',
      courseName: 'Introduction to Software Engineering',
      description: 'Software development lifecycle, agile methods, testing, and design patterns',
      credits: 4,
      prerequisites: 'Computational Thinking',
      department: 'Software Engineering',
      semester: 'HKIII 2025-2026',
      capacity: 100,
    },
  },
  {
    offeringId: 29,
    section: '01',
    term: 'HKIII 2025-2026',
    schedule: 'Fri 07:30 - 11:10',
    instructor: 'Prof. Grace Hopper',
    location: 'Main Campus',
    room: 'Room C301',
    enrolledCount: 0,
    availableSeats: 120,
    course: {
      courseId: 15,
      courseCode: 'MTH00057',
      courseName: 'Applied Mathematics & Statistics for IT',
      description: 'Discrete mathematics, linear algebra, and statistical applications for IT',
      credits: 4,
      prerequisites: 'Probability and Statistics',
      department: 'Mathematics',
      semester: 'HKIII 2025-2026',
      capacity: 120,
    },
  },
];

const DEMO_REGISTRATIONS: CourseRegistration[] = DEMO_OFFERINGS.map((offering, index) => ({
  registrationId: 2000 + Number(offering.offeringId),
  studentId: 12345,
  status: 'Enrolled',
  registeredAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
  offering,
}));

type TabKey = 'browse' | 'mine';

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('browse');

  // --- Catalog (Browse) state ---
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loadingOfferings, setLoadingOfferings] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Bộ lọc
  const [searchInput, setSearchInput] = useState<string>('');
  const [departmentInput, setDepartmentInput] = useState<string>('');
  const [termInput, setTermInput] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    department: '',
    term: '',
  });

  // --- My registrations state ---
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState<boolean>(true);

  // Trạng thái xử lý theo từng hành động (đăng ký / hủy)
  const [registeringId, setRegisteringId] = useState<string | number | null>(null);
  const [droppingId, setDroppingId] = useState<string | number | null>(null);

  // ------------------------------------------------------------
  // Gọi API danh sách khóa học (GET /courses)
  // ------------------------------------------------------------
  const fetchOfferings = useCallback(
    async (page: number) => {
      try {
        setLoadingOfferings(true);
        const params: Record<string, string | number> = {
          page,
          size: PAGE_SIZE,
        };
        if (appliedFilters.search) params.search = appliedFilters.search;
        if (appliedFilters.department) params.department = appliedFilters.department;
        if (appliedFilters.term) params.term = appliedFilters.term;

        const data = await getCourses(params);
        const received = data.content ?? [];
        const fallback =
          received.length > 0 ||
          page > 0 ||
          appliedFilters.search ||
          appliedFilters.department ||
          appliedFilters.term
            ? received
            : DEMO_OFFERINGS;

        setOfferings(fallback);
        setTotalPages(received.length > 0 ? (data.totalPages ?? 0) : 1);
        setTotalElements(
          received.length > 0 ? (data.totalElements ?? fallback.length) : fallback.length
        );
        setCurrentPage(received.length > 0 ? (data.number ?? 0) : 0);
      } catch (error) {
        toast.error('Failed to load course catalog.');
        console.error(error);
      } finally {
        setLoadingOfferings(false);
      }
    },
    [appliedFilters]
  );

  // ------------------------------------------------------------
  // Gọi API danh sách đăng ký của tôi (GET /registrations/me)
  // ------------------------------------------------------------
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoadingRegs(true);
      const data = await getMyRegistrations();
      const registrationsToShow =
        Array.isArray(data) && data.length > 0 ? data : DEMO_REGISTRATIONS;

      setRegistrations(registrationsToShow);
    } catch (error) {
      setRegistrations(DEMO_REGISTRATIONS);
      toast.error('Failed to load your registrations. Showing demo registrations instead.');
      console.error(error);
    } finally {
      setLoadingRegs(false);
    }
  }, []);

  useEffect(() => {
    fetchOfferings(0);
  }, [fetchOfferings]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      search: searchInput.trim(),
      department: departmentInput.trim(),
      term: termInput.trim(),
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDepartmentInput('');
    setTermInput('');
    setAppliedFilters({ search: '', department: '', term: '' });
  };

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    fetchOfferings(page);
  };

  const isActiveRegistration = (offeringId: string | number) => {
    return registrations.some((r) => {
      const registrationOfferingId = r.offering?.offeringId;
      return registrationOfferingId !== undefined && registrationOfferingId === offeringId;
    });
  };

  const handleRegister = async (offering: CourseOffering) => {
    try {
      setRegisteringId(offering.offeringId);
      await registerCourse(String(offering.offeringId));
      toast.success(`Registered for ${offering.course?.courseCode ?? 'this course'} successfully!`);
      // Làm mới cả 2 danh sách để cập nhật số chỗ còn trống & trạng thái
      await Promise.all([fetchOfferings(currentPage), fetchRegistrations()]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to register for this course.';
      toast.error(msg);
    } finally {
      setRegisteringId(null);
    }
  };

  const handleDrop = async (registration: CourseRegistration) => {
    const offering = registration.offering;
    const courseLabel = `${offering?.course?.courseCode ?? 'Course'} - ${offering?.section ?? ''}`;
    if (!window.confirm(`Drop registration for ${courseLabel}?`)) return;

    try {
      setDroppingId(registration.registrationId);
      await dropRegistration(String(registration.registrationId));
      toast.success(`Dropped ${courseLabel}.`);
      await Promise.all([fetchRegistrations(), fetchOfferings(currentPage)]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to drop this registration.';
      toast.error(msg);
    } finally {
      setDroppingId(null);
    }
  };

  const formatDateTime = (value: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const seatBadgeClass = (offering: CourseOffering) => {
    const seats = offering.availableSeats ?? 0;
    if (seats <= 0) return 'seat-badge full';
    if (seats <= 5) return 'seat-badge low';
    return 'seat-badge open';
  };

  const statusBadgeClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'enrolled') return 'badge active';
    if (s === 'dropped') return 'badge dropped';
    return 'badge requested';
  };

  const activeRegistrationsCount = registrations.filter((r) => {
    const status = r.status?.toUpperCase();
    return status !== 'DROPPED' && status !== 'DROPPED';
  }).length;

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>📚 Course Catalog</h2>
        <div className="tab-switch">
          <button
            className={`tab-btn ${activeTab === 'browse' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Courses
          </button>
          <button
            className={`tab-btn ${activeTab === 'mine' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('mine')}
          >
            My Registrations {activeRegistrationsCount > 0 && `(${activeRegistrationsCount})`}
          </button>
        </div>
      </div>

      {/* ============== TAB: BROWSE COURSES ============== */}
      {activeTab === 'browse' && (
        <div className="courses-card">
          <form className="filter-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="edit-input"
              placeholder="Search by course code or name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <select
              className="edit-input"
              value={departmentInput}
              onChange={(e) => setDepartmentInput(e.target.value)}
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <select
              className="edit-input"
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
            >
              <option value="">All terms</option>
              {TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
            <div className="filter-actions">
              <button type="button" className="btn-cancel" onClick={handleResetFilters}>
                Reset
              </button>
              <button type="submit" className="btn-save">
                Search
              </button>
            </div>
          </form>

          {loadingOfferings ? (
            <div className="profile-loading">
              <span className="spinner" /> Loading courses...
            </div>
          ) : offerings.length === 0 ? (
            <p className="empty-state">No course offerings match your filters.</p>
          ) : (
            <>
              <p className="result-count">
                {totalElements} offering{totalElements !== 1 ? 's' : ''} found
              </p>

              <div className="registration-table-wrapper">
                <table className="registration-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course Name</th>
                      <th>Section</th>
                      <th>Credits</th>
                      <th>Department</th>
                      <th>Schedule</th>
                      <th>Seats</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerings
                      .filter((offering) => {
                        const code = offering.course?.courseCode?.toUpperCase() || '';
                        const dept = appliedFilters.department;
                        if (dept === 'Computer Science') {
                          return (
                            code.startsWith('CSC') ||
                            offering.course?.department === 'Computer Science'
                          );
                        }
                        if (dept === 'Mathematics') {
                          return (
                            code.startsWith('MTH') || offering.course?.department === 'Mathematics'
                          );
                        }
                        if (dept === 'General Studies') {
                          return (
                            code.startsWith('BAA') ||
                            offering.course?.department === 'General Studies'
                          );
                        }
                        return true;
                      })
                      .map((offering) => {
                        const registered = isActiveRegistration(offering.offeringId);
                        const full = (offering.availableSeats ?? 0) <= 0;
                        return (
                          <tr className="registration-row" key={String(offering.offeringId)}>
                            <td data-label="Code">{offering.course?.courseCode ?? '—'}</td>
                            <td data-label="Course Name">
                              <span className="registration-course-name">
                                {offering.course?.courseName ?? '—'}
                              </span>
                              <span className="registration-sub muted">
                                {offering.course?.description ?? ''}
                              </span>
                            </td>
                            <td data-label="Section">{offering.section}</td>
                            <td data-label="Credits">{offering.course?.credits ?? 0}</td>
                            <td data-label="Department">{offering.course?.department ?? '—'}</td>
                            <td data-label="Schedule">{offering.schedule}</td>
                            <td data-label="Seats">
                              <span className={seatBadgeClass(offering)}>
                                {(offering.availableSeats ?? 0) > 0
                                  ? `${offering.availableSeats} seats left`
                                  : 'Full'}
                              </span>
                            </td>
                            <td data-label="Action" className="registration-action-cell">
                              <button
                                className="btn-edit register-btn"
                                disabled={
                                  registered || full || registeringId === offering.offeringId
                                }
                                onClick={() => handleRegister(offering)}
                              >
                                {registered
                                  ? 'Registered ✓'
                                  : registeringId === offering.offeringId
                                    ? 'Registering...'
                                    : full
                                      ? 'Full'
                                      : 'Register'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  className="btn-cancel"
                  disabled={currentPage <= 0}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  ‹ Prev
                </button>
                <span className="pagination-info">
                  Page {currentPage + 1} of {Math.max(totalPages, 1)}
                </span>
                <button
                  className="btn-cancel"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next ›
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ============== TAB: MY REGISTRATIONS ============== */}
      {activeTab === 'mine' && (
        <div className="courses-card">
          {loadingRegs ? (
            <div className="profile-loading">
              <span className="spinner" /> Loading your registrations...
            </div>
          ) : registrations.length === 0 ? (
            <p className="empty-state">You haven't registered for any courses yet.</p>
          ) : (
            <div className="registration-table-wrapper">
              <table className="registration-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course Name</th>
                    <th>Section</th>
                    <th>Credits</th>
                    <th>Capacity</th>
                    <th>Enrolled</th>
                    <th>Schedule</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr className="registration-row" key={String(reg.registrationId)}>
                      <td data-label="Code">{reg.offering?.course?.courseCode ?? '—'}</td>
                      <td data-label="Course Name">
                        <span className="registration-course-name">
                          {reg.offering?.course?.courseName ?? '—'}
                        </span>
                        <span className="registration-sub muted">
                          Registered at {formatDateTime(reg.registeredAt)}
                        </span>
                      </td>
                      <td data-label="Section">{reg.offering?.section ?? '—'}</td>
                      <td data-label="Credits">{reg.offering?.course?.credits ?? 0}</td>
                      <td data-label="Capacity">{reg.offering?.course?.capacity ?? 0}</td>
                      <td data-label="Enrolled">{reg.offering?.enrolledCount ?? 0}</td>
                      <td data-label="Schedule">{reg.offering?.schedule ?? '—'}</td>
                      <td data-label="Location">
                        {reg.offering?.location ?? '—'}
                        {reg.offering?.room ? ` – Room ${reg.offering.room}` : ''}
                      </td>
                      <td data-label="Status">
                        <span className={statusBadgeClass(reg.status)}>{reg.status}</span>
                      </td>
                      <td data-label="Action" className="registration-action-cell">
                        {reg.status?.toUpperCase() !== 'DROPPED' && (
                          <button
                            className="btn-cancel drop-btn"
                            disabled={droppingId === reg.registrationId}
                            onClick={() => handleDrop(reg)}
                          >
                            {droppingId === reg.registrationId ? 'Dropping...' : 'Drop'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
