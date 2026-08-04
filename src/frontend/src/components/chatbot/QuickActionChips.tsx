// ============================================================
// QuickActionChips – horizontal scrollable quick-action
// buttons that trigger common chatbot queries.
// Genesis Design: pill-shaped chips with indigo hover
// ============================================================

import React from 'react';
import './QuickActionChips.css';

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
    <div className="quick-chips">
      {chips.map((action) => (
        <button
          key={action.label}
          className="quick-chip"
          onClick={() => onSelect(action.message)}
          disabled={disabled}
        >
          <span className="quick-chip__icon">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
