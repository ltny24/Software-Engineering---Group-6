// ============================================================
// GraduationRoadmapCard – visual progress widget showing
// credit completion, estimated timeline, and milestones.
// Genesis Design: clean card, indigo progress bar
// ============================================================

import React from 'react';
import { FaGraduationCap, FaTriangleExclamation } from 'react-icons/fa6';
import type { GraduationProgress } from '../../types/chatbot.types';
import './GraduationRoadmapCard.css';

interface Props {
  progress: GraduationProgress;
}

export default function GraduationRoadmapCard({ progress }: Props) {
  const pct = Math.min(100, Math.max(0, progress.completionPercentage));
  const fillClass =
    pct >= 70
      ? 'graduation-card__progress-fill--high'
      : pct >= 40
        ? 'graduation-card__progress-fill--mid'
        : 'graduation-card__progress-fill--low';

  return (
    <div className="graduation-card">
      <h3 className="graduation-card__title">
        <FaGraduationCap /> Graduation Progress
      </h3>

      {/* Progress bar */}
      <div className="graduation-card__progress">
        <div className="graduation-card__progress-label">
          <span>
            {progress.completedCredits} / {progress.totalRequiredCredits} Credits
          </span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className="graduation-card__progress-bar">
          <div
            className={`graduation-card__progress-fill ${fillClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="graduation-card__stats">
        <div className="graduation-card__stat">
          <div className="graduation-card__stat-value">{progress.remainingCredits}</div>
          <div className="graduation-card__stat-label">Remaining</div>
        </div>
        <div className="graduation-card__stat">
          <div className="graduation-card__stat-value">{progress.estimatedSemestersLeft}</div>
          <div className="graduation-card__stat-label">Semesters Left</div>
        </div>
        <div className="graduation-card__stat">
          <div className="graduation-card__stat-value">{progress.completedCredits}</div>
          <div className="graduation-card__stat-label">Earned</div>
        </div>
      </div>

      {/* Critical milestones */}
      {progress.criticalMilestonesPending.length > 0 && (
        <div className="graduation-card__milestones">
          <h4 className="graduation-card__milestones-title">
            <FaTriangleExclamation /> Pending Milestones
          </h4>
          <ul className="graduation-card__milestones-list">
            {progress.criticalMilestonesPending.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
