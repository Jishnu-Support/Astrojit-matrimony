import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Astrojit Professional Vedic Celestial Astrolabe & Cosmic Cosmos
 * High-end luxury astrology visual experience:
 * 1. Deep Ethereal Starfield & Constellation Network (Canvas 2D, high-DPI)
 *    - 220+ multi-frequency twinkling stars (gold & diamond white)
 *    - Vedic Constellations (Saptarishi, Orion/Mrigashira, Pleiades/Krittika, Leo) with pulsing lines
 *    - Graceful shooting stars / meteors with fading stardust trails
 *    - Luminous cosmic nebula glows (deep midnight obsidian/navy in Dark; warm sacred ivory in Light)
 * 2. Sacred Vedic Bhachakra (Zodiac Astrolabe)
 *    - Razor-sharp SVG golden filigree with 360° degree ticks and 27 Nakshatra divisions
 *    - 12 authentic Vedic Rashi glyphs (♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓)
 *    - 8-Petal Sacred Vedic Lotus (Padma) matching Astrojit branding
 *    - 8-pointed Ashtadikpalaka celestial compass star
 *    - Central Surya-Chandra luminous core with breathing golden corona
 * 3. Navagraha Celestial Jewel Nodes
 *    - Delicate glowing planetary orbs on faint golden elliptical orbits
 *    - Authentic planetary symbols (☉ ☽ ☿ ♀ ♂ ♃ ♄ ☊ ☋)
 * 4. Interactive 3D Parallax Tilt with smooth spring damping
 */

// 12 Authentic Vedic Rashis with Sanskrit names and glyphs
const RASHIS = [
  { sign: '♈', name: 'Mesha', en: 'Aries', deg: 0 },
  { sign: '♉', name: 'Vrishabha', en: 'Taurus', deg: 30 },
  { sign: '♊', name: 'Mithuna', en: 'Gemini', deg: 60 },
  { sign: '♋', name: 'Karka', en: 'Cancer', deg: 90 },
  { sign: '♌', name: 'Simha', en: 'Leo', deg: 120 },
  { sign: '♍', name: 'Kanya', en: 'Virgo', deg: 150 },
  { sign: '♎', name: 'Tula', en: 'Libra', deg: 180 },
  { sign: '♏', name: 'Vrischika', en: 'Scorpio', deg: 210 },
  { sign: '♐', name: 'Dhanus', en: 'Sagittarius', deg: 240 },
  { sign: '♑', name: 'Makara', en: 'Capricorn', deg: 270 },
  { sign: '♒', name: 'Kumbha', en: 'Aquarius', deg: 300 },
  { sign: '♓', name: 'Meena', en: 'Pisces', deg: 330 },
];

// Navagraha Planetary Jewels with authentic astrological colors
const GRAHAS = [
  { name: 'Budha', glyph: '☿', color: '#10B981', ringColor: 'rgba(16,185,129,0.3)', dist: 220, speed: 0.008, size: 6 },
  { name: 'Shukra', glyph: '♀', color: '#F3E8FF', ringColor: 'rgba(243,232,255,0.4)', dist: 260, speed: 0.006, size: 7 },
  { name: 'Chandra', glyph: '☽', color: '#FEF08A', ringColor: 'rgba(254,240,138,0.5)', dist: 300, speed: 0.010, size: 8 },
  { name: 'Mangala', glyph: '♂', color: '#F87171', ringColor: 'rgba(248,113,113,0.35)', dist: 345, speed: 0.0045, size: 7 },
  { name: 'Guru', glyph: '♃', color: '#FBBF24', ringColor: 'rgba(251,191,36,0.4)', dist: 395, speed: 0.003, size: 9 },
  { name: 'Shani', glyph: '♄', color: '#D97706', ringColor: 'rgba(217,119,6,0.4)', dist: 450, speed: 0.002, size: 9, hasRing: true },
  { name: 'Rahu', glyph: '☊', color: '#C084FC', ringColor: 'rgba(192,132,252,0.3)', dist: 505, speed: -0.0025, size: 6 },
  { name: 'Ketu', glyph: '☋', color: '#FB923C', ringColor: 'rgba(251,146,60,0.3)', dist: 505, speed: -0.0025, size: 6, offset: Math.PI },
];

