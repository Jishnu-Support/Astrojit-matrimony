import React, { useState } from 'react';
import { Compass } from 'lucide-react';

/**
 * Vedic Kundli Chart Component - Light & Bright Attractive Theme
 * High contrast, optimized for mobile screens and desktop
 */
export default function KundliChart({ houseMap = {}, planets = [], lagnaSignName = 'Simha (Leo)' }) {
  const [chartStyle, setChartStyle] = useState('north'); // 'north' or 'south'

  const formatPlanets = (houseNum) => {
    const list = houseMap[houseNum] || [];
    if (list.length === 0) return '-';
    return list.join(', ');
  };

  const southIndianSigns = [
    { name: 'Meena (Pisces)', signIdx: 11, col: 1, row: 1 },
    { name: 'Mesha (Aries)', signIdx: 0, col: 2, row: 1 },
    { name: 'Vrishabha (Taurus)', signIdx: 1, col: 3, row: 1 },
    { name: 'Mithuna (Gemini)', signIdx: 2, col: 4, row: 1 },

    { name: 'Karka (Cancer)', signIdx: 3, col: 4, row: 2 },
    { name: 'Simha (Leo)', signIdx: 4, col: 4, row: 3 },

    { name: 'Kanya (Virgo)', signIdx: 5, col: 4, row: 4 },
    { name: 'Tula (Libra)', signIdx: 6, col: 3, row: 4 },
    { name: 'Vrishchika (Scorpio)', signIdx: 7, col: 2, row: 4 },
    { name: 'Dhanu (Sagitt.)', signIdx: 8, col: 1, row: 4 },

    { name: 'Makara (Capric.)', signIdx: 9, col: 1, row: 3 },
    { name: 'Kumbha (Aquarius)', signIdx: 10, col: 1, row: 2 },
  ];

  const getPlanetsInSign = (signIdx) => {
    const matches = (planets || []).filter((p) => p.signIndex === signIdx);
    const names = matches.map((p) => p.name.split(' ')[0]);
    if (lagnaSignName && lagnaSignName.toLowerCase().includes(southIndianSigns.find(s => s.signIdx === signIdx)?.name.split(' ')[0].toLowerCase())) {
      names.unshift('ASC (Lagna)');
    }
    return names;
  };

  return (
    <div className="bg-white border border-amber-200/80 rounded-2xl p-3.5 sm:p-5 shadow-sm">
      {/* Chart Style Switcher Header */}
      <div className="flex items-center justify-between mb-3 border-b border-amber-100 pb-2.5">
        <h4 className="text-amber-800 font-bold text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-amber-600" /> Janma Kundli Chart
        </h4>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setChartStyle('north')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-semibold ${
              chartStyle === 'north' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            North Indian
          </button>
          <button
            onClick={() => setChartStyle('south')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-semibold ${
              chartStyle === 'south' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            South Indian
          </button>
        </div>
      </div>

      {/* NORTH INDIAN DIAMOND CHART */}
      {chartStyle === 'north' && (
        <div className="relative w-full max-w-[380px] sm:max-w-[420px] mx-auto aspect-square">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xs">
            <rect x="5" y="5" width="390" height="390" fill="#FFFDF9" stroke="#D97706" strokeWidth="2.5" />
            <line x1="5" y1="5" x2="395" y2="395" stroke="#D97706" strokeWidth="1.5" />
            <line x1="395" y1="5" x2="5" y2="395" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="200,5 395,200 200,395 5,200" fill="none" stroke="#D97706" strokeWidth="1.5" />

            <line x1="5" y1="5" x2="200" y2="200" stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
            <line x1="395" y1="5" x2="200" y2="200" stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
            <line x1="395" y1="395" x2="200" y2="200" stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
            <line x1="5" y1="395" x2="200" y2="200" stroke="#D97706" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />

            {/* H1 - Ascendant (Center Diamond) */}
            <text x="200" y="68" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="bold">H1 (Lagna)</text>
            <text x="200" y="93" textAnchor="middle" fill="#B45309" fontSize="13" fontWeight="bold">{formatPlanets(1)}</text>

            {/* H2 */}
            <text x="115" y="45" textAnchor="middle" fill="#64748B" fontSize="10">H2</text>
            <text x="115" y="68" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(2)}</text>

            {/* H12 */}
            <text x="285" y="45" textAnchor="middle" fill="#64748B" fontSize="10">H12</text>
            <text x="285" y="68" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(12)}</text>

            {/* H3 */}
            <text x="50" y="115" textAnchor="middle" fill="#64748B" fontSize="10">H3</text>
            <text x="50" y="135" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(3)}</text>

            {/* H4 */}
            <text x="95" y="200" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="bold">H4</text>
            <text x="95" y="222" textAnchor="middle" fill="#B45309" fontSize="12" fontWeight="bold">{formatPlanets(4)}</text>

            {/* H5 */}
            <text x="50" y="285" textAnchor="middle" fill="#64748B" fontSize="10">H5</text>
            <text x="50" y="305" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(5)}</text>

            {/* H6 */}
            <text x="115" y="355" textAnchor="middle" fill="#64748B" fontSize="10">H6</text>
            <text x="115" y="375" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(6)}</text>

            {/* H7 */}
            <text x="200" y="330" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="bold">H7</text>
            <text x="200" y="350" textAnchor="middle" fill="#B45309" fontSize="12" fontWeight="bold">{formatPlanets(7)}</text>

            {/* H8 */}
            <text x="285" y="355" textAnchor="middle" fill="#64748B" fontSize="10">H8</text>
            <text x="285" y="375" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(8)}</text>

            {/* H9 */}
            <text x="350" y="285" textAnchor="middle" fill="#64748B" fontSize="10">H9</text>
            <text x="350" y="305" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(9)}</text>

            {/* H10 */}
            <text x="305" y="200" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="bold">H10</text>
            <text x="305" y="222" textAnchor="middle" fill="#B45309" fontSize="12" fontWeight="bold">{formatPlanets(10)}</text>

            {/* H11 */}
            <text x="350" y="115" textAnchor="middle" fill="#64748B" fontSize="10">H11</text>
            <text x="350" y="135" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700">{formatPlanets(11)}</text>
          </svg>
        </div>
      )}

      {/* SOUTH INDIAN SQUARE CHART */}
      {chartStyle === 'south' && (
        <div className="relative w-full max-w-[380px] sm:max-w-[420px] mx-auto aspect-square">
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 border-2 border-amber-500 bg-white shadow-xs">
            <div className="col-start-2 col-span-2 row-start-2 row-span-2 border border-amber-200 flex flex-col items-center justify-center p-2 text-center bg-amber-50/50">
              <span className="text-amber-800 font-bold text-xs uppercase tracking-wider">South Indian</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Fixed Signs</span>
              <span className="text-[10px] text-emerald-700 mt-0.5 font-bold">Lagna: {lagnaSignName}</span>
            </div>

            {southIndianSigns.map((sign, idx) => {
              const inSignPlanets = getPlanetsInSign(sign.signIdx);
              return (
                <div
                  key={idx}
                  style={{ gridColumnStart: sign.col, gridRowStart: sign.row }}
                  className="border border-amber-200 p-1 flex flex-col justify-between text-[10px] bg-white overflow-hidden"
                >
                  <span className="text-slate-400 font-semibold text-[9px] truncate">
                    {sign.name.split(' ')[0]}
                  </span>
                  <div className="font-bold text-slate-800 text-[10px] leading-tight flex flex-wrap gap-0.5">
                    {inSignPlanets.length > 0 ? (
                      inSignPlanets.map((p, pIdx) => (
                        <span key={pIdx} className={p.includes('ASC') ? 'text-amber-700 font-black' : 'text-slate-900 font-semibold'}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 text-center text-[11px] sm:text-xs text-slate-500">
        <span className="text-amber-700 font-bold">Lagna:</span> {lagnaSignName} • Style: {chartStyle === 'north' ? 'North Indian Diamond' : 'South Indian Box'}
      </div>
    </div>
  );
}
