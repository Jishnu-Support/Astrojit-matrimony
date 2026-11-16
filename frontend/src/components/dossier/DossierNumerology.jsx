import React from 'react';
import { DOSSIER_TRANSLATIONS } from './dossierI18n';

export default function DossierNumerology({
  client = {},
  numerology = {},
  pageNumber = 21,
  lang = 'ta'
}) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const rows = [
    { label: t.native, val: client.name || 'Sample' },
    { label: t.nameNumberLabel, val: `${numerology.nameNumber || 24} = ${numerology.singleNameNumber || 6}` },
    { label: t.birthNumberLabel, val: `${numerology.birthNumber || 3}` },
    { label: t.destinyNumberLabel, val: `${numerology.destinyNumber || 7}` },
    { label: t.luckyDatesLabel, val: numerology.luckyDates || '3, 6, 9, 12, 15, 18, 21, 24, 27, 30' },
    { label: t.luckyDaysLabel, val: lang === 'ta' ? 'வியாழன், வெள்ளி, ஞாயிறு' : lang === 'kn' ? 'ಗುರುವಾರ, ಶುಕ್ರವಾರ, ಭಾನುವಾರ' : lang === 'hi' ? 'गुरुवार, शुक्रवार, रविवार' : lang === 'te' ? 'గురువారం, శుక్రవారం, ఆదివారం' : 'Thursday, Friday, Sunday' },
    { label: t.luckyColorsLabel, val: lang === 'ta' ? 'மஞ்சள், வெண்மை, இளஞ்சிவப்பு' : lang === 'kn' ? 'ಹಳದಿ, ಬಿಳಿ, ತಿಳಿ ಗುಲಾಬಿ' : lang === 'hi' ? 'पीला, श्वेत, हल्का गुलाबी' : lang === 'te' ? 'పసుపు, తెలుపు, గులాబీ' : 'Yellow, White, Pink' },
    { label: t.luckyGemLabel, val: lang === 'ta' ? 'மரகதம், புஷ்பராகம்' : lang === 'kn' ? 'ಪಚ್ಚೆ, ಪುಷ್ಯರಾಗ' : lang === 'hi' ? 'पन्ना, पुखराज' : lang === 'te' ? 'పచ్చ, పుష్యరాగం' : 'Emerald, Yellow Sapphire' },
    { label: t.rulingDeityNumerologyLabel, val: lang === 'ta' ? 'ஸ்ரீ தட்சிணாமூர்த்தி & ஸ்ரீ மகாலட்சுமி' : lang === 'kn' ? 'ಶ್ರೀ ದಕ್ಷಿಣಾಮೂರ್ತಿ & ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮಿ' : lang === 'hi' ? 'श्री दक्षिणामूर्ति एवं श्री महालक्ष्मी' : lang === 'te' ? 'శ్రీ దక్షిణామూర్తి & శ్రీ మహాలక్ష్మి' : 'Sri Dakshinamurthy & Sri Mahalakshmi' },
    { label: t.luckyDirectionLabel, val: lang === 'ta' ? 'வடகிழக்கு (ஈசான்யம்)' : lang === 'kn' ? 'ಈಶಾನ್ಯ (ಉತ್ತರ-ಪೂರ್ವ)' : lang === 'hi' ? 'ईशान कोण (उत्तर-पूर्व)' : lang === 'te' ? 'ఈశాన్యం (ఉత్తర-తూర్పు)' : 'North-East (Ishanya)' },
  ];

  const chaldeanGrid = [
    { num: 1, letters: 'A, I, J, Q, Y' },
    { num: 2, letters: 'B, K, R' },
    { num: 3, letters: 'C, G, L, S' },
    { num: 4, letters: 'D, M, T' },
    { num: 5, letters: 'E, H, N, X' },
    { num: 6, letters: 'U, V, W' },
    { num: 7, letters: 'O, Z' },
    { num: 8, letters: 'F, P' },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-4 sm:p-8 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-base sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.numerologyTitle}
        </h2>
      </div>

      <div className="my-auto py-2 space-y-6">
        <div className="border border-slate-900 rounded-xl overflow-hidden">
          <table className="w-full text-xs sm:text-sm font-serif">
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-amber-50/20' : 'bg-white'}`}>
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-200 w-1/2">
                    {r.label}
                  </td>
                  <td className="py-2.5 px-4 font-black text-slate-950 font-mono">
                    {r.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chaldean Letter Value Reference Table */}
        <div className="space-y-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-950 font-serif uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.chaldeanAlphabetTitle}
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs font-serif">
            {chaldeanGrid.map((c, i) => (
              <div key={i} className="p-2 border border-slate-900 rounded-lg bg-slate-50">
                <span className="text-lg font-black font-mono text-amber-950 block">{c.num}</span>
                <span className="text-[11px] font-mono text-slate-600 font-bold">{c.letters}</span>
              </div>
            ))}
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
