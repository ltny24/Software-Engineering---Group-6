import React from 'react';
import type { CourseSuggestion } from '../../types/chatbot.types';
import './CourseSuggestionCard.css';

interface Props {
  course: CourseSuggestion;
  onSave?: (course: CourseSuggestion) => void;
}

/**
 * Renders a course recommendation card from the AI Chatbot.
 * Shows course metadata, prerequisite status badge, and a Save to Wishlist action.
 */
export default function CourseSuggestionCard({ course, onSave }: Props) {
  return (
    <div
      className={`csc-card ${
        course.prerequisiteCleared ? 'csc-card--eligible' : 'csc-card--warning'
      }`}
    >
      <div className="csc-card__header">
        <span className="csc-card__code">{course.courseCode}</span>
        <span className="csc-card__credits">{course.credits} credits</span>
      </div>

      <h4 className="csc-card__name">{course.courseName}</h4>

      <div className="csc-card__meta">
        <span className="csc-card__schedule">🕐 {course.schedule}</span>
        <span className="csc-card__instructor">👨‍🏫 {course.instructor}</span>
      </div>

      <p className="csc-card__reason">{course.reasonForRecommendation}</p>

      <div className="csc-card__footer">
        <span
          className={`csc-card__badge ${
            course.prerequisiteCleared ? 'csc-card__badge--cleared' : 'csc-card__badge--pending'
          }`}
        >
          {course.prerequisiteCleared ? '✅ Prerequisites Cleared' : '⚠️ Prerequisite Required'}
        </span>

        {course.prerequisiteCleared && onSave && (
          <button
            className="csc-card__save-btn"
            onClick={() => onSave(course)}
            aria-label={`Save ${course.courseCode} to wishlist`}
          >
            💾 Save to Wishlist
          </button>
        )}
      </div>
    </div>
  );
}
