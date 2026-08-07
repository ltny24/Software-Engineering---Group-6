import React, { useEffect, useState } from 'react';
import AppealForm from './AppealForm';
import AppealStatusDashboard from './AppealStatusDashboard';
import api from '../../services/api';
import type { AppealConfigResponse } from './types';
import './AppealsPage.css';

const AppealsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [config, setConfig] = useState<AppealConfigResponse | null>(null);

  useEffect(() => {
    const loadAppealConfig = async () => {
      try {
        const res: any = await api.get<AppealConfigResponse>('/api/appeals/config');
        const configObj = res?.data || res;
        setConfig(configObj);
      } catch {
        // config not available — use defaults
      }
    };

    void loadAppealConfig();
  }, []);

  const isSubmissionOpen = config?.allowSubmission ?? true;
  const deadlineText = config?.submissionDeadline
    ? new Date(config.submissionDeadline).toLocaleDateString()
    : '2026-08-15';

  return (
    <div className="appeals-page">
      <div
        className="appeals-deadline-banner"
        style={{
          padding: '12px 16px',
          marginBottom: 16,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span>Deadline: {deadlineText}</span>
        <span
          style={{
            fontWeight: 'bold',
            color: isSubmissionOpen ? '#10b981' : '#ef4444',
          }}
        >
          {isSubmissionOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="appeals-section">
        <div className="appeals-card">
          <div className="appeals-card__header">
            <h1>Grade Appeals</h1>
            <p className="appeals-subtitle" style={{ margin: '4px 0 0', opacity: 0.8 }}>
              Submit new grade appeal — appeal submission form
            </p>
          </div>
          <div className="appeals-card__body">
            <AppealForm onSubmitted={() => setRefreshKey((value) => value + 1)} />
          </div>
        </div>
      </div>

      <AppealStatusDashboard key={refreshKey} />
    </div>
  );
};

export default AppealsPage;
