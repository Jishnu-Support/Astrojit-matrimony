import React from 'react';
import { HeartHandshake, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLang } from '../i18n';

const SOUTH_CELLS = [
  { r: 0, c: 0, rasi: 11 }, { r: 0, c: 1, rasi: 0 }, { r: 0, c: 2, rasi: 1 }, { r: 0, c: 3, rasi: 2 },
  { r: 1, c: 3, rasi: 3 },  { r: 2, c: 3, rasi: 4 }, { r: 3, c: 3, rasi: 5 }, { r: 3, c: 2, rasi: 6 },
  { r: 3, c: 1, rasi: 7 },  { r: 3, c: 0, rasi: 8 }, { r: 2, c: 0, rasi: 9 }, { r: 1, c: 0, rasi: 10 },
];

const RASI_SHORT_TA = ['மேஷ', 'ரிஷ', 'மிது', 'கட', 'சிம்', 'கன்', 'துலா', 'விரு', 'தனு', 'மக', 'கும்', 'மீன'];
const RASI_SHORT_EN = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

function PersonMarsVenusCard({ person, title, isBride, isTa }) {
  const byRasi = {};
  (person?.chartBoxes || []).forEach(b => {
    byRasi[b.rasi] = b.occupants || [];
  });

  return (
    <div className={`border rounded-xl p-3 space-y-2.5 ${isBride ? 'bg-rose-50/40 border-rose-200' : 'bg-indigo-50/40 border-indigo-200'}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className={isBride ? 'text-rose-900' : 'text-indigo-900'}>{title}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          person.status === 'Strong'
            ? 'bg-emerald-100 text-emerald-800'
            : person.status === 'Balanced'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-rose-100 text-rose-800'
        }`}>
          {isTa ? person.statusTa : person.status} ({person.score}%)
        </span>
      </div>

      {/* South Indian Mini Chart Highlighting Mars & Venus */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[210px] mx-auto border border-stone-300 bg-white text-[9px]">
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3].map(c => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-pink-50/60 border border-stone-200 p-1 text-center">
                    <span className="font-black text-[9.5px] text-[#7A1A22]">
                      {isTa ? 'செவ்வாய்–சுக்கிரன்' : 'Mars – Venus'}
                    </span>
                    <span className="text-[8px] font-bold text-stone-700 mt-0.5">
                      {isTa ? `லக்னம்: ${person.lagnaRasiTa}` : `Asc: ${person.lagnaRasi}`}
                    </span>
                    <span className="text-[7.5px] text-stone-500">
                      {isTa ? `செவ் ${person.marsHouse} | சுக் ${person.venusHouse}` : `Mar H${person.marsHouse} | Ven H${person.venusHouse}`}
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
            return (
              <div
                key={`${r}-${c}`}
                className={`border border-stone-200 p-0.5 flex flex-col justify-between overflow-hidden ${
                  hasMars && hasVenus
                    ? 'bg-purple-100/80 ring-1 ring-inset ring-purple-500'
                    : hasMars
                    ? 'bg-rose-100/70'
                    : hasVenus
                    ? 'bg-pink-100/70'
                    : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap gap-0.5">
                  {occupants.map((o, idx) => (
                    <span
                      key={idx}
                      className={`px-0.5 rounded font-bold ${
                        o.id === 'mars'
                          ? 'bg-rose-600 text-white'
                          : o.id === 'venus'
                          ? 'bg-pink-600 text-white'
                          : o.id === 'ascendant'
                          ? 'bg-stone-800 text-white'
                          : 'text-stone-700'
                      }`}
                    >
                      {isTa ? (o.ta || o.short) : (o.short || o.en)}
                    </span>
                  ))}
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
      <div className="bg-white rounded-lg border border-stone-200 p-2.5 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'லக்னம்:' : 'Lagnam:'}</span>
          <strong className="text-stone-900">{isTa ? person.lagnaRasiTa : person.lagnaRasi}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'செவ்வாய் (லக்னத்திலிருந்து):' : 'Mars (from Lagnam):'}</span>
          <strong className="text-rose-800">
            {isTa
              ? `${person.marsRasiTa} (${person.marsHouse}-ம் வீடு, ${person.marsDignityTa})`
              : `${person.marsRasi} (H${person.marsHouse}, ${person.marsDignity})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'சுக்கிரன் (லக்னத்திலிருந்து):' : 'Venus (from Lagnam):'}</span>
          <strong className="text-pink-800">
            {isTa
              ? `${person.venusRasiTa} (${person.venusHouse}-ம் வீடு, ${person.venusDignityTa})`
              : `${person.venusRasi} (H${person.venusHouse}, ${person.venusDignity})`}
          </strong>
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-1">
          <span className="text-stone-500">{isTa ? 'செவ்வாய்–சுக்கிரன் தொடர்பு:' : 'Mars–Venus Relation:'}</span>
          <strong className={
            person.relationTone === 'harmonious'
              ? 'text-emerald-700'
              : person.relationTone === 'sensitive'
              ? 'text-rose-700'
              : 'text-amber-700'
          }>
            {isTa ? person.relationTa : person.relationEn}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'சுக்கிரன் மீது குரு பார்வை:' : 'Jupiter Aspect on Venus:'}</span>
          <strong className={person.jupAspectVenus ? 'text-emerald-700' : 'text-stone-600'}>
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

  const mv = matchReport?.marsVenusAnalysis;
  if (!mv) return null;

  const { boy, girl, brideVenToGroomMar, groomVenToBrideMar, cross1Good, cross2Good, combinedScore, verdictEn, verdictTa } = mv;

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Overall Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        combinedScore >= 72
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : combinedScore >= 55
          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
          : 'bg-rose-50/70 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white border border-black/10 shrink-0">
            <HeartHandshake className="w-4 h-4 text-[#7A1A22]" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm">
              {isTa ? 'செவ்வாய் & சுக்கிரன் – லக்ன இணக்க ஆய்வு' : 'Mars & Venus – Lagnam Compatibility Analysis'}
            </div>
            <p className="text-[11px] font-medium mt-0.5">
              {isTa ? verdictTa : verdictEn}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-[#7A1A22]">{combinedScore}%</div>
          <div className="text-[10px] font-bold text-stone-500">
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
        />
        <PersonMarsVenusCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. Couple Cross-Resonance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
        <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
          <span className="font-semibold text-stone-700">
            {isTa ? 'மணமகள் சுக்கிரன் ↔ மணமகன் செவ்வாய்:' : 'Bride Venus ↔ Groom Mars:'}
          </span>
          <span className={`font-bold flex items-center gap-1 ${cross1Good ? 'text-emerald-700' : 'text-amber-700'}`}>
            {cross1Good ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{isTa ? `${brideVenToGroomMar}-ம் வீடு (${cross1Good ? 'நல்லது' : 'சமநிலை'})` : `H${brideVenToGroomMar} (${cross1Good ? 'Harmonious' : 'Moderate'})`}</span>
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
          <span className="font-semibold text-stone-700">
            {isTa ? 'மணமகன் சுக்கிரன் ↔ மணமகள் செவ்வாய்:' : 'Groom Venus ↔ Bride Mars:'}
          </span>
          <span className={`font-bold flex items-center gap-1 ${cross2Good ? 'text-emerald-700' : 'text-amber-700'}`}>
            {cross2Good ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{isTa ? `${groomVenToBrideMar}-ம் வீடு (${cross2Good ? 'நல்லது' : 'சமநிலை'})` : `H${groomVenToBrideMar} (${cross2Good ? 'Harmonious' : 'Moderate'})`}</span>
          </span>
        </div>
      </div>

      {/* 4. Classical Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-[11px] text-stone-700 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22]">
            {isTa ? 'சாஸ்திர குறிப்பு:' : 'Classical Note:'}
          </strong>{' '}
          {isTa
            ? 'லக்னத்திலிருந்து சுக்கிரன் (களத்திர காரகன்) மற்றும் செவ்வாய் ஆகியோரின் பாவ நிலை, பரஸ்பர பார்வை மற்றும் மணமகள்–மணமகன் குறுக்கு இணைப்பு ஆகியவை இல்லற அன்பையும் ஒற்றுமையையும் காட்டுகின்றன.'
            : 'The house placement of Kalathirakaraka Venus and Mars from Lagnam, their mutual aspects, and cross-couple Venus–Mars resonance indicate marital warmth and compatibility.'}
        </div>
      </div>
    </div>
  );
}
