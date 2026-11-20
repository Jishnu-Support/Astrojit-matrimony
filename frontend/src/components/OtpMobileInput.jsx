import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import { API } from '../api';

export default function OtpMobileInput({
  mobile,
  setMobile,
  isVerified,
  setIsVerified,
  role = 'client',
  theme = 'amber',
  required = true,
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }
  const [demoOtp, setDemoOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // If user edits mobile number after verification, reset verified state
  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setMobile(val);
    if (isVerified) {
      setIsVerified(false);
      setOtpSent(false);
      setOtp('');
      setFeedback(null);
    }
  };

  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      setFeedback({ type: 'error', text: 'Please enter a valid 10-digit mobile number first.' });
      return;
    }
    setIsSending(true);
    setFeedback(null);
    try {
      const res = await API.sendRegisterOtp({ mobile, role });
      setOtpSent(true);
      setDemoOtp(res.demoOtp || '');
      setCountdown(60);
      setFeedback({
        type: 'success',
        text: res.message || `OTP sent to +91 ${mobile}`,
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to send OTP.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setFeedback({ type: 'error', text: 'Please enter the verification OTP code.' });
      return;
    }
    setIsVerifying(true);
    setFeedback(null);
    try {
      await API.verifyRegisterOtp({ mobile, otp });
      setIsVerified(true);
      setFeedback({ type: 'success', text: 'Mobile number verified successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Invalid OTP code. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const borderFocusClass =
    theme === 'indigo'
      ? 'focus:border-indigo-500'
      : theme === 'emerald'
      ? 'focus:border-emerald-500'
      : 'focus:border-amber-500';

  const accentColorClass =
    theme === 'indigo'
      ? 'text-indigo-600'
      : theme === 'emerald'
      ? 'text-emerald-600'
      : 'text-amber-600';

  const btnBgClass =
    theme === 'indigo'
      ? 'bg-indigo-600 hover:bg-indigo-700'
      : theme === 'emerald'
      ? 'bg-emerald-600 hover:bg-emerald-700'
      : 'bg-amber-600 hover:bg-amber-700';

  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-slate-700 font-bold flex items-center gap-1">
            <Phone className={`w-3.5 h-3.5 ${accentColorClass}`} /> Mobile Number (Username) *
          </label>
          {isVerified ? (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified (Username)
            </span>
          ) : (
            <span className="text-[10px] text-amber-700 font-medium">
              Mobile Number = Username
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs select-none">
              +91
            </span>
            <input
              type="tel"
              name="mobile"
              value={mobile}
              onChange={handleMobileChange}
              required={required}
              placeholder="10-digit mobile number (Username)"
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-3 py-2 text-slate-900 font-mono font-bold focus:outline-none ${borderFocusClass}`}
            />
          </div>

          {!isVerified && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending || countdown > 0 || mobile.length !== 10}
              className={`px-3.5 py-2 rounded-xl text-white font-bold text-xs transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${btnBgClass}`}
            >
              {isSending ? (
                'Sending...'
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : otpSent ? (
                'Resend OTP'
              ) : (
                'Send OTP'
              )}
            </button>
          )}
        </div>
      </div>

      {/* OTP Input and Verify Button when OTP is sent & not yet verified */}
      {otpSent && !isVerified && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <label className="text-slate-700 font-bold flex items-center gap-1 text-[11px]">
              <KeyRound className={`w-3.5 h-3.5 ${accentColorClass}`} /> Enter Verification OTP *
            </label>
            {demoOtp && (
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                OTP: {demoOtp}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className={`flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold tracking-widest text-center focus:outline-none ${borderFocusClass}`}
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.length < 4}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}

      {/* Status Feedback Message */}
      {feedback && (
        <div
          className={`p-2 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}
