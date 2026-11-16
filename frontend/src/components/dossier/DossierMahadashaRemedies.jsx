import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet, translateDignity, getLocalizedRemedy } from './dossierI18n';

export default function DossierMahadashaRemedies({
  dasha = {},
  pageNumber = 11,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const bhuktis = dasha.bhuktis || [];
  const localizedLord = translatePlanet(dasha.lord || dasha.name || dasha.tamilLord || 'Rahu', lang);
  const remedy = getLocalizedRemedy(dasha, lang);

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      {/* Title */}
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {localizedLord} - {t.mahadashaDetailsSub} ({dasha.years || 18} {t.years})
        </h2>
      </div>

      <div className="my-auto py-2 space-y-4">
        {/* Bhuktis Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-2 border-r border-slate-900 text-left pl-3">{t.bhuktiCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.dignityCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.durationCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.endDateCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.ageCol}</th>
                <th className="py-2 px-2">{t.resultsCol}</th>
              </tr>
            </thead>
            <tbody>
              {bhuktis.map((b, idx) => (
                <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-2 px-3 font-bold text-slate-950 text-left border-r border-slate-200">
                    {translatePlanet(b.bhukti, lang)}
                  </td>
                  <td className="py-2 px-2 font-bold border-r border-slate-200">
                    <span className={b.dignity?.includes('உச்ச') || b.dignity?.includes('Exalted') || b.dignity?.includes('ஆட்சி') || b.dignity?.includes('Own') ? 'text-emerald-700 font-black' : 'text-slate-800'}>
                      {translateDignity(b.dignity, lang)}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-mono text-[11px] border-r border-slate-200">{b.duration}</td>
                  <td className="py-2 px-2 font-mono font-bold text-slate-950 border-r border-slate-200">{b.endDate}</td>
                  <td className="py-2 px-2 font-mono text-[11px] border-r border-slate-200">{b.age}</td>
                  <td className="py-2 px-2 font-bold text-slate-900">
                    <span className={idx % 3 === 0 ? 'text-emerald-700' : 'text-amber-800'}>
                      {idx % 3 === 0 ? t.strong : t.moderate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sacred Pilgrimage Shrine & Remedy Plaque */}
        <div className="border-2 border-slate-900 rounded-xl p-4 bg-amber-50/50 space-y-3 font-serif">
          <div className="border-b border-amber-300 pb-2">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-widest block">
              {t.pilgrimageTitle}:
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-950 font-serif mt-0.5">
              {remedy.temple}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-white border border-amber-200 rounded-lg">
              <span className="text-slate-500 font-bold block">{t.rulingDeityLabel}:</span>
              <strong className="text-amber-950">{remedy.deity}</strong>
            </div>
            <div className="p-2 bg-white border border-amber-200 rounded-lg">
              <span className="text-slate-500 font-bold block">{t.gemstoneLabel}:</span>
              <strong className="text-amber-950">{remedy.gem}</strong>
            </div>
            <div className="p-2 bg-white border border-amber-200 rounded-lg">
              <span className="text-slate-500 font-bold block">{t.flowerLabel}:</span>
              <strong className="text-amber-950">{remedy.flower}</strong>
            </div>
            <div className="p-2 bg-white border border-amber-200 rounded-lg">
              <span className="text-slate-500 font-bold block">{t.grainLabel}:</span>
              <strong className="text-amber-950">{remedy.grain}</strong>
            </div>
          </div>

          <div className="border-t border-amber-200 pt-2 flex flex-col sm:flex-row sm:justify-between text-xs gap-2">
            <span><strong>{t.clothColorLabel}:</strong> {remedy.cloth}</span>
            <span className="max-w-xl"><strong>{t.remedyMantraLabel}:</strong> {remedy.remedyVerse}</span>
          </div>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
