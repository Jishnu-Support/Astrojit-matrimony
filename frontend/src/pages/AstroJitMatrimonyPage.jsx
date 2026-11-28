import React, { useState, useEffect } from 'react';
import {
  Heart, HeartHandshake, Sparkles, CheckCircle2, Phone, User, Calendar, MapPin,
  ExternalLink, ArrowRight, ShieldCheck, Search, Filter, Briefcase, GraduationCap,
  Users, Lock, ChevronRight, ChevronLeft, Plus, Eye, Check, AlertCircle, Bookmark,
  Star, FileText, Camera, RefreshCw, X, MessageSquare, Award, Clock, ArrowLeft,
  Globe, ChevronDown, Edit3, Sun, Moon
} from 'lucide-react';
import { useLang, LANGUAGES } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { API } from '../api';
import MatrimonyPortal from '../components/MatrimonyPortal';
import MatrimonyProfileEditModal from '../components/MatrimonyProfileEditModal';
import MarriageBiodataModal from '../components/MarriageBiodataModal';
import { formatNakshatra, formatRasi, formatDosha, formatMaritalStatus } from '../matrimonyLocalization';

export default function AstroJitMatrimonyPage({ onBackToAstrology }) {
  const { lang, setLanguage, t } = useLang();
  const { user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [myProfileData, setMyProfileData] = useState(null);
  const [activeSection, setActiveSection] = useState('loading'); // 'register', 'my-profile', 'browse', 'family', 'interests'
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Pure Localization Helper: strict unilingual display based on selected language
  const tr = (en, ta, kn, hi, te, bn) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    if (lang === 'te') return te || en;
    if (lang === 'bn') return bn || en;
    return en;
  };

  // Check if current user has an existing registered matrimony profile
  useEffect(() => {
    async function checkMyProfile() {
      try {
        setCheckingProfile(true);
        const res = await API.getMyMatrimonyProfile(user?.mobile, user?.id);
        if (res && res.hasProfile && res.profile) {
          setHasProfile(true);
          setMyProfileData(res.profile);
          setActiveSection('my-profile');
        } else {
          setHasProfile(false);
          setMyProfileData(null);
          // If first time register -> directly show registration form!
          setActiveSection('register');
        }
      } catch (err) {
        console.error('Error checking matrimony profile status:', err);
        setHasProfile(false);
        setActiveSection('register');
      } finally {
        setCheckingProfile(false);
      }
    }

    checkMyProfile();
  }, [user]);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-transparent text-slate-800 dark:text-slate-100 flex flex-col font-sans overflow-x-clip">
      {/* ========================================================================= */}
      {/* DEDICATED ASTROJIT MATRIMONY FULL-PAGE TOP NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#070E24]/80 backdrop-blur-md border-b border-rose-200/80 dark:border-indigo-400/20 shadow-xs px-2.5 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Brand & Matrimony Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial">
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
                <HeartHandshake className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-[13px] sm:text-lg font-black tracking-tight bg-gradient-to-r from-rose-700 via-pink-700 to-amber-700 bg-clip-text text-transparent truncate">
                    {tr('AstroJit Matrimony', 'அஸ்ட்ரோஜித் மேட்ரிமோனி', 'ಆಸ್ಟ್ರೋಜಿತ್ ಮ್ಯಾಟ್ರಿಮೋನಿ', 'एस्ट्रोजित मैट्रिमोनी')}
                  </span>
                  <span className="hidden sm:inline-flex bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.2 rounded-full border border-rose-200 dark:border-rose-800/50 shrink-0">
                    {tr('Vedic', 'வைதீகம்', 'ವೈದಿಕ', 'वैदिक')}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-stone-400 font-medium hidden sm:block">
                  {tr(
                    '10 Poruthams & 36 Gunas Authentic Vedic Matchmaking',
                    '10 பொருத்தங்கள் & 36 குணங்கள் துல்லிய திருமணத் தகவல் மையம்',
                    '10 ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು 36 ಗುಣಗಳ ನಿಖರ ವೈದಿಕ ವಿವಾಹ ಸೇವೆ',
                    '10 पोरुथम एवं 36 गुण प्रामाणिक वैदिक विवाह मिलान'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs (When registered or browsing) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-stone-800/80 p-1 rounded-2xl border border-slate-200 dark:border-stone-700 text-xs font-bold">
            {hasProfile && (
              <button
                onClick={() => setActiveSection('my-profile')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeSection === 'my-profile'
                    ? 'bg-white dark:bg-[#1E1815] text-rose-900 dark:text-rose-300 shadow-xs font-black'
                    : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
                }`}
              >
                👤 {tr('My Profile & Details', 'என் சுயவிவரம்', 'ನನ್ನ ಪ್ರೊಫೈಲ್', 'मेरी प्रोफाइल')}
              </button>
            )}

            <button
              onClick={() => setActiveSection('browse')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSection === 'browse'
                  ? 'bg-white dark:bg-[#1E1815] text-rose-900 dark:text-rose-300 shadow-xs font-black'
                  : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              🔍 {tr('Browse Matches', 'வரன் தேடல்', 'ವರನ್ ಹುಡುಕಾಟ', 'वर-वधू खोजें')}
            </button>

            <button
              onClick={() => setActiveSection('register')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSection === 'register'
                  ? 'bg-white dark:bg-[#1E1815] text-rose-900 dark:text-rose-300 shadow-xs font-black'
                  : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              ✍️ {hasProfile 
                ? tr('Register Profile', 'புதிய வரன் பதிவு', 'ಹೊಸ ನೋಂದಣಿ', 'नई प्रोफाइल पंजीकृत करें')
                : tr('First Time Register', 'வரன் பதிவு', 'ಮೊದಲ ನೋಂದಣಿ', 'पंजीकरण फॉर्म')}
            </button>

            <button
              onClick={() => setActiveSection('family')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSection === 'family'
                  ? 'bg-white dark:bg-[#1E1815] text-rose-900 dark:text-rose-300 shadow-xs font-black'
                  : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              👨‍👩‍👧‍👦 {tr('Family Vault', 'குடும்ப உறுப்பினர்கள்', 'ಕುಟುಂಬ ಸದಸ್ಯರು', 'पारिवारिक विवरण')}
            </button>

            <button
              onClick={() => setActiveSection('interests')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSection === 'interests'
                  ? 'bg-white dark:bg-[#1E1815] text-rose-900 dark:text-rose-300 shadow-xs font-black'
                  : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              💌 {tr('Interests & Shortlists', 'விருப்பங்கள்', 'ಆಸಕ್ತಿಗಳು', 'रुचियां व पसंदीदा')}
            </button>
          </div>

          {/* Right Controls: Theme Toggle + Language + Back to Astrology */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-700 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-stone-700 transition-colors cursor-pointer"
              title={isDark ? tr('Switch to Light Mode', 'பகல் முறைக்கு மாறுக') : tr('Switch to Dark Mode', 'இரவு முறைக்கு மாறுக')}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-stone-400" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 bg-white dark:bg-[#1E1815] hover:bg-slate-50 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 text-xs px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-stone-700 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="font-bold text-xs uppercase sm:hidden">{lang}</span>
                <span className="font-semibold text-xs hidden sm:inline">{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1E1815] border border-slate-200 dark:border-stone-700 rounded-2xl shadow-xl p-1.5 z-50">
                  <div className="text-[10px] text-slate-400 uppercase font-bold px-2 py-1 border-b border-slate-100 dark:border-stone-800">
                    {tr('Select Language', 'மொழியைத் தேர்ந்தெடுக்கவும்', 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', 'भाषा चुनें')}
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded-xl transition-colors cursor-pointer ${
                        lang === l.code ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300'
                      }`}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Back to Astrojit Astrology Button */}
            <button
              onClick={onBackToAstrology}
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs px-2.5 sm:px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              title={tr('Return to Astrojit Astrology Dashboard', 'அஸ்ட்ரோஜித் ஜோதிட தளம் திரும்புக', 'ಜ್ಯೋತಿಷ್ಯ ಪೋರ್ಟಲ್‌ಗೆ ಹಿಂತಿರುಗಿ', 'ज्योतिष पोर्टल पर लौटें')}
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {tr('Astrology Portal', 'அஸ்ட்ரோஜித் முகப்பு', 'ಜ್ಯೋತಿಷ್ಯ ಮುಖಪುಟ', 'ज्योतिष पोर्टल')}
              </span>
              <span className="sm:hidden font-bold">{tr('Astro', 'முகப்பு', 'ಮುಖಪುಟ', 'ज्योतिष')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Tabs (< lg) */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white/95 dark:bg-[#1E1815]/95 border-b border-rose-100 dark:border-rose-900/40 overflow-x-auto whitespace-nowrap scrollbar-none text-xs font-bold shadow-2xs">
        {hasProfile && (
          <button
            onClick={() => setActiveSection('my-profile')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeSection === 'my-profile'
                ? 'bg-rose-600 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 bg-slate-100 dark:bg-stone-800/80'
            }`}
          >
            👤 {tr('My Profile', 'என் சுயவிவரம்', 'ನನ್ನ ಪ್ರೊಫೈಲ್', 'मेरी प्रोफाइल')}
          </button>
        )}

        <button
          onClick={() => setActiveSection('browse')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSection === 'browse'
              ? 'bg-rose-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 bg-slate-100 dark:bg-stone-800/80'
          }`}
        >
          🔍 {tr('Browse', 'வரன் தேடல்', 'ಹುಡುಕಾಟ', 'खोजें')}
        </button>

        <button
          onClick={() => setActiveSection('register')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSection === 'register'
              ? 'bg-rose-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 bg-slate-100 dark:bg-stone-800/80'
          }`}
        >
          ✍️ {tr('Register', 'வரன் பதிவு', 'ನೋಂದಣಿ', 'पंजीकरण')}
        </button>

        <button
          onClick={() => setActiveSection('family')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSection === 'family'
              ? 'bg-rose-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 bg-slate-100 dark:bg-stone-800/80'
          }`}
        >
          👨‍👩‍👧‍👦 {tr('Family', 'குடும்பம்', 'ಕುಟುಂಬ', 'परिवार')}
        </button>

        <button
          onClick={() => setActiveSection('interests')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSection === 'interests'
              ? 'bg-rose-600 text-white shadow-xs font-black'
              : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 bg-slate-100 dark:bg-stone-800/80'
          }`}
        >
          💌 {tr('Interests', 'விருப்பங்கள்', 'ಆಸಕ್ತಿಗಳು', 'रुचियां')}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MAIN FULL-PAGE WEBSITE CONTENT */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        {checkingProfile ? (
          <div className="py-24 text-center space-y-3 bg-white dark:bg-[#1E1815] border border-slate-200 dark:border-stone-700 rounded-3xl shadow-xs">
            <Sparkles className="w-10 h-10 text-rose-500 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-stone-300">
              {tr('Connecting to AstroJit Matrimony Platform...', 'அஸ்ட்ரோஜித் மேட்ரிமோனி தளத்துடன் இணைக்கப்படுகிறது...', 'ಆಸ್ಟ್ರೋಜಿತ್ ಮ್ಯಾಟ್ರಿಮೋನಿ ಪೋರ್ಟಲ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...', 'एस्ट्रोजित मैट्रिमोनी से कनेक्ट हो रहा है...')}
            </p>
            <p className="text-xs text-slate-400">
              {tr('Verifying profile registration status & horoscope alignment', 'சுயவிவரப் பதிவு நிலை மற்றும் ஜாதகப் பொருத்தம் சரிபார்க்கப்படுகிறது', 'ಪ್ರೊಫೈಲ್ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ', 'प्रोफाइल एवं कुंडली सत्यापन जारी है')}
            </p>
          </div>
        ) : (
          <>
            {/* FIRST TIME REGISTRATION BANNER / WELCOME */}
            {!hasProfile && activeSection === 'register' && (
              <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="max-w-3xl space-y-3 relative z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/25 px-3 py-1 rounded-full border border-white/30">
                      {tr('FIRST TIME MATRIMONY REGISTRATION', 'முதல் முறை வரன் பதிவு', 'ಮೊದಲ ವಿವಾಹ ನೋಂದಣಿ', 'प्रथम बार विवाह पंजीकरण')}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-300 text-slate-950 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {tr('Thirukanitha Vedic Verified', 'திருக்கணித வைதீகச் சான்றளிக்கப்பட்டது', 'ತಿರುಕಣಿತ ವೈದಿಕ ಪರಿಶೀಲಿತ', 'थिरुकणिता वैदिक सत्यापित')}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {tr(
                      'Welcome to AstroJit Matrimony! Complete Your Matrimony Profile',
                      'அஸ்ட்ரோஜித் மேட்ரிமோனிக்கு தங்களை அன்புடன் வரவேற்கிறோம்!',
                      'ಆಸ್ಟ್ರೋಜಿತ್ ಮ್ಯಾಟ್ರಿಮೋನಿಗೆ ಸ್ವಾಗತ! ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ',
                      'एस्ट्रोजित मैट्रिमोनी में आपका स्वागत है! अपनी वैवाहिक प्रोफाइल पूर्ण करें'
                    )}
                  </h1>
                  <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-medium">
                    {tr(
                      'First time registering? Welcome! Select yourself or any family member to 1-click autofill all personal, family, and Thirukanitha horoscope calculations directly from your Astrojit profile.',
                      'முதல் முறை பதிவா? உங்கள் அஸ்ட்ரோஜித் கணக்கிலிருந்து உங்கள் விவரங்கள் மற்றும் ஜாதகக் கணிப்புகள் (நட்சத்திரம், ராசி, லக்னம், செவ்வாய் தோஷம்) தானியங்கு முறையில் நிரப்பப்படும்.',
                      'ಮೊದಲ ನೋಂದಣಿಯೇ? ನಿಮ್ಮ ಆಸ್ಟ್ರೋಜಿತ್ ಖಾತೆಯಿಂದ ವೈಯಕ್ತಿಕ ಹಾಗೂ ತಿರುಕಣಿತ ಜಾತಕ ವಿವರಗಳು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಭರ್ತಿಯಾಗುತ್ತವೆ.',
                      'क्या आप पहली बार पंजीकरण कर रहे हैं? अपनी या परिवार के किसी सदस्य की प्रोफाइल चुनें और 1-क्लिक में थिरुकणिता कुंडली सहित सभी विवरण स्वतः भरें।'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* IF REGISTERED: MY PROFILE & DETAILS SUMMARY HERO */}
            {hasProfile && activeSection === 'my-profile' && myProfileData && (
              <div className="space-y-6">
                {/* Toast Notification */}
                {toastMsg && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold">{toastMsg}</span>
                    </div>
                    <button onClick={() => setToastMsg('')} className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 text-xs font-bold cursor-pointer">
                      ✕
                    </button>
                  </div>
                )}

                {/* Profile Overview Card */}
                <div className="bg-white dark:bg-[#1E1815] border-2 border-rose-200/80 dark:border-rose-800/50 rounded-3xl p-4 sm:p-7 md:p-8 shadow-sm space-y-5 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                    {/* Candidate Photo */}
                    <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-slate-200 dark:border-stone-700 group mx-auto sm:mx-0">
                      <img
                        src={myProfileData.photoUrl || myProfileData.primaryPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&fit=crop'}
                        alt={myProfileData.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        {myProfileData.profileType === 'Bride' ? tr('Bride', 'மணமகள்', 'ವಧು', 'वधू') : tr('Groom', 'மணமகன்', 'ವರ', 'वर')}
                      </div>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                        title={tr('Edit Photo & Details', 'படம் & விவரம் திருத்து', 'ಫೋಟೋ & ವಿವರ ಸಂಪಾದಿಸಿ', 'फोटो एवं विवरण बदलें')}
                      >
                        <Camera className="w-3 h-3" />
                        <span>{tr('Edit', 'திருத்து', 'ಸಂಪಾದಿಸಿ', 'बदलें')}</span>
                      </button>
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-stone-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 px-2 py-0.5 rounded-full">
                              {tr('ID', 'வரன் எண்', 'ಐಡಿ', 'आईडी')}: {myProfileData.id || myProfileData.matrimonyId}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              {myProfileData.account?.isVerified !== false 
                                ? tr('Verified Profile', 'சரிபார்க்கப்பட்ட சுயவிவரம்', 'ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್', 'सत्यापित प्रोफाइल')
                                : tr('Pending Verification', 'சரிபார்ப்பு நிலுவையில்', 'ಪರಿಶೀಲನೆ ಬಾಕಿ', 'सत्यापन शेष')}
                            </span>
                            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
                              {myProfileData.account?.completenessPercentage || myProfileData.completenessScore || 96}% {tr('Complete', 'முழுமை', 'ಪೂರ್ಣಗೊಂಡಿದೆ', 'पूर्ण')}
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-stone-100 mt-1">
                            {myProfileData.name}
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-stone-400 font-medium">
                            {myProfileData.age} {tr('Years', 'வயது', 'ವರ್ಷ', 'वर्ष')} • {myProfileData.height} • {formatMaritalStatus(myProfileData.maritalStatus, lang)} • {myProfileData.city}, {myProfileData.state}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <button
                            onClick={() => setShowBiodataModal(true)}
                            className="px-3.5 py-2 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 border border-amber-600"
                            title={tr('Download or Print Traditional Vedic Marriage Bio-Data', 'பாரம்பரிய ஜாதக பயோடேட்டா பதிவிறக்கம் / அச்சு')}
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-300" />
                            <span>{tr('Marriage Bio-Data (PDF)', 'ஜாதக பயோடேட்டா (PDF)', 'ವಿವಾಹ ಬಯೋಡೇಟಾ', 'विवाह बायो-डेटा (PDF)')}</span>
                          </button>
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300 dark:border-amber-700/60"
                            title={tr('Edit My Matrimony Profile', 'என் சுயவிவரத்தைத் திருத்தவும்', 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ', 'प्रोफाइल संपादित करें')}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            {tr('Edit Profile', 'சுயவிவரம் திருத்து', 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ', 'प्रोफाइल संपादित करें')}
                          </button>
                          <button
                            onClick={() => setActiveSection('browse')}
                            className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Search className="w-3.5 h-3.5" />
                            {tr('Browse Matches', 'வரன் தேடல்', 'ವರನ್ ಹುಡುಕಾಟ', 'वर-वधू खोजें')}
                          </button>
                          <button
                            onClick={() => setActiveSection('register')}
                            className="px-3 py-2 border border-slate-200 dark:border-stone-700 hover:bg-slate-50 dark:hover:bg-stone-800 text-slate-700 dark:text-stone-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            {tr('Add Family Profile', 'குடும்ப வரன் சேர்க்க', 'ಕುಟುಂಬ ಪ್ರೊಫೈಲ್ ಸೇರಿಸಿ', 'पारिवारिक प्रोफाइल जोड़ें')}
                          </button>
                        </div>
                      </div>

                      {/* Astrological Verification Highlight */}
                      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🕉️</span>
                          <div>
                            <p className="font-bold text-amber-950 dark:text-amber-200 text-sm">
                              {formatNakshatra(myProfileData.nakshatra || myProfileData.starNakshatra, lang)} ({myProfileData.pada || 1} {tr('Padam', 'பாதம்', 'ಪಾದ', 'चरण')}) • {formatRasi(myProfileData.rasi || myProfileData.rasiMoonSign, lang)}
                            </p>
                            <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                              {tr('Lagna', 'லக்னம்', 'ಲಗ್ನ', 'लग्न')}: {formatRasi(myProfileData.lagna || myProfileData.lagnamAscendant, lang)} • {formatDosha(myProfileData.manglikStatus || myProfileData.manglikDosha, lang)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-amber-200 dark:bg-amber-900/50 text-amber-950 dark:text-amber-200 px-2.5 py-1 rounded-full">
                          {tr('Thirukanitha Calculated', 'திருக்கணிதக் கணிப்பு', 'ತಿರುಕಣಿತ ಲೆಕ್ಕಾಚಾರ', 'थिरुकणिता गणना')}
                        </span>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-stone-300 pt-1">
                        <div className="p-3 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-100 dark:border-stone-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {tr('Education & Degree', 'கல்வி & பட்டம்', 'ಶಿಕ್ಷಣ ಮತ್ತು ಪದವಿ', 'शिक्षा एवं डिग्री')}
                          </span>
                          <strong className="text-slate-900 dark:text-stone-100">{myProfileData.highestEducation || myProfileData.degree}</strong>
                          <p className="text-[11px] text-slate-500 dark:text-stone-400">{myProfileData.college || tr('Premier Institute', 'புகழ்பெற்ற கல்லூரி', 'ಪ್ರಸಿದ್ಧ ಕಾಲೇಜು', 'प्रतिष्ठित संस्थान')}</p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-100 dark:border-stone-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {tr('Profession & Income', 'தொழில் & வருமானம்', 'ವೃತ್ತಿ ಮತ್ತು ಆದಾಯ', 'व्यवसाय एवं आय')}
                          </span>
                          <strong className="text-slate-900 dark:text-stone-100">{myProfileData.occupation}</strong>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">{myProfileData.annualIncome}</p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-100 dark:border-stone-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {tr('Caste & Gotra', 'சாதி & கோத்திரம்', 'ಜಾತಿ ಮತ್ತು ಗೋತ್ರ', 'जाति एवं गोत्र')}
                          </span>
                          <strong className="text-slate-900 dark:text-stone-100">{myProfileData.caste} ({myProfileData.subCaste || tr('General', 'பொது', 'ಸಾಮಾನ್ಯ', 'सामान्य')})</strong>
                          <p className="text-[11px] text-slate-500 dark:text-stone-400">{tr('Gotra', 'கோத்திரம்', 'ಗೋತ್ರ', 'गोत्र')}: {myProfileData.gotra || tr('Not specified', 'குறிப்பிடப்படவில்லை', 'ತಿಳಿಸಿಲ್ಲ', 'उल्लेख नहीं')}</p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-100 dark:border-stone-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {tr('Family Background', 'குடும்ப விவரம்', 'ಕುಟುಂಬ ಹಿನ್ನೆಲೆ', 'पारिवारिक पृष्ठभूमि')}
                          </span>
                          <strong className="text-slate-900 dark:text-stone-100">{tr('Father', 'தந்தை', 'ತಂದೆ', 'पिता')}: {myProfileData.fatherName}</strong>
                          <p className="text-[11px] text-slate-500 dark:text-stone-400">{tr('Mother', 'தாய்', 'ತಾಯಿ', 'माता')}: {myProfileData.motherName} • {tr('Native', 'சொந்த ஊர்', 'ಮೂಲ ಊರು', 'मूल निवास')}: {myProfileData.nativePlace}</p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-100 dark:border-stone-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {tr('Contact Information', 'தொடர்பு விவரம்', 'ಸಂಪರ್ಕ ಮಾಹಿತಿ', 'संपर्क विवरण')}
                          </span>
                          <strong className="text-slate-900 dark:text-stone-100">{myProfileData.contact?.mobile || myProfileData.mobile}</strong>
                          <p className="text-[11px] text-slate-500 dark:text-stone-400">{tr('Visibility', 'பார்வை நிலை', 'ಗೋಚರತೆ', 'दृश्यता')}: {myProfileData.account?.profileVisibility || tr('Public', 'பொது', 'ಸಾರ್ವಜನಿಕ', 'सार्वजनिक')}</p>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-stone-900/70 rounded-xl border border-slate-100 dark:border-stone-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            {tr('Partner Expectations', 'எதிர்பார்ப்புகள்', 'ನಿರೀಕ್ಷೆಗಳು', 'जीवनसाथी से अपेक्षाएं')}
                          </span>
                          <p className="text-[11px] text-slate-700 dark:text-stone-300 line-clamp-2">
                            {myProfileData.partnerPreferences?.specialExpectations || tr('Looking for an understanding and cultured partner.', 'குடும்ப பண்புகளும் புரிதலும் கொண்ட வாழ்க்கைத் துணையை எதிர்பார்க்கிறோம்.', 'ಸಂಸ್ಕಾರಯುತ ಮತ್ತು ಹೊಂದಿಕೊಳ್ಳುವ ಜೀವನ ಸಂಗಾತಿಗಾಗಿ ಹುಡುಕಾಟ.', 'संस्कारवान और समझदार जीवनसाथी की तलाश।')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-section: Candidate Matches for you */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-stone-100">
                        {tr('Recommended Soulmate Matches for You', 'உங்களுக்கான பரிந்துரைக்கப்பட்ட வரன்கள்', 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಿದ ಹೊಂದಾಣಿಕೆಗಳು', 'आपके लिए अनुशंसित सुयोग्य मिलान')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-stone-400">
                        {tr(
                          `Profiles matching your Nakshatra (${formatNakshatra(myProfileData.nakshatra || myProfileData.starNakshatra, 'en')}) and partner preferences.`,
                          `உங்கள் நட்சத்திரம் (${formatNakshatra(myProfileData.nakshatra || myProfileData.starNakshatra, 'ta')}) மற்றும் விருப்பங்களுக்குப் பொருந்திய வரன்கள்.`,
                          `ನಿಮ್ಮ ನಕ್ಷತ್ರ (${formatNakshatra(myProfileData.nakshatra || myProfileData.starNakshatra, 'kn')}) ಹಾಗೂ ಆದ್ಯತೆಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಪ್ರೊಫೈಲ್‌ಗಳು.`,
                          `आपके नक्षत्र (${formatNakshatra(myProfileData.nakshatra || myProfileData.starNakshatra, 'hi')}) और प्राथमिकताओं से मेल खाती प्रोफाइलें।`
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection('browse')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      {tr('View All in Directory', 'அனைத்தையும் காண்க', 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ', 'सभी देखें')} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Render Matrimony Portal in embedded mode */}
                  <MatrimonyPortal isModal={false} defaultTab="browse" hideHeroBanner={true} />
                </div>
              </div>
            )}

            {/* BROWSE CANDIDATES DIRECTORY */}
            {activeSection === 'browse' && (
              <MatrimonyPortal isModal={false} defaultTab="browse" hideHeroBanner={true} />
            )}

            {/* REGISTRATION FORM (FIRST TIME OR NEW PROFILE) */}
            {activeSection === 'register' && (
              <MatrimonyPortal isModal={false} defaultTab="register" hideHeroBanner={true} />
            )}

            {/* FAMILY VAULT */}
            {activeSection === 'family' && (
              <MatrimonyPortal isModal={false} defaultTab="family" hideHeroBanner={true} />
            )}

            {/* INTERESTS & SHORTLISTS */}
            {activeSection === 'interests' && (
              <MatrimonyPortal isModal={false} defaultTab="interests" hideHeroBanner={true} />
            )}
          </>
        )}

        {/* Profile Edit Modal */}
        {myProfileData && (
          <MatrimonyProfileEditModal
            profile={myProfileData}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSaveSuccess={(updated) => {
              setMyProfileData(updated);
              setToastMsg(
                tr(
                  'Matrimony profile updated successfully!',
                  'சுயவிவரம் வெற்றிகரமாக மாற்றப்பட்டது!',
                  'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
                  'प्रोफाइल सफलतापूर्वक अद्यतन की गई!'
                )
              );
              setTimeout(() => setToastMsg(''), 4000);
            }}
          />
        )}

        {/* Traditional Vedic Marriage Bio-Data Modal */}
        {myProfileData && (
          <MarriageBiodataModal
            profile={myProfileData}
            isOpen={showBiodataModal}
            onClose={() => setShowBiodataModal(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1E1815] border-t border-slate-200/80 dark:border-stone-700 py-6 text-center text-xs text-slate-500 dark:text-stone-400">
        <p className="font-semibold text-slate-700 dark:text-stone-300">
          {tr('AstroJit Matrimony Platform • Vedic Matchmaking & Jathagam', 'அஸ்ட்ரோஜித் மேட்ரிமோனி தளம் • வைதீக திருமணப் பொருத்தம் & ஜாதகம்', 'ಆಸ್ಟ್ರೋಜಿತ್ ಮ್ಯಾಟ್ರಿಮೋನಿ • ವೈದಿಕ ವಿವಾಹ ಸೇವೆ', 'एस्ट्रोजित मैट्रिमोनी • वैदिक विवाह मिलान')}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          {tr(
            'Authentic Thirukanitha 10 Poruthams & 36 Gunas Ashtakoota. All profiles verified with privacy protection.',
            'உண்மையான திருக்கணித 10 பொருத்தங்கள் மற்றும் 36 குணங்கள் அஷ்டகூட ஆய்வு. அனைத்து சுயவிவரங்களும் சரிபார்க்கப்பட்டவை.',
            'ನಿಖರ ತಿರುಕಣಿತ 10 ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು 36 ಗುಣಗಳು. ಎಲ್ಲಾ ಪ್ರೊಫೈಲ್‌ಗಳು ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ.',
            'प्रामाणिक थिरुकणिता 10 पोरुथम एवं 36 गुण अष्टकूट मिलान। शत-प्रतिशत गोपनीयता सुरक्षा।'
          )}
        </p>
      </footer>
    </div>
  );
}
