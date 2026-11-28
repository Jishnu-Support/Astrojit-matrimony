import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, MapPin, Mail, Phone, ShieldCheck, Heart, Sparkles, Check, X, AlertCircle, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, login } = useAuth();
  const { lang, t } = useLang();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    fatherName: user?.fatherName || '',
    motherName: user?.motherName || '',
    dob: user?.dob || '',
    dobTime: user?.dobTime || '',
    dobPlace: user?.dobPlace || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.shopName || '',
        fatherName: user.fatherName || '',
        motherName: user.motherName || '',
        dob: user.dob || '',
        dobTime: user.dobTime || '',
        dobPlace: user.dobPlace || '',
        email: user.email || '',
        mobile: user.mobile || '',
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const tr = (en, ta, kn, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.updateUserProfile(formData);
      setSuccessMsg(tr('Profile updated successfully!', 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!'));
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
      // Refresh local session if needed
      window.location.reload();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1815] rounded-3xl max-w-2xl w-full border border-amber-300 dark:border-amber-700/60 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white p-4 sm:p-5 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-xl shadow-md">
              {(formData.name || user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {formData.name || user.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#1E1815] text-rose-800 dark:text-rose-300 uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                📞 {user.mobile} • {tr('AstroJit Verified Account', 'அஸ்ட்ரோஜித் சான்றளிக்கப்பட்ட கணக்கு')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{tr('Edit Profile', 'திருத்து')}</span>
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Section 1: Personal Coordinates */}
            <div className="bg-slate-50 dark:bg-stone-900/70 border border-slate-200 dark:border-stone-700 p-4 rounded-2xl space-y-3">
              <h4 className="font-black text-slate-900 dark:text-stone-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 dark:border-stone-700 pb-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>{tr('Personal Coordinates', 'தனிப்பட்ட விவரங்கள்')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr('Full Name *', 'முழுப் பெயர் *')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                    />
                  ) : (
                    <strong className="text-slate-900 dark:text-stone-100 text-xs block py-1">{formData.name || '—'}</strong>
                  )}
                </div>

                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr('Registered Mobile *', 'அலைபேசி எண் *')}</label>
                  <span className="font-mono font-bold text-amber-900 dark:text-amber-300 text-xs block py-1">{user.mobile}</span>
                </div>

                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr('Email Address', 'மின்னஞ்சல் முகவரி')}</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                      placeholder="e.g. name@domain.com"
                    />
                  ) : (
                    <span className="text-slate-800 dark:text-stone-200 text-xs block py-1">{formData.email || 'Not specified'}</span>
                  )}
                </div>

                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr('Date of Birth (DOB)', 'பிறந்த தேதி')}</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                    />
                  ) : (
                    <strong className="text-slate-900 dark:text-stone-100 text-xs block py-1">{formData.dob || '—'}</strong>
                  )}
                </div>

                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr('Time of Birth', 'பிறந்த நேரம்')}</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={formData.dobTime}
                      onChange={(e) => setFormData({ ...formData, dobTime: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                    />
                  ) : (
                    <span className="text-slate-800 dark:text-stone-200 text-xs block py-1">{formData.dobTime || '—'}</span>
                  )}
                </div>

                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr('Place of Birth (City / Town)', 'பிறந்த ஊர்')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.dobPlace}
                      onChange={(e) => setFormData({ ...formData, dobPlace: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                      placeholder="e.g. Chennai, Tamil Nadu"
                    />
                  ) : (
                    <span className="text-slate-800 dark:text-stone-200 text-xs block py-1">{formData.dobPlace || '—'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Family Background */}
            <div className="bg-slate-50 dark:bg-stone-900/70 border border-slate-200 dark:border-stone-700 p-4 rounded-2xl space-y-3">
              <h4 className="font-black text-slate-900 dark:text-stone-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 dark:border-stone-700 pb-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>{tr("Parents' Names & Family Lineage", 'பெற்றோர் பெயர் & குடும்ப விவரம்')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr("Father's Name", 'தந்தை பெயர்')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                    />
                  ) : (
                    <strong className="text-slate-900 dark:text-stone-100 text-xs block py-1">{formData.fatherName || '—'}</strong>
                  )}
                </div>

                <div>
                  <label className="text-slate-600 dark:text-stone-400 font-bold block mb-1">{tr("Mother's Name", 'தாய் பெயர்')}</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.motherName}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full bg-white dark:bg-[#1E1815] border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-amber-500 font-medium"
                    />
                  ) : (
                    <strong className="text-slate-900 dark:text-stone-100 text-xs block py-1">{formData.motherName || '—'}</strong>
                  )}
                </div>
              </div>
            </div>

            {/* Save Buttons if editing */}
            {isEditing && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-stone-600 rounded-xl font-bold text-slate-600 dark:text-stone-400 hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {tr('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? tr('Saving...', 'சேமிக்கப்படுகிறது...') : tr('Save Profile', 'சேமிக்கவும்')}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
