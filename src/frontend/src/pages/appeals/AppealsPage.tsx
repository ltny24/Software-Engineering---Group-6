import React, { useEffect, useMemo, useState } from 'react';
import AppealForm from './AppealForm';
import AppealStatusDashboard from './AppealStatusDashboard';
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
        const data = await api.get<AppealConfigResponse>('/api/appeals/config');
        setConfig(data);
      } catch {}
    };

    void loadAppealConfig();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ padding: '32px 24px 0 24px', maxWidth: 1152, margin: '0 auto', width: '100%' }}>
        <div style={cardStyle}>
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
              Submit new grade appeal
            </h1>
          </div>
          <div style={{ padding: 24 }}>
            <AppealForm onSubmitted={() => setRefreshKey((value) => value + 1)} />
          </div>
        </div>
      </div>

      <AppealStatusDashboard key={refreshKey} />
    </div>
  );
};

export default AppealsPage;
