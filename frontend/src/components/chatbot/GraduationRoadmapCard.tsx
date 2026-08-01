import React from 'react';
import type { GraduationProgress } from '../../types/chatbot.types';
import './GraduationRoadmapCard.css';

interface Props {
  progress: GraduationProgress;
}

/**
 * Renders a graduation progress card showing credit completion,
 * estimated timeline, and critical pending milestones.
 */
export default function GraduationRoadmapCard({ progress }: Props) {
  const pct = Math.min(100, Math.max(0, progress.completionPercentage));

  return (
    <div className="grc-card">
      <h4 className="grc-card__title">📊 Graduation Progress</h4>

      {/* Progress bar */}
      <div className="grc-card__bar-wrapper">
        <div className="grc-card__bar">
          <div className="grc-card__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="grc-card__pct">{pct.toFixed(1)}%</span>
      </div>

      <p className="grc-card__summary">
        <strong>{progress.completedCredits}</strong> / {progress.totalRequiredCredits} credits
        completed &nbsp;·&nbsp; <strong>{progress.remainingCredits}</strong> remaining
      </p>

      {/* Stats row */}
      <div className="grc-card__stats">
        <div className="grc-card__stat">
          <span className="grc-card__stat-value">{progress.estimatedSemestersLeft.toFixed(1)}</span>
          <span className="grc-card__stat-label">Semesters Left</span>
        </div>
        <div className="grc-card__stat">
          <span className="grc-card__stat-value">{progress.estimatedGraduationDate || 'N/A'}</span>
          <span className="grc-card__stat-label">Est. Graduation</span>
        </div>
      </div>

      {/* Milestones */}
      {progress.criticalMilestonesPending.length > 0 && (
        <div className="grc-card__milestones">
          <strong>⚠️ Critical Milestones:</strong>
          <ul>
            {progress.criticalMilestonesPending.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
