import React from 'react';

interface AppealFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export const AppealFilterToolbar: React.FC<AppealFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, minWidth: '240px' }}>
        <input
          type="text"
          placeholder="Search by Course Code or Tracking ID (e.g. APL-000001, CSC10009)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(100,140,200,0.2)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ minWidth: '180px' }}>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(100,140,200,0.2)',
            fontSize: '14px',
            color: '#1e293b',
            backgroundColor: 'rgba(22, 32, 65, 0.85)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELED">Canceled</option>
        </select>
      </div>
    </div>
  );
};

export default AppealFilterToolbar;
