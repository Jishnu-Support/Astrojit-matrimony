import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet, formatLocalizedDashaBalance } from './dossierI18n';

export default function DossierDashaBhuktiTable({
  client = {},
  astrologicalDetails = {},
  allMahadashas = [],
  pageNumber = 6,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {client.name || 'Sample'} - {t.dashaSummaryTitle}
        </h2>
        <p className="text-xs font-serif font-bold text-amber-950">
          {t.balanceAtBirth}:{' '}
          {formatLocalizedDashaBalance(astrologicalDetails.dashaBalance, lang)}
        </p>
      </div>

      <div className="my-auto py-2 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-2 border-r border-slate-900 text-left pl-3">{t.dashaLordCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.years}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.firstBhuktiEndCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.midBhuktiEndCol}</th>
                <th className="py-2 px-2 border-r border-slate-900">{t.lastBhuktiEndCol}</th>
                <th className="py-2 px-2">{t.dashaEndAgeCol}</th>
              </tr>
            </thead>
            <tbody>
              {allMahadashas.map((d, idx) => {
                const firstBhukti = d.bhuktis?.[0]?.endDate || '---';
                const midBhukti = d.bhuktis?.[4]?.endDate || '---';
                const lastBhukti = d.bhuktis?.[8]?.endDate || '---';
                const lastAge = d.bhuktis?.[8]?.age || '---';
                const localizedLord = translatePlanet(d.tamilLord || d.name, lang);
                return (
                  <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="py-2.5 px-3 font-bold text-slate-950 text-left border-r border-slate-200 pl-3">
                      {localizedLord}
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold border-r border-slate-200">{d.years} {t.yearAbbr}</td>
                    <td className="py-2.5 px-2 font-mono border-r border-slate-200">{firstBhukti}</td>
                    <td className="py-2.5 px-2 font-mono border-r border-slate-200">{midBhukti}</td>
                    <td className="py-2.5 px-2 font-mono border-r border-slate-200">{lastBhukti}</td>
                    <td className="py-2.5 px-2 font-mono font-black text-amber-950">
                      {lastBhukti} ({lastAge})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-serif leading-relaxed text-slate-800">
          <p>
            {t.bhuktiAntaraIntro}
          </p>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.lifespanFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
