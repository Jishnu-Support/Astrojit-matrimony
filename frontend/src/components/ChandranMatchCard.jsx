import React from 'react';
import { Moon, Sparkles, CheckCircle2, AlertTriangle, HeartHandshake } from 'lucide-react';
import { useLang } from '../i18n';

const SOUTH_CELLS = [
  { r: 0, c: 0, rasi: 11 }, { r: 0, c: 1, rasi: 0 }, { r: 0, c: 2, rasi: 1 }, { r: 0, c: 3, rasi: 2 },
  { r: 1, c: 3, rasi: 3 },  { r: 2, c: 3, rasi: 4 }, { r: 3, c: 3, rasi: 5 }, { r: 3, c: 2, rasi: 6 },
  { r: 3, c: 1, rasi: 7 },  { r: 3, c: 0, rasi: 8 }, { r: 2, c: 0, rasi: 9 }, { r: 1, c: 0, rasi: 10 },
];

const RASI_SHORT_TA = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];
const RASI_SHORT_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

const SHORT_CODE_TA = {
  lagna: 'லக்', ascendant: 'லக்', moon: 'சந்', jupiter: 'குரு',
  saturn: 'சனி', mars: 'செவ்', venus: 'சுக்', mercury: 'புத',
  sun: 'சூரி', rahu: 'ராகு', ketu: 'கேது'
};
const SHORT_CODE_EN = {
  lagna: 'Asc', ascendant: 'Asc', moon: 'Moo', jupiter: 'Jup',
  saturn: 'Sat', mars: 'Mar', venus: 'Ven', mercury: 'Mer',
  sun: 'Sun', rahu: 'Rah', ketu: 'Ket'
};

function getOccupantRole(o) {
  if (o.id) return o.id;
  if (o.isLagna) return 'lagna';
  if (o.isMoon) return 'moon';
  if (o.isJupiter) return 'jupiter';
  if (o.isMars) return 'mars';
  if (o.isVenus) return 'venus';
  return (o.name || '').toLowerCase();
}

function formatOccupantLabel(o, isTa) {
  if (isTa && o.ta) return o.ta;
  if (!isTa && o.short) return o.short;
  const role = getOccupantRole(o);
  return (isTa ? SHORT_CODE_TA[role] : SHORT_CODE_EN[role]) || o.short || o.name || '';
}

