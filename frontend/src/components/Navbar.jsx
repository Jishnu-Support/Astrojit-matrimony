import React, { useState } from 'react';
import { Sparkles, User, Shield, LogOut, ChevronDown, Store, Compass, Globe, Menu, X, HeartHandshake, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang, LANGUAGES } from '../i18n';
import Logo from './Logo';

export default function Navbar({ activeTab, setActiveTab, onOpenMatrimony, onToggleSidebar, onOpenProfile, onOpenSettings }) {
  const { user, role, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLanguage, t } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const getRoleBadge = () => {
    switch (role) {
      case 'company':
        return { label: t('roleCompanyAdmin'), bg: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50' };
      case 'astrologer':
        return { label: t('roleAstrologerPortal'), bg: 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50' };
      case 'vendor':
        return { label: t('roleVendorPortal'), bg: 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' };
      case 'client':
      default:
        return { label: t('roleClientUser'), bg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50' };
    }
  };

  const badge = getRoleBadge();
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#070E24]/75 dark:backdrop-blur-md border-b border-amber-200/70 dark:border-indigo-400/20 shadow-xs px-2 sm:px-6 py-1.5 sm:py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Toggle Menu / Sidebar"
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-stone-300" />
            </button>
          )}

          <div className="cursor-pointer select-none shrink-0" onClick={() => setActiveTab && setActiveTab('home')}>
            <div className="sm:hidden">
              <Logo size="xs" showTagline={false} />
            </div>
            <div className="hidden sm:block">
              <Logo size="md" showTagline={true} />
            </div>
          </div>
        </div>

        {/* Center / Matrimony Spotlight Badge */}
        <button
          onClick={() => {
            if (onOpenMatrimony) {
              onOpenMatrimony();
            } else {
              window.location.hash = '#/matrimony';
            }
          }}
          className="group flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 hover:from-rose-500/20 hover:to-amber-500/20 text-rose-950 dark:text-rose-200 border border-rose-300/80 dark:border-rose-700/60 hover:border-rose-400 px-1.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all duration-300 cursor-pointer shrink-0"
          title={t('weAlsoHaveMatrimony')}
        >
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400 transition-transform group-hover:scale-110 shrink-0" />
          <span className="text-[11px] sm:text-xs font-black tracking-tight text-rose-950 dark:text-rose-200 whitespace-nowrap hidden sm:inline">
            {t('weAlsoHaveMatrimony')}
          </span>
          <span className="text-[11px] font-black tracking-tight text-rose-950 dark:text-rose-200 whitespace-nowrap sm:hidden">
            {lang === 'ta' ? 'மேட்ரிமோனி' : lang === 'kn' ? 'ಮ್ಯಾಟ್ರಿಮೋನಿ' : lang === 'hi' ? 'मैट्रिमोनी' : 'Matrimony'}
          </span>
          <span className="hidden sm:inline-flex bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full tracking-wider shadow-2xs">
            NEW
          </span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Universal Theme Switcher (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-stone-700 transition-colors cursor-pointer"
            title={isDark ? (lang === 'ta' ? 'பகல் முறைக்கு மாறுக (Switch to Light Mode)' : 'Switch to Light Mode') : (lang === 'ta' ? 'இரவு முறைக்கு மாறுக (Switch to Dark Mode)' : 'Switch to Dark Mode')}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700 dark:text-stone-300" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-200 text-xs px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-stone-700 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-bold text-xs uppercase sm:hidden">{lang}</span>
              <span className="font-medium text-xs hidden sm:inline">{currentLangObj.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-700 rounded-xl shadow-xl p-1.5 z-50">
                <div className="text-[10px] text-slate-400 dark:text-stone-500 uppercase font-bold tracking-wider px-2 py-1 border-b border-slate-100 dark:border-stone-800">
                  {t('selectLanguage')}
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
                      lang === l.code ? 'text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-stone-800' : 'text-slate-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{l.native}</span>
                    <span className="text-[10px] text-slate-400 dark:text-stone-500">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* Role Pill - Desktop */}
              <div
                onClick={onOpenProfile}
                className="hidden lg:flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-xl"
                title="View Profile"
              >
                <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${badge.bg}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-slate-700 dark:text-stone-300 font-medium truncate max-w-[120px]">
                  {user.name || user.shopName || user.mobile}
                </span>
              </div>

              {/* Quick Settings Icon */}
              <button
                onClick={onOpenSettings}
                className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-slate-50 dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-stone-700 transition-colors cursor-pointer"
                title="Settings & Preferences"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-stone-400">Welcome to Astrojit</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
