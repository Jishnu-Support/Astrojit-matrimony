import React, { useState } from 'react';
import { Settings, Globe, Bell, Lock, Shield, Sparkles, Check, X, AlertCircle, KeyRound, Smartphone, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang, LANGUAGES } from '../i18n';
import { API } from '../api';

export default function SettingsModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { lang, setLanguage, t } = useLang();

  const [activeTab, setActiveTab] = useState('language'); // 'language', 'notifications', 'security', 'about'
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    whatsappDailyPanchangam: user?.settings?.whatsappDailyPanchangam ?? true,
    matrimonyMatchAlerts: user?.settings?.matrimonyMatchAlerts ?? true,
    astrologerAppointmentReminders: user?.settings?.astrologerAppointmentReminders ?? true,
    planetaryTransitAlerts: user?.settings?.planetaryTransitAlerts ?? false,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  if (!isOpen) return null;

  const tr = (en, ta, kn, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg(tr('New passwords do not match!', 'புதிய கடவுச்சொற்கள் பொருந்தவில்லை!'));
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg(tr('Password must be at least 6 characters long.', 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்.'));
      return;
    }

    setChangingPass(true);
    try {
      await API.changePassword({ currentPassword, newPassword });
      setSuccessMsg(tr('Password changed successfully!', 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const handleToggleNotification = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setSavingSettings(true);
    try {
      await API.updateUserSettings(updated);
      setSuccessMsg(tr('Preferences updated!', 'அமைப்புகள் சேமிக்கப்பட்டன!'));
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setErrorMsg('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {tr('Preferences & Settings', 'விருப்பங்கள் & அமைப்புகள்')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {tr('Language, Alerts, Security & Account', 'மொழி, அறிவிப்புகள் மற்றும் பாதுகாப்பு')}
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

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'language', label: tr('Language', 'மொழி'), icon: Globe },
            { id: 'notifications', label: tr('Alerts & WhatsApp', 'அறிவிப்புகள்'), icon: Bell },
            { id: 'security', label: tr('Password & Security', 'பாதுகாப்பு'), icon: Lock },
            { id: 'about', label: tr('System Info', 'தகவல்'), icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-3">
              <p className="text-slate-500 font-medium text-[11px]">
                {tr(
                  'Select your preferred UI language. AstroJit provides 100% pure unilingual localization without English mixing.',
                  'தங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும். அஸ்ட்ரோஜித் தளம் முழுவதும் தூய தமிழில் இயங்கும்.'
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LANGUAGES.map((l) => {
                  const isSelected = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setSuccessMsg(`Language switched to ${l.native}`);
                        setTimeout(() => setSuccessMsg(''), 2000);
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <strong className="text-slate-900 text-xs block">{l.native}</strong>
                        <span className="text-[10px] text-slate-500">{l.name}</span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <p className="text-slate-500 font-medium text-[11px]">
                {tr(
                  'Manage automated alerts, WhatsApp panchangam deliveries, and Vivaha matchmaking notifications.',
                  'வாட்ஸ்அப் பஞ்சாங்கம் மற்றும் திருமணப் பொருத்த அறிவிப்புகளை கட்டுப்படுத்தவும்.'
                )}
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'whatsappDailyPanchangam',
                    title: tr('Daily WhatsApp Panchangam', 'தினசரி வாட்ஸ்அப் பஞ்சாங்கம்'),
                    desc: tr('Receive Brahma Muhurtham, Tithi, Nakshatra, and Rahu Kalam every morning at 06:00 AM on WhatsApp.', 'தினமும் காலை 6 மணிக்கு சுப முகூர்த்த நேரம், திதி, நட்சத்திரம் மற்றும் ராகு காலம் வாட்ஸ்அப்பில் பெறுக.'),
                    icon: '📲',
                  },
                  {
                    key: 'matrimonyMatchAlerts',
                    title: tr('Vedic Matrimony Match Alerts', 'புதிய வரன் பொருத்த அறிவிப்புகள்'),
                    desc: tr('Instant notification when a new candidate profile matches 8/10+ Poruthams with your chart.', 'உங்கள் ஜாதகத்திற்கு 8/10 பொருத்தங்கள் உள்ள புதிய வரன்கள் இணையும் போது உடனடி அறிவிப்பு.'),
                    icon: '💍',
                  },
                  {
                    key: 'astrologerAppointmentReminders',
                    title: tr('Astrologer Consultation Reminders', 'ஜோதிட ஆலோசனை நினைவூட்டல்'),
                    desc: tr('SMS and WhatsApp reminder 1 hour before scheduled consultation slots.', 'ஆலோசனை தொடங்குவதற்கு 1 மணி நேரத்திற்கு முன் நினைவூட்டல்.'),
                    icon: '⏱️',
                  },
                  {
                    key: 'planetaryTransitAlerts',
                    title: tr('Major Planetary Transit (Gochar) Alerts', 'முக்கிய கிரகப் பெயர்ச்சி அறிவிப்புகள்'),
                    desc: tr('Notifications for Jupiter (Guru), Saturn (Sani), and Rahu-Ketu transit effects on your Rasi.', 'குரு, சனி மற்றும் ராகு-கேது பெயர்ச்சி பலன்கள் குறித்த முன்னறிவிப்பு.'),
                    icon: '🪐',
                  },
                ].map((item) => {
                  const isChecked = Boolean(notifications[item.key]);
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleNotification(item.key)}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <strong className="text-slate-900 text-xs block">{item.title}</strong>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      <div className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 ${isChecked ? 'bg-amber-600' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <p className="text-slate-500 font-medium text-[11px]">
                {tr(
                  'Change your account password securely. Use at least 6 characters with letters and numbers.',
                  'உங்கள் கணக்கின் கடவுச்சொல்லை மாற்றவும். குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்.'
                )}
              </p>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {tr('Current Password *', 'தற்போதைய கடவுச்சொல் *')}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {tr('New Password *', 'புதிய கடவுச்சொல் *')}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  {tr('Confirm New Password *', 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும் *')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{changingPass ? tr('Updating...', 'மாற்றப்படுகிறது...') : tr('Change Password', 'கடவுச்சொல் மாற்று')}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: ABOUT & SYSTEM INFO */}
          {activeTab === 'about' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
                  🕉️
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">AstroJit Enterprise Platform</h4>
                  <p className="text-[11px] text-slate-500">Version 2.4.0 (Production Build)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                <div>
                  <span className="text-slate-400 block">Vedic Engine:</span>
                  <strong>Thirukanitha & Lahiri Ayanamsa</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Porutham System:</span>
                  <strong>South Indian 10 & 36 Gunas</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">API Server:</span>
                  <span className="font-mono text-emerald-700 font-bold">Online (Port 5000)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Client Version:</span>
                  <strong>Vite 8 React SPA</strong>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 text-center border-t border-slate-200">
                © 2026 Astrojit Technologies Private Limited. All Vedic calculation rights reserved.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
