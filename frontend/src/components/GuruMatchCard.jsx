import React from 'react';
import { Award, Sparkles, CheckCircle2, AlertTriangle, Eye, Compass } from 'lucide-react';
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
  venus: 'சுக்', mars: 'செவ்', mercury: 'புத', saturn: 'சனி',
  sun: 'சூரி', rahu: 'ராகு', ketu: 'கேது'
};
const SHORT_CODE_EN = {
  lagna: 'Asc', ascendant: 'Asc', moon: 'Moo', jupiter: 'Jup',
  venus: 'Ven', mars: 'Mar', mercury: 'Mer', saturn: 'Sat',
  sun: 'Sun', rahu: 'Rah', ketu: 'Ket'
};

function getOccupantRole(o) {
  if (o.id) return o.id;
  if (o.isLagna) return 'lagna';
  if (o.isJupiter) return 'jupiter';
  if (o.isMoon) return 'moon';
  if (o.isVenus) return 'venus';
  if (o.isMars) return 'mars';
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

function PersonGuruCard({ person, title, isBride, isTa }) {
  const byRasi = {};
  (person?.chartBoxes || []).forEach((b) => {
    const idx = b.rasi ?? b.signIdx;
    if (typeof idx === 'number') byRasi[idx] = b.occupants || [];
  });

  // Houses blessed by Jupiter (1st/conjunct, 5th, 7th, 9th signs forward)
  const blessedSigns = new Set([0, 4, 6, 8].map((off) => (person.jupRasiIdx + off) % 12));

  return (
    <div className={`border rounded-xl p-3 space-y-2.5 ${isBride ? 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50' : 'bg-indigo-50/40 dark:bg-indigo-950/35 border-indigo-200 dark:border-indigo-800/50'}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className={isBride ? 'text-amber-950 dark:text-amber-200' : 'text-indigo-950 dark:text-indigo-200'}>{title}</span>
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

      {/* South Indian Mini Chart Highlighting Guru & Guru Paarvai (5/7/9 Aspects) */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[210px] mx-auto border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#1E1815] text-[9px]">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="col-span-2 row-span-2 relative overflow-hidden flex flex-col items-center justify-center bg-amber-50/80 dark:bg-amber-950/30 border border-stone-200 dark:border-stone-700 p-1 text-center">
                    <img
                      src="/sri-yantra-center.png"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute inset-0 m-auto w-[84%] h-[84%] object-contain opacity-[0.13] dark:opacity-[0.18]"
                    />
                    <span className="relative z-10 font-black text-[9.5px] text-amber-900 dark:text-amber-300">
                      {isTa ? 'குரு பகவான்' : 'Guru (Jupiter)'}
                    </span>
                    <span className="relative z-10 text-[8px] font-bold text-[#7A1A22] dark:text-amber-300 mt-0.5">
                      {isTa ? `ராசி: ${person.jupRasiTa}` : `Sign: ${person.jupRasi}`}
                    </span>
                    <span className="relative z-10 text-[7.5px] text-stone-600 dark:text-stone-400">
                      {isTa ? `லக் ${person.jupHouseFromLagna} | ராசி ${person.jupHouseFromMoon}` : `Asc H${person.jupHouseFromLagna} | Moo H${person.jupHouseFromMoon}`}
                    </span>
                    <span className="relative z-10 text-[7px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                      {isTa ? `D9: ${person.d9JupRasiTa}` : `D9: ${person.d9JupRasi}`}
                    </span>
                  </div>
                );
              }
              return null;
            }
            const cell = SOUTH_CELLS.find((x) => x.r === r && x.c === c);
            if (!cell) return null;
            const occupants = byRasi[cell.rasi] || [];
            const isGuruCell = cell.rasi === person.jupRasiIdx;
            const isBlessedCell = blessedSigns.has(cell.rasi) && !isGuruCell;
            return (
              <div
                key={`${r}-${c}`}
                className={`border border-stone-200 dark:border-stone-700 p-0.5 flex flex-col justify-between overflow-hidden ${
                  isGuruCell
                    ? 'bg-amber-200/80 dark:bg-amber-900/50 ring-1 ring-inset ring-amber-600'
                    : isBlessedCell
                    ? 'bg-emerald-50/75 dark:bg-emerald-950/35'
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
                          role === 'jupiter'
                            ? 'bg-amber-600 text-white'
                            : role === 'lagna' || role === 'ascendant'
                            ? 'bg-stone-800 text-white'
                            : role === 'moon'
                            ? 'bg-indigo-700 text-white'
                            : role === 'venus'
                            ? 'bg-pink-600 text-white'
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
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'குரு ராசி & பலம்:' : 'Guru Rasi & Dignity:'}</span>
          <strong className="text-amber-900 dark:text-amber-300">
            {isTa ? `${person.jupRasiTa} (${person.dignityTa})` : `${person.jupRasi} (${person.dignityEn})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'லக்னம் / சந்திரனிலிருந்து:' : 'From Lagnam / Moon:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">
            {isTa
              ? `லக் ${person.jupHouseFromLagna}-ம் வீடு | ராசி ${person.jupHouseFromMoon}-ம் வீடு`
              : `${formatOrd(person.jupHouseFromLagna)} Asc | ${formatOrd(person.jupHouseFromMoon)} Moon`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'நவாம்ச (D9) குரு:' : 'Navamsa (D9) Guru:'}</span>
          <strong className="text-[#7A1A22] dark:text-amber-300">
            {isTa ? `${person.d9JupRasiTa} (${person.d9DignityTa})` : `${person.d9JupRasi} (${person.d9DignityEn})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'கோச்சார குரு பலம்:' : 'Live Gochara Guru Balam:'}</span>
          <strong className={person.hasGocharaGuruBalam ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
            {isTa
              ? `${person.transitJupRasiTa} (${person.transitHouseFromMoon}-ம் வீடு · ${person.hasGocharaGuruBalam ? 'பலம் உண்டு' : 'சமநிலை'})`
              : `${person.transitJupRasi} (H${person.transitHouseFromMoon} · ${person.hasGocharaGuruBalam ? 'Ready' : 'Neutral'})`}
          </strong>
        </div>

        {/* Guru Paarvai Targets */}
        <div className="border-t border-stone-100 dark:border-stone-800 pt-1.5 space-y-1">
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3 h-3 text-emerald-600" />
            <span>{isTa ? 'குரு பார்வை பெறும் பாவங்கள்:' : 'Guru Paarvai (5/7/9 Blessed Pillars):'}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(person.blessedTargets || []).length === 0 ? (
              <span className="text-[10px] text-stone-400">
                {isTa ? 'நேரடி மணப் பாவ பார்வை இல்லை' : 'No direct aspect on primary marriage pillars'}
              </span>
            ) : (
              person.blessedTargets.map((bt, idx) => (
                <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/35 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[10px] font-semibold">
                  {isTa ? bt.ta : bt.en}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Yogas & Doshas */}
        <div className="border-t border-stone-100 dark:border-stone-800 pt-1.5 space-y-1">
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            {isTa ? 'குரு யோகங்கள் & நிலை:' : 'Guru Yogas & Checks:'}
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

export default function GuruMatchCard({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const gr = matchReport?.guruAnalysis;
  if (!gr) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200">
        {isTa
          ? 'விரிவான குரு ஆய்வைக் காண பொருத்தத்தை மீண்டும் கணக்கிடவும்.'
          : 'Please recalculate the match to generate the full Guru (Jupiter) Bala & Paarvai analysis.'}
      </div>
    );
  }

  const {
    boy,
    girl,
    transitJupRasi,
    transitJupRasiTa,
    guruToGuru,
    guruToGuruGood,
    brideGuruBlessesGroom,
    groomGuruBlessesBride,
    d9GuruDist,
    d9GuruGood,
    gocharaBothReady,
    gocharaOneReady,
    combinedScore,
    verdictEn,
    verdictTa
  } = gr;

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
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm">
              {isTa ? 'குரு பகவான் (வியாழன்) – குரு பலம் & ஆசி ஆய்வு' : 'Guru (Jupiter) – Dharma, Guru Bala & Blessing Analysis'}
            </div>
            <p className="text-[11px] font-medium mt-0.5 leading-relaxed">
              {isTa ? verdictTa : verdictEn}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white dark:bg-[#1E1815] px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-amber-800 dark:text-amber-300">{combinedScore}%</div>
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            {isTa ? 'குரு பலம்' : 'Guru Score'}
          </div>
        </div>
      </div>

      {/* 2. Bride (Left) vs Groom (Right) Charts & Guru Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonGuruCard
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
        />
        <PersonGuruCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. Couple Guru Resonance & Gochara Timing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
        <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {isTa ? 'குரு ↔ குரு நிலை:' : 'Guru ↔ Guru Spacing:'}
          </span>
          <span className={`font-bold flex items-center gap-1 shrink-0 ${guruToGuruGood ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {guruToGuruGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{isTa ? `${guruToGuru}-ம் வீடு (D9: ${d9GuruDist})` : `${formatOrd(guruToGuru)} (D9: ${formatOrd(d9GuruDist)})`}</span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {isTa ? 'துணை ஸ்தான குரு பார்வை:' : 'Partner Cross-Blessing:'}
          </span>
          <span className={`font-bold flex items-center gap-1 shrink-0 ${(brideGuruBlessesGroom || groomGuruBlessesBride || d9GuruGood) ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}>
            <Eye className="w-3.5 h-3.5" />
            <span>
              {brideGuruBlessesGroom && groomGuruBlessesBride
                ? (isTa ? 'இருவருக்கும் உண்டு' : 'Mutual Sight')
                : (brideGuruBlessesGroom || groomGuruBlessesBride)
                ? (isTa ? 'ஒருவருக்கு உண்டு' : 'One-Sided Sight')
                : (isTa ? 'சமநிலை' : 'Standard')}
            </span>
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-between gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isTa ? `கோச்சார குரு (${transitJupRasiTa}):` : `Gochara (${transitJupRasi}):`}</span>
          </span>
          <span className={`font-bold shrink-0 ${gocharaBothReady ? 'text-emerald-700 dark:text-emerald-400' : gocharaOneReady ? 'text-amber-700 dark:text-amber-400' : 'text-stone-600 dark:text-stone-400'}`}>
            {gocharaBothReady
              ? (isTa ? 'இருவருக்கும் குரு பலம்!' : 'Both Ready!')
              : gocharaOneReady
              ? (isTa ? 'ஒருவருக்கு குரு பலம்' : 'One Partner Ready')
              : (isTa ? 'சாந்தி / பரிகாரம்' : 'Transit Calm')}
          </span>
        </div>
      </div>

      {/* 4. Classical Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22] dark:text-amber-300">
            {isTa ? 'சாஸ்திர குறிப்பு (குரு):' : 'Classical Note (Guru):'}
          </strong>{' '}
          {isTa
            ? '“குரு பார்வை கோடி நன்மை” — குருவின் 5, 7, 9-ம் பார்வைகள் மணவாழ்க்கையின் தோஷங்களை விலக்கி வம்ச விருத்தி, செல்வம் மற்றும் ஆன்மீக ஒற்றுமையைத் தரும். வியாழக்கிழமை ஸ்ரீ தக்ஷிணாமூர்த்தி வழிபாடு உத்தமம்.'
            : '“Guru Paarvai Kodi Nanmai” — Jupiter’s 5th, 7th, and 9th aspects purify marital afflictions and bestow dharmic wisdom, prosperity, and progeny blessings. Thursday Sri Dakshinamurthy worship is auspicious.'}
        </div>
      </div>
    </div>
  );
}
