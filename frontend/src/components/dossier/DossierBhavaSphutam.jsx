import React from 'react';
import SouthIndianChart from '../SouthIndianChart';
import { DOSSIER_TRANSLATIONS, translatePlanet } from './dossierI18n';

export default function DossierBhavaSphutam({
  client = {},
  planets = [],
  bhavaSphutam = [],
  southIndianRashiGrid = {},
  southIndianNavamshaGrid = {},
  southIndianDrekkanaGrid = {},
  southIndianBhavaChalitGrid = {},
  bhavaShiftsTa = '',
  bhavaShiftsEn = '',
  pageNumber = 7,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const clientName = client?.name || 'Native';

  // 9 Core planets for side-by-side display with Bhavas
  const corePlanets = planets.filter(p => !p.name.includes('Lagna')).slice(0, 9);

  return (
    <div className="bg-white border-2 border-slate-900 p-3 sm:p-6 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      {/* 4 Mini Charts: Rashi, Navamsha, Drekkana, Bhava Chalit (Matching Page 7 of Thirukanitha Reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b-2 border-slate-900 pb-3">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-800 font-serif mb-1">
            {lang === 'ta' ? 'ராசி' : 'Rashi'}
          </span>
          <div className="w-full max-w-[170px]">
            <SouthIndianChart gridData={southIndianRashiGrid} chartType="rashi" lang={lang} title="" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-800 font-serif mb-1">
            {lang === 'ta' ? 'நவாம்சம்' : 'Navamsha'}
          </span>
          <div className="w-full max-w-[170px]">
            <SouthIndianChart gridData={southIndianNavamshaGrid} chartType="navamsha" lang={lang} title="" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-800 font-serif mb-1">
            {lang === 'ta' ? '3-திரேக்காணம்' : 'Drekkana (D3)'}
          </span>
          <div className="w-full max-w-[170px]">
            <SouthIndianChart gridData={southIndianDrekkanaGrid} chartType="drekkana" lang={lang} title="" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-800 font-serif mb-1">
            {lang === 'ta' ? 'ஸ்ரீபதி-பாவகம்' : 'Sripati Bhava'}
          </span>
          <div className="w-full max-w-[170px]">
            <SouthIndianChart gridData={southIndianBhavaChalitGrid} chartType="bhava" lang={lang} title="" />
          </div>
        </div>
      </div>

      {/* Sripati Bhava Sphutam Table */}
      <div className="my-auto py-2 space-y-3 font-serif">
        <div className="text-center">
          <h3 className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-wide">
            {clientName} - {lang === 'ta' ? 'பாவக ஸ்புடம் (ஸ்ரீபதி முறை)' : 'Bhava Sphutam (Sripati System)'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-1 px-1.5 border-r border-slate-900">{lang === 'ta' ? 'கிரகம்' : 'Planet'}</th>
                <th className="py-1 px-1.5 border-r border-slate-900">{lang === 'ta' ? 'பாகை' : 'Degree'}</th>
                <th className="py-1 px-1.5 border-r border-slate-900">{lang === 'ta' ? 'பாவம்' : 'Bhava'}</th>
                <th className="py-1 px-1.5 border-r border-slate-900">{lang === 'ta' ? 'ஆரம்பம்' : 'Arambam (Start)'}</th>
                <th className="py-1 px-1.5 border-r border-slate-900 bg-amber-200/70">{lang === 'ta' ? 'மத்தி' : 'Madhya (Cusp)'}</th>
                <th className="py-1 px-1.5 border-r border-slate-900">{lang === 'ta' ? 'முடிவு' : 'Mudivu (End)'}</th>
                <th className="py-1 px-1.5">{lang === 'ta' ? 'அதிபதி' : 'Lord'}</th>
              </tr>
            </thead>
            <tbody>
              {bhavaSphutam.map((b, idx) => {
                const pl = corePlanets[idx];
                const plTamil = pl ? (pl.tamil || pl.name.split(' ')[0]) : '';
                const plDeg = pl ? (pl.formattedColonDeg || pl.longitude || formatColonDMS(pl.deg)) : '';

                return (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                    <td className="py-1 px-1.5 font-bold text-slate-900 border-r border-slate-200 text-left pl-2">
                      {plTamil ? translatePlanet(plTamil, lang) : '---'}
                    </td>
                    <td className="py-1 px-1.5 font-mono text-slate-700 border-r border-slate-200">
                      {plDeg || '---'}
                    </td>
                    <td className="py-1 px-1.5 font-black text-slate-950 border-r border-slate-200 bg-amber-50/40">
                      {b.bhavaNumber}
                    </td>
                    <td className="py-1 px-1.5 font-mono text-slate-800 border-r border-slate-200">
                      {b.start}
                    </td>
                    <td className="py-1 px-1.5 font-mono font-bold text-amber-950 bg-amber-100/50 border-r border-slate-200">
                      {b.mid}
                    </td>
                    <td className="py-1 px-1.5 font-mono text-slate-800 border-r border-slate-200">
                      {b.end}
                    </td>
                    <td className="py-1 px-1.5 font-bold text-slate-900">
                      {translatePlanet(b.lord, lang) || '---'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bhava Shifts (பாவக மாற்றம்) */}
        <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs leading-relaxed">
          <strong className="text-amber-950 font-bold block sm:inline mr-1">
            {lang === 'ta' ? 'ஜாதகத்தில் பாவக மாற்றம் :' : 'Planetary Bhava Shifts :'}
          </strong>
          <span className="font-bold text-slate-900 font-mono">
            {lang === 'ta'
              ? (bhavaShiftsTa || 'பாவக மாற்றம் இல்லை')
              : (bhavaShiftsEn || 'No Bhava Shifts observed')}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-slate-900 pt-2 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter || 'Certified Classical Thirukanitha Ephemeris'}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