export default function CosmicZodiac3DBackground({ className = '' }) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  // Mouse tilt parallax state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  // Handle smooth mouse parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      targetTilt.current = { x: x * 10, y: -y * 10 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth lerp for mouse parallax
  useEffect(() => {
    let animId;
    const updateTilt = () => {
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.05;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.05;
      setTilt({ x: currentTilt.current.x, y: currentTilt.current.y });
      animId = requestAnimationFrame(updateTilt);
    };
    animId = requestAnimationFrame(updateTilt);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Canvas Starfield, Constellations & Meteors Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 220 Star Particles
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
      isGold: Math.random() > 0.65,
    }));

    // Vedic Constellation Star Nodes (Normalized 0..1 coordinates)
    const constellationPatterns = [
      // Saptarishi (Ursa Major)
      {
        stars: [
          { rx: 0.15, ry: 0.22 },
          { rx: 0.18, ry: 0.20 },
          { rx: 0.22, ry: 0.23 },
          { rx: 0.25, ry: 0.27 },
          { rx: 0.24, ry: 0.35 },
          { rx: 0.29, ry: 0.34 },
          { rx: 0.30, ry: 0.26 },
        ],
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]
        ]
      },
      // Orion / Mrigashira
      {
        stars: [
          { rx: 0.75, ry: 0.18 }, // Betelgeuse
          { rx: 0.85, ry: 0.20 }, // Bellatrix
          { rx: 0.79, ry: 0.28 }, // Belt 1
          { rx: 0.81, ry: 0.29 }, // Belt 2
          { rx: 0.83, ry: 0.30 }, // Belt 3
          { rx: 0.76, ry: 0.39 }, // Saiph
          { rx: 0.86, ry: 0.38 }, // Rigel
        ],
        connections: [
          [0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]
        ]
      },
      // Krittika (Pleiades Cluster)
      {
        stars: [
          { rx: 0.12, ry: 0.72 },
          { rx: 0.14, ry: 0.70 },
          { rx: 0.16, ry: 0.71 },
          { rx: 0.17, ry: 0.74 },
          { rx: 0.15, ry: 0.76 },
          { rx: 0.13, ry: 0.75 },
        ],
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4]
        ]
      },
      // Simha (Leo)
      {
        stars: [
          { rx: 0.82, ry: 0.68 }, // Regulus
          { rx: 0.86, ry: 0.64 },
          { rx: 0.89, ry: 0.68 },
          { rx: 0.87, ry: 0.76 },
          { rx: 0.79, ry: 0.75 },
        ],
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]
        ]
      }
    ];

    // Shooting Stars / Meteors
    const meteors = [];
    let nextMeteorTime = Date.now() + 2000;

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.4,
        length: Math.random() * 90 + 70,
        speed: Math.random() * 8 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.02,
      });
      nextMeteorTime = Date.now() + Math.random() * 4000 + 3500;
    };

    // Render loop
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Luminous Cosmic Nebula Gradients
      if (isDark) {
        // Deep Obsidian Navy base with warm Golden & Violet Cosmic dust
        const g1 = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.45, width * 0.65);
        g1.addColorStop(0, 'rgba(217, 119, 6, 0.08)'); // Subtle golden core
        g1.addColorStop(0.35, 'rgba(139, 92, 246, 0.06)'); // Mystic violet halo
        g1.addColorStop(0.7, 'rgba(15, 23, 42, 0.04)'); // Deep midnight
        g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        // Top right auric glow
        const g2 = ctx.createRadialGradient(width * 0.85, height * 0.2, 10, width * 0.85, height * 0.2, 350);
        g2.addColorStop(0, 'rgba(245, 158, 11, 0.07)');
        g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Light theme: Sacred Temple Ivory with golden celestial dust
        const g1 = ctx.createRadialGradient(width * 0.5, height * 0.45, 60, width * 0.5, height * 0.45, width * 0.65);
        g1.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
        g1.addColorStop(0.4, 'rgba(251, 191, 36, 0.04)');
        g1.addColorStop(1, 'rgba(251, 248, 241, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.phase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.1, s.alpha * (0.6 + 0.4 * Math.sin(s.phase)));
        const r = s.baseRadius * (0.8 + 0.2 * Math.sin(s.phase * 1.5));

        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        if (s.isGold) {
          ctx.fillStyle = isDark
            ? `rgba(253, 230, 138, ${currentAlpha})`
            : `rgba(217, 119, 6, ${currentAlpha * 0.7})`;
        } else {
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${currentAlpha})`
            : `rgba(180, 83, 9, ${currentAlpha * 0.6})`;
        }
        ctx.fill();

        // Star core glow for brighter stars
        if (s.baseRadius > 1.2 && isDark) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha * 0.2})`;
          ctx.fill();
        }
      }

      // 3. Draw Ancient Vedic Constellation Networks
      constellationPatterns.forEach((constellation, cIdx) => {
        const pulse = 0.55 + 0.35 * Math.sin(tick * 0.02 + cIdx);

        // Lines connecting stars
        ctx.beginPath();
        constellation.connections.forEach(([i1, i2]) => {
          const s1 = constellation.stars[i1];
          const s2 = constellation.stars[i2];
          ctx.moveTo(s1.rx * width, s1.ry * height);
          ctx.lineTo(s2.rx * width, s2.ry * height);
        });
        ctx.strokeStyle = isDark
          ? `rgba(245, 158, 11, ${0.22 * pulse})`
          : `rgba(217, 119, 6, ${0.18 * pulse})`;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Constellation Stars
        constellation.stars.forEach((s) => {
          const sx = s.rx * width;
          const sy = s.ry * height;

          // Outer pulse ring
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(251, 191, 36, ${0.35 * pulse})`
            : `rgba(217, 119, 6, ${0.3 * pulse})`;
          ctx.fill();

          // Star Diamond Node
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#FFFBEB' : '#B45309';
          ctx.fill();
        });
      });

      // 4. Update and Draw Meteors / Shooting Stars
      if (Date.now() > nextMeteorTime) {
        spawnMeteor();
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

        const tailX = m.x - Math.cos(m.angle) * m.length * m.life;
        const tailY = m.y - Math.sin(m.angle) * m.length * m.life;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(251, 191, 36, 0)');
        grad.addColorStop(0.7, isDark ? `rgba(253, 230, 138, ${m.life * 0.7})` : `rgba(217, 119, 6, ${m.life * 0.5})`);
        grad.addColorStop(1, isDark ? `rgba(255, 255, 255, ${m.life})` : `rgba(180, 83, 9, ${m.life * 0.8})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head bright spark
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#FFFFFF' : '#B45309';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  // Dynamic planet orbit positions
  const [planetAngles, setPlanetAngles] = useState(() =>
    GRAHAS.map((g, idx) => (idx * Math.PI) / 4 + (g.offset || 0))
  );

  useEffect(() => {
    let animId;
    const animatePlanets = () => {
      setPlanetAngles((prev) =>
        prev.map((angle, idx) => angle + GRAHAS[idx].speed)
      );
      animId = requestAnimationFrame(animatePlanets);
    };
    animId = requestAnimationFrame(animatePlanets);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Theme-specific colors for SVG Astrolabe
  const goldPrimary = isDark ? '#F59E0B' : '#B45309';
  const ringFill = isDark ? 'rgba(245, 158, 11, 0.03)' : 'rgba(180, 83, 9, 0.02)';
  const spokeColor = isDark ? 'rgba(251, 191, 36, 0.28)' : 'rgba(180, 83, 9, 0.2)';

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Layer 1: Canvas Starfield, Constellations & Meteors */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Layer 2: 3D Tilting Sacred Vedic Bhachakra & Navagraha Mandala */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main Sacred Astrolabe SVG */}
        <div className="relative w-[850px] h-[850px] sm:w-[980px] sm:h-[980px] max-w-none flex items-center justify-center opacity-85 dark:opacity-95">
          <svg
            viewBox="-550 -550 1100 1100"
            className="w-full h-full pointer-events-none animate-[spin_180s_linear_infinite]"
            style={{ filter: isDark ? 'drop-shadow(0 0 25px rgba(245,158,11,0.22))' : 'drop-shadow(0 0 15px rgba(180,83,9,0.12))' }}
          >
            <defs>
              {/* Radial Golden Shimmer Gradient */}
              <radialGradient id="sunAuraGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isDark ? '#FDE047' : '#F59E0B'} stopOpacity="0.45" />
                <stop offset="40%" stopColor={isDark ? '#F59E0B' : '#D97706'} stopOpacity="0.2" />
                <stop offset="100%" stopColor={goldPrimary} stopOpacity="0" />
              </radialGradient>

              {/* Gold Stroke Linear Gradient */}
              <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>

              {/* Lotus Petal Marker */}
              <path
                id="lotusPetal"
                d="M 0,-85 C -22,-50 -20,-20 0,0 C 20,-20 22,-50 0,-85 Z"
                fill={isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(217, 119, 6, 0.06)'}
                stroke="url(#goldFiligree)"
                strokeWidth="0.9"
              />

              {/* Diamond Node */}
              <polygon
                id="diamondNode"
                points="0,-4 3,0 0,4 -3,0"
                fill="#FDE68A"
                stroke={goldPrimary}
                strokeWidth="0.8"
              />
            </defs>

            {/* --- OUTER CELESTIAL RIM --- */}
            {/* 1. Precision 360-degree ticks outer ring */}
            <circle cx="0" cy="0" r="495" fill={ringFill} stroke="url(#goldFiligree)" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="485" fill="none" stroke={goldPrimary} strokeWidth="0.6" strokeDasharray="3 5" />
            <circle cx="0" cy="0" r="455" fill="none" stroke="url(#goldFiligree)" strokeWidth="1.4" />

            {/* 360 degree fine ticks */}
            {Array.from({ length: 72 }).map((_, i) => {
              const deg = i * 5;
              const isMajor = deg % 30 === 0;
              const r1 = isMajor ? 485 : 490;
              const r2 = 495;
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={`tick-${i}`}
                  x1={Math.cos(rad) * r1}
                  y1={Math.sin(rad) * r1}
                  x2={Math.cos(rad) * r2}
                  y2={Math.sin(rad) * r2}
                  stroke={goldPrimary}
                  strokeWidth={isMajor ? '1.4' : '0.6'}
                  opacity={isMajor ? 0.8 : 0.4}
                />
              );
            })}

            {/* 2. 27 Nakshatra division ticks */}
            {Array.from({ length: 27 }).map((_, i) => {
              const rad = (i * (360 / 27) * Math.PI) / 180;
              return (
                <circle
                  key={`nakshatra-${i}`}
                  cx={Math.cos(rad) * 470}
                  cy={Math.sin(rad) * 470}
                  r="1.4"
                  fill="#FDE68A"
                  opacity="0.75"
                />
              );
            })}

            {/* --- 12 VEDIC RASHIS (ZODIAC WHEEL) --- */}
            {RASHIS.map((rashi, idx) => {
              const angleDeg = idx * 30 + 15; // center of 30° house
              const rad = (angleDeg * Math.PI) / 180;
              const boundaryRad = (idx * 30 * Math.PI) / 180;
              const rPos = 470;

              return (
                <g key={`rashi-${idx}`}>
                  {/* House Boundary Spoke radiating inward */}
                  <line
                    x1={Math.cos(boundaryRad) * 455}
                    y1={Math.sin(boundaryRad) * 455}
                    x2={Math.cos(boundaryRad) * 165}
                    y2={Math.sin(boundaryRad) * 165}
                    stroke={spokeColor}
                    strokeWidth="0.8"
                    strokeDasharray="4 6"
                  />

                  {/* Diamond Node at Boundary */}
                  <use
                    href="#diamondNode"
                    transform={`translate(${Math.cos(boundaryRad) * 455}, ${Math.sin(boundaryRad) * 455}) rotate(${idx * 30})`}
                  />

                  {/* Authentic Rashi Zodiac Glyph */}
                  <text
                    x={Math.cos(rad) * rPos}
                    y={Math.sin(rad) * rPos}
                    fill={isDark ? '#FDE68A' : '#78350F'}
                    fontSize="18"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${angleDeg + 90}, ${Math.cos(rad) * rPos}, ${Math.sin(rad) * rPos})`}
                    style={{ filter: isDark ? 'drop-shadow(0 0 4px rgba(251,191,36,0.6))' : 'none' }}
                  >
                    {rashi.sign}
                  </text>
                </g>
              );
            })}

            {/* --- MID CELESTIAL RINGS & SACRED KALACHAKRA --- */}
            <circle cx="0" cy="0" r="415" fill="none" stroke={goldPrimary} strokeWidth="0.7" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="0" cy="0" r="330" fill="none" stroke="url(#goldFiligree)" strokeWidth="1.2" opacity="0.75" />
            <circle cx="0" cy="0" r="260" fill="none" stroke={goldPrimary} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" />
            <circle cx="0" cy="0" r="190" fill="none" stroke="url(#goldFiligree)" strokeWidth="1.1" />

            {/* 12-Point Interlocking Sacred Triangles / Star Polygon */}
            {Array.from({ length: 4 }).map((_, i) => {
              const deg = i * 30;
              return (
                <polygon
                  key={`triangle-${i}`}
                  points="0,-330 285,165 -285,165"
                  fill="none"
                  stroke={goldPrimary}
                  strokeWidth="0.6"
                  opacity={isDark ? '0.22' : '0.15'}
                  transform={`rotate(${deg})`}
                />
              );
            })}

            {/* 8-Pointed Ashtadikpalaka Sacred Compass Star */}
            {Array.from({ length: 8 }).map((_, i) => {
              const deg = i * 45;
              const isCardinal = i % 2 === 0;
              const starLen = isCardinal ? 260 : 215;
              const starWidth = isCardinal ? 9 : 5;
              return (
                <polygon
                  key={`star-ray-${i}`}
                  points={`0,-${starLen} ${starWidth},0 0,-15 -${starWidth},0`}
                  fill={isDark ? 'rgba(251, 191, 36, 0.25)' : 'rgba(217, 119, 6, 0.18)'}
                  stroke="url(#goldFiligree)"
                  strokeWidth="0.8"
                  transform={`rotate(${deg})`}
                />
              );
            })}

            {/* --- SACRED 8-PETAL VEDIC LOTUS (PADMA) --- */}
            {/* Matches the Astrojit Logo's Golden Lotus */}
            <g transform="scale(1.35)">
              {Array.from({ length: 8 }).map((_, i) => (
                <use
                  key={`lotus-${i}`}
                  href="#lotusPetal"
                  transform={`rotate(${i * 45})`}
                />
              ))}
            </g>

            {/* --- CENTRAL RADIANT SURYA-CHANDRA CORE --- */}
            {/* Pulsating Solar Corona */}
            <circle cx="0" cy="0" r="75" fill="url(#sunAuraGrad)" />
            <circle cx="0" cy="0" r="42" fill={isDark ? '#F59E0B' : '#D97706'} opacity="0.3" />
            <circle cx="0" cy="0" r="30" fill="url(#goldFiligree)" stroke="#FFFBEB" strokeWidth="1.2" />

            {/* Surya Core Light Rays */}
            {Array.from({ length: 16 }).map((_, i) => {
              const deg = i * 22.5;
              const rayLen = i % 2 === 0 ? 48 : 38;
              return (
                <line
                  key={`sun-ray-${i}`}
                  x1="0"
                  y1="-30"
                  x2="0"
                  y2={`-${rayLen}`}
                  stroke="#FDE68A"
                  strokeWidth={i % 2 === 0 ? '1.5' : '0.9'}
                  transform={`rotate(${deg})`}
                />
              );
            })}
          </svg>

          {/* Counter-Rotating Inner Sacred Geometry Ring */}
          <svg
            viewBox="-200 -200 400 400"
            className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] pointer-events-none animate-[spin_120s_linear_infinite_reverse]"
          >
            <circle cx="0" cy="0" r="165" fill="none" stroke={goldPrimary} strokeWidth="0.8" strokeDasharray="4 6" opacity="0.6" />
            <circle cx="0" cy="0" r="130" fill="none" stroke="url(#goldFiligree)" strokeWidth="0.9" opacity="0.5" />
            {/* 16-petal secondary subtle lotus */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line
                key={`inner-spoke-${i}`}
                x1="0"
                y1="50"
                x2="0"
                y2="130"
                stroke={goldPrimary}
                strokeWidth="0.6"
                opacity="0.35"
                transform={`rotate(${i * 22.5})`}
              />
            ))}
          </svg>

          {/* --- LAYER 3: NAVAGRAHA PLANETARY JEWEL NODES --- */}
          {GRAHAS.map((graha, idx) => {
            const angle = planetAngles[idx] || 0;
            // Elliptical orbital path: slightly tilted
            const x = Math.cos(angle) * (graha.dist * 0.95);
            const y = Math.sin(angle) * (graha.dist * 0.75);

            return (
              <div
                key={graha.name}
                className="absolute transition-transform duration-75 pointer-events-none"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  willChange: 'transform',
                }}
              >
                {/* Luminous Planetary Halo */}
                <div
                  className="rounded-full flex items-center justify-center relative group"
                  style={{
                    width: graha.size * 2.8,
                    height: graha.size * 2.8,
                    background: `radial-gradient(circle, ${graha.color} 35%, ${graha.ringColor} 70%, transparent 100%)`,
                    boxShadow: isDark ? `0 0 12px ${graha.color}` : `0 0 8px ${graha.color}88`,
                  }}
                >
                  {/* Planet Core Sphere */}
                  <div
                    className="rounded-full"
                    style={{
                      width: graha.size,
                      height: graha.size,
                      backgroundColor: graha.color,
                      boxShadow: `inset -1px -1px 2px rgba(0,0,0,0.5)`,
                    }}
                  />

                  {/* Saturn's Planetary Rings */}
                  {graha.hasRing && (
                    <div
                      className="absolute rounded-full border border-amber-300/60 dark:border-amber-400/80 pointer-events-none"
                      style={{
                        width: graha.size * 3.4,
                        height: graha.size * 1.3,
                        transform: 'rotate(-25deg)',
                      }}
                    />
                  )}

                  {/* Ancient Planetary Glyph Label */}
                  <span
                    className="absolute -top-4 text-[10px] font-bold select-none drop-shadow-xs"
                    style={{
                      color: isDark ? '#FDE68A' : '#78350F',
                      textShadow: isDark ? '0 0 6px rgba(0,0,0,0.8)' : 'none',
                    }}
                  >
                    {graha.glyph}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gentle Vignette Gradient Overlay so login card stays 100% readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at center, rgba(15,13,12,0.3) 0%, rgba(15,13,12,0.75) 65%, rgba(15,13,12,0.92) 100%)'
            : 'radial-gradient(circle at center, rgba(251,248,241,0.2) 0%, rgba(251,248,241,0.65) 65%, rgba(251,248,241,0.92) 100%)',
        }}
      />
    </div>
  );
}
