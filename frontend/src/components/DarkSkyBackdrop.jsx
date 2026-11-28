import React, { useEffect, useRef } from 'react';
import { useTheme, getLunarLitPath } from '../context/ThemeContext';

/**
 * Reusable astronomical Moon Phase SVG disc showing accurate lit terminator,
 * subtle lunar maria craters, and dark-side Earthshine rim.
 */
export function MoonPhaseIcon({ phaseFrac = 0.5, size = 20, className = '', showGlow = false }) {
  const litPath = getLunarLitPath(phaseFrac, 50, 50, 42);
  const uid = React.useId().replace(/:/g, '');
  const f = ((phaseFrac % 1) + 1) % 1;
  const isNew = f < 0.025 || f > 0.975;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`moon-clip-${uid}`}>
          <circle cx="50" cy="50" r="42" />
        </clipPath>
        <radialGradient id={`moon-dark-${uid}`} cx="38%" cy="35%" r="72%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#090F22" />
        </radialGradient>
        <radialGradient id={`moon-lit-${uid}`} cx="36%" cy="32%" r="76%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </radialGradient>
      </defs>

      {/* Outer atmospheric glow ring */}
      {showGlow && (
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={isNew ? 'rgba(129, 140, 248, 0.35)' : 'rgba(226, 232, 240, 0.35)'}
          strokeWidth="2.5"
        />
      )}

      {/* Unlit lunar body (Earthshine) */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill={`url(#moon-dark-${uid})`}
        stroke={isNew ? 'rgba(165, 180, 252, 0.55)' : 'rgba(148, 163, 184, 0.25)'}
        strokeWidth="1.5"
      />

      {/* Illuminated Lunar Phase */}
      {litPath && (
        <g clipPath={`url(#moon-clip-${uid})`}>
          <path d={litPath} fill={`url(#moon-lit-${uid})`} />
          {/* Subtle lunar maria texture */}
          <circle cx="38" cy="36" r="8.5" fill="rgba(100, 116, 139, 0.16)" />
          <circle cx="59" cy="44" r="10" fill="rgba(100, 116, 139, 0.13)" />
          <circle cx="44" cy="63" r="7" fill="rgba(100, 116, 139, 0.14)" />
          <circle cx="62" cy="64" r="5" fill="rgba(100, 116, 139, 0.11)" />
        </g>
      )}

      {/* Subtle new-moon corona crescent */}
      {isNew && (
        <circle
          cx="50"
          cy="50"
          r="42.5"
          fill="none"
          stroke="rgba(199, 210, 254, 0.45)"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}

/**
 * Full-screen Night Sky backdrop rendered ONLY in Dark Theme.
 * Combines moon-phase-driven atmospheric sky light, twinkling starfield,
 * faint Vedic constellations, shooting stars, and the illuminated Lunar disc.
 */
export default function DarkSkyBackdrop() {
  const { isDark, moonPhaseInfo } = useTheme();
  const canvasRef = useRef(null);
  const starBoostRef = useRef(moonPhaseInfo.starBoost);
  const illumRef = useRef(moonPhaseInfo.illum);

  useEffect(() => {
    starBoostRef.current = moonPhaseInfo.starBoost;
    illumRef.current = moonPhaseInfo.illum;
  }, [moonPhaseInfo.starBoost, moonPhaseInfo.illum]);

  useEffect(() => {
    if (!isDark) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;

    const createStars = (w, h) =>
      Array.from({ length: 240 }, () => {
        const tintRoll = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.45 + 0.35,
          baseAlpha: Math.random() * 0.65 + 0.25,
          speed: Math.random() * 0.025 + 0.008,
          phase: Math.random() * Math.PI * 2,
          color:
            tintRoll > 0.78
              ? '254, 240, 199' // warm gold-white star
              : tintRoll > 0.45
              ? '219, 234, 254' // ice-blue star
              : '255, 255, 255', // crisp white star
        };
      });

    let stars = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Subtle zodiac / celestial constellations anchored cleanly
    const constellations = [
      // Upper-left Saptarishi arc
      [
        [0.08, 0.16],
        [0.12, 0.14],
        [0.16, 0.17],
        [0.19, 0.21],
        [0.18, 0.27],
        [0.24, 0.26],
        [0.25, 0.20],
      ],
      // Lower-left / mid-sky cluster
      [
        [0.06, 0.72],
        [0.10, 0.69],
        [0.13, 0.73],
        [0.11, 0.78],
        [0.07, 0.77],
      ],
      // Lower-right constellation
      [
        [0.78, 0.74],
        [0.83, 0.71],
        [0.88, 0.75],
        [0.85, 0.82],
        [0.92, 0.85],
      ],
    ];

    const meteors = [];
    let nextMeteorAt = Date.now() + 3500;

    let tick = 0;
    const drawFrame = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);
      const boost = starBoostRef.current;
      const illum = illumRef.current;

      // 1. Twinkling Stars (dim slightly near bright Full Moon in upper right)
      const moonX = width * 0.91;
      const moonY = 120;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) s.phase += s.speed;
        const twinkle = 0.58 + 0.42 * Math.sin(s.phase);
        const dx = s.x - moonX;
        const dy = s.y - moonY;
        const distToMoon = Math.sqrt(dx * dx + dy * dy);
        const moonWash = illum > 0.35 && distToMoon < 230 ? Math.max(0.28, distToMoon / 230) : 1;
        const alpha = Math.min(0.95, s.baseAlpha * twinkle * boost * moonWash);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${alpha.toFixed(3)})`;
        ctx.fill();

        if (s.r > 1.35) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color}, ${(alpha * 0.16).toFixed(3)})`;
          ctx.fill();
        }
      }

      // 2. Subtle Constellations
      constellations.forEach((pts, idx) => {
        const pulse = 0.65 + 0.35 * Math.sin(tick * 0.015 + idx);
        const lineAlpha = Math.min(0.24, 0.11 * boost * pulse);
        ctx.beginPath();
        pts.forEach(([rx, ry], pIdx) => {
          if (pIdx === 0) ctx.moveTo(rx * width, ry * height);
          else ctx.lineTo(rx * width, ry * height);
        });
        ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        pts.forEach(([rx, ry]) => {
          ctx.beginPath();
          ctx.arc(rx * width, ry * height, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 231, 255, ${Math.min(0.75, 0.45 * boost * pulse).toFixed(3)})`;
          ctx.fill();
        });
      });

      // 3. Occasional gentle shooting star
      if (!prefersReducedMotion) {
        if (Date.now() > nextMeteorAt) {
          meteors.push({
            x: width * (0.2 + Math.random() * 0.55),
            y: height * (0.06 + Math.random() * 0.25),
            len: 65 + Math.random() * 75,
            speed: 9 + Math.random() * 5,
            angle: Math.PI / 5 + (Math.random() - 0.5) * 0.2,
            life: 1,
            decay: 0.022,
          });
          nextMeteorAt = Date.now() + 5000 + Math.random() * 6000;
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.life -= m.decay;
          if (m.life <= 0) {
            meteors.splice(i, 1);
            continue;
          }
          const tx = m.x - Math.cos(m.angle) * m.len * m.life;
          const ty = m.y - Math.sin(m.angle) * m.len * m.life;
          const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
          grad.addColorStop(0, 'rgba(191, 219, 254, 0)');
          grad.addColorStop(1, `rgba(248, 250, 252, ${(m.life * 0.75).toFixed(3)})`);
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }

        rafId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDark]);

  if (!isDark) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden"
      aria-hidden="true"
    >
      {/* Dynamic Night Sky Gradient responding to Moon Phase Sky Light */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: moonPhaseInfo.skyBg }}
      />

      {/* Diagonal Milky Way Stardust Band (clearer on Crescent / New Moon) */}
      <div
        className="absolute -inset-24 transition-opacity duration-700"
        style={{
          opacity: moonPhaseInfo.milkyWayOpacity,
          background:
            'radial-gradient(ellipse 68% 22% at 45% 42%, rgba(99, 102, 241, 0.24) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 78%)',
          transform: 'rotate(-22deg)',
        }}
      />

      {/* Ambient Sky Light Halo radiating from the Moon */}
      <div
        className="absolute -top-24 -right-20 w-[520px] h-[520px] rounded-full blur-2xl transition-all duration-700"
        style={{ background: moonPhaseInfo.haloGradient }}
      />

      {/* Twinkling Starfield & Constellations Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Crisp Astronomical Moon Orb in the Upper-Right Night Sky */}
      <div
        className="fixed top-[68px] right-4 sm:right-8 md:right-12 transition-all duration-700"
        style={{
          filter:
            moonPhaseInfo.illumPct >= 10
              ? `drop-shadow(0 0 ${Math.round(12 + moonPhaseInfo.illum * 24)}px rgba(226, 232, 240, ${(0.25 + moonPhaseInfo.illum * 0.4).toFixed(2)}))`
              : 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.25))',
        }}
      >
        <MoonPhaseIcon
          phaseFrac={moonPhaseInfo.phaseFrac}
          size={104}
          showGlow={true}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 opacity-90"
        />
      </div>
    </div>
  );
}
