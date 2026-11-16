import React from 'react';
import { useLang } from '../../i18n';
import { HORO_I18N } from '../../horoscopeI18n';

/**
 * South Indian 4x4 Vedic Horoscope Chart
 * Clockwise sign indices from top-left:
 * Row 0: Pisces(11), Aries(0), Taurus(1), Gemini(2)
 * Row 1: Aquarius(10), [CENTER 2x2], Cancer(3)
 * Row 2: Capricorn(9), [CENTER 2x2], Leo(4)
 * Row 3: Sagittarius(8), Scorpio(7), Libra(6), Virgo(5)
 */
const SOUTH_INDIAN_LAYOUT = [
  [11, 0, 1, 2],
  [10, 'center_tl', 'center_tr', 3],
  [9, 'center_bl', 'center_br', 4],
  [8, 7, 6, 5],
];

const PLANET_GLYPHS = {
  en: { lagna: 'Asc', sun: 'Su', moon: 'Mo', mars: 'Ma', mercury: 'Me', jupiter: 'Ju', venus: 'Ve', saturn: 'Sa', rahu: 'Ra', ketu: 'Ke', mandi: 'Md' },
  ta: { lagna: 'ல', sun: 'சூ', moon: 'சந்', mars: 'செ', mercury: 'புத', jupiter: 'வி', venus: 'சுக்', saturn: 'சனி', rahu: 'ரா', ketu: 'கே', mandi: 'மா' },
  hi: { lagna: 'लग्न', sun: 'सूर्य', moon: 'चन्द्र', mars: 'मंगल', mercury: 'बुध', jupiter: 'गुरु', venus: 'शुक्र', saturn: 'शनि', rahu: 'राहु', ketu: 'केतु', mandi: 'मांदी' },
  kn: { lagna: 'ಲಗ್ನ', sun: 'ಸೂರ್ಯ', moon: 'ಚಂದ್ರ', mars: 'ಮಂಗಳ', mercury: 'ಬುಧ', jupiter: 'ಗುರು', venus: 'ಶುಕ್ರ', saturn: 'ಶನಿ', rahu: 'ರಾಹು', ketu: 'ಕೇತು', mandi: 'ಮಾಂದಿ' },
  te: { lagna: 'లగ్నం', sun: 'సూర్యుడు', moon: 'చంద్రుడు', mars: 'కుజుడు', mercury: 'బుధుడు', jupiter: 'గురు', venus: 'శుక్రుడు', saturn: 'శని', rahu: 'రాహు', ketu: 'కేతు', mandi: 'మాంది' },
  bn: { lagna: 'লগ্ন', sun: 'সূর্য', moon: 'চন্দ্র', mars: 'মঙ্গল', mercury: 'বুধ', jupiter: 'বৃহস্পতি', venus: 'শুক্র', saturn: 'শনি', rahu: 'রাহু', ketu: 'কেতু', mandi: 'মান্দি' },
};

const BADGE_MAP = {
  ta: 'திருக்கணிதம்',
  en: 'Thirukanitha',
  hi: 'दृक पंचांग',
  kn: 'ದೃಕ್ ಪಂಚಾಂಗ',
  te: 'దృక్ సిద్ధాంతం',
  bn: 'দৃক পঞ্চাঙ্গ',
};

const DEFAULT_TITLE_MAP = {
  ta: 'ராசி',
  en: 'Rasi',
  hi: 'राशि',
  kn: 'ರಾಶಿ',
  te: 'రాశి',
  bn: 'রাশি',
};

