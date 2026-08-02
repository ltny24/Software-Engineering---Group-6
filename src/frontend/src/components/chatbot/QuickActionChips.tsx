import React from 'react';
import './QuickActionChips.css';

interface Props {
  onSelect: (prompt: string, contextType: string) => void;
}

const CHIPS = [
  {
    label: '📚 Suggest next term courses',
    prompt: 'Suggest courses for my next semester',
    context: 'COURSE_SUGGESTION',
  },
  {
    label: '📊 Check graduation audit',
    prompt: 'Check my graduation progress',
    context: 'GRADUATION_AUDIT',
  },
  {
    label: '🔍 Am I eligible for CSC10009?',
    prompt: 'Am I eligible for CSC10009?',
    context: 'GENERAL',
  },
  {
    label: '📝 Explain degree prerequisites',
    prompt: 'What are prerequisites and how do they work?',
    context: 'GENERAL',
  },
  {
    label: '📅 When will I graduate?',
    prompt: 'When will I graduate at my current pace?',
    context: 'GRADUATION_AUDIT',
  },
];

/**
 * Horizontal scrollable quick-action suggestion chips.
 * Each chip triggers a predefined chatbot query when clicked.
 */
export default function QuickActionChips({ onSelect }: Props) {
  return (
    <div className="qac-chips" role="list" aria-label="Quick action suggestions">
      {CHIPS.map((chip) => (
        <button
          key={chip.label}
          className="qac-chips__chip"
          role="listitem"
          onClick={() => onSelect(chip.prompt, chip.context)}
          aria-label={chip.label}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
