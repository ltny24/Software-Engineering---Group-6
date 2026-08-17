import React, { useRef, useEffect, useCallback } from 'react';

// ============================================================
// VideoBackground — Fixed starfield pattern with twinkle
// Stars stay in fixed positions (like real sky), only twinkle
// Constellation pattern with nebula glow and shooting stars
// ============================================================

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
  saturation: number;
  lightness: number;
  isBright: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

interface VideoBackgroundProps {
  density?: number;
  speed?: number;
  opacity?: number;
}

export default function VideoBackground({
  density = 60,
  speed = 1,
  opacity = 1,
}: VideoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<ShootingStar[]>([]);
  const animRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  const initStars = useCallback(
    (w: number, h: number) => {
      const count = Math.round((density / 100) * 300);
      const arr: Star[] = [];

      // Dark, saturated hues for visibility on light backgrounds
      const huePools = [
        { h: 215, s: 82, l: 45 },
        { h: 225, s: 88, l: 40 },
        { h: 245, s: 65, l: 48 },
        { h: 195, s: 78, l: 42 },
        { h: 210, s: 85, l: 44 },
      ];

      // Use seeded random for consistent patterns
      for (let i = 0; i < count; i++) {
        const seed = (i * 2654435761) >>> 0;
        const sx = ((seed % 9973) / 9973) * w;
        const sy = (((seed * 7) % 9973) / 9973) * h;
        const poolIdx = (seed * 13) % huePools.length;
        const pool = huePools[poolIdx];
        const isBright = (seed * 31) % 100 < 12;

        arr.push({
          x: sx,
          y: sy,
          size: isBright ? 3 + ((seed * 17) % 50) / 10 : 1.2 + ((seed * 23) % 35) / 10,
          baseOpacity: isBright ? 0.7 + ((seed * 11) % 30) / 100 : 0.35 + ((seed * 19) % 45) / 100,
          twinkleSpeed: 0.01 + ((seed * 29) % 40) / 1000,
          twinklePhase: ((seed * 37) % 628) / 100,
          hue: pool.h + (((seed * 41) % 25) - 12),
          saturation: pool.s + ((seed * 43) % 15),
          lightness: pool.l + (((seed * 47) % 18) - 9),
          isBright,
        });
      }
      starsRef.current = arr;
      dimsRef.current = { w, h };
    },
    [density]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      dimsRef.current = { w, h };
      initStars(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    let lastTime = performance.now();
    let meteorTimer = 0;

    function spawnMeteor(w: number, h: number) {
      const angle = -0.25 + Math.random() * 0.5;
      const spd = 5 + Math.random() * 8;
      meteorsRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.2,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd + 2,
        life: 0,
        maxLife: 35 + Math.random() * 45,
        length: 50 + Math.random() * 100,
      });
      if (meteorsRef.current.length > 4) meteorsRef.current.shift();
    }

    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;
      const { w, h } = dimsRef.current;
      const stars = starsRef.current;

      meteorTimer += dt;
      if (meteorTimer > 150 + Math.random() * 100 && density > 10) {
        meteorTimer = 0;
        spawnMeteor(w, h);
      }

      ctx!.clearRect(0, 0, w, h);

      // ── NEBULA GLOW (fixed position, subtle pulse) ──
      const t = now * 0.00002;
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      const nebulaSpots = [
        { x: w * 0.2, y: h * 0.25, r: 200 * pulse, color: 'rgba(25,70,170,0.10)' },
        { x: w * 0.72, y: h * 0.15, r: 170 * pulse, color: 'rgba(55,35,140,0.08)' },
        { x: w * 0.48, y: h * 0.55, r: 230 * pulse, color: 'rgba(12,100,130,0.07)' },
        { x: w * 0.85, y: h * 0.65, r: 150 * pulse, color: 'rgba(65,45,125,0.06)' },
        { x: w * 0.1, y: h * 0.72, r: 180 * pulse, color: 'rgba(18,65,145,0.08)' },
      ];

      nebulaSpots.forEach((spot) => {
        const gradient = ctx!.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
        gradient.addColorStop(0, spot.color);
        gradient.addColorStop(0.6, spot.color.replace('0.0', '0.02'));
        gradient.addColorStop(1, 'transparent');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(spot.x - spot.r, spot.y - spot.r, spot.r * 2, spot.r * 2);
      });

      // ── CONSTELLATION LINES (fixed, only between nearby bright stars) ──
      ctx!.strokeStyle = `rgba(70,130,210,${0.06 * opacity})`;
      ctx!.lineWidth = 0.4;
      const connDist = 130;
      for (let i = 0; i < stars.length; i++) {
        if (!stars[i].isBright) continue;
        for (let j = i + 1; j < stars.length; j++) {
          if (!stars[j].isBright) continue;
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connDist) {
            ctx!.beginPath();
            ctx!.moveTo(stars[i].x, stars[i].y);
            ctx!.lineTo(stars[j].x, stars[j].y);
            ctx!.stroke();
          }
        }
      }

      // ── STARS (fixed position, only twinkle) ──
      stars.forEach((s) => {
        s.twinklePhase += s.twinkleSpeed * dt;
        const twinkle = 0.4 + 0.6 * Math.sin(s.twinklePhase);
        const alpha = s.baseOpacity * twinkle * opacity;

        // Glow halo
        const glowSize = s.size * 4;
        const halo = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowSize);
        halo.addColorStop(0, `hsla(${s.hue},${s.saturation}%,${s.lightness}%,${alpha * 0.55})`);
        halo.addColorStop(0.4, `hsla(${s.hue},${s.saturation}%,${s.lightness}%,${alpha * 0.18})`);
        halo.addColorStop(1, 'transparent');
        ctx!.fillStyle = halo;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, glowSize, 0, Math.PI * 2);
        ctx!.fill();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size * 0.65, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${s.hue},${s.saturation}%,${Math.min(s.lightness + 18, 100)}%,${alpha})`;
        ctx!.fill();

        // Cross sparkle for bright stars
        if (s.isBright && twinkle > 0.7) {
          const sa = alpha * 0.55;
          ctx!.strokeStyle = `hsla(${s.hue},25%,92%,${sa})`;
          ctx!.lineWidth = 0.7;
          const cl = s.size * 2.8;
          ctx!.beginPath();
          ctx!.moveTo(s.x - cl, s.y);
          ctx!.lineTo(s.x + cl, s.y);
          ctx!.moveTo(s.x, s.y - cl);
          ctx!.lineTo(s.x, s.y + cl);
          ctx!.stroke();
        }
      });

      // ── METEORS / SHOOTING STARS ──
      for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
        const m = meteorsRef.current[i];
        m.life++;
        if (m.life > m.maxLife) {
          meteorsRef.current.splice(i, 1);
          continue;
        }
        const progress = m.life / m.maxLife;
        const falph =
          progress < 0.12 ? progress / 0.12 : progress > 0.65 ? (1 - progress) / 0.35 : 1;
        const sx = m.x + m.vx * m.life;
        const sy = m.y + m.vy * m.life;

        const grad = ctx!.createLinearGradient(
          sx,
          sy,
          sx - m.vx * m.length * 0.12,
          sy - m.vy * m.length * 0.12
        );
        grad.addColorStop(0, `rgba(255,255,255,${falph * 0.95})`);
        grad.addColorStop(0.25, `rgba(200,220,255,${falph * 0.55})`);
        grad.addColorStop(1, 'transparent');
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 2.2;
        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        ctx!.lineTo(sx - m.vx * m.length * 0.12, sy - m.vy * m.length * 0.12);
        ctx!.stroke();

        const hg = ctx!.createRadialGradient(sx, sy, 0, sx, sy, 7);
        hg.addColorStop(0, `rgba(255,255,255,${falph})`);
        hg.addColorStop(1, 'transparent');
        ctx!.fillStyle = hg;
        ctx!.beginPath();
        ctx!.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [density, speed, opacity, initStars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 2, background: 'transparent' }}
    />
  );
}
