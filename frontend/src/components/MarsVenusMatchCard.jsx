import React, { useState } from 'react';
import { HeartHandshake, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLang } from '../i18n';

const SOUTH_CELLS = [
  { r: 0, c: 0, rasi: 11 }, { r: 0, c: 1, rasi: 0 }, { r: 0, c: 2, rasi: 1 }, { r: 0, c: 3, rasi: 2 },
  { r: 1, c: 3, rasi: 3 },  { r: 2, c: 3, rasi: 4 }, { r: 3, c: 3, rasi: 5 }, { r: 3, c: 2, rasi: 6 },
  { r: 3, c: 1, rasi: 7 },  { r: 3, c: 0, rasi: 8 }, { r: 2, c: 0, rasi: 9 }, { r: 1, c: 0, rasi: 10 },
];

const RASI_SHORT_TA = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];
const RASI_SHORT_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

const SHORT_CODE_TA = {
  lagna: 'லக்', ascendant: 'லக்', mars: 'செவ்', venus: 'சுக்',
  moon: 'சந்', jupiter: 'குரு', sun: 'சூரி', mercury: 'புத',
  saturn: 'சனி', rahu: 'ராகு', ketu: 'கேது'
};
const SHORT_CODE_EN = {
  lagna: 'Asc', ascendant: 'Asc', mars: 'Mar', venus: 'Ven',
  moon: 'Moo', jupiter: 'Jup', sun: 'Sun', mercury: 'Mer',
  saturn: 'Sat', rahu: 'Rah', ketu: 'Ket'
};

function getOccupantRole(o) {
  if (o.id) return o.id;
  if (o.isLagna) return 'lagna';
  if (o.isMars) return 'mars';
  if (o.isMoon) return 'moon';
  if (o.isVenus) return 'venus';
  if (o.isJupiter) return 'jupiter';
  return (o.name || '').toLowerCase();
}

function formatOccupantLabel(o, isTa) {
  if (isTa && o.ta) return o.ta;
  if (!isTa && o.short) return o.short;
  const role = getOccupantRole(o);
  return (isTa ? SHORT_CODE_TA[role] : SHORT_CODE_EN[role]) || o.short || o.name || o.code || '';
}

function getFallbackMoonIdx(person) {
  if (typeof person?.moonRasiIdx === 'number') return person.moonRasiIdx;
  const moonBox = (person?.chartBoxes || []).find((b) =>
    (b.occupants || []).some((o) => getOccupantRole(o) === 'moon')
  );
  if (moonBox) return moonBox.signIdx ?? moonBox.rasi;
  return person?.lagnaRasiIdx ?? 0;
}

