import React from 'react';
import type { AppealStatus } from '../../types/appeal.types';

interface AppealStatusBadgeProps {
  status: AppealStatus | string;
}

export const AppealStatusBadge: React.FC<AppealStatusBadgeProps> = ({ status }) => {
  const normalized = (status || '').toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'PENDING':
      case 'SUBMITTED':
        return { backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
      case 'PROCESSING':
      case 'UNDER REVIEW':
        return { backgroundColor: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' };
      case 'RESOLVED':
      case 'APPROVED':
        return { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' };
      case 'REJECTED':
      case 'DENIED':
        return { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' };
      case 'CANCELED':
      case 'WITHDRAWN':
      default:
        return { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb' };
    }
  };

  const style = getStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        lineHeight: '1',
        ...style,
      }}
    >
      {normalized}
    </span>
  );
};

export default AppealStatusBadge;
