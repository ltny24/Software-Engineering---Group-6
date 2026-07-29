import React, { useEffect, useMemo, useState } from 'react';
import AppealForm from './AppealForm';
import AppealStatusTracking from './AppealStatusTracking';
import api from '../../services/api';
import type { AppealConfigResponse } from './types';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  overflow: 'hidden',
};

const AppealsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [config, setConfig] = useState<AppealConfigResponse | null>(null);

  useEffect(() => {
    const loadAppealConfig = async () => {
      try {
        const { data } = await api.get<AppealConfigResponse>('/appeals/config');
        setConfig(data);
      } catch {}
    };

    void loadAppealConfig();
  }, []);

  const deadlineLabel = useMemo(() => {
    const deadline = config?.submissionDeadline ?? config?.deadline;
    if (!deadline) {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 14);
      return fallback.toLocaleString();
    }

    const parsedDeadline = new Date(deadline);
    return Number.isNaN(parsedDeadline.getTime())
      ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleString()
      : parsedDeadline.toLocaleString();
  }, [config]);

  const submissionWindowOpen = config?.isOpen !== false && config?.allowSubmission !== false;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
            Academic Appeals
          </h1>
          <p style={{ marginTop: 8, color: '#64748b' }}>
            Submit a new grade appeal request, review its current status, and track the latest
            follow-up updates.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              ...cardStyle,
              flex: '1 1 240px',
              padding: 20,
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Submission window
            </div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
              {submissionWindowOpen ? 'Open' : 'Closed'}
            </div>
            <div style={{ marginTop: 8, color: '#64748b', fontSize: 13 }}>
              Deadline: {deadlineLabel}
            </div>
          </div>
          <div
            style={{
              ...cardStyle,
              flex: '1 1 240px',
              padding: 20,
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Review status
            </div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
              Trackable
            </div>
          </div>
          <div
            style={{
              ...cardStyle,
              flex: '1 1 240px',
              padding: 20,
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Follow-up
            </div>
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
              Updated
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={cardStyle}>
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#334155' }}>
                Grade appeal form
              </h2>
            </div>
            <div style={{ padding: 24 }}>
              <AppealForm onSubmitted={() => setRefreshKey((value) => value + 1)} />
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#334155' }}>
                Appeal history
              </h2>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>
                Review every request and its latest academic decision.
              </p>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              <AppealStatusTracking key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealsPage;
