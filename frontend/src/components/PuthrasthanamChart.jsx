import React from 'react';
import { Baby, ShieldCheck, AlertTriangle, CheckCircle2, Compass } from 'lucide-react';
import { useLang } from '../i18n';

const SOUTH_CELLS = [
  { r: 0, c: 0, rasi: 11 }, { r: 0, c: 1, rasi: 0 }, { r: 0, c: 2, rasi: 1 }, { r: 0, c: 3, rasi: 2 },
  { r: 1, c: 3, rasi: 3 },  { r: 2, c: 3, rasi: 4 }, { r: 3, c: 3, rasi: 5 }, { r: 3, c: 2, rasi: 6 },
  { r: 3, c: 1, rasi: 7 },  { r: 3, c: 0, rasi: 8 }, { r: 2, c: 0, rasi: 9 }, { r: 1, c: 0, rasi: 10 },
];

const RASI_SHORT_TA = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];
const RASI_SHORT_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

function PuthrasthanamMiniChart({ person, title, isBride, isTa }) {
  const byRasi = {};
  (person?.chartBoxes || []).forEach(b => {
    byRasi[b.rasi] = b.occupants || [];
  });

  return (
    <div className={`border rounded-xl p-3 space-y-2 ${isBride ? 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50' : 'bg-indigo-50/40 dark:bg-indigo-950/35 border-indigo-200 dark:border-indigo-800/50'}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className={isBride ? 'text-rose-900 dark:text-rose-300' : 'text-indigo-900 dark:text-indigo-300'}>{title}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          person.status === 'Strong'
            ? 'bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300'
            : person.status === 'Moderate'
            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
            : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
        }`}>
          {isTa ? person.statusTa : person.status} ({person.score}%)
        </span>
      </div>

      {/* South Indian Mini Chart with 5th House Highlighted */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[210px] mx-auto border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#1E1815] text-[9px]">
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="col-span-2 row-span-2 relative overflow-hidden flex flex-col items-center justify-center bg-amber-50/60 dark:bg-amber-950/30 border border-stone-200 dark:border-stone-700 p-1 text-center">
                    <img
                      src="/sri-yantra-center.png"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none select-none absolute inset-0 m-auto w-[84%] h-[84%] object-contain opacity-[0.13] dark:opacity-[0.18]"
                    />
                    <span className="relative z-10 font-black text-[10px] text-[#7A1A22] dark:text-amber-300">
                      {isTa ? '5-ம் வீடு' : '5th House'}
                    </span>
                    <span className="relative z-10 text-[8.5px] font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                      {isTa ? person.fifthRasiTa : person.fifthRasi}
                    </span>
                    <span className="relative z-10 text-[7.5px] text-stone-500 dark:text-stone-400">
                      {isTa ? `அதிபதி: ${person.fifthLordTa}` : `Lord: ${person.fifthLord}`}
                    </span>
                  </div>
                );
              }
              return null;
            }
            const cell = SOUTH_CELLS.find(x => x.r === r && x.c === c);
            if (!cell) return null;
            const occupants = byRasi[cell.rasi] || [];
            const is5th = cell.rasi === person.fifthRasiIdx;
            const isLagna = cell.rasi === person.lagnaRasiIdx;
            return (
              <div
                key={`${r}-${c}`}
                className={`border border-stone-200 dark:border-stone-700 p-0.5 flex flex-col justify-between overflow-hidden ${
                  is5th ? 'bg-amber-100/80 dark:bg-amber-900/40 ring-1 ring-inset ring-amber-500' : isLagna ? 'bg-slate-50 dark:bg-stone-900/70' : 'bg-white dark:bg-[#1E1815]'
                }`}
              >
                <div className="flex flex-wrap gap-0.5">
                  {occupants.map((o, idx) => (
                    <span
                      key={idx}
                      className={`px-0.5 rounded font-bold ${
                        o.id === 'jupiter'
                          ? 'bg-amber-600 text-white'
                          : o.id === 'ascendant'
                          ? 'bg-stone-800 text-white'
                          : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {isTa ? (o.ta || o.short) : (o.short || o.en)}
                    </span>
                  ))}
                </div>
                <div className="text-[7px] text-stone-400 text-right leading-none">
                  {is5th ? (isTa ? '5-வீடு' : '5H') : (isTa ? RASI_SHORT_TA[cell.rasi] : RASI_SHORT_EN[cell.rasi])}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed 5th House Metrics */}
      <div className="bg-white dark:bg-[#1E1815] rounded-lg border border-stone-200 dark:border-stone-700 p-2.5 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'லக்னம்:' : 'Lagna:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">{isTa ? person.lagnaRasiTa : person.lagnaRasi}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? '5-ம் வீடு (புத்திர ஸ்தானம்):' : '5th House (Puthrasthanam):'}</span>
          <strong className="text-stone-900 dark:text-stone-100">{isTa ? person.fifthRasiTa : person.fifthRasi}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'பஞ்சமாதிபதி (5-ம் அதிபதி):' : '5th Lord & Placement:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">
            {isTa
              ? `${person.fifthLordTa} (${person.fifthLordHouse}-ம் வீடு, ${person.fifthLordDignityTa})`
              : `${person.fifthLord} (H${person.fifthLordHouse}, ${person.fifthLordDignity})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? '5-ம் வீட்டில் கிரகங்கள்:' : 'Planets in 5th House:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">
            {person.planetsIn5th?.length > 0
              ? person.planetsIn5th.map(p => (isTa ? p.ta : p.en)).join(', ')
              : (isTa ? 'இல்லை' : 'None')}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'புத்திரகாரகன் குரு:' : 'Puthrakaraka Jupiter:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">
            {isTa
              ? `${person.jupiterRasiTa} (${person.jupiterHouse}-ம் வீடு, ${person.jupiterDignityTa})`
              : `${person.jupiterRasi} (H${person.jupiterHouse}, ${person.jupiterDignity})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? '5-ம் வீட்டிற்கு குரு பார்வை:' : 'Jupiter Aspect on 5th:'}</span>
          <strong className={person.jupiterAspects5th ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}>
            {person.jupiterAspects5th ? (isTa ? 'உண்டு (சுப பலம்)' : 'Yes (Auspicious)') : (isTa ? 'இல்லை' : 'No')}
          </strong>
        </div>
        <div className="flex justify-between border-t border-stone-100 dark:border-stone-800 pt-1">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'சப்தாம்சம் (D7) லக்னம் / குரு:' : 'Saptamsha (D7) Asc / Jup:'}</span>
          <strong className="text-stone-900 dark:text-stone-100">
            {isTa ? `${person.d7LagnaTa} / ${person.d7JupiterTa}` : `${person.d7Lagna} / ${person.d7Jupiter}`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? `${person.sphutaNameTa}:` : `${person.sphutaNameEn}:`}</span>
          <strong className={person.sphutaFavorable ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}>
            {isTa ? person.sphutaRasiTa : person.sphutaRasi} ({person.sphutaFavorable ? (isTa ? 'சுபம்' : 'Favorable') : (isTa ? 'மத்திமம்' : 'Moderate')})
          </strong>
        </div>
      </div>
    </div>
  );
}

export default function PuthrasthanamChart({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const pa = matchReport?.puthrasthanamAnalysis;
  if (!pa) return null;

  const { boy, girl, combinedScore, verdictEn, verdictTa } = pa;
  const mahendra = matchReport?.tamilPorutham?.poruthams?.find(p => (p.name || '').toLowerCase().includes('mahendra'));

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Overall Progeny Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        combinedScore >= 70
          ? 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
          : combinedScore >= 52
          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-200'
          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white dark:bg-[#1E1815] border border-black/10 shrink-0">
            <Baby className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm">
              {isTa ? '5-ம் வீடு – புத்திர ஸ்தானம் (குழந்தை பாக்கியம்)' : '5th House – Puthrasthanam (Childbirth & Progeny Analysis)'}
            </div>
            <p className="text-[11px] font-medium mt-0.5">
              {isTa ? verdictTa : verdictEn}
            </p>
            {mahendra && (
              <div className="text-[10.5px] font-bold mt-1 flex items-center gap-1">
                {mahendra.status === 'Uttamam'
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                <span>
                  {isTa
                    ? `மகேந்திர பொருத்தம்: ${mahendra.status === 'Uttamam' ? 'உத்தமம் (பொருந்தும்)' : 'மத்திமம் / பொருந்தாது'}`
                    : `Mahendra Porutham (Progeny): ${mahendra.status}`}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white dark:bg-[#1E1815] px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-[#7A1A22] dark:text-amber-300">{combinedScore}%</div>
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            {isTa ? 'புத்திர பலம்' : 'Progeny Score'}
          </div>
        </div>
      </div>

      {/* 2. Bride (Left) vs Groom (Right) 5th House Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PuthrasthanamMiniChart
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
        />
        <PuthrasthanamMiniChart
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. Classical Remedies & Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-2">
        <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22] dark:text-amber-300">
            {isTa ? 'சாஸ்திர வழிகாட்டல்:' : 'Classical Guidance:'}
          </strong>{' '}
          {isTa
            ? 'பஞ்சமாதிபதி பலம், புத்திரகாரகன் குருவின் அருள், சப்தாம்சம் (D7), மற்றும் மணமகன் பீஜ ஸ்புடம் / மணமகள் க்ஷேத்திர ஸ்புடம் ஆகியவை இணைந்து குழந்தை பாக்கியத்தை உறுதி செய்கின்றன. குரு வாரம் (வியாழன்) தட்சிணாமூர்த்தி மற்றும் சந்தான கோபால கிருஷ்ண வழிபாடு சிறந்தது.'
            : 'Progeny strength is evaluated jointly through 5th House & Lord dignity, Puthrakaraka Jupiter’s aspect, Saptamsha (D7), and Beeja/Kshetra Sphuta alignment. Thursday worship of Dakshinamurthy and Santhana Gopala Krishna is traditionally recommended.'}
        </div>
      </div>
    </div>
  );
}
