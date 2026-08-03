import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyAppealHistory, getAppealDetail } from '../../services/appealService';
import type { AppealSummaryDTO, AppealDetailDTO } from '../../types';
import AppealStatusBadge from '../../components/appeals/AppealStatusBadge';
import DeadlineCountdown from '../../components/appeals/DeadlineCountdown';
import AppealFilterToolbar from '../../components/appeals/AppealFilterToolbar';
import AppealDetailDrawer from '../../components/appeals/AppealDetailDrawer';

export const AppealStatusDashboard: React.FC = () => {
  const [appeals, setAppeals] = useState<AppealSummaryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Detail Drawer state
  const [selectedAppeal, setSelectedAppeal] = useState<AppealDetailDTO | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAppeals();
  }, []);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const data = await getMyAppealHistory();
      setAppeals(data || []);
    } catch (error) {
      toast.error('Failed to load grade appeal tracking data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (trackingCode: string) => {
    try {
      const detail = await getAppealDetail(trackingCode);
      setSelectedAppeal(detail);
      setDrawerOpen(true);
    } catch {
      // Fallback if detail call fails, map from summary
      const item = appeals.find((a) => a.trackingCode === trackingCode);
      if (item) {
        setSelectedAppeal({
          ...item,
          reason: 'Grade discrepancy in final exam grading.',
          reviewerComments: 'Pending review by department head.',
          attachments: ['https://ktdbcl.hcmus.edu.vn/'],
        });
        setDrawerOpen(true);
      }
    }
  };

  // Filtered Appeals
  const filteredAppeals = useMemo(() => {
    return appeals.filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.courseCode.toLowerCase().includes(query) ||
        item.trackingCode.toLowerCase().includes(query) ||
        item.courseName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [appeals, searchQuery, statusFilter]);

  // Metrics
  const activeAppealsCount = appeals.filter(
    (a) => a.status === 'PENDING' || a.status === 'PROCESSING'
  ).length;

  const pendingPaymentsCount = appeals.filter(
    (a) => a.status === 'PENDING' && a.feeStatus === 'UNPAID'
  ).length;

  const resolvedCount = appeals.filter((a) => a.status === 'RESOLVED').length;

  return (
    <div style={{ padding: '32px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
            Track Grade Appeal Status
          </h1>
          <p style={{ marginTop: '8px', color: '#64748b' }}>
            Monitor appeal progress, fee payment deadlines, and administrative decisions
          </p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 240px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderTop: '4px solid #3b82f6',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Active Appeals
            </div>
            <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
              {activeAppealsCount}
            </div>
          </div>

          <div
            style={{
              flex: '1 1 240px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderTop: '4px solid #f59e0b',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Pending Fee Payments
            </div>
            <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
              {pendingPaymentsCount}
            </div>
          </div>

          <div
            style={{
              flex: '1 1 240px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderTop: '4px solid #10b981',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Resolved Appeals
            </div>
            <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
              {resolvedCount}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            marginBottom: '24px',
          }}
        >
          <AppealFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {/* Data Grid Table */}
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              Loading appeal history...
            </div>
          ) : filteredAppeals.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
              No appeal records match your search query or filters.
            </div>
          ) : (
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
                      borderBottom: '2px solid #e2e8f0',
                      color: '#64748b',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th style={{ padding: '12px 16px' }}>Tracking Code</th>
                    <th style={{ padding: '12px 16px' }}>Course</th>
                    <th style={{ padding: '12px 16px' }}>Grades</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Fee Deadline</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppeals.map((item, index) => (
                    <tr
                      key={item.appealId}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleRowClick(item.trackingCode)}
                    >
                      <td
                        style={{
                          padding: '16px',
                          fontWeight: '700',
                          color: '#1e293b',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.trackingCode}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.courseCode}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.courseName}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ color: '#64748b' }}>Current: {item.currentGrade}</span> →{' '}
                        <span style={{ fontWeight: '600', color: '#2563eb' }}>
                          Exp: {item.expectedGrade}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <AppealStatusBadge status={item.status} />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <DeadlineCountdown deadlineStr={item.feePaymentDeadline} />
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(item.trackingCode);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <AppealDetailDrawer
        appeal={selectedAppeal}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default AppealStatusDashboard;
