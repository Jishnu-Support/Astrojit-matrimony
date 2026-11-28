import React, { useRef } from 'react';
import { Printer, Download, Share2, X, Sparkles, MapPin, Phone, Mail, Award, CheckCircle2, Heart } from 'lucide-react';
import { useLang } from '../i18n';
import { formatNakshatra, formatRasi, formatDosha } from '../matrimonyLocalization';
import { printElementById } from '../utils/printHelper';

export default function MarriageBiodataModal({ profile, isOpen, onClose }) {
  const { lang, t } = useLang();
  const printRef = useRef(null);

  if (!isOpen || !profile) return null;

  // Unilingual helper
  const tr = (en, ta, kn, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  const displayName = profile.fullName || profile.name || 'Candidate';
  const isGroom = (profile.profileType || profile.gender || '').toLowerCase().includes('groom') || profile.gender === 'male';
  const photo = profile.photoUrl || profile.primaryPhoto || (isGroom ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');

  const star = profile.nakshatra || profile.starNakshatra || 'Magha';
  const rasi = profile.rasi || profile.rasiMoonSign || 'Simha (Leo)';
  const lagna = profile.lagna || profile.lagnamAscendant || 'Simha (Leo)';
  const padam = profile.padam || profile.pada || 1;
  const dosha = profile.manglikStatus || profile.manglikDosha || profile.doshaDetails || 'No Dosham (Normal)';
  const gotra = profile.gotra || 'Kashyapa';
  const religion = profile.religion || 'Hindu';
  const caste = profile.caste || 'Brahmin';
  const subCaste = profile.subCaste || profile.sect || '';

  const handlePrint = () => {
    printElementById('printable-marriage-biodata-slip', `Biodata_${displayName || 'Matrimony'}`);
  };

  const handleWhatsAppShare = () => {
    const text = `*AstroJit Vedic Marriage Bio-Data*\n\n*Name:* ${displayName}\n*Profile ID:* ${profile.id || profile.matrimonyId}\n*DOB:* ${profile.dob || '—'}\n*Star / Rasi:* ${star} / ${rasi}\n*Gotram:* ${gotra}\n*Education:* ${profile.highestEducation || profile.degree || '—'}\n*Occupation:* ${profile.occupation || profile.jobTitle || '—'}\n*Location:* ${profile.city || profile.workLocation || '—'}\n*Contact:* ${profile.mobile || profile.contact?.mobile || '—'}\n\n_Verified through AstroJit Vedic Matrimony_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white dark:bg-[#1E1815] rounded-3xl max-w-3xl w-full border border-amber-300 dark:border-amber-700/60 shadow-2xl overflow-hidden my-4 print:border-none print:shadow-none print:rounded-none print:max-w-none print:my-0">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-amber-800 text-white p-3.5 sm:p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="text-xs sm:text-sm font-black tracking-wide uppercase">
                {tr('Traditional Vedic Marriage Bio-Data', 'பாரம்பரிய வேத திருமண ஜாதக பயோடேட்டா')}
              </h3>
              <p className="text-[10px] text-amber-200">
                {tr('Ready to print or share with prospective families & elders', 'அச்சு எடுக்க மற்றும் உறவினர்களுடன் பகிரத் தயாரான வடிவம்')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white dark:bg-[#1E1815] text-rose-800 dark:text-rose-300 hover:bg-amber-50 dark:hover:bg-stone-800/70 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{tr('Print / Save PDF', 'அச்சு / PDF பதிவிறக்கு')}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bio-Data Canvas */}
        <div id="printable-marriage-biodata-slip" ref={printRef} className="p-4 sm:p-8 bg-[#FFFDF9] space-y-5 print:p-6 text-slate-900 border-8 border-double border-amber-300/80 m-2 sm:m-4 rounded-2xl print:border-amber-700 print:m-0 print:rounded-none">
          
          {/* Vedic Invocation Header */}
          <div className="text-center space-y-1 border-b-2 border-amber-300/80 pb-3">
            <div className="text-base sm:text-lg font-serif font-black text-amber-900 tracking-widest">
              || श्री गणेशाय नमः || ॐ नमः शिवाय ||
            </div>
            <div className="text-xs sm:text-sm font-serif font-bold text-rose-800">
              || ஸ்ரீ மஹா கணபதியே நம: || குலதெய்வம் துணை ||
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 uppercase pt-1">
              {tr('Vedic Marriage Bio-Data', 'திருமண ஜாதகக் குறிப்பு (பயோடேட்டா)')}
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-800 font-semibold">
              AstroJit Matrimony ID: <span className="font-mono font-black text-rose-700">{profile.id || profile.matrimonyId}</span>
            </p>
          </div>

          {/* Top Profile Summary Card with Photo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white p-4 rounded-xl border border-amber-200 shadow-2xs">
            <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-100">
              <img src={photo} alt={displayName} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{displayName}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isGroom ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' : 'bg-pink-100 text-pink-900 border border-pink-200'
                }`}>
                  {isGroom ? tr('Groom (மணமகன்)', 'மணமகன்') : tr('Bride (மணமகள்)', 'மணமகள்')}
                </span>
                {(profile.isVerified || profile.account?.isVerified) && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> {tr('Vedic Verified', 'சான்றளிக்கப்பட்டது')}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {religion} • {caste} {subCaste ? `• ${subCaste}` : ''} • <strong className="text-slate-900">Gotra: {gotra}</strong>
              </p>

              <p className="text-xs text-slate-700 font-semibold">
                🎓 {profile.highestEducation || profile.degree || 'Graduate'} {profile.specialization ? `(${profile.specialization})` : ''}
              </p>

              <p className="text-xs text-slate-800 font-bold">
                💼 {profile.occupation || profile.jobTitle || 'Professional'} {profile.company || profile.companyName ? `at ${profile.company || profile.companyName}` : ''}
              </p>

              <p className="text-xs text-emerald-800 font-bold">
                💰 {tr('Annual Income', 'ஆண்டு வருமானம்')}: {profile.annualIncome || 'Confidential / On Request'}
              </p>

              <p className="text-xs text-slate-600">
                📍 {tr('Work Location', 'பணிபுரியும் இடம்')}: {profile.city || profile.workLocation || 'India'}
              </p>
            </div>
          </div>

          {/* 2-Column: Horoscopes & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Astrological Coordinates (Jathagam) */}
            <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-3.5 space-y-2.5">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider border-b border-amber-200 pb-1 flex items-center gap-1.5">
                <span>🕉️</span> {tr('Astrological Coordinates', 'ஜாதகக் குறிப்புகள்')}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Date of Birth', 'பிறந்த தேதி')}</span>
                  <strong className="text-slate-900">{profile.dob || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Birth Time & Place', 'பிறந்த நேரம் & இடம்')}</span>
                  <strong className="text-slate-900">{profile.dobTime || profile.birthTime || '—'}, {profile.dobPlace || profile.birthPlace || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Star / Nakshatra', 'நட்சத்திரம்')}</span>
                  <strong className="text-rose-900">{star} (Padam {padam})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Rasi (Moon Sign)', 'ராசி')}</span>
                  <strong className="text-rose-900">{rasi}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Lagnam (Ascendant)', 'லக்னம்')}</span>
                  <strong className="text-slate-900">{lagna}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Gothram', 'கோத்திரம்')}</span>
                  <strong className="text-slate-900">{gotra}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-amber-900/70 block font-semibold">{tr('Chevvai / Manglik Status', 'செவ்வாய் தோஷம்')}</span>
                  <strong className="text-slate-900">{dosha}</strong>
                </div>
              </div>
            </div>

            {/* Box 2: South Indian Traditional Rasi Kattam (Chart) */}
            <div className="bg-white border border-amber-300 rounded-xl p-3 space-y-2">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider border-b border-amber-200 pb-1 flex items-center justify-between">
                <span>{tr('South Indian Rasi Chart', 'ராசிக் கட்டம் (தென்னிந்திய முறை)')}</span>
                <span className="text-[10px] text-amber-700 font-normal">Thirukanitha</span>
              </h3>

              {/* 4x4 Traditional Vedic Kundli Grid */}
              <div className="grid grid-cols-4 grid-rows-4 gap-1 text-[10px] font-bold text-center h-44 border-2 border-amber-700/80 bg-amber-50/20 p-1 rounded">
                {/* Row 1: Pisces, Aries, Taurus, Gemini */}
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">மீனம்</span>
                  <span className="text-amber-800 text-[9px]">{lagna.includes('Meena') ? 'லக்னம்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">மேஷம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Mesha') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">ரிஷபம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Vrishabha') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">மிதுனம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Mithuna') ? 'சந்திரன்' : ''}</span>
                </div>

                {/* Row 2: Aquarius, Center-Span, Cancer */}
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">கும்பம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Kumbha') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="col-span-2 row-span-2 relative overflow-hidden border-2 border-amber-600 bg-amber-100/50 flex flex-col items-center justify-center p-1 text-center">
                  <img
                    src="/sri-yantra-center.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute inset-0 m-auto w-[84%] h-[84%] object-contain opacity-[0.14]"
                  />
                  <span className="relative z-10 text-sm font-black text-rose-800">ராசி</span>
                  <span className="relative z-10 text-[9px] font-bold text-amber-900 mt-0.5">சுப யோகம்</span>
                  <span className="relative z-10 text-[8px] text-slate-500 font-mono mt-0.5">{star}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">கடகம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Karkata') ? 'சந்திரன்' : ''}</span>
                </div>

                {/* Row 3: Capricorn, Center-Span, Leo */}
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">மகரம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Makara') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">சிம்மம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Simha') ? 'சந்திரன்/சூரியன்' : ''}</span>
                </div>

                {/* Row 4: Sagittarius, Scorpio, Libra, Virgo */}
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">தனுசு</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Dhanus') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">விருச்சிகம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Vrishchika') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">துலாம்</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Tula') ? 'சந்திரன்' : ''}</span>
                </div>
                <div className="border border-amber-300 flex flex-col justify-between p-1 bg-white">
                  <span className="text-[8px] text-slate-400">கன்னி</span>
                  <span className="text-amber-800 text-[9px]">{rasi.includes('Kanya') ? 'சந்திரன்' : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 3: Family Details & Background */}
          <div className="bg-white border border-amber-200 rounded-xl p-3.5 space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <span>👨‍👩‍👧‍👦</span> {tr('Family Background & Ancestry', 'குடும்ப விவரங்கள் & பின்னணி')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{tr("Father's Name", 'தந்தை பெயர்')}</span>
                <strong className="text-slate-900">{profile.fatherName || '—'}</strong>
                <span className="text-[10px] text-slate-500 block">{profile.fatherOccupation}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{tr("Mother's Name", 'தாய் பெயர்')}</span>
                <strong className="text-slate-900">{profile.motherName || '—'}</strong>
                <span className="text-[10px] text-slate-500 block">{profile.motherOccupation}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{tr('Brothers & Sisters', 'உடன்பிறப்புகள்')}</span>
                <strong className="text-slate-900">
                  {profile.brothersCount || 0} Brother(s), {profile.sistersCount || 0} Sister(s)
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{tr('Native Place / Origin', 'பூர்வீகம் / சொந்த ஊர்')}</span>
                <strong className="text-slate-900">{profile.nativePlace || profile.familyOrigin || 'Tamil Nadu'}</strong>
              </div>
            </div>
          </div>

          {/* Box 4: Contact & Residence */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
            <div>
              <span className="text-[10px] text-amber-900/80 block font-bold uppercase">{tr('Direct Contact Details for Alliance Discussion', 'தொடர்பு முகவரி மற்றும் எண்கள்')}</span>
              <p className="font-mono text-sm font-bold text-slate-900">
                📞 {profile.mobile || profile.contact?.mobile || '—'} {profile.contact?.whatsapp ? `(WhatsApp: ${profile.contact.whatsapp})` : ''}
              </p>
              <p className="text-[11px] text-slate-600">
                ✉️ {profile.email || profile.contact?.email || '—'} • 🏠 {profile.currentResidence || profile.city || 'India'}
              </p>
            </div>

            <div className="text-right shrink-0 print:block">
              <span className="text-[10px] text-slate-400 block">Verified on AstroJit Platform</span>
              <span className="text-[11px] font-bold text-rose-800">www.astrojit.com</span>
            </div>
          </div>

          {/* Footer Blessing */}
          <div className="text-center pt-2 text-[10px] text-amber-900/80 font-serif italic border-t border-amber-200">
            || சுபமஸ்து • கல்யாண ப்ராப்திரஸ்து • சர்வ மங்களா மாங்கல்யே சிவே சர்வார்த்த சாதிகே ||
          </div>
        </div>
      </div>
    </div>
  );
}
