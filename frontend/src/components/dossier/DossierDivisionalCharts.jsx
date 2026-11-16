import React from 'react';
import SouthIndianChart from '../SouthIndianChart';
import { DOSSIER_TRANSLATIONS } from './dossierI18n';

export default function DossierDivisionalCharts({
  chartPair = [],
  pageNumber = 8,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const chart1 = chartPair[0] || { name: 'Divisional Chart 1', tamil: 'வர்க்க சக்கரம் 1', grid: {} };
  const chart2 = chartPair[1] || { name: 'Divisional Chart 2', tamil: 'வர்க்க சக்கரம் 2', grid: {} };

  const getChartTitle = (ch) => {
    if (lang === 'ta') return ch.tamil || ch.name;
    return ch.name || ch.tamil;
  };

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.divisionalTitle}
        </h2>
      </div>

      <div className="my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-items-center">
        {/* Chart 1 */}
        <div className="w-full max-w-[340px] text-center space-y-2">
          <div className="border-b-2 border-slate-900 pb-1">
            <h3 className="text-sm font-black text-slate-950 font-serif uppercase">
              {getChartTitle(chart1)} ({chart1.code})
            </h3>
            <p className="text-[11px] text-slate-600 font-sans italic">
              {chart1.purpose}
            </p>
          </div>
          <div className="flex justify-center">
            <SouthIndianChart
              gridData={chart1.grid}
              chartType="varga"
              lang={lang}
              title=""
            />
          </div>
        </div>

        {/* Chart 2 */}
        <div className="w-full max-w-[340px] text-center space-y-2">
          <div className="border-b-2 border-slate-900 pb-1">
            <h3 className="text-sm font-black text-slate-950 font-serif uppercase">
              {getChartTitle(chart2)} ({chart2.code})
            </h3>
            <p className="text-[11px] text-slate-600 font-sans italic">
              {chart2.purpose}
            </p>
          </div>
          <div className="flex justify-center">
            <SouthIndianChart
              gridData={chart2.grid}
              chartType="varga"
              lang={lang}
              title=""
            />
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
