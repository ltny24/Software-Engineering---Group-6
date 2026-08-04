// ============================================================
// CourseSuggestionCard – displays a recommended course with
// prerequisite status, credits, and a save-to-wishlist action.
// Genesis Design: indigo accent, clean card
// ============================================================

import React, { useState } from 'react';
import type { CourseSuggestion } from '../../types/chatbot.types';
import './CourseSuggestionCard.css';

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
  const statusClass = isAvailable ? 'course-suggestion--eligible' : 'course-suggestion--blocked';
  const badgeClass = isAvailable
    ? 'course-suggestion__badge--eligible'
    : 'course-suggestion__badge--blocked';
  const badgeLabel = isAvailable ? '✅ Eligible' : '⚠️ Prerequisite Missing';

  return (
    <div className={`course-suggestion ${statusClass}`}>
      <div className="course-suggestion__top">
        <div className="course-suggestion__info">
          <h4 className="course-suggestion__title">
            {course.courseCode} — {course.courseName}
          </h4>
          <span className="course-suggestion__credits">{course.credits} credits</span>
        </div>

        <span className={`course-suggestion__badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <p className="course-suggestion__reason">{course.reasonForRecommendation}</p>

      <button
        onClick={handleSave}
        disabled={saved}
        className={`course-suggestion__save-btn ${saved ? 'course-suggestion__save-btn--saved' : ''}`}
      >
        {saved ? '✓ Saved to Wishlist' : '💾 Save to Wishlist'}
      </button>
    </div>
  );
}
