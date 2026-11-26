import React, { useState, useEffect } from 'react';
import { FileText, Check, RotateCcw, X, Eye, Building2, Phone, MapPin, Sparkles, Image, Upload, Trash2 } from 'lucide-react';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';

export const DEFAULT_LETTERHEAD_TA = {
  line1: 'ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்',
  line2: 'SAI BALAJI ASTROLOGICAL RESEARCH CENTRE',
  address1: 'Salem, தமிழ்நாடு - 636001',
  address2: 'சென்னை & பெங்களூரு கிளைகள்',
  phoneEmail: 'தொலைபேசி: +91 98765 43210 | மின்னஞ்சல்: astro@astrojit.com',
  invocation: '|| ஓம் ஸ்ரீ கணேசாய நமஹ ||',
  astrologerLogo: ''
};

export const DEFAULT_LETTERHEAD_EN = {
  line1: 'ASTROJIT VEDIC ASTROLOGY & SPIRITUAL RESEARCH CENTRE',
  line2: 'Authentic Vedic Natal Horoscope Dossier',
  address1: 'Salem, Tamil Nadu - 636001',
  address2: 'Chennai & Bengaluru Branches',
  phoneEmail: 'Phone: +91 98765 43210 | Email: astro@astrojit.com',
  invocation: '|| Om Sri Ganeshayah Namaha ||',
  astrologerLogo: ''
};

export function getInitialLetterhead(user, isTa) {
  try {
    const saved = localStorage.getItem('astrojit_letterhead');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && (parsed.line1 || parsed.line2)) {
        if (parsed.line2) {
          parsed.line2 = parsed.line2
            .replace(/Thirukanitha\s+Parashara\s+/gi, '')
            .replace(/திருக்கணித\s+பராசர\s+முறைப்படி\s+அமைக்கப்பட்ட\s+/gi, '');
        }
        return parsed;
      }
    }
  } catch (e) {}

  if (user?.pagerHeader && (user.pagerHeader.line1 || user.pagerHeader.line2)) {
    return {
      line1: user.pagerHeader.line1 || '',
      line2: user.pagerHeader.line2 || '',
      address1: user.pagerHeader.address1 || '',
      address2: user.pagerHeader.address2 || '',
      phoneEmail: user.pagerHeader.phoneEmail || '',
      invocation: user.pagerHeader.invocation || (isTa ? '|| ஓம் ஸ்ரீ கணேசாய நமஹ ||' : '|| Om Sri Ganeshayah Namaha ||'),
      astrologerLogo: user.pagerHeader.astrologerLogo || user.logo || ''
    };
  }

  return isTa ? { ...DEFAULT_LETTERHEAD_TA } : { ...DEFAULT_LETTERHEAD_EN };
}

