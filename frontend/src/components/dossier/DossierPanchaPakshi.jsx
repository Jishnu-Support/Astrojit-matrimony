import React from 'react';
import { DOSSIER_TRANSLATIONS } from './dossierI18n';

export default function DossierPanchaPakshi({
  panchaPakshiData = {},
  pageNumber = 21,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const birdTranslations = {
    Owl: { en: 'Owl', ta: 'ஆந்தை', kn: 'ಗೂಬೆ', hi: 'उल्लू', te: 'గుడ్లగూబ' },
    Crow: { en: 'Crow', ta: 'காகம்', kn: 'ಕಾಗೆ', hi: 'कौआ', te: 'కాకి' },
    Cock: { en: 'Rooster / Cock', ta: 'கோழி', kn: 'ಕೋಳಿ', hi: 'मुर्गा', te: 'కోడి' },
    Peacock: { en: 'Peacock', ta: 'மயில்', kn: 'ನವಿಲು', hi: 'मोर', te: 'నెమలి' },
    Vulture: { en: 'Vulture / Hawk', ta: 'வல்லூறு', kn: 'ಗಿಡುಗ', hi: 'गिद्ध', te: 'డేగ' }
  };

  const rawBird = panchaPakshiData?.nativeBird || {};
  const birdKey = rawBird.name || 'Owl';
  const localizedBirdName = birdTranslations[birdKey]?.[lang] || rawBird.tamil || birdKey;

  const activities = panchaPakshiData?.dayActivities || [
    { span: '06:00 - 08:24', act: t.eating, sub: t.strong },
    { span: '08:24 - 10:48', act: t.walking, sub: t.moderate },
    { span: '10:48 - 13:12', act: t.ruling, sub: t.strong },
    { span: '13:12 - 15:36', act: t.sleeping, sub: t.weak },
    { span: '15:36 - 18:00', act: t.dying, sub: t.weak }
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.panchaPakshiTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-5">
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-300 text-xs font-serif text-slate-800 leading-relaxed">
          <p>
            {t.panchaPakshiIntro}
          </p>
        </div>

        {/* Native Bird Profile */}
        <div className="border-2 border-slate-900 rounded-xl p-4 bg-white space-y-3">
          <div className="flex justify-between items-center border-b border-slate-300 pb-2">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">{t.nativeBirdTitle}:</span>
              <h3 className="text-lg font-black text-amber-950 font-serif">{localizedBirdName}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase font-bold">{t.elementDirectionTitle}:</span>
              <div className="text-xs font-bold text-slate-900">
                {lang === 'ta' ? 'நீர் • கிழக்கு' : lang === 'kn' ? 'ಜಲ ತತ್ವ • ಪೂರ್ವ' : lang === 'hi' ? 'जल तत्व • पूर्व' : lang === 'te' ? 'జల తత్వం • తూర్పు' : 'Water Element • East'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <strong className="text-emerald-950 block">{t.friendlyBirdsTitle}:</strong>
              <span className="text-emerald-800">
                {lang === 'ta' ? 'காகம், மயில்' : lang === 'kn' ? 'ಕಾಗೆ, ನವಿಲು' : lang === 'hi' ? 'कौआ, मोर' : lang === 'te' ? 'కాకి, నెమలి' : 'Crow, Peacock'}
              </span>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200">
              <strong className="text-rose-950 block">{t.enemyBirdsTitle}:</strong>
              <span className="text-rose-800">
                {lang === 'ta' ? 'வல்லூறு, கோழி' : lang === 'kn' ? 'ಗಿಡುಗ, ಕೋಳಿ' : lang === 'hi' ? 'गिद्ध, मुर्गा' : lang === 'te' ? 'డేగ, కోడి' : 'Vulture, Cock'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-rose-100/70 border border-rose-300 rounded-xl text-xs font-serif">
            <strong className="text-rose-950 block uppercase tracking-wide">{t.padupakshiTitle}:</strong>
            <span className="font-bold text-rose-900">
              {lang === 'ta' ? 'வெள்ளிக்கிழமை' : lang === 'kn' ? 'ಶುಕ್ರವಾರ' : lang === 'hi' ? 'शुक्रवार' : lang === 'te' ? 'శుక్రవారం' : 'Friday'}
            </span>
            <p className="text-[11px] text-rose-800 mt-1 italic">
              {t.padupakshiWarning}
            </p>
          </div>
        </div>

        {/* 5 Activities Daily Schedule */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.daytimeActivitiesTitle}
          </h3>
          <table className="w-full text-xs font-serif border border-slate-900 text-center">
            <thead>
              <tr className="bg-amber-100 text-slate-950 border-b border-slate-900 font-bold">
                <th className="py-2 px-3 border-r border-slate-900 text-left pl-4">{t.activityCol}</th>
                <th className="py-2 px-3 border-r border-slate-900">{t.timeSpanCol}</th>
                <th className="py-2 px-3">{t.auspiciousnessCol}</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="py-2 px-3 font-bold text-slate-950 text-left border-r border-slate-200 pl-4">
                    {act.act || act.tamilActivity || act.activity}
                  </td>
                  <td className="py-2 px-3 font-mono border-r border-slate-200">{act.span || act.interval}</td>
                  <td className="py-2 px-3 font-bold">
                    <span className={act.sub === t.strong || act.subha ? 'text-emerald-700 font-black' : 'text-rose-700'}>
                      {act.sub || (act.subha ? t.strong : t.moderate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.shodashavargaFooter}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
