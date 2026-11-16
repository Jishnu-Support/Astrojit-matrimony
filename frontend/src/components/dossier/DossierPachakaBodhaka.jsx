import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet } from './dossierI18n';

export default function DossierPachakaBodhaka({
  pachakaBodhakaData = {},
  pageNumber = 31,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const table = pachakaBodhakaData?.table || [];
  const taraBala = pachakaBodhakaData?.taraBala || [];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.pachakaTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-5">
        {/* 1. Pachaka-Bodhaka-Karaka-Vedhaka Table */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.pachakaSub}
          </h3>
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-3 border-r border-slate-900 text-left pl-4">{t.planetCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.pachakaCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.bodhakaCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.karakaCol}</th>
                <th className="py-2 px-3">{t.vedhakaCol}</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, idx) => (
                <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-2 px-3 font-bold text-slate-950 text-left border-r border-slate-200 pl-4">
                    {translatePlanet(row.planet, lang)}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-800 border-r border-slate-200">{translatePlanet(row.pachaka, lang)}</td>
                  <td className="py-2 px-3 font-bold text-emerald-800 border-r border-slate-200">{translatePlanet(row.bodhaka, lang)}</td>
                  <td className="py-2 px-3 font-bold text-amber-900 border-r border-slate-200">{translatePlanet(row.karaka, lang)}</td>
                  <td className="py-2 px-3 font-bold text-rose-800">{translatePlanet(row.vedhaka, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif space-y-1">
            <p>{t.pachakaDesc}</p>
            <p>{t.bodhakaDesc}</p>
            <p>{t.karakaDesc}</p>
            <p>{t.vedhakaDesc}</p>
          </div>
        </div>

        {/* 2. Tara Bala Table */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.taraBalaSub}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-serif border border-slate-900 text-center">
              <thead>
                <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                  <th className="py-1.5 px-3 border-r border-slate-900 text-left pl-4">{t.taraCol}</th>
                  <th className="py-1.5 px-3 border-r border-slate-900">{t.taraLordCol}</th>
                  <th className="py-1.5 px-3 border-r border-slate-900 text-left">{t.taraImpactCol}</th>
                  <th className="py-1.5 px-3">{t.taraEvaluationCol}</th>
                </tr>
              </thead>
              <tbody>
                {taraBala.map((tb, idx) => (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-1.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200 pl-4">
                      {tb.name}
                    </td>
                    <td className="py-1.5 px-3 font-bold text-amber-950 border-r border-slate-200">{translatePlanet(tb.lord, lang)}</td>
                    <td className="py-1.5 px-3 text-slate-700 text-left border-r border-slate-200">{tb.result}</td>
                    <td className="py-1.5 px-3 font-bold">
                      <span className={tb.benefic ? 'text-emerald-700 font-black' : 'text-rose-700'}>
                        {tb.benefic ? t.strong : t.weak}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
