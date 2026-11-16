import React from 'react';
import { DOSSIER_TRANSLATIONS, translatePlanet } from './dossierI18n';

export function DossierVinayakarStuti({ pageNumber = 2, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const stutisByLang = {
    ta: {
      verse1: [
        'தங்க மான் மழு வேந்தித்தன்',
        'தன்மதி தலை யிற் கொண்டோன்',
        'கங்கைவாழ் சடையன் காமன்',
        'கனலெழக் காய்ந்த கண்ணான்',
        'திங்கள்வாழ் நுதலினாளோர்',
        'திருமுலைப் பாகன் தந்த',
        'செங்கண்மா களிற்றின் பாதம்',
        'சிந்தையிற் சேர்த்தி வாழ்வாம்.'
      ],
      verse2: '"ஐந்து கரத்தனை யானை முகத்தனை இந்தின் இளம்பிறை போலும் எயிற்றனை நந்தி மகன்றனை ஞானக் கொழுந்தினைப் புந்தியில் வைத்தடி போற்றுகின்றேனே."'
    },
    kn: {
      verse1: [
        'ವಕ್ರತುಂಡ ಮಹಾಕಾಯ ಸೂರ್ಯಕೋಟಿ ಸಮಪ್ರಭ ।',
        'ನಿರ್ವಿಘ್ನಂ ಕುರು ಮೇ ದೇವ ಸರ್ವಕಾರ್ಯೇಷು ಸರ್ವದಾ ॥',
        'ಅಗಜಾನನ ಪದ್ಮಾರ್ಕಂ ಗಜಾನನಮಹರ್ನಿಶಮ್ ।',
        'ಅನೇಕದಂತಂ ಭಕ್ತಾನಾಂ ಏಕದಂತಮುಪಾಸ್ಮಹೇ ॥'
      ],
      verse2: '"ಗಣೇಶಾಯ ನಮಸ್ತುಭ್ಯಂ ವರದಾಯ ಶುಭಪ್ರದ । ವಿಘ್ನಹರ್ತೇ ನಮಸ್ತೇಸ್ತು ಭಕ್ತಿಮುಕ್ತಿ ಪ್ರದಾಯಕ ॥"'
    },
    hi: {
      verse1: [
        'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।',
        'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
        'अगजानन पद्मार्कं गजाननमहर्निशम् ।',
        'अनेकदंतं भक्तानां एकदन्तमुपास्महे ॥'
      ],
      verse2: '"विघ्नेश्वराय वरदाय सुरप्रियाय लम्बोदराय सकलाय जगद्धिताय । गौरीसुताय गणनाथ नमो नमस्ते ॥"'
    },
    te: {
      verse1: [
        'వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ ।',
        'నిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ॥',
        'అగజానన పద్మార్కం గజాననమహర్నిశం ।',
        'అనేకదంతం భక్తానాం ఏకదంతముపాస్మహే ॥'
      ],
      verse2: '"శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజం । ప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే ॥"'
    },
    en: {
      verse1: [
        'Vakratunda Mahakaya Surya Koti Samaprabha,',
        'Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada.',
        'Agajanana Padmarkam Gajananam Aharnisham,',
        'Aneka Dantam Bhaktanam Eka Dantam Upasmahe.'
      ],
      verse2: '"Shuklambara Dharam Vishnum Shashi Varnam Chatur Bhujam, Prasanna Vadanam Dhyayet Sarva Vighnopa Shantaye."'
    }
  };

  const sel = stutisByLang[lang] || stutisByLang.en;

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.vinayakarTitle}
        </h2>
      </div>

      <div className="my-auto space-y-6 text-center max-w-xl mx-auto py-8">
        <div className="text-4xl text-amber-700 font-serif">
          卐 ॐ 卐
        </div>

        <div className="bg-amber-50/60 border-2 border-amber-300 p-6 rounded-2xl text-slate-950 font-serif leading-loose text-sm sm:text-base font-bold shadow-inner">
          {sel.verse1.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-300 p-5 rounded-xl text-xs sm:text-sm text-slate-700 font-serif leading-relaxed italic">
          {sel.verse2}
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.footerBlessing}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}

