import React from 'react';
import { FaXmark, FaPaperclip } from 'react-icons/fa6';
import type { AppealDetailDTO } from '../../types/appeal.types';
import AppealStatusBadge from './AppealStatusBadge';

interface AppealDetailDrawerProps {
  appeal: AppealDetailDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppealDetailDrawer: React.FC<AppealDetailDrawerProps> = ({
  appeal,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !appeal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'rgba(22, 32, 65, 0.85)',
          height: '100%',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(100,140,200,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(15,23,50,0.5)',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
              TRACKING CODE: {appeal.trackingCode}
            </div>
            <h2
              style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '700', color: '#E2E8F0' }}
            >
              {appeal.courseCode} - {appeal.courseName}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '6px',
            }}
            aria-label="Close drawer"
          >
            <FaXmark />
          </button>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            padding: '24px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              Current Status
            </label>
            <div style={{ marginTop: '6px' }}>
              <AppealStatusBadge status={appeal.status} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(15,23,50,0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(100,140,200,0.15)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>Original Grade</div>
              <div
                style={{ fontSize: '20px', fontWeight: '700', color: '#E2E8F0', marginTop: '4px' }}
              >
                {appeal.currentGrade}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: 'rgba(15,23,50,0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(100,140,200,0.15)',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>Expected Grade</div>
              <div
                style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb', marginTop: '4px' }}
              >
                {appeal.expectedGrade}
              </div>
            </div>
            {appeal.updatedGrade != null && (
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#f0fdf4',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0',
                }}
              >
                <div style={{ fontSize: '12px', color: '#15803d' }}>Final Updated Grade</div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#16a34a',
                    marginTop: '4px',
                  }}
                >
                  {appeal.updatedGrade}
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              Reason for Appeal
            </label>
            <p
              style={{
                margin: '8px 0 0',
                padding: '14px',
                backgroundColor: 'rgba(15,23,50,0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(100,140,200,0.15)',
                color: '#334155',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
            >
              {appeal.reason}
            </p>
          </div>

          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              Reviewer Comments / Administration Decision
            </label>
            <p
              style={{
                margin: '8px 0 0',
                padding: '14px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
            >
              {appeal.reviewerComments || 'No reviewer comments yet.'}
            </p>
          </div>

          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              Supporting Documents & Attachments
            </label>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {appeal.attachments && appeal.attachments.length > 0 ? (
                appeal.attachments.map((att, i) => {
                  const hrefUrl = att.startsWith('http') ? att : 'https://ktdbcl.hcmus.edu.vn/';
                  return (
                    <a
                      key={i}
                      href={hrefUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#2563eb',
                        fontSize: '14px',
                        textDecoration: 'underline',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <FaPaperclip size={12} /> {hrefUrl}
                    </a>
                  );
                })
              ) : (
                <a
                  href="https://ktdbcl.hcmus.edu.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaPaperclip size={12} /> https://ktdbcl.hcmus.edu.vn/
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealDetailDrawer;
