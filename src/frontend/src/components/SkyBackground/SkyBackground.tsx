import React from 'react';
import './SkyBackground.css';

// ============================================================
// SkyBackground — Full-viewport animated sky behind all content
// Day: blue gradient + sun + rays + sparkles + clouds
// Night: navy galaxy + nebula + starfield layers + meteors
// Controlled entirely by CSS via [data-theme] attribute
// ============================================================

export default function SkyBackground() {
  return (
    <div className="sky" aria-hidden="true">
      {/* ═══ DAY LAYERS ═══ */}
      <div className="sky__day" />

      {/* Sun glow */}
      <div className="sky__sun" />

      {/* Sun rays — rotating beam corona */}
      <div className="sky__sun-rays" />

      {/* Golden sparkle particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <div key={`sparkle-${i + 1}`} className={`sky__sparkle sky__sparkle--${i + 1}`} />
      ))}

      {/* Drifting clouds */}
      <div className="sky__cloud sky__cloud--1" />
      <div className="sky__cloud sky__cloud--2" />
      <div className="sky__cloud sky__cloud--3" />

      {/* ═══ NIGHT LAYERS ═══ */}
      <div className="sky__night" />

      {/* Layer 0: Nebula clouds */}
      <div className="sky__night-nebula" />

      {/* Layer 1: Dense tiny stars */}
      <div className="sky__night-stars" />

      {/* Layer 2: Bright hero stars */}
      <div className="sky__night-hero-stars" />

      {/* Layer 3: Glowing diamond stars */}
      <div className="sky__night-diamond-stars" />

      {/* Shooting stars / Meteors */}
      <div className="sky__meteor sky__meteor--1" />
      <div className="sky__meteor sky__meteor--2" />
      <div className="sky__meteor sky__meteor--3" />
    </div>
  );
}
