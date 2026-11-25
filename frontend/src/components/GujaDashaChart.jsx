import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Compass,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useLang } from '../i18n';
import { MATCH_I18N, translateEntity } from '../matchmakingI18n';

/**
 * Classical South Indian 4x4 Grid Coordinate Mapping for Janma Rasi
 * Row 0: Pisces (11), Aries (0), Taurus (1), Gemini (2)
 * Row 1: Aquarius (10), [Center 1,1], [Center 1,2], Cancer (3)
 * Row 2: Capricorn (9), [Center 2,1], [Center 2,2], Leo (4)
 * Row 3: Sagittarius (8), Scorpio (7), Libra (6), Virgo (5)
 */
const SOUTH_INDIAN_CELLS = [
  { signIdx: 11, row: 0, col: 0, defaultEn: 'Pisces', defaultTa: 'மீனம்' },
  { signIdx: 0,  row: 0, col: 1, defaultEn: 'Aries', defaultTa: 'மேஷம்' },
  { signIdx: 1,  row: 0, col: 2, defaultEn: 'Taurus', defaultTa: 'ரிஷபம்' },
  { signIdx: 2,  row: 0, col: 3, defaultEn: 'Gemini', defaultTa: 'மிதுனம்' },

  { signIdx: 3,  row: 1, col: 3, defaultEn: 'Cancer', defaultTa: 'கடகம்' },
  { signIdx: 4,  row: 2, col: 3, defaultEn: 'Leo', defaultTa: 'சிம்மம்' },

  { signIdx: 5,  row: 3, col: 3, defaultEn: 'Virgo', defaultTa: 'கன்னி' },
  { signIdx: 6,  row: 3, col: 2, defaultEn: 'Libra', defaultTa: 'துலாம்' },
  { signIdx: 7,  row: 3, col: 1, defaultEn: 'Scorpio', defaultTa: 'விருச்சிகம்' },
  { signIdx: 8,  row: 3, col: 0, defaultEn: 'Sagittarius', defaultTa: 'தனுசு' },

  { signIdx: 9,  row: 2, col: 0, defaultEn: 'Capricorn', defaultTa: 'மகரம்' },
  { signIdx: 10, row: 1, col: 0, defaultEn: 'Aquarius', defaultTa: 'கும்பம்' },
];

