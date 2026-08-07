import React, { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaBookOpen, FaChevronLeft, FaChevronRight, FaTriangleExclamation } from 'react-icons/fa6';
import {
  dropRegistration,
  getCourses,
  getMyRegistrations,
  registerCourse,
} from '../../services/courseService';
import type { CourseOffering, CourseRegistration } from '../../types';
import { useAuth } from '../../auth/useAuth';
import { ROLES } from '../../utils/constants';
import './CoursesPage.css';

const PAGE_SIZE = 9;
const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics', 'General Studies'];
const CURRENT_TERM = 'HKIII 2025-2026';
const SEMESTER_OPTIONS = [
  { label: 'All Terms', value: '' },
  { label: 'HKI 2025-2026', value: 'HKI 2025-2026' },
  { label: 'HKII 2025-2026', value: 'HKII 2025-2026' },
  { label: 'HKIII 2025-2026', value: 'HKIII 2025-2026' },
];

const COMPLETED_OFFERINGS_HKI: CourseOffering[] = [
  {
    offeringId: 'hki-off-1',
    section: '24KHDT1',
    term: 'HKI 2025-2026',
    schedule: 'Mon 07:30 - 11:10',
    instructor: 'TS. Nguyen Van An',
    location: 'Main Campus',
    room: 'Room A101',
    enrolledCount: 120,
    availableSeats: 0,
    course: {
      courseId: 'c-hki-1',
      courseCode: 'BAA00005',
      courseName: 'General Economics',
      description: 'Introduction to microeconomics and macroeconomics principles',
      credits: 2,
      prerequisites: 'None',
      department: 'General Studies',
      semester: 'HKI 2025-2026',
      capacity: 120,
    },
  },
  {
    offeringId: 'hki-off-2',
    section: '24CTT1',
    term: 'HKI 2025-2026',
    schedule: 'Tue 07:30 - 11:10',
    instructor: 'ThS. Le Hoang Cuong',
    location: 'Main Campus',
    room: 'Room A102',
    enrolledCount: 150,
    availableSeats: 0,
    course: {
      courseId: 'c-hki-2',
      courseCode: 'BAA00030',
      courseName: 'National Defense Education',
      description: 'National defense security policies and basic military training',
      credits: 4,
      prerequisites: 'None',
      department: 'General Studies',
      semester: 'HKI 2025-2026',
      capacity: 150,
    },
  },
  {
    offeringId: 'hki-off-3',
    section: '24KHMT1',
    term: 'HKI 2025-2026',
    schedule: 'Mon 13:30 - 17:10 | Lab: Wed 13:30 - 15:30',
    instructor: 'TS. Vo Van Em',
    location: 'Main Campus',
    room: 'Room A103',
    enrolledCount: 100,
    availableSeats: 0,
    course: {
      courseId: 'c-hki-3',
      courseCode: 'CSC10009',
      courseName: 'Computer Systems',
      description: 'Computer organization, hardware architecture, and assembly programming',
      credits: 2,
      prerequisites: 'None',
      department: 'Computer Science',
      semester: 'HKI 2025-2026',
      capacity: 100,
    },
  },
  {
    offeringId: 'hki-off-4',
    section: '24CTT1',
    term: 'HKI 2025-2026',
    schedule: 'Wed 07:30 - 11:10 | Lab: Fri 07:30 - 09:30',
    instructor: 'TS. Nguyen Van An',
    location: 'Main Campus',
    room: 'Room A104',
    enrolledCount: 120,
    availableSeats: 0,
    course: {
      courseId: 'c-hki-4',
      courseCode: 'CSC10014',
      courseName: 'Computational Thinking',
      description: 'Problem solving, algorithmic thinking, and introductory programming',
      credits: 4,
      prerequisites: 'None',
      department: 'Computer Science',
      semester: 'HKI 2025-2026',
      capacity: 120,
    },
  },
  {
    offeringId: 'hki-off-5',
    section: '24TTH1',
    term: 'HKI 2025-2026',
    schedule: 'Thu 07:30 - 11:10 | Lab: Fri 09:30 - 11:30',
    instructor: 'ThS. Le Hoang Cuong',
    location: 'Main Campus',
    room: 'Room A105',
    enrolledCount: 120,
    availableSeats: 0,
    course: {
      courseId: 'c-hki-5',
      courseCode: 'MTH00006',
      courseName: 'Calculus 2',
      description: 'Multivariable calculus, series, vectors, and partial derivatives',
      credits: 4,
      prerequisites: 'None',
      department: 'Mathematics',
      semester: 'HKI 2025-2026',
      capacity: 120,
    },
  },
];

