import React, { useState } from 'react';
import {
  Printer,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Lock,
  FileText,
  Key
} from 'lucide-react';
import { printElementById } from '../utils/printHelper';
import Logo from './Logo';

export default function ClientRegistrationReceiptModal({
  receipt,
  data,
  onClose
}) {
  const [copied, setCopied] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const rawReceipt = receipt || data?.receipt || data;
  if (!rawReceipt) return null;

  const {
    receiptNumber = 'REC-' + Date.now().toString().slice(-6),
    clientCode = rawReceipt.clientCode || rawReceipt.client?.clientCode || 'CLI-1001',
    registrationDate = rawReceipt.registrationDate || new Date().toISOString(),
    astrologer = rawReceipt.astrologer || {},
    client = rawReceipt.client || {},
    astrologicalSnapshot = rawReceipt.astrologicalSnapshot || rawReceipt.client?.astrologicalSnapshot || {},
    credentials = rawReceipt.credentials || {
      portalUrl: rawReceipt.loginUrl || `${window.location.origin}/login`,
      username: rawReceipt.client?.mobile || '',
      initialPassword: rawReceipt.plainPassword || 'Astro@123'
    }
  } = rawReceipt;

  const formatDashaBalance = (dbVal) => {
    if (!dbVal) return '';
    if (typeof dbVal === 'string') return dbVal;
    if (typeof dbVal === 'object') {
      return dbVal.textEn || dbVal.textTa || `${dbVal.lord?.nameEn || dbVal.lord?.nameTa || ''} ${dbVal.years || 0}y ${dbVal.months || 0}m ${dbVal.days || 0}d`;
    }
    return String(dbVal);
  };

  const safeText = (val, fallback = '') => {
    if (val === null || val === undefined) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') return val.textEn || val.textTa || val.en || val.ta || val.name || fallback;
    return String(val);
  };

  const formattedDate = new Date(registrationDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handlePrint = () => {
    printElementById('printable-client-receipt-slip', `Registration_Slip_${clientCode || 'Client'}`);
  };

  const portalUrl = (credentials.portalUrl && !credentials.portalUrl.includes(':3000'))
    ? credentials.portalUrl
    : `${window.location.origin}/login`;

  const generateWhatsAppMessage = () => {
    const text = `🕉️ *ASTROJIT VEDIC ASTROLOGY - CLIENT REGISTRATION ACKNOWLEDGEMENT*

*Registration Receipt No:* ${receiptNumber}
*Client Registration Code:* ${clientCode}
*Date:* ${formattedDate}

*Astrologer:* ${astrologer.name || ''}
*Astrologer Referral Code:* ${astrologer.referralCode || ''}
*Association:* ${astrologer.association || ''}
*Astrologer Contact:* ${astrologer.mobile || ''}

----------------------------------------
👤 *CLIENT DETAILS*
*Name:* ${client.name}
*DOB:* ${client.dob} | ${client.dobTime12 || client.dobTime || ''}
*Place:* ${client.dobPlace || client.nativePlace || ''}${client.coordinates ? `\n*Coordinates:* ${client.coordinates}` : ''}
*Rasi Star Basis:* ${client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun' ? '☀️ Sun Star (Surya Nakshatra)' : '🌙 Moon Star (Chandra Nakshatra)'}
*Star (Nakshatra):* ${astrologicalSnapshot.nakshatra || 'N/A'} (Pada ${astrologicalSnapshot.pada || 1})
*Rashi (${client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun' ? 'Surya Rashi' : 'Chandra Rashi'}):* ${astrologicalSnapshot.moonSign || 'N/A'}
*Lagna:* ${astrologicalSnapshot.lagna || 'N/A'}
*Lagna Subha / Pavar:* ${astrologicalSnapshot.lagnaSubhas || ''}${astrologicalSnapshot.lagnaPapas ? ' / ' + astrologicalSnapshot.lagnaPapas : ''}

----------------------------------------
🔐 *YOUR ASTROJIT LOGIN CREDENTIALS*
You can log in to view your complete Certified Vedic Horoscope Dossier, Daily Panchangam, and Matrimony services:

*Portal URL:* ${portalUrl}
*Username (Mobile):* ${credentials.username || client.mobile}
*Temporary Password:* ${credentials.initialPassword || rawReceipt.plainPassword || 'Astro@123'}

_Please keep your credentials safe. You can change your password upon your first login._
Sarve Bhavantu Sukhinah • Shubham Bhavatu! 🙏`;
    return encodeURIComponent(text);
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = (client.mobile || credentials.username || '').replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  const handleCopyCredentials = () => {
    const text = `Astrojit Login Credentials:
Portal: ${portalUrl}
Username (Mobile): ${credentials.username || client.mobile}
Password: ${credentials.initialPassword || rawReceipt.plainPassword || 'Astro@123'}
Client Code: ${clientCode}`;
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleCopyAll = () => {
    const text = decodeURIComponent(generateWhatsAppMessage());
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1815] rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-stone-700 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-4 sm:p-5 flex justify-between items-center print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-600/50 rounded-xl border border-amber-400/30">
              <FileText className="w-5 h-5 text-amber-200" />
            </span>
            <div>
              <h3 className="font-black text-sm sm:text-base tracking-wide flex items-center gap-2">
                <span>Client Registration Acknowledgement</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  OFFICIAL
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/90">
                Code: <strong className="text-white font-mono">{clientCode}</strong> • Login Credentials Ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Certificate Container */}
        <div
          id="printable-client-receipt-slip"
          className="p-5 sm:p-7 overflow-y-auto space-y-4 bg-[#FAF7F2] font-serif text-slate-900 dark:text-stone-100 print:p-4 print:m-0 print:bg-white print:overflow-visible"
        >
          {/* Header Plaque */}
          <div className="border-2 border-slate-900 rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#1E1815] shadow-xs space-y-3.5 print:p-3.5 print:space-y-2.5 print:border-slate-900 print:shadow-none print:break-inside-avoid">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-3 gap-3 print:flex-row print:items-center print:pb-2 print:gap-2">
              <div className="flex items-center gap-2.5">
                <Logo size="sm" showTagline={true} />
              </div>

              {/* Astrologer Association Header */}
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-stone-700 print:border-none print:pt-0">
                <div className="flex items-center sm:justify-end gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{astrologer.association || ''}</span>
                </div>
                <p className="text-xs font-black text-slate-950 dark:text-stone-50">
                  {astrologer.name || ''}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-stone-400 print:text-[10px]">
                  Ref Code: <strong className="font-mono text-indigo-700 dark:text-indigo-400 font-bold">{astrologer.referralCode || ''}</strong> {astrologer.mobile ? `• Ph: ${astrologer.mobile}` : ''}
                </p>
                {astrologer.officeAddress && (
                  <p className="text-[10px] text-slate-500 dark:text-stone-400 max-w-xs sm:ml-auto print:hidden">
                    {astrologer.officeAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Receipt Title & Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/50 gap-2 print:flex-row print:items-center print:p-2 print:gap-1">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900 dark:text-amber-300 block font-sans">
                  Official Client Registration Acknowledgement
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-stone-50 print:text-xs">
                  ग्राहक पंजीकरण पावती / வாடிக்கையாளர் பதிவு சான்றிதழ்
                </span>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex items-center sm:justify-end gap-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-stone-400">Client Code:</span>
                  <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono font-black text-sm print:text-xs rounded-lg shadow-xs">
                    {clientCode}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-stone-400 mt-0.5">
                  Receipt: <strong className="font-mono">{receiptNumber}</strong> • {formattedDate}
                </p>
              </div>
            </div>

            {/* Client Particulars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5 print:gap-2.5 text-xs font-serif pt-1 print:pt-0">
              {/* Personal Details */}
              <div className="border border-slate-300 dark:border-stone-600 rounded-xl p-3 print:p-2 bg-slate-50/50 dark:bg-stone-900/70 space-y-2 print:space-y-1">
                <h4 className="font-sans font-bold text-slate-950 dark:text-stone-50 border-b border-slate-200 dark:border-stone-700 pb-1 flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Native Personal & Family Particulars</span>
                </h4>
                <div className="space-y-1.5 print:space-y-0.5 print:text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Native Name:</span>
                    <span className="font-black text-slate-950 dark:text-stone-50">{client.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Gender:</span>
                    <span className="font-bold text-slate-900 dark:text-stone-100 capitalize">{client.gender || 'Male'}</span>
                  </div>
                  {client.fatherName && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Father's Name:</span>
                      <span className="font-bold text-slate-900 dark:text-stone-100">{client.fatherName}</span>
                    </div>
                  )}
                  {client.motherName && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Mother's Name:</span>
                      <span className="font-bold text-slate-900 dark:text-stone-100">{client.motherName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Mobile (Login ID):</span>
                    <span className="font-mono font-bold text-slate-950 dark:text-stone-50">{client.mobile}</span>
                  </div>
                  {client.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Email:</span>
                      <span className="font-mono text-slate-800 dark:text-stone-200">{client.email}</span>
                    </div>
                  )}
                  {client.gotra && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Gotra:</span>
                      <span className="font-bold text-slate-900 dark:text-stone-100">{client.gotra}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Astrological Coordinates */}
              <div className="border border-slate-300 dark:border-stone-600 rounded-xl p-3 print:p-2 bg-slate-50/50 dark:bg-stone-900/70 space-y-2 print:space-y-1">
                <h4 className="font-sans font-bold text-slate-950 dark:text-stone-50 border-b border-slate-200 dark:border-stone-700 pb-1 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Birth & Vedic Astrology Particulars</span>
                </h4>
                <div className="space-y-1.5 print:space-y-0.5 print:text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Date of Birth:</span>
                    <span className="font-mono font-bold text-slate-950 dark:text-stone-50">{client.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Time of Birth:</span>
                    <span className="font-mono font-bold text-slate-950 dark:text-stone-50">{client.dobTime12 || client.dobTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Place of Birth:</span>
                    <span className="font-bold text-slate-900 dark:text-stone-100">{client.dobPlace || client.nativePlace}</span>
                  </div>
                  {(client.coordinates || client.latitude) && (
                    <div className="flex justify-between items-center text-xs bg-amber-100/60 dark:bg-amber-900/40 p-1.5 print:p-1 rounded-lg border border-amber-200 dark:border-amber-800/50">
                      <span className="text-amber-900 dark:text-amber-300 font-semibold">📍 Geo Coordinates:</span>
                      <span className="font-mono font-bold text-amber-950 dark:text-amber-200">
                        {client.coordinates || `${client.latitude} , ${client.longitude}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs bg-indigo-50/70 dark:bg-indigo-950/35 p-1.5 print:p-1 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-indigo-900 dark:text-indigo-300 font-semibold">Rasi Calculation Basis:</span>
                    <span className="font-bold text-indigo-950 dark:text-indigo-200">
                      {(client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun')
                        ? '☀️ Sun Star (Surya Nakshatra)'
                        : '🌙 Moon Star (Chandra Nakshatra)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">
                      {(client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun') ? 'Sun Star (Surya Nakshatra):' : 'Janma Nakshatra (Moon Star):'}
                    </span>
                    <span className="font-bold text-amber-900 dark:text-amber-300">
                      {safeText(astrologicalSnapshot.nakshatra, 'Magha')} ({safeText(astrologicalSnapshot.pada, 1)} Pada)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">
                      {(client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun') ? 'Rashi (Surya Rashi):' : 'Rashi (Moon Sign):'}
                    </span>
                    <span className="font-bold text-slate-950 dark:text-stone-50">{safeText(astrologicalSnapshot.moonSign, 'Leo')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-stone-400">Lagna (Ascendant):</span>
                    <span className="font-bold text-slate-950 dark:text-stone-50">{safeText(astrologicalSnapshot.lagna, 'Leo')}</span>
                  </div>
                  {(astrologicalSnapshot.lagnaSubhas || astrologicalSnapshot.lagnaSubhaPavar) && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-stone-400">Lagna Subha / Pavar:</span>
                      <span className="font-bold text-slate-900 dark:text-stone-100">
                        <span className="text-emerald-800 dark:text-emerald-300">{astrologicalSnapshot.lagnaSubhas}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-rose-800 dark:text-rose-300">{astrologicalSnapshot.lagnaPapas}</span>
                      </span>
                    </div>
                  )}
                  {astrologicalSnapshot.dashaBalance && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-stone-400">Dasha Balance at Birth:</span>
                      <span className="font-mono text-slate-900 dark:text-stone-100 font-bold">{formatDashaBalance(astrologicalSnapshot.dashaBalance)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* HIGHLIGHTED CLIENT PORTAL LOGIN CREDENTIALS CARD */}
            <div className="border-2 border-dashed border-amber-600 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden print:p-2.5 print:space-y-1.5 print:rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-300 dark:border-amber-700/60 pb-2 print:pb-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-600 text-white rounded-lg shadow-xs">
                    <Lock className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-sans font-black text-sm text-slate-950 dark:text-stone-50 tracking-tight">
                      CLIENT PORTAL LOGIN CREDENTIALS
                    </h4>
                    <p className="text-[10px] text-amber-900 dark:text-amber-300 font-sans">
                      Official credentials to access Astrojit Online Kundli & Panchangam Portal
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="print:hidden px-3 py-1 bg-white dark:bg-[#1E1815] hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPass ? 'Copied!' : 'Copy Login Credentials'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-3 print:gap-2 text-xs font-sans">
                <div className="bg-white dark:bg-[#1E1815] p-3 print:p-2 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-2xs">
                  <span className="text-[10px] text-slate-500 dark:text-stone-400 font-bold uppercase block">Web Portal URL</span>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-indigo-700 dark:text-indigo-400 hover:underline text-xs flex items-center gap-1 mt-0.5 truncate"
                  >
                    <span>{portalUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 print:hidden" />
                  </a>
                </div>

                <div className="bg-white dark:bg-[#1E1815] p-3 print:p-2 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-2xs">
                  <span className="text-[10px] text-slate-500 dark:text-stone-400 font-bold uppercase block">Username / Registered Mobile</span>
                  <span className="font-mono font-black text-slate-950 dark:text-stone-50 text-sm print:text-xs mt-0.5 block">
                    {credentials.username || client.mobile}
                  </span>
                </div>

                <div className="bg-white dark:bg-[#1E1815] p-3 print:p-2 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-2xs">
                  <span className="text-[10px] text-slate-500 dark:text-stone-400 font-bold uppercase block">Initial Temporary Password</span>
                  <span className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-sm print:text-xs mt-0.5 block tracking-wider">
                    {credentials.initialPassword || rawReceipt.plainPassword || 'Astro@123'}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Share Banner inside Receipt */}
              <div className="print:hidden bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📲</span>
                  <div>
                    <div className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                      Send Login Credentials Directly to Client via WhatsApp
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Recipient Mobile: <strong>{client.mobile || credentials.username}</strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send WhatsApp Now</span>
                </button>
              </div>

              <p className="text-[11px] print:text-[10px] text-slate-600 dark:text-stone-400 italic font-serif">
                * Note: The client can log in anytime to access panchangam, matchmaking, spiritual shop, and consultation history. For security, please advise the native to update their password upon first login.
              </p>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-3 print:pt-2 border-t border-slate-300 dark:border-stone-600 flex flex-col sm:flex-row justify-between items-end sm:items-center text-xs text-slate-600 dark:text-stone-400 gap-4 print:flex-row print:items-center print:gap-2">
              <div>
                <p className="font-bold text-slate-800 dark:text-stone-200 font-sans">Astrojit Certified Astrological Network</p>
                <p className="text-[10px] text-slate-500 dark:text-stone-400 font-serif">
                  ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः • शुभं भवतु
                </p>
              </div>

              <div className="text-right">
                <div className="w-40 border-b border-slate-400 pb-1 mb-1 text-center font-serif text-slate-800 dark:text-stone-200 font-bold italic text-xs">
                  {astrologer.name || ''}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-stone-400 block">Authorized Astrologer Seal & Signature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden when printing) */}
        <div className="bg-slate-100 dark:bg-stone-800/80 p-4 border-t border-slate-200 dark:border-stone-700 flex flex-wrap justify-between items-center gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 bg-white dark:bg-[#1E1815] hover:bg-slate-50 dark:hover:bg-stone-800 border border-slate-300 dark:border-stone-600 rounded-xl text-xs font-bold text-slate-700 dark:text-stone-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Slip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-stone-400 hover:bg-slate-200 dark:hover:bg-stone-700 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