export default function LetterheadBrandingModal({
  isOpen,
  onClose,
  letterhead,
  onSave,
  isTa
}) {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(() => letterhead || (isTa ? DEFAULT_LETTERHEAD_TA : DEFAULT_LETTERHEAD_EN));
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (letterhead) {
      setForm(letterhead);
    }
  }, [letterhead]);

  if (!isOpen) return null;

  const handleReset = () => {
    const def = isTa ? { ...DEFAULT_LETTERHEAD_TA } : { ...DEFAULT_LETTERHEAD_EN };
    setForm(def);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      // 1. Save to localStorage for instant universal persistence
      localStorage.setItem('astrojit_letterhead', JSON.stringify(form));

      // 2. Call parent onSave for immediate live view update
      if (onSave) {
        onSave(form);
      }

      // 3. If authenticated user exists, sync with backend user profile
      if (user && API.updateUserProfile) {
        try {
          const res = await API.updateUserProfile({
            pagerHeader: form,
            brandLine1: form.line1,
            brandLine2: form.line2,
            address1: form.address1,
            address2: form.address2,
            phoneEmail: form.phoneEmail
          });
          if (res?.user && setUser) {
            setUser(res.user);
          }
        } catch (apiErr) {
          console.warn('Backend sync skipped or failed:', apiErr.message);
        }
      }

      setSuccessMsg(
        isTa
          ? 'லெட்டர்ஹெட் விவரங்கள் அச்சிடலுக்கு வெற்றிகரமாக செயல்படுத்தப்பட்டது!'
          : 'Letterhead branding details successfully applied to print layout!'
      );

      setTimeout(() => {
        setSuccessMsg('');
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      alert((isTa ? 'பிழை ஏற்பட்டது: ' : 'Error saving letterhead: ') + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-print">
      <div className="bg-white dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Card Header matching user uploaded image */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-stone-800 bg-amber-50/40 dark:bg-stone-800/40 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-300 dark:border-amber-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-stone-100">
                  {isTa ? '1-பேஜர் லெட்டர்ஹெட் அமைப்புகள் (தலைப்பு விவரங்கள்)' : '1-Pager Letterhead Branding Details'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {isTa ? 'அச்சுடன் இணைக்கப்பட்டது' : '1-Pager Synced'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
                {isTa
                  ? 'A4 தாளில் அச்சிடப்படும் மேல் பகுதி கட்டத்தின் தலைப்பு, முகவரி மற்றும் தொடர்பு விவரங்கள்'
                  : 'Header details printed on the top box of 1-page A4 sheets and booklet front page'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Invocation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTa ? 'தெய்வீக மந்திரம் / சுலோகம் (Invocation)' : 'Auspicious Invocation Line'}</span>
            </label>
            <input
              type="text"
              value={form.invocation || ''}
              onChange={(e) => setForm(prev => ({ ...prev, invocation: e.target.value }))}
              placeholder="|| Om Sri Ganeshayah Namaha ||"
              className="w-full bg-slate-50 dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs font-medium text-slate-900 dark:text-stone-100 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Line 1: Organization / Center Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTa ? 'ஜோதிட நிலையம் / நிறுவனம் (Line 1 Large)' : 'Organization / Center Name (Line 1 Large)'}</span>
            </label>
            <input
              type="text"
              value={form.line1 || ''}
              onChange={(e) => setForm(prev => ({ ...prev, line1: e.target.value }))}
              placeholder="ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்"
              className="w-full bg-slate-50 dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-stone-100 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Line 2: Astrologer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1">
              {isTa ? 'ஜோதிடர் பெயர்' : 'Astrologer Name'}
            </label>
            <input
              type="text"
              value={form.line2 || ''}
              onChange={(e) => setForm(prev => ({ ...prev, line2: e.target.value }))}
              placeholder="SAI BALAJI ASTROLOGICAL RESEARCH CENTRE"
              className="w-full bg-slate-50 dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs font-semibold text-slate-800 dark:text-stone-200 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Grid: Address 1 & Address 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>{isTa ? 'முதன்மை முகவரி (Address Line 1)' : 'Primary Address & City (Address Line 1)'}</span>
              </label>
              <input
                type="text"
                value={form.address1 || ''}
                onChange={(e) => setForm(prev => ({ ...prev, address1: e.target.value }))}
                placeholder="Salem, தமிழ்நாடு - 636001"
                className="w-full bg-slate-50 dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-stone-200 focus:bg-white focus:border-amber-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>{isTa ? 'கிளைகள் / முகவரி 2 (Address Line 2)' : 'Branches / Secondary Address (Address Line 2)'}</span>
              </label>
              <input
                type="text"
                value={form.address2 || ''}
                onChange={(e) => setForm(prev => ({ ...prev, address2: e.target.value }))}
                placeholder="சென்னை & பெங்களூரு கிளைகள்"
                className="w-full bg-slate-50 dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-stone-200 focus:bg-white focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          {/* Contact Details (Phone & Email) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTa ? 'தொடர்பு விவரங்கள் (Phone & Email Line)' : 'Contact Details (Phone & Email Line)'}</span>
            </label>
            <input
              type="text"
              value={form.phoneEmail || ''}
              onChange={(e) => setForm(prev => ({ ...prev, phoneEmail: e.target.value }))}
              placeholder="தொலைபேசி: +91 98765 43210 | மின்னஞ்சல்: astro@astrojit.com"
              className="w-full bg-slate-50 dark:bg-stone-800 border border-slate-300 dark:border-stone-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-stone-200 focus:bg-white focus:border-amber-600 transition-colors"
            />
          </div>

          {/* Astrologer Custom Logo Upload */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-900/15 dark:border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-stone-200 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{isTa ? 'ஜோதிடர் சொந்த லோகோ (வலது புறம் அச்சிடப்படும்)' : 'Astrologer Custom Logo (Printed on Right Side)'}</span>
              </label>
              {form.astrologerLogo && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, astrologerLogo: '' }))}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isTa ? 'லோகோவை நீக்கு' : 'Remove Logo'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {form.astrologerLogo ? (
                <div className="w-14 h-14 rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src={form.astrologerLogo}
                    alt="Astrologer Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-white/70 dark:bg-stone-900/50 flex flex-col items-center justify-center text-stone-400 text-[10px] shrink-0 font-bold">
                  <Upload className="w-4 h-4 mb-0.5" />
                  <span>Logo</span>
                </div>
              )}

              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setForm(prev => ({ ...prev, astrologerLogo: ev.target?.result || '' }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-stone-600 dark:text-stone-300 file:mr-2.5 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#7A1A22] file:text-amber-100 hover:file:bg-[#5C1017] cursor-pointer"
                />
                <p className="text-[10px] text-stone-500">
                  {isTa
                    ? 'PNG, JPG அல்லது SVG படம் (பரிந்துரை: சதுர வடிவம், தெளிவான லோகோ)'
                    : 'PNG, JPG, or SVG image (Recommended: square format with transparent or white background)'}
                </p>
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW BOX - Dual Logos (Astrojit on Left, Astrologer on Right) */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-stone-400 uppercase tracking-wider mb-2">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isTa ? 'நேரடி அச்சு மாதிரி (Live Preview on 1-Pager Header):' : 'LIVE PREVIEW AS PRINTED ON 1-PAGER HEADER:'}</span>
            </div>

            <div className="p-3 bg-[#FAF6EE] border-[1.5px] border-black rounded-none shadow-2xs space-y-1">
              <div className="text-[10px] font-black text-[#7A1A22] text-center tracking-widest">
                {form.invocation || '|| ஓம் ஸ்ரீ கணேசாய நமஹ ||'}
              </div>

              <div className="flex items-center justify-between gap-2 px-1">
                {/* Left: Astrojit Logo */}
                <div className="w-24 shrink-0 flex items-center gap-1.5 text-left">
                  <img
                    src="/astrojit-logo.webp"
                    alt="Astrojit"
                    className="w-7 h-7 object-contain shrink-0"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-[12px] font-black tracking-tight text-[#7A1A22] leading-none">ASTROJIT</div>
                    <div className="text-[8px] font-bold text-stone-600 uppercase">
                      {isTa ? 'வேத ஜோதிடம்' : 'Vedic Astrology'}
                    </div>
                  </div>
                </div>

                {/* Center: Details */}
                <div className="text-center flex-1 px-1">
                  <div className="text-xs sm:text-sm font-black tracking-tight text-black leading-tight">
                    {form.line1 || (isTa ? 'ஸ்ரீ பாலாஜி ஜோதிட நிலையம் • திருக்கணித பஞ்சாங்கம்' : 'ASTROJIT VEDIC ASTROLOGY')}
                  </div>
                  {form.line2 && (
                    <div className="text-[9.5px] font-bold text-stone-800 leading-snug">
                      {form.line2}
                    </div>
                  )}
                  {(form.address1 || form.address2) && (
                    <div className="text-[8px] text-stone-700 leading-tight">
                      {[form.address1, form.address2].filter(Boolean).join(' • ')}
                    </div>
                  )}
                  {form.phoneEmail && (
                    <div className="text-[8px] font-mono text-stone-800 pt-0.5">
                      {form.phoneEmail}
                    </div>
                  )}
                </div>

                {/* Right: Astrologer Logo */}
                <div className="w-24 shrink-0 flex items-center justify-end gap-1.5 text-right">
                  {form.astrologerLogo ? (
                    <img
                      src={form.astrologerLogo}
                      alt="Astrologer Logo"
                      className="w-8 h-8 object-contain rounded border border-amber-900/30 bg-white p-0.5 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="text-right">
                      <span className="inline-block px-1.5 py-0.5 text-[8.5px] font-bold bg-amber-100 text-[#7A1A22] border border-black">
                        {isTa ? 'லஹரி' : 'Lahiri'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-stone-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTa ? 'இயல்புநிலைக்கு மீட்டமை' : 'Reset Defaults'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-700 dark:text-stone-300 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {isTa ? 'மூடுக' : 'Close'}
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-[#7A1A22] hover:bg-[#92202a] active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? (isTa ? 'சேமிக்கிறது...' : 'Saving...') : (isTa ? 'சேமித்து செயல்படுத்து' : 'Save & Apply to Printout')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
