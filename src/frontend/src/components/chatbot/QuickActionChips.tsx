// ============================================================
// QuickActionChips – horizontal scrollable quick-action
// buttons that trigger common chatbot queries.
// Genesis Design: pill-shaped chips with indigo hover
// ============================================================

import React from 'react';
import { FaBookOpen, FaGraduationCap, FaCircleCheck, FaClipboardList } from 'react-icons/fa6';
import './QuickActionChips.css';

interface QuickAction {
  label: string;
  message: string;
  icon: React.ReactNode;
}

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    label: 'Suggest next term courses',
    message: 'What courses should I take next semester?',
    icon: <FaBookOpen />,
  },
  {
    label: 'Check graduation audit',
    message: 'Show me my graduation progress and when I can graduate.',
    icon: <FaGraduationCap />,
  },
  {
    label: 'Am I eligible for a course?',
    message: 'Can I take advanced courses next term?',
    icon: <FaCircleCheck />,
  },
  {
    label: 'Explain degree prerequisites',
    message: 'What are the prerequisite requirements for my remaining courses?',
    icon: <FaClipboardList />,
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
