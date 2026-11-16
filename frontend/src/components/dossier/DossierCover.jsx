import React from 'react';
import { DOSSIER_TRANSLATIONS } from './dossierI18n';

export default function DossierCover({ client = {}, pageNumber = 1, lang = 'ta', totalPages = 21 }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  return (
    <div className="bg-white border-2 border-slate-900 rounded-none p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      {/* Astrologer Centre Header */}
      <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1.5">
        <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-950 font-serif uppercase">
          {t.centreName}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-amber-900 font-serif">
          {t.founders}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-600 font-mono">
          {t.address}
        </p>
      </div>

      {/* Center Sacred Emblem & Title */}
      <div className="text-center my-auto space-y-6 py-6">
        <div className="inline-block p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-inner">
          <div className="text-5xl sm:text-6xl text-amber-700 animate-pulse">
            ॐ
          </div>
          <div className="text-xs font-bold text-amber-900 mt-1 uppercase tracking-widest">
            {t.ganeshaMantra}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-slate-950 font-serif tracking-wide uppercase">
            {t.horoscopeTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium italic max-w-lg mx-auto">
            {t.coverSub}
          </p>
          <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold font-mono uppercase tracking-widest print:border print:border-black print:bg-white print:text-black">
            {totalPages} {t.pagesEdition}
          </div>
        </div>

        {/* Sacred Classical Inscription */}
        <div className="max-w-md mx-auto p-2.5 bg-amber-50/70 border border-amber-300 rounded-xl text-center text-xs font-serif italic text-amber-950 leading-relaxed">
          {lang === 'ta'
            ? 'ஜனனீ ஜன்ம ஸௌக்யானாம் வர்த்தனீ குலஸம்பதாம் / பதவீ பூர்வ புண்யானாம் லிக்யதே ஜன்ம பத்ரிகா.'
            : lang === 'kn'
            ? 'ಜನನೀ ಜನ್ಮ ಸೌಖ್ಯಾನಾಂ ವರ್ಧನೀ ಕುಲಸಂಪದಾಮ್ । ಪದವೀ ಪೂರ್ವಪುಣ್ಯಾನಾಂ ಲಿಖ್ಯತೇ ಜನ್ಮಪತ್ರಿಕಾ ॥'
            : lang === 'hi'
            ? 'जननी जन्म सौख्यानां वर्धनी कुलसम्पदाम् । पदवी पूर्वपुण्यानां लिख्यते जन्मपत्रिका ॥'
            : lang === 'te'
            ? 'జననీ జన్మ సౌఖ్యానాం వర్ధనీ కులసంపదామ్ । పదవీ పూర్వపుణ్యానాం లిఖ్యతే జన్మపత్రికా ॥'
            : 'Janani Janma Saukhyanam Vardhani Kula Sampadam / Padavi Poorva Punyanam Likhyate Janma Patrika.'}
        </div>

        {/* Native Details Plaque */}
        <div className="border-2 border-slate-900 p-5 rounded-2xl max-w-md mx-auto bg-amber-50/30 text-left space-y-2 text-xs sm:text-sm font-serif">
          <div className="flex justify-between border-b border-slate-300 pb-1.5">
            <span className="font-bold text-slate-700">{t.native}:</span>
            <span className="font-black text-slate-950">{client.name || 'Sample'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-300 pb-1.5">
            <span className="font-bold text-slate-700">{t.gender}:</span>
            <span className="font-bold text-slate-950">
              {['female', 'பெண்', 'f', 'woman', 'girl', 'महिला', 'ಮಹಿಳೆ'].includes((client.gender || '').toString().toLowerCase().trim()) ? t.female : t.male}
            </span>
          </div>
          {client.fatherName && (
            <div className="flex justify-between border-b border-slate-300 pb-1.5">
              <span className="font-bold text-slate-700">{t.father}:</span>
              <span className="font-bold text-slate-950">{client.fatherName}</span>
            </div>
          )}
          {client.motherName && (
            <div className="flex justify-between border-b border-slate-300 pb-1.5">
              <span className="font-bold text-slate-700">{t.mother}:</span>
              <span className="font-bold text-slate-950">{client.motherName}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-slate-300 pb-1.5">
            <span className="font-bold text-slate-700">{t.birthDate}:</span>
            <span className="font-mono font-bold text-slate-950">{client.dob || '30-10-2026'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-300 pb-1.5">
            <span className="font-bold text-slate-700">{t.birthTime}:</span>
            <span className="font-mono font-bold text-slate-950">{client.dobTime || '10:55:08 AM'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-slate-700">{t.birthPlace}:</span>
            <span className="font-bold text-slate-950">{client.dobPlace || client.nativePlace || 'Bangalore'}</span>
          </div>
        </div>
      </div>

      {/* Footer Blessing & Page Index */}
      <div className="text-center border-t-2 border-slate-900 pt-4 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.footerBlessing}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
