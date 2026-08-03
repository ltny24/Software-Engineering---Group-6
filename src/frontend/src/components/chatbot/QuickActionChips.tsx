// ============================================================
// QuickActionChips – horizontal scrollable quick-action
// buttons that trigger common chatbot queries.
// ============================================================

import React from 'react';

interface QuickAction {
  label: string;
  message: string;
  icon: string;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    label: 'Suggest next term courses',
    message: 'What courses should I take next semester?',
    icon: '📚',
  },
  {
    label: 'Check graduation audit',
    message: 'Show me my graduation progress and when I can graduate.',
    icon: '🎓',
  },
  {
    label: 'Am I eligible for a course?',
    message: 'Can I take advanced courses next term?',
    icon: '✅',
  },
  {
    label: 'Explain degree prerequisites',
    message: 'What are the prerequisite requirements for my remaining courses?',
    icon: '📋',
  },
];

interface Props {
  onSelect: (message: string) => void;
  disabled?: boolean;
  actions?: QuickAction[];
}

export default function QuickActionChips({ onSelect, disabled, actions }: Props) {
  const chips = actions ?? DEFAULT_ACTIONS;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 0',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      {chips.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.message)}
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '20px',
            border: '1px solid #cbd5e1',
            backgroundColor: disabled ? '#f8fafc' : '#ffffff',
            color: disabled ? '#94a3b8' : '#334155',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: disabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#3b82f6';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }
          }}
        >
          <span style={{ fontSize: '16px' }}>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
