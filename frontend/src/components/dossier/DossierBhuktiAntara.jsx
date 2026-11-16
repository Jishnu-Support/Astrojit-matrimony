import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet } from './dossierI18n';

export default function DossierBhuktiAntara({
  clientName = 'Sample',
  dashaTitle = 'Rahu',
  antaras = [],
  pageNumber = 17,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;
  const localizedLord = translatePlanet(dashaTitle, lang);

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {clientName} - {localizedLord} {t.bhuktiAntaraTitleSub}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-4">
        <p className="text-xs font-serif text-slate-700 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-200">
          {t.bhuktiAntaraIntro}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-3 border-r border-slate-900 text-left pl-4">{t.bhuktiCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.antaraLordCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.durationCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.endDateCol}</th>
                <th className="py-2 px-3">{t.benefitRatioCol}</th>
              </tr>
            </thead>
            <tbody>
              {antaras.map((a, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-2.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200 pl-4">
                    {translatePlanet(a.bhukti, lang)}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                    {translatePlanet(a.antaraLord, lang)}
                  </td>
                  <td className="py-2.5 px-3 font-mono border-r border-slate-200">{a.duration}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-950 border-r border-slate-200">{a.endDate}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={i % 3 === 0 ? 'text-emerald-700' : 'text-amber-800'}>
                      {i % 3 === 0 ? t.strong : t.moderate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-slate-900 p-3 rounded-xl bg-slate-50 text-xs font-serif space-y-1">
          <p><strong>{t.shastraNoteTitle}:</strong> {t.shastraNoteDesc}</p>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.bhuktiScheduleFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
