const fmtBhavaDeg = (v) => {
  if (v === undefined || v === null || v === '') return '';
  const num = typeof v === 'number' ? v : parseFloat(v);
  if (!isNaN(num) && (typeof v === 'number' || (String(v).includes('.') && !String(v).includes(':')))) {
    const d = Math.floor(num);
    const m = Math.floor((num - d) * 60);
    return `${d}:${String(m).padStart(2, '0')}`;
  }
  return String(v);
};

import React from 'react';
import { Upload } from 'lucide-react';

export const SIGN_NAMES_TA = [
  'மீனம்', 'மேஷம்', 'ரிஷபம்', 'மிதுனம்',
  'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்',
  'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்'
];

export const SIGN_NAMES_EN = [
  'Pisces', 'Aries', 'Taurus', 'Gemini',
  'Cancer', 'Leo', 'Virgo', 'Libra',
  'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius'
];

export const SIGN_MAP_GRID = [
  [0, 1, 2, 3],
  [11, -1, -1, 4],
  [10, -1, -1, 5],
  [9, 8, 7, 6]
];

export const CHALDEAN_ALPHABETS = [
  ['A','1'], ['B','2'], ['C','3'], ['D','4'], ['E','5'], ['F','8'], ['G','3'], ['H','5'],
  ['I','1'], ['J','1'], ['K','2'], ['L','3'], ['M','4'], ['N','5'], ['O','7'], ['P','8'],
  ['Q','1'], ['R','2'], ['S','3'], ['T','4'], ['U','6'], ['V','6'], ['W','6'], ['X','5'],
  ['Y','1'], ['Z','7']
];

/* ------------------------------------------------------------------------- */
/* AESTHETIC CLASSICAL VECTOR SVGS                                           */
/* ------------------------------------------------------------------------- */

export const BananaTreeKumbhamArt = () => (
  <svg viewBox="0 0 160 220" className="w-full h-full" style={{ maxHeight: '100%', objectFit: 'contain' }}>
    <defs>
      <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4A6B2F" />
        <stop offset="50%" stopColor="#7DA842" />
        <stop offset="100%" stopColor="#3B5724" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5E8E2E" />
        <stop offset="100%" stopColor="#325016" />
      </linearGradient>
      <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="40%" stopColor="#D4AF37" />
        <stop offset="70%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#8B4513" />
      </linearGradient>
    </defs>

    {/* Banana Tree Left */}
    <g transform="translate(10, 10)">
      {/* Trunk */}
      <path d="M 40,200 Q 38,130 42,80 Q 44,70 47,80 Q 50,130 48,200 Z" fill="url(#trunkGrad)" stroke="#2B4014" strokeWidth="1" />
      <line x1="39" y1="170" x2="49" y2="168" stroke="#2B4014" strokeWidth="0.8" opacity="0.6" />
      <line x1="40" y1="140" x2="48" y2="138" stroke="#2B4014" strokeWidth="0.8" opacity="0.6" />
      <line x1="41" y1="110" x2="47" y2="108" stroke="#2B4014" strokeWidth="0.8" opacity="0.6" />

      {/* Leaves */}
      <path d="M 43,80 C 25,60 5,60 0,90 C 5,75 25,75 43,82" fill="url(#leafGrad)" stroke="#223B0F" strokeWidth="0.8" />
      <path d="M 43,80 Q 20,70 0,90" fill="none" stroke="#A6CE39" strokeWidth="1" />
      <path d="M 46,75 C 65,45 95,45 105,70 C 95,60 70,60 46,78" fill="url(#leafGrad)" stroke="#223B0F" strokeWidth="0.8" />
      <path d="M 46,75 Q 75,55 105,70" fill="none" stroke="#A6CE39" strokeWidth="1" />
      <path d="M 44,70 C 35,30 50,15 52,5 C 55,20 62,35 45,72" fill="url(#leafGrad)" stroke="#223B0F" strokeWidth="0.8" />
      <path d="M 44,70 Q 48,35 52,5" fill="none" stroke="#A6CE39" strokeWidth="1" />
      <path d="M 42,90 C 15,85 5,110 2,130 C 10,110 25,100 42,92" fill="url(#leafGrad)" stroke="#223B0F" strokeWidth="0.8" />
      <path d="M 47,88 C 75,80 92,100 96,120 C 85,105 70,95 47,90" fill="url(#leafGrad)" stroke="#223B0F" strokeWidth="0.8" />

      {/* Hanging Bunch & Flower */}
      <g transform="translate(48, 85)">
        <path d="M 0,0 Q 8,15 12,28" fill="none" stroke="#3B5724" strokeWidth="2.5" />
        <ellipse cx="6" cy="14" rx="2.5" ry="5" fill="#D4E157" stroke="#827717" strokeWidth="0.5" transform="rotate(-30 6 14)" />
        <ellipse cx="11" cy="16" rx="2.5" ry="5" fill="#CDDC39" stroke="#827717" strokeWidth="0.5" transform="rotate(10 11 16)" />
        <ellipse cx="8" cy="22" rx="2.5" ry="5" fill="#D4E157" stroke="#827717" strokeWidth="0.5" transform="rotate(-15 8 22)" />
        <ellipse cx="13" cy="24" rx="2.5" ry="5" fill="#CDDC39" stroke="#827717" strokeWidth="0.5" transform="rotate(20 13 24)" />
        <path d="M 12,28 C 10,34 10,40 14,46 C 18,40 18,34 16,28 Z" fill="#6A1B29" stroke="#4A0E17" strokeWidth="0.8" />
      </g>
    </g>

    {/* Auspicious Poorna Kumbham on Altar */}
    <g transform="translate(85, 115)">
      <rect x="5" y="85" width="50" height="8" rx="2" fill="#8B4513" stroke="#5C2D0C" strokeWidth="1" />
      <polygon points="12,85 17,78 43,78 48,85" fill="#A0522D" stroke="#5C2D0C" strokeWidth="0.8" />
      <path d="M 20,48 L 40,48 L 44,54 C 50,62 52,74 42,78 L 18,78 C 8,74 10,62 16,54 Z" fill="url(#potGrad)" stroke="#7A5210" strokeWidth="1.2" />
      <line x1="16" y1="62" x2="44" y2="62" stroke="#8B0000" strokeWidth="1.5" />
      <circle cx="30" cy="68" r="2.5" fill="#B22222" />
      <path d="M 22,48 C 14,35 12,22 18,18 C 22,25 24,38 25,48 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.6" />
      <path d="M 38,48 C 46,35 48,22 42,18 C 38,25 36,38 35,48 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.6" />
      <path d="M 26,48 C 24,30 28,15 30,10 C 32,15 36,30 34,48 Z" fill="#388E3C" stroke="#1B5E20" strokeWidth="0.6" />
      <path d="M 24,46 C 22,35 24,25 30,22 C 36,25 38,35 36,46 Z" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
      <path d="M 30,22 Q 28,15 29,12 Q 31,16 32,22" fill="none" stroke="#8D6E63" strokeWidth="1" />
      <path d="M 22,50 Q 30,55 38,50" fill="none" stroke="#FF5722" strokeWidth="1.2" />
    </g>
    <ellipse cx="80" cy="208" rx="60" ry="6" fill="#F4EAD4" opacity="0.6" />
  </svg>
);

export const GaneshaArt = () => (
  <svg viewBox="0 0 160 160" className="w-full h-full" style={{ maxHeight: '100%', objectFit: 'contain' }}>
    <g transform="translate(80, 80)">
      <circle cx="0" cy="-5" r="54" fill="none" stroke="#7A1A22" strokeWidth="2" strokeDasharray="3,3" opacity="0.4" />
      <circle cx="0" cy="-5" r="60" fill="none" stroke="#7A1A22" strokeWidth="1.2" opacity="0.6" />
      <path d="M -60,20 C -60,-35 0,-65 0,-65 C 0,-65 60,-35 60,20" fill="none" stroke="#7A1A22" strokeWidth="2.5" />
      <path d="M -16,-36 L 16,-36 L 12,-62 L 0,-68 L -12,-62 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="2" />
      <circle cx="0" cy="-50" r="3" fill="#7A1A22" />
      <line x1="-10" y1="-42" x2="10" y2="-42" stroke="#7A1A22" strokeWidth="1.5" />
      <path d="M -16,-32 C -38,-35 -48,-15 -42,10 C -38,18 -26,16 -16,4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="2" />
      <path d="M -24,-24 C -36,-15 -34,0 -24,4" fill="none" stroke="#7A1A22" strokeWidth="1.2" opacity="0.6" />
      <path d="M 16,-32 C 38,-35 48,-15 42,10 C 38,18 26,16 16,4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="2" />
      <path d="M 24,-24 C 36,-15 34,0 24,4" fill="none" stroke="#7A1A22" strokeWidth="1.2" opacity="0.6" />
      <path d="M -16,-36 C -16,-20 -20,-10 -14,2 C -10,12 -5,16 0,16 C 5,16 10,12 14,2 C 20,-10 16,-20 16,-36 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="2" />
      <path d="M -5,-26 L 0,-18 L 5,-26" fill="none" stroke="#7A1A22" strokeWidth="1.8" />
      <line x1="0" y1="-28" x2="0" y2="-16" stroke="#B22222" strokeWidth="2" />
      <circle cx="0" cy="-14" r="1.5" fill="#B22222" />
      <path d="M -12,-18 Q -8,-16 -4,-18" fill="none" stroke="#7A1A22" strokeWidth="2" />
      <circle cx="-8" cy="-17" r="1" fill="#7A1A22" />
      <path d="M 12,-18 Q 8,-16 4,-18" fill="none" stroke="#7A1A22" strokeWidth="2" />
      <circle cx="8" cy="-17" r="1" fill="#7A1A22" />
      <path d="M -10,0 L -16,4 L -12,5 Z" fill="#7A1A22" stroke="#7A1A22" strokeWidth="1" />
      <path d="M 10,0 L 16,6 L 11,7 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
      <path d="M -4,14 C -6,26 -16,36 -28,34 C -36,32 -36,22 -28,20 C -22,18 -18,24 -16,28" fill="none" stroke="#7A1A22" strokeWidth="3" strokeLinecap="round" />
      <circle cx="-32" cy="24" r="4.5" fill="#D4AF37" stroke="#7A1A22" strokeWidth="1.5" />
      <path d="M -45,46 C -20,38 20,38 45,46 C 30,58 -30,58 -45,46 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="2" />
      <path d="M -35,46 C -18,42 18,42 35,46" fill="none" stroke="#7A1A22" strokeWidth="1.2" />
      <path d="M -20,46 C -10,54 10,54 20,46" fill="none" stroke="#7A1A22" strokeWidth="1" />
    </g>
  </svg>
);

export const NavagrahaMandalaArt = () => (
  <svg viewBox="0 0 180 180" className="w-full h-full" style={{ maxHeight: '100%', objectFit: 'contain' }}>
    <g transform="translate(90, 90)">
      <circle cx="0" cy="0" r="82" fill="none" stroke="#7A1A22" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="76" fill="none" stroke="#7A1A22" strokeWidth="1" strokeDasharray="4,3" />
      <circle cx="0" cy="0" r="52" fill="none" stroke="#7A1A22" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="26" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="2" />
      <circle cx="0" cy="0" r="16" fill="#FFF8E7" stroke="#7A1A22" strokeWidth="1.5" />
      <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7A1A22" fontFamily="'Noto Serif Tamil', serif">சூரி</text>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
        <line
          key={i}
          x1={Math.cos((ang * Math.PI) / 180) * 18}
          y1={Math.sin((ang * Math.PI) / 180) * 18}
          x2={Math.cos((ang * Math.PI) / 180) * 24}
          y2={Math.sin((ang * Math.PI) / 180) * 24}
          stroke="#7A1A22"
          strokeWidth="1.5"
        />
      ))}
      {[
        { ta: 'சுக்', ang: 0 },
        { ta: 'சந்', ang: 45 },
        { ta: 'செவ்', ang: 90 },
        { ta: 'ராகு', ang: 135 },
        { ta: 'குரு', ang: 180 },
        { ta: 'சனி', ang: 225 },
        { ta: 'புத', ang: 270 },
        { ta: 'கேது', ang: 315 }
      ].map((g, i) => {
        const rad = (g.ang * Math.PI) / 180;
        const cx = Math.cos(rad) * 64;
        const cy = Math.sin(rad) * 64;
        return (
          <g key={i}>
            <line
              x1={Math.cos(((g.ang + 22.5) * Math.PI) / 180) * 26}
              y1={Math.sin(((g.ang + 22.5) * Math.PI) / 180) * 26}
              x2={Math.cos(((g.ang + 22.5) * Math.PI) / 180) * 82}
              y2={Math.sin(((g.ang + 22.5) * Math.PI) / 180) * 82}
              stroke="#7A1A22"
              strokeWidth="1"
              opacity="0.5"
            />
            <circle cx={cx} cy={cy} r="13" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
            <text
              x={cx}
              y={cy + 3.5}
              textAnchor="middle"
              fontSize="8"
              fontWeight="bold"
              fill="#7A1A22"
              fontFamily="'Noto Serif Tamil', serif"
            >
              {g.ta}
            </text>
          </g>
        );
      })}
    </g>
  </svg>
);

export const MithunamCoupleArt = () => (
  <svg viewBox="0 0 150 200" className="w-full h-full" style={{ maxHeight: '100%', objectFit: 'contain' }}>
    <g transform="translate(75, 95)">
      <circle cx="0" cy="-10" r="65" fill="none" stroke="#7A1A22" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
      <path d="M -60,65 C -40,-60 40,-60 60,65" fill="none" stroke="#7A1A22" strokeWidth="1.2" opacity="0.4" />
      <g transform="translate(-25, 0)">
        <circle cx="0" cy="-45" r="10" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <path d="M -6,-52 L 6,-52 L 0,-62 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
        <path d="M -12,-34 L 12,-34 L 8,5 L -8,5 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <path d="M -10,5 L -14,55 L -3,55 L -1,15 L 3,55 L 12,55 L 8,5 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <path d="M -12,-30 L -25,-10 L -20,20" fill="none" stroke="#7A1A22" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="-20" cy="22" rx="5" ry="8" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
      </g>
      <g transform="translate(25, 0)">
        <circle cx="0" cy="-44" r="9" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <circle cx="9" cy="-47" r="5" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
        <path d="M -10,-33 L 10,-33 L 7,8 L -7,8 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <path d="M -7,8 L -12,55 L 14,55 L 8,8 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <line x1="-10" y1="-30" x2="6" y2="8" stroke="#7A1A22" strokeWidth="1.5" />
        <path d="M 10,-30 L 22,-10 L 15,10" fill="none" stroke="#7A1A22" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="10" r="4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
      </g>
      <line x1="-20" y1="-8" x2="22" y2="5" stroke="#7A1A22" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-16" cy="-6" r="4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
      <circle cx="18" cy="7" r="4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
      <rect x="-55" y="60" width="110" height="8" rx="2" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
      <text x="0" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7A1A22" fontFamily="'Noto Serif Tamil', serif">
        மிதுனம் (Gemini) ♊
      </text>
    </g>
  </svg>
);

