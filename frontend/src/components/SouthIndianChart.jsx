import React from 'react';
import { HORO_I18N } from '../horoscopeI18n';
import { translatePlanet } from './dossier/dossierI18n';

/**
 * South Indian Classical Vedic Astrology Chart Component (4x4 Fixed Signs with Center Name)
 * Clockwise Signs:
 * Box 0 (Top-Left): Meena (Pisces)
 * Box 1 (Top-Mid 1): Mesha (Aries)
 * Box 2 (Top-Mid 2): Vrishabha (Taurus)
 * Box 3 (Top-Right): Mithuna (Gemini)
 * Box 4 (Right-Top): Karka (Cancer)
 * Box 5 (Right-Bottom): Simha (Leo)
 * Box 6 (Bottom-Right): Kanya (Virgo)
 * Box 7 (Bottom-Mid 2): Tula (Libra)
 * Box 8 (Bottom-Mid 1): Vrishchika (Scorpio)
 * Box 9 (Bottom-Left): Dhanu (Sagittarius)
 * Box 10 (Left-Bottom): Makara (Capricorn)
 * Box 11 (Left-Top): Kumbha (Aquarius)
 */
export default function SouthIndianChart({
  title = 'ராசி',
  chartType = 'rashi', // 'rashi' or 'navamsha'
  gridData = {},       // mapping of signIndex (0-11) => array of entities
  lang = 'ta',
  className = '',
}) {
  const tHoro = HORO_I18N;
  const retroSuffix = tHoro.retroSuffix[lang] || '(R)';

  // Definition of the 12 boxes in 4x4 CSS grid (1-based row and col)
  const boxes = [
    { signIdx: 11, row: 1, col: 1 }, // Meena (Pisces)
    { signIdx: 0,  row: 1, col: 2 }, // Mesha (Aries)
    { signIdx: 1,  row: 1, col: 3 }, // Vrishabha (Taurus)
    { signIdx: 2,  row: 1, col: 4 }, // Mithuna (Gemini)

    { signIdx: 3,  row: 2, col: 4 }, // Karka (Cancer)
    { signIdx: 4,  row: 3, col: 4 }, // Simha (Leo)

    { signIdx: 5,  row: 4, col: 4 }, // Kanya (Virgo)
    { signIdx: 6,  row: 4, col: 3 }, // Tula (Libra)
    { signIdx: 7,  row: 4, col: 2 }, // Vrishchika (Scorpio)
    { signIdx: 8,  row: 4, col: 1 }, // Dhanu (Sagittarius)

    { signIdx: 9,  row: 3, col: 1 }, // Makara (Capricorn)
    { signIdx: 10, row: 2, col: 1 }, // Kumbha (Aquarius)
  ];

  const getPlanetLabel = (entity) => {
    if (!entity) return '';
    if (typeof entity === 'string') {
      return translatePlanet(entity, lang);
    }
    const planetKey = (entity.key || entity.name || '').toLowerCase();
    const planetObj = tHoro.planets[planetKey];
    let shortName = planetObj?.short?.[lang] || entity.name?.split(' ')[0] || entity.key;
    if (entity.isRetro && planetKey !== 'rahu' && planetKey !== 'ketu' && !entity.isLagna) {
      shortName += retroSuffix;
    }
    return translatePlanet(shortName, lang);
  };

  const chartTitle = chartType === 'navamsha'
    ? (tHoro.charts.navamsha[lang] || 'Navamsha')
    : (tHoro.charts.rashi[lang] || 'Rashi');

  return (
    <div className={`relative aspect-square w-full max-w-[340px] sm:max-w-[380px] mx-auto border-2 border-slate-900 bg-white shadow-2xs select-none ${className}`}>
      {/* 4x4 Grid Container */}
      <div className="w-full h-full grid grid-cols-4 grid-rows-4">
        {/* Center 2x2 Ornate Merged Cell */}
        <div className="col-start-2 col-span-2 row-start-2 row-span-2 border border-slate-900 flex flex-col items-center justify-center p-2 relative bg-amber-50/20">
          {/* Traditional Decorative Corner Flourish */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 border border-amber-600/40 rotate-45 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border border-red-600/30 -rotate-45 flex items-center justify-center">
              <span className="font-black text-base sm:text-lg text-slate-900 tracking-wider">
                {chartTitle}
              </span>
            </div>
          </div>
        </div>

        {/* 12 Outer Zodiac Sign Boxes */}
        {boxes.map((box, i) => {
          const entities = gridData[box.signIdx] || [];
          return (
            <div
              key={i}
              style={{ gridRowStart: box.row, gridColumnStart: box.col }}
              className="border border-slate-900 p-1 sm:p-1.5 flex flex-col justify-center items-center text-center overflow-hidden bg-white"
            >
              {entities.length > 0 ? (
                <div className="flex flex-col gap-0.5 sm:gap-1 items-center justify-center w-full">
                  {entities.map((ent, entIdx) => {
                    const isAsc = ent.isLagna || ent.key === 'lagna';
                    return (
                      <span
                        key={entIdx}
                        className={`text-[11px] sm:text-xs leading-tight font-black tracking-tight ${
                          isAsc ? 'text-rose-800' : 'text-slate-950'
                        }`}
                      >
                        {getPlanetLabel(ent)}
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
