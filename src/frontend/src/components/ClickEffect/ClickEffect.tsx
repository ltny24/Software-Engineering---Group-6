import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ClickEffect.css';

// ============================================================
// ClickEffect — spawns animated ripple (day) or sparkle (night)
// at cursor position on every click
// ============================================================

interface Effect {
  id: number;
  x: number;
  y: number;
  type: 'ripple' | 'sparkle';
}

let nextId = 0;

export default function ClickEffect() {
  const { mode } = useTheme();
  const [effects, setEffects] = useState<Effect[]>([]);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleClick = useCallback(
    (e: PointerEvent) => {
      if (reducedMotion.current) return;

      const id = ++nextId;
      const type = mode === 'day' ? 'ripple' : 'sparkle';

      setEffects((prev) => {
        const next = prev.length >= 12 ? prev.slice(prev.length - 11) : prev;
        return [...next, { id, x: e.clientX, y: e.clientY, type }];
      });

      const duration = type === 'ripple' ? 650 : 750;
      setTimeout(() => {
        setEffects((prev) => prev.filter((ef) => ef.id !== id));
      }, duration);
    },
    [mode]
  );

  useEffect(() => {
    window.addEventListener('pointerdown', handleClick, {
      passive: true,
      capture: true,
    });
    return () => window.removeEventListener('pointerdown', handleClick, { capture: true });
  }, [handleClick]);

  return (
    <div className="click-effect-layer" aria-hidden="true">
      {effects.map((ef) =>
        ef.type === 'ripple' ? (
          <div key={ef.id} className="click-ripple" style={{ left: ef.x, top: ef.y }} />
        ) : (
          <div key={ef.id} className="click-sparkle" style={{ left: ef.x, top: ef.y }}>
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        )
      )}
    </div>
  );
}
