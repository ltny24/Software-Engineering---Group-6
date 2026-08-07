import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import {
  dropRegistration,
  getCourses,
  getMyRegistrations,
  registerCourse,
} from '../../services/courseService';
import type { CourseOffering, CourseRegistration } from '../../types';
import { useAuth } from '../../auth';
import { ROLES } from '../../utils/constants';
import './CoursesPage.css';

const PAGE_SIZE = 9;
const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics'];
const TERMS = ['HKI 2025-2026', 'HKII 2025-2026', 'HKIII 2025-2026'];
const CURRENT_TERM = 'HKIII 2025-2026';
const COMPLETED_TERMS = ['HKI 2025-2026', 'HKII 2025-2026'];

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
  const [totalElements, setTotalElements] = useState<number>(0);

  // Bộ lọc
  const [searchInput, setSearchInput] = useState<string>('');
  const [departmentInput, setDepartmentInput] = useState<string>('');
  const [termInput, setTermInput] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState({ search: '', department: '', term: '' });

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
        const params: Record<string, string | number> = { page, size: PAGE_SIZE };
        if (appliedFilters.search) params.search = appliedFilters.search;
        if (appliedFilters.department) params.department = appliedFilters.department;
        if (appliedFilters.term) params.term = appliedFilters.term;

        const data = await getCourses(params);
        const received = data.content ?? [];

        setOfferings(received);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
        setCurrentPage(data.page ?? 0);
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

  // ------------------------------------------------------------
  // Gọi API danh sách đăng ký của tôi (GET /registrations/me)
  // ------------------------------------------------------------
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

  const isActiveRegistration = (offeringId: string | number) =>
    registrations.some(
      (r) => String(r.offering.offeringId) === String(offeringId) && r.status?.toLowerCase() !== 'dropped'
    );

  const findRegistrationByOffering = (offeringId: string | number): CourseRegistration | undefined =>
    registrations.find(
      (r) => String(r.offering.offeringId) === String(offeringId) && r.status?.toLowerCase() !== 'dropped'
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

      // Optimistic update: add new registration + adjust seat counts locally
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

      // Show schedule conflict warnings via toast (plain string, no JSX)
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

      // Optimistic update: mark registration as dropped + adjust seat counts locally
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

  const activeRegistrationsCount = registrations.filter((r) => r.status?.toLowerCase() !== 'dropped').length;
  const availableHK3Count = offerings.filter(
    (o) => o.term === CURRENT_TERM && !isActiveRegistration(o.offeringId)
  ).length;
  const totalCredits = registrations
    .filter((r) => r.status?.toLowerCase() !== 'dropped')
    .reduce((sum, r) => sum + (r.offering.course.credits || 0), 0);
  const MAX_CREDITS = 24;

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
            Browse Courses
          </button>
          {!isAdmin && (
            <button
              className={`tab-btn ${activeTab === 'mine' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('mine')}
            >
              My Registrations {availableHK3Count > 0 && `(${availableHK3Count})`}
            </button>
          )}
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
                    {offerings.map((offering) => {
                      const registered = isActiveRegistration(offering.offeringId);
                      const full = offering.availableSeats <= 0;
                      const isCompletedTerm = COMPLETED_TERMS.includes(offering.term);
                      return (
                        <tr className="registration-row" key={offering.offeringId}>
                          <td data-label="Code">{offering.course.courseCode}</td>
                          <td data-label="Course Name">
                            <span className="registration-course-name">
                              {offering.course.courseName}
                            </span>
                            <span className="registration-sub muted">
                              {offering.course.description}
                            </span>
                          </td>
                          <td data-label="Section">{offering.section}</td>
                          <td data-label="Credits">{offering.course.credits}</td>
                          <td data-label="Department">{offering.course.department}</td>
                          <td data-label="Schedule">{offering.schedule}</td>
                          <td data-label="Seats">
                            {isCompletedTerm ? (
                              <span>—</span>
                            ) : (
                              <span className={seatBadgeClass(offering)}>
                                {offering.availableSeats > 0
                                  ? `${offering.availableSeats} seats left`
                                  : 'Full'}
                              </span>
                            )}
                          </td>
                          <td data-label="Action" className="registration-action-cell">
                            {isCompletedTerm ? (
                              <span>—</span>
                            ) : isAdmin ? (
                              <button
                                className="btn-edit register-btn"
                                disabled
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                title="Administrators cannot register for courses"
                              >
                                Admin View
                              </button>
                            ) : registered ? (
                              <button
                                className="btn-cancel drop-btn"
                                disabled={droppingId != null}
                                onClick={() => handleCancelFromBrowse(offering)}
                              >
                                {droppingId != null ? 'Cancelling...' : 'Cancel'}
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
            <>
              <div className="credits-summary">
                <span>
                  Total credits this term:{' '}
                  <strong>
                    {totalCredits} / {MAX_CREDITS}
                  </strong>
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
                  {registrations.map((reg) => (
                    <tr className="registration-row" key={reg.registrationId}>
                      <td data-label="Code">{reg.offering.course.courseCode}</td>
                      <td data-label="Course Name">
                        <span className="registration-course-name">
                          {reg.offering.course.courseName}
                        </span>
                        <span className="registration-sub muted">
                          Registered at {formatDateTime(reg.registeredAt)}
                        </span>
                      </td>
                      <td data-label="Section">{reg.offering.section}</td>
                      <td data-label="Credits">{reg.offering.course.credits}</td>
                      <td data-label="Capacity">
                        {reg.offering.enrolledCount}/{reg.offering.course.capacity}
                      </td>
                      <td data-label="Schedule">{reg.offering.schedule}</td>
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
