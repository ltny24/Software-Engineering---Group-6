// ============================================================
// GraduationRoadmapCard – visual progress widget showing
// credit completion, estimated timeline, and milestones.
// ============================================================

import React from 'react';
import type { GraduationProgress } from '../../types/chatbot.types';

interface Props {
  progress: GraduationProgress;
}

export default function GraduationRoadmapCard({ progress }: Props) {
  const pct = Math.min(100, Math.max(0, progress.completionPercentage));
  const barColor = pct >= 70 ? '#22c55e' : pct >= 40 ? '#3b82f6' : '#f59e0b';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <h3
        style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1e293b',
        }}
      >
        🎓 Graduation Progress
      </h3>

      {/* Progress bar */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#475569',
          }}
        >
          <span>
            {progress.completedCredits} / {progress.totalRequiredCredits} Credits
          </span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div
          style={{
            height: '10px',
            backgroundColor: '#f1f5f9',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              backgroundColor: barColor,
              borderRadius: '5px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {progress.remainingCredits}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Remaining</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {progress.estimatedSemestersLeft}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Semesters Left</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {progress.completedCredits}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Earned</div>
        </div>
      </div>

      {/* Critical milestones */}
      {progress.criticalMilestonesPending.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 8px 0',
              fontSize: '13px',
              fontWeight: '600',
              color: '#92400e',
            }}
          >
            ⚠️ Pending Milestones
          </h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: '18px',
              fontSize: '12px',
              color: '#475569',
              lineHeight: '1.8',
            }}
          >
            {progress.criticalMilestonesPending.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
