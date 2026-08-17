import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '../../utils/constants';
import {
  searchStudents,
  StudentProfileData,
  PaginatedResponse,
} from '../../services/studentAdminApi';
import './AdminStudents.css';

export default function AdminStudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [major, setMajor] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [page, setPage] = useState(0);

  const fetchStudents = async (currentPage: number) => {
    setLoading(true);
    try {
      const response: PaginatedResponse<StudentProfileData> = await searchStudents({
        keyword,
        major,
        enrollmentStatus,
        page: currentPage,
        size: 50,
      });
      setStudents(response.content);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      const status = err?.response?.status;
      console.error('fetchStudents error:', err);
      if (status === 403) {
        toast.error('Access denied (403): your account may not have ADMINISTRATOR role.');
      } else if (status === 401) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(
          `Failed to load students${status ? ` (HTTP ${status})` : ' – check backend connection'}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(0);
  }, []); // Initial load

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchStudents(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      fetchStudents(newPage);
    }
  };

  const handleRowClick = (studentId: number) => {
    navigate(`${ROUTES.ADMIN}/students/${studentId}`);
  };

  return (
    <div className="admin-students-page">
      <h2>Student Data Administration</h2>
      <p>Search and view student records securely. All access is logged.</p>

      <form className="search-controls" onSubmit={handleSearch}>
        <div className="search-input-group">
          <label>Keyword (ID, Name)</label>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. S12345 or John"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="search-input-group">
          <label>Program / Major</label>
          <select
            className="search-select"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="">All Majors</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Data Science">Data Science</option>
            <option value="Information Security">Information Security</option>
          </select>
        </div>
        <div className="search-input-group">
          <label>Status</label>
          <select
            className="search-select"
            value={enrollmentStatus}
            onChange={(e) => setEnrollmentStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Graduated">Graduated</option>
            <option value="Suspended">Suspended</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>Program</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} onClick={() => handleRowClick(student.id)}>
                  <td>{student.username}</td>
                  <td>
                    {student.firstName} {student.lastName}
                  </td>
                  <td>{student.major || 'N/A'}</td>
                  <td>{student.studentType || 'N/A'}</td>
                  <td>
                    <span
                      className={`status-badge ${student.enrollmentStatus === 'Enrolled' ? 'active' : 'inactive'}`}
                    >
                      {student.enrollmentStatus || 'UNKNOWN'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  {loading ? 'Loading...' : 'No matching students found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-button"
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages} (Total: {totalElements})
          </span>
          <button
            className="pagination-button"
            disabled={page === totalPages - 1}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
