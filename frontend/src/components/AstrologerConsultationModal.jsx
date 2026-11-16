import React, { useState } from 'react';
import { Sparkles, Compass, Send, CheckCircle2, X, AlertCircle, Calendar, User, Heart } from 'lucide-react';
import { useLang } from '../i18n';
import { API } from '../api';
import { formatNakshatra, formatRasi } from '../matrimonyLocalization';

export default function AstrologerConsultationModal({
  candidate,
  userProfile,
  compatibilityResult,
  isOpen,
  onClose,
  onSuccess
}) {
  const { lang, t } = useLang();
  const [selectedAstrologer, setSelectedAstrologer] = useState('astro-1');
  const [query, setQuery] = useState(
    'Kindly examine the 10 Poruthams, Dasa Sandhi alignment, Chevvai Dosha cancellation, and recommend auspicious Vivaha Muhurtham dates for 2026/2027.'
  );
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !candidate) return null;

  const tr = (en, ta, kn, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  const astrologers = [
    {
      id: 'astro-1',
      name: 'Pandit Rajesh Sharma',
      title: tr('Senior Vedic Astrologer & Vivaha Specialist', 'மூத்த வேத ஜோதிடர் & திருமணப் பொருத்த நிபுணர்'),
      experience: tr('28+ Years Experience • Kashi Jyotish Visharad', '28+ ஆண்டுகள் அனுபவம் • காசி ஜோதிட விஸாரத்'),
      fee: 'Included in Vedic Plan',
      rating: '4.9 ★ (1,840+ Consultations)',
    },
    {
      id: 'astro-2',
      name: 'AstroVeda Consultancy LLP',
      title: tr('Comprehensive Jathagam & Dosha Pariharam Firm', 'முழுமையான ஜாதகப் பொருத்தம் மற்றும் பரிகார ஆலோசனை நிறுவனம்'),
      experience: tr('15+ Years Experience • Institutional Panel', '15+ ஆண்டுகள் அனுபவம் • நிறுவனக் குழு'),
      fee: 'Included in Vedic Plan',
      rating: '4.8 ★ (920+ Consultations)',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      // Determine Boy and Girl
      const candidateIsFemale = (candidate.profileType || candidate.gender || '').toLowerCase().includes('bride') || candidate.gender === 'female';
      
      const boy = candidateIsFemale
        ? {
            name: userProfile?.fullName || userProfile?.name || 'Client',
            dob: userProfile?.dob || '1996-08-15',
            dobTime: userProfile?.dobTime || '06:30',
            dobPlace: userProfile?.dobPlace || 'Bengaluru, India',
            nakshatra: userProfile?.nakshatra || userProfile?.starNakshatra || 'Magha',
            rasi: userProfile?.rasi || userProfile?.rasiMoonSign || 'Simha',
          }
        : {
            name: candidate.fullName || candidate.name || 'Candidate',
            dob: candidate.dob || '1996-08-15',
            dobTime: candidate.dobTime || '06:30',
            dobPlace: candidate.dobPlace || 'Chennai, India',
            nakshatra: candidate.nakshatra || candidate.starNakshatra || 'Magha',
            rasi: candidate.rasi || candidate.rasiMoonSign || 'Simha',
          };

      const girl = candidateIsFemale
        ? {
            name: candidate.fullName || candidate.name || 'Candidate',
            dob: candidate.dob || '1998-11-23',
            dobTime: candidate.dobTime || '17:45',
            dobPlace: candidate.dobPlace || 'Chennai, Tamil Nadu',
            nakshatra: candidate.nakshatra || candidate.starNakshatra || 'Uttara Ashadha',
            rasi: candidate.rasi || candidate.rasiMoonSign || 'Dhanus',
          }
        : {
            name: userProfile?.fullName || userProfile?.name || 'Client',
            dob: userProfile?.dob || '1998-11-23',
            dobTime: userProfile?.dobTime || '17:45',
            dobPlace: userProfile?.dobPlace || 'Chennai, Tamil Nadu',
            nakshatra: userProfile?.nakshatra || userProfile?.starNakshatra || 'Uttara Ashadha',
            rasi: userProfile?.rasi || userProfile?.rasiMoonSign || 'Dhanus',
          };

      const payload = {
        boy,
        girl,
        astrologerId: selectedAstrologer,
        clientQuery: query,
        source: 'matrimony_match_review',
        precalculatedReport: compatibilityResult || null,
      };

      await API.requestMatchmakingReview(payload);
      setSubmittedSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit consultation request:', err);
      setErrorMsg(err.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const quickQuestions = [
    tr('Please examine Chevvai Dosha cancellation between both charts.', 'இருவர் ஜாதகத்திலும் செவ்வாய் தோஷ நிவர்த்தி உள்ளதா என்பதை ஆராயவும்.'),
    tr('Check Dasa Sandhi and longevity harmony for marriage.', 'தசா சந்தி மற்றும் ஆயுள் ஆரோக்ய பொருத்தத்தை ஆய்வு செய்யவும்.'),
    tr('Recommend auspicious Vivaha Muhurtham dates for late 2026 / 2027.', '2026 / 2027 ஆம் ஆண்டிற்கான சுப விவாக முகூர்த்த தேதிகளை பரிந்துரைக்கவும்.'),
    tr('Advise if any pre-marriage temple archana or pariharam is required.', 'திருமணத்திற்கு முன் செய்ய வேண்டிய சுப பரிகாரங்களை வழிகாட்டவும்.'),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-amber-300 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-amber-700 text-white p-4 sm:p-5 flex justify-between items-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white">
                {tr('Request Astrologer Match Consultation', 'ஜோதிடர் திருமணப் பொருத்த விரிவான ஆய்வு')}
              </h3>
              <p className="text-[11px] text-indigo-100">
                {tr('1-on-1 Horoscope deep-dive & personalized Vivaha prescription', 'நேரடி ஜோதிட ஆய்வு & விவாக முகூர்த்த வழிகாட்டுதல்')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              {tr('Consultation Request Submitted Successfully!', 'ஜோதிடர் ஆய்வு கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது!')}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {tr(
                'Your request has been delivered to the selected Astrologer. You will receive detailed notes, Dasa Sandhi score, and Vivaha Muhurtham recommendations in your Astrojit Appointments tab.',
                'உங்கள் கோரிக்கை ஜோதிடருக்கு அனுப்பி வைக்கப்பட்டுள்ளது. ஆய்வு முடிவுகள் மற்றும் முகூர்த்த பரிந்துரைகள் உங்கள் அஸ்ட்ரோஜித் கணக்கில் பதிவேற்றப்படும்.'
              )}
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                {tr('Done', 'முடிந்தது')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Candidate & Match Quick Pill */}
            <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={candidate.photoUrl || candidate.primaryPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                  alt={candidate.fullName || candidate.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-300"
                />
                <div>
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">{tr('Match Under Review', 'ஆய்வு செய்யப்படும் வரன்')}</span>
                  <strong className="text-slate-900 text-xs">{candidate.fullName || candidate.name}</strong>
                  <span className="text-[10px] text-slate-500 block">
                    {candidate.nakshatra || candidate.starNakshatra} • {candidate.rasi || candidate.rasiMoonSign}
                  </span>
                </div>
              </div>

              {compatibilityResult && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{tr('Vedic Score', 'பொருத்த மதிப்பு')}</span>
                  <span className="text-sm font-black text-rose-700">
                    {compatibilityResult.ashtakoota?.totalScore || 28} / 36
                  </span>
                </div>
              )}
            </div>

            {/* Select Astrologer */}
            <div className="space-y-1.5">
              <label className="text-slate-800 font-bold block">
                {tr('Select Certified Vedic Astrologer *', 'சான்றளிக்கப்பட்ட வேத ஜோதிடரைத் தேர்ந்தெடுக்கவும் *')}
              </label>
              <div className="space-y-2">
                {astrologers.map((a) => (
                  <label
                    key={a.id}
                    onClick={() => setSelectedAstrologer(a.id)}
                    className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedAstrologer === a.id
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="astrologer"
                            checked={selectedAstrologer === a.id}
                            onChange={() => setSelectedAstrologer(a.id)}
                            className="text-indigo-600"
                          />
                          <strong className="text-slate-900">{a.name}</strong>
                        </div>
                        <p className="text-[11px] text-indigo-900 font-medium ml-5">{a.title}</p>
                        <p className="text-[10px] text-slate-500 ml-5">{a.experience} • {a.rating}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {a.fee}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Query & Quick Chips */}
            <div className="space-y-1.5">
              <label className="text-slate-800 font-bold block">
                {tr('Specific Questions for the Astrologer *', 'ஜோதிடரிடம் கேட்க விரும்பும் குறிப்பிட்ட கேள்விகள் *')}
              </label>
              <textarea
                rows={3}
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              />

              {/* Quick Chip Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickQuestions.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuery(chip)}
                    className="text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 px-2 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer text-left"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors cursor-pointer text-xs"
              >
                {tr('Cancel', 'ரத்து')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {submitting ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{submitting ? tr('Submitting...', 'அனுப்பப்படுகிறது...') : tr('Submit Consultation Request', 'ஆய்வுக் கோரிக்கை சமர்ப்பி')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