export default function ThirukanithaChart({
  title,
  subtitle,
  centerContent,
  planetsBySign = {},
  lagnaSignIndex = 2,
  className = '',
}) {
  const { lang } = useLang();
  const currentLang = lang || 'en';

  const getSignName = (idx) => {
    if (HORO_I18N.rashis && HORO_I18N.rashis[idx]) {
      return HORO_I18N.rashis[idx][currentLang] || HORO_I18N.rashis[idx].en;
    }
    return `Sign ${idx + 1}`;
  };

  const getGlyph = (planet) => {
    const k = (planet.key || planet.name || '').toLowerCase();
    const glyphs = PLANET_GLYPHS[currentLang] || PLANET_GLYPHS.en;
    for (const [pk, gl] of Object.entries(glyphs)) {
      if (k === pk || k.includes(pk)) return gl;
    }
    return planet.glyph || (currentLang === 'en' ? planet.name?.slice(0, 2) : planet.name);
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      {/* Chart Title Header */}
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5">
              <span>☸</span>
              <span>{title}</span>
            </h4>
            {subtitle && (
              <p className="text-[11px] text-emerald-700/80 font-medium">{subtitle}</p>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
            {BADGE_MAP[currentLang] || 'Thirukanitha'}
          </span>
        </div>
      )}

      {/* 4x4 South Indian Grid with Signature Emerald/Teal Theme */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square w-full border-2 border-emerald-800 bg-[#fffdfa] shadow-md rounded-lg overflow-hidden relative">
        {SOUTH_INDIAN_LAYOUT.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            // Render the central 2x2 metadata card
            if (cell === 'center_tl') {
              return (
                <div
                  key={`center-${rIdx}-${cIdx}`}
                  className="col-span-2 row-span-2 border border-emerald-700/40 bg-gradient-to-br from-emerald-50/90 via-amber-50/40 to-emerald-100/60 p-2 sm:p-3 flex flex-col items-center justify-center text-center relative shadow-inner overflow-hidden"
                >
                  {/* Subtle Vedic watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-emerald-950 text-7xl font-serif">
                    🕉️
                  </div>

                  {centerContent ? (
                    centerContent
                  ) : (
                    <div className="space-y-1 relative z-10">
                      <div className="inline-block px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-black tracking-wider uppercase shadow-xs">
                        {title || DEFAULT_TITLE_MAP[currentLang] || 'Rasi'}
                      </div>
                      <p className="text-xs font-bold text-slate-800">Astrojit Vedic Engine</p>
                      <p className="text-[10px] text-slate-600 font-medium">{BADGE_MAP[currentLang] || 'Thirukanitha'}</p>
                    </div>
                  )}
                </div>
              );
            }

            // Skip the other 3 inner quadrant positions
            if (cell === 'center_tr' || cell === 'center_bl' || cell === 'center_br') {
              return null;
            }

            const signIndex = cell;
            const signPlanets = planetsBySign[signIndex] || [];
            const isLagnaHouse = signIndex === lagnaSignIndex;

            return (
              <div
                key={`box-${signIndex}`}
                className="border border-emerald-700/60 p-1 sm:p-1.5 flex flex-col justify-between relative bg-white/70 hover:bg-emerald-50/40 transition-colors"
              >
                {/* Red diagonal striped corner for Lagna House */}
                {isLagnaHouse && (
                  <div
                    className="absolute top-0 left-0 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none z-10"
                    title="Lagna Ascendant Indicator"
                  >
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <polygon points="0,0 24,0 0,24" fill="#dc2626" opacity="0.9" />
                      <line x1="0" y1="6" x2="6" y2="0" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="0" y1="14" x2="14" y2="0" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="0" y1="22" x2="22" y2="0" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}

                {/* Sign Label (Subtle in corner) */}
                <div className="flex justify-between items-start text-[9px] font-bold text-slate-400 select-none">
                  <span className={isLagnaHouse ? 'pl-4 text-rose-700 font-extrabold' : ''}>
                    {getSignName(signIndex)}
                  </span>
                </div>

                {/* Occupant Planet Badges */}
                <div className="flex-1 flex flex-wrap content-center items-center justify-center gap-1 py-0.5">
                  {signPlanets.map((planet, pIdx) => {
                    const isLagna = planet.isLagna || planet.key === 'lagna';
                    const planetGlyph = getGlyph(planet);
                    return (
                      <span
                        key={pIdx}
                        className={`inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[10px] sm:text-[11px] font-extrabold leading-tight border transition-transform hover:scale-105 ${
                          isLagna
                            ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs'
                            : 'bg-white/90 text-slate-800 border-slate-200'
                        }`}
                        title={`${planet.name || planetGlyph} (${planet.degFormatted || planet.shortDeg || ''})`}
                      >
                        <strong className={planet.color || 'text-slate-900'}>
                          {planetGlyph}
                        </strong>
                        {planet.shortDeg && (
                          <span className="text-[8px] text-slate-500 font-medium tracking-tighter">
                            {planet.shortDeg}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
