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
  const [appliedFilters, setAppliedFilters] = useState({ search: '', department: '', term: '' });

  // --- My registrations state ---
  const [registrations, setRegistrations] = useState<CourseRegistration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState<boolean>(true);

  // Trạng thái xử lý theo từng hành động (đăng ký / hủy)
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [droppingId, setDroppingId] = useState<number | null>(null);

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
        setOfferings(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.number);
      } catch (error) {
        toast.error('Failed to load course catalog.');
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
      setRegistrations(data);
    } catch (error) {
      toast.error('Failed to load your registrations.');
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

  const isActiveRegistration = (offeringId: number) =>
    registrations.some((r) => r.offering.offeringId === offeringId && r.status !== 'Dropped');

  const handleRegister = async (offering: CourseOffering) => {
    try {
      setRegisteringId(offering.offeringId);
      await registerCourse(offering.offeringId);
      toast.success(`Registered for ${offering.course.courseCode} successfully!`);
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
    const courseLabel = `${registration.offering.course.courseCode} - ${registration.offering.section}`;
    if (!window.confirm(`Drop registration for ${courseLabel}?`)) return;

    try {
      setDroppingId(registration.registrationId);
      await dropRegistration(registration.registrationId);
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
    if (offering.availableSeats <= 0) return 'seat-badge full';
    if (offering.availableSeats <= 5) return 'seat-badge low';
    return 'seat-badge open';
  };

  const statusBadgeClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'enrolled') return 'badge active';
    if (s === 'dropped') return 'badge dropped';
    return 'badge requested';
  };

  const activeRegistrationsCount = registrations.filter((r) => r.status !== 'Dropped').length;

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
            <input
              type="text"
              className="edit-input"
              placeholder="Department"
              value={departmentInput}
              onChange={(e) => setDepartmentInput(e.target.value)}
            />
            <input
              type="text"
              className="edit-input"
              placeholder="Term (e.g. Fall2026)"
              value={termInput}
              onChange={(e) => setTermInput(e.target.value)}
            />
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

              <div className="course-grid">
                {offerings.map((offering) => {
                  const registered = isActiveRegistration(offering.offeringId);
                  const full = offering.availableSeats <= 0;
                  return (
                    <div className="course-card" key={offering.offeringId}>
                      <div className="course-card-top">
                        <div>
                          <p className="course-code">{offering.course.courseCode}</p>
                          <h4 className="course-name">{offering.course.courseName}</h4>
                        </div>
                        <span className={seatBadgeClass(offering)}>
                          {offering.availableSeats > 0
                            ? `${offering.availableSeats} seats left`
                            : 'Full'}
                        </span>
                      </div>

                      <p className="course-desc">{offering.course.description}</p>

                      <div className="course-meta-grid">
                        <div className="meta-item">
                          <label>Section</label>
                          <p>{offering.section}</p>
                        </div>
                        <div className="meta-item">
                          <label>Term</label>
                          <p>{offering.term}</p>
                        </div>
                        <div className="meta-item">
                          <label>Credits</label>
                          <p>{offering.course.credits}</p>
                        </div>
                        <div className="meta-item">
                          <label>Department</label>
                          <p>{offering.course.department}</p>
                        </div>
                        <div className="meta-item full-width">
                          <label>Schedule</label>
                          <p>{offering.schedule}</p>
                        </div>
                        <div className="meta-item full-width">
                          <label>Instructor</label>
                          <p>{offering.instructor}</p>
                        </div>
                        <div className="meta-item full-width">
                          <label>Location</label>
                          <p>
                            {offering.location}
                            {offering.room ? ` – Room ${offering.room}` : ''}
                          </p>
                        </div>
                        {offering.course.prerequisites && (
                          <div className="meta-item full-width">
                            <label>Prerequisites</label>
                            <p>{offering.course.prerequisites}</p>
                          </div>
                        )}
                      </div>

                      <button
                        className="btn-edit register-btn"
                        disabled={registered || full || registeringId === offering.offeringId}
                        onClick={() => handleRegister(offering)}
                      >
                        {registered
                          ? 'Registered ✓'
                          : registeringId === offering.offeringId
                            ? 'Registering...'
                            : full
                              ? 'Course Full'
                              : 'Register'}
                      </button>
                    </div>
                  );
                })}
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
            <div className="registration-list">
              {registrations.map((reg) => (
                <div className="registration-row" key={reg.registrationId}>
                  <div className="registration-main">
                    <div className="registration-title-row">
                      <p className="course-code">{reg.offering.course.courseCode}</p>
                      <span className={statusBadgeClass(reg.status)}>{reg.status}</span>
                    </div>
                    <h4 className="course-name">{reg.offering.course.courseName}</h4>
                    <p className="registration-sub">
                      Section {reg.offering.section} · {reg.offering.term} · {reg.offering.schedule}
                    </p>
                    <p className="registration-sub muted">
                      Registered at {formatDateTime(reg.registeredAt)}
                    </p>
                  </div>
                  {reg.status !== 'Dropped' && (
                    <button
                      className="btn-cancel drop-btn"
                      disabled={droppingId === reg.registrationId}
                      onClick={() => handleDrop(reg)}
                    >
                      {droppingId === reg.registrationId ? 'Dropping...' : 'Drop'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
