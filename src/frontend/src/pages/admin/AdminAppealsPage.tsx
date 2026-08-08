import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAppealService, AdminAppealResponse } from '../../services/adminAppealService';
import { ROUTES } from '../../utils/constants';

import './AdminAppeals.css';

export default function AdminAppealsPage() {
  const navigate = useNavigate();
  const [appeals, setAppeals] = useState<AdminAppealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all appeals to support local search and counts
      const data = await adminAppealService.getAllAppeals();
      setAppeals(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appeals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  // Compute stat card numbers
  const totalAppeals = appeals.length;
  const needsAction = appeals.filter((a) =>
    ['Submitted', 'Pending Info', 'Pending Payment'].includes(a.status)
  ).length;
  const underReview = appeals.filter((a) => a.status === 'Under Review').length;
  const resolved = appeals.filter((a) =>
    ['Approved', 'Denied', 'Rejected', 'Resolved'].includes(a.status)
  ).length;

  // Compute filter counts dynamically based on backend data
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: totalAppeals,
      Submitted: 0,
      'Under Review': 0,
      Approved: 0,
      Denied: 0,
    };
    appeals.forEach((a) => {
      if (counts[a.status] !== undefined) {
        counts[a.status]++;
      }
    });
    return counts;
  }, [appeals, totalAppeals]);

  // Apply filters and search
  const filteredAppeals = useMemo(() => {
    return appeals.filter((a) => {
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        a.studentName.toLowerCase().includes(q) ||
        a.studentId.toString().includes(q) ||
        a.courseCode.toLowerCase().includes(q) ||
        a.courseName.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [appeals, statusFilter, searchQuery]);

  return (
    <div className="admin-appeals-page">
      <div className="admin-header-proto">
        <h1 className="admin-title">Appeal Processing</h1>
        <p className="admin-subtitle">
          Review and process student grade appeals. All changes are recorded in the appeal history.
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="stat-cards-row">
        <div className="stat-card-proto">
          <div className="stat-number stat-blue">{totalAppeals}</div>
          <div className="stat-label">Total Appeals</div>
        </div>
        <div className="stat-card-proto">
          <div className="stat-number stat-orange">{needsAction}</div>
          <div className="stat-label">Needs Action</div>
        </div>
        <div className="stat-card-proto">
          <div className="stat-number stat-gray">{underReview}</div>
          <div className="stat-label">Under Review</div>
        </div>
        <div className="stat-card-proto">
          <div className="stat-number stat-green">{resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div className="admin-controls-proto">
        <div className="filter-pills">
          {['All', 'Submitted', 'Under Review', 'Approved', 'Denied'].map((status) => (
            <button
              key={status}
              className={`pill-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}{' '}
              {status !== 'All' && statusCounts[status] !== undefined ? statusCounts[status] : ''}
            </button>
          ))}
        </div>
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, ID, cour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-state">Loading appeals...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="admin-table-container-proto">
          {filteredAppeals.length === 0 ? (
            <div className="proto-empty-state">
              <p>No appeals match your search or filter.</p>
              <button
                className="proto-clear-btn"
                onClick={() => {
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <table className="admin-table-proto">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppeals.map((appeal) => (
                  <tr key={appeal.appealId}>
                    <td>AP-2026-{appeal.appealId.toString().padStart(3, '0')}</td>
                    <td>
                      <div className="font-medium text-dark">{appeal.studentName}</div>
                      <div className="text-secondary text-sm">
                        {appeal.studentUsername || appeal.studentId}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-dark">{appeal.courseCode}</div>
                      <div className="text-secondary text-sm">{appeal.courseName}</div>
                    </td>
                    <td>{new Date(appeal.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge-proto badge-${appeal.status.replace(' ', '-').toLowerCase()}`}
                      >
                        {appeal.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-view-proto"
                        onClick={() => navigate(`${ROUTES.ADMIN}/appeals/${appeal.appealId}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
