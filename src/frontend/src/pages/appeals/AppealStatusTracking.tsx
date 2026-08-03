import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import type { AppealRecord } from './types';

const STATUS_TITLES: Record<string, string> = {
  Submitted: 'Pending',
  'Under Review': 'Pending',
  Approved: 'Processing',
  Denied: 'Rejected',
  Withdrawn: 'Withdrawn',
};

const AppealStatusTracking: React.FC = () => {
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  useEffect(() => {
    void loadAppeals();
  }, []);

  const loadAppeals = async () => {
    try {
      setLoading(true);
      const data = await api.get<AppealRecord[]>('/api/appeals/me');
      setAppeals(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Could not load your appeal history.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appealId?: number) => {
    if (!appealId) {
      return;
    }

    try {
      setWithdrawingId(appealId);
      await api.put(`/api/appeals/me/${appealId}/withdraw`);
      toast.success('Your appeal has been withdrawn successfully.');
      await loadAppeals();
    } catch {
      toast.error('Could not withdraw this appeal right now.');
    } finally {
      setWithdrawingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    const normalized = status?.toLowerCase() ?? '';
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 999,
      padding: '4px 10px',
      fontSize: 12,
      fontWeight: 700,
    };

    if (normalized === 'approved') {
      return (
        <span style={{ ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' }}>
          Processing
        </span>
      );
    }

    if (normalized === 'denied') {
      return (
        <span style={{ ...baseStyle, backgroundColor: '#fee2e2', color: '#b91c1c' }}>Rejected</span>
      );
    }

    if (normalized === 'withdrawn') {
      return (
        <span style={{ ...baseStyle, backgroundColor: '#e2e8f0', color: '#334155' }}>
          Withdrawn
        </span>
      );
    }

    return (
      <span style={{ ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' }}>Pending</span>
    );
  };

  if (loading) {
    return <div style={{ padding: 16, color: '#64748b' }}>Loading your appeal history…</div>;
  }

  if (!appeals.length) {
    return (
      <div
        style={{
          border: '1px dashed #cbd5e1',
          borderRadius: 12,
          backgroundColor: '#f8fafc',
          padding: 24,
          textAlign: 'center',
          color: '#64748b',
        }}
      >
        You have no appeals yet. Submit your first request to start tracking it here.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              backgroundColor: '#fff',
              color: '#64748b',
              textTransform: 'uppercase',
              fontSize: 12,
            }}
          >
            <th style={{ padding: '14px 16px', textAlign: 'left' }}>Course</th>
            <th style={{ padding: '14px 16px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Current grade</th>
            <th style={{ padding: '14px 16px', textAlign: 'left' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {appeals.map((appeal, index) => {
            const normalizedStatus = appeal.status?.toLowerCase() ?? '';
            const statusLabel = STATUS_TITLES[appeal.status] ?? appeal.status;
            const submittedAt = appeal.submittedAt
              ? new Date(appeal.submittedAt).toLocaleString()
              : 'Not available';
            const deadlineLabel = appeal.deadline
              ? new Date(appeal.deadline).toLocaleString()
              : null;
            const noteText =
              normalizedStatus === 'approved' && deadlineLabel
                ? `Fee payment deadline: ${deadlineLabel}`
                : normalizedStatus === 'denied' && appeal.reviewerComments
                  ? `Rejection reason: ${appeal.reviewerComments}`
                  : normalizedStatus === 'withdrawn'
                    ? 'You have canceled your submission.'
                    : normalizedStatus === 'submitted'
                      ? 'Your appeal has been submitted and is awaiting review.'
                      : appeal.appealReason || 'No reason provided.';
            const canWithdraw = normalizedStatus === 'submitted';

            return (
              <tr
                key={appeal.appealId ?? `${appeal.courseCode}-${appeal.gradeId}`}
                style={{
                  borderTop: index === 0 ? '1px solid #e2e8f0' : 'none',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc',
                }}
              >
                <td style={{ padding: '16px 16px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {appeal.courseCode || 'Course appeal'}
                  </div>
                  <div style={{ marginTop: 4, color: '#64748b', fontSize: 13 }}>
                    {appeal.courseName || 'Grade review request'}
                  </div>
                  <div style={{ marginTop: 6, color: '#64748b', fontSize: 12 }}>
                    Submitted {submittedAt}
                  </div>
                </td>
                <td style={{ padding: '16px 16px', verticalAlign: 'top' }}>
                  <div style={{ marginBottom: 8 }}>{renderStatusBadge(appeal.status)}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{statusLabel}</div>
                </td>
                <td
                  style={{
                    padding: '16px 16px',
                    textAlign: 'right',
                    verticalAlign: 'top',
                    color: '#334155',
                    fontWeight: 600,
                  }}
                >
                  {appeal.gradeValue || 'Not provided'}
                </td>
                <td style={{ padding: '16px 16px', verticalAlign: 'top', color: '#334155' }}>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{noteText}</div>
                  {canWithdraw && (
                    <button
                      type="button"
                      onClick={() => void handleWithdraw(appeal.appealId)}
                      disabled={withdrawingId === appeal.appealId}
                      style={{
                        marginTop: 10,
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                        color: '#b91c1c',
                        padding: '8px 10px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: withdrawingId === appeal.appealId ? 'not-allowed' : 'pointer',
                        opacity: withdrawingId === appeal.appealId ? 0.7 : 1,
                      }}
                    >
                      {withdrawingId === appeal.appealId ? 'Withdrawing…' : 'Cancel appeal'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppealStatusTracking;
