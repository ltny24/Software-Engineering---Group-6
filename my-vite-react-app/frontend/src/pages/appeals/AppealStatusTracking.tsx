import React, { useEffect, useState } from 'react';
import { fetchAppealStatus } from '../../services/api';
import { AppealStatus } from './types';

const AppealStatusTracking: React.FC = () => {
    const [status, setStatus] = useState<AppealStatus | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getStatus = async () => {
            try {
                const response = await fetchAppealStatus();
                setStatus(response);
            } catch (err) {
                setError('Failed to fetch appeal status.');
            } finally {
                setLoading(false);
            }
        };

        getStatus();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!status) {
        return <div>No appeal status available.</div>;
    }

    return (
        <div>
            <h2>Appeal Status</h2>
            {status.state === 'Pending' && <p>Your appeal is currently pending.</p>}
            {status.state === 'Processing' && <p>Your appeal is being processed.</p>}
            {status.state === 'Rejected' && <p>Your appeal has been rejected. Reason: {status.reason}</p>}
            {/* Additional status details can be displayed here */}
        </div>
    );
};

export default AppealStatusTracking;