import React, { useRef, useEffect, useCallback } from 'react';

// ============================================================
// AtomBackground — Orbital atom pattern with mouse interaction
// Central nucleus + 3 electron rings at different angles
// Particles drift gently; mouse repels nearby particles
// ============================================================

interface OrbitalParticle {
  x: number;
  y: number;
  // Drift velocity
  vx: number;
  vy: number;
  ringIndex: number;
  angle: number;
  orbitSpeed: number;
  orbitRadius: number;
  tiltX: number;
  tiltY: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
  baseOpacity: number;
  displaceX: number;
  displaceY: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  hue: number;
}

interface AtomBackgroundProps {
  density?: number; // 10-100
  speed?: number;
}

export default function AtomBackground({ density = 50, speed = 1 }: AtomBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbitalParticle[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef<number>(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  const initParticles = useCallback(
    (w: number, h: number) => {
      const count = Math.round((density / 100) * 280);
      const arr: OrbitalParticle[] = [];

      // Spread particles evenly across the full screen
      for (let i = 0; i < count; i++) {
        const seed = (i * 2654435761) >>> 0;
        // Even distribution using golden ratio
        const goldenRatio = 1.618033988749895;
        const x = (((i * goldenRatio) % 1) + 0.001) * w;
        const y = (i / count + ((seed % 1000) / 1000) * 0.15) * h;
        const isBright = (seed * 31) % 100 < 10;

        arr.push({
          x: x,
          y: y,
          vx: ((((seed * 47) % 100) - 50) / 800) * speed,
          vy: (-((seed * 53) % 100) / 600) * speed - 0.08 * speed,
          ringIndex: 0,
          angle: 0,
          orbitSpeed: 0.02 + (((seed * 7) % 20) / 1000) * speed,
          orbitRadius: 0,
          tiltX: 0,
          tiltY: 0,
          size: isBright ? 2.8 + ((seed * 13) % 35) / 10 : 1.2 + ((seed * 17) % 25) / 10,
          hue: 200 + ((seed * 19) % 35),
          saturation: 55 + ((seed * 23) % 40),
          lightness: 38 + ((seed * 29) % 28),
          baseOpacity: isBright ? 0.65 + ((seed * 31) % 30) / 100 : 0.35 + ((seed * 37) % 45) / 100,
          displaceX: 0,
          displaceY: 0,
          twinklePhase: ((seed * 41) % 628) / 100,
          twinkleSpeed: 0.01 + ((seed * 43) % 30) / 1000,
        });
      }

      particlesRef.current = arr;
    },
    [density, speed]
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
      initParticles(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    // ── Mouse tracking ──
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();
    let meteorTimer = 0;

    function spawnMeteor(w: number, h: number) {
      const angle = -0.2 + Math.random() * 0.4;
      const spd = 8 + Math.random() * 12;
      meteorsRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.25,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd + 2,
        life: 0,
        maxLife: 30 + Math.random() * 40,
        length: 40 + Math.random() * 90,
        hue: 200 + Math.random() * 30,
      });
      if (meteorsRef.current.length > 5) meteorsRef.current.shift();
    }

    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;
      const { w, h } = dimsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const meteors = meteorsRef.current;

      // Spawn meteor every 4-7 seconds
      meteorTimer += dt;
      if (meteorTimer > 240 + Math.random() * 180 && density > 10) {
        meteorTimer = 0;
        spawnMeteor(w, h);
      }

      ctx!.clearRect(0, 0, w, h);

      // ── Nebula glow spots (scattered across screen) ──
      const t = now * 0.00002;
      const nebulaSpots = [
        { x: w * 0.15, y: h * 0.2, r: 180, color: 'rgba(25,65,160,0.08)' },
        { x: w * 0.75, y: h * 0.3, r: 150, color: 'rgba(50,35,140,0.06)' },
        { x: w * 0.5, y: h * 0.55, r: 200, color: 'rgba(12,95,130,0.06)' },
        { x: w * 0.85, y: h * 0.7, r: 140, color: 'rgba(60,40,120,0.05)' },
        { x: w * 0.25, y: h * 0.75, r: 170, color: 'rgba(18,60,140,0.07)' },
      ];
      nebulaSpots.forEach((spot) => {
        const gradient = ctx!.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
        gradient.addColorStop(0, spot.color);
        gradient.addColorStop(0.6, 'transparent');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(spot.x - spot.r, spot.y - spot.r, spot.r * 2, spot.r * 2);
      });

      // ── Mouse repulsion radius ──
      const repulsionRadius = Math.min(w, h) * 0.22;

      // ── Update & draw particles (full-screen drift motion) ──
      particles.forEach((p) => {
        // Drift with velocity
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap around edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const ox = p.x;
        const oy = p.y;
        const px = ox;
        const py = oy;

        // ── Mouse repulsion ──
        let mx = 0,
          my = 0;
        if (mouse.active) {
          const mdx = px - mouse.x;
          const mdy = py - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < repulsionRadius) {
            const force = (1 - mdist / repulsionRadius) ** 2;
            const angle = Math.atan2(mdy, mdx);
            mx = Math.cos(angle) * force * repulsionRadius * 0.55;
            my = Math.sin(angle) * force * repulsionRadius * 0.55;
          }
        }

        // Smooth displacement
        p.displaceX += (mx - p.displaceX) * 0.1;
        p.displaceY += (my - p.displaceY) * 0.1;

        const fx = px + p.displaceX;
        const fy = py + p.displaceY;

        // Twinkle
        p.twinklePhase += p.twinkleSpeed * dt;
        const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
        const alpha = p.baseOpacity * twinkle;

        // Glow halo
        const glowSize = p.size * 3.5;
        const halo = ctx!.createRadialGradient(fx, fy, 0, fx, fy, glowSize);
        halo.addColorStop(0, `hsla(${p.hue},${p.saturation}%,${p.lightness}%,${alpha * 0.55})`);
        halo.addColorStop(0.5, `hsla(${p.hue},${p.saturation}%,${p.lightness}%,${alpha * 0.12})`);
        halo.addColorStop(1, 'transparent');
        ctx!.fillStyle = halo;
        ctx!.beginPath();
        ctx!.arc(fx, fy, glowSize, 0, Math.PI * 2);
        ctx!.fill();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(fx, fy, p.size * 0.6, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue},${Math.min(p.saturation + 10, 100)}%,${Math.min(p.lightness + 20, 95)}%,${alpha})`;
        ctx!.fill();

        // Cross sparkle for bright stars
        if (p.size > 2.5 && twinkle > 0.7) {
          const sa = alpha * 0.5;
          ctx!.strokeStyle = `hsla(${p.hue},25%,92%,${sa})`;
          ctx!.lineWidth = 0.7;
          const cl = p.size * 2.5;
          ctx!.beginPath();
          ctx!.moveTo(fx - cl, fy);
          ctx!.lineTo(fx + cl, fy);
          ctx!.moveTo(fx, fy - cl);
          ctx!.lineTo(fx, fy + cl);
          ctx!.stroke();
        }
      });

      // ── METEORS / SHOOTING STARS ──
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;
        if (m.life > m.maxLife) {
          meteors.splice(i, 1);
          continue;
        }
        const progress = m.life / m.maxLife;
        const malpha =
          progress < 0.1 ? progress / 0.1 : progress > 0.65 ? (1 - progress) / 0.35 : 1;
        const sx = m.x + m.vx * m.life;
        const sy = m.y + m.vy * m.life;

        // Meteor trail
        const grad = ctx!.createLinearGradient(
          sx,
          sy,
          sx - m.vx * m.length * 0.1,
          sy - m.vy * m.length * 0.1
        );
        grad.addColorStop(0, `rgba(255,255,255,${malpha * 0.95})`);
        grad.addColorStop(0.25, `hsla(${m.hue},60%,80%,${malpha * 0.5})`);
        grad.addColorStop(1, 'transparent');
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        ctx!.lineTo(sx - m.vx * m.length * 0.1, sy - m.vy * m.length * 0.1);
        ctx!.stroke();

        // Meteor head glow
        const hg = ctx!.createRadialGradient(sx, sy, 0, sx, sy, 6);
        hg.addColorStop(0, `rgba(255,255,255,${malpha})`);
        hg.addColorStop(1, 'transparent');
        ctx!.fillStyle = hg;
        ctx!.beginPath();
        ctx!.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    dimsRef.current = { w: window.innerWidth, h: window.innerHeight };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [density, speed, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 2, background: 'transparent' }}
    />
  );
}
