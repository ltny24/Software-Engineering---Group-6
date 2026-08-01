import React from 'react';
import AppealForm from './AppealForm';
import AppealStatusTracking from './AppealStatusTracking';

const AppealPage: React.FC = () => {
    return (
        <div className="appeal-page">
            <h1 className="text-2xl font-bold mb-4">Grade Appeal Submission</h1>
            <AppealForm />
            <h2 className="text-xl font-semibold mt-8">Track Your Appeal Status</h2>
            <AppealStatusTracking />
        </div>
    );
};

export default AppealPage;