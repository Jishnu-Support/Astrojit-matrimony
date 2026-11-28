import React from 'react';

/**
 * 12 Houses Geometry in North Indian Diamond Chart (400x400 SVG)
 * Counter-clockwise progression:
 * H1 (Top Diamond, Lagna) -> H2 (Top-Left) -> H3 (Left-Upper) -> H4 (Left Diamond) ->
 * H5 (Left-Lower) -> H6 (Bottom-Left) -> H7 (Bottom Diamond) -> H8 (Bottom-Right) ->
 * H9 (Right-Lower) -> H10 (Right Diamond) -> H11 (Right-Upper) -> H12 (Top-Right)
 */
const NORTH_HOUSES = [
  { h: 1,  name: 'H1',  cx: 200, cy: 110, numX: 200, numY: 30 },
  { h: 2,  name: 'H2',  cx: 95,  cy: 55,  numX: 145, numY: 28 },
  { h: 3,  name: 'H3',  cx: 45,  cy: 100, numX: 26,  numY: 145 },
  { h: 4,  name: 'H4',  cx: 105, cy: 200, numX: 30,  numY: 200 },
  { h: 5,  name: 'H5',  cx: 45,  cy: 300, numX: 26,  numY: 255 },
  { h: 6,  name: 'H6',  cx: 95,  cy: 345, numX: 145, numY: 372 },
  { h: 7,  name: 'H7',  cx: 200, cy: 290, numX: 200, numY: 370 },
  { h: 8,  name: 'H8',  cx: 305, cy: 345, numX: 255, numY: 372 },
  { h: 9,  name: 'H9',  cx: 355, cy: 300, numX: 374, numY: 255 },
  { h: 10, name: 'H10', cx: 295, cy: 200, numX: 370, numY: 200 },
  { h: 11, name: 'H11', cx: 355, cy: 100, numX: 374, numY: 145 },
  { h: 12, name: 'H12', cx: 305, cy: 55,  numX: 255, numY: 28 }
];

const SIGN_INDEX_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Universal North Indian Diamond Kundli Chart Component
 * Supports both Thirukanitha Screen View & A4 High-Res Print View.
 */
