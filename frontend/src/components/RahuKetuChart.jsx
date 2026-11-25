import React, { useState } from 'react';
import {
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
  Zap,
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

export default function RahuKetuChart({ matchReport }) {
  const { lang = 'en' } = useLang();
  const [showDashaDetails, setShowDashaDetails] = useState(false);

  if (!matchReport) return null;

  const rkData = matchReport.rahuKetuAnalysis || {};
  const boy = rkData.boy || {};
  const girl = rkData.girl || {};
  const doshaSamyam = rkData.doshaSamyam || {};
  const remedies = lang === 'ta' ? (rkData.remediesTamil || []) : (rkData.remedies || []);

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

  // Renders a single South Indian 4x4 Grid for a person with Rahu-Ketu highlights
  const renderSouthIndianGrid = (person, title, isGroom = true) => {
    const cellsBySign = {};
    (person.chartCells || []).forEach((c) => {
      cellsBySign[c.signIdx] = c;
    });

    return (
      <div className="bg-white border-2 border-stone-800 rounded-none overflow-hidden shadow-xs">
        {/* Top Header */}
        <div className={`p-2 font-black text-xs sm:text-sm text-center flex items-center justify-between border-b-2 border-stone-800 ${
          isGroom ? 'bg-teal-50 text-teal-950' : 'bg-purple-50 text-purple-950'
        }`}>
          <span className="flex items-center gap-1.5 font-bold">
            <Compass className="w-4 h-4 text-teal-700" />
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
                      className="col-span-2 row-span-2 border border-stone-800 flex flex-col items-center justify-center p-2 text-center bg-teal-50/40 relative"
                    >
                      <span className="text-xs uppercase font-black tracking-widest text-teal-950">
                        {isTa ? 'சர்ப்ப ராசிக் கட்டம்' : 'SARPA RASI (D1)'}
                      </span>
                      <span className="text-[10px] font-bold text-stone-700 mt-0.5">
                        {person.starTamil || person.star || 'Mula'}
                        {person.pada ? ` (${person.pada})` : ''}
                      </span>
                      <span className="text-[9px] text-stone-500 font-medium">
                        {translateEntity('rashis', person.moonRasi || 'Sagittarius', lang)}
                      </span>
                      <div className="mt-1 flex items-center gap-1 text-[8.5px] font-bold text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded-full border border-teal-300">
                        <Zap className="w-2.5 h-2.5" />
                        {isTa ? person.axisNameTamil : person.axisName}
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
                  <div className="text-[8.5px] font-bold text-stone-400 uppercase tracking-tighter truncate">
                    {signName}
                  </div>

                  <div className="flex flex-col gap-0.5 my-auto">
                    {occupants.map((occ, oIdx) => {
                      if (occ.isRahu) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9.5px] bg-teal-700 text-white shadow-2xs"
                            title={`Rahu in ${signName} (${occ.houseFromLagna}th house from Lagna)`}
                          >
                            <Zap className="w-2.5 h-2.5" />
                            {isTa ? 'ராகு' : 'Rahu'}
                            <span className="text-[8px] bg-white text-teal-900 px-1 rounded-xs font-bold">
                              {occ.houseFromLagna}
                            </span>
                          </span>
                        );
                      }
                      if (occ.isKetu) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-black text-[9.5px] bg-purple-700 text-white shadow-2xs"
                            title={`Ketu in ${signName} (${occ.houseFromLagna}th house from Lagna)`}
                          >
                            <Zap className="w-2.5 h-2.5" />
                            {isTa ? 'கேது' : 'Ketu'}
                            <span className="text-[8px] bg-white text-purple-900 px-1 rounded-xs font-bold">
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
                      if (occ.isMars) {
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center px-1 py-0.2 rounded font-bold text-[9px] bg-rose-100 text-rose-900 border border-rose-300"
                          >
                            {isTa ? 'செவ்' : 'Mars'}
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
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-purple-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 border border-teal-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-teal-800/80 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-teal-500/30 text-teal-200 px-2.5 py-0.5 rounded-full border border-teal-400/30 inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-teal-300" />
              {isTa ? 'ராகு-கேது சர்ப்ப தோஷப் பகுப்பாய்வு' : 'Rahu-Ketu (Sarpa) Dosha & Axis Analysis'}
            </span>
            <h3 className="text-base sm:text-xl font-black mt-1">
              {isTa
                ? 'ஜாதகக் கட்டம், சர்ப்ப தோஷ அச்சு & மகாதிசை ஆய்வு'
                : 'South Indian Kundli Chart, Nodal Axis & Rahu-Ketu Mahadasha Timeline'}
            </h3>
          </div>

          {/* Dosha Samyam Status Badge */}
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] font-bold text-teal-200 block uppercase tracking-wider">
              {isTa ? 'சர்ப்ப தோஷ சமநிலை முடிவு' : 'Sarpa Samyam Verdict'}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 justify-end">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isTa ? doshaSamyam.verdictTamil : doshaSamyam.verdict}
            </span>
          </div>
        </div>

        <p className="text-xs text-teal-100/90 leading-relaxed">
          {doshaSamyam.summary}
        </p>
      </div>

      {/* 2. Dual South Indian Rasi Charts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-700" />
            {isTa ? 'இருவர் சர்ப்ப ராசிக் கட்டங்கள் (ராகு-கேது நிலை)' : 'Groom & Bride Nodal Axis Kundli Charts'}
          </h4>
          <span className="text-[11px] text-slate-500">
            {isTa ? 'தென்னிந்திய முறை' : 'Classical South Indian Nirayana Format'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSouthIndianGrid(boy, isTa ? 'மணமகன் ஜாதகம்' : "Groom's Chart", true)}
          {renderSouthIndianGrid(girl, isTa ? 'மணமகள் ஜாதகம்' : "Bride's Chart", false)}
        </div>
      </div>

      {/* 3. Side-by-Side Nodal Placements & Sastric Nivrutti Comparison */}
      <div className="bg-white border border-teal-200 rounded-2xl p-4 space-y-3 shadow-xs">
        <h4 className="text-xs sm:text-sm font-bold text-teal-950 flex items-center gap-1.5 border-b border-teal-100 pb-2">
          <Zap className="w-4 h-4 text-teal-700" />
          {isTa ? 'ராகு-கேது அச்சு அமைவு மற்றும் சாஸ்திர நிவர்த்திகள்' : 'Rahu-Ketu Placements & Classical Sastric Nivrutti Comparison'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Groom's Box */}
          <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 space-y-2">
            <div className="flex justify-between items-center border-b border-teal-100 pb-1.5">
              <span className="font-bold text-teal-950 text-xs">
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
                <span>{isTa ? 'சர்ப்ப தோஷ அச்சு' : 'Active Nodal Axis'}:</span>
                <strong className="text-teal-950">{isTa ? boy.axisNameTamil : boy.axisName}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'லக்னத்திலிருந்து ராகு' : 'Rahu from Lagna'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(boy.houses?.lagnaRahu || 9)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'லக்னத்திலிருந்து கேது' : 'Ketu from Lagna'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(boy.houses?.lagnaKetu || 3)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சந்திரனிலிருந்து ராகு / கேது' : 'Rahu / Ketu from Moon'}:</span>
                <strong className="text-slate-900">
                  {formatHouseOrdinal(boy.houses?.moonRahu || 1)} / {formatHouseOrdinal(boy.houses?.moonKetu || 7)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சுக்கிரனிலிருந்து ராகு / கேது' : 'Rahu / Ketu from Venus'}:</span>
                <strong className="text-slate-900">
                  {formatHouseOrdinal(boy.houses?.venusRahu || 1)} / {formatHouseOrdinal(boy.houses?.venusKetu || 7)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'ராகு & கேது நின்ற ராசி' : 'Rahu & Ketu Signs'}:</span>
                <strong className="text-teal-900">
                  {translateEntity('rashis', boy.rahuRasi || 'Aries', lang)} / {translateEntity('rashis', boy.ketuRasi || 'Libra', lang)}
                </strong>
              </div>
            </div>

            {/* Nivrutti rules */}
            <div className="pt-2 border-t border-teal-100 text-[10.5px]">
              <span className="font-bold text-teal-950 block mb-1">
                {isTa ? 'சாஸ்திர நிவர்த்தி விவரம்:' : 'Applied Nivrutti / Exemption:'}
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {(boy.cancellations || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bride's Box */}
          <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2">
            <div className="flex justify-between items-center border-b border-purple-100 pb-1.5">
              <span className="font-bold text-purple-950 text-xs">
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
                <span>{isTa ? 'சர்ப்ப தோஷ அச்சு' : 'Active Nodal Axis'}:</span>
                <strong className="text-purple-950">{isTa ? girl.axisNameTamil : girl.axisName}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'லக்னத்திலிருந்து ராகு' : 'Rahu from Lagna'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(girl.houses?.lagnaRahu || 4)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'லக்னத்திலிருந்து கேது' : 'Ketu from Lagna'}:</span>
                <strong className="text-slate-900">{formatHouseOrdinal(girl.houses?.lagnaKetu || 10)}</strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சந்திரனிலிருந்து ராகு / கேது' : 'Rahu / Ketu from Moon'}:</span>
                <strong className="text-slate-900">
                  {formatHouseOrdinal(girl.houses?.moonRahu || 1)} / {formatHouseOrdinal(girl.houses?.moonKetu || 7)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'சுக்கிரனிலிருந்து ராகு / கேது' : 'Rahu / Ketu from Venus'}:</span>
                <strong className="text-slate-900">
                  {formatHouseOrdinal(girl.houses?.venusRahu || 1)} / {formatHouseOrdinal(girl.houses?.venusKetu || 7)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>{isTa ? 'ராகு & கேது நின்ற ராசி' : 'Rahu & Ketu Signs'}:</span>
                <strong className="text-purple-900">
                  {translateEntity('rashis', girl.rahuRasi || 'Leo', lang)} / {translateEntity('rashis', girl.ketuRasi || 'Aquarius', lang)}
                </strong>
              </div>
            </div>

            {/* Nivrutti rules */}
            <div className="pt-2 border-t border-purple-100 text-[10.5px]">
              <span className="font-bold text-purple-950 block mb-1">
                {isTa ? 'சாஸ்திர நிவர்த்தி விவரம்:' : 'Applied Nivrutti / Exemption:'}
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {(girl.cancellations || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Rahu & Ketu Mahadashas Timeline */}
      <div className="bg-white border border-teal-200 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-teal-100 pb-2">
          <h4 className="text-xs sm:text-sm font-bold text-teal-950 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-700" />
            {isTa ? 'ராகு (18 வருடங்கள்) & கேது (7 வருடங்கள்) மகாதிசை கால அட்டவணை' : 'Rahu (18 Yrs) & Ketu (7 Yrs) Mahadasha Operating Periods'}
          </h4>
          <span className="text-[10px] font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
            {isTa ? 'விம்சொத்தரி முறை' : 'Vimshottari System'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Groom's Timeline */}
          <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-200/80 space-y-2">
            <strong className="text-teal-950 block">
              {isTa ? 'மணமகன் ராகு & கேது திசை' : "Groom's Nodal Mahadashas"}
            </strong>

            <div className="text-[11px] space-y-1.5 text-slate-700">
              <div className="flex justify-between items-center p-1.5 bg-white rounded border border-teal-100">
                <span>{isTa ? 'கேது மகாதிசை (7 வருடம்)' : 'Ketu Mahadasha (7y)'}:</span>
                <span className="font-bold text-slate-900">
                  {boy.ketuDasha?.startDate || 'Birth'} &rarr; {boy.ketuDasha?.endDate || '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-white rounded border border-teal-100">
                <span>{isTa ? 'ராகு மகாதிசை (18 வருடம்)' : 'Rahu Mahadasha (18y)'}:</span>
                <span className="font-bold text-slate-900">
                  {boy.rahuDasha?.startDate || '-'} &rarr; {boy.rahuDasha?.endDate || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Bride's Timeline */}
          <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-200/80 space-y-2">
            <strong className="text-purple-950 block">
              {isTa ? 'மணமகள் ராகு & கேது திசை' : "Bride's Nodal Mahadashas"}
            </strong>

            <div className="text-[11px] space-y-1.5 text-slate-700">
              <div className="flex justify-between items-center p-1.5 bg-white rounded border border-purple-100">
                <span>{isTa ? 'கேது மகாதிசை (7 வருடம்)' : 'Ketu Mahadasha (7y)'}:</span>
                <span className="font-bold text-slate-900">
                  {girl.ketuDasha?.startDate || '-'} &rarr; {girl.ketuDasha?.endDate || '-'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1.5 bg-white rounded border border-purple-100">
                <span>{isTa ? 'ராகு மகாதிசை (18 வருடம்)' : 'Rahu Mahadasha (18y)'}:</span>
                <span className="font-bold text-slate-900">
                  {girl.rahuDasha?.startDate || '-'} &rarr; {girl.rahuDasha?.endDate || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Classical Remedies (பரிகாரங்கள் & சாந்தி) */}
      <div className="p-3.5 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-300 rounded-xl space-y-1.5 text-xs text-teal-950">
        <strong className="font-bold flex items-center gap-1.5 text-teal-900">
          <Sparkles className="w-4 h-4 text-teal-700" />
          {isTa ? 'ராகு-கேது சர்ப்ப தோஷ சாஸ்திரப் பரிகாரங்கள் (பரிந்துரை):' : 'Classical Sastric Remedies & Auspicious Guidance for Rahu-Ketu:'}
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