function PersonMarsVenusCard({ person, title, isBride, isTa, isRasi }) {
  const byRasi = {};
  (person?.chartBoxes || []).forEach((b) => {
    const idx = b.rasi ?? b.signIdx;
    if (typeof idx === 'number') byRasi[idx] = b.occupants || [];
  });

  const moonIdx = getFallbackMoonIdx(person);
  const marsHouse = isRasi
    ? (person.marsHouseFromMoon ?? (((person.marsRasiIdx - moonIdx + 12) % 12) + 1))
    : person.marsHouse;
  const venusHouse = isRasi
    ? (person.venusHouseFromMoon ?? (((person.venusRasiIdx - moonIdx + 12) % 12) + 1))
    : person.venusHouse;
  const activeScore = isRasi ? (person.rasiScore ?? person.score) : person.score;
  const activeStatusKey = isRasi ? (person.rasiStatus || person.status) : person.status;
  const activeStatusLabel = isRasi
    ? (isTa ? (person.rasiStatusTa || person.statusTa) : (person.rasiStatus || person.status))
    : (isTa ? person.statusTa : person.status);
  const refRasiLabel = isRasi
    ? (isTa ? (person.moonRasiTa || RASI_SHORT_TA[moonIdx]) : (person.moonRasi || RASI_SHORT_EN[moonIdx]))
    : (isTa ? person.lagnaRasiTa : person.lagnaRasi);
  const refRasiIdx = isRasi ? moonIdx : person.lagnaRasiIdx;

  return (
    <div className={`border rounded-xl p-3 space-y-2.5 ${isBride ? 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50' : 'bg-indigo-50/40 dark:bg-indigo-950/35 border-indigo-200 dark:border-indigo-800/50'}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className={isBride ? 'text-rose-900 dark:text-rose-300' : 'text-indigo-900 dark:text-indigo-300'}>{title}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          activeStatusKey === 'Strong'
            ? 'bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300'
            : activeStatusKey === 'Balanced'
            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
            : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
        }`}>
          {activeStatusLabel} ({activeScore}%)
        </span>
      </div>

      {/* South Indian Mini Chart Highlighting Mars, Venus & Reference (Lagnam / Moon Rasi) */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[210px] mx-auto border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#1E1815] text-[9px]">
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="col-span-2 row-span-2 relative overflow-hidden flex flex-col items-center justify-center bg-pink-50/60 dark:bg-pink-950/30 border border-stone-200 dark:border-stone-700 p-1 text-center">
                    <img
                      src="/sri-yantra-center.png"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute inset-0 m-auto w-[84%] h-[84%] object-contain opacity-[0.13] dark:opacity-[0.18]"
                    />
                    <span className="relative z-10 font-black text-[9.5px] text-[#7A1A22] dark:text-amber-300">
                      {isTa ? 'செவ்வாய்–சுக்கிரன்' : 'Mars – Venus'}
                    </span>
                    <span className="relative z-10 text-[8px] font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                      {isRasi
                        ? (isTa ? `ராசி: ${refRasiLabel}` : `Rasi: ${refRasiLabel}`)
                        : (isTa ? `லக்னம்: ${refRasiLabel}` : `Asc: ${refRasiLabel}`)}
                    </span>
                    <span className="relative z-10 text-[7.5px] text-stone-500 dark:text-stone-400">
                      {isTa ? `செவ் ${marsHouse} | சுக் ${venusHouse}` : `Mar H${marsHouse} | Ven H${venusHouse}`}
                    </span>
                  </div>
                );
              }
              return null;
            }
            const cell = SOUTH_CELLS.find(x => x.r === r && x.c === c);
            if (!cell) return null;
            const occupants = byRasi[cell.rasi] || [];
            const hasMars = cell.rasi === person.marsRasiIdx;
            const hasVenus = cell.rasi === person.venusRasiIdx;
            const isRefCell = cell.rasi === refRasiIdx;
            return (
              <div
                key={`${r}-${c}`}
                className={`border border-stone-200 dark:border-stone-700 p-0.5 flex flex-col justify-between overflow-hidden ${
                  hasMars && hasVenus
                    ? 'bg-purple-100/80 ring-1 ring-inset ring-purple-500'
                    : hasMars
                    ? 'bg-rose-100/70 dark:bg-rose-900/40'
                    : hasVenus
                    ? 'bg-pink-100/70 dark:bg-pink-900/40'
                    : isRefCell
                    ? (isRasi ? 'bg-indigo-50/80 dark:bg-indigo-950/35 ring-1 ring-inset ring-indigo-300' : 'bg-stone-100/70 dark:bg-stone-800/80')
                    : 'bg-white dark:bg-[#1E1815]'
                }`}
              >
                <div className="flex flex-wrap gap-0.5">
                  {occupants.map((o, idx) => {
                    const role = getOccupantRole(o);
                    return (
                      <span
                        key={idx}
                        className={`px-0.5 rounded font-bold ${
                          role === 'mars'
                            ? 'bg-rose-600 text-white'
                            : role === 'venus'
                            ? 'bg-pink-600 text-white'
                            : role === 'moon' && isRasi
                            ? 'bg-indigo-700 text-white'
                            : (role === 'ascendant' || role === 'lagna') && !isRasi
                            ? 'bg-stone-800 text-white'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {formatOccupantLabel(o, isTa)}
                      </span>
                    );
                  })}
                </div>
                <div className="text-[7px] text-stone-400 text-right leading-none">
                  {isTa ? RASI_SHORT_TA[cell.rasi] : RASI_SHORT_EN[cell.rasi]}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Metrics Table */}
      <div className="bg-white dark:bg-[#1E1815] rounded-lg border border-stone-200 dark:border-stone-700 p-2.5 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">
            {isRasi
              ? (isTa ? 'சந்திர ராசி:' : 'Moon Rasi:')
              : (isTa ? 'லக்னம்:' : 'Lagnam:')}
          </span>
          <strong className="text-stone-900 dark:text-stone-100">{refRasiLabel}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">
            {isRasi
              ? (isTa ? 'செவ்வாய் (ராசியிலிருந்து):' : 'Mars (from Rasi):')
              : (isTa ? 'செவ்வாய் (லக்னத்திலிருந்து):' : 'Mars (from Lagnam):')}
          </span>
          <strong className="text-rose-800 dark:text-rose-300">
            {isTa
              ? `${person.marsRasiTa} (${marsHouse}-ம் வீடு, ${person.marsDignityTa})`
              : `${person.marsRasi} (H${marsHouse}, ${person.marsDignity})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">
            {isRasi
              ? (isTa ? 'சுக்கிரன் (ராசியிலிருந்து):' : 'Venus (from Rasi):')
              : (isTa ? 'சுக்கிரன் (லக்னத்திலிருந்து):' : 'Venus (from Lagnam):')}
          </span>
          <strong className="text-pink-800">
            {isTa
              ? `${person.venusRasiTa} (${venusHouse}-ம் வீடு, ${person.venusDignityTa})`
              : `${person.venusRasi} (H${venusHouse}, ${person.venusDignity})`}
          </strong>
        </div>
        <div className="flex justify-between border-t border-stone-100 dark:border-stone-800 pt-1">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'செவ்வாய்–சுக்கிரன் தொடர்பு:' : 'Mars–Venus Relation:'}</span>
          <strong className={
            person.relationTone === 'harmonious'
              ? 'text-emerald-700 dark:text-emerald-400'
              : person.relationTone === 'sensitive'
              ? 'text-rose-700 dark:text-rose-400'
              : 'text-amber-700 dark:text-amber-400'
          }>
            {isTa ? person.relationTa : person.relationEn}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'சுக்கிரன் மீது குரு பார்வை:' : 'Jupiter Aspect on Venus:'}</span>
          <strong className={person.jupAspectVenus ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}>
            {person.jupAspectVenus ? (isTa ? 'உண்டு (சுப பலம்)' : 'Yes (Auspicious)') : (isTa ? 'இல்லை' : 'No')}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default function MarsVenusMatchCard({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';
  const [basis, setBasis] = useState('lagnam');

  const mv = matchReport?.marsVenusAnalysis;
  if (!mv) return null;

  const { boy, girl, brideVenToGroomMar, groomVenToBrideMar, cross1Good, cross2Good } = mv;
  const isRasi = basis === 'rasi';

  const boyMoonIdx = getFallbackMoonIdx(boy);
  const girlMoonIdx = getFallbackMoonIdx(girl);
  const rasiInfo = mv.rasiAnalysis || {
    brideVenToGroomMoon: ((girl.venusRasiIdx - boyMoonIdx + 12) % 12) + 1,
    groomVenToBrideMoon: ((boy.venusRasiIdx - girlMoonIdx + 12) % 12) + 1,
    brideMarToGroomMoon: ((girl.marsRasiIdx - boyMoonIdx + 12) % 12) + 1,
    groomMarToBrideMoon: ((boy.marsRasiIdx - girlMoonIdx + 12) % 12) + 1,
    crossVenGroomMoonGood: [1, 2, 4, 5, 7, 9, 10, 11].includes(((girl.venusRasiIdx - boyMoonIdx + 12) % 12) + 1),
    crossVenBrideMoonGood: [1, 2, 4, 5, 7, 9, 10, 11].includes(((boy.venusRasiIdx - girlMoonIdx + 12) % 12) + 1),
    combinedScore: mv.combinedScore,
    verdictEn: mv.verdictEn,
    verdictTa: mv.verdictTa,
  };

  const activeScore = isRasi ? rasiInfo.combinedScore : mv.combinedScore;
  const activeVerdict = isRasi
    ? (isTa ? rasiInfo.verdictTa : rasiInfo.verdictEn)
    : (isTa ? mv.verdictTa : mv.verdictEn);

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 0. Lagnam vs Rasi Basis Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-50 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2">
        <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
          {isTa ? 'ஆய்வு அடிப்படை:' : 'Analysis Basis:'}
        </span>
        <div className="inline-flex rounded-lg bg-white dark:bg-[#1E1815] border border-stone-200 dark:border-stone-700 p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setBasis('lagnam')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
              !isRasi
                ? 'bg-[#7A1A22] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {isTa ? 'லக்னம் (Lagnam-Based)' : 'Lagnam-Based'}
          </button>
          <button
            type="button"
            onClick={() => setBasis('rasi')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
              isRasi
                ? 'bg-[#7A1A22] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {isTa ? 'ராசி (Rasi-Based)' : 'Rasi-Based (Moon Rasi)'}
          </button>
        </div>
      </div>

      {/* 1. Overall Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        activeScore >= 72
          ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
          : activeScore >= 55
          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-200'
          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white dark:bg-[#1E1815] border border-black/10 shrink-0">
            <HeartHandshake className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm">
              {isRasi
                ? (isTa ? 'செவ்வாய் & சுக்கிரன் – ராசி இணக்க ஆய்வு' : 'Mars & Venus – Rasi (Moon Sign) Compatibility Analysis')
                : (isTa ? 'செவ்வாய் & சுக்கிரன் – லக்ன இணக்க ஆய்வு' : 'Mars & Venus – Lagnam Compatibility Analysis')}
            </div>
            <p className="text-[11px] font-medium mt-0.5">
              {activeVerdict}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white dark:bg-[#1E1815] px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-[#7A1A22] dark:text-amber-300">{activeScore}%</div>
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            {isTa ? 'இணக்க மதிப்பெண்' : 'Harmony Score'}
          </div>
        </div>
      </div>

      {/* 2. Bride (Left) vs Groom (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonMarsVenusCard
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
          isRasi={isRasi}
        />
        <PersonMarsVenusCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
          isRasi={isRasi}
        />
      </div>

      {/* 3. Couple Cross-Resonance */}
      {isRasi ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between gap-2">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {isTa ? 'மணமகன் ராசிக்கு மணமகள் சுக் / செவ்:' : 'Bride Ven / Mar from Groom Rasi:'}
            </span>
            <span className={`font-bold flex items-center gap-1 shrink-0 ${rasiInfo.crossVenGroomMoonGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {rasiInfo.crossVenGroomMoonGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>
                {isTa
                  ? `சுக் ${rasiInfo.brideVenToGroomMoon} | செவ் ${rasiInfo.brideMarToGroomMoon}`
                  : `Ven H${rasiInfo.brideVenToGroomMoon} | Mar H${rasiInfo.brideMarToGroomMoon}`}
              </span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between gap-2">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {isTa ? 'மணமகள் ராசிக்கு மணமகன் சுக் / செவ்:' : 'Groom Ven / Mar from Bride Rasi:'}
            </span>
            <span className={`font-bold flex items-center gap-1 shrink-0 ${rasiInfo.crossVenBrideMoonGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {rasiInfo.crossVenBrideMoonGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>
                {isTa
                  ? `சுக் ${rasiInfo.groomVenToBrideMoon} | செவ் ${rasiInfo.groomMarToBrideMoon}`
                  : `Ven H${rasiInfo.groomVenToBrideMoon} | Mar H${rasiInfo.groomMarToBrideMoon}`}
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {isTa ? 'மணமகள் சுக்கிரன் ↔ மணமகன் செவ்வாய்:' : 'Bride Venus ↔ Groom Mars:'}
            </span>
            <span className={`font-bold flex items-center gap-1 ${cross1Good ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {cross1Good ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{isTa ? `${brideVenToGroomMar}-ம் வீடு (${cross1Good ? 'நல்லது' : 'சமநிலை'})` : `H${brideVenToGroomMar} (${cross1Good ? 'Harmonious' : 'Moderate'})`}</span>
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {isTa ? 'மணமகன் சுக்கிரன் ↔ மணமகள் செவ்வாய்:' : 'Groom Venus ↔ Bride Mars:'}
            </span>
            <span className={`font-bold flex items-center gap-1 ${cross2Good ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {cross2Good ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{isTa ? `${groomVenToBrideMar}-ம் வீடு (${cross2Good ? 'நல்லது' : 'சமநிலை'})` : `H${groomVenToBrideMar} (${cross2Good ? 'Harmonious' : 'Moderate'})`}</span>
            </span>
          </div>
        </div>
      )}

      {/* 4. Classical Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22] dark:text-amber-300">
            {isTa ? 'சாஸ்திர குறிப்பு:' : 'Classical Note:'}
          </strong>{' '}
          {isRasi
            ? (isTa
                ? 'சந்திர ராசியிலிருந்து சுக்கிரன் மற்றும் செவ்வாய் நிற்கும் பாவ நிலை, பரஸ்பர பார்வை மற்றும் துணையின் சந்திர ராசிக்கு ஏற்ப சுக்கிரன்/செவ்வாய் இணக்கம் ஆகியவை மன ஒற்றுமையையும் இல்லற இனிமையையும் காட்டுகின்றன.'
                : 'The house placement of Venus and Mars from Moon Rasi (Chandra Lagna), their mutual aspects, and how each partner’s Venus and Mars fall relative to the other’s Moon Rasi reflect emotional rapport and marital harmony.')
            : (isTa
                ? 'லக்னத்திலிருந்து சுக்கிரன் (களத்திர காரகன்) மற்றும் செவ்வாய் ஆகியோரின் பாவ நிலை, பரஸ்பர பார்வை மற்றும் மணமகள்–மணமகன் குறுக்கு இணைப்பு ஆகியவை இல்லற அன்பையும் ஒற்றுமையையும் காட்டுகின்றன.'
                : 'The house placement of Kalathirakaraka Venus and Mars from Lagnam, their mutual aspects, and cross-couple Venus–Mars resonance indicate marital warmth and compatibility.')}
        </div>
      </div>
    </div>
  );
}
