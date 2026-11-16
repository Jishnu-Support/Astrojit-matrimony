import React from 'react';
import SouthIndianChart from '../SouthIndianChart';
import {
  DOSSIER_TRANSLATIONS,
  translateRashi,
  translateNakshatra,
  formatLocalizedDashaBalance
} from './dossierI18n';

export default function DossierCharts({
  client = {},
  astrologicalDetails = {},
  southIndianRashiGrid = {},
  southIndianNavamshaGrid = {},
  pageNumber = 4,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const nakName = translateNakshatra(astrologicalDetails.nakshatra || 'Ardra', lang);
  const rashiName = translateRashi(astrologicalDetails.moonSign || 'Mithuna', lang);
  const lagnaName = translateRashi(astrologicalDetails.lagna?.signName || 'Dhanu', lang);

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      {/* Native Compact Header */}
      <div className="border border-slate-900 rounded-xl p-3 bg-amber-50/40 text-xs font-serif grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div><strong>{t.native}:</strong> {client.name || 'Sample'} ({['female', 'பெண்', 'f', 'woman', 'girl', 'महिला', 'ಮಹಿಳೆ'].includes((client.gender || '').toString().toLowerCase().trim()) ? t.female : t.male})</div>
        <div><strong>{t.birthDate}:</strong> {client.dob || '30-10-2026'}</div>
        <div><strong>{t.birthTime}:</strong> {client.dobTime || '10:55:08 AM'}</div>
        <div><strong>{t.nakshatra}:</strong> {nakName} ({astrologicalDetails.pada || 1} {t.pada})</div>
        <div><strong>{t.rashi}:</strong> {rashiName}</div>
        <div><strong>{t.lagna}:</strong> {lagnaName}</div>
        <div className="col-span-2">
          <strong>{t.balanceDasha}:</strong>{' '}
          {formatLocalizedDashaBalance(astrologicalDetails.dashaBalance, lang)}
        </div>
      </div>

      {/* Dual South Indian Square Charts */}
      <div className="my-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-items-center">
        {/* Rashi Chart */}
        <div className="w-full max-w-[340px] text-center space-y-2">
          <h3 className="text-sm font-black text-slate-950 font-serif uppercase tracking-wider border-b-2 border-slate-900 pb-1">
            {t.rashiChart}
          </h3>
          <div className="flex justify-center">
            <SouthIndianChart
              gridData={southIndianRashiGrid}
              chartType="rashi"
              lang={lang}
              title=""
            />
          </div>
        </div>

        {/* Navamsha Chart */}
        <div className="w-full max-w-[340px] text-center space-y-2">
          <h3 className="text-sm font-black text-slate-950 font-serif uppercase tracking-wider border-b-2 border-slate-900 pb-1">
            {t.navamshaChart}
          </h3>
          <div className="flex justify-center">
            <SouthIndianChart
              gridData={southIndianNavamshaGrid}
              chartType="navamsha"
              lang={lang}
              title=""
            />
          </div>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.chakraFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
