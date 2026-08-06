import React, { useMemo } from 'react';
import './StarfieldBackground.css';

// ============================================================
// StarfieldBackground — configurable star density background
// density: 0-100 (default 50), controls star count/opacity
// ============================================================

interface StarfieldBackgroundProps {
  density?: number; // 0 (none) to 100 (max density)
  speed?: 'slow' | 'normal' | 'fast';
  showMeteors?: boolean;
}

function generateStars(count: number, size: number): string {
  const stars: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = 0.4 + Math.random() * 0.55;
    const sz = size * (0.6 + Math.random() * 0.8);
    stars.push(
      `radial-gradient(${sz}px ${sz}px at ${x}% ${y}%, rgba(255,255,255,${opacity.toFixed(2)}), transparent)`
    );
  }
  return stars.join(', ');
}

export default function StarfieldBackground({
  density = 50,
  speed = 'normal',
  showMeteors = true,
}: StarfieldBackgroundProps) {
  // Generate stars based on density
  const stars = useMemo(() => {
    const tinyCount = Math.round((density / 100) * 80);
    const mediumCount = Math.round((density / 100) * 25);
    const brightCount = Math.round((density / 100) * 12);

    return {
      tiny: generateStars(tinyCount, 1.2),
      medium: generateStars(mediumCount, 2.5),
      bright: generateStars(brightCount, 4),
    };
  }, [density]);

  const speedMultiplier = speed === 'slow' ? '1.5' : speed === 'fast' ? '0.6' : '1';

  return (
    <div
      className="starfield"
      aria-hidden="true"
      style={
        {
          '--star-density': density / 100,
          '--star-speed': speedMultiplier,
        } as React.CSSProperties
      }
    >
      {/* Layer 1: Nebula glow */}
      <div className="starfield__nebula" />

      {/* Layer 2: Tiny dense stars */}
      <div className="starfield__layer starfield__layer--tiny" style={{ background: stars.tiny }} />

      {/* Layer 3: Medium stars */}
      <div
        className="starfield__layer starfield__layer--medium"
        style={{ background: stars.medium }}
      />

      {/* Layer 4: Bright hero stars with glow */}
      <div
        className="starfield__layer starfield__layer--bright"
        style={{ background: stars.bright }}
      />

      {/* Shooting stars / Meteors */}
      {showMeteors && (
        <>
          <div className="starfield__meteor starfield__meteor--1" />
          <div className="starfield__meteor starfield__meteor--2" />
          <div className="starfield__meteor starfield__meteor--3" />
        </>
      )}
    </div>
  );
}
