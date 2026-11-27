import React from 'react';
import { Moon, Sun, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useLang } from '../i18n';

function PersonPakshaCard({ person, title, isBride, isTa }) {
  const isWaxing = person.isValarpirai;
  return (
    <div className={`border rounded-xl p-3.5 space-y-2.5 ${isBride ? 'bg-rose-50/40 border-rose-200' : 'bg-indigo-50/40 border-indigo-200'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-bold ${isBride ? 'text-rose-900' : 'text-indigo-900'}`}>{title}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold flex items-center gap-1 ${
          isWaxing
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : person.hasExemption
            ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-rose-100 text-rose-800 border border-rose-300'
        }`}>
          {isWaxing ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          <span>{isTa ? person.pakshaTa : person.pakshaEn}</span>
        </span>
      </div>

      {/* Illumination Progress Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-2.5 space-y-1.5 text-[11px]">
        <div className="flex justify-between items-center">
          <span className="text-stone-500">{isTa ? 'திதி:' : 'Tithi:'}</span>
          <strong className="text-stone-900">
            {isTa ? `${person.tithiNameTa} (திதி ${person.tithiNum})` : `${person.tithiNameEn} (Tithi ${person.tithiNum})`}
          </strong>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10.5px]">
            <span className="text-stone-500">{isTa ? 'சந்திர ஒளி அளவு:' : 'Lunar Illumination:'}</span>
            <strong className="text-stone-800">{person.illuminationPct}%</strong>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isWaxing ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.max(4, person.illuminationPct)}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between pt-0.5">
          <span className="text-stone-500">{isTa ? 'சந்திர ராசி:' : 'Moon Sign:'}</span>
          <strong className="text-stone-900">{isTa ? person.moonRasiTa : person.moonRasi}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">{isTa ? 'சந்திரன் மீதான குரு பார்வை:' : 'Jupiter Aspect on Moon:'}</span>
          <strong className={person.jupiterAspectsMoon ? 'text-emerald-700' : 'text-stone-600'}>
            {person.jupiterAspectsMoon ? (isTa ? 'உண்டு (சுபம்)' : 'Yes (Auspicious)') : (isTa ? 'இல்லை' : 'No')}
          </strong>
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-1">
          <span className="text-stone-500">{isTa ? 'சந்திர பலம்:' : 'Chandra Bala:'}</span>
          <strong className={isWaxing || person.hasExemption ? 'text-emerald-700' : 'text-rose-700'}>
            {isTa ? person.strengthTa : person.strengthEn}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default function PakshaMatchCard({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const pa = matchReport?.pakshaAnalysis;
  if (!pa) return null;

  const { boy, girl, status, statusTa, verdictEn, verdictTa } = pa;

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Overall Paksha Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        status === 'Uttamam' || status === 'Balanced'
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : status === 'Moderate'
          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
          : 'bg-rose-50/70 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white border border-black/10 shrink-0">
            <Moon className="w-4 h-4 text-[#7A1A22]" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm flex items-center gap-1.5">
              <span>{isTa ? 'வளர்பிறை / தேய்பிறை (பக்ஷ & சந்திர பலம் ஆய்வு)' : 'Valarpirai / Theipirai (Paksha & Chandra Bala Analysis)'}</span>
            </div>
            <p className="text-[11px] font-medium mt-0.5">
              {isTa ? verdictTa : verdictEn}
            </p>
          </div>
        </div>
        <div className="shrink-0 self-end sm:self-center bg-white px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 font-bold">
          {status === 'Needs Care'
            ? <AlertTriangle className="w-4 h-4 text-rose-600" />
            : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{isTa ? statusTa : status}</span>
        </div>
      </div>

      {/* 2. Bride (Left) vs Groom (Right) Paksha Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonPakshaCard
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
        />
        <PersonPakshaCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. Classical Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-[11px] text-stone-700 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22]">
            {isTa ? 'சாஸ்திர விதி:' : 'Classical Rule:'}
          </strong>{' '}
          {isTa
            ? 'சூரியனுக்கும் சந்திரனுக்கும் இடையிலான கோண தூரம் 0°–180° (திதி 1–15) வளர்பிறை எனவும், 180°–360° (திதி 16–30) தேய்பிறை எனவும் கணக்கிடப்படுகிறது. குரு பார்வை அல்லது வளர்பிறை துணையின் சந்திர பலம் தேய்பிறை பலவீனத்தைச் சமன் செய்கிறது.'
            : 'Angular distance from Sun to Moon of 0°–180° (Tithi 1–15) defines Valarpirai (Waxing), and 180°–360° (Tithi 16–30) defines Theipirai (Waning). Jupiter’s aspect or a Valarpirai partner balances waning Moon weakness.'}
        </div>
      </div>
    </div>
  );
}
