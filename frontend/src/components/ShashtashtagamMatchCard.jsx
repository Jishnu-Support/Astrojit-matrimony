import React from 'react';
import { GitCompare, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Compass } from 'lucide-react';
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
  sun: 'சூரி', mars: 'செவ்', venus: 'சுக்', mercury: 'புத',
  saturn: 'சனி', rahu: 'ராகு', ketu: 'கேது'
};
const SHORT_CODE_EN = {
  lagna: 'Asc', ascendant: 'Asc', moon: 'Moo', jupiter: 'Jup',
  sun: 'Sun', mars: 'Mar', venus: 'Ven', mercury: 'Mer',
  saturn: 'Sat', rahu: 'Rah', ketu: 'Ket'
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

function PersonShashtashtagamCard({ person, title, isBride, isTa }) {
  const byRasi = {};
  (person?.chartBoxes || []).forEach((b) => {
    const idx = b.rasi ?? b.signIdx;
    if (typeof idx === 'number') byRasi[idx] = b.occupants || [];
  });

  return (
    <div className={`border rounded-xl p-3 space-y-2.5 ${isBride ? 'bg-rose-50/40 border-rose-200' : 'bg-indigo-50/40 border-indigo-200'}`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className={isBride ? 'text-rose-900' : 'text-indigo-900'}>{title}</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-stone-200 text-stone-700">
          {isTa ? `${person.moonRasiTa} ராசி` : `${person.moonRasi} Rasi`}
        </span>
      </div>

      {/* South Indian Mini Chart Highlighting Moon, Lagnam & Jupiter */}
      <div className="grid grid-cols-4 grid-rows-4 aspect-square max-w-[210px] mx-auto border border-stone-300 bg-white text-[9px]">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => {
            if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
              if (r === 1 && c === 1) {
                return (
                  <div key="center" className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-amber-50/70 border border-stone-200 p-1 text-center">
                    <span className="font-black text-[9.5px] text-[#7A1A22]">
                      {isTa ? 'ராசி & லக்னம்' : 'Rasi & Lagnam'}
                    </span>
                    <span className="text-[8px] font-bold text-indigo-900 mt-0.5">
                      {isTa ? `ராசி: ${person.moonRasiTa}` : `Moon: ${person.moonRasi}`}
                    </span>
                    <span className="text-[7.5px] text-stone-600">
                      {isTa ? `லக்: ${person.lagnaRasiTa}` : `Asc: ${person.lagnaRasi}`}
                    </span>
                    <span className="text-[7px] text-amber-800 font-semibold mt-0.5">
                      {isTa ? `D9: ${person.navamsaMoonRasiTa}` : `D9: ${person.navamsaMoonRasi}`}
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
                className={`border border-stone-200 p-0.5 flex flex-col justify-between overflow-hidden ${
                  isMoonCell && isLagnaCell
                    ? 'bg-purple-100/80 ring-1 ring-inset ring-purple-400'
                    : isMoonCell
                    ? 'bg-indigo-100/75 ring-1 ring-inset ring-indigo-300'
                    : isLagnaCell
                    ? 'bg-amber-100/70'
                    : 'bg-white'
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
                            : role === 'lagna' || role === 'ascendant'
                            ? 'bg-stone-800 text-white'
                            : role === 'jupiter'
                            ? 'bg-emerald-600 text-white'
                            : 'text-stone-700'
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

      {/* Individual Reference Summary */}
      <div className="bg-white rounded-lg border border-stone-200 p-2.5 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'சந்திர ராசி (அதிபதி):' : 'Moon Rasi (Lord):'}</span>
          <strong className="text-indigo-900">
            {isTa ? `${person.moonRasiTa} (${person.moonLord})` : `${person.moonRasi} (${person.moonLord})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'ஜன்ம லக்னம் (அதிபதி):' : 'Janma Lagnam (Lord):'}</span>
          <strong className="text-stone-900">
            {isTa ? `${person.lagnaRasiTa} (${person.lagnaLord})` : `${person.lagnaRasi} (${person.lagnaLord})`}
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'நவாம்ச (D9) சந்திரன்:' : 'Navamsa (D9) Moon:'}</span>
          <strong className="text-amber-800">
            {isTa ? person.navamsaMoonRasiTa : person.navamsaMoonRasi}
          </strong>
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-1">
          <span className="text-stone-500">{isTa ? 'குரு பார்வை (சந் / லக்):' : 'Jupiter Grace (Moon / Asc):'}</span>
          <strong className={(person.jupAspectsMoon || person.jupAspectsLagna) ? 'text-emerald-700' : 'text-stone-500'}>
            {(person.jupAspectsMoon || person.jupAspectsLagna)
              ? (isTa ? 'உண்டு (சுபம்)' : 'Yes (Benefic)')
              : (isTa ? 'இல்லை' : 'None')}
          </strong>
        </div>
      </div>
    </div>
  );
}

function getAxisBadgeClass(status) {
  if (status === 'favorable' || status === 'subha') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'mitigated' || status === 'dwidwadasam') return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-rose-100 text-rose-800 border-rose-200';
}

function formatOrd(n) {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

export default function ShashtashtagamMatchCard({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const sh = matchReport?.shashtashtagamAnalysis;
  if (!sh) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
        {isTa
          ? 'விரிவான ஷஷ்டாஷ்டக ஆய்வைக் காண பொருத்தத்தை மீண்டும் கணக்கிடவும்.'
          : 'Please recalculate the match to generate the full 3-axis Shashtashtagam & cancellation analysis.'}
      </div>
    );
  }

  const {
    boy,
    girl,
    rasiAxis,
    lagnaAxis,
    navamsaAxis,
    cancellations,
    activeCancelCount,
    overallStatus,
    statusLabelEn,
    statusLabelTa,
    score,
    verdictEn,
    verdictTa,
  } = sh;

  const isGoodBanner = overallStatus === 'clear' || overallStatus === 'subha';
  const isMidBanner = overallStatus === 'cancelled' || overallStatus === 'dwidwadasam';

  const axes = [
    {
      title: isTa ? '1. சந்திர ராசி (Moon Rasi)' : '1. Moon Rasi (Chandra Lagna)',
      data: rasiAxis,
    },
    {
      title: isTa ? '2. ஜன்ம லக்னம் (Ascendant)' : '2. Janma Lagnam (Ascendant)',
      data: lagnaAxis,
    },
    {
      title: isTa ? '3. நவாம்ச (D9) சந்திர ராசி' : '3. Navamsa (D9) Moon Rasi',
      data: navamsaAxis,
    },
  ];

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Overall Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        isGoodBanner
          ? 'bg-emerald-50/75 border-emerald-200 text-emerald-950'
          : isMidBanner
          ? 'bg-amber-50/75 border-amber-200 text-amber-950'
          : 'bg-rose-50/75 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white border border-black/10 shrink-0">
            <GitCompare className="w-4 h-4 text-[#7A1A22]" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm flex flex-wrap items-center gap-2">
              <span>{isTa ? statusLabelTa : statusLabelEn}</span>
            </div>
            <p className="text-[11px] font-medium mt-0.5 leading-relaxed">
              {isTa ? verdictTa : verdictEn}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-[#7A1A22]">{score}%</div>
          <div className="text-[10px] font-bold text-stone-500">
            {isTa ? 'ஷஷ்டாஷ்டக மதிப்பெண்' : 'Axis Score'}
          </div>
        </div>
      </div>

      {/* 2. Bride (Left) vs Groom (Right) Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonShashtashtagamCard
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
        />
        <PersonShashtashtagamCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. Three-Axis Directional Distance Matrix (Moon Rasi / Lagnam / Navamsa D9) */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-3.5 py-2.5 bg-amber-50/70 border-b border-stone-200 flex items-center justify-between">
          <span className="font-bold text-[#7A1A22] flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>
              {isTa ? '3-நிலை ஷஷ்டாஷ்டக (6/8) திசை ஆய்வு' : '3-Axis Directional 6/8 Position Matrix'}
            </span>
          </span>
        </div>
        <div className="divide-y divide-stone-100">
          {axes.map(({ title, data }) => (
            <div key={data.axisId} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="space-y-0.5">
                <div className="font-bold text-stone-900">{title}</div>
                <div className="text-stone-600">
                  {isTa
                    ? `மணமகள் ${data.girlRasiTa} (${data.girlLord}) ↔ மணமகன் ${data.boyRasiTa} (${data.boyLord})`
                    : `Bride ${data.girlRasi} (${data.girlLord}) ↔ Groom ${data.boyRasi} (${data.boyLord})`}
                </div>
                <div className="text-[10px] text-stone-500">
                  {isTa
                    ? `மணமகளிலிருந்து: ${data.brideToGroom}-ம் இடம் | மணமகனிலிருந்து: ${data.groomToBride}-ம் இடம் · அதிபதிகள்: ${data.lordRel?.ta}`
                    : `From Bride: ${formatOrd(data.brideToGroom)} | From Groom: ${formatOrd(data.groomToBride)} · Lords: ${data.lordRel?.en}`}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold shrink-0 self-start sm:self-center ${getAxisBadgeClass(data.status)}`}>
                {isTa ? data.statusTa : data.statusEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Classical Cancellation (Bhanga) Factors */}
      <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isTa ? 'சாஸ்திர தோஷ நிவர்த்தி (பங்க) காரணிகள்' : 'Classical Cancellation (Bhanga) Checks'}
            </span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {activeCancelCount} / {cancellations?.length || 5} {isTa ? 'சாதகம்' : 'Active'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          {(cancellations || []).map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                item.active
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              {item.active ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              )}
              <span>{isTa ? item.labelTa : item.labelEn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Classical Guidance & Pariharam */}
      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-stone-700 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22]">
            {isTa ? 'சாஸ்திர குறிப்பு & பரிகாரம்:' : 'Classical Guidance & Pariharam:'}
          </strong>{' '}
          {isTa
            ? '6/8 ஷஷ்டாஷ்டக அமைப்பு ஆரோக்கியம் மற்றும் கருத்து வேறுபாட்டைச் சோதிக்கும் விதியாகும். அதிபதிகள் நட்பு, நவாம்ச பொருத்தம் அல்லது குரு பார்வை இருந்தால் தோஷம் நிவர்த்தியாகும். அசுப 6/8 நிலையில் சிவ-பார்வதி வழிபாடு மற்றும் பிரதோஷ தரிசனம் சுபம் தரும்.'
            : 'Shashtashtagam evaluates 6th/8th house separation across Moon Rasi, Janma Lagnam, and Navamsa (D9). Mutual lord friendship, Subha Shashtashtakam (Deva Keralam pairs), or benefic Jupiter grace neutralize friction; for active Asubha 6/8, Shiva-Parvati / Pradosham worship is classically advised.'}
        </div>
      </div>
    </div>
  );
}
