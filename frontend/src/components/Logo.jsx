import React from 'react';

/**
 * Astrojit Devotional & Professional Brand Identity Emblem
 * Harmonizes sacred Vedic iconography (12-Petaled Surya Mandala, Sacred Chandra Crescent, 8-Pointed Jyotish Bindu)
 * with sharp, high-precision vector craftsmanship and corporate-grade typography.
 */
export default function Logo({ size = 'md', showTagline = true, light = false, iconOnly = false, className = '' }) {
  const sizeClasses = {
    xs: { icon: 'w-6 h-6', text: 'text-sm font-black', sub: 'text-[8px]', gap: 'gap-2' },
    sm: { icon: 'w-8 h-8', text: 'text-base font-black', sub: 'text-[9px]', gap: 'gap-2.5' },
    md: { icon: 'w-10 h-10 sm:w-11 sm:h-11', text: 'text-lg sm:text-xl font-black', sub: 'text-[10px] sm:text-[11px]', gap: 'gap-3' },
    lg: { icon: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-2xl sm:text-3xl font-black', sub: 'text-xs', gap: 'gap-3.5' },
    xl: { icon: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-3xl sm:text-4xl font-black', sub: 'text-sm', gap: 'gap-4' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Devotional & Professional Vector Seal */}
      <svg
        className={`${currentSize.icon} shrink-0 drop-shadow-md transition-transform duration-200 hover:scale-105`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sacred Temple Crimson & Kumkum Gradient */}
          <linearGradient id="aj_devotional_bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7F1D1D" />
            <stop offset="35%" stopColor="#991B1B" />
            <stop offset="70%" stopColor="#831843" />
            <stop offset="100%" stopColor="#4C0519" />
          </linearGradient>

          {/* Saffron & Radiant Gold Border Gradient */}
          <linearGradient id="aj_gold_ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          {/* Chandra Moon Silver-White Pearl Gradient */}
          <linearGradient id="aj_chandra_glow" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFFBEB" />
            <stop offset="80%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          {/* Central Jyotish Dhruva Star Gradient */}
          <linearGradient id="aj_star_gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FDE047" />
            <stop offset="85%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Soft Divine Glow Drop Shadow */}
          <filter id="aj_sacred_glow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#450A0A" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Medallion Outer Base with Sacred Rounded Hexadecagon / Curvature */}
        <rect
          x="4"
          y="4"
          width="112"
          height="112"
          rx="30"
          fill="url(#aj_devotional_bg)"
          stroke="url(#aj_gold_ring)"
          strokeWidth="2.5"
          filter="url(#aj_sacred_glow)"
        />

        {/* 2. Inner Sacred Gold Filigree Ring */}
        <circle
          cx="60"
          cy="60"
          r="48"
          stroke="#FDE68A"
          strokeWidth="1.2"
          strokeDasharray="4 2.5"
          opacity="0.6"
        />

        {/* 3. 12-Petaled Sacred Surya Mandala (Representing 12 Rashis & 12 Adityas) */}
        <g stroke="url(#aj_gold_ring)" strokeWidth="1.6" opacity="0.85">
          {/* 12 Radiant Rays with Auspicious Diamond Tips */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + 38 * Math.cos(rad);
            const y1 = 60 + 38 * Math.sin(rad);
            const x2 = 60 + 47 * Math.cos(rad);
            const y2 = 60 + 47 * Math.sin(rad);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />
                <circle cx={x2} cy={y2} r="1.3" fill="#FEF08A" />
              </g>
            );
          })}
        </g>

        {/* 4. Sacred Chandra (Graceful White-Gold Crescent Moon of Jyotish Mind / Manas) */}
        <path
          d="M68 28 C47 28 34 42 34 59 C34 76 47 90 68 90 C57 82 51 72 51 59 C51 46 57 36 68 28 Z"
          fill="url(#aj_chandra_glow)"
          stroke="#F59E0B"
          strokeWidth="0.8"
        />

        {/* 5. Ashta-Dikpalaka 8-Pointed Jyotish Star (Dhruva Tara / Divine Cosmic Light) */}
        <polygon
          points="70,38 73.5,52 86,50 75.5,58 81,71 70,63 59,71 64.5,58 54,50 66.5,52"
          fill="url(#aj_star_gold)"
          stroke="#B45309"
          strokeWidth="0.9"
        />

        {/* 6. Central Divine Bindu & Surya Chakra Core */}
        <circle cx="70" cy="56" r="6" fill="#991B1B" stroke="#FEF08A" strokeWidth="1.2" />
        <circle cx="70" cy="56" r="3.2" fill="#FEF08A" />
        <circle cx="70" cy="56" r="1.2" fill="#7F1D1D" />

        {/* 7. Subtle Auspicious Corner Bindus */}
        <circle cx="20" cy="20" r="1.8" fill="#FDE68A" opacity="0.75" />
        <circle cx="100" cy="20" r="1.8" fill="#FDE68A" opacity="0.75" />
        <circle cx="20" cy="100" r="1.8" fill="#FDE68A" opacity="0.75" />
        <circle cx="100" cy="100" r="1.8" fill="#FDE68A" opacity="0.75" />
      </svg>

      {/* Devotional & Professional Typography */}
      {!iconOnly && (
        <div className="leading-tight text-left">
          <div className="flex items-center tracking-tight">
            <span className={`${currentSize.text} tracking-tight ${light ? 'text-white' : 'text-slate-900'} uppercase font-sans`}>
              ASTRO<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 font-extrabold">JIT</span>
            </span>
            <span className="ml-1 text-[10px] text-amber-500 font-black animate-pulse leading-none" title="Divine Auspicious Bindu">
              ✦
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`${currentSize.sub} font-bold text-amber-800 tracking-wider uppercase hidden sm:block`}>
                Vedic Astrology & Spiritual Platform
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden md:inline">
                Drik Nirayana
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
