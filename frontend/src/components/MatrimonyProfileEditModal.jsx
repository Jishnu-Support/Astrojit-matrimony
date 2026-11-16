import React, { useState } from 'react';
import {
  X, Check, Sparkles, User, Heart, Briefcase, GraduationCap,
  Users, MapPin, Phone, ShieldCheck, Camera, AlertCircle, Save
} from 'lucide-react';
import { useLang } from '../i18n';
import { API } from '../api';
import {
  NAKSHATRA_MAP,
  RASI_MAP,
  formatNakshatra,
  formatRasi,
  formatDosha,
  formatMaritalStatus
} from '../matrimonyLocalization';

const AVATAR_PRESETS = [
  { label: 'Groom 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', gender: 'Groom' },
  { label: 'Groom 2', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80', gender: 'Groom' },
  { label: 'Groom 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', gender: 'Groom' },
  { label: 'Bride 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', gender: 'Bride' },
  { label: 'Bride 2', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80', gender: 'Bride' },
  { label: 'Bride 3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80', gender: 'Bride' },
];

const HEIGHT_LIST = [
  "4'10\" (147 cm)", "4'11\" (150 cm)", "5'0\" (152 cm)", "5'1\" (155 cm)",
  "5'2\" (157 cm)", "5'3\" (160 cm)", "5'4\" (162 cm)", "5'5\" (165 cm)",
  "5'6\" (168 cm)", "5'7\" (170 cm)", "5'8\" (173 cm)", "5'9\" (175 cm)",
  "5'10\" (178 cm)", "5'11\" (180 cm)", "6'0\" (183 cm)", "6'1\" (185 cm)",
  "6'2\" (188 cm)", "6'3\" (190 cm)", "6'4\" (193 cm)"
];

export default function MatrimonyProfileEditModal({ profile, isOpen, onClose, onSaveSuccess }) {
  const { lang } = useLang();

  const tr = (en, ta, kn, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'horoscope', 'career', 'family', 'contact', 'partner'
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State initialized with profile data
  const [formData, setFormData] = useState(() => {
    const p = profile || {};
    return {
      name: p.name || '',
      profileType: p.profileType || (p.gender === 'female' ? 'Bride' : 'Groom'),
      gender: p.gender || (p.profileType === 'Bride' ? 'female' : 'male'),
      profileCreatedBy: p.profileCreatedBy || 'Self',
      dob: p.dob || '1996-08-15',
      height: p.height || "5'11\" (180 cm)",
      weight: p.weight || '76 kg',
      maritalStatus: p.maritalStatus || 'Never Married',
      motherTongue: p.motherTongue || 'Tamil',
      physicalStatus: p.physicalStatus || 'Normal',
      bloodGroup: p.bloodGroup || 'O+',
      aboutMe: p.aboutMe || '',
      photoUrl: p.photoUrl || p.primaryPhotoUrl || AVATAR_PRESETS[0].url,

      // Horoscope
      starNakshatra: p.nakshatra || p.starNakshatra || 'Magha',
      rasiMoonSign: p.rasi || p.rasiMoonSign || 'Simha (Leo)',
      lagnamAscendant: p.lagna || p.lagnamAscendant || 'Simha (Leo)',
      padam: p.pada || p.padam || 4,
      manglikDosha: p.manglikStatus || p.manglikDosha || 'Chevvai Dosha Cancelled',
      birthTime: p.dobTime || p.birthTime || '06:30',
      birthPlace: p.dobPlace || p.birthPlace || 'Chennai, India',
      gotra: p.gotra || 'Kashyapa',
      caste: p.caste || 'Brahmin',
      subCaste: p.subCaste || '',
      religion: p.religion || 'Hindu',

      // Education & Career
      highestEducation: p.highestEducation || '',
      degree: p.degree || '',
      college: p.college || '',
      occupation: p.occupation || '',
      company: p.company || p.companyName || '',
      annualIncome: p.annualIncome || '',
      workLocation: p.workLocation || p.city || 'Bengaluru',

      // Family
      fatherName: p.fatherName || '',
      fatherOccupation: p.fatherOccupation || '',
      motherName: p.motherName || '',
      motherOccupation: p.motherOccupation || '',
      brothersCount: p.brothersCount !== undefined ? p.brothersCount : 1,
      sistersCount: p.sistersCount !== undefined ? p.sistersCount : 1,
      familyType: p.familyType || 'Nuclear',
      familyStatus: p.familyStatus || 'Upper Middle Class',
      familyValues: p.familyValues || 'Moderate Traditional',
      nativePlace: p.nativePlace || '',
      familyDescription: p.familyDescription || '',

      // Location & Contact
      city: p.city || 'Bengaluru',
      state: p.state || 'Karnataka',
      currentResidence: p.currentResidence || '',
      mobile: p.contact?.mobile || p.mobile || '9123456789',
      whatsapp: p.contact?.whatsapp || p.whatsappNumber || p.mobile || '9123456789',
      email: p.contact?.email || p.email || '',
      visibility: p.account?.profileVisibility || p.contact?.visibility || 'Members Only',

      // Partner Expectations
      partnerAgeMin: p.partnerPreferences?.minAge || p.partnerAgeMin || 24,
      partnerAgeMax: p.partnerPreferences?.maxAge || p.partnerAgeMax || 29,
      partnerHeightMin: p.partnerPreferences?.minHeight || p.partnerHeightMin || "5'2\"",
      partnerHeightMax: p.partnerPreferences?.maxHeight || p.partnerHeightMax || "5'8\"",
      partnerDiet: p.partnerPreferences?.diet || p.partnerDiet || 'Vegetarian',
      specialExpectations: p.partnerPreferences?.specialExpectations || p.partnerExpectations || '',
    };
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg(tr('Please enter full name', 'முழுப் பெயரை உள்ளிடவும்', 'ಹೆಸರನ್ನು ನಮೂದಿಸಿ', 'कृपया नाम दर्ज करें'));
      return;
    }

    try {
      setSaving(true);
      const targetId = profile.id || profile.matrimonyId || 'AJ-MAT-2026-1001';

      // Prepare payload maintaining consistency
      const payload = {
        ...formData,
        nakshatra: formData.starNakshatra,
        rasi: formData.rasiMoonSign,
        lagna: formData.lagnamAscendant,
        pada: formData.padam,
        manglikStatus: formData.manglikDosha,
        companyName: formData.company,
        contact: {
          mobile: formData.mobile,
          whatsapp: formData.whatsapp,
          email: formData.email,
          visibility: formData.visibility,
        },
        partnerPreferences: {
          ...(profile.partnerPreferences || {}),
          minAge: Number(formData.partnerAgeMin),
          maxAge: Number(formData.partnerAgeMax),
          minHeight: formData.partnerHeightMin,
          maxHeight: formData.partnerHeightMax,
          diet: formData.partnerDiet,
          specialExpectations: formData.specialExpectations,
        },
        account: {
          ...(profile.account || {}),
          profileVisibility: formData.visibility,
        }
      };

      const res = await API.updateMatrimonyProfile(targetId, payload);
      if (res && res.profile) {
        onSaveSuccess(res.profile);
      } else {
        onSaveSuccess({ ...profile, ...payload });
      }
      onClose();
    } catch (err) {
      console.error('Failed to update matrimony profile:', err);
      setErrorMsg(err.message || tr('Failed to save changes. Please try again.', 'சேமிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.', 'ದೋಷ ಸಂಭವಿಸಿದೆ.', 'त्रुटि हुई।'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-rose-200 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {tr('Edit Matrimony Profile', 'சுயவிவரத்தைத் திருத்து', 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ', 'प्रोफाइल संपादित करें')}
                </h3>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-mono">
                  {profile?.id || profile?.matrimonyId || 'AJ-MAT-2026-1001'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {tr('Update personal, horoscope, family, and partner preference details', 'தனிப்பட்ட, ஜாதக, குடும்ப மற்றும் எதிர்பார்ப்பு விவரங்களை மாற்றவும்', 'ವೈಯಕ್ತಿಕ ಹಾಗೂ ಜಾತಕ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ', 'व्यक्तिगत एवं कुंडली विवरण अद्यतन करें')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-bold scrollbar-none">
          {[
            { id: 'basic', label: tr('Basic & Photo', 'அடிப்படை & படம்', 'ಮೂಲ & ಫೋಟೋ', 'मूल एवं फोटो'), icon: User },
            { id: 'horoscope', label: tr('Horoscope & Vedic', 'ஜாதக விவரம்', 'ಜಾತಕ ವಿವರ', 'कुंडली विवरण'), icon: Sparkles },
            { id: 'career', label: tr('Education & Career', 'கல்வி & தொழில்', 'ಶಿಕ್ಷಣ & ವೃತ್ತಿ', 'शिक्षा एवं व्यवसाय'), icon: GraduationCap },
            { id: 'family', label: tr('Family Background', 'குடும்ப விவரம்', 'ಕುಟುಂಬ ವಿವರ', 'परिवार विवरण'), icon: Users },
            { id: 'contact', label: tr('Location & Contact', 'இருப்பிடம் & தொடர்பு', 'ಸ್ಥಳ & ಸಂಪರ್ಕ', 'स्थान एवं संपर्क'), icon: MapPin },
            { id: 'partner', label: tr('Partner Expectations', 'எதிர்பார்ப்புகள்', 'ನಿರೀಕ್ಷೆಗಳು', 'जीवनसाथी अपेक्षाएं'), icon: Heart },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-white text-rose-700 border-t-2 border-rose-600 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: BASIC & PHOTO */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              {/* Profile Photo & Quick Presets */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  {tr('Profile Photograph', 'சுயவிவரப் புகைப்படம்', 'ಪ್ರೊಫೈಲ್ ಭಾವಚಿತ್ರ', 'प्रोफाइल फोटो')}
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-rose-400 shadow-md">
                    <img
                      src={formData.photoUrl}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={(e) => handleChange('photoUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {tr('Quick Avatars:', 'மாதிரி படங்கள்:', 'ಮಾದರಿ ಚಿತ್ರಗಳು:', 'नमूना फोटो:')}
                      </span>
                      {AVATAR_PRESETS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleChange('photoUrl', av.url)}
                          className="w-7 h-7 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Full Name*', 'முழுப் பெயர்*', 'ಪೂರ್ಣ ಹೆಸರು*', 'पूरा नाम*')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Profile Type*', 'வரன் வகை*', 'ವರನ್ ವಿಧ*', 'वर-वधू प्रकार*')}
                  </label>
                  <select
                    value={formData.profileType}
                    onChange={(e) => handleChange('profileType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Groom">{tr('Groom', 'மணமகன்', 'ವರ', 'वर')}</option>
                    <option value="Bride">{tr('Bride', 'மணமகள்', 'ವಧು', 'वधू')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Date of Birth*', 'பிறந்த தேதி*', 'ಹುಟ್ಟಿದ ದಿನಾಂಕ*', 'जन्म तिथि*')}
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Height*', 'உயரம்*', 'ಎತ್ತರ*', 'ऊंचाई*')}
                  </label>
                  <select
                    value={formData.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    {HEIGHT_LIST.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Weight', 'எடை', 'ತೂಕ', 'वजन')}
                  </label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="e.g. 76 kg"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Marital Status*', 'திருமண நிலை*', 'ವೈವಾಹಿಕ ಸ್ಥಿತಿ*', 'वैवाहिक स्थिति*')}
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Never Married">{formatMaritalStatus('Never Married', lang)}</option>
                    <option value="Divorced">{formatMaritalStatus('Divorced', lang)}</option>
                    <option value="Widowed">{formatMaritalStatus('Widowed', lang)}</option>
                    <option value="Awaiting Divorce">{formatMaritalStatus('Awaiting Divorce', lang)}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Mother Tongue', 'தாய்மொழி', 'ತಾಯ್ನುಡಿ', 'मातृभाषा')}
                  </label>
                  <input
                    type="text"
                    value={formData.motherTongue}
                    onChange={(e) => handleChange('motherTongue', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Physical Status', 'உடல் நிலை', 'ದೈಹಿಕ ಸ್ಥಿತಿ', 'शारीरिक स्थिति')}
                  </label>
                  <select
                    value={formData.physicalStatus}
                    onChange={(e) => handleChange('physicalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Normal">{tr('Normal', 'இயல்பானது', 'ಸಾಮಾನ್ಯ', 'सामान्य')}</option>
                    <option value="Differently Abled">{tr('Differently Abled', 'மாற்றுத்திறனாளி', 'ವಿಶೇಷ ಚೇತನ', 'दिव्यांग')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Blood Group', 'இரத்த வகை', 'ರಕ್ತದ ಗುಂಪು', 'रक्त समूह')}
                  </label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    placeholder="e.g. O+, A+, B+"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* About Me */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tr('Profile Description / About Me', 'சுயவிவர விளக்கம் / என்னைப் பற்றி', 'ನನ್ನ ಬಗ್ಗೆ ವಿವರಣೆ', 'प्रोफाइल विवरण')}
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutMe}
                  onChange={(e) => handleChange('aboutMe', e.target.value)}
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  placeholder={tr('Write a brief description about your personality, lifestyle, values...', 'உங்கள் பண்புகள், வாழ்க்கை முறை, ஆன்மீக மதிப்பீடுகளைப் பற்றி குறிப்பிடவும்...', 'ವಿವರಣೆ ಬರೆಯಿರಿ...', 'संक्षिप्त विवरण लिखें...')}
                />
              </div>
            </div>
          )}

          {/* TAB 2: HOROSCOPE & VEDIC */}
          {activeTab === 'horoscope' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs text-amber-900 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{tr('Thirukanitha Vedic Panchangam Alignment - Essential for 10 Poruthams Matching', 'திருக்கணிதப் பஞ்சாங்க ஆய்வு - 10 திருமணப் பொருத்தங்களுக்கு இன்றியமையாதது', 'ತಿರುಕಣಿತ ವೈದಿಕ ಹೊಂದಾಣಿಕೆ ವಿವರ', 'थिरुकणिता वैदिक पंचांग विवरण')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Star / Nakshatra*', 'நட்சத்திரம்*', 'ನಕ್ಷತ್ರ*', 'नक्षत्र*')}
                  </label>
                  <select
                    value={formData.starNakshatra}
                    onChange={(e) => handleChange('starNakshatra', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-rose-700 focus:ring-2 focus:ring-rose-400"
                  >
                    {Object.keys(NAKSHATRA_MAP).map(k => (
                      <option key={k} value={k}>{formatNakshatra(k, lang)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Rasi / Moon Sign*', 'ராசி*', 'ರಾಶಿ*', 'राशि*')}
                  </label>
                  <select
                    value={formData.rasiMoonSign}
                    onChange={(e) => handleChange('rasiMoonSign', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-rose-700 focus:ring-2 focus:ring-rose-400"
                  >
                    {Object.keys(RASI_MAP).map(k => (
                      <option key={k} value={k}>{formatRasi(k, lang)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Lagnam / Ascendant', 'லக்னம்', 'ಲಗ್ನ', 'लग्न')}
                  </label>
                  <select
                    value={formData.lagnamAscendant}
                    onChange={(e) => handleChange('lagnamAscendant', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    {Object.keys(RASI_MAP).map(k => (
                      <option key={k} value={k}>{formatRasi(k, lang)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Padam*', 'பாதம்*', 'ಪಾದ*', 'चरण*')}
                  </label>
                  <select
                    value={formData.padam}
                    onChange={(e) => handleChange('padam', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    {[1, 2, 3, 4].map(p => (
                      <option key={p} value={p}>{p} {tr('Padam', 'பாதம்', 'ಪಾದ', 'चरण')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Chevvai / Manglik Dosha*', 'செவ்வாய் தோஷம்*', 'ಕುಜ ದೋಷ*', 'मंगल दोष*')}
                  </label>
                  <select
                    value={formData.manglikDosha}
                    onChange={(e) => handleChange('manglikDosha', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="No Chevvai Dosha">{formatDosha('No Chevvai Dosha', lang)}</option>
                    <option value="Chevvai Dosha Cancelled">{formatDosha('Chevvai Dosha Cancelled', lang)}</option>
                    <option value="Chevvai Dosham Present">{formatDosha('Chevvai Dosham Present', lang)}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Birth Time', 'பிறந்த நேரம்', 'ಹುಟ್ಟಿದ ಸಮಯ', 'जन्म समय')}
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => handleChange('birthTime', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Birth Place', 'பிறந்த இடம்', 'ಹುಟ್ಟಿದ ಸ್ಥಳ', 'जन्म स्थान')}
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Caste & Sub-caste', 'சாதி & உட்பிரிவு', 'ಜಾತಿ & ಉಪಜಾತಿ', 'जाति एवं उपजाति')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.caste}
                      onChange={(e) => handleChange('caste', e.target.value)}
                      placeholder={tr('Caste', 'சாதி', 'ಜಾತಿ', 'जाति')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                    />
                    <input
                      type="text"
                      value={formData.subCaste}
                      onChange={(e) => handleChange('subCaste', e.target.value)}
                      placeholder={tr('Sub-caste', 'உட்பிரிவு', 'ಉಪಜಾತಿ', 'उपजाति')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Gotra', 'கோத்திரம்', 'ಗೋತ್ರ', 'गोत्र')}
                  </label>
                  <input
                    type="text"
                    value={formData.gotra}
                    onChange={(e) => handleChange('gotra', e.target.value)}
                    placeholder="e.g. Kashyapa, Bharadwaja"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION & CAREER */}
          {activeTab === 'career' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Highest Education Qualification*', 'உயர்கல்வித் தகுதி*', 'ಉನ್ನತ ಶಿಕ್ಷಣ*', 'उच्चतम शिक्षा*')}
                </label>
                <input
                  type="text"
                  value={formData.highestEducation}
                  onChange={(e) => handleChange('highestEducation', e.target.value)}
                  placeholder="e.g. B.Tech & M.S. in Computer Science"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Degree / Field of Study', 'பட்டம் / துறை', 'ಪದವಿ', 'डिग्री')}
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  placeholder="e.g. M.S. in Computer Science"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('College / University Name', 'கல்லூரி / பல்கலைக்கழகம்', 'ಕಾಲೇಜು / ವಿವಿ', 'कॉलेज / विश्वविद्यालय')}
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  placeholder="e.g. IIT Delhi / CMU"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Occupation / Designation*', 'பணி / பதவி*', 'ಹುದ್ದೆ*', 'व्यवसाय / पद*')}
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder="e.g. Software Engineering Lead"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Company / Organization', 'நிறுவனத்தின் பெயர்', 'ಸಂಸ್ಥೆ', 'कंपनी')}
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="e.g. Top Tier Tech Firm"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Annual Income*', 'ஆண்டு வருமானம்*', 'ವಾರ್ಷಿಕ ಆದಾಯ*', 'वार्षिक आय*')}
                </label>
                <input
                  type="text"
                  value={formData.annualIncome}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  placeholder="e.g. ₹38,00,000 - ₹45,00,000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-emerald-700 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Work Location City & State', 'பணிபுரியும் நகரம் & மாநிலம்', 'ಕೆಲಸದ ಸ್ಥಳ', 'कार्य स्थल')}
                </label>
                <input
                  type="text"
                  value={formData.workLocation}
                  onChange={(e) => handleChange('workLocation', e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          )}

          {/* TAB 4: FAMILY BACKGROUND */}
          {activeTab === 'family' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr("Father's Name*", 'தந்தையின் பெயர்*', 'ತಂದೆಯ ಹೆಸರು*', 'पिता का नाम*')}
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr("Father's Occupation", 'தந்தையின் தொழில்', 'ತಂದೆಯ ಉದ್ಯೋಗ', 'पिता का व्यवसाय')}
                </label>
                <input
                  type="text"
                  value={formData.fatherOccupation}
                  onChange={(e) => handleChange('fatherOccupation', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr("Mother's Name*", 'தாயின் பெயர்*', 'ತಾಯಿಯ ಹೆಸರು*', 'माता का नाम*')}
                </label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => handleChange('motherName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr("Mother's Occupation", 'தாயின் தொழில்', 'ತಾಯಿಯ ಉದ್ಯೋಗ', 'माता का व्यवसाय')}
                </label>
                <input
                  type="text"
                  value={formData.motherOccupation}
                  onChange={(e) => handleChange('motherOccupation', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Brothers Count', 'சகோதரர்கள் எண்ணிக்கை', 'ಸಹೋದರರ ಸಂಖ್ಯೆ', 'भाई')}
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.brothersCount}
                  onChange={(e) => handleChange('brothersCount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Sisters Count', 'சகோதரிகள் எண்ணிக்கை', 'ಸಹೋದರಿಯರ ಸಂಖ್ಯೆ', 'बहन')}
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.sistersCount}
                  onChange={(e) => handleChange('sistersCount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Family Type', 'குடும்ப வகை', 'ಕುಟುಂಬ ಪ್ರಕಾರ', 'परिवार का प्रकार')}
                </label>
                <select
                  value={formData.familyType}
                  onChange={(e) => handleChange('familyType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                >
                  <option value="Nuclear">{tr('Nuclear Family', 'தனிக்குடும்பம்', 'ಚಿಕ್ಕ ಕುಟುಂಬ', 'एकल परिवार')}</option>
                  <option value="Joint">{tr('Joint Family', 'கூட்டுக்குடும்பம்', 'ಅವಿಭಕ್ತ ಕುಟುಂಬ', 'संयुक्त परिवार')}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Native Place', 'சொந்த ஊர்', 'ಮೂಲ ಊರು', 'मूल निवास')}
                </label>
                <input
                  type="text"
                  value={formData.nativePlace}
                  onChange={(e) => handleChange('nativePlace', e.target.value)}
                  placeholder="e.g. Chennai / Varanasi"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          )}

          {/* TAB 5: LOCATION & CONTACT */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('City / Town*', 'வசிக்கும் நகரம்*', 'ನಗರ*', 'शहर*')}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('State*', 'மாநிலம்*', 'ರಾಜ್ಯ*', 'राज्य*')}
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Mobile Number*', 'அலைபேசி எண்*', 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ*', 'मोबाइल नंबर*')}
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('WhatsApp Number', 'வாட்ஸ்அப் எண்', 'ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ', 'व्हाट्सएप')}
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Email Address', 'மின்னஞ்சல் முகவரி', 'ಇಮೇಲ್', 'ईमेल')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Profile Visibility Setting', 'சுயவிவரப் பார்வை நிலை', 'ಗೋಚರತೆ', 'दृश्यता')}
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleChange('visibility', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                >
                  <option value="Members Only">{tr('Members Only (Recommended)', 'உறுப்பினர்கள் மட்டும்', 'ಸದಸ್ಯರಿಗೆ ಮಾತ್ರ', 'केवल सदस्यों के लिए')}</option>
                  <option value="Public">{tr('Public', 'பொதுவானது', 'ಸಾರ್ವಜನಿಕ', 'सार्वजनिक')}</option>
                  <option value="Request Only">{tr('Protected / Request Only', 'அனுமதி பெற்று மட்டும்', 'ವಿನಂತಿಯ ಮೇರೆಗೆ', 'केवल अनुरोध पर')}</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 6: PARTNER EXPECTATIONS */}
          {activeTab === 'partner' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Preferred Age Range (Min - Max)', 'விருப்பமான வயது வரம்பு', 'ವಯಸ್ಸಿನ ಶ್ರೇಣಿ', 'आयु सीमा')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={18}
                      max={70}
                      value={formData.partnerAgeMin}
                      onChange={(e) => handleChange('partnerAgeMin', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min={18}
                      max={70}
                      value={formData.partnerAgeMax}
                      onChange={(e) => handleChange('partnerAgeMax', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tr('Diet Preference', 'உணவு விருப்பம்', 'ಆಹಾರ ಆದ್ಯತೆ', 'खान-पान')}
                  </label>
                  <select
                    value={formData.partnerDiet}
                    onChange={(e) => handleChange('partnerDiet', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Vegetarian">{tr('Vegetarian', 'சைவம்', 'ಸಸ್ಯಾಹಾರಿ', 'शाकाहारी')}</option>
                    <option value="Non-Vegetarian">{tr('Non-Vegetarian', 'அசைவம்', 'ಮಾಂಸಾಹಾರಿ', 'मांसाहारी')}</option>
                    <option value="Any">{tr('Open / Any', 'எதுவும்', 'ಯಾವುದಾದರೂ', 'कोई भी')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tr('Partner Expectations & Notes', 'வாழ்க்கைத் துணை பற்றிய எதிர்பார்ப்புகள்', 'ನಿರೀಕ್ಷೆಗಳ ವಿವರ', 'जीवनसाथी से अपेक्षाएं')}
                </label>
                <textarea
                  rows={4}
                  value={formData.specialExpectations}
                  onChange={(e) => handleChange('specialExpectations', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-400"
                  placeholder={tr('Specify career expectations, family values, location preferences...', 'பணி, குடும்ப மதிப்புகள் மற்றும் குணங்கள் குறித்த எதிர்பார்ப்புகளைக் குறிப்பிடவும்...', 'ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ...', 'अपेक्षाएं दर्ज करें...')}
                />
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              {tr('Cancel', 'ரத்து செய்', 'ರದ್ದುಮಾಡಿ', 'रद्द करें')}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{tr('Saving...', 'சேமிக்கப்படுகிறது...', 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...', 'सहेज रहे हैं...')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{tr('Save Changes', 'மாற்றங்களைச் சேமிக்க', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ', 'परिवर्तन सहेजें')}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
