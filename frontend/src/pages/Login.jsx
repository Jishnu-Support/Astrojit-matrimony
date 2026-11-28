import React, { useState } from 'react';
import {
  User,
  Compass,
  Store,
  Shield,
  Lock,
  Phone,
  Sparkles,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
  Check,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { API } from '../api';
import Logo from '../components/Logo';
import { clean10DigitMobile } from '../utils/phoneUtils';

export default function Login({ onSwitchToRegister }) {
  const { login, sessionExpiredNotice, clearSessionExpiredNotice } = useAuth();
  const { lang, t } = useLang();

  // Mode: 'login' | 'forgot'
  const [viewMode, setViewMode] = useState('login');

  // Login form state
  const [selectedRole, setSelectedRole] = useState('astrologer');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password workflow state
  const [forgotStep, setForgotStep] = useState(1); // 1: Verify Mobile, 2: OTP & New Password, 3: Success
  const [forgotRole, setForgotRole] = useState('astrologer');
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [verifiedUserInfo, setVerifiedUserInfo] = useState(null);
  const [forgotDemoOtp, setForgotDemoOtp] = useState('');

  const tr = (en, ta, hi, kn, te, bn) => {
    if (lang === 'ta') return ta || en;
    if (lang === 'hi') return hi || en;
    if (lang === 'kn') return kn || en;
    if (lang === 'te') return te || en;
    if (lang === 'bn') return bn || en;
    return en;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const finalMobile = selectedRole === 'company' ? mobile.trim() : clean10DigitMobile(mobile);
    try {
      await login(selectedRole, finalMobile, password);
    } catch (err) {
      const rawMsg = (err.message || '').toLowerCase();
      if (
        rawMsg.includes('invalid') ||
        rawMsg.includes('not found') ||
        rawMsg.includes('password') ||
        rawMsg.includes('credentials') ||
        rawMsg.includes('failed') ||
        rawMsg.includes('401') ||
        rawMsg.includes('404')
      ) {
        setError(tr('Invalid username and password.', 'தவறான பயனர்பெயர் மற்றும் கடவுச்சொல்.'));
      } else {
        setError(err.message || tr('Invalid username and password.', 'தவறான பயனர்பெயர் மற்றும் கடவுச்சொல்.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Verify Mobile Number for Password Reset
  const handleVerifyMobile = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    const cleanMobile = forgotRole === 'company' ? forgotMobile.trim() : clean10DigitMobile(forgotMobile);
    try {
      const res = await API.forgotPasswordVerify({
        role: forgotRole,
        mobile: cleanMobile
      });

      setVerifiedUserInfo(res);
      setForgotDemoOtp(res.demoOtp || '');
      setForgotStep(2);
      setForgotOtp('');
      setForgotSuccess(res.message || tr('Account verified. Please enter the verification OTP.', 'கணக்கு சரிபார்க்கப்பட்டது. ஓடிபி குறியீட்டை உள்ளிடவும்.'));
    } catch (err) {
      setForgotError(err.message || tr('Account verification failed.', 'கணக்கு சரிபார்ப்பு தோல்வியடைந்தது.'));
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Reset Password with OTP & New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    if (newPassword.length < 6) {
      setForgotError(tr('New password must be at least 6 characters long.', 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் கொண்டிருக்க வேண்டும்.'));
      setForgotLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError(tr('Passwords do not match. Please re-enter.', 'கடவுச்சொற்கள் பொருந்தவில்லை. மீண்டும் உள்ளிடவும்.'));
      setForgotLoading(false);
      return;
    }

    const cleanMobile = forgotRole === 'company' ? forgotMobile.trim() : clean10DigitMobile(forgotMobile);
    try {
      const res = await API.forgotPasswordReset({
        role: forgotRole,
        mobile: cleanMobile,
        otp: forgotOtp,
        newPassword
      });

      setForgotStep(3);
      setForgotSuccess(res.message || tr('Password reset successfully!', 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!'));
    } catch (err) {
      setForgotError(err.message || tr('Failed to reset password.', 'கடவுச்சொல் மாற்றுதல் தோல்வியடைந்தது.'));
    } finally {
      setForgotLoading(false);
    }
  };

  const handleOpenForgot = () => {
    setViewMode('forgot');
    setForgotStep(1);
    setForgotRole(selectedRole);
    setForgotMobile(mobile || '');
    setForgotError('');
    setForgotSuccess('');
    setNewPassword('');
    setConfirmPassword('');
    setVerifiedUserInfo(null);
  };

  const handleBackToLogin = () => {
    setViewMode('login');
    if (forgotMobile) {
      setMobile(forgotMobile);
      setSelectedRole(forgotRole);
    }
    setError('');
  };

  const roles = [
    { id: 'client', label: tr('Client / User', 'வாடிக்கையாளர் / பயனர்'), icon: User, color: 'text-amber-700 dark:text-amber-400', activeBg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700/60' },
    { id: 'astrologer', label: tr('Astrologer', 'ஜோதிடர்'), icon: Compass, color: 'text-indigo-700 dark:text-indigo-400', activeBg: 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60' },
    { id: 'vendor', label: tr('Vendor Partner', 'வணிகக் கூட்டாளர்'), icon: Store, color: 'text-emerald-700 dark:text-emerald-400', activeBg: 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60' },
    { id: 'company', label: tr('Company (JIT)', 'நிறுவனம் (JIT)'), icon: Shield, color: 'text-rose-700 dark:text-rose-400', activeBg: 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-700/60' },
  ];

  return (
    <div className="max-w-md w-full mx-auto my-auto space-y-2 sm:space-y-3 relative z-10">
      {/* Brand Header with 3D Celestial Aura */}
      <div className="text-center space-y-1 flex flex-col items-center">
        <div className="relative group transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-600/15 rounded-full blur-xl opacity-80 group-hover:opacity-100 transition duration-700 pointer-events-none" />
          <Logo size="sm" showTagline={false} className="relative z-10 drop-shadow-md" />
        </div>
        <h2 className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-stone-100 drop-shadow-xs">
          {tr('Vedic Astrology & Spiritual Platform', 'வேத ஜோதிடம் & ஆன்மீக தளம்', 'वैदिक ज्योतिष एवं आध्यात्मिक मंच')}
        </h2>
        <p className="text-[11px] text-slate-500 dark:text-stone-400">
          {tr('Integrated Portal for Clients, Astrologers, Vendors & JIT Admin', 'வாடிக்கையாளர்கள், ஜோதிடர்கள் & வணிகர்களுக்கான ஒருங்கிணைந்த போர்ட்டல்')}
        </p>
      </div>

      {/* VIEW MODE 1: STANDARD LOGIN */}
      {viewMode === 'login' && (
        <>
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100/90 dark:bg-stone-900/90 backdrop-blur-sm p-1 rounded-xl border border-slate-200/80 dark:border-stone-800 shadow-xs">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRole(r.id);
                    setError('');
                  }}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 shadow-xs border border-slate-300/80 dark:border-stone-700'
                      : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100 hover:bg-white/60 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? r.color : 'text-slate-400'}`} />
                  <span className="truncate">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Login Box with Glassmorphism & Depth */}
          <div className="bg-white/92 dark:bg-[#1A1513]/92 backdrop-blur-md border border-amber-900/15 dark:border-amber-500/25 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden transition-all">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-stone-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>{tr('Sign in as', 'உள்நுழைக:')}</span>
                <span className="text-amber-700 dark:text-amber-400 capitalize font-extrabold">{selectedRole}</span>
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                {selectedRole === 'company'
                  ? tr('Super Admin / Admin ID', 'சூப்பர் அட்மின் / அட்மின் ID')
                  : tr('Username = Mobile Number', 'பயனர்பெயர் = மொபைல் எண்')}
              </span>
            </div>

            {sessionExpiredNotice && (
              <div className="mb-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs p-2.5 rounded-xl font-medium flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span className="text-[11px]">{sessionExpiredNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={clearSessionExpiredNotice}
                  className="text-amber-700 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-100 font-bold p-1 rounded-md transition-colors cursor-pointer shrink-0 text-xs"
                  title={tr('Dismiss', 'அகற்று')}
                >
                  ✕
                </button>
              </div>
            )}

            {error && (
              <div className="mb-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs p-2.5 rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="text-[11px]">{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1 text-[11px]">
                  {selectedRole === 'company'
                    ? tr('Admin Username / Mobile *', 'அட்மின் பயனர்பெயர் / மொபைல் *')
                    : tr('Mobile Number (Username) *', 'மொபைல் எண் (பயனர்பெயர்) *')}
                </label>
                {selectedRole === 'company' ? (
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder={tr('Username or mobile (e.g. jit_admin)', 'பயனர்பெயர் அல்லது மொபைல் (jit_admin)')}
                      className="w-full bg-slate-50 dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-xs"
                    />
                  </div>
                ) : (
                  <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-stone-700 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-slate-50 dark:bg-stone-900 transition-all">
                    <span className="inline-flex items-center px-2.5 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold border-r border-slate-300 dark:border-stone-700 select-none text-[11px] tracking-wider">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={14}
                      value={mobile}
                      onChange={(e) => setMobile(clean10DigitMobile(e.target.value))}
                      onPaste={(e) => {
                        e.preventDefault();
                        setMobile(clean10DigitMobile(e.clipboardData.getData('text')));
                      }}
                      placeholder="----------"
                      className="w-full bg-transparent px-3 py-2 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden font-mono text-xs tracking-wider font-bold"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-stone-300 font-bold text-[11px]">
                    {tr('Password *', 'கடவுச்சொல் *')}
                  </label>
                  {/* FORGOT PASSWORD LINK */}
                  <button
                    type="button"
                    onClick={handleOpenForgot}
                    className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <KeyRound className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                    <span>{tr('Forgot Password?', 'கடவுச்சொல் மறந்துவிட்டதா?', 'पासवर्ड भूल गए?')}</span>
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tr('Enter password', 'கடவுச்சொல்லை உள்ளிடவும்')}
                    className="w-full bg-slate-50 dark:bg-stone-900 border border-slate-300 dark:border-stone-700 rounded-xl pl-9 pr-10 py-2 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-stone-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm mt-1"
              >
                {isLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{tr('Sign In to Astrojit', 'அஸ்ட்ரோஜித்தில் உள்நுழைக')}</span>
              </button>
            </form>

            {selectedRole !== 'company' && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-stone-800 text-center text-[11px] text-slate-500 dark:text-stone-400">
                {tr("Don't have an account yet?", 'இன்னும் கணக்கு இல்லையா?')}{' '}
                <button
                  type="button"
                  onClick={() => onSwitchToRegister(selectedRole)}
                  className="text-amber-700 dark:text-amber-400 hover:underline font-bold cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>{tr('Register as', 'பதிவு செய்க:')} {selectedRole}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW MODE 2: FORGOT PASSWORD RECOVERY WORKFLOW */}
      {viewMode === 'forgot' && (
        <div className="bg-white dark:bg-[#1E1815] border-2 border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-lg space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-xl">
                <KeyRound className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-stone-100">
                  {tr('Password Recovery', 'கடவுச்சொல் மீட்டெடுப்பு', 'पासवर्ड पुनर्प्राप्ति')}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-stone-400">
                  {tr('Reset your account password securely', 'உங்கள் கணக்கின் கடவுச்சொல்லை பாதுகாப்பாக மீட்டமைக்கவும்')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-stone-200 hover:bg-slate-100 dark:hover:bg-stone-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{tr('Back', 'பின்செல்')}</span>
            </button>
          </div>

          {/* Error / Success Notifications */}
          {forgotError && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{forgotError}</span>
            </div>
          )}

          {forgotSuccess && forgotStep !== 3 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs p-3 rounded-xl font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          {/* STEP 1: Verify Mobile Number & Role */}
          {forgotStep === 1 && (
            <form onSubmit={handleVerifyMobile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1">
                  {tr('Select Account Role', 'கணக்கு வகையைத் தேர்வு செய்க')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setForgotRole(r.id)}
                      className={`p-2 rounded-xl font-bold text-xs border transition-all cursor-pointer flex items-center gap-1.5 justify-center ${
                        forgotRole === r.id
                          ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border-amber-400 shadow-2xs'
                          : 'bg-slate-50 dark:bg-stone-900/70 text-slate-600 dark:text-stone-400 border-slate-200 dark:border-stone-700 hover:bg-slate-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <r.icon className="w-3.5 h-3.5" />
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1">
                  {forgotRole === 'company'
                    ? tr('Company Username *', 'நிறுவன பயனர்பெயர் *')
                    : tr('Registered Mobile Number *', 'பதிவு செய்யப்பட்ட மொபைல் எண் *')}
                </label>
                {forgotRole === 'company' ? (
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={forgotMobile}
                      onChange={(e) => setForgotMobile(e.target.value)}
                      placeholder="jit_admin"
                      className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                ) : (
                  <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-stone-600 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 bg-slate-50 dark:bg-stone-900/70 transition-all">
                    <span className="inline-flex items-center px-3 bg-amber-500/10 text-amber-900 font-bold border-r border-slate-300 dark:border-stone-600 select-none text-xs tracking-wider">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={14}
                      value={forgotMobile}
                      onChange={(e) => setForgotMobile(clean10DigitMobile(e.target.value))}
                      onPaste={(e) => {
                        e.preventDefault();
                        setForgotMobile(clean10DigitMobile(e.clipboardData.getData('text')));
                      }}
                      placeholder="----------"
                      className="w-full bg-transparent px-3 py-2.5 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden font-mono text-sm tracking-wider font-bold"
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  {tr('We will send a 4-digit verification code to verify your identity.', 'உங்கள் அடையாளத்தை சரிபார்க்க 4 இலக்க ஓடிபி குறியீடு உருவாக்கப்படும்.')}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>{tr('Verify Account & Generate OTP', 'கணக்கை சரிபார்த்து ஓடிபி பெறுக')}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter Verification OTP & Set New Password */}
          {forgotStep === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
              {/* Account badge */}
              {verifiedUserInfo && (
                <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider block">
                      {tr('Verified Account', 'சரிபார்க்கப்பட்ட கணக்கு')}
                    </span>
                    <strong className="text-slate-900 dark:text-stone-100 text-sm">{verifiedUserInfo.name}</strong>
                    <span className="text-slate-500 dark:text-stone-400 ml-1.5 font-mono">({verifiedUserInfo.maskedMobile})</span>
                  </div>
                  <span className="text-xs bg-amber-200/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 font-black px-2 py-0.5 rounded-full">
                    {forgotRole}
                  </span>
                </div>
              )}

              {/* OTP Display (demo — no SMS gateway yet) */}
              {forgotDemoOtp && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                  <span className="text-amber-700 dark:text-amber-400 font-bold text-xs">Your OTP:</span>
                  <span className="font-mono font-black text-lg text-amber-900 dark:text-amber-300 tracking-widest">{forgotDemoOtp}</span>
                  <span className="text-[10px] text-amber-600 ml-auto">(valid 10 min)</span>
                </div>
              )}

              {/* OTP Field */}
              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1">
                  {tr('Verification Code (OTP) *', 'சரிபார்ப்புக் குறியீடு (OTP) *')}
                </label>
                <input
                  type="text"
                  required
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  placeholder="Enter 4-digit verification code"
                  className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono font-bold tracking-widest text-center text-sm"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1">
                  {tr('New Password (min 6 characters) *', 'புதிய கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்) *')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl pl-9 pr-10 py-2.5 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-slate-700 dark:text-stone-300 font-bold block mb-1">
                  {tr('Confirm New Password *', 'புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும் *')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-stone-800/80 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 rounded-xl font-bold transition-all cursor-pointer text-xs"
                >
                  {tr('Back', 'பின்செல்')}
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{tr('Confirm & Reset Password', 'கடவுச்சொல்லை மாற்று')}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {forgotStep === 3 && (
            <div className="text-center py-4 space-y-3.5">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/45 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-stone-100">
                  {tr('Password Successfully Reset!', 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!', 'पासवर्ड सफलतापूर्वक बदल गया!')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                  {tr('Your new password is now active. You can immediately sign in with your updated credentials.', 'உங்கள் புதிய கடவுச்சொல் செயல்படுத்தப்பட்டுள்ளது. இப்போது நீங்கள் உள்நுழையலாம்.')}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <span>{tr('Sign In with New Password', 'புதிய கடவுச்சொல்லுடன் உள்நுழைக')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
