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
        const data = await api.get<AppealConfigResponse>('/api/appeals/config');
        setConfig(data);
      } catch {
        // config not available — use defaults
      }
    };

    void loadAppealConfig();
  }, []);

  return (
    <div className="appeals-page">
      <div className="appeals-section">
        <div className="appeals-card">
          <div className="appeals-card__header">
            <h1>Submit new grade appeal</h1>
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