export default function NorthIndianChartGrid({
  chartData,
  chartCells,
  lagnaRasi,
  centerTitle = '',
  centerSub = '',
  isTamil = false,
  className = '',
  isPrint = false,
  fitHeight = false
}) {
  // 1. Build a map of sign index 0..11 -> array of occupant strings
  const signsMap = {};
  for (let r = 0; r < 12; r++) {
    signsMap[r] = [];
  }

  let detectedLagnaRasi = typeof lagnaRasi === 'number' ? lagnaRasi : null;

  // Case A: chartData is an array of objects [{ rasi: 0, occupants: [...] }, ...]
  if (Array.isArray(chartData)) {
    for (const item of chartData) {
      if (item && typeof item.rasi === 'number') {
        const occs = Array.isArray(item.occupants) ? item.occupants : [];
        for (const occ of occs) {
          const label = isTamil ? (occ.labelTa || occ.labelEn) : (occ.labelEn || occ.labelTa);
          if (occ.isLagna && detectedLagnaRasi === null) {
            detectedLagnaRasi = item.rasi;
          }
          if (label) signsMap[item.rasi].push({ label, isLagna: Boolean(occ.isLagna) });
        }
      }
    }
  } else if (chartData && typeof chartData === 'object') {
    // Case B: chartData is an object keyed by rasi { 0: { occupants: [...] }, ... }
    for (let r = 0; r < 12; r++) {
      const item = chartData[r];
      if (item) {
        const occs = Array.isArray(item.occupants) ? item.occupants : [];
        for (const occ of occs) {
          const label = isTamil ? (occ.labelTa || occ.labelEn) : (occ.labelEn || occ.labelTa);
          if (occ.isLagna && detectedLagnaRasi === null) {
            detectedLagnaRasi = r;
          }
          if (label) signsMap[r].push({ label, isLagna: Boolean(occ.isLagna) });
        }
      }
    }
  }

  // Case C: chartCells passed (array of strings, numbers, or objects from 1-pager or multi-page)
  if (Array.isArray(chartCells)) {
    for (let i = 0; i < chartCells.length; i++) {
      const rasi = SIGN_INDEX_ORDER[i] !== undefined ? SIGN_INDEX_ORDER[i] : i;
      const cellVal = chartCells[i];

      if (cellVal !== undefined && cellVal !== null && cellVal !== '') {
        if (Array.isArray(cellVal)) {
          for (const item of cellVal) {
            const p = typeof item === 'object' && item !== null
              ? (isTamil ? (item.labelTa || item.labelEn || item.label) : (item.labelEn || item.labelTa || item.label))
              : String(item).trim();
            if (p) {
              const isLag = p.includes('1-லக்') || p.includes('1-Lag') || p.includes('லக்') || p.includes('Lag');
              if (isLag && detectedLagnaRasi === null) {
                detectedLagnaRasi = rasi;
              }
              signsMap[rasi].push({ label: p, isLagna: isLag });
            }
          }
        } else {
          const cellStr = typeof cellVal === 'string' ? cellVal : String(cellVal);
          const parts = cellStr.split(',').map(s => s.trim()).filter(Boolean);
          for (const p of parts) {
            const isLag = p.includes('1-லக்') || p.includes('1-Lag') || p.includes('லக்') || p.includes('Lag');
            if (isLag && detectedLagnaRasi === null) {
              detectedLagnaRasi = rasi;
            }
            signsMap[rasi].push({ label: p, isLagna: isLag });
          }
        }
      }
    }
  }

  // Fallback if no Lagna detected
  const effectiveLagnaRasi = detectedLagnaRasi !== null ? detectedLagnaRasi : 0;

  // 2. Prepare House Data for all 12 Houses
  const houseData = NORTH_HOUSES.map((hObj, idx) => {
    const houseNum = idx + 1;
    // Sign in this house (counter-clockwise progression from Lagna)
    const signIdx = (effectiveLagnaRasi + (houseNum - 1)) % 12;
    const signNum = signIdx + 1; // 1 = Aries, 2 = Taurus ... 12 = Pisces
    const occupants = signsMap[signIdx] || [];

    return {
      ...hObj,
      houseNum,
      signIdx,
      signNum,
      occupants
    };
  });

  const strokeColor = isPrint ? '#000000' : '#7A1A22';
  const gridStroke = isPrint ? '#000000' : '#B45309';
  const bgColor = isPrint ? '#FFFFFF' : '#FFFDF9';

  return (
    <div className={`flex flex-col items-center w-full max-w-[420px] mx-auto select-none ${fitHeight ? 'h-full min-h-0' : ''} ${className}`}>
      {/* Title Badge if provided - positioned above chart to prevent any overlap with house numbers */}
      {centerTitle && (
        <div className={`text-center shrink-0 ${fitHeight ? 'mb-1 leading-tight' : 'mb-1.5'}`}>
          <span
            className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-2xs inline-block ${
              isPrint
                ? 'text-black bg-stone-100 border border-black/35'
                : 'text-[#7A1A22] dark:text-amber-300 bg-amber-50/90 dark:bg-stone-900/90 border border-amber-900/20'
            }`}
          >
            {centerTitle}
          </span>
          {centerSub && (
            <div className={`text-[8px] font-bold leading-none mt-0.5 ${isPrint ? 'text-stone-700' : 'text-stone-500'}`}>
              {centerSub}
            </div>
          )}
        </div>
      )}

      <div className={fitHeight ? 'relative flex-1 min-h-0 w-full flex items-center justify-center' : 'relative aspect-square w-full'}>
        <svg
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className={fitHeight ? 'h-full w-auto max-w-full max-h-full aspect-square drop-shadow-2xs' : 'w-full h-full drop-shadow-2xs'}
          style={{ fontFamily: isTamil ? "'Noto Serif Tamil', Georgia, serif" : "Georgia, serif" }}
        >
          {/* Background */}
          <rect
            x="4"
            y="4"
            width="392"
            height="392"
            fill={bgColor}
            stroke={strokeColor}
            strokeWidth={isPrint ? '2.5' : '2'}
          />

          {/* Diagonal 1: (0,0) to (400,400) */}
          <line x1="4" y1="4" x2="396" y2="396" stroke={gridStroke} strokeWidth={isPrint ? '1.5' : '1.5'} />

          {/* Diagonal 2: (0,400) to (400,0) */}
          <line x1="4" y1="396" x2="396" y2="4" stroke={gridStroke} strokeWidth={isPrint ? '1.5' : '1.5'} />

          {/* Inner Diamond connecting (200,4), (396,200), (200,396), (4,200) */}
          <polygon
            points="200,4 396,200 200,396 4,200"
            fill="none"
            stroke={gridStroke}
            strokeWidth={isPrint ? '1.5' : '1.5'}
          />

          {/* Inner subtle decorative borders */}
          <rect
            x="1"
            y="1"
            width="398"
            height="398"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.8"
            opacity={isPrint ? '1' : '0.4'}
          />

          {/* Render Each House: Sign Number & Occupants */}
          {houseData.map(h => {
            const occCount = h.occupants.length;
            // Calculate vertical step for stacking multiple planets in one house
            const lineHeight = occCount > 3 ? 12 : 14;
            const startY = h.cy - ((occCount - 1) * lineHeight) / 2;

            return (
              <g key={h.h}>
                {/* Sign Number (Mesha=1 .. Meena=12) */}
                <text
                  x={h.numX}
                  y={h.numY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isPrint ? '11' : '11.5'}
                  fontWeight="900"
                  fill={isPrint ? '#222' : '#991B1B'}
                  className="font-mono select-none"
                >
                  {h.signNum}
                </text>

                {/* Occupants */}
                {h.occupants.map((occ, oIdx) => {
                  const yPos = startY + oIdx * lineHeight;
                  const isLagna = occ.isLagna;

                  return (
                    <text
                      key={oIdx}
                      x={h.cx}
                      y={yPos}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isLagna ? (isPrint ? '11' : '11.5') : (isPrint ? '10' : '10.5')}
                      fontWeight={isLagna ? '900' : '700'}
                      fill={
                        isLagna
                          ? (isPrint ? '#7A1A22' : '#7A1A22')
                          : (isPrint ? '#000000' : '#1C1917')
                      }
                    >
                      {occ.label}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
