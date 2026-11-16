import React from 'react';
import {
  Calendar, FileText, Heart, ShoppingBag, Clock, Shield, Users,
  Store, Compass, Settings, User, LogOut, ChevronLeft, ChevronRight,
  Sparkles, CheckCircle2, HeartHandshake, Search, Layers, X, Globe,
  ShieldCheck, Moon, Sun, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import Logo from './Logo';

export default function Sidebar({
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  activeModule,
  onSelectModule,
  onOpenProfile,
  onOpenSettings,
  onOpenMatrimony,
  currentView
}) {
  const { user, role, logout } = useAuth();
  const { lang, t } = useLang();

  const tr = (en, ta, kn, hi) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'hi') return hi || en;
    return en;
  };

  // Define modules according to user role
  const getModules = () => {
    switch (role) {
      case 'company':
        return [
          { id: 'overview', label: tr('System Overview', 'கணினி கண்ணோட்டம்'), icon: Shield, badge: 'HQ' },
          { id: 'clients', label: tr('All Clients', 'வாடிக்கையாளர்கள்'), icon: Users },
          { id: 'astrologers', label: tr('Astrologer Network', 'ஜோதிடர்கள்'), icon: Compass },
          { id: 'vendors', label: tr('Certified Vendors', 'வணிகர்கள்'), icon: Store },
          { id: 'products', label: tr('Marketplace Inventory', 'சந்தை இருப்பு'), icon: ShoppingBag },
          { id: 'matrimony', label: tr('Matrimony Hub', 'திருமண மையம்'), icon: HeartHandshake, badge: 'Gov', isMatrimonyTab: true },
        ];
      case 'astrologer':
        return [
          { id: 'horoscope', label: tr('Horoscope', 'ஜாதகம்'), icon: Sparkles },
          { id: 'search', label: tr('Client Search & Kundli', 'வாடிக்கையாளர் ஜாதகத் தேடல்'), icon: Search },
          { id: 'matchmaking', label: tr('Matchmaking Requests', 'பொருத்த ஆய்வுக் கோரிக்கைகள்'), icon: HeartHandshake, badge: 'Active' },
          { id: 'referred', label: tr('Referred Clients', 'பரிந்துரைக்கப்பட்டோர்'), icon: Users },
          { id: 'appointments', label: tr('Consultations & Slots', 'ஆலோசனை முன்பதிவுகள்'), icon: Clock },
        ];
      case 'vendor':
        return [
          { id: 'catalog', label: tr('Products & Inventory', 'பொருட்கள் & இருப்பு'), icon: Store },
          { id: 'orders', label: tr('Customer Orders', 'ஆர்டர்கள்'), icon: ShoppingBag },
        ];
      case 'client':
      default:
        return [
          { id: 'panchangam', label: tr('Daily Panchangam', 'தினசரி பஞ்சாங்கம்'), icon: Calendar, badge: 'Live' },
          { id: 'horoscope', label: tr('Horoscope', 'ஜாதகம்'), icon: Sparkles },
          { id: 'matchmaking', label: tr('Marriage Compatibility', 'திருமணப் பொருத்தம்'), icon: HeartHandshake },
          { id: 'matrimony', label: tr('Vedic Matrimony Portal', 'வைதீக மேட்ரிமோனி'), icon: Heart, badge: 'NEW', isMatrimonyPage: true },
          { id: 'shop', label: tr('Puja & Spiritual Shop', 'பூஜைப் பொருட்கள் அங்காடி'), icon: ShoppingBag },
          { id: 'appointments', label: tr('My Appointments', 'எனது முன்பதிவுகள்'), icon: Clock },
        ];
    }
  };

  const modules = getModules();

  const handleModuleClick = (mod) => {
    if (mod.isMatrimonyPage) {
      if (onOpenMatrimony) onOpenMatrimony();
    } else {
      if (onSelectModule) onSelectModule(mod.id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const displayName = user?.name || user?.shopName || user?.mobile || 'User';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/90 shadow-lg lg:shadow-xs flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top: Brand Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className={`flex items-center overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <Logo
              size={isCollapsed ? 'xs' : 'sm'}
              iconOnly={isCollapsed}
              showTagline={!isCollapsed}
            />
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs scrollbar-thin">
          
          {/* SECTION 1: MODULES */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>{tr('MODULES', 'தொகுதிகள்')}</span>
                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">{modules.length}</span>
              </div>
            )}

            <div className="space-y-1">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const isSelected = (currentView === 'matrimony' && (mod.isMatrimonyPage || mod.isMatrimonyTab)) ||
                  (currentView !== 'matrimony' && activeModule === mod.id);

                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer relative group text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    title={isCollapsed ? mod.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-amber-600'}`} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1">{mod.label}</span>
                    )}

                    {!isCollapsed && mod.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : mod.badge === 'NEW'
                          ? 'bg-rose-100 text-rose-700 animate-pulse font-extrabold'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mod.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: PROFILE */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>{tr('PROFILE', 'சுயவிவரம்')}</span>
              </div>
            )}

            <button
              onClick={() => { if (onOpenProfile) onOpenProfile(); if (onCloseMobile) onCloseMobile(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer group text-left ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
              title={isCollapsed ? tr('Profile & Kundli', 'சுயவிவரம்') : undefined}
            >
              <User className="w-4 h-4 text-slate-500 group-hover:text-amber-600 shrink-0" />
              {!isCollapsed && (
                <div className="truncate flex-1">
                  <span className="truncate block">{tr('Profile & Kundli', 'சுயவிவரம் & ஜாதகம்')}</span>
                  <span className="text-[10px] text-slate-400 font-normal truncate block">
                    {tr('View coordinates & bio', 'ஜாதகக் குறிப்புகள்')}
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* SECTION 3: SETTINGS */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>{tr('SETTINGS', 'அமைப்புகள்')}</span>
              </div>
            )}

            <button
              onClick={() => { if (onOpenSettings) onOpenSettings(); if (onCloseMobile) onCloseMobile(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer group text-left ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
              title={isCollapsed ? tr('Settings & Preferences', 'அமைப்புகள்') : undefined}
            >
              <Settings className="w-4 h-4 text-slate-500 group-hover:text-amber-600 shrink-0" />
              {!isCollapsed && (
                <div className="truncate flex-1">
                  <span className="truncate block">{tr('Preferences', 'விருப்பங்கள்')}</span>
                  <span className="text-[10px] text-slate-400 font-normal truncate block">
                    {tr('Language, Alerts, Security', 'மொழி, அறிவிப்பு, பாதுகாப்பு')}
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Bottom: User Card & Logout */}
        <div className="p-3 border-t border-slate-200/90 bg-slate-50/70 shrink-0">
          <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
            {/* Avatar */}
            <div
              onClick={() => { if (onOpenProfile) onOpenProfile(); }}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 text-white font-black flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:scale-105 transition-transform"
              title="Click to view profile"
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {!isCollapsed && (
              <div className="truncate flex-1">
                <span className="font-bold text-slate-900 text-xs block truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  {user?.mobile || user?.role}
                </span>
              </div>
            )}

            {/* Logout Action */}
            <button
              onClick={logout}
              className={`p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ${
                isCollapsed ? 'hidden' : ''
              }`}
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