export function DossierNavagrahaStotram({ pageNumber = 3, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  const stotras = [
    { pKey: 'sun', s: 'जपाकुसुम संकाशं काश्यपेयं महाद्युतिम् । तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम् ॥' },
    { pKey: 'moon', s: 'दधिशंख तुषाराभं क्षीरोदार्णव संभवम् । नमामि शशिनं सोमं शंभोर्मुकुट भूषणम् ॥' },
    { pKey: 'mars', s: 'धरणीगर्भ संभूतं विद्युत्कांति समप्रभम् । कुमारं शक्तिहस्तं च मंगलं प्रणमाम्यहम् ॥' },
    { pKey: 'mercury', s: 'प्रियंगुकलिकाश्यामं रूपेणाप्रतिमं बुधम् । सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम् ॥' },
    { pKey: 'jupiter', s: 'देवानां च ऋषीणां च गुरुं कांचनसंनिभम् । बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम् ॥' },
    { pKey: 'venus', s: 'हिमकुंद मृणालाभं दैत्यानां परमं गुरुम् । सर्वशास्त्र प्रवक्तारं भार्गवं प्रणमाम्यहम् ॥' },
    { pKey: 'saturn', s: 'नीलांजन समाभासं रविपुत्रं यमाग्रजम् । छायामार्तंड संभूतं तं नमामि शनैश्चरम् ॥' },
    { pKey: 'rahu', s: 'अर्धकायं महावीर्यं चंद्रादित्य विमर्दनम् । सिंहिकागर्भ संभूतं तं राहुं प्रणमाम्यहम् ॥' },
    { pKey: 'ketu', s: 'पलाशपुष्प संकाशं तारकाग्रह मस्तकम् । रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम् ॥' },
  ];

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.navagrahaTitle}
        </h2>
      </div>

      <div className="my-auto space-y-2 py-4">
        {stotras.map((s, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-2.5 bg-amber-50/20 text-xs font-serif flex items-center justify-between gap-4">
            <span className="font-bold text-amber-950 shrink-0 w-28 text-left">
              {translatePlanet(s.pKey, lang)}:
            </span>
            <span className="text-slate-800 text-right leading-relaxed italic">
              {s.s}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.footerBlessing}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}

export function DossierCombinedStutis({ pageNumber = 2, lang = 'ta' }) {
  const t = DOSSIER_TRANSLATIONS[lang] || DOSSIER_TRANSLATIONS.en;

  return (
    <div className="bg-white border-2 border-slate-900 p-6 sm:p-10 shadow-lg min-h-[1050px] flex flex-col justify-between text-slate-900 print:shadow-none print:border-2 print:border-black print:min-h-screen page-break">
      <div className="text-center border-b-2 border-slate-900 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-950 font-serif uppercase tracking-wide">
          {t.vinayakarTitle} & {t.navagrahaTitle}
        </h2>
      </div>

      <div className="my-auto space-y-6">
        <div className="text-center bg-amber-50/60 border border-amber-300 p-4 rounded-xl font-serif text-sm">
          <p className="font-bold text-amber-950 mb-1">ॐ {t.ganeshaMantra} ॐ</p>
          <p className="text-xs text-slate-700 italic">
            "Vakratunda Mahakaya Surya Koti Samaprabha, Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada."
          </p>
        </div>

        <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2 text-xs font-serif">
          <h3 className="font-bold text-slate-900 text-center uppercase tracking-wider border-b border-slate-300 pb-1">
            {t.navagrahaTitle}
          </h3>
          <p className="text-center italic leading-relaxed text-slate-800">
            "Namah Suryaya Chandraya Mangalaya Budhaya Cha, Guru Shukra Shanibhyashcha Rahave Ketave Namah."
          </p>
        </div>
      </div>

      <div className="text-center border-t-2 border-slate-900 pt-3 text-[11px] text-slate-600 font-serif flex justify-between items-center">
        <span>{t.footerBlessing}</span>
        <span className="font-mono font-bold text-slate-900">-{pageNumber}-</span>
      </div>
    </div>
  );
}
