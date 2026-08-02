// ============================================================
// CourseSuggestionCard – displays a recommended course with
// prerequisite status, credits, and a save-to-wishlist action.
// ============================================================

import React, { useState } from 'react';
import type { CourseSuggestion } from '../../types/chatbot.types';

interface Props {
  course: CourseSuggestion;
  onSave?: (course: CourseSuggestion) => void;
}

export default function CourseSuggestionCard({ course, onSave }: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    onSave?.(course);
    setTimeout(() => setSaved(false), 2000);
  };

  const isAvailable = course.prerequisiteCleared;
  const borderColor = isAvailable ? '#3b82f6' : '#f59e0b';
  const badgeBg = isAvailable ? '#dcfce7' : '#fef3c7';
  const badgeText = isAvailable ? '#166534' : '#92400e';
  const badgeLabel = isAvailable ? '✅ Eligible' : '⚠️ Prerequisite Missing';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: `1px solid #e2e8f0`,
        borderLeft: `4px solid ${borderColor}`,
        padding: '14px 16px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {/* Course code & name */}
          <h4
            style={{
              margin: '0 0 4px 0',
              fontSize: '15px',
              fontWeight: '600',
              color: '#1e293b',
            }}
          >
            {course.courseCode} — {course.courseName}
          </h4>

          {/* Credits */}
          <span
            style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
            }}
          >
            {course.credits} credits
          </span>
        </div>

        {/* Status badge */}
        <span
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: badgeBg,
            color: badgeText,
            whiteSpace: 'nowrap',
          }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Recommendation reason */}
      <p
        style={{
          margin: '8px 0 0 0',
          fontSize: '13px',
          color: '#475569',
          lineHeight: '1.5',
        }}
      >
        {course.reasonForRecommendation}
      </p>

      {/* Save to wishlist */}
      <button
        onClick={handleSave}
        disabled={saved}
        style={{
          marginTop: '10px',
          padding: '6px 16px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          backgroundColor: saved ? '#dcfce7' : '#ffffff',
          color: saved ? '#166534' : '#475569',
          fontSize: '12px',
          fontWeight: '500',
          cursor: saved ? 'default' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {saved ? '✓ Saved to Wishlist' : '💾 Save to Wishlist'}
      </button>
    </div>
  );
}