const COMPLETED_OFFERINGS_HKII: CourseOffering[] = [
  {
    offeringId: 'hkii-off-1',
    section: '24C01',
    term: 'HKII 2025-2026',
    schedule: 'Mon 07:30 - 09:30',
    instructor: 'TS. Vo Van Em',
    location: 'Main Campus',
    room: 'Room A106',
    enrolledCount: 150,
    availableSeats: 0,
    course: {
      courseId: 'c-hkii-1',
      courseCode: 'BAA00021',
      courseName: 'Physical Education 1',
      description: 'Basic physical fitness and athletics training',
      credits: 2,
      prerequisites: 'None',
      department: 'General Studies',
      semester: 'HKII 2025-2026',
      capacity: 150,
    },
  },
  {
    offeringId: 'hkii-off-2',
    section: '24C03',
    term: 'HKII 2025-2026',
    schedule: 'Tue 07:30 - 11:10',
    instructor: 'TS. Nguyen Van An',
    location: 'Main Campus',
    room: 'Room A107',
    enrolledCount: 120,
    availableSeats: 0,
    course: {
      courseId: 'c-hkii-2',
      courseCode: 'BAA00101',
      courseName: 'Marxist-Leninist Philosophy',
      description: 'Fundamental principles of Marxist-Leninist philosophy and dialectics',
      credits: 3,
      prerequisites: 'None',
      department: 'General Studies',
      semester: 'HKII 2025-2026',
      capacity: 120,
    },
  },
  {
    offeringId: 'hkii-off-3',
    section: '24KTPM1',
    term: 'HKII 2025-2026',
    schedule: 'Wed 07:30 - 11:10 | Lab: Wed 13:30 - 15:30',
    instructor: 'ThS. Le Hoang Cuong',
    location: 'Main Campus',
    room: 'Room A108',
    enrolledCount: 100,
    availableSeats: 0,
    course: {
      courseId: 'c-hkii-3',
      courseCode: 'CSC10007',
      courseName: 'Operating Systems',
      description: 'Process management, memory allocation, storage, and concurrency',
      credits: 4,
      prerequisites: 'None',
      department: 'Computer Science',
      semester: 'HKII 2025-2026',
      capacity: 100,
    },
  },
  {
    offeringId: 'hkii-off-4',
    section: '24TTNT1',
    term: 'HKII 2025-2026',
    schedule: 'Thu 07:30 - 11:10 | Lab: Thu 13:30 - 15:30',
    instructor: 'TS. Vo Van Em',
    location: 'Main Campus',
    room: 'Room A109',
    enrolledCount: 100,
    availableSeats: 0,
    course: {
      courseId: 'c-hkii-4',
      courseCode: 'CSC14003',
      courseName: 'Introduction to Artificial Intelligence',
      description: 'Search algorithms, knowledge representation, machine learning basics',
      credits: 4,
      prerequisites: 'None',
      department: 'Computer Science',
      semester: 'HKII 2025-2026',
      capacity: 100,
    },
  },
  {
    offeringId: 'hkii-off-5',
    section: '24TTH1',
    term: 'HKII 2025-2026',
    schedule: 'Fri 07:30 - 11:10 | Lab: Fri 13:30 - 15:30',
    instructor: 'TS. Nguyen Van An',
    location: 'Main Campus',
    room: 'Room A1010',
    enrolledCount: 120,
    availableSeats: 0,
    course: {
      courseId: 'c-hkii-5',
      courseCode: 'MTH00007',
      courseName: 'Probability and Statistics',
      description: 'Probability theory, random variables, hypothesis testing, regression',
      credits: 4,
      prerequisites: 'None',
      department: 'Mathematics',
      semester: 'HKII 2025-2026',
      capacity: 120,
    },
  },
];

type TabKey = 'browse' | 'mine';