function formatOrd(n) {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function PersonChandranCard({ person, title, isBride, isTa }) {
  const byRasi = {};
  (person?.chartBoxes || []).forEach((b) => {
    const idx = b.rasi ?? b.signIdx;
    if (typeof idx === 'number') byRasi[idx] = b.occupants || [];
  });

  return (
    <div className={`border rounded-xl p-3 space-y-2.5 ${isBride ? 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50' : 'bg-indigo-50/40 dark:bg-indigo-950/35 border-indigo-200 dark:border-indigo-800/50'}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className={isBride ? 'text-rose-900 dark:text-rose-300' : 'text-indigo-900 dark:text-indigo-300'}>{title}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          person.status === 'Strong'
            ? 'bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300'
            : person.status === 'Balanced'
            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
            : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
        }`}>
          {isTa ? person.statusTa : person.status} ({person.score}%)
        </span>
      </div>

      {/* South Indian Mini Chart Highlighting Moon, Jupiter & Saturn */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[210px] mx-auto border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#1E1815] text-[9px]">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="col-span-2 row-span-2 relative overflow-hidden flex flex-col items-center justify-center bg-indigo-50/70 dark:bg-indigo-950/35 border border-stone-200 dark:border-stone-700 p-1 text-center">
                    <img
                      src="/sri-yantra-center.png"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute inset-0 m-auto w-[84%] h-[84%] object-contain opacity-[0.13] dark:opacity-[0.18]"
                    />
                    <span className="relative z-10 font-black text-[9.5px] text-indigo-950 dark:text-indigo-200">
                      {isTa ? 'சந்திரன் (மன காரகன்)' : 'Chandran (Moon)'}
                    </span>
                    <span className="relative z-10 text-[8px] font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5">
                      {isTa ? `ராசி: ${person.moonRasiTa}` : `Moon: ${person.moonRasi}`}
                    </span>
                    <span className="relative z-10 text-[7.5px] text-stone-600 dark:text-stone-400">
                      {isTa ? `லக்னத்தில் ${person.moonHouseFromLagna}-ம் வீடு` : `H${person.moonHouseFromLagna} from Lagna`}
                    </span>
                    <span className="relative z-10 text-[7px] text-indigo-700 dark:text-indigo-400 font-semibold mt-0.5">
                      {isTa ? `ஒளி: ${person.illuminationPct}%` : `Light: ${person.illuminationPct}%`}
                    </span>
                  </div>
                );
              }
              return null;
            }
            const cell = SOUTH_CELLS.find((x) => x.r === r && x.c === c);
            if (!cell) return null;
            const occupants = byRasi[cell.rasi] || [];
            const isMoonCell = cell.rasi === person.moonRasiIdx;
            const isLagnaCell = cell.rasi === person.lagnaRasiIdx;
            return (
              <div
                key={`${r}-${c}`}
                className={`border border-stone-200 dark:border-stone-700 p-0.5 flex flex-col justify-between overflow-hidden ${
                  isMoonCell
                    ? 'bg-indigo-100/85 dark:bg-indigo-900/45 ring-1 ring-inset ring-indigo-500'
                    : isLagnaCell
                    ? 'bg-amber-50/80 dark:bg-amber-950/30'
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
                          role === 'moon'
                            ? 'bg-indigo-700 text-white'
                            : role === 'jupiter'
                            ? 'bg-emerald-600 text-white'
                            : role === 'saturn'
                            ? 'bg-slate-700 text-white'
                            : role === 'lagna' || role === 'ascendant'
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
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'சந்திர ராசி & பலம்:' : 'Moon Rasi & Dignity:'}</span>
          <strong className="text-indigo-900 dark:text-indigo-300">
            {isTa ? `${person.moonRasiTa} (${person.dignityTa})` : `${person.moonRasi} (${person.dignityEn})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'லக்னத்திலிருந்து சந்திரன்:' : 'Moon from Lagnam:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">
            {isTa ? `${person.moonHouseFromLagna}-ம் வீடு (${person.lagnaRasiTa} லக்னம்)` : `${formatOrd(person.moonHouseFromLagna)} House (${person.lagnaRasi} Asc)`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'பிறை / ஒளி அளவு:' : 'Paksha & Light:'}</span>
          <strong className={person.isValarpirai ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
            {isTa
              ? `${person.isValarpirai ? 'வளர்பிறை' : 'தேய்பிறை'} (${person.illuminationPct}%)`
              : `${person.isValarpirai ? 'Valarpirai' : 'Theipirai'} (${person.illuminationPct}%)`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'நவாம்ச (D9) சந்திரன்:' : 'Navamsa (D9) Moon:'}</span>
          <strong className="text-amber-800 dark:text-amber-300">
            {isTa ? `${person.d9MoonRasiTa} (${person.d9DignityTa})` : `${person.d9MoonRasi} (${person.d9DignityEn})`}
          </strong>
        </div>
        <div className="border-t border-stone-100 dark:border-stone-800 pt-1.5 space-y-1">
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {isTa ? 'சந்திர யோகங்கள் & தோஷங்கள்:' : 'Moon Yogas & Dosha Checks:'}
          </div>
          <div className="flex flex-wrap gap-1">
            {(person.yogas || []).map((y) => (
              <span
                key={y.id}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                  y.tone === 'warn'
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50'
                    : y.active
                    ? 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-stone-50 dark:bg-stone-900/70 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                }`}
              >
                {y.tone === 'warn' ? (
                  <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                )}
                <span>{isTa ? y.ta : y.en}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChandranMatchCard({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const ch = matchReport?.chandranAnalysis;
  if (!ch) {
    return (
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/50 text-xs text-indigo-950 dark:text-indigo-200">
        {isTa
          ? 'முழுமையான சந்திரன் ஆய்வைக் காண பொருத்தத்தை மீண்டும் கணக்கிடவும்.'
          : 'Please recalculate the match to generate the full Chandran (Moon) compatibility & yoga analysis.'}
      </div>
    );
  }

  const {
    boy,
    girl,
    moonToMoon,
    moonToMoonGood,
    brideMoonInGroomLagna,
    groomMoonInBrideLagna,
    crossMoonLagnaGood,
    d9MoonDist,
    d9MoonRel,
    d9HarmonyGood,
    combinedScore,
    verdictEn,
    verdictTa
  } = ch;

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Overall Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        combinedScore >= 74
          ? 'bg-emerald-50/75 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
          : combinedScore >= 56
          ? 'bg-amber-50/75 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-200'
          : 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white dark:bg-[#1E1815] border border-black/10 shrink-0">
            <Moon className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm">
              {isTa ? 'சந்திரன் (மன காரகன்) & மன இணக்க ஆய்வு' : 'Chandran (Moon) – Mental & Emotional Compatibility Analysis'}
            </div>
            <p className="text-[11px] font-medium mt-0.5 leading-relaxed">
              {isTa ? verdictTa : verdictEn}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white dark:bg-[#1E1815] px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-indigo-900 dark:text-indigo-300">{combinedScore}%</div>
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            {isTa ? 'சந்திர பலம்' : 'Mind Score'}
          </div>
        </div>
      </div>

      {/* 2. Bride (Left) vs Groom (Right) Charts & Moon Yogas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonChandranCard
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
        />
        <PersonChandranCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. Couple Moon-to-Moon & Cross-Lagnam Resonance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
        <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {isTa ? 'சந்திரன் ↔ சந்திரன் நிலை:' : 'Moon ↔ Moon Spacing:'}
          </span>
          <span className={`font-bold flex items-center gap-1 shrink-0 ${moonToMoonGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {moonToMoonGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{isTa ? `${moonToMoon}-ம் வீடு` : `${formatOrd(moonToMoon)} House`}</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {isTa ? 'துணை லக்னத்தில் சந்திரன்:' : 'Moon in Partner Lagna:'}
          </span>
          <span className={`font-bold flex items-center gap-1 shrink-0 ${crossMoonLagnaGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>
              {isTa
                ? `பெண் ${brideMoonInGroomLagna} | ஆண் ${groomMoonInBrideLagna}`
                : `B→G H${brideMoonInGroomLagna} | G→B H${groomMoonInBrideLagna}`}
            </span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {isTa ? 'நவாம்ச (D9) சந்திரன்:' : 'Navamsa (D9) Moon:'}
          </span>
          <span className={`font-bold flex items-center gap-1 shrink-0 ${d9HarmonyGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {d9HarmonyGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>
              {isTa ? `${d9MoonDist}-ம் இடம் (${d9MoonRel?.ta})` : `${formatOrd(d9MoonDist)} (${d9MoonRel?.en})`}
            </span>
          </span>
        </div>
      </div>

      {/* 4. Classical Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22] dark:text-amber-300">
            {isTa ? 'சாஸ்திர குறிப்பு (சந்திரன்):' : 'Classical Note (Chandran):'}
          </strong>{' '}
          {isTa
            ? '“சந்திரமா மனசோ ஜாத:” — மன காரகனான சந்திரனின் உச்ச/ஆட்சி பலம், கஜகேசரி யோகம், கேமதுரும நிவர்த்தி, புனர்பூ அமைப்பு மற்றும் நவாம்ச சந்திரன் ஆகியவை தம்பதியரின் மன அமைதியையும் அன்பையும் தீர்மானிக்கின்றன.'
            : 'In Vedic astrology Chandran governs the mind, emotional resilience, and domestic peace. Moon dignity, Gajakesari Yoga, Kemadruma cancellation, Punarphoo awareness, and D9 Moon harmony shape lasting mental empathy.'}
        </div>
      </div>
    </div>
  );
}