export const ChartCornerMotif = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#7A1A22]" fill="currentColor">
    <path d="M2,2 L10,2 C6,6 6,6 2,10 Z M22,2 L14,2 C18,6 18,6 22,10 Z M2,22 L10,22 C6,18 6,18 2,14 Z M22,22 L14,22 C18,18 18,18 22,14 Z" opacity="0.6" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const NavagrahaDeityArt = ({ lord = 'Rahu' }) => {
  const norm = (lord || '').toLowerCase();
  let label = 'சுப மூர்த்தி';
  if (norm.includes('rahu') || norm.includes('ராகு')) label = 'ஸ்ரீ நாகநாதர்';
  else if (norm.includes('guru') || norm.includes('குரு')) label = 'ஸ்ரீ தட்சிணாமூர்த்தி';
  else if (norm.includes('sani') || norm.includes('சனி')) label = 'ஸ்ரீ சனீஸ்வரர்';
  else if (norm.includes('budh') || norm.includes('புதன்')) label = 'ஸ்ரீ புத பகவான்';
  else if (norm.includes('ketu') || norm.includes('கேது')) label = 'ஸ்ரீ கேது பகவான்';
  else if (norm.includes('sukra') || norm.includes('சுக்')) label = 'ஸ்ரீ சுக்கிராச்சாரியார்';
  else if (norm.includes('sury') || norm.includes('சூரி')) label = 'ஸ்ரீ சூரிய நாராயணர்';
  else if (norm.includes('chan') || norm.includes('சந்')) label = 'ஸ்ரீ சந்திர பகவான்';
  else if (norm.includes('chev') || norm.includes('செவ்')) label = 'ஸ்ரீ சுப்பிரமணியர்';

  return (
    <svg viewBox="0 0 120 150" className="w-full h-full" style={{ maxHeight: '100%', objectFit: 'contain' }}>
      <g transform="translate(60, 75)">
        <circle cx="0" cy="-10" r="48" fill="none" stroke="#7A1A22" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />
        <path d="M -30,-48 C -30,-20 0,-10 0,-10 C 0,-10 30,-20 30,-48" fill="none" stroke="#7A1A22" strokeWidth="1.5" />
        <polygon points="-12,-35 12,-35 0,-58" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <circle cx="0" cy="-28" r="10" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <path d="M -16,-18 L 16,-18 L 12,20 L -12,20 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <path d="M -32,20 C -25,35 25,35 32,20 C 20,40 -20,40 -32,20 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
        <circle cx="-18" cy="-5" r="4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
        <circle cx="18" cy="-5" r="4" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
        <ellipse cx="0" cy="38" rx="35" ry="6" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.5" />
        <text x="0" y="58" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7A1A22" fontFamily="'Noto Serif Tamil', serif">
          {label}
        </text>
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------------- */
/* SOUTH INDIAN 4x4 CHART RENDERER                                           */
/* ------------------------------------------------------------------------- */

export const renderSouthChart = (centerTitle, cellsData = [], isMini = false, isTa = true) => {
  return (
    <table className={isMini ? 'mini-south-chart' : 'south-chart'}>
      <tbody>
        {[0, 1, 2, 3].map(r => (
          <tr key={r}>
            {[0, 1, 2, 3].map(c => {
              const signIdx = SIGN_MAP_GRID[r][c];
              if (signIdx === -1) {
                if (r === 1 && c === 1) {
                  return (
                    <td key="center" colSpan={2} rowSpan={2} className="chart-center">
                      <div className="center-corner-decor tl"><ChartCornerMotif /></div>
                      <div className="center-corner-decor tr"><ChartCornerMotif /></div>
                      <div className="center-corner-decor bl"><ChartCornerMotif /></div>
                      <div className="center-corner-decor br"><ChartCornerMotif /></div>
                      <svg viewBox="0 0 100 100" style={{ width: '65%', height: '65%', opacity: 0.2 }}>
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#7A1A22" strokeWidth="2.5" />
                        <polygon points="50,14 62,38 88,38 67,54 75,78 50,64 25,78 33,54 12,38 38,38" fill="none" stroke="#7A1A22" strokeWidth="1.5" />
                      </svg>
                      <div className="center-title font-bold text-[#7A1A22]">{centerTitle}</div>
                    </td>
                  );
                }
                return null;
              }
              const content = cellsData[signIdx] || '';
              const signLabel = isTa ? SIGN_NAMES_TA[signIdx] : SIGN_NAMES_EN[signIdx];
              return (
                <td key={c} className="chart-cell">
                  <span className="sign-watermark">{signLabel}</span>
                  <div className="cell-planets">{content}</div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* ------------------------------------------------------------------------- */
/* INDIVIDUAL PAGE RENDERERS                                                 */
/* ------------------------------------------------------------------------- */

// 1. Cover Page
export const CoverPage = ({ pageNum, data = {}, isTa = true, onImageUpload, boxHeightMode = 'compact' }) => {
  const h = data.header || {};
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="header-box">
          <div className="header-line-1">{h.line1 || 'Jishnu Astro & Vasthu Research Centre'}</div>
          <div className="header-line-2">{h.line2 || 'Govindan & Venkatesan'}</div>
          <div className="header-small">{h.addr1 || '5/704, 179, Street No.39, KCC Nagar, Bagalur Road, Hosur, Krishnagiri Dt. 635 109,'}</div>
          <div className="header-small">{h.addr2 || '#21-H1, Maaruthi Nivas, Velmurugan Nagar, Malayadivaram, Sankagiri, Salem Dt., 637 301'}</div>
          <div className="header-phone">{h.phone || 'Ph:99947 83643 / 90430 22219 email:g.v_71@yahoo.com.'}</div>
        </div>

        <div className="credit-row">
          <span className="software-credit">{data.credit || 'ICS Softwares, Hosur 04344-222656'}</span>
        </div>
        <div className="box-divider" />

        <div className="title-area">
          <h1 className="title-janana">ஜனன ஜாதகம்.</h1>
          <div className="invocation-text">
            <div>{data.verse1 || 'ஜனனீ ஜன்ம ஸௌக்யானாம் வர்த்தனீ குலஸம்பதாம் |'}</div>
            <div>{data.verse2 || 'பதவீ பூர்வபுண்யானாம் லிக்யதே ஜன்மபத்ரிகா ||'}</div>
          </div>
        </div>

        <div className="cover-content">
          <div className="cover-image-slot">
            {data.img ? (
              <img src={data.img} alt="Cover" className="uploaded-cover-img" />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <BananaTreeKumbhamArt />
                <label className="image-placeholder-label no-print absolute bottom-1 bg-white/80 px-2 py-0.5 rounded text-[8px] cursor-pointer">
                  <Upload className="w-3 h-3 text-stone-500 inline mr-0.5" />
                  <span>{isTa ? 'படம் மாற்ற' : 'Change'}</span>
                  <input type="file" accept="image/*" onChange={(e) => onImageUpload && onImageUpload(e)} className="hidden" />
                </label>
              </div>
            )}
          </div>

          <div className="cover-details-block">
            <div className="detail-row">
              <span className="det-label">பெயர்</span>
              <span className="det-colon">:</span>
              <span className="det-val font-bold text-sm text-[#7A1A22]">{data.name || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">தந்தை</span>
              <span className="det-colon">:</span>
              <span className="det-val">{data.father || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">தாய்</span>
              <span className="det-colon">:</span>
              <span className="det-val">{data.mother || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">சொந்த ஊர்</span>
              <span className="det-colon">:</span>
              <span className="det-val">{data.native || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">நட்சத்திரம்</span>
              <span className="det-colon">:</span>
              <span className="det-val font-semibold">{data.nakshatra || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">ராசி</span>
              <span className="det-colon">:</span>
              <span className="det-val">{data.rasi || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">லக்னம்</span>
              <span className="det-colon">:</span>
              <span className="det-val">{data.lagna || ''}</span>
            </div>

            <div className="my-1.5 border-t border-dotted border-stone-300" />

            <div className="detail-row">
              <span className="det-label">தேதி</span>
              <span className="det-colon">:</span>
              <span className="det-val font-mono">{data.date || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">நேரம்</span>
              <span className="det-colon">:</span>
              <span className="det-val font-mono">{data.time || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">தமிழ் தேதி</span>
              <span className="det-colon">:</span>
              <span className="det-val">{data.tamilDate || ''}</span>
            </div>
            <div className="detail-row">
              <span className="det-label">இடம்</span>
              <span className="det-colon">:</span>
              <div className="det-val">
                <div>{data.place || ''}</div>
                {data.coords && (
                  <div className="text-[9.5px] text-stone-500 font-mono mt-0.5">{data.coords}</div>
                )}
              </div>
            </div>

            <div className="mt-2 text-right">
              <span className="font-bold text-[#7A1A22] text-xs tracking-wider">திருக்கணிதம்</span>
            </div>
          </div>
        </div>

        <div className="box-bottom-rule" />
        <div className="bottom-dot">.</div>
      </div>
    </div>
  );
};

// 2. Vinayagar Stuthi
export const VinayagarStuthiPage = ({ pageNum, data = {}, isTa = true, onImageUpload, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'விநாயகர் ஸ்துதி'}</h2>
        </div>

        <div className="centered-illustration-slot">
          {data.img ? (
            <img src={data.img} alt="Vinayagar" className="uploaded-cover-img" />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <GaneshaArt />
              <label className="image-placeholder-label no-print absolute bottom-0 bg-white/80 px-2 py-0.5 rounded text-[8px] cursor-pointer">
                <Upload className="w-3 h-3 text-stone-500 inline mr-0.5" />
                <span>{isTa ? 'படம் மாற்ற' : 'Change'}</span>
                <input type="file" accept="image/*" onChange={(e) => onImageUpload && onImageUpload(e)} className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="verse-container">
          {(data.verseLines || [
            'தங்க மான் மழு வேந்தேந்தி',
            'தன்மதி தலையிற் கொண்டோன்',
            'மங்கையர் பதிக்குச் சொன்ன',
            'மாமொழிச் சோதிடத்தை',
            'இங்குநா முறைப்பதற்கோர்',
            'இமையெனும் பிழை வராமற்',
            'செங்கண்மால் மருகன் யானைச்',
            'சிரன் பதங் காப்பதாமே.'
          ]).map((line, idx) => (
            <p key={idx} className="verse-line">{line}</p>
          ))}
          <div className="subham-text">{data.subhamText || 'சுப மஸ்து.'}</div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 3. Navagraha Stothram
export const NavagrahaStothramPage = ({ pageNum, data = {}, isTa = true, onImageUpload, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'நவக்கிரஹ ஸ்தோத்ரம்'}</h2>
        </div>

        <div className="centered-illustration-slot">
          {data.img ? (
            <img src={data.img} alt="Navagraha" className="uploaded-cover-img" />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <NavagrahaMandalaArt />
              <label className="image-placeholder-label no-print absolute bottom-0 bg-white/80 px-2 py-0.5 rounded text-[8px] cursor-pointer">
                <Upload className="w-3 h-3 text-stone-500 inline mr-0.5" />
                <span>{isTa ? 'படம் மாற்ற' : 'Change'}</span>
                <input type="file" accept="image/*" onChange={(e) => onImageUpload && onImageUpload(e)} className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="stotram-container">
          {(data.stotramLines || [
            'ஓம் நம: சூர்யாய சோமாய',
            'மங்களாய புதாய ச',
            'குரு சுக்ர சனிப்யஸ்ச',
            'ராகவே கேதவே நம: ...'
          ]).map((line, idx) => (
            <p key={idx} className="stotram-line">{line}</p>
          ))}
          <p className="benefit-text">
            {data.benefitText || 'நவக்கிரகங்களை தினம் பூஜிப்பவர்களுக்கு கஷ்டம் நீங்கி சகல சுகங்களும் உண்டாகும்.'}
          </p>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 4. Janana Vivaram (Birth Details)
export const JananaVivaramPage = ({ pageNum, data = {}, isTa = true, onImageUpload, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{isTa ? 'ஜனன விவரம்' : 'BIRTH DETAILS'}</h2>
        </div>
        <div className="title-rule-sub" />

        <div className="janana-content-split">
          <div className="janana-left-illustration">
            {data.img ? (
              <img src={data.img} alt="Zodiac Couple" className="uploaded-cover-img" />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <MithunamCoupleArt />
                <label className="image-placeholder-label no-print absolute bottom-1 bg-white/80 px-2 py-0.5 rounded text-[8px] cursor-pointer">
                  <Upload className="w-3 h-3 text-stone-500 inline mr-0.5" />
                  <span>{isTa ? 'படம் மாற்ற' : 'Change'}</span>
                  <input type="file" accept="image/*" onChange={(e) => onImageUpload && onImageUpload(e)} className="hidden" />
                </label>
              </div>
            )}
          </div>

          <div className="janana-details-table">
            <div className="janana-row">
              <span className="j-lbl">பெயர்</span>
              <span className="j-col">:</span>
              <span className="j-val font-bold text-sm text-[#7A1A22]">{data.name || ''}</span>
            </div>
            {data.gender && (
              <div className="janana-row -mt-1">
                <span className="j-lbl"></span>
                <span className="j-col"></span>
                <span className="j-val text-[10px] text-stone-500 font-semibold">({data.gender})</span>
              </div>
            )}
            <div className="janana-row">
              <span className="j-lbl">தேதி</span>
              <span className="j-col">:</span>
              <span className="j-val font-mono">{data.date || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">தமிழ் தேதி</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.tamilDate || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">உதயாதி நாழிகை</span>
              <span className="j-col">:</span>
              <span className="j-val font-mono font-semibold">{data.nazhigai || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">நாடு</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.country || 'இந்தியா (India)'}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">இடம்</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.place1 || data.place || ''} {data.place2 ? ', ' + data.place2 : ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">அட்ச தீர்க்க ரேகை</span>
              <span className="j-col">:</span>
              <span className="j-val font-mono">{data.coords || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">பொது நேரம் திருத்தம்</span>
              <span className="j-col">:</span>
              <span className="j-val font-mono">{data.tzcorr || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">லக்னம்</span>
              <span className="j-col">:</span>
              <span className="j-val font-bold text-[#7A1A22]">{data.lagna || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">ராசி</span>
              <span className="j-col">:</span>
              <span className="j-val font-bold">{data.rasi || ''} ♊</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">நட்சத்திரம்</span>
              <span className="j-col">:</span>
              <span className="j-val font-semibold">{data.nakshatra || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">ஜனன திதி</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.tithi || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">யோகம்</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.yogam || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">கரணம்</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.karanam || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">அயனம்</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.ayanam || 'தக்ஷிணாயனம்'}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">கணம் / யோனி / நாடி</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.gyn || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">விருட்சம் / ரஜ்ஜு</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.vr || ''}</span>
            </div>
            <div className="janana-row">
              <span className="j-lbl">பறவை / அதிதேவதை</span>
              <span className="j-col">:</span>
              <span className="j-val">{data.pa || ''}</span>
            </div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 5. Nakshatra Details Page
export const JananaNakshatraPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || (isTa ? 'ஜனன விவரம் (நட்சத்திர விவரம்)' : 'JANANA NAKSHATRA DETAILS')}</h2>
        </div>
        <div className="title-rule-sub" />

        <div className="nakshatra-grid-2col">
          <div className="nak-field"><span className="n-lbl">ஜனன நட்சத்திரம்</span><span className="n-col">:</span><span className="n-val font-bold text-[#7A1A22]">{data.nakshatra || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">நட்சத்திர ஆரம்ப நேரம்</span><span className="n-col">:</span><span className="n-val font-mono">{data.nakStart || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">நட்சத்திர முடிவு நேரம்</span><span className="n-col">:</span><span className="n-val font-mono">{data.nakEnd || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">ஆதியந்த பரம நாழிகை</span><span className="n-col">:</span><span className="n-val font-mono">{data.aadiyanta || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">கர்ப்பசெல் நாழிகை</span><span className="n-col">:</span><span className="n-val font-mono">{data.garbha || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">நின்ற இருப்பு நாழிகை</span><span className="n-col">:</span><span className="n-val font-mono">{data.iruppu || ''}</span></div>
          <div className="nak-field col-span-2 bg-stone-50 border border-stone-200 p-1 rounded">
            <span className="n-lbl font-bold text-[#7A1A22]">திசை இருப்பு</span>
            <span className="n-col">:</span>
            <span className="n-val font-bold text-[#7A1A22]">{typeof data.dashaBal === 'object' ? (data.dashaBal?.textTa || '') : (data.dashaBal || '')}</span>
          </div>
          <div className="nak-field"><span className="n-lbl">ஜனன திதி</span><span className="n-col">:</span><span className="n-val">{data.tithi || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">திதி சூன்ய ராசி</span><span className="n-col">:</span><span className="n-val">{data.soonyam || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">யோகி</span><span className="n-col">:</span><span className="n-val font-semibold">{data.yogi || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">அவயோகி</span><span className="n-col">:</span><span className="n-val font-semibold">{data.avayogi || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">நட்சத்திர ஹோரை</span><span className="n-col">:</span><span className="n-val">{data.hora || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">அயனாம்சம்</span><span className="n-col">:</span><span className="n-val font-mono">{data.ayanamsha || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">சுதேச நேரத்திருத்தம்</span><span className="n-col">:</span><span className="n-val font-mono">{data.lmt || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">லக்ன சுபர்</span><span className="n-col">:</span><span className="n-val text-emerald-800">{data.subhar || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">லக்ன பாபர்</span><span className="n-col">:</span><span className="n-val text-rose-800">{data.pabar || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">வைநாசிகத் தாரை</span><span className="n-col">:</span><span className="n-val">{data.vainasika || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">சூரிய உதயம்</span><span className="n-col">:</span><span className="n-val font-mono">{data.sunrise || ''}</span></div>
          <div className="nak-field"><span className="n-lbl">சூரிய அஸ்தமனம்</span><span className="n-col">:</span><span className="n-val font-mono">{data.sunset || ''}</span></div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 6. Rasi & Navamsa Charts Page
export const RasiNavamsaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="charts-meta-header">
          <div className="cm-row">
            <div><span className="font-bold">பெயர்:</span> {data.name || ''}</div>
            <div><span className="font-bold">லக்னம்:</span> <span className="font-bold text-[#7A1A22]">{data.lagna || ''}</span></div>
          </div>
          <div className="cm-row">
            <div><span className="font-bold">தேதி:</span> <span className="font-mono">{data.date || ''}</span></div>
            <div><span className="font-bold">ராசி:</span> <span className="font-bold">{data.rasi || ''}</span></div>
          </div>
          <div className="cm-row">
            <div><span className="font-bold">நேரம்:</span> <span className="font-mono">{data.time || ''}</span></div>
            <div><span className="font-bold">நட்சத்திரம்:</span> {data.nakPada || data.nakshatra || ''}</div>
          </div>
        </div>

        <div className="charts-duo-grid">
          <div className="chart-wrapper">
            {renderSouthChart('ராசி', data.rasiChart || [], false, isTa)}
          </div>
          <div className="chart-wrapper">
            {renderSouthChart('நவாம்சம்', data.navamsaChart || [], false, isTa)}
          </div>
        </div>

        <div className="charts-footer-details">
          <div className="cf-row">
            <div><span className="font-bold">இடம்:</span> {data.place || ''} {data.coords ? `(${data.coords})` : ''}</div>
            <div><span className="font-bold">தமிழ் தேதி:</span> {data.tamilDate || ''}</div>
          </div>
          <div className="cf-row">
            <div><span className="font-bold">பக்ஷம்-திதி:</span> {data.pakshaTithi || data.tithi || ''}</div>
            <div><span className="font-bold text-[#7A1A22]">திசை இருப்பு:</span> <span className="font-semibold">{data.dashaBal || ''}</span></div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 7. Nirayana Graha Nilai (Planet Table)
export const PlanetTablePage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'துல்லியமான நிராயன கிரக நிலைகள்'}</h2>
        </div>

        <table className="planet-positions-table">
          <thead>
            <tr>
              <th>கிரகம்</th>
              <th>பாகை-கலை</th>
              <th>நட்சத்திரம்</th>
              <th>பாதம்</th>
              <th>நட்-அதிபதி</th>
              <th>ராசி</th>
              <th>பாகை-கலை</th>
              <th>நிலை</th>
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, idx) => (
              <tr key={idx}>
                <td className="font-bold text-left pl-2">{r.graha}</td>
                <td className="font-mono text-center">{r.deg1}</td>
                <td className="text-center">{r.nak}</td>
                <td className="font-mono text-center font-bold">{r.pada}</td>
                <td className="text-center">{r.lord}</td>
                <td className="text-center font-semibold">{r.rasi}</td>
                <td className="font-mono text-center font-bold text-[#7A1A22]">{r.deg2}</td>
                <td className="text-center font-bold text-[10px]">{r.status || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="planet-page-footer">
          <span><b>பெயர் :</b> {data.name || data.footerName || ''}</span>
          <span><b>தேதி :</b> {data.date || data.footerDate || ''}</span>
          <span><b>அயனாம்சம்:</b> {data.ayanamsha || data.footerAyanamsha || '-24:14:02'} Lahiri.</span>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 8. 4 Charts & Sripati Bhavas Page
export const FourChartsBhavaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        {/* 2x2 Grid of 4 Charts */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex justify-center">{renderSouthChart('ராசி', data.rasiChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart('நவாம்சம்', data.navamsaChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart('3-திரேக்காணம்', data.drekkanaChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart('ஸ்ரீபதி-பாவகம்', data.sripatiChart || [], true, isTa)}</div>
        </div>

        <div className="text-center font-bold text-xs text-[#7A1A22] my-1">
          {data.heading || `${data.personName || ''} பாவ ஸ்புடம் (ஸ்ரீபதி முறை)`}
        </div>

        {/* Side-by-Side 2 Column: Left 9 Grahas, Right 12 Bhavas */}
        <div className="grid grid-cols-5 gap-3 mt-1 text-[10px]">
          {/* Left: 9 Grahas Table */}
          <div className="col-span-2">
            <table className="w-full border-collapse border border-black text-center">
              <thead>
                <tr className="bg-stone-100 font-bold border-b border-black">
                  <th className="border border-black p-0.5 text-left pl-1">கிரகம்</th>
                  <th className="border border-black p-0.5">பாகை</th>
                </tr>
              </thead>
              <tbody>
                {(data.grahasSphutam || [
                  { graha: 'சூரியன்', deg: '192:34' },
                  { graha: 'சந்திரன்', deg: '67:46' },
                  { graha: 'செவ்வாய்', deg: '113:29' },
                  { graha: 'புதன்(வ)', deg: '204:11' },
                  { graha: 'குரு', deg: '119:52' },
                  { graha: 'சுக்கிரன்(வ)', deg: '182:56' },
                  { graha: 'சனி(வ)', deg: '345:09' },
                  { graha: 'ராகு', deg: '301:56' },
                  { graha: 'கேது', deg: '121:56' }
                ]).map((g, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-0.5 text-left pl-1 font-bold">{g.graha}</td>
                    <td className="border border-black p-0.5 font-mono">{g.deg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: 12 Bhavas Table */}
          <div className="col-span-3">
            <table className="bhava-table">
              <thead>
                <tr>
                  <th>பாவ</th>
                  <th>ஆரம்பம்</th>
                  <th>மத்தி</th>
                  <th>முடிவு</th>
                </tr>
              </thead>
              <tbody>
                {(data.bhavas || []).map((b, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-center">{b.bhava}</td>
                    <td className="font-mono text-center">{fmtBhavaDeg(b.start)}</td>
                    <td className="font-mono text-center font-bold text-[#7A1A22]">{fmtBhavaDeg(b.madhya)}</td>
                    <td className="font-mono text-center">{fmtBhavaDeg(b.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-[10px] text-stone-800 font-semibold mt-1.5 px-1">
          {data.bhavaChange ? `ஜாதகத்தில் பாவக மாற்றம் : ${data.bhavaChange}` : 'ஜாதகத்தில் பாவக மாற்றம் : சுக்கிரன்-10, ராகு-2, கேது-8'}
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 9. Shadbala Analysis Page
export const ShadbalaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'ஜாதகத்தில் ஷட்பலம் ஆய்வு'}</h2>
        </div>

        <div className="shadbala-section-title">கிரக கணிதம்</div>
        <table className="shadbala-table">
          <thead>
            <tr>
              {(data.grahaHeaders || ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி']).map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.grahaRows || []).map((row, rIdx) => {
              const isTot = row.label === 'மொத்தம்';
              return (
                <tr key={rIdx} className={isTot ? 'font-bold bg-amber-50/50' : ''}>
                  <td className="font-bold text-left pl-1">{row.label}</td>
                  {(row.vals || []).map((v, vIdx) => (
                    <td key={vIdx} className="font-mono">{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="shadbala-section-title mt-2">பாவக கணிதம்</div>
        <table className="shadbala-table">
          <thead>
            <tr>
              <th>பாவகம்</th>
              {(data.bhavaHeaders || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((b) => (
                <th key={b}>{b}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.bhavaRows || []).map((row, rIdx) => {
              const isTot = row.label === 'மொத்தம்';
              return (
                <tr key={rIdx} className={isTot ? 'font-bold bg-amber-50/50' : ''}>
                  <td className="font-bold text-left pl-1">{row.label}</td>
                  {(row.vals || []).map((v, vIdx) => (
                    <td key={vIdx} className="font-mono">{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 10. Dasavarga Table Page
export const DasavargaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்'}</h2>
        </div>

        {/* Table A: Dignities */}
        <div className="text-[10px] font-bold text-[#7A1A22] mb-0.5">அட்டவணை 1: கிரக பலம் (ஆட்சி, உச்சம், நட்பு, சமம், பகை, நீசம்)</div>
        <table className="dasavarga-table">
          <thead>
            <tr>
              <th className="w-[18%]">வர்க்கம்</th>
              {(data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது', 'லக்']).map((g, i) => (
                <th key={i}>{g}</th>
              ))}
              <th className="bg-emerald-50 text-emerald-800">சுப</th>
              <th className="bg-rose-50 text-rose-800">அசுப</th>
            </tr>
          </thead>
          <tbody>
            {(data.tableA || []).map((row, rIdx) => {
              const isTot = rIdx >= 10;
              return (
                <tr key={rIdx} className={isTot ? 'font-bold bg-stone-100' : ''}>
                  <td className="font-bold text-left pl-1">{row.varga}</td>
                  {(row.planets || row.cells || []).map((val, pIdx) => (
                    <td key={pIdx}>{val}</td>
                  ))}
                  <td className="font-bold text-emerald-800">{row.subha}</td>
                  <td className="font-bold text-rose-800">{row.asubha}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table B: Sign Placements */}
        <div className="text-[10px] font-bold text-[#7A1A22] mt-2 mb-0.5">அட்டவணை 2: வர்க்க ராசி நிலைகள்</div>
        <table className="dasavarga-table">
          <thead>
            <tr>
              <th className="w-[18%]">வர்க்கம்</th>
              {(data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது', 'லக்']).map((g, i) => (
                <th key={i}>{g}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.tableB || []).map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="font-bold text-left pl-1">{row.varga}</td>
                {(row.planets || row.cells || []).map((val, pIdx) => (
                  <td key={pIdx}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 11 to 19. Mahadasha Page
export const MahadashaPage = ({ pageNum, pageKey, data = {}, isTa = true, onImageUpload, boxHeightMode = 'compact' }) => {
  const rows = data.rows || data.bhuktis || [];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="dasha-heading">
          {data.heading || `${data.dashaLord || ''} திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்`}
        </div>

        <table className="dasha-bhukti-table">
          <thead>
            <tr>
              <th rowSpan={2}>புக்தி</th>
              <th colSpan={2}>ஸ்தானம்</th>
              <th rowSpan={2}>நிலை</th>
              <th rowSpan={2}>காலம்<br />வரு-மா-நா</th>
              <th rowSpan={2}>ஆரம்பம்<br />தேதி</th>
              <th rowSpan={2}>முடிவு<br />தேதி</th>
              <th rowSpan={2}>வயது<br />வரு-மா-நா</th>
              <th rowSpan={2}>பலன்கள்</th>
            </tr>
            <tr>
              <th>லக்</th>
              <th>தசா</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, bIdx) => (
              <tr key={bIdx}>
                <td className="font-bold text-left pl-1">{b.bhukti}</td>
                <td className="font-mono">{b.sthanamLag || b.sthanaLagna}</td>
                <td className="font-mono">{b.sthanamDasha || b.sthanaDasha}</td>
                <td className="text-[10px] font-mono">{b.status}</td>
                <td className="font-mono">{b.duration || b.period}</td>
                <td className="font-mono">{b.startDate}</td>
                <td className="font-mono font-bold text-[#7A1A22]">{b.endDate}</td>
                <td className="font-mono">{b.ageAtEnd || b.age}</td>
                <td className="text-center font-bold text-amber-700">{b.remarks || b.phalan || '**'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom area: Deity Idol Slot + Classical Description & Parikaram */}
        <div className="dasha-bottom-area">
          <div className="dasha-img-slot">
            {data.img ? (
              <img src={data.img} alt={data.dashaLord} className="uploaded-cover-img" />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <NavagrahaDeityArt lord={data.dashaLord} />
                <label className="image-placeholder-label no-print absolute bottom-0 bg-white/80 px-1 py-0.5 rounded text-[8px] cursor-pointer">
                  <Upload className="w-2.5 h-2.5 text-stone-500 inline mr-0.5" />
                  <span>{isTa ? 'மாற்ற' : 'Change'}</span>
                  <input type="file" accept="image/*" onChange={(e) => onImageUpload && onImageUpload(e)} className="hidden" />
                </label>
              </div>
            )}
          </div>
          <div className="dasha-text-area">
            <p className="dasha-desc">{data.description || ''}</p>
            {data.parikaram && (
              <div className="parikaram-box">
                <span className="font-bold text-[#7A1A22]">பரிகாரம் & ஸ்தலம்: </span>
                <span>{data.parikaram}</span>
              </div>
            )}
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 20. Sarvashtavarga Page
export const SarvashtavargaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const signs = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>சர்வாஷ்டவர்க்க பரல்கள் விவரம்..</h2>
        </div>

        {/* 7x12 Matrix */}
        <table className="sarva-matrix-table">
          <thead>
            <tr>
              <th className="w-[14%]">கிரகம்</th>
              {signs.map((s, i) => (
                <th key={i}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.matrix || []).map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="font-bold text-left pl-1">{data.grahas?.[rIdx] || row.graha || `G${rIdx+1}`}</td>
                {(row.points || row).map((pt, pIdx) => (
                  <td key={pIdx} className="font-mono">{pt}</td>
                ))}
              </tr>
            ))}
            {data.totals && (
              <tr className="font-bold bg-amber-50/50">
                <td className="text-left pl-1">மொத்தம்</td>
                {(data.totals || []).map((t, tIdx) => (
                  <td key={tIdx} className="font-mono text-[#7A1A22]">{t}</td>
                ))}
              </tr>
            )}
          </tbody>
        </table>

        {/* 4x4 SAV Chart with 337 in Center */}
        <div className="flex justify-center my-2">
          <div className="w-[60mm]">
            {renderSouthChart('பரல்கள் 337', data.chartCells || [], true, isTa)}
          </div>
        </div>

        {/* Two-Column Breakdown: Houses on Left, Directions on Right */}
        <div className="grid grid-cols-2 gap-4 text-[10px] px-2 font-semibold">
          <div className="space-y-0.5">
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>கேந்திரம் :</span><span className="font-mono font-bold">{data.kendram || 107}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>பணபரம் :</span><span className="font-mono font-bold">{data.panaparam || 108}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>ஆபோக்லீயம் :</span><span className="font-mono font-bold">{data.apoklimam || 122}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>உபசெயம் :</span><span className="font-mono font-bold">{data.upachayam || 113}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>திரிகோணம் :</span><span className="font-mono font-bold">{data.trikonam || 93}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5 text-emerald-800"><span>வரவினம் :</span><span className="font-mono font-bold">{data.varavinam || 88}</span></div>
            <div className="flex justify-between py-0.5 text-rose-800"><span>செலவினம் :</span><span className="font-mono font-bold">{data.selavinam || 86}</span></div>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>கிழக்கு :</span><span className="font-mono font-bold">{data.east || 93}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>மேற்கு :</span><span className="font-mono font-bold">{data.west || 80}</span></div>
            <div className="flex justify-between border-b border-stone-200 py-0.5"><span>தெற்கு :</span><span className="font-mono font-bold">{data.south || 83}</span></div>
            <div className="flex justify-between py-0.5"><span>வடக்கு :</span><span className="font-mono font-bold">{data.north || 81}</span></div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// 21. Chaldean Numerology Page
export const NumerologyPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>எண் கணிதம் (நியூமராலஜி)</h2>
        </div>

        <div className="numerology-content">
          <div className="num-row"><span className="num-lbl">பெயர்</span><span className="num-col">:</span><span className="num-val font-bold text-[#7A1A22]">{data.name || ''}</span></div>
          <div className="num-row"><span className="num-lbl">ஆங்கில எழுத்துக்களின் கூடுதல்</span><span className="num-col">:</span><span className="num-val font-mono">{data.engSum || ''}</span></div>
          <div className="num-row"><span className="num-lbl">பிறந்த தேதி</span><span className="num-col">:</span><span className="num-val font-mono">{data.dobEng || ''}</span></div>
          <div className="num-row"><span className="num-lbl">தேதி (உடல்) எண்</span><span className="num-col">:</span><span className="num-val font-bold text-amber-900">{data.dateNum || ''}</span></div>
          <div className="num-row"><span className="num-lbl">வருஷ (உயிர்) எண்</span><span className="num-col">:</span><span className="num-val font-bold text-indigo-900">{data.yearNum || ''}</span></div>
          <div className="num-row"><span className="num-lbl">அதிர்ஷ்ட எண்கள்</span><span className="num-col">:</span><span className="num-val font-semibold">{data.luckyNums || ''}</span></div>
          <div className="num-row"><span className="num-lbl">அதிர்ஷ்ட தேதிகள்</span><span className="num-col">:</span><span className="num-val">{data.luckyDates || ''}</span></div>
          <div className="num-row"><span className="num-lbl">அதிர்ஷ்ட நிறங்கள்</span><span className="num-col">:</span><span className="num-val">{data.luckyColors || ''}</span></div>
          <div className="num-row"><span className="num-lbl">அதிர்ஷ்ட கற்கள்</span><span className="num-col">:</span><span className="num-val font-semibold">{data.luckyStones || ''}</span></div>
          <div className="num-row"><span className="num-lbl">மேன்மை தரும் தெய்வம்</span><span className="num-col">:</span><span className="num-val font-bold text-[#7A1A22]">{data.deity || ''}</span></div>
          <div className="num-row"><span className="num-lbl">ஸ்தலங்கள் (தென்னிந்தியா)</span><span className="num-col">:</span><span className="num-val">{data.temples || ''}</span></div>
        </div>

        {/* 26-Letter Chaldean Table */}
        <div className="mt-3">
          <table className="chaldean-alphabet-table">
            <thead>
              <tr>
                {CHALDEAN_ALPHABETS.map(([letter]) => (
                  <th key={letter}>{letter}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {CHALDEAN_ALPHABETS.map(([letter, num]) => (
                  <td key={letter} className="font-mono font-bold text-[#7A1A22]">{num}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="subham-bottom">சுபம்.</div>
        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */
/* SHARED BOOKLET STYLESHEET                                                 */
/* ------------------------------------------------------------------------- */

export const BookletStylesheet = () => (
  <style>{`
    .booklet-container {
      width: 100%;
      background: #FAF6EF;
      font-family: 'Noto Serif Tamil', 'Source Serif 4', Georgia, serif;
      color: #000000;
    }
    .a4-page {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto 20px auto;
      background: #FFFFFF;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      box-sizing: border-box;
      padding: 10mm;
      break-after: page;
      page-break-after: always;
    }
    .booklet-box {
      border: 3px double #000000;
      position: relative;
      padding: 12px 14px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
    }
    .compact-box {
      min-height: 125mm;
    }
    .full-box {
      min-height: 265mm;
    }
    .page-number-tag {
      position: absolute;
      top: 6px;
      right: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      color: #000000;
      font-weight: 500;
    }
    .header-box {
      border: 1px solid #000000;
      text-align: center;
      padding: 6px 8px;
      margin-bottom: 4px;
    }
    .header-line-1 {
      font-size: 13.5px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0.3px;
    }
    .header-line-2 {
      font-size: 11.5px;
      font-weight: 600;
      color: #000000;
      margin: 1px 0;
    }
    .header-small {
      font-size: 9.5px;
      color: #222222;
      line-height: 1.25;
    }
    .header-phone {
      font-size: 9.5px;
      color: #222222;
      margin-top: 1px;
      font-family: monospace;
    }
    .credit-row {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 2px;
    }
    .software-credit {
      font-size: 9px;
      color: #444444;
    }
    .box-divider {
      border-top: 1px solid #000000;
      margin: 2px 0 6px 0;
    }
    .title-area {
      text-align: center;
      margin-bottom: 8px;
    }
    .title-janana {
      font-size: 17px;
      font-weight: 900;
      color: #7A1A22;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .invocation-text {
      font-size: 10px;
      color: #333333;
      margin-top: 2px;
      line-height: 1.35;
    }
    .cover-content {
      display: flex;
      gap: 16px;
      align-items: stretch;
      flex: 1;
    }
    .cover-image-slot {
      width: 44mm;
      min-height: 65mm;
      border: 1px dashed #888888;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FAF8F5;
      flex-shrink: 0;
      position: relative;
    }
    .uploaded-cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover-details-block {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 11px;
    }
    .detail-row {
      display: flex;
      margin-bottom: 2.5px;
      line-height: 1.3;
    }
    .det-label {
      width: 85px;
      flex-shrink: 0;
      font-weight: 600;
      color: #111111;
    }
    .det-colon {
      width: 14px;
      flex-shrink: 0;
      text-align: center;
    }
    .det-val {
      flex: 1;
      color: #000000;
    }
    .box-bottom-rule {
      border-top: 1px solid #000000;
      margin-top: 8px;
    }
    .bottom-dot {
      text-align: center;
      font-size: 8px;
      line-height: 8px;
      margin-top: 1px;
    }
    .page-centered-heading {
      text-align: center;
      margin-bottom: 6px;
    }
    .page-centered-heading h2 {
      font-size: 15px;
      font-weight: 800;
      color: #7A1A22;
      margin: 0;
    }
    .title-rule-sub {
      border-top: 1px solid #000000;
      margin-bottom: 8px;
    }
    .centered-illustration-slot {
      width: 55mm;
      height: 55mm;
      margin: 8px auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .verse-container {
      text-align: center;
      margin: 8px 0;
    }
    .verse-line {
      font-size: 12px;
      font-weight: 600;
      margin: 2px 0;
      line-height: 1.45;
    }
    .subham-text {
      font-size: 13px;
      font-weight: bold;
      color: #7A1A22;
      margin-top: 14px;
    }
    .stotram-container {
      text-align: center;
      margin: 8px 0;
    }
    .stotram-line {
      font-size: 12.5px;
      font-weight: 700;
      margin: 2px 0;
      line-height: 1.45;
      color: #111111;
    }
    .benefit-text {
      font-size: 10.5px;
      color: #444444;
      margin-top: 14px;
      line-height: 1.35;
    }
    .janana-content-split {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      flex: 1;
    }
    .janana-left-illustration {
      width: 42mm;
      height: 65mm;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .janana-details-table {
      flex: 1;
      font-size: 10.5px;
    }
    .janana-row {
      display: flex;
      margin-bottom: 2px;
      line-height: 1.35;
    }
    .j-lbl {
      width: 120px;
      flex-shrink: 0;
      font-weight: 600;
      color: #111111;
    }
    .j-col {
      width: 14px;
      flex-shrink: 0;
      text-align: center;
    }
    .j-val {
      flex: 1;
      color: #000000;
    }
    .nakshatra-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 12px;
      font-size: 10.5px;
    }
    .nak-field {
      display: flex;
      line-height: 1.3;
    }
    .n-lbl {
      width: 130px;
      flex-shrink: 0;
      font-weight: 600;
    }
    .n-col {
      width: 12px;
      flex-shrink: 0;
      text-align: center;
    }
    .n-val {
      flex: 1;
    }
    .charts-meta-header {
      font-size: 11px;
      margin-bottom: 6px;
      line-height: 1.35;
    }
    .cm-row {
      display: flex;
      justify-content: space-between;
    }
    .charts-duo-grid {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin: 6px 0;
    }
    .chart-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .charts-footer-details {
      font-size: 10px;
      color: #333333;
      margin-top: 6px;
      line-height: 1.35;
    }
    .cf-row {
      display: flex;
      justify-content: space-between;
    }
    .south-chart {
      width: 78mm;
      height: 78mm;
      border-collapse: collapse;
      border: 2px solid #000000;
      background: #FFFFFF;
      table-layout: fixed;
    }
    .mini-south-chart {
      width: 62mm;
      height: 62mm;
      border-collapse: collapse;
      border: 1.5px solid #000000;
      background: #FFFFFF;
      table-layout: fixed;
    }
    .chart-cell {
      border: 1px solid #000000;
      position: relative;
      vertical-align: middle;
      text-align: center;
      padding: 1px;
      width: 25%;
      height: 25%;
    }
    .sign-watermark {
      position: absolute;
      top: 1px;
      left: 2px;
      font-size: 7px;
      color: #AAAAAA;
      pointer-events: none;
    }
    .cell-planets {
      font-size: 9px;
      font-weight: bold;
      color: #000000;
      line-height: 1.15;
      white-space: pre-wrap;
    }
    .chart-center {
      position: relative;
      text-align: center;
      vertical-align: middle;
      border: 1px solid #000000;
      background: #FAF8F5;
    }
    .center-corner-decor {
      position: absolute;
      width: 12px;
      height: 12px;
      opacity: 0.5;
    }
    .center-corner-decor.tl { top: 2px; left: 2px; }
    .center-corner-decor.tr { top: 2px; right: 2px; transform: scaleX(-1); }
    .center-corner-decor.bl { bottom: 2px; left: 2px; transform: scaleY(-1); }
    .center-corner-decor.br { bottom: 2px; right: 2px; transform: scale(-1); }
    .center-title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 13px;
      font-weight: 800;
      color: #7A1A22;
      width: 100%;
    }
    .planet-positions-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #000000;
      font-size: 10px;
      text-align: center;
    }
    .planet-positions-table th {
      border: 1px solid #000000;
      padding: 3px 2px;
      background: #F4EAD4;
      font-weight: bold;
    }
    .planet-positions-table td {
      border: 1px solid #000000;
      padding: 2.5px 2px;
    }
    .planet-page-footer {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      margin-top: 6px;
      color: #222222;
    }
    .bhava-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size: 9.5px;
    }
    .bhava-table th {
      border: 1px solid #000000;
      background: #F4EAD4;
      padding: 2px;
      font-weight: bold;
      text-align: center;
    }
    .bhava-table td {
      border: 1px solid #000000;
      padding: 1.5px 2px;
    }
    .shadbala-section-title {
      font-size: 11.5px;
      font-weight: bold;
      color: #7A1A22;
      margin: 4px 0 2px 0;
    }
    .shadbala-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size: 9.5px;
      text-align: center;
    }
    .shadbala-table th {
      border: 1px solid #000000;
      background: #F4EAD4;
      padding: 2px 1px;
      font-weight: bold;
    }
    .shadbala-table td {
      border: 1px solid #000000;
      padding: 2px 1px;
    }
    .dasavarga-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size: 9.5px;
      text-align: center;
    }
    .dasavarga-table th {
      border: 1px solid #000000;
      background: #F4EAD4;
      padding: 2px;
      font-weight: bold;
    }
    .dasavarga-table td {
      border: 1px solid #000000;
      padding: 1.5px 1px;
    }
    .dasha-heading {
      text-align: center;
      font-size: 13.5px;
      font-weight: bold;
      color: #7A1A22;
      margin-bottom: 6px;
      padding-bottom: 3px;
      border-bottom: 1px solid #000000;
    }
    .dasha-bhukti-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size: 9.5px;
      text-align: center;
    }
    .dasha-bhukti-table th {
      border: 1px solid #000000;
      background: #F4EAD4;
      padding: 2px;
      font-weight: bold;
    }
    .dasha-bhukti-table td {
      border: 1px solid #000000;
      padding: 1.5px 2px;
    }
    .dasha-bottom-area {
      display: flex;
      gap: 12px;
      margin-top: 6px;
      align-items: flex-start;
      flex: 1;
    }
    .dasha-img-slot {
      width: 32mm;
      height: 40mm;
      border: 1px dashed #888888;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FAF8F5;
      flex-shrink: 0;
      position: relative;
    }
    .dasha-text-area {
      flex: 1;
      font-size: 10px;
      line-height: 1.4;
    }
    .dasha-desc {
      text-align: justify;
      margin: 0;
    }
    .parikaram-box {
      margin-top: 4px;
      font-size: 9.5px;
      background: #FAF8F5;
      border: 1px solid #E8DFD0;
      padding: 3px 5px;
      border-radius: 4px;
    }
    .sarva-matrix-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size: 9.5px;
      text-align: center;
    }
    .sarva-matrix-table th {
      border: 1px solid #000000;
      background: #F4EAD4;
      padding: 2px;
      font-weight: bold;
    }
    .sarva-matrix-table td {
      border: 1px solid #000000;
      padding: 2px;
    }
    .numerology-content {
      font-size: 11px;
      margin-top: 4px;
    }
    .num-row {
      display: flex;
      margin-bottom: 2.5px;
      line-height: 1.35;
    }
    .num-lbl {
      width: 160px;
      flex-shrink: 0;
      font-weight: 600;
    }
    .num-col {
      width: 14px;
      flex-shrink: 0;
      text-align: center;
    }
    .num-val {
      flex: 1;
    }
    .chaldean-alphabet-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size: 9px;
      text-align: center;
    }
    .chaldean-alphabet-table th {
      border: 1px solid #000000;
      background: #F4EAD4;
      padding: 2px 1px;
      font-weight: bold;
    }
    .chaldean-alphabet-table td {
      border: 1px solid #000000;
      padding: 2px 1px;
    }
    .subham-bottom {
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      color: #7A1A22;
      margin-top: 8px;
    }

    @media print {
      body {
        background: #FFFFFF !important;
        color: #000000 !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .a4-page {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        max-width: 190mm !important;
        width: 100% !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .booklet-box {
        margin: 0 auto !important;
        border: 2px double #000000 !important;
      }
    }
  `}</style>
);



/* ------------------------------------------------------------------------- */
/* 25-PAGE SPECIALIZED PAGE RENDERERS & ARTWORK                              */
/* ------------------------------------------------------------------------- */

export const RoosterBirdArt = () => (
  <svg viewBox="0 0 140 160" className="w-full h-full" style={{ maxHeight: '100%', objectFit: 'contain' }}>
    <g transform="translate(70, 85)">
      {/* Comb (Seval Kondai) */}
      <path d="M -8,-58 C -14,-70 -2,-70 2,-62 C 6,-72 16,-68 14,-58 C 20,-64 26,-58 20,-50 L 0,-48 Z" fill="#B22222" stroke="#7A1A22" strokeWidth="1.2" />
      {/* Head */}
      <path d="M -12,-48 C -16,-38 -6,-32 0,-32 C 10,-32 16,-40 12,-50 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
      {/* Eye & Beak */}
      <circle cx="-2" cy="-42" r="1.5" fill="#7A1A22" />
      <polygon points="-12,-44 -24,-38 -12,-34" fill="#D4AF37" stroke="#7A1A22" strokeWidth="1" />
      {/* Wattle (Thaadi) */}
      <path d="M -8,-32 C -12,-24 -2,-24 -4,-32 Z" fill="#B22222" stroke="#7A1A22" strokeWidth="1" />
      {/* Neck & Feathers */}
      <path d="M -10,-32 C -18,-15 -25,10 -15,35 C 5,45 25,35 22,-5 C 20,-20 12,-32 10,-32 Z" fill="#FAF6EF" stroke="#7A1A22" strokeWidth="1.8" />
      {/* Plumed Tail Feathers */}
      <path d="M 18,0 C 35,-25 60,-20 62,5 C 55,-10 35,-5 22,12" fill="none" stroke="#7A1A22" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 20,5 C 42,-15 65,-5 60,25 C 50,5 35,10 20,20" fill="none" stroke="#7A1A22" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 18,15 C 38,10 55,20 48,45 C 40,25 30,22 15,28" fill="none" stroke="#7A1A22" strokeWidth="2" strokeLinecap="round" />
      {/* Wing */}
      <path d="M -8,0 C -4,15 12,20 16,5 C 14,-10 0,-10 -8,0 Z" fill="#FFF8E7" stroke="#7A1A22" strokeWidth="1.5" />
      <line x1="-2" y1="2" x2="10" y2="12" stroke="#7A1A22" strokeWidth="1" />
      <line x1="-4" y1="6" x2="8" y2="16" stroke="#7A1A22" strokeWidth="1" />
      {/* Legs & Claws */}
      <line x1="-5" y1="38" x2="-8" y2="60" stroke="#7A1A22" strokeWidth="2" />
      <polyline points="-16,63 -8,60 -2,63" fill="none" stroke="#7A1A22" strokeWidth="1.8" />
      <line x1="8" y1="38" x2="5" y2="60" stroke="#7A1A22" strokeWidth="2" />
      <polyline points="-3,63 5,60 11,63" fill="none" stroke="#7A1A22" strokeWidth="1.8" />
    </g>
  </svg>
);

// Page 4: Janana Vivaram (Combined 2-column format matching Page 4 of 25-page PDF)
export const JananaVivaramPage25 = ({ pageNum, data = {}, isTa = true, onImageUpload, boxHeightMode = 'compact' }) => {
  const nak = data.nakData || {};
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{isTa ? 'ஜனன விவரம்' : 'BIRTH DETAILS'}</h2>
        </div>

        <div className="janana-content-split">
          <div className="janana-left-illustration">
            {data.img ? (
              <img src={data.img} alt="Zodiac Couple" className="uploaded-cover-img" />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <MithunamCoupleArt />
                <label className="image-placeholder-label no-print absolute bottom-1 bg-white/80 px-2 py-0.5 rounded text-[8px] cursor-pointer">
                  <Upload className="w-3 h-3 text-stone-500 inline mr-0.5" />
                  <span>{isTa ? 'படம் மாற்ற' : 'Change'}</span>
                  <input type="file" accept="image/*" onChange={(e) => onImageUpload && onImageUpload(e)} className="hidden" />
                </label>
              </div>
            )}
          </div>

          <div className="janana-details-table text-[10px]">
            <div className="janana-row"><span className="j-lbl">பெயர்</span><span className="j-col">:</span><span className="j-val font-bold text-sm text-[#7A1A22]">{data.name || ''}</span></div>
            {data.gender && <div className="janana-row -mt-1"><span className="j-lbl"></span><span className="j-col"></span><span className="j-val text-[10px] text-stone-500 font-semibold">{data.gender}</span></div>}
            <div className="janana-row"><span className="j-lbl">தேதி</span><span className="j-col">:</span><span className="j-val font-mono">{data.date || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">தமிழ் தேதி</span><span className="j-col">:</span><span className="j-val">{data.tamilDate || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">உதயாதி நாழிகை</span><span className="j-col">:</span><span className="j-val font-mono">{data.nazhigai || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">நாடு</span><span className="j-col">:</span><span className="j-val">{data.country || 'Karnataka,India'}</span></div>
            <div className="janana-row"><span className="j-lbl">இடம்</span><span className="j-col">:</span><span className="j-val">{data.place1 || data.place || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">அட்ச, தீர்க்க ரேகை</span><span className="j-col">:</span><span className="j-val font-mono">{data.coords || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">பொது நேரம், திருத்தம்</span><span className="j-col">:</span><span className="j-val font-mono">{data.tzcorr || '5:30 E , 0:00'}</span></div>
            <div className="janana-row"><span className="j-lbl">லக்னம்</span><span className="j-col">:</span><span className="j-val font-bold text-[#7A1A22]">{data.lagna || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">ராசி</span><span className="j-col">:</span><span className="j-val font-bold">{data.rasi || ''} ♊</span></div>
            <div className="janana-row"><span className="j-lbl">நட்சத்திரம்</span><span className="j-col">:</span><span className="j-val font-semibold">{data.nakshatra || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">ஜனன திதி</span><span className="j-col">:</span><span className="j-val">{data.tithi || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">யோகம்</span><span className="j-col">:</span><span className="j-val">{data.yogam || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">கரணம்</span><span className="j-col">:</span><span className="j-val">{data.karanam || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">அயனம்</span><span className="j-col">:</span><span className="j-val">{data.ayanam || 'தட்சிணாயனம்'}</span></div>
            <div className="janana-row"><span className="j-lbl">கணம்</span><span className="j-col">:</span><span className="j-val">மானுஷ</span></div>
            <div className="janana-row"><span className="j-lbl">யோனி</span><span className="j-col">:</span><span className="j-val">ஆண் நாய்</span></div>
            <div className="janana-row"><span className="j-lbl">நாடி</span><span className="j-col">:</span><span className="j-val">பார்சுவ</span></div>

            <div className="my-1.5 border-t border-dotted border-stone-300" />

            <div className="janana-row"><span className="j-lbl">ஜனன நட்சத்திரம்</span><span className="j-col">:</span><span className="j-val font-bold text-[#7A1A22]">{nak.nakshatra || data.nakshatra || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">நட்சத்திர ஆரம்ப நேரம்</span><span className="j-col">:</span><span className="j-val font-mono">{nak.nakStart || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">நட்சத்திர முடிவு நேரம்</span><span className="j-col">:</span><span className="j-val font-mono">{nak.nakEnd || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">ஆதியந்த பரம நாழிகை</span><span className="j-col">:</span><span className="j-val font-mono">{nak.aadiyanta || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">கர்ப்பசெல் நாழிகை</span><span className="j-col">:</span><span className="j-val font-mono">{nak.garbha || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">நின்ற இருப்பு நாழிகை</span><span className="j-col">:</span><span className="j-val font-mono">{nak.iruppu || ''}</span></div>
            <div className="janana-row bg-amber-50/60 p-0.5 rounded"><span className="j-lbl font-bold text-[#7A1A22]">திசை இருப்பு</span><span className="j-col">:</span><span className="j-val font-bold text-[#7A1A22]">{nak.dashaBal || ''}</span></div>
            <div className="janana-row"><span className="j-lbl">திதி சூன்ய ராசி</span><span className="j-col">:</span><span className="j-val">{nak.soonyam || 'மிதுனம் கன்னி'}</span></div>
            <div className="janana-row"><span className="j-lbl">யோகி</span><span className="j-col">:</span><span className="j-val font-semibold">{nak.yogi || 'புதன்'}</span></div>
            <div className="janana-row"><span className="j-lbl">அவயோகி</span><span className="j-col">:</span><span className="j-val font-semibold">{nak.avayogi || 'செவ்வாய்'}</span></div>
            <div className="janana-row"><span className="j-lbl">நட்சத்திர ஹோரை</span><span className="j-col">:</span><span className="j-val font-mono">{nak.hora || '13 : 09 : 36'}</span></div>
            <div className="janana-row"><span className="j-lbl">அயனாம்சம்</span><span className="j-col">:</span><span className="j-val font-mono">{nak.ayanamsha || '-24:14:02 Lahiri'}</span></div>
            <div className="janana-row"><span className="j-lbl">சுதேச நேரத்திருத்தம்</span><span className="j-col">:</span><span className="j-val font-mono">{nak.lmt || '-0:19:44'}</span></div>
            <div className="janana-row"><span className="j-lbl">லக்ன சுபர்</span><span className="j-col">:</span><span className="j-val text-emerald-800">{nak.subhar || 'சூரியன்,செவ்வாய்'}</span></div>
            <div className="janana-row"><span className="j-lbl">லக்ன பாபர்</span><span className="j-col">:</span><span className="j-val text-rose-800">{nak.pabar || 'சுக்கிரன்'}</span></div>
            <div className="janana-row"><span className="j-lbl">வைநாசிக நட்சத்திரம்</span><span className="j-col">:</span><span className="j-val">{nak.vainasika || 'ரேவதி'}</span></div>
            <div className="janana-row"><span className="j-lbl">சூரிய உதயம்</span><span className="j-col">:</span><span className="j-val font-mono">{nak.sunrise || ''} (பிம்ப மத்தி)</span></div>
            <div className="janana-row"><span className="j-lbl">சூரிய அஸ்தமனம்</span><span className="j-col">:</span><span className="j-val font-mono">{nak.sunset || ''} (பிம்ப மத்தி)</span></div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 5: Planet Table + Rasi/Navamsa Charts (Combined matching Page 5 of 25-page PDF)
export const PlanetTableRasiNavamsaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const meta = data.meta || {};
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'துல்லியமான நிராயன கிரக நிலைகள்'}</h2>
        </div>

        <table className="planet-positions-table">
          <thead>
            <tr>
              <th>கிரகம்</th>
              <th>பாகை-கலை</th>
              <th>நட்சத்திரம்</th>
              <th>பாதம்</th>
              <th>நட்-அதிபதி</th>
              <th>ராசி</th>
              <th>பாகை-கலை</th>
              <th>நிலை</th>
            </tr>
          </thead>
          <tbody>
            {(data.rows || []).map((r, idx) => (
              <tr key={idx}>
                <td className="font-bold text-left pl-2">{r.graha}</td>
                <td className="font-mono text-center">{r.deg1}</td>
                <td className="text-center">{r.nak}</td>
                <td className="font-mono text-center font-bold">{r.pada}</td>
                <td className="text-center">{r.lord}</td>
                <td className="text-center font-semibold">{r.rasi}</td>
                <td className="font-mono text-center font-bold text-[#7A1A22]">{r.deg2}</td>
                <td className="text-center font-bold text-[10px]">{r.status || '---'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Side-by-side Rasi & Navamsa Charts */}
        <div className="charts-duo-grid my-2">
          <div className="chart-wrapper">
            {renderSouthChart('ராசி', data.rasiChart || [], false, isTa)}
          </div>
          <div className="chart-wrapper">
            {renderSouthChart('நவாம்சம்', data.navamsaChart || [], false, isTa)}
          </div>
        </div>

        {/* Info Block below charts */}
        <div className="grid grid-cols-2 gap-4 text-[10px] pt-1 text-stone-800">
          <div className="space-y-0.5">
            <div><span className="font-bold">பெயர் :</span> {meta.name || ''}</div>
            <div><span className="font-bold">தேதி :</span> {meta.date || ''}</div>
            <div><span className="font-bold">நேரம் :</span> {meta.time || ''}</div>
            <div><span className="font-bold">இடம் :</span> {meta.place || ''} {meta.coords ? `(${meta.coords})` : ''}</div>
            <div><span className="font-bold">தமிழ் தேதி :</span> {meta.tamilDate || ''}</div>
          </div>
          <div className="space-y-0.5">
            <div><span className="font-bold">லக்னம் :</span> <span className="font-bold text-[#7A1A22]">{meta.lagna || ''}</span></div>
            <div><span className="font-bold">ராசி :</span> <span className="font-bold">{meta.rasi || ''}</span></div>
            <div><span className="font-bold">நட்சத்திரம் :</span> {meta.nakshatra || ''}</div>
            <div><span className="font-bold">பக்ஷம் & திதி :</span> {meta.pakshaTithi || ''}</div>
            <div><span className="font-bold">யோகம்-கரணம் :</span> {meta.yogaKaranam || 'சிவம்-தைதுலை'}</div>
            <div><span className="font-bold text-[#7A1A22]">திசை இருப்பு :</span> <span className="font-semibold">{meta.dashaBal || ''}</span></div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 6: Dasavarga Table A & B + 3 Charts & Sripati Bhavas (matching Page 6 of 25-page PDF)
export const DasavargaWithChartsPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்'}</h2>
        </div>

        {/* Table A: Dignities */}
        <table className="dasavarga-table">
          <thead>
            <tr>
              <th className="w-[18%]">வர்க்கம்</th>
              {(data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது', 'லக்']).map((g, i) => (
                <th key={i}>{g}</th>
              ))}
              <th className="bg-emerald-50 text-emerald-800">சுப</th>
              <th className="bg-rose-50 text-rose-800">அசுப</th>
            </tr>
          </thead>
          <tbody>
            {(data.tableA || []).map((row, rIdx) => {
              const isTot = rIdx >= 10;
              return (
                <tr key={rIdx} className={isTot ? 'font-bold bg-stone-100' : ''}>
                  <td className="font-bold text-left pl-1">{row.varga}</td>
                  {(row.planets || row.cells || []).map((val, pIdx) => (
                    <td key={pIdx}>{val}</td>
                  ))}
                  <td className="font-bold text-emerald-800">{row.subha}</td>
                  <td className="font-bold text-rose-800">{row.asubha}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table B: Sign Placements */}
        <table className="dasavarga-table my-1">
          <tbody>
            {(data.tableB || []).map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="font-bold text-left pl-1 w-[18%]">{row.varga}</td>
                {(row.planets || row.cells || []).map((val, pIdx) => (
                  <td key={pIdx}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3 South Indian Charts in a single row */}
        <div className="grid grid-cols-3 gap-2 my-1">
          <div className="flex justify-center">{renderSouthChart('ராசி', data.rasiChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart('நவாம்சம்', data.navamsaChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart('ஸ்ரீபதி-பாவகம்', data.sripatiChart || [], true, isTa)}</div>
        </div>

        <div className="text-[10px] text-stone-800 font-semibold my-1 px-1">
          {data.bhavaChange ? `ஜாதகத்தில் பாவக மாற்றம் : ${data.bhavaChange}` : 'ஜாதகத்தில் பாவக மாற்றம் : சுக்கிரன்-10, ராகு-2, கேது-8'}
        </div>

        {/* Side-by-side: Left 9 grahas longitudes, Right 12 Bhavas */}
        <div className="grid grid-cols-5 gap-3 mt-0.5 text-[9.5px]">
          <div className="col-span-2">
            <div className="font-bold text-center mb-0.5 text-[#7A1A22]">{data.personName || 'Sample'} பாவ ஸ்புடம் (ஸ்ரீபதி முறை)</div>
            <table className="w-full border-collapse border border-black text-center">
              <thead>
                <tr className="bg-stone-100 font-bold border-b border-black">
                  <th className="border border-black p-0.5 text-left pl-1">கிரகம்</th>
                  <th className="border border-black p-0.5">பாகை</th>
                </tr>
              </thead>
              <tbody>
                {(data.grahasSphutam || []).map((g, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-0.5 text-left pl-1 font-bold">{g.graha}</td>
                    <td className="border border-black p-0.5 font-mono">{g.deg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-3">
            <table className="bhava-table">
              <thead>
                <tr>
                  <th>பாவ</th>
                  <th>ஆரம்பம்</th>
                  <th>மத்தி</th>
                  <th>முடிவு</th>
                </tr>
              </thead>
              <tbody>
                {(data.bhavas || []).map((b, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-center">{b.bhava}</td>
                    <td className="font-mono text-center">{fmtBhavaDeg(b.start)}</td>
                    <td className="font-mono text-center font-bold text-[#7A1A22]">{fmtBhavaDeg(b.madhya)}</td>
                    <td className="font-mono text-center">{fmtBhavaDeg(b.end)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 7: Divisional Charts 1 (D3, D7, D60, D30 with 4-line Tamil explanatory paragraphs)
export const DivisionalChartsPage1 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="grid grid-cols-2 gap-4 my-1">
          {/* D3 Drekkana */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('3-திரேக்காணம்', data.d3 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              திரேக்காண சக்கரமானது ஜாதகரின் மூன்றாமிடத்து செயல்களான மன உறுதி, செயல் ஈடுபாடு, சகோதர, சகோதரிகள், நட்பு மற்றும் கூட்டுத்தன்மை ஆகியவற்றை உறுதிபடுத்துகிறது.
            </p>
          </div>

          {/* D7 Saptamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('7-சப்தாம்சம்', data.d7 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              சப்தாம்ச சக்கரமானது ஜாதகரின் திறமை, ஆக்கபூர்வமான சிந்தனைகள், சுய முயற்சியில் உருவாக்கும் திறன், மற்றும் குழந்தைகள் அல்லது பேரக்குழந்தைகளின் உறவு ஆகியவற்றை உறுதிபடுத்துகிறது.
            </p>
          </div>

          {/* D60 Shashtiamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('60-சஷ்டியாம்சம்', data.d60 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              சஷ்டியாம்ச சக்கரம் ஒருவரின் வாழ்க்கைப் பலன்களை துல்லியமாக வரையறுத்துக் கூறவும், இரட்டை குழந்தைகளின் வேறுபாடான பலன்களை காணவும் உதவுகிறது. சில சமயங்களில் உறுதியான முடிவுகளை எடுக்கவும் உதவி செய்கிறது.
            </p>
          </div>

          {/* D30 Trimsamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('30-திரிம்சாம்சம்', data.d30 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              திரிம்சாம்ச சக்கரம் ஜாதகருக்கு ஏற்படும் திடீர் மருத்துவசெலவுகள், மறைமுக செலவுகள், எதிர்பார்ப்புகள் நிறைவேறும் நிலை ஆகியவற்றை உறுதிபடுத்துகிறது.
            </p>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 8: Divisional Charts 2 (D10, D16, D4, D12 with 4-line Tamil explanatory paragraphs)
export const DivisionalChartsPage2 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="grid grid-cols-2 gap-4 my-1">
          {/* D10 Dasamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('10-தசாம்சம்', data.d10 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              தசாம்ச சக்கரம் ஜாதகரின் தொழில் நிலை, ஊதியம், வளர்ச்சி, திறமை, உழைப்பு, சாதனை, ஈடுபாடு ஆகியவற்றை உறுதிபடுத்துகிறது. சூரியன், புதன், குரு மற்றும் பத்தாம் வீட்டின் நிலை முக்கியமானதாகும்.
            </p>
          </div>

          {/* D16 Shodasamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('16-ஷோடசாம்சம்', data.d16 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              ஷோடசாம்ச சக்கரமானது ஜாதகரின் லட்சியங்களையும், மன உறுதியான செயல்பாடுகளையும், வீடு- நிலம்- வாகன வசதி ஆகியவற்றை மேலும் வரையறுத்து கூறவும் உதவுகிறது.
            </p>
          </div>

          {/* D4 Chaturtamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('4-சதுராம்சம்', data.d4 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              சதுராம்ச சக்கரம் ஜாதகரின் வளமை, பதவி, குடும்பத்தினரின் மகிழ்ச்சி நிலை, மனஉற்சாகம் ஆகியவற்றை உறுதிபடுத்துகிறது. சந்திரன், புதன் மற்றும் நான்காம் பாவாதிபன் நிலைகள் முக்கியமானவையாகும்.
            </p>
          </div>

          {/* D12 Dwadasamsa */}
          <div>
            <div className="flex justify-center mb-1">{renderSouthChart('12-துவாதசாம்சம்', data.d12 || [], true, isTa)}</div>
            <p className="text-[9px] leading-relaxed text-justify px-1 text-stone-800">
              துவாதசாம்ச சக்கரம் ஜாதகரின் பரம்பரை வழி ஆதரவுகள், பூர்வ புண்ணியம், பெற்றோரின் ஆதரவு ஆகியவற்றை உறுதிபடுத்துகிறது.
            </p>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 9: Shadbala & Pancha Pakshi (matching Page 9 of 25-page PDF)
export const ShadbalaPanchaPakshiPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>{data.heading || 'ஜாதகத்தில் ஷட்பலம் ஆய்வு'}</h2>
        </div>

        <div className="shadbala-section-title">கிரக கணிதம்</div>
        <table className="shadbala-table">
          <thead>
            <tr>
              {(data.grahaHeaders || ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி']).map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.grahaRows || []).map((row, rIdx) => {
              const isTot = row.label === 'மொத்தம்';
              return (
                <tr key={rIdx} className={isTot ? 'font-bold bg-amber-50/50' : ''}>
                  <td className="font-bold text-left pl-1">{row.label}</td>
                  {(row.vals || []).map((v, vIdx) => (
                    <td key={vIdx} className="font-mono">{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="shadbala-section-title mt-1.5">பாவக கணிதம்</div>
        <table className="shadbala-table">
          <thead>
            <tr>
              <th>பாவகம்</th>
              {(data.bhavaHeaders || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((b) => (
                <th key={b}>{b}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data.bhavaRows || []).map((row, rIdx) => {
              const isTot = row.label === 'மொத்தம்';
              return (
                <tr key={rIdx} className={isTot ? 'font-bold bg-amber-50/50' : ''}>
                  <td className="font-bold text-left pl-1">{row.label}</td>
                  {(row.vals || []).map((v, vIdx) => (
                    <td key={vIdx} className="font-mono">{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pancha Pakshi Section */}
        <div className="mt-2 pt-1 border-t border-stone-300">
          <div className="font-bold text-xs text-[#7A1A22] mb-1">பஞ்ச பட்சி விவரம்.</div>
          <div className="flex gap-3 items-start">
            <div className="w-[32mm] h-[38mm] border border-stone-200 p-1 flex items-center justify-center bg-[#FAF8F5] shrink-0">
              <RoosterBirdArt />
            </div>
            <div className="text-[9px] leading-relaxed text-justify space-y-1 text-stone-800">
              <p>
                தமிழ் சித்தர்களால் ஆக்கப்பெற்ற 'ஐம்புள் நூல்' என கூறப்படும் பஞ்சபட்சி சாஸ்திரம் உலகம் தழுவிய எல்லாவற்றையும் அதாவது ஒலி, ஒளி, இடம், பொருள், காலம், எண், வலிமை, நிறம், உடை, ஊண், இன்னபிற உலக நடப்புகள் என அனைத்து முக்கியத்துவத்தையும் குறிப்பாக ஐந்து பட்சிகளாக வகைப்படுத்தியுள்ளனர்.
              </p>
              <p>
                வல்லூறு, ஆந்தை, கோழி, மயில், காகம் என ஐவகை பட்சிகள் குறிக்கப்படுகின்றன. வளர்பிறை, தேய்பிறை ஆகிய இரண்டு பட்சங்களிலும் நட்சத்திரங்களுக்கான பட்சிகள் வேறுபடும்.
              </p>
              <p className="font-semibold text-stone-900">
                தேய்பிறையில் பிறந்துள்ள ஜாதகரின் நட்சத்திரத்திற்கான பட்சி <b>கோழி</b> ஆகும். இதற்கு நட்பு நிலையில் உள்ள பட்சிகள் <b>ஆந்தை, மயில்</b> ஆகும். படுபட்சி நாள் வளர்பிறையில் <b>புதன்</b> மற்றும் தேய்பிறையில் <b>வெள்ளி, புதன்</b> ஆகிய நாட்களும் ஆகும்.
              </p>
            </div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 10: Upagrahas & Special Lagnas (matching Page 10 of 25-page PDF)
export const UpagrahasSpecialLagnasPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="font-bold text-xs text-[#7A1A22] mb-0.5">உபகிரகங்கள் - குளிகாதி ஐவர் விவரங்கள்.</div>
        <p className="text-[8.5px] leading-tight text-justify mb-1 text-stone-600">
          ஒவ்வொரு கிரகத்திற்கும் உபகிரகங்கள் உண்டு. ஒரு தினத்தின் ஜனன அடிப்படையில் பகல் அல்லது இரவு அகஸ் காலத்தை எட்டு பிரிவுகளாக்கி ஒவ்வொரு பிரிவும் ஒரு உபகிரகத்திற்கான காலமாக கணிக்கப்படுகின்றது.
        </p>

        {/* Table 1: Gulikadi Five */}
        <table className="w-full border-collapse border border-black text-[8.5px] text-center mb-1.5">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th rowSpan={2} className="border border-black p-0.5">உப கிரகம்</th>
              <th rowSpan={2} className="border border-black p-0.5">அதிபதி</th>
              <th colSpan={2} className="border border-black p-0.5">காலத்தின்</th>
              <th colSpan={4} className="border border-black p-0.5">பராசரர் முறை</th>
              <th colSpan={4} className="border border-black p-0.5">காளிதாசர் முறை</th>
            </tr>
            <tr className="bg-amber-50 font-bold border-b border-black">
              <th className="border border-black p-0.5">ஆரம்பம்</th>
              <th className="border border-black p-0.5">முடிவு</th>
              <th className="border border-black p-0.5">ராசி</th>
              <th className="border border-black p-0.5">பாகை</th>
              <th className="border border-black p-0.5">நட்</th>
              <th className="border border-black p-0.5">பா</th>
              <th className="border border-black p-0.5">ராசி</th>
              <th className="border border-black p-0.5">பாகை</th>
              <th className="border border-black p-0.5">நட்</th>
              <th className="border border-black p-0.5">பா</th>
            </tr>
          </thead>
          <tbody>
            {(data.table1 || [
              { name: 'காலன்', lord: 'சூரி', s: '9:9:47', e: '10:36:33', pR: 'விரு', pD: '22:22:31', pN: 'கேட்', pP: '2', kR: 'தனு', kD: '12:15:11', kN: 'மூல', kP: '4' },
              { name: 'மிருத்யு', lord: 'செவ்', s: '12:3:18', e: '13:30:4', pR: 'மக', pD: '3:12:41', pN: 'உரா', pP: '2', kR: 'மக', kD: '26:08:54', kN: 'அவி', kP: '1' },
              { name: 'அர்த்தப்பிரஹரன்', lord: 'புத', s: '13:30:4', e: '14:56:50', pR: 'மக', pD: '26:08:54', pN: 'அவி', pP: '1', kR: 'கும்', kD: '21:17:27', kN: 'பூர', kP: '1' },
              { name: 'யமகண்டன்', lord: 'குரு', s: '14:56:50', e: '16:23:36', pR: 'கும்', pD: '21:17:27', pN: 'பூர', pP: '1', kR: 'மீன', kD: '17:31:36', kN: 'ரேவ', kP: '1' },
              { name: 'குளிகன்', lord: 'சனி', s: '7:43:1', e: '9:9:47', pR: 'விரு', pD: '2:38:30', pN: 'விசா', pP: '4', kR: 'விரு', kD: '22:22:31', kN: 'கேட்', kP: '2' }
            ]).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.name}</td>
                <td className="border border-black p-0.5">{r.lord}</td>
                <td className="border border-black p-0.5 font-mono">{r.s}</td>
                <td className="border border-black p-0.5 font-mono">{r.e}</td>
                <td className="border border-black p-0.5">{r.pR}</td>
                <td className="border border-black p-0.5 font-mono">{r.pD}</td>
                <td className="border border-black p-0.5">{r.pN}</td>
                <td className="border border-black p-0.5 font-mono">{r.pP}</td>
                <td className="border border-black p-0.5">{r.kR}</td>
                <td className="border border-black p-0.5 font-mono">{r.kD}</td>
                <td className="border border-black p-0.5">{r.kN}</td>
                <td className="border border-black p-0.5 font-mono">{r.kP}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table 2: Dhumadi Five */}
        <div className="font-bold text-[10px] text-[#7A1A22] mb-0.5">உபகிரகங்கள் - தூமாதி ஐவர் ஸ்புடங்கள்.</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-2">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5">உப கிரகம்</th>
              <th className="border border-black p-0.5">அதிபதி</th>
              <th className="border border-black p-0.5">ராசி</th>
              <th className="border border-black p-0.5">பாகை-கலை</th>
              <th className="border border-black p-0.5">நட்சத்திரம்</th>
              <th className="border border-black p-0.5">பாதம்</th>
            </tr>
          </thead>
          <tbody>
            {(data.table2 || [
              { name: 'தூமன்', lord: 'செவ்வாய்', rasi: 'கும்பம்', deg: '25:54:08', nak: 'பூரட்டாதி', pada: '2' },
              { name: 'வியதீபாதன்', lord: 'ராகு', rasi: 'ரிஷபம்', deg: '4:05:52', nak: 'கிருத்திகை', pada: '3' },
              { name: 'பரிவேடன்', lord: 'சந்திரன்', rasi: 'விருச்சிகம்', deg: '4:05:52', nak: 'அனுஷம்', pada: '1' },
              { name: 'இந்திரதனுஸ்', lord: 'சுக்கிரன்', rasi: 'சிம்மம்', deg: '25:54:08', nak: 'பூரம்', pada: '4' },
              { name: 'உபகேது', lord: 'கேது', rasi: 'கன்னி', deg: '12:34:08', nak: 'அஸ்தம்', pada: '1' }
            ]).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.name}</td>
                <td className="border border-black p-0.5">{r.lord}</td>
                <td className="border border-black p-0.5">{r.rasi}</td>
                <td className="border border-black p-0.5 font-mono">{r.deg}</td>
                <td className="border border-black p-0.5">{r.nak}</td>
                <td className="border border-black p-0.5 font-mono">{r.pada}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Section: Left Upagraha Chart, Right Special Lagnas */}
        <div className="font-bold text-[10px] text-[#7A1A22] mb-1">உபகிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்.</div>
        <div className="flex gap-4 items-start">
          <div className="w-[58mm] shrink-0">
            {renderSouthChart('உபகிரகம்', data.upagrahaChart || [], true, isTa)}
          </div>
          <div className="flex-1 text-[9.5px] space-y-0.5">
            <div className="flex"><span className="w-36 font-semibold">ஓரா லக்னம் :</span><span className="font-mono">மீனம் 2:00:38</span></div>
            <div className="flex"><span className="w-36 font-semibold">ஆருட லக்னம் :</span><span>கும்பம்</span></div>
            <div className="flex"><span className="w-36 font-semibold">கடிகா லக்னம் :</span><span className="font-mono">துலாம் 1:10:23</span></div>
            <div className="flex"><span className="w-36 font-semibold">இந்து லக்னம் :</span><span className="font-mono">தனுசு 7:46:17</span></div>
            <div className="flex"><span className="w-36 font-semibold">பாவ லக்னம் :</span><span className="font-mono">தனுசு 22:17:23</span></div>
            <div className="flex"><span className="w-36 font-semibold">ஸ்ரீ லக்னம் :</span><span className="font-mono">மகரம் 16:26:37</span></div>
            <div className="flex"><span className="w-36 font-semibold">யோகி பாகை :</span><span className="font-mono">மீனம் 23:40:25</span></div>
            <div className="flex"><span className="w-36 font-semibold">அவயோகி பாகை :</span><span className="font-mono">துலாம் 0:20:25</span></div>
            <div className="flex"><span className="w-36 font-semibold">மாற்று யோகி :</span><span>குரு</span></div>
            <div className="flex"><span className="w-36 font-semibold">22-ம் திரேக்காணம் :</span><span>கடகம்</span></div>
            <div className="flex"><span className="w-36 font-semibold">64-ம் நவாம்சம் :</span><span>மீனம்</span></div>
            <div className="flex"><span className="w-36 font-semibold">சர்ப்ப திரேக்காணம் :</span><span>செவ்வாய்,குரு</span></div>
            <div className="flex"><span className="w-36 font-semibold">பீஜ ஸ்புடம் :</span><span className="font-mono">135:22:30</span></div>
            <div className="flex"><span className="w-36 font-semibold">அதிர்ஷ்டப்பாகை :</span><span className="font-mono">சிம்மம் 11:49:12</span></div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 11: Relationships and Avasthas (matching Page 11 of 25-page PDF)
export const RelationshipsAvasthasPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const gHeaders = data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="font-bold text-[10px] text-[#7A1A22] mb-0.5">நைசர்கிக (நிலையான) நட்பு விவரங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-1.5">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1">கிரகன்</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-0.5">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.naisargika || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.graha}</td>
                {(r.vals || []).map((v, j) => <td key={j} className="border border-black p-0.5">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="font-bold text-[10px] text-[#7A1A22] mb-0.5">தற்கால நட்பு விவரங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-1">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1">கிரகன்</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-0.5">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.tatkalika || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.graha}</td>
                {(r.vals || []).map((v, j) => <td key={j} className="border border-black p-0.5">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[8.5px] italic text-stone-700 mb-1.5">
          ஒரு கிரகமிருக்கும் ராசியிலிருந்து 2, 3, 4, 10, 11, 12 ஆம் இடத்திலிருக்கின்ற கிரகம் தற்கால நட்பாகும். மற்ற ராசிகளிலிருக்கின்ற கிரகம் தற்கால பகையாகும்.
        </p>

        <div className="font-bold text-[10px] text-[#7A1A22] mb-0.5">கிரகங்களின் சத்ரு - மித்ரு நிலைகள் (பஞ்சதா மைத்ரி)</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-2">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1">கிரகன்</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-0.5">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.panchadha || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.graha}</td>
                {(r.vals || []).map((v, j) => <td key={j} className="border border-black p-0.5">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="font-bold text-[10px] text-[#7A1A22] mb-0.5">கிரகங்களின் அவஸ்தா - மண்டலம் - தசா சமய நிலைகள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1">கிரகம்</th>
              <th className="border border-black p-0.5">ராசி</th>
              <th className="border border-black p-0.5">பாகை</th>
              <th className="border border-black p-0.5">அவஸ்தா நிலை</th>
              <th className="border border-black p-0.5">தசா மண்டலம்</th>
              <th className="border border-black p-0.5">தசா சமயம்</th>
            </tr>
          </thead>
          <tbody>
            {(data.avasthas || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.graha}</td>
                <td className="border border-black p-0.5">{r.rasi}</td>
                <td className="border border-black p-0.5 font-mono">{r.deg}</td>
                <td className="border border-black p-0.5">{r.avastha}</td>
                <td className="border border-black p-0.5">{r.mandalam}</td>
                <td className="border border-black p-0.5">{r.samayam}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 12: Aspect Angles (matching Page 12 of 25-page PDF)
export const AspectAnglesPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const gHeaders = data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="font-bold text-xs text-[#7A1A22] mb-1">கிரகங்களுக்கான பார்வை கோணங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-1">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1">கிரகம்</th>
              <th className="border border-black p-0.5">பாகை</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-0.5">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.grahaMatrix || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.graha}</td>
                <td className="border border-black p-0.5 font-mono">{r.deg}</td>
                {(r.vals || []).map((v, j) => (
                  <td key={j} className={`border border-black p-0.5 font-mono ${v.isGood ? 'underline font-bold text-[#7A1A22]' : ''}`}>
                    {v.deg}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[8.5px] italic text-stone-700 mb-2">
          மேற்கண்ட அளவீடுகள் யாவும் பாகைகளில் உள்ளது. அடிக்கோடிட்டவை யாவும் நன்மை தரும் பார்வைகளாகும்.
        </p>

        <div className="font-bold text-xs text-[#7A1A22] mb-1">பாவக-கிரகங்களுக்கிடையே பார்வை கோணங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5">பாவம்</th>
              <th className="border border-black p-0.5">மத்திம பாகை</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-0.5">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.bhavaMatrix || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold">{r.bhava}</td>
                <td className="border border-black p-0.5 font-mono">{r.madhya}</td>
                {(r.vals || []).map((v, j) => (
                  <td key={j} className={`border border-black p-0.5 font-mono ${v.isGood ? 'underline font-bold text-[#7A1A22]' : ''}`}>
                    {v.deg}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Pages 13, 14, 15: Compact Mahadashas (3 complete Mahadasha tables on 1 page!)
export const CompactDashaPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const dashas = data.dashas || [];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="space-y-3">
          {dashas.map((d, dIdx) => {
            const rows = d?.rows || d?.bhuktis || [];
            return (
              <div key={dIdx}>
                <div className="font-bold text-[11px] text-[#7A1A22] mb-0.5">
                  {d?.heading || `${d?.dashaLord || ''} திசையில் நடைபெறும் புக்திகளுக்கான விவரங்கள்`}
                </div>
                <table className="w-full border-collapse border border-black text-[8.5px] text-center">
                  <thead>
                    <tr className="bg-amber-100/70 font-bold border-b border-black">
                      <th rowSpan={2} className="border border-black p-0.5 text-left pl-1">புக்தி</th>
                      <th colSpan={2} className="border border-black p-0.5">ஸ்தானம்</th>
                      <th rowSpan={2} className="border border-black p-0.5">நிலை</th>
                      <th rowSpan={2} className="border border-black p-0.5">காலம்<br />வரு-மா-நா</th>
                      <th rowSpan={2} className="border border-black p-0.5">ஆரம்பம்<br />தேதி</th>
                      <th rowSpan={2} className="border border-black p-0.5">முடிவு<br />தேதி</th>
                      <th rowSpan={2} className="border border-black p-0.5">வயது<br />வரு-மா-நா</th>
                      <th rowSpan={2} className="border border-black p-0.5">பலன்கள்</th>
                    </tr>
                    <tr className="bg-amber-50 font-bold border-b border-black">
                      <th className="border border-black p-0.5">லக்</th>
                      <th className="border border-black p-0.5">தசா</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((b, bIdx) => (
                      <tr key={bIdx}>
                        <td className="border border-black p-0.5 font-bold text-left pl-1">{b.bhukti}</td>
                        <td className="border border-black p-0.5 font-mono">{b.sthanamLag || b.sthanaLagna}</td>
                        <td className="border border-black p-0.5 font-mono">{b.sthanamDasha || b.sthanaDasha}</td>
                        <td className="border border-black p-0.5">{b.status}</td>
                        <td className="border border-black p-0.5 font-mono">{b.duration || b.period}</td>
                        <td className="border border-black p-0.5 font-mono">{b.startDate}</td>
                        <td className="border border-black p-0.5 font-mono font-bold text-[#7A1A22]">{b.endDate}</td>
                        <td className="border border-black p-0.5 font-mono">{b.ageAtEnd || b.age}</td>
                        <td className="border border-black p-0.5 text-center font-bold text-amber-800">{b.remarks || b.phalan || '**'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 16: Pasakar / Tara Balam / Sevvai Dosha (matching Page 16 of 25-page PDF)
export const PasakarTaraSevvaiPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const dosha = data.sevvaiDosha || {};
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="font-bold text-[10.5px] text-[#7A1A22] mb-0.5">கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-1">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1">கிரகங்கள்</th>
              <th className="border border-black p-0.5">பாசகர்</th>
              <th className="border border-black p-0.5">போதகர்</th>
              <th className="border border-black p-0.5">காரகர்</th>
              <th className="border border-black p-0.5">வேதகர்</th>
            </tr>
          </thead>
          <tbody>
            {(data.pasakarRows || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-bold text-left pl-1">{r.graha}</td>
                <td className="border border-black p-0.5">{r.pasakar}</td>
                <td className="border border-black p-0.5">{r.pothakar}</td>
                <td className="border border-black p-0.5">{r.karakar}</td>
                <td className="border border-black p-0.5">{r.vedhakar}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[8.5px] text-stone-700 mb-2">
          காரகர் நிதானமாக, குறைந்த பலனைத் தருவர். வேதகர் தடுத்து விடுவார். போதகர் நிறைவாகத் தருவர். பாசகர் சீக்கிர பலனைத் தருவர்.
        </p>

        <div className="font-bold text-[10.5px] text-[#7A1A22] mb-0.5">தாரா பலமுள்ள நட்சத்திரங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-1">
          <tbody>
            {(data.taraRows || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-semibold">{r.star1}</td>
                <td className="border border-black p-0.5 font-semibold">{r.star2}</td>
                <td className="border border-black p-0.5 font-semibold">{r.star3}</td>
                <td className={`border border-black p-0.5 font-bold ${r.quality === 'உத்தமம்' ? 'text-emerald-800' : 'text-rose-800'}`}>{r.quality}</td>
                <td className="border border-black p-0.5 font-bold text-[#7A1A22]">{r.tara}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[8.5px] text-stone-700 mb-2">
          உத்தம வரிசையிலுள்ள நட்சத்திர நாட்களில் அனைத்து விதமான சுப காரியங்களும் செய்யலாம்.
        </p>

        {/* Sevvai Dosha Section */}
        <div className="border-t border-stone-300 pt-1 text-[9px] leading-relaxed text-justify space-y-1 text-stone-800">
          <div className="font-bold text-[10.5px] text-[#7A1A22]">செவ்வாய் தோஷ ஆய்வு</div>
          <p>
            ஜாதகத்தில் செவ்வாய் தோஷம் திருமண காலத்தில் முக்கியத்துவமாகிறது. லக்னம், சந்திரன், சுக்கிரன் ஆகியவற்றின் நிலையிலிருந்து செவ்வாய் இருக்கும் நிலையினை பொருத்து செவ்வாய் தோஷத்தினை நிர்ணயம் செய்தல் வேண்டும். லக்னம், இரண்டு, நான்கு, ஏழு, எட்டு மற்றும் பன்னிரெண்டாம் இடத்தில் உள்ள செவ்வாய் கிரகத்தினால் செவ்வாய் தோஷம் உண்டு என அநேக நூல்கள் கூறுகின்றன.
          </p>
          <div className="bg-amber-50/60 p-1 rounded space-y-0.5 font-semibold">
            <div>• {dosha.fromLagna}</div>
            <div>• {dosha.fromMoon}</div>
            <div>• {dosha.fromVenus}</div>
          </div>
          <div className="pt-0.5">
            <span className="font-bold text-[#7A1A22]">செவ்வாய் தோஷ ஆய்வின் முடிவு: </span>
            <span>{dosha.conclusion}</span>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Pages 17, 18, 19, 20: Antara Ending Dates (2 Mahadashas per page matching Pages 17-20 of 25-page PDF)
export const AntaraDatesPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const dashas = data.dashas || [];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="space-y-3">
          {dashas.map((d, dIdx) => (
            <div key={dIdx}>
              <div className="font-bold text-xs text-[#7A1A22] mb-1">
                {d?.dashaLord} திசையில் புக்தி மற்றும் அந்தரம் முடிவு விவரம். 365.25.
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(d?.bhuktis || []).map((b, bIdx) => (
                  <div key={bIdx} className="border border-black p-1 text-[8px] bg-[#FAF8F5]">
                    <div className="font-bold border-b border-black pb-0.5 mb-0.5 text-[#7A1A22] flex justify-between">
                      <span>புக்தி: {b.bhuktiLord}</span>
                      <span>அந்தரம் முடிவு</span>
                    </div>
                    <div className="space-y-0.5 font-mono">
                      {(b.antaras || []).map((a, aIdx) => (
                        <div key={aIdx} className="flex justify-between">
                          <span className="font-sans font-semibold">{a.lord}</span>
                          <span>{a.endDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Pages 21, 22, 23, 24: BAV Ashtakavarga Pairs (matching Pages 21-24 of 25-page PDF)
export const BavPairPage = ({ pageNum, topData = {}, bottomData = {}, isSaturnSav = false, isTa = true, boxHeightMode = 'compact' }) => {
  const signs = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];

  const renderSingleBav = (bav) => {
    if (!bav || !bav.grahaKey) return null;
    const gName = { sun: 'சூரியன்', moon: 'சந்திரன்', mars: 'செவ்வாய்', mercury: 'புதன்', jupiter: 'குரு', venus: 'சுக்கிரன்', saturn: 'சனி' }[bav.grahaKey] || bav.grahaKey;

    return (
      <div>
        <div className="font-bold text-xs text-[#7A1A22] mb-0.5">{gName} அஷ்டவர்க்கச் சோதனை.</div>
        <table className="w-full border-collapse border border-black text-[8px] text-center mb-1">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-0.5 text-left pl-1 w-[14%]">பங்களிப்பாளர்</th>
              {signs.map((s, i) => <th key={i} className="border border-black p-0.5">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {(bav.matrix || []).map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-0.5 font-semibold text-left pl-1">{r.label}</td>
                {(r.vals || []).map((v, j) => <td key={j} className="border border-black p-0.5 font-mono">{v}</td>)}
              </tr>
            ))}
            <tr className="font-bold bg-amber-50">
              <td className="border border-black p-0.5 text-left pl-1">மொத்தம்</td>
              {(bav.totals || []).map((t, j) => <td key={j} className="border border-black p-0.5 font-mono text-[#7A1A22]">{t}</td>)}
            </tr>
          </tbody>
        </table>

        {/* 3 Shodhana Charts side-by-side */}
        <div className="grid grid-cols-3 gap-2 my-1">
          <div className="flex justify-center">{renderSouthChart(`${gName} பின்னாஷ்டகம்`, bav.bavChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart(`${gName} திரிகோணம்`, bav.trikonaChart || [], true, isTa)}</div>
          <div className="flex justify-center">{renderSouthChart(`${gName} ஏகாதிபத்யம்`, bav.ekadhipatyaChart || [], true, isTa)}</div>
        </div>

        {/* Pinda Metrics */}
        <div className="grid grid-cols-2 gap-4 text-[9px] px-1 font-semibold text-stone-800">
          <div className="flex justify-between"><span>கிரக குணாகாரம் :</span><span className="font-mono font-bold">{bav.gunakara}</span></div>
          <div className="flex justify-between"><span>ராசி பிண்டம் :</span><span className="font-mono font-bold">{bav.rasiPinda}</span></div>
          <div className="flex justify-between"><span>கிரகப்பிண்டம் :</span><span className="font-mono font-bold">{bav.grahaPinda}</span></div>
          <div className="flex justify-between"><span>சோத்திய பிண்டம் :</span><span className="font-mono font-bold text-[#7A1A22]">{bav.shodhyaPinda}</span></div>
        </div>
      </div>
    );
  };

  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="space-y-2">
          {renderSingleBav(topData)}

          <div className="border-t border-black my-1" />

          {isSaturnSav ? (
            /* Sarvashtavarga 337 Table on bottom of Page 24 */
            <div>
              <div className="font-bold text-xs text-[#7A1A22] mb-0.5">சர்வாஷ்டவர்க்க பரல்கள் விவரம்..</div>
              <table className="w-full border-collapse border border-black text-[8px] text-center mb-1">
                <thead>
                  <tr className="bg-amber-100/70 font-bold border-b border-black">
                    <th className="border border-black p-0.5 text-left pl-1 w-[14%]">கிரகம்</th>
                    {signs.map((s, i) => <th key={i} className="border border-black p-0.5">{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(bottomData?.matrix || []).map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="border border-black p-0.5 font-semibold text-left pl-1">{bottomData.grahas?.[rIdx] || `G${rIdx+1}`}</td>
                      {(row.points || row).map((pt, pIdx) => <td key={pIdx} className="border border-black p-0.5 font-mono">{pt}</td>)}
                    </tr>
                  ))}
                  {bottomData?.totals && (
                    <tr className="font-bold bg-amber-50">
                      <td className="border border-black p-0.5 text-left pl-1">மொத்தம்</td>
                      {((bottomData && bottomData.totals) || []).map((t, tIdx) => <td key={tIdx} className="border border-black p-0.5 font-mono text-[#7A1A22]">{t}</td>)}
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex gap-4 items-center justify-between px-2 text-[9px] font-semibold">
                <div className="w-[50mm] shrink-0">
                  {renderSouthChart('பரல்கள் 337', bottomData?.chartCells || [], true, isTa)}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <div className="flex justify-between"><span>கேந்திரம் :</span><span className="font-mono font-bold">{bottomData?.kendram || 107}</span></div>
                    <div className="flex justify-between"><span>பணபரம் :</span><span className="font-mono font-bold">{bottomData?.panaparam || 108}</span></div>
                    <div className="flex justify-between"><span>ஆபோக்லீயம் :</span><span className="font-mono font-bold">{bottomData?.apoklimam || 122}</span></div>
                    <div className="flex justify-between"><span>உபசெயம் :</span><span className="font-mono font-bold">{bottomData?.upachayam || 113}</span></div>
                    <div className="flex justify-between"><span>திரிகோணம் :</span><span className="font-mono font-bold">{bottomData?.trikonam || 93}</span></div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between"><span>கிழக்கு :</span><span className="font-mono font-bold">{bottomData?.east || 93}</span></div>
                    <div className="flex justify-between"><span>மேற்கு :</span><span className="font-mono font-bold">{bottomData?.west || 80}</span></div>
                    <div className="flex justify-between"><span>தெற்கு :</span><span className="font-mono font-bold">{bottomData?.south || 83}</span></div>
                    <div className="flex justify-between"><span>வடக்கு :</span><span className="font-mono font-bold">{bottomData?.north || 81}</span></div>
                    <div className="flex justify-between text-emerald-800"><span>வரவினம் :</span><span className="font-mono font-bold">{bottomData?.varavinam || 88}</span></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderSingleBav(bottomData)
          )}
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};


/* ------------------------------------------------------------------------- */
/* 33-PAGE SPECIALIZED PAGE RENDERERS                                        */
/* ------------------------------------------------------------------------- */

export const Divisional2ChartPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const left = data.leftChart || {};
  const right = data.rightChart || {};
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="grid grid-cols-2 gap-6 items-start h-full pt-2">
          {/* Left Chart */}
          <div className="flex flex-col items-center">
            <div className="w-[72mm] max-w-full">
              {renderSouthChart(left.name || '', left.cells || [], true, isTa)}
            </div>
            {left.desc && (
              <p className="text-[9.5px] leading-relaxed text-stone-800 text-justify mt-3 px-2 font-medium">
                {left.desc}
              </p>
            )}
          </div>

          {/* Right Chart */}
          <div className="flex flex-col items-center">
            <div className="w-[72mm] max-w-full">
              {renderSouthChart(right.name || '', right.cells || [], true, isTa)}
            </div>
            {right.desc && (
              <p className="text-[9.5px] leading-relaxed text-stone-800 text-justify mt-3 px-2 font-medium">
                {right.desc}
              </p>
            )}
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

export const HoraChartPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'} flex flex-col justify-between`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-[100mm] max-w-full shadow-xs">
            {renderSouthChart('ஓரை', data.horaChart || [], true, isTa)}
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

export const PlanetaryDignitiesAspectsPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const dignities = data.dignitiesTable || [];
  const aspects = data.aspectsTable || [];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        {/* Section 1: Dignities */}
        <div className="mb-4">
          <div className="font-bold text-xs text-[#7A1A22] border-b border-black pb-0.5 mb-1.5">
            ஜாதகத்தில் கிரகங்களின் நிலை.
          </div>
          <table className="w-full border-collapse border border-black text-[9.5px]">
            <thead>
              <tr className="bg-amber-100/70 border-b border-black">
                <th className="border border-black p-1 text-left w-[35%] font-bold">விபரம்</th>
                <th className="border border-black p-1 text-left font-bold">கிரகம்</th>
              </tr>
            </thead>
            <tbody>
              {dignities.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-amber-50/40' : ''}>
                  <td className="border border-black p-1 font-semibold text-stone-800">{row.label}</td>
                  <td className="border border-black p-1 font-bold text-[#7A1A22]">{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Aspects & Conjunctions */}
        <div>
          <div className="font-bold text-xs text-[#7A1A22] border-b border-black pb-0.5 mb-1.5">
            கிரகங்களின் பார்வை, சேர்க்கை நிலை
          </div>
          <table className="w-full border-collapse border border-black text-[9.5px] text-center">
            <thead>
              <tr className="bg-amber-100/70 border-b border-black font-bold">
                <th className="border border-black p-1 text-left w-[18%]">கிரகம்</th>
                <th className="border border-black p-1 w-[12%]">ராசி</th>
                <th className="border border-black p-1 w-[14%]">நிலை</th>
                <th className="border border-black p-1 text-left pl-2">பார்க்கும் கிரகங்கள்</th>
                <th className="border border-black p-1 text-left pl-2">சேர்க்கையுள்ள கிரகங்கள்</th>
              </tr>
            </thead>
            <tbody>
              {aspects.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-amber-50/40' : ''}>
                  <td className="border border-black p-1 text-left font-bold">{row.graha}</td>
                  <td className="border border-black p-1 font-semibold">{row.rasi}</td>
                  <td className="border border-black p-1 font-bold text-[#7A1A22]">{row.status}</td>
                  <td className="border border-black p-1 text-left pl-2 font-mono">{row.aspectsBy}</td>
                  <td className="border border-black p-1 text-left pl-2 font-mono">{row.conjunctions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

export const FullDashaAntaraPage = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const dasha = data.dasha || {};
  const bhuktis = dasha.bhuktis || [];
  const col1 = bhuktis.slice(0, 3);
  const col2 = bhuktis.slice(3, 6);
  const col3 = bhuktis.slice(6, 9);

  const renderBhuktiTable = (b, bIdx) => {
    if (!b) return null;
    return (
      <div key={bIdx} className="mb-2">
        <table className="w-full border-collapse border border-black text-[8px] text-center">
          <thead>
            <tr className="bg-amber-100/70 border-b border-black font-bold">
              <th className="border border-black p-0.5 w-[25%] text-left pl-1">புக்தி</th>
              <th className="border border-black p-0.5 w-[25%] text-left pl-1">அந்தரம்</th>
              <th className="border border-black p-0.5 text-center">முடிவு</th>
            </tr>
          </thead>
          <tbody>
            {(b.antaras || []).map((a, aIdx) => (
              <tr key={aIdx} className={aIdx % 2 === 1 ? 'bg-amber-50/40' : ''}>
                <td className="border border-black p-0.5 text-left pl-1 font-bold text-[7.5px] truncate">
                  {aIdx === 0 ? b.bhuktiLord : ''}
                </td>
                <td className="border border-black p-0.5 text-left pl-1 font-semibold text-[7.5px]">
                  {a.lord}
                </td>
                <td className="border border-black p-0.5 font-mono font-bold text-[#7A1A22] text-[8px]">
                  {a.endDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'} flex flex-col justify-between`}>
        <div className="page-number-tag">{pageNum}</div>

        <div>
          <div className="font-bold text-[11px] text-[#7A1A22] border-b border-black pb-0.5 mb-2">
            {data.nativeName || 'Sample'} ஜாதகத்தில் {dasha.dashaLord || ''} திசையில் புக்தி மற்றும் அந்தரம் முடிவு விபரம்.
          </div>

          <div className="grid grid-cols-3 gap-2 items-start">
            <div>{col1.map((b, idx) => renderBhuktiTable(b, idx))}</div>
            <div>{col2.map((b, idx) => renderBhuktiTable(b, idx + 3))}</div>
            <div>{col3.map((b, idx) => renderBhuktiTable(b, idx + 6))}</div>
          </div>
        </div>

        <div className="border-t border-black pt-1 mt-1 text-[8px] text-center font-semibold text-stone-700">
          தேதிகள் யாவும் வருடத்திற்கு 365.25 நாட்கள் என கிரகங்களின் அந்தரம் முடிவு தேதிகள் ஆகும்.
        </div>
      </div>
    </div>
  );
};

export const BavSingleFullPage = ({ pageNum, bav = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const signs = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துல', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];
  const gName = {
    sun: 'சூரியன்', moon: 'சந்திரன்', mars: 'செவ்வாய்', mercury: 'புதன்',
    jupiter: 'குரு', venus: 'சுக்கிரன்', saturn: 'சனி'
  }[bav?.grahaKey] || 'கிரகம்';

  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'} flex flex-col justify-between`}>
        <div className="page-number-tag">{pageNum}</div>

        <div>
          <div className="font-bold text-xs text-[#7A1A22] border-b border-black pb-0.5 mb-1.5">
            {gName} அஷ்டவர்க்கச் சோதனை.
          </div>

          {/* 8x12 BAV Matrix Table */}
          <table className="w-full border-collapse border border-black text-[8.5px] text-center mb-3">
            <thead>
              <tr className="bg-amber-100/70 font-bold border-b border-black">
                <th className="border border-black p-1 text-left pl-1.5 w-[14%]">பங்களிப்பாளர்</th>
                {signs.map((s, i) => (
                  <th key={i} className="border border-black p-1">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(bav.matrix || []).map((r, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-amber-50/40' : ''}>
                  <td className="border border-black p-1 font-semibold text-left pl-1.5">{r.label}</td>
                  {(r.vals || []).map((v, j) => (
                    <td key={j} className="border border-black p-1 font-mono">{v}</td>
                  ))}
                </tr>
              ))}
              <tr className="font-bold bg-amber-100/80 border-t-2 border-black">
                <td className="border border-black p-1 text-left pl-1.5">மொத்தம்</td>
                {(bav.totals || []).map((t, j) => (
                  <td key={j} className="border border-black p-1 font-mono text-[#7A1A22] font-bold">{t}</td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* 3 Shodhana Charts side-by-side */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="flex justify-center">
              {renderSouthChart(`${gName} பின்னாஷ்டகம்`, bav.bavChart || [], true, isTa)}
            </div>
            <div className="flex justify-center">
              {renderSouthChart(`${gName} திரிகோணம்`, bav.trikonaChart || [], true, isTa)}
            </div>
            <div className="flex justify-center">
              {renderSouthChart(`${gName} ஏகாதிபத்யம்`, bav.ekadhipatyaChart || [], true, isTa)}
            </div>
          </div>
        </div>

        {/* Bottom Pinda Metrics */}
        <div className="border-t border-black pt-2 pb-1 px-4 text-[10px] font-semibold text-stone-900 grid grid-cols-2 gap-x-8 gap-y-1">
          <div className="flex justify-between border-b border-dotted border-stone-300 pb-0.5">
            <span>கிரக குணாகாரம் :</span>
            <span className="font-mono font-bold">{bav.gunakara || 5}</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-stone-300 pb-0.5">
            <span>ராசி பிண்டம் :</span>
            <span className="font-mono font-bold">{bav.rasiPinda || 0}</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-stone-300 pb-0.5">
            <span>கிரகப்பிண்டம் :</span>
            <span className="font-mono font-bold">{bav.grahaPinda || 0}</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-stone-300 pb-0.5">
            <span>சோத்திய பிண்டம் :</span>
            <span className="font-mono font-bold text-[#7A1A22] text-[11px]">{bav.shodhyaPinda || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// DEDICATED 51-PAGE BOOKLET INDIVIDUAL PAGES
// -------------------------------------------------------------

// Page 14 (51-page): Upagrahas Tables (Gulikadi & Dhumadi)
export const UpagrahasTablePage14 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>உபகிரகங்கள் - குளிகாதி ஐவர் விவரங்கள்</h2>
        </div>
        <div className="title-rule-sub mb-2" />

        <p className="text-[9.5px] leading-relaxed text-justify mb-3 text-stone-700">
          ஒவ்வொரு கிரகத்திற்கும் உபகிரகங்கள் உண்டு. ஒரு தினத்தின் ஜனன அடிப்படையில் பகல் அல்லது இரவு அகஸ் காலத்தை எட்டு பிரிவுகளாக்கி ஒவ்வொரு பிரிவும் ஒரு உபகிரகத்திற்கான காலமாக கணிக்கப்படுகின்றது. உபகிரகத்தின் ஆரம்ப காலம் அல்லது முடிவு காலத்தை உதய நேரமாகக்கொண்டு உபகிரக ஸ்புடங்கள் கணிக்கப்பட்டு இங்கே தரப்பட்டுள்ளன.
        </p>

        {/* Table 1: Gulikadi Five */}
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-4">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th rowSpan={2} className="border border-black p-1">உப கிரகம்</th>
              <th rowSpan={2} className="border border-black p-1">அதிபதி</th>
              <th colSpan={2} className="border border-black p-1">காலத்தின்</th>
              <th colSpan={4} className="border border-black p-1">பராசரர் முறை</th>
              <th colSpan={4} className="border border-black p-1">காளிதாசர் முறை</th>
            </tr>
            <tr className="bg-amber-50 font-bold border-b border-black">
              <th className="border border-black p-0.5">ஆரம்பம்</th>
              <th className="border border-black p-0.5">முடிவு</th>
              <th className="border border-black p-0.5">ராசி</th>
              <th className="border border-black p-0.5">பாகை</th>
              <th className="border border-black p-0.5">நட்</th>
              <th className="border border-black p-0.5">பா</th>
              <th className="border border-black p-0.5">ராசி</th>
              <th className="border border-black p-0.5">பாகை</th>
              <th className="border border-black p-0.5">நட்</th>
              <th className="border border-black p-0.5">பா</th>
            </tr>
          </thead>
          <tbody>
            {(data.table1 || [
              { name: 'காலன்', lord: 'சூரி', s: '9:9:47', e: '10:36:33', pR: 'விரு', pD: '22:22:31', pN: 'கேட்', pP: '2', kR: 'தனு', kD: '12:15:11', kN: 'மூல', kP: '4' },
              { name: 'மிருத்யு', lord: 'செவ்', s: '12:3:18', e: '13:30:4', pR: 'மக', pD: '3:12:41', pN: 'உரா', pP: '2', kR: 'மக', kD: '26:08:54', kN: 'அவி', kP: '1' },
              { name: 'அர்த்தப்பிரஹரன்', lord: 'புத', s: '13:30:4', e: '14:56:50', pR: 'மக', pD: '26:08:54', pN: 'அவி', pP: '1', kR: 'கும்', kD: '21:17:27', kN: 'பூர', kP: '1' },
              { name: 'யமகண்டன்', lord: 'குரு', s: '14:56:50', e: '16:23:36', pR: 'கும்', pD: '21:17:27', pN: 'பூர', pP: '1', kR: 'மீன', kD: '17:31:36', kN: 'ரேவ', kP: '1' },
              { name: 'குளிகன்', lord: 'சனி', s: '7:43:1', e: '9:9:47', pR: 'விரு', pD: '2:38:30', pN: 'விசா', pP: '4', kR: 'விரு', kD: '22:22:31', kN: 'கேட்', kP: '2' }
            ]).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.name}</td>
                <td className="border border-black p-1">{r.lord}</td>
                <td className="border border-black p-1 font-mono">{r.s}</td>
                <td className="border border-black p-1 font-mono">{r.e}</td>
                <td className="border border-black p-1 font-semibold">{r.pR}</td>
                <td className="border border-black p-1 font-mono">{r.pD}</td>
                <td className="border border-black p-1">{r.pN}</td>
                <td className="border border-black p-1 font-mono">{r.pP}</td>
                <td className="border border-black p-1 font-semibold">{r.kR}</td>
                <td className="border border-black p-1 font-mono">{r.kD}</td>
                <td className="border border-black p-1">{r.kN}</td>
                <td className="border border-black p-1 font-mono">{r.kP}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table 2: Dhumadi Five */}
        <div className="font-bold text-xs text-[#7A1A22] mb-1">உபகிரகங்கள் - தூமாதி ஐவர் ஸ்புடங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-4">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-left pl-2">உப கிரகம்</th>
              <th className="border border-black p-1">அதிபதி</th>
              <th className="border border-black p-1">ராசி</th>
              <th className="border border-black p-1">பாகை-கலை</th>
              <th className="border border-black p-1">நட்சத்திரம்</th>
              <th className="border border-black p-1">பாதம்</th>
            </tr>
          </thead>
          <tbody>
            {(data.table2 || [
              { name: 'தூமன்', lord: 'செவ்வாய்', rasi: 'கும்பம்', deg: '25:54:08', nak: 'பூரட்டாதி', pada: '2' },
              { name: 'வியதீபாதன்', lord: 'ராகு', rasi: 'ரிஷபம்', deg: '4:05:52', nak: 'கிருத்திகை', pada: '3' },
              { name: 'பரிவேடன்', lord: 'சந்திரன்', rasi: 'விருச்சிகம்', deg: '4:05:52', nak: 'அனுஷம்', pada: '1' },
              { name: 'இந்திரதனுஸ்', lord: 'சுக்கிரன்', rasi: 'சிம்மம்', deg: '25:54:08', nak: 'பூரம்', pada: '4' },
              { name: 'உபகேது', lord: 'கேது', rasi: 'கன்னி', deg: '12:34:08', nak: 'அஸ்தம்', pada: '1' }
            ]).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.name}</td>
                <td className="border border-black p-1">{r.lord}</td>
                <td className="border border-black p-1 font-semibold">{r.rasi}</td>
                <td className="border border-black p-1 font-mono">{r.deg}</td>
                <td className="border border-black p-1">{r.nak}</td>
                <td className="border border-black p-1 font-mono">{r.pada}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 15 (51-page): Special Lagnas & Upagraha Chart
export const SpecialLagnasPage15 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்</h2>
        </div>
        <div className="title-rule-sub mb-3" />

        <div className="flex gap-6 items-start mt-2">
          {/* Left: Upagraha Chart */}
          <div className="w-[82mm] shrink-0">
            <div className="text-center font-bold text-xs text-[#7A1A22] mb-1">உபகிரக சக்கரம்</div>
            {renderSouthChart('உபகிரகம்', data.upagrahaChart || [], false, isTa)}
          </div>

          {/* Right: Special Lagnas list */}
          <div className="flex-1 bg-amber-50/30 border border-stone-300 rounded p-3 text-[10px] space-y-1.5 leading-relaxed">
            <div className="text-center font-bold text-[#7A1A22] text-xs border-b border-stone-300 pb-1 mb-2">முக்கிய லக்ன & ஸ்புட விபரங்கள்</div>
            {(data.specialLagnas || [
              { label: 'ஓரா லக்னம்', val: 'மீனம் 2:00:38' },
              { label: 'ஆருட லக்னம்', val: 'கும்பம்' },
              { label: 'கடிகா லக்னம்', val: 'துலாம் 1:10:23' },
              { label: 'இந்து லக்னம்', val: 'தனுசு 7:46:17' },
              { label: 'பாவ லக்னம்', val: 'தனுசு 22:17:23' },
              { label: 'ஸ்ரீ லக்னம்', val: 'மகரம் 16:26:37' },
              { label: 'யோகி பாகை', val: 'மீனம் 23:40:25' },
              { label: 'அவயோகி பாகை', val: 'துலாம் 0:20:25' },
              { label: 'மாற்று யோகி', val: 'குரு' },
              { label: '22-ம் திரேக்காணம்', val: 'கடகம்' },
              { label: '64-ம் நவாம்சம்', val: 'மீனம்' },
              { label: 'சர்ப்ப திரேக்காணம்', val: 'செவ்வாய்,குரு' },
              { label: 'பீஜ ஸ்புடம்', val: '135:22:30' },
              { label: 'அதிர்ஷ்டப்பாகை', val: 'சிம்மம் 11:49:12' }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between border-b border-dotted border-stone-200 pb-0.5">
                <span className="font-semibold text-stone-800">{item.label || item.name} :</span>
                <span className="font-mono font-bold text-[#7A1A22]">{item.val || item.value || (item.rasi ? `${item.rasi} ${item.deg || ''}` : item.deg)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 16 (51-page): Naisargika & Tatkalika Friendship Tables
export const RelationshipsPage16 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const gHeaders = data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>நைசர்கிக (நிலையான) நட்பு விவரங்கள்</h2>
        </div>
        <div className="title-rule-sub mb-2" />

        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-4">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-left pl-2">கிரகன்</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-1">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.naisargika || []).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.graha}</td>
                {(r.vals || []).map((v, j) => <td key={j} className="border border-black p-1 font-medium">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="page-centered-heading mt-4">
          <h2>தற்கால நட்பு விவரங்கள்</h2>
        </div>
        <div className="title-rule-sub mb-2" />

        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-3">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-left pl-2">கிரகன்</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-1">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.tatkalika || []).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.graha}</td>
                {(r.vals || []).map((v, j) => <td key={j} className="border border-black p-1 font-medium">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[9.5px] italic text-stone-700 bg-amber-50/50 p-2 border border-stone-200 rounded mt-3 leading-relaxed">
          <b>தற்கால நட்பு விதி:</b> ஒரு கிரகமிருக்கும் ராசியிலிருந்து 2, 3, 4, 10, 11, 12 ஆம் இடத்திலிருக்கின்ற கிரகம் தற்கால நட்பாகும். மற்ற ராசிகளிலிருக்கின்ற கிரகம் (1, 5, 6, 7, 8, 9) தற்கால பகையாகும்.
        </p>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 17 (51-page): Panchadha Maitri & Planetary Avasthas, Mandalam
export const PanchadhaAvasthasPage17 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const gHeaders = data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>கிரகங்களின் சத்துரு - மித்துரு நிலைகள் (பஞ்சதா மைத்ரி)</h2>
        </div>
        <div className="title-rule-sub mb-2" />

        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-3">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-left pl-2">கிரகன்</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-1">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.panchadha || []).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.graha}</td>
                {r.vals.map((v, j) => {
                  const isAdhiM = v === 'அதிமித்ரு';
                  const isAdhiS = v === 'அதிசத்ரு';
                  return (
                    <td key={j} className={`border border-black p-1 font-medium ${isAdhiM ? 'text-emerald-800 font-bold' : isAdhiS ? 'text-rose-800 font-bold' : ''}`}>
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Avasthas & Mandalam Details */}
        <div className="font-bold text-xs text-[#7A1A22] mt-3 mb-1">கிரக அவஸ்தைகள் & மண்டல விபரங்கள்</div>
        <table className="w-full border-collapse border border-black text-[9px] text-center mb-2">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-left pl-2">கிரகம்</th>
              <th className="border border-black p-1">பாலாதி அவஸ்தை</th>
              <th className="border border-black p-1">தீப்தாதி அவஸ்தை</th>
              <th className="border border-black p-1">மண்டலம்</th>
              <th className="border border-black p-1">தசா சமயம்</th>
            </tr>
          </thead>
          <tbody>
            {(data.avasthas || [
              { graha: 'சூரியன்', baladi: 'யுவ அவஸ்தை', deeptadi: 'தீன அவஸ்தை', mandalam: 'அக்னி', dasha: 'மத்திமம்' },
              { graha: 'சந்திரன்', baladi: 'குமார அவஸ்தை', deeptadi: 'முதித அவஸ்தை', mandalam: 'ஜலம்', dasha: 'சுபம்' },
              { graha: 'செவ்வாய்', baladi: 'விருத்த அவஸ்தை', deeptadi: 'தீன அவஸ்தை', mandalam: 'அக்னி', dasha: 'அசுபம்' },
              { graha: 'புதன்', baladi: 'பால அவஸ்தை', deeptadi: 'முதித அவஸ்தை', mandalam: 'பூமி', dasha: 'சுபம்' },
              { graha: 'குரு', baladi: 'விருத்த அவஸ்தை', deeptadi: 'தீப்த அவஸ்தை', mandalam: 'ஆகாயம்', dasha: 'உத்தமம்' },
              { graha: 'சுக்கிரன்', baladi: 'குமார அவஸ்தை', deeptadi: 'ஸ்வஸ்த அவஸ்தை', mandalam: 'ஜலம்', dasha: 'உத்தமம்' },
              { graha: 'சனி', baladi: 'மிருத அவஸ்தை', deeptadi: 'சாந்த அவஸ்தை', mandalam: 'வாயு', dasha: 'சுபம்' }
            ]).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.graha}</td>
                <td className="border border-black p-1">{r.baladi || r.avastha}</td>
                <td className="border border-black p-1 font-semibold">{r.deeptadi || r.status}</td>
                <td className="border border-black p-1">{r.mandalam}</td>
                <td className="border border-black p-1 font-bold text-[#7A1A22]">{r.dasha || r.samayam}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 18 (51-page): Inter-planetary 9x9 Aspect Angles Matrix
export const AspectAnglesMatrixPage18 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const gHeaders = data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>கிரகங்களுக்கிடையேயான பார்வை கோணங்கள்</h2>
        </div>
        <div className="title-rule-sub mb-3" />

        <table className="w-full border-collapse border border-black text-[10px] text-center mb-3">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1.5 text-left pl-2">கிரகம்</th>
              <th className="border border-black p-1.5">பாகை</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-1.5">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.grahaMatrix || []).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.graha}</td>
                <td className="border border-black p-1 font-mono">{r.deg}</td>
                {(r.vals || []).map((v, j) => (
                  <td key={j} className={`border border-black p-1 font-mono ${v.isGood ? 'underline font-bold text-[#7A1A22] bg-amber-50' : ''}`}>
                    {v.deg}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[10px] italic text-stone-700 bg-amber-50/50 p-2 border border-stone-200 rounded mt-3 leading-relaxed">
          <b>குறிப்பு:</b> மேற்கண்ட அளவீடுகள் யாவும் பாகைகளில் உள்ளது. அடிக்கோடிட்டவை யாவும் நன்மை தரும் பார்வை கோணங்களாகும் (Sextile 60°, Trine 120°).
        </p>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 19 (51-page): Bhava-to-Planet 12x9 Aspect Angles Matrix
export const BhavaAspectAnglesMatrixPage19 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const gHeaders = data.grahaHeaders || ['சூரி', 'சந்', 'செவ்', 'புத', 'குரு', 'சுக்', 'சனி', 'ராகு', 'கேது'];
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>பாவக - கிரகங்களுக்கிடையே பார்வை கோணங்கள்</h2>
        </div>
        <div className="title-rule-sub mb-3" />

        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-3">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-center">பாவம்</th>
              <th className="border border-black p-1">மத்திம பாகை</th>
              {gHeaders.map((h, i) => <th key={i} className="border border-black p-1">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {(data.bhavaMatrix || []).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-center">{r.bhava}</td>
                <td className="border border-black p-1 font-mono">{r.madhya}</td>
                {(r.vals || []).map((v, j) => (
                  <td key={j} className={`border border-black p-1 font-mono ${v.isGood ? 'underline font-bold text-[#7A1A22] bg-amber-50' : ''}`}>
                    {v.deg}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[10px] italic text-stone-700 bg-amber-50/50 p-2 border border-stone-200 rounded mt-3 leading-relaxed">
          <b>விளக்கம்:</b> ஒவ்வொரு பாவகத்தின் மத்திம பாகைக்கும் கிரகங்களுக்கும் இடைப்பட்ட கோண இடைவெளி பாகை வடிவில் தரப்பட்டுள்ளது. அடிக்கோடிட்டவை பாவக விருத்தி தரும் பார்வை கோணங்களாகும்.
        </p>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 21 (51-page): Pancha Pakshi Shastra Full Page
export const PanchaPakshiPage21 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>பஞ்ச பட்சி விவரம் & ஆளும் தன்மைகள்</h2>
        </div>
        <div className="title-rule-sub mb-3" />

        <div className="flex gap-4 items-start mb-4">
          <div className="w-[45mm] h-[48mm] border border-stone-300 p-2 flex items-center justify-center bg-[#FAF8F5] shrink-0 rounded">
            <RoosterBirdArt />
          </div>
          <div className="text-[10px] leading-relaxed text-justify space-y-2 text-stone-800">
            <p>
              தமிழ் சித்தர்களால் ஆக்கப்பெற்ற 'ஐம்புள் நூல்' என கூறப்படும் பஞ்சபட்சி சாஸ்திரம் உலகம் தழுவிய எல்லாவற்றையும் அதாவது ஒலி, ஒளி, இடம், பொருள், காலம், எண், வலிமை, நிறம், உடை, ஊண், இன்னபிற உலக நடப்புகள் என அனைத்து முக்கியத்துவத்தையும் குறிப்பாக ஐந்து பட்சிகளாக வகைப்படுத்தியுள்ளனர்.
            </p>
            <p>
              மேலும், நட்சத்திர பட்சியினை அறிந்து கொள்வதும், அதன் செயல் திறன் நிலைகளை அறிந்து செயல்படுவதும் அனைத்து விதமான சுப மற்றும் காரிய வெற்றிகளுக்கு உகந்ததாகும். வல்லூறு, ஆந்தை, காகம், கோழி, மயில் என ஐவகை பட்சிகள் வகைப்படுத்தப்பட்டுள்ளன.
            </p>
          </div>
        </div>

        <div className="bg-amber-50/60 border border-stone-300 rounded p-3 text-[10px] space-y-2 mb-3">
          <div className="font-bold text-xs text-[#7A1A22] border-b border-stone-300 pb-1">ஜாதகரின் பஞ்ச பட்சி தத்துவ நிலைகள்</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div><span className="font-semibold">பிறந்த பக்ஷம் :</span> <span>தேய்பிறை</span></div>
            <div><span className="font-semibold">ஜன்ம பட்சி :</span> <span className="font-bold text-[#7A1A22]">கோழி</span></div>
            <div><span className="font-semibold">நட்பு பட்சிகள் :</span> <span className="font-bold text-emerald-800">ஆந்தை, மயில்</span></div>
            <div><span className="font-semibold">பகை பட்சிகள் :</span> <span className="font-bold text-rose-800">வல்லூறு, காகம்</span></div>
            <div><span className="font-semibold">படுபட்சி நாட்கள் :</span> <span className="font-bold">வெள்ளி, புதன்</span></div>
            <div><span className="font-semibold">ஊண் தொழில் நேரம் :</span> <span>பகல் 10:30 - 01:00</span></div>
          </div>
        </div>

        <div className="text-[9.5px] leading-relaxed text-stone-700 bg-stone-50 border border-stone-200 rounded p-2.5">
          <b>பயன்பாட்டு முறை:</b> ஜாதகர் தமது முக்கிய காரியங்கள், தொழில் முதலீடுகள், புதிய முயற்சிகள், பயணங்கள் ஆகியவற்றை தமது ஜன்ம பட்சி அரசு மற்றும் ஊண் தொழில் செய்யும் காலங்களில் மேற்கொள்வது பரிபூரண வெற்றியைத் தரும். படுபட்சி காலங்களை தவிர்க்க வேண்டும்.
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 31 (51-page): Pasakar, Bodhaka, Karaka, Vedhaka & Tara Balam Full Page
export const PasakarTaraPage31 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>கிரகங்களின் பாசகர்- போதகர்- காரகர்- வேதகர்</h2>
        </div>
        <div className="title-rule-sub mb-2" />

        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-2">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1 text-left pl-2">கிரகங்கள்</th>
              <th className="border border-black p-1">பாசகர்</th>
              <th className="border border-black p-1">போதகர்</th>
              <th className="border border-black p-1">காரகர்</th>
              <th className="border border-black p-1">வேதகர்</th>
            </tr>
          </thead>
          <tbody>
            {(data.pasakarRows || [
              { graha: 'சூரியன்', pasakar: 'சனி', pothakar: 'செவ்வாய்', karakar: 'குரு', vedhakar: 'சுக்கிரன்' },
              { graha: 'சந்திரன்', pasakar: 'சுக்கிரன்', pothakar: 'செவ்வாய்', karakar: 'சனி', vedhakar: 'சூரியன்' },
              { graha: 'செவ்வாய்', pasakar: 'சூரியன்', pothakar: 'சந்திரன்', karakar: 'சனி', vedhakar: 'புதன்' },
              { graha: 'புதன்', pasakar: 'சந்திரன்', pothakar: 'குரு', karakar: 'சுக்கிரன்', vedhakar: 'செவ்வாய்' },
              { graha: 'குரு', pasakar: 'சனி', pothakar: 'செவ்வாய்', karakar: 'சந்திரன்', vedhakar: 'சூரியன்' },
              { graha: 'சுக்கிரன்', pasakar: 'செவ்வாய்', pothakar: 'புதன்', karakar: 'சூரியன்', vedhakar: 'சனி' },
              { graha: 'சனி', pasakar: 'சுக்கிரன்', pothakar: 'சந்திரன்', karakar: 'குரு', vedhakar: 'செவ்வாய்' }
            ]).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-bold text-left pl-2">{r.graha}</td>
                <td className="border border-black p-1">{r.pasakar}</td>
                <td className="border border-black p-1 font-semibold text-emerald-800">{r.pothakar}</td>
                <td className="border border-black p-1">{r.karakar}</td>
                <td className="border border-black p-1 font-semibold text-rose-800">{r.vedhakar}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[9.5px] italic text-stone-700 bg-amber-50/40 p-2 border border-stone-200 rounded mb-4 leading-relaxed">
          <b>காரகர்:</b> நிதானமாக, குறைந்த பலனைத் தருவர். <b>வேதகர்:</b> பலனைத் தடுத்து விடுவார். <b>போதகர்:</b> நிறைவான பலனைத் தருவர். <b>பாசகர்:</b> சீக்கிர பலனைத் தருவர்.
        </p>

        <div className="page-centered-heading mt-2">
          <h2>தாரா பலமுள்ள நட்சத்திரங்கள் (நவதாரை ஆய்வு)</h2>
        </div>
        <div className="title-rule-sub mb-2" />

        <table className="w-full border-collapse border border-black text-[9.5px] text-center mb-2">
          <thead>
            <tr className="bg-amber-100/70 font-bold border-b border-black">
              <th className="border border-black p-1">முதலாம் தாரை</th>
              <th className="border border-black p-1">இரண்டாம் தாரை</th>
              <th className="border border-black p-1">மூன்றாம் தாரை</th>
              <th className="border border-black p-1">குணம்</th>
              <th className="border border-black p-1">தாரையின் பெயர்</th>
            </tr>
          </thead>
          <tbody>
            {(data.taraRows || [
              { star1: 'திருவாதிரை', star2: 'சுவாதி', star3: 'சதயம்', quality: 'அதமம்', tara: 'ஜென்ம தாரை' },
              { star1: 'புனர்பூசம்', star2: 'விசாகம்', star3: 'பூரட்டாதி', quality: 'உத்தமம்', tara: 'சம்பத்து தாரை' },
              { star1: 'பூசம்', star2: 'அனுஷம்', star3: 'உத்திரட்டாதி', quality: 'அதமம்', tara: 'விபத்து தாரை' },
              { star1: 'ஆயில்யம்', star2: 'கேட்டை', star3: 'ரேவதி', quality: 'உத்தமம்', tara: 'க்ஷேம தாரை' },
              { star1: 'மகம்', star2: 'மூலம்', star3: 'அசுவினி', quality: 'அதமம்', tara: 'பிரத்தியக்கு தாரை' },
              { star1: 'பூரம்', star2: 'பூராடம்', star3: 'பரணி', quality: 'உத்தமம்', tara: 'சாதக தாரை' },
              { star1: 'உத்திரம்', star2: 'உத்திராடம்', star3: 'கிருத்திகை', quality: 'அதமம்', tara: 'வதைத் தாரை' },
              { star1: 'அஸ்தம்', star2: 'திருவோணம்', star3: 'ரோகிணி', quality: 'உத்தமம்', tara: 'மைத்திர தாரை' },
              { star1: 'சித்திரை', star2: 'அவிட்டம்', star3: 'மிருகசீரிடம்', quality: 'உத்தமம்', tara: 'பரம மைத்திர தாரை' }
            ]).map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/30">
                <td className="border border-black p-1 font-semibold">{r.star1}</td>
                <td className="border border-black p-1 font-semibold">{r.star2}</td>
                <td className="border border-black p-1 font-semibold">{r.star3}</td>
                <td className={`border border-black p-1 font-bold ${r.quality === 'உத்தமம்' ? 'text-emerald-800' : 'text-rose-800'}`}>{r.quality}</td>
                <td className="border border-black p-1 font-bold text-[#7A1A22]">{r.tara}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-[9.5px] italic text-stone-700 bg-amber-50/40 p-2 border border-stone-200 rounded mt-2 leading-relaxed">
          <b>குறிப்பு:</b> உத்தம வரிசையிலுள்ள நட்சத்திர நாட்களில் அனைத்து விதமான சுப காரியங்களையும், புதிய ஒப்பந்தங்களையும் செய்யலாம்.
        </p>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

// Page 33 (51-page): Sevvai Dosha Comprehensive Analysis Full Page
export const SevvaiDoshaPage33 = ({ pageNum, data = {}, isTa = true, boxHeightMode = 'compact' }) => {
  const dosha = data.sevvaiDosha || {
    fromLagna: 'லக்னத்திலிருந்து செவ்வாய் 8-ஆம் இடத்தில் உள்ளார் (தோஷம் உண்டு).',
    fromMoon: 'சந்திரனிலிருந்து செவ்வாய் 2-ஆம் இடத்தில் உள்ளார் (தோஷம் உண்டு).',
    fromVenus: 'சுக்கிரனிலிருந்து செவ்வாய் 10-ஆம் இடத்தில் உள்ளார் (தோஷம் இல்லை).',
    conclusion: 'செவ்வாய் கடகத்தில் நீசம் பெற்று குருவின் சம பார்வை பெறுவதாலும், செவ்வாய் தன் சொந்த நட்சத்திரத்தில் அமையாததாலும் செவ்வாய் தோஷம் முற்றிலும் நிவர்த்தி ஆகிறது.'
  };

  return (
    <div className="a4-page">
      <div className={`booklet-box ${boxHeightMode === 'compact' ? 'compact-box' : 'full-box'}`}>
        <div className="page-number-tag">{pageNum}</div>

        <div className="page-centered-heading">
          <h2>செவ்வாய் தோஷ ஆய்வு</h2>
        </div>
        <div className="title-rule-sub mb-3" />

        <div className="text-[10px] leading-relaxed text-justify space-y-3 text-stone-800">
          <p>
            ஜாதகத்தில் செவ்வாய் தோஷம் திருமண காலத்தில் முக்கியத்துவமாகிறது. லக்னம், சந்திரன், சுக்கிரன் ஆகியவற்றின் நிலையிலிருந்து செவ்வாய் இருக்கும் நிலையினை பொருத்து செவ்வாய் தோஷத்தினை நிர்ணயம் செய்தல் வேண்டும்.
          </p>
          <p>
            லக்னம், இரண்டு, நான்கு, ஏழு, எட்டு மற்றும் பன்னிரெண்டாம் இடத்தில் உள்ள செவ்வாய் கிரகத்தினால் செவ்வாய் தோஷம் உண்டு என அநேக நூல்கள் கூறுகின்றன. எனினும் செவ்வாய் தோஷ நிர்ணயத்தில் அநேக விதிவிலக்குகள் உள்ளன.
          </p>

          <div className="bg-amber-50/70 border border-stone-300 rounded p-3 space-y-2">
            <div className="font-bold text-[#7A1A22] text-xs border-b border-stone-300 pb-1">ஜாதகத்தில் செவ்வாயின் நிலை:</div>
            <div className="space-y-1 font-semibold text-[10px]">
              <div>• {dosha.fromLagna}</div>
              <div>• {dosha.fromMoon}</div>
              <div>• {dosha.fromVenus}</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="font-bold text-[#7A1A22] text-xs">செவ்வாய் தோஷத்திற்கான சாஸ்திர விதிவிலக்குகள்:</div>
            <ul className="list-disc pl-5 space-y-1 text-[9.5px]">
              <li>செவ்வாய் மேஷம் அல்லது விருச்சிகத்தில் ஆட்சி பெற்றிருந்தாலோ, மகரத்தில் உச்சம் பெற்றிருந்தாலோ தோஷம் இல்லை.</li>
              <li>செவ்வாய் கடகத்தில் நீசம் பெற்றிருந்தாலோ, சிம்மத்தில் நட்பு பெற்றிருந்தாலோ தோஷம் நிவர்த்தி அடைகிறது.</li>
              <li>குரு அல்லது சந்திரனின் சேர்க்கை பெற்றாலோ, குருவின் சுப பார்வை பெற்றாலோ தோஷம் பங்கம் ஆகிறது.</li>
              <li>சூரியன், சனி அல்லது ராகு-கேதுவுடன் செவ்வாய் சேர்ந்திருந்தாலும் தோஷ வீரியம் குறைகிறது.</li>
            </ul>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-300 rounded p-3 mt-3">
            <div className="font-bold text-xs text-emerald-900 mb-1">செவ்வாய் தோஷ ஆய்வின் இறுதி முடிவு:</div>
            <div className="text-[10px] text-stone-800 leading-relaxed font-semibold">
              {dosha.conclusion}
            </div>
          </div>
        </div>

        <div className="box-bottom-rule" />
      </div>
    </div>
  );
};