export default function GujaDashaChart({ matchReport }) {
  const { lang = 'en' } = useLang();
  const [showAllDashas, setShowAllDashas] = useState(false);

  if (!matchReport) return null;

  const gujaData = matchReport.gujaDashaAnalysis || {};
  const boy = gujaData.boy || {};
  const girl = gujaData.girl || {};
  const doshaSamyam = gujaData.doshaSamyam || {};
  const dasaSandhi = gujaData.dasaSandhi || {};
  const samaCheck = gujaData.gujaDashaSamaCheck || {};
  const remedies = lang === 'ta' ? (gujaData.remediesTamil || []) : (gujaData.remedies || []);

  const isTa = lang === 'ta';
  const isKn = lang === 'kn';

  const formatHouseOrdinal = (houseNum) => {
    if (!houseNum) return '';
    if (isTa) return `${houseNum}-ஆம் இடம்`;
    if (isKn) return `${houseNum}ನೇ ಮನೆ`;
    const s = ['th', 'st', 'nd', 'rd'];
    const v = houseNum % 100;
    const suffix = s[(v - 20) % 10] || s[v] || s[0];
    return `${houseNum}${suffix} House`;
  };

  // Renders a single South Indian 4x4 Grid for a person
  const renderSouthIndianGrid = (person, title, isGroom = true) => {
    const cellsBySign = {};
    (person.chartCells || []).forEach((c) => {
      cellsBySign[c.signIdx] = c;
    });

    return (
      <div className="bg-white border-2 border-stone-800 rounded-none overflow-hidden shadow-xs">
        {/* Top Header of Chart */}
        <div className={`p-2 font-black text-xs sm:text-sm text-center flex items-center justify-between border-b-2 border-stone-800 ${
          isGroom ? 'bg-indigo-50 text-indigo-950' : 'bg-rose-50 text-rose-950'
        }`}>
          <span className="flex items-center gap-1.5 font-bold">
            <Compass className="w-4 h-4 text-amber-600" />
            {title} ({person.name || (isGroom ? 'Groom' : 'Bride')})
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-stone-300">
            {translateEntity('rashis', person.lagnaRasi || 'Gemini', lang)} {isTa ? 'லக்னம்' : 'Lagna'}
          </span>
        </div>

        {/* 4x4 CSS Grid */}
        <div className="grid grid-cols-4 grid-rows-4 aspect-square w-full max-w-[360px] mx-auto bg-[#FFFDF9] text-stone-900 border-collapse">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => {
              const isCenter = (r === 1 || r === 2) && (c === 1 || c === 2);
              if (isCenter) {
                if (r === 1 && c === 1) {
                  return (
                    <div
                      key={`center-${r}-${c}`}
                      className="col-span-2 row-span-2 border border-stone-800 flex flex-col items-center justify-center p-2 text-center bg-amber-50/40 relative"
                    >
                      <span className="text-xs uppercase font-black tracking-widest text-[#7A1A22]">
                        {isTa ? 'ராசிக் கட்டம்' : 'RASI (D1)'}
                      </span>
                      <span className="text-[10px] font-bold text-stone-700 mt-0.5">
                        {person.starTamil || person.star || 'Mula'}
                        {person.pada ? ` (${person.pada})` : ''}
                      </span>
                      <span className="text-[9px] text-stone-500 font-medium">
                        {translateEntity('rashis', person.moonRasi || 'Sagittarius', lang)}
                      </span>
                      <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                        <Flame className="w-2.5 h-2.5" />
                        {isTa ? 'செவ்வாய் நிலை' : 'Mars'}: {person.houses?.lagna || 7}
                        {isTa ? '-ஆம் இடம்' : 'th H'}
                      </div>
                    </div>
                  );
                }
                return null;
              }

              const cellDef = SOUTH_INDIAN_CELLS.find((item) => item.row === r && item.col === c);
              if (!cellDef) return null;

              const cellData = cellsBySign[cellDef.signIdx] || {};
              const occupants = cellData.occupants || [];
              const signName = isTa
                ? (cellDef.defaultTa || cellData.signTamil)
                : (cellDef.defaultEn || cellData.signName);

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className="border border-stone-800 p-1 flex flex-col justify-between text-[10px] sm:text-[10.5px] leading-tight overflow-hidden relative min-h-[58px]"
                >
                  {/* Sign Name Watermark / Label */}
                  <div className="text-[8.5px] font-bold text-stone-400 uppercase tracking-tighter truncate">
                    {signName}
                  </div>

                  {/* Occupants in this Sign */}
                  <div className="flex flex-col gap-0.5 my-auto">
                    {occupants.map((occ, oIdx) => {
                      if (occ.isMars) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9.5px] bg-rose-600 text-white shadow-2xs"
                            title={`Mars in ${signName} (${occ.houseFromLagna}th house from Lagna)`}
                          >
                            <Flame className="w-2.5 h-2.5" />
                            {isTa ? 'செவ்' : 'Mars'}
                            <span className="text-[8px] bg-white text-rose-800 px-1 rounded-xs font-bold">
                              {occ.houseFromLagna}
                            </span>
                          </span>
                        );
                      }
                      if (occ.isLagna) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center px-1 py-0.2 rounded font-black text-[9.5px] bg-indigo-700 text-white"
                          >
                            {isTa ? 'ல' : 'ASC'}
                          </span>
                        );
                      }
                      if (occ.isMoon) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center px-1 py-0.2 rounded font-bold text-[9px] bg-cyan-100 text-cyan-900 border border-cyan-300"
                          >
                            {isTa ? 'சந்' : 'Moon'}
                          </span>
                        );
                      }
                      if (occ.isVenus) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center px-1 py-0.2 rounded font-bold text-[9px] bg-emerald-100 text-emerald-900 border border-emerald-300"
                          >
                            {isTa ? 'சுக்' : 'Ven'}
                          </span>
                        );
                      }
                      if (occ.isJupiter) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center px-1 py-0.2 rounded font-bold text-[9px] bg-amber-100 text-amber-900 border border-amber-300"
                          >
                            {isTa ? 'குரு' : 'Jup'}
                          </span>
                        );
                      }

                      return (
                        <span key={oIdx} className="text-stone-700 text-[9px] font-semibold">
                          {isTa ? occ.code.split('/')[0].trim() : occ.name}
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
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 border border-rose-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-rose-800/80 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-500/30 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-400/30 inline-flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-300" />
              {isTa ? 'செவ்வாய் தசா & கட்டப் பகுப்பாய்வு' : 'Guja Dasha & Chevvai Analysis Chart'}
            </span>
            <h3 className="text-base sm:text-xl font-black mt-1">
              {isTa
                ? 'ஜாதகக் கட்டம், செவ்வாய் தோஷ நிலை & 7 வருட செவ்வாய் தசை ஆய்வு'
                : 'South Indian Kundli Chart, Chevvai Dosha & 7-Year Mars Dasha Timeline'}
            </h3>
          </div>

          {/* Dosha Samyam Status Badge */}
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] font-bold text-rose-200 block uppercase tracking-wider">
              {isTa ? 'தோஷ சமநிலை முடிவு' : 'Dosha Samyam Verdict'}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 justify-end">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isTa ? doshaSamyam.verdictTamil : doshaSamyam.verdict}
            </span>
          </div>
        </div>

        <p className="text-xs text-rose-100/90 leading-relaxed">
          {doshaSamyam.summary}
        </p>
      </div>

      {/* 2. Dual South Indian Rasi Charts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-rose-600" />
            {isTa ? 'மணமகள் & மணமகன் ஜாதகக் கட்டங்கள் (ராசி சக்கரம்)' : 'Bride & Groom Janma Rasi Kundli Charts'}
          </h4>
          <span className="text-[11px] text-slate-500">
            {isTa ? 'தென்னிந்திய முறை' : 'Classical South Indian Nirayana Format'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bride/Female Chart (Left Side Default) */}
          {renderSouthIndianGrid(girl, isTa ? 'மணமகள் ஜாதகம்' : "Bride's Chart", false)}
          {/* Groom/Male Chart (Right Side Default) */}
          {renderSouthIndianGrid(boy, isTa ? 'மணமகன் ஜாதகம்' : "Groom's Chart", true)}
        </div>
      </div>

      {/* 3. Side-by-Side Chevvai Dosha Placement & Nivrutti Table */}
      <div className="bg-white border border-rose-200 rounded-2xl p-4 space-y-3 shadow-xs">
        <h4 className="text-xs sm:text-sm font-bold text-rose-950 flex items-center gap-1.5 border-b border-rose-100 pb-2">
          <Flame className="w-4 h-4 text-rose-600" />
          {isTa ? 'செவ்வாய் தோஷ அமைவு மற்றும் சாஸ்திர நிவர்த்திகள்' : 'Chevvai Placements & Classical Sastric Nivrutti Comparison'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Bride's Box (Female - Left Side Default) */}
          <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
            <div className="flex justify-between items-center border-b border-rose-100 pb-1.5">
              <span className="font-bold text-rose-950 text-xs">
                {isTa ? 'மணமகள்' : 'Bride'}: {girl.name || 'Bride'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                girl.netHasDosha
                  ? 'bg-rose-100 text-rose-800'
                  : girl.isCancelled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {isTa ? girl.doshaLevelTamil : girl.doshaLevel}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span>{isTa ? 'லக்னத்திலிருந்து செவ்வாய்' : 'Mars from Lagna'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(girl.houses?.lagna || 7)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சந்திரனிலிருந்து செவ்வாய்' : 'Mars from Moon'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(girl.houses?.moon || 8)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சுக்கிரனிலிருந்து செவ்வாய்' : 'Mars from Venus'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(girl.houses?.venus || 2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'செவ்வாய் நின்ற ராசி' : 'Mars Sign'}:</span>
                <strong className="text-rose-900">{translateEntity('rashis', girl.marsRasi || 'Leo', lang)}</strong>
              </div>
            </div>

            {/* Nivrutti rules */}
            <div className="pt-2 border-t border-rose-100 text-[10.5px]">
              <span className="font-bold text-rose-950 block mb-1">
                {isTa ? 'சாஸ்திர நிவர்த்தி விவரம்:' : 'Applied Nivrutti / Exemption:'}
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {(girl.cancellations || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Groom's Box (Male - Right Side Default) */}
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex justify-between items-center border-b border-indigo-100 pb-1.5">
              <span className="font-bold text-indigo-950 text-xs">
                {isTa ? 'மணமகன்' : 'Groom'}: {boy.name || 'Groom'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                boy.netHasDosha
                  ? 'bg-rose-100 text-rose-800'
                  : boy.isCancelled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {isTa ? boy.doshaLevelTamil : boy.doshaLevel}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span>{isTa ? 'லக்னத்திலிருந்து செவ்வாய்' : 'Mars from Lagna'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(boy.houses?.lagna || 7)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சந்திரனிலிருந்து செவ்வாய்' : 'Mars from Moon'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(boy.houses?.moon || 8)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சுக்கிரனிலிருந்து செவ்வாய்' : 'Mars from Venus'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(boy.houses?.venus || 2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'செவ்வாய் நின்ற ராசி' : 'Mars Sign'}:</span>
                <strong className="text-indigo-900">{translateEntity('rashis', boy.marsRasi || 'Cancer', lang)}</strong>
              </div>
            </div>

            {/* Nivrutti rules */}
            <div className="pt-2 border-t border-indigo-100 text-[10.5px]">
              <span className="font-bold text-indigo-950 block mb-1">
                {isTa ? 'சாஸ்திர நிவர்த்தி விவரம்:' : 'Applied Nivrutti / Exemption:'}
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {(boy.cancellations || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Guja Dasha (Chevvai 7-Year Mahadasha) Timeline & Dasa Sandhi Matrix */}
      <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <h4 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            {isTa ? 'செவ்வாய் மகாதிசை (7 வருடங்கள்) கால அட்டவணை & தசா சந்தி ஆய்வு' : 'Guja Dasha (7-Year Mars Mahadasha) Timeline & Dasa Sandhi Verification'}
          </h4>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
            {isTa ? 'விம்சொத்தரி முறை' : 'Vimshottari 120-Yr System'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Bride's Guja Dasha Timeline Card (Female - Left Side Default) */}
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-amber-950">
                {isTa ? 'மணமகள் செவ்வாய் தசை' : "Bride's Guja Dasha (7 Yrs)"}
              </strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {isTa ? girl.gujaDasha?.statusTamil : girl.gujaDasha?.status}
              </span>
            </div>

            <div className="text-[11px] space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>{isTa ? 'தசா கால அளவு' : 'Operating Period'}:</span>
                <span className="font-bold text-slate-900">
                  {girl.gujaDasha?.startDate || '2035-06-10'} &rarr; {girl.gujaDasha?.endDate || '2042-06-10'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'செவ்வாய் தசை நடக்கும் வயது' : 'Age during Mars Dasha'}:</span>
                <span className="font-bold text-slate-900">
                  {isTa ? `${girl.gujaDasha?.startAge || 29} முதல் ${girl.gujaDasha?.endAge || 36} வயது வரை` : `Age ${girl.gujaDasha?.startAge || 29} to ${girl.gujaDasha?.endAge || 36}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'பிறப்பில் திசா இருப்பு' : 'Birth Dasha Balance'}:</span>
                <span className="font-bold text-rose-950">
                  {isTa ? girl.dashaBalanceTamil : girl.dashaBalance}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-amber-200">
                <span>{isTa ? 'தற்போது நடக்கும் தசை' : 'Current Active Dasha'}:</span>
                <span className="font-bold text-emerald-800">
                  {isTa ? girl.currentDasha?.lordTamil : girl.currentDasha?.lord} ({isTa ? 'முடிவு' : 'until'} {girl.currentDasha?.endDate})
                </span>
              </div>
            </div>
          </div>

          {/* Groom's Guja Dasha Timeline Card (Male - Right Side Default) */}
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-amber-950">
                {isTa ? 'மணமகன் செவ்வாய் தசை' : "Groom's Guja Dasha (7 Yrs)"}
              </strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {isTa ? boy.gujaDasha?.statusTamil : boy.gujaDasha?.status}
              </span>
            </div>

            <div className="text-[11px] space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>{isTa ? 'தசா கால அளவு' : 'Operating Period'}:</span>
                <span className="font-bold text-slate-900">
                  {boy.gujaDasha?.startDate || '2043-02-17'} &rarr; {boy.gujaDasha?.endDate || '2050-02-17'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'செவ்வாய் தசை நடக்கும் வயது' : 'Age during Mars Dasha'}:</span>
                <span className="font-bold text-slate-900">
                  {isTa ? `${boy.gujaDasha?.startAge || 38} முதல் ${boy.gujaDasha?.endAge || 45} வயது வரை` : `Age ${boy.gujaDasha?.startAge || 38} to ${boy.gujaDasha?.endAge || 45}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'பிறப்பில் திசா இருப்பு' : 'Birth Dasha Balance'}:</span>
                <span className="font-bold text-indigo-950">
                  {isTa ? boy.dashaBalanceTamil : boy.dashaBalance}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-amber-200">
                <span>{isTa ? 'தற்போது நடக்கும் தசை' : 'Current Active Dasha'}:</span>
                <span className="font-bold text-emerald-800">
                  {isTa ? boy.currentDasha?.lordTamil : boy.currentDasha?.lord} ({isTa ? 'முடிவு' : 'until'} {boy.currentDasha?.endDate})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dasa Sandhi & Sama Dasa Alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
          {/* Dasa Sandhi Status */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
            {dasaSandhi.hasSimultaneousSandhi ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-slate-900 block font-bold">
                {isTa ? 'தசா சந்தி ஆய்வு:' : 'Dasa Sandhi Analysis:'}
              </strong>
              <span className="text-slate-700">
                {isTa ? dasaSandhi.verdictTamil : dasaSandhi.verdict}
              </span>
            </div>
          </div>

          {/* Sama Dasa Status */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
            {samaCheck.isSimultaneous ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-slate-900 block font-bold">
                {isTa ? 'சம தசை ஆய்வு:' : 'Concurrent Mars Dasha (Sama Dasa):'}
              </strong>
              <span className="text-slate-700">
                {isTa ? samaCheck.verdictTamil : samaCheck.verdict}
              </span>
            </div>
          </div>
        </div>

        {/* Toggle to Show Complete 9 Mahadashas */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setShowAllDashas(!showAllDashas)}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            {showAllDashas
              ? (isTa ? '▲ 9 மகாதிசைகள் காலவரிசையை மறைக்கவும்' : '▲ Hide 9 Mahadashas Sequence')
              : (isTa ? '▼ இருவரின் முழு 9 மகாதிசைகள் காலவரிசையைக் காண்க' : '▼ View Complete 9 Mahadashas Sequence for Both')}
          </button>
        </div>

        {/* Full 9 Dashas Breakdown Table */}
        {showAllDashas && (
          <div className="pt-2 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10.5px]">
            {/* Groom's Dashas */}
            <div className="border border-indigo-200 rounded-xl overflow-hidden">
              <div className="bg-indigo-100/80 p-1.5 font-bold text-indigo-950 text-center">
                {isTa ? 'மணமகன் 9 மகாதிசைகள்' : "Groom's 9 Mahadashas"}
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="p-1.5">{isTa ? 'திசை' : 'Lord'}</th>
                    <th className="p-1.5">{isTa ? 'வருடம்' : 'Yrs'}</th>
                    <th className="p-1.5">{isTa ? 'ஆரம்பம் - முடிவு' : 'Dates'}</th>
                    <th className="p-1.5 text-right">{isTa ? 'வயது' : 'Age'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(boy.allDashas || []).map((d, i) => (
                    <tr key={i} className={d.lordId === 'mars' ? 'bg-rose-50 font-bold text-rose-900' : 'hover:bg-slate-50'}>
                      <td className="p-1.5">{isTa ? d.lordTamil : d.lord}</td>
                      <td className="p-1.5">{d.durationYears}</td>
                      <td className="p-1.5 font-mono text-[9.5px]">{d.startDate} &rarr; {d.endDate}</td>
                      <td className="p-1.5 text-right">{d.startAge}-{d.endAge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bride's Dashas */}
            <div className="border border-rose-200 rounded-xl overflow-hidden">
              <div className="bg-rose-100/80 p-1.5 font-bold text-rose-950 text-center">
                {isTa ? 'மணமகள் 9 மகாதிசைகள்' : "Bride's 9 Mahadashas"}
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="p-1.5">{isTa ? 'திசை' : 'Lord'}</th>
                    <th className="p-1.5">{isTa ? 'வருடம்' : 'Yrs'}</th>
                    <th className="p-1.5">{isTa ? 'ஆரம்பம் - முடிவு' : 'Dates'}</th>
                    <th className="p-1.5 text-right">{isTa ? 'வயது' : 'Age'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(girl.allDashas || []).map((d, i) => (
                    <tr key={i} className={d.lordId === 'mars' ? 'bg-rose-50 font-bold text-rose-900' : 'hover:bg-slate-50'}>
                      <td className="p-1.5">{isTa ? d.lordTamil : d.lord}</td>
                      <td className="p-1.5">{d.durationYears}</td>
                      <td className="p-1.5 font-mono text-[9.5px]">{d.startDate} &rarr; {d.endDate}</td>
                      <td className="p-1.5 text-right">{d.startAge}-{d.endAge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Classical Astrological Remedies (பரிகாரங்கள் & சாந்தி) */}
      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl space-y-1.5 text-xs text-amber-950">
        <strong className="font-bold flex items-center gap-1.5 text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          {isTa ? 'செவ்வாய் தோஷ & தசா சாஸ்திரப் பரிகாரங்கள் (பரிந்துரை):' : 'Classical Sastric Remedies & Auspicious Guidance for Chevvai:'}
        </strong>
        <ul className="list-disc pl-4 space-y-1 text-slate-800 text-[11px] leading-relaxed">
          {remedies.map((rem, rIdx) => (
            <li key={rIdx}>{rem}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