export default function CoursesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const [activeTab, setActiveTab] = useState<TabKey>('browse');

  // --- Catalog (Browse) state ---
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loadingOfferings, setLoadingOfferings] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Filters
  const [searchInput, setSearchInput] = useState<string>('');
  const [departmentInput, setDepartmentInput] = useState<string>('');
  const [termInput, setTermInput] = useState<string>(CURRENT_TERM);
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    department: '',
    term: CURRENT_TERM,
  });

  // --- My registrations state ---
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState<boolean>(true);

  // Processing state
  const [registeringId, setRegisteringId] = useState<string | number | null>(null);
  const [droppingId, setDroppingId] = useState<string | number | null>(null);

  // Fetch courses from API
  const fetchOfferings = useCallback(
    async (pageToFetch: number) => {
      try {
        setLoadingOfferings(true);
        const params: Record<string, string | number> = { page: pageToFetch, size: PAGE_SIZE };
        if (appliedFilters.search) params.search = appliedFilters.search;
        if (appliedFilters.department) params.department = appliedFilters.department;
        if (appliedFilters.term) params.term = appliedFilters.term;

        const data = await getCourses(params);
        const received = data.content ?? [];

        setOfferings(received);
        setTotalPages(data.totalPages ?? 1);
        setCurrentPage(pageToFetch);
      } catch (error) {
        toast.error('Failed to load course catalog. Please try again later.');
        setOfferings([]);
        console.error(error);
      } finally {
        setLoadingOfferings(false);
      }
    },
    [appliedFilters]
  );

  // Fetch student registrations from API
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoadingRegs(true);
      const data = await getMyRegistrations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      setRegistrations([]);
      toast.error('Failed to load your registrations. Please try again later.');
      console.error(error);
    } finally {
      setLoadingRegs(false);
    }
  }, []);

  useEffect(() => {
    fetchOfferings(currentPage);
  }, [appliedFilters, currentPage, fetchOfferings]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setAppliedFilters({
      search: searchInput.trim(),
      department: departmentInput.trim(),
      term: termInput,
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setDepartmentInput('');
    setTermInput('');
    setCurrentPage(0);
    setAppliedFilters({ search: '', department: '', term: '' });
  };

  const goToPage = (page: number) => {
    if (page < 0 || (totalPages > 0 && page >= totalPages)) return;
    setCurrentPage(page);
  };

  const isActiveRegistration = (offeringId: string | number) =>
    registrations.some(
      (r) =>
        String(r.offering?.offeringId) === String(offeringId) &&
        r.status?.toLowerCase() !== 'dropped'
    );

  const registeredCourseCodes = useMemo(() => {
    const active = registrations.filter((r) => r.status?.toLowerCase() !== 'dropped');
    return new Set(active.map((r) => r.offering?.course?.courseCode).filter(Boolean));
  }, [registrations]);

  const findRegistrationByOffering = (
    offeringId: string | number
  ): CourseRegistration | undefined =>
    registrations.find(
      (r) =>
        String(r.offering?.offeringId) === String(offeringId) &&
        r.status?.toLowerCase() !== 'dropped'
    );

  const handleCancelFromBrowse = async (offering: CourseOffering) => {
    const reg = findRegistrationByOffering(offering.offeringId);
    if (!reg) return;
    await handleDrop(reg);
  };

  const handleRegister = async (offering: CourseOffering) => {
    try {
      setRegisteringId(offering.offeringId);
      const result = await registerCourse(offering.offeringId);
      toast.success(`Registered for ${offering.course.courseCode} successfully!`);

      setRegistrations((prev) => [result, ...prev]);

      setOfferings((prev) =>
        prev.map((o) =>
          String(o.offeringId) === String(offering.offeringId)
            ? {
                ...o,
                enrolledCount: o.enrolledCount + 1,
                availableSeats: Math.max(0, o.availableSeats - 1),
              }
            : o
        )
      );

      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning) => {
          toast.error(warning, {
            icon: '⚠️',
            duration: 6000,
            style: { background: '#fffbeb', border: '1px solid #f59e0b', color: '#92400e' },
          });
        });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to register for this course.';
      toast.error(msg);
    } finally {
      setRegisteringId(null);
    }
  };

  const handleDrop = async (registration: CourseRegistration) => {
    const courseLabel = `${registration.offering.course.courseCode} - ${registration.offering.section}`;
    if (!window.confirm(`Drop registration for ${courseLabel}?`)) return;

    try {
      setDroppingId(registration.registrationId);
      await dropRegistration(registration.registrationId);
      toast.success(`Dropped ${courseLabel}.`);

      setRegistrations((prev) =>
        prev.map((r) =>
          String(r.registrationId) === String(registration.registrationId)
            ? { ...r, status: 'DROPPED' as const }
            : r
        )
      );

      setOfferings((prev) =>
        prev.map((o) =>
          String(o.offeringId) === String(registration.offering.offeringId)
            ? {
                ...o,
                enrolledCount: Math.max(0, o.enrolledCount - 1),
                availableSeats: o.availableSeats + 1,
              }
            : o
        )
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to drop this registration.';
      toast.error(msg);
    } finally {
      setDroppingId(null);
    }
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

  // Only show HKIII 2025-2026 active registrations in the My Registration tab
  const hkiiiRegistrations = useMemo(
    () =>
      registrations.filter((r) => {
        if (r.status?.toLowerCase() === 'dropped') return false;
        const term =
          r.offering?.term || (r.offering as any)?.courseOffering?.term || (r as any)?.term || '';
        // Accept HKIII or registrations with no term info (just-registered)
        return !term || term === CURRENT_TERM || term.includes('HKIII') || term.includes('HK3');
      }),
    [registrations]
  );

  const activeRegistrationsCount = hkiiiRegistrations.length;

  const totalCredits = hkiiiRegistrations.reduce(
    (sum, r) => sum + (r.offering?.course?.credits || 0),
    0
  );
  const MAX_CREDITS = 24;

  const isHistoricalSelected =
    appliedFilters.term === 'HKI 2025-2026' || appliedFilters.term === 'HKII 2025-2026';

  const displayedOfferings = useMemo(() => {
    if (appliedFilters.term === 'HKI 2025-2026') {
      let list = COMPLETED_OFFERINGS_HKI;
      if (appliedFilters.search) {
        const q = appliedFilters.search.toLowerCase();
        list = list.filter(
          (o) =>
            o.course.courseCode.toLowerCase().includes(q) ||
            o.course.courseName.toLowerCase().includes(q)
        );
      }
      if (appliedFilters.department) {
        list = list.filter((o) => o.course.department === appliedFilters.department);
      }
      return list;
    }
    if (appliedFilters.term === 'HKII 2025-2026') {
      let list = COMPLETED_OFFERINGS_HKII;
      if (appliedFilters.search) {
        const q = appliedFilters.search.toLowerCase();
        list = list.filter(
          (o) =>
            o.course.courseCode.toLowerCase().includes(q) ||
            o.course.courseName.toLowerCase().includes(q)
        );
      }
      if (appliedFilters.department) {
        list = list.filter((o) => o.course.department === appliedFilters.department);
      }
      return list;
    }
    return offerings;
  }, [appliedFilters.term, appliedFilters.search, appliedFilters.department, offerings]);

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>
          <FaBookOpen /> Course Catalog
        </h2>
        <div className="tab-switch">
          <button
            className={`tab-btn ${activeTab === 'browse' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Course
          </button>
          {!isAdmin && (
            <button
              className={`tab-btn ${activeTab === 'mine' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('mine')}
            >
              My Registration ({activeRegistrationsCount})
            </button>
          )}
        </div>
      </div>

      {/* ============== TAB: BROWSE COURSE ============== */}
      {activeTab === 'browse' && (
        <div className="courses-card">
          <form
            className="filter-bar"
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              className="edit-input"
              style={{ flex: '1 1 200px' }}
              placeholder="Search by course code or name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <select
              className="edit-input"
              style={{ flex: '1 1 150px' }}
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
              style={{ flex: '1 1 150px' }}
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
            >
              {SEMESTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div
              className="filter-actions"
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
            >
              <button type="submit" className="btn-save">
                Search
              </button>
              <button type="button" className="btn-cancel" onClick={handleResetFilters}>
                Reset
              </button>
            </div>
          </form>

          {loadingOfferings ? (
            <div className="profile-loading">
              <span className="spinner" /> Loading courses...
            </div>
          ) : displayedOfferings.length === 0 ? (
            <p className="empty-state">No course offerings match your filters.</p>
          ) : (
            <>
              <p className="result-count">
                {displayedOfferings.length} course{displayedOfferings.length !== 1 ? 's' : ''} found
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
                    {displayedOfferings.map((offering) => {
                      const isHistorical =
                        isHistoricalSelected ||
                        offering.term === 'HKI 2025-2026' ||
                        offering.term === 'HKII 2025-2026';
                      const registeredSameSection = isActiveRegistration(offering.offeringId);
                      const registeredOtherSection =
                        !registeredSameSection &&
                        registeredCourseCodes.has(offering.course.courseCode);
                      const full = offering.availableSeats <= 0;

                      return (
                        <tr className="registration-row" key={offering.offeringId}>
                          <td data-label="Code" className="font-mono">
                            {offering.course.courseCode}
                          </td>
                          <td data-label="Course Name">
                            <span className="registration-course-name">
                              {offering.course.courseName}
                            </span>
                            <span className="registration-sub muted">
                              {offering.course.description}
                            </span>
                          </td>
                          <td data-label="Section">{isHistorical ? '—' : offering.section}</td>
                          <td data-label="Credits">{offering.course.credits}</td>
                          <td data-label="Department">{offering.course.department}</td>
                          <td data-label="Schedule">{isHistorical ? '—' : offering.schedule}</td>
                          <td data-label="Seats">
                            {isHistorical ? (
                              ''
                            ) : (
                              <span className={seatBadgeClass(offering)}>
                                {offering.availableSeats > 0
                                  ? `${offering.availableSeats} seats left`
                                  : 'Full'}
                              </span>
                            )}
                          </td>
                          <td data-label="Action" className="registration-action-cell">
                            {isHistorical ? (
                              ''
                            ) : isAdmin ? (
                              <button
                                className="btn-edit register-btn"
                                disabled
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                title="Administrators cannot register for courses"
                              >
                                Admin View
                              </button>
                            ) : registeredSameSection ? (
                              <button
                                className="btn-cancel drop-btn"
                                disabled={droppingId != null}
                                onClick={() => handleCancelFromBrowse(offering)}
                              >
                                {droppingId != null ? 'Cancelling...' : 'Cancel'}
                              </button>
                            ) : registeredOtherSection ? (
                              <button
                                className="btn-edit register-btn"
                                disabled
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                title="You are already registered for another section of this course"
                              >
                                Section Enrolled
                              </button>
                            ) : (
                              <button
                                className="btn-edit register-btn"
                                disabled={full || registeringId === offering.offeringId}
                                onClick={() => handleRegister(offering)}
                              >
                                {registeringId === offering.offeringId
                                  ? 'Registering...'
                                  : full
                                    ? 'Full'
                                    : 'Register'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!isHistoricalSelected && totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn-cancel"
                    disabled={currentPage <= 0}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    <FaChevronLeft /> Prev
                  </button>
                  <span className="pagination-info">
                    Page {currentPage + 1} of {Math.max(totalPages, 1)}
                  </span>
                  <button
                    className="btn-cancel"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ============== TAB: MY REGISTRATION ============== */}
      {activeTab === 'mine' && (
        <div className="courses-card">
          {loadingRegs ? (
            <div className="profile-loading">
              <span className="spinner" /> Loading your registrations...
            </div>
          ) : hkiiiRegistrations.length === 0 ? (
            <p className="empty-state">No active registrations for {CURRENT_TERM} yet.</p>
          ) : (
            <>
              <div className="credits-summary">
                <span>
                  Total credits this term:{' '}
                  <strong>
                    {totalCredits} / {MAX_CREDITS}
                  </strong>
                </span>
                <span>
                  Active registrations: <strong>{activeRegistrationsCount}</strong>
                </span>
                {totalCredits >= MAX_CREDITS && (
                  <span className="credits-warning">
                    <FaTriangleExclamation /> Credit limit reached
                  </span>
                )}
                {totalCredits >= MAX_CREDITS - 4 && totalCredits < MAX_CREDITS && (
                  <span className="credits-near-limit">Approaching credit limit</span>
                )}
              </div>
              <div className="registration-table-wrapper">
                <table className="registration-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course Name</th>
                      <th>Section</th>
                      <th>Credits</th>
                      <th>Capacity</th>
                      <th>Schedule</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hkiiiRegistrations.map((reg) => (
                      <tr className="registration-row" key={reg.registrationId}>
                        <td data-label="Code" className="font-mono">
                          {reg.offering?.course?.courseCode}
                        </td>
                        <td data-label="Course Name">
                          <span className="registration-course-name">
                            {reg.offering?.course?.courseName}
                          </span>
                        </td>
                        <td data-label="Section">{reg.offering?.section}</td>
                        <td data-label="Credits">{reg.offering?.course?.credits}</td>
                        <td data-label="Capacity">
                          {reg.offering?.enrolledCount}/{reg.offering?.course?.capacity || 150}
                        </td>
                        <td data-label="Schedule">{reg.offering?.schedule}</td>
                        <td data-label="Status">
                          <span className={statusBadgeClass(reg.status)}>{reg.status}</span>
                        </td>
                        <td data-label="Action" className="registration-action-cell">
                          {reg.status?.toLowerCase() !== 'dropped' && (
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
