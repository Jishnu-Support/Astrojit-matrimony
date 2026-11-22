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
*DOB:* ${client.dob} | ${client.dobTime12 || client.dobTime}
*Place:* ${client.dobPlace || client.nativePlace}${client.coordinates ? `\n*Coordinates:* ${client.coordinates}` : ''}
*Rasi Star Basis:* ${client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun' ? '☀️ Sun Star (Surya Nakshatra)' : '🌙 Moon Star (Chandra Nakshatra)'}
*Star (Nakshatra):* ${astrologicalSnapshot.nakshatra || 'N/A'} (Pada ${astrologicalSnapshot.pada || 1})
*Rashi (${client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun' ? 'Surya Rashi' : 'Chandra Rashi'}):* ${astrologicalSnapshot.moonSign || 'N/A'}
*Lagna:* ${astrologicalSnapshot.lagna || 'N/A'}
*Lagna Subha / Pavar:* ${astrologicalSnapshot.lagnaSubhas || ''}${astrologicalSnapshot.lagnaPapas ? ' / ' + astrologicalSnapshot.lagnaPapas : ''}

----------------------------------------
🔐 *YOUR ASTROJIT LOGIN CREDENTIALS*
You can log in to view your complete Certified Vedic Horoscope Dossier, Daily Panchangam, and Matrimony services:

*Portal URL:* ${credentials.portalUrl || 'http://localhost:3000/#/client-login'}
*Username (Mobile):* ${credentials.username || client.mobile}
*Temporary Password:* ${credentials.initialPassword || 'Astro@123'}

_Please keep your credentials safe. You can change your password upon your first login._
Sarve Bhavantu Sukhinah • Shubham Bhavatu! 🙏`;
    return encodeURIComponent(text);
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = (client.mobile || '').replace(/[^0-9]/g, '');
    const phoneParam = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://api.whatsapp.com/send?phone=${phoneParam}&text=${generateWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  const handleCopyCredentials = () => {
    const text = `Astrojit Login Credentials:
Portal: ${credentials.portalUrl || 'http://localhost:3000/#/client-login'}
Username (Mobile): ${credentials.username || client.mobile}
Password: ${credentials.initialPassword || 'Astro@123'}
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
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
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
          className="p-5 sm:p-7 overflow-y-auto space-y-4 bg-[#FAF7F2] font-serif text-slate-900 print:p-4 print:m-0 print:bg-white print:overflow-visible"
        >
          {/* Header Plaque */}
          <div className="border-2 border-slate-900 rounded-2xl p-4 sm:p-5 bg-white shadow-xs space-y-3.5 print:p-3.5 print:space-y-2.5 print:border-slate-900 print:shadow-none print:break-inside-avoid">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-3 gap-3 print:flex-row print:items-center print:pb-2 print:gap-2">
              <div className="flex items-center gap-2.5">
                <Logo size="sm" showTagline={true} />
              </div>

              {/* Astrologer Association Header */}
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 print:border-none print:pt-0">
                <div className="flex items-center sm:justify-end gap-1.5 text-amber-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{astrologer.association || ''}</span>
                </div>
                <p className="text-xs font-black text-slate-950">
                  {astrologer.name || ''}
                </p>
                <p className="text-[11px] text-slate-600 print:text-[10px]">
                  Ref Code: <strong className="font-mono text-indigo-700 font-bold">{astrologer.referralCode || ''}</strong> {astrologer.mobile ? `• Ph: ${astrologer.mobile}` : ''}
                </p>
                {astrologer.officeAddress && (
                  <p className="text-[10px] text-slate-500 max-w-xs sm:ml-auto print:hidden">
                    {astrologer.officeAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Receipt Title & Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 gap-2 print:flex-row print:items-center print:p-2 print:gap-1">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900 block font-sans">
                  Official Client Registration Acknowledgement
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-950 print:text-xs">
                  ग्राहक पंजीकरण पावती / வாடிக்கையாளர் பதிவு சான்றிதழ்
                </span>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex items-center sm:justify-end gap-2">
                  <span className="text-[11px] font-bold text-slate-600">Client Code:</span>
                  <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono font-black text-sm print:text-xs rounded-lg shadow-xs">
                    {clientCode}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Receipt: <strong className="font-mono">{receiptNumber}</strong> • {formattedDate}
                </p>
              </div>
            </div>

            {/* Client Particulars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3.5 print:gap-2.5 text-xs font-serif pt-1 print:pt-0">
              {/* Personal Details */}
              <div className="border border-slate-300 rounded-xl p-3 print:p-2 bg-slate-50/50 space-y-2 print:space-y-1">
                <h4 className="font-sans font-bold text-slate-950 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>Native Personal & Family Particulars</span>
                </h4>
                <div className="space-y-1.5 print:space-y-0.5 print:text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Native Name:</span>
                    <span className="font-black text-slate-950">{client.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gender:</span>
                    <span className="font-bold text-slate-900 capitalize">{client.gender || 'Male'}</span>
                  </div>
                  {client.fatherName && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Father's Name:</span>
                      <span className="font-bold text-slate-900">{client.fatherName}</span>
                    </div>
                  )}
                  {client.motherName && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mother's Name:</span>
                      <span className="font-bold text-slate-900">{client.motherName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mobile (Login ID):</span>
                    <span className="font-mono font-bold text-slate-950">{client.mobile}</span>
                  </div>
                  {client.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-mono text-slate-800">{client.email}</span>
                    </div>
                  )}
                  {client.gotra && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gotra:</span>
                      <span className="font-bold text-slate-900">{client.gotra}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Astrological Coordinates */}
              <div className="border border-slate-300 rounded-xl p-3 print:p-2 bg-slate-50/50 space-y-2 print:space-y-1">
                <h4 className="font-sans font-bold text-slate-950 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Birth & Vedic Astrology Particulars</span>
                </h4>
                <div className="space-y-1.5 print:space-y-0.5 print:text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date of Birth:</span>
                    <span className="font-mono font-bold text-slate-950">{client.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time of Birth:</span>
                    <span className="font-mono font-bold text-slate-950">{client.dobTime12 || client.dobTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Place of Birth:</span>
                    <span className="font-bold text-slate-900">{client.dobPlace || client.nativePlace}</span>
                  </div>
                  {(client.coordinates || client.latitude) && (
                    <div className="flex justify-between items-center text-xs bg-amber-100/60 p-1.5 print:p-1 rounded-lg border border-amber-200">
                      <span className="text-amber-900 font-semibold">📍 Geo Coordinates:</span>
                      <span className="font-mono font-bold text-amber-950">
                        {client.coordinates || `${client.latitude} , ${client.longitude}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs bg-indigo-50/70 p-1.5 print:p-1 rounded-lg border border-indigo-100">
                    <span className="text-indigo-900 font-semibold">Rasi Calculation Basis:</span>
                    <span className="font-bold text-indigo-950">
                      {(client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun')
                        ? '☀️ Sun Star (Surya Nakshatra)'
                        : '🌙 Moon Star (Chandra Nakshatra)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {(client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun') ? 'Sun Star (Surya Nakshatra):' : 'Janma Nakshatra (Moon Star):'}
                    </span>
                    <span className="font-bold text-amber-900">
                      {safeText(astrologicalSnapshot.nakshatra, 'Magha')} ({safeText(astrologicalSnapshot.pada, 1)} Pada)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {(client.starBasis === 'sun' || astrologicalSnapshot.starBasis === 'sun') ? 'Rashi (Surya Rashi):' : 'Rashi (Moon Sign):'}
                    </span>
                    <span className="font-bold text-slate-950">{safeText(astrologicalSnapshot.moonSign, 'Leo')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lagna (Ascendant):</span>
                    <span className="font-bold text-slate-950">{safeText(astrologicalSnapshot.lagna, 'Leo')}</span>
                  </div>
                  {(astrologicalSnapshot.lagnaSubhas || astrologicalSnapshot.lagnaSubhaPavar) && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Lagna Subha / Pavar:</span>
                      <span className="font-bold text-slate-900">
                        <span className="text-emerald-800">{astrologicalSnapshot.lagnaSubhas}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-rose-800">{astrologicalSnapshot.lagnaPapas}</span>
                      </span>
                    </div>
                  )}
                  {astrologicalSnapshot.dashaBalance && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dasha Balance at Birth:</span>
                      <span className="font-mono text-slate-900 font-bold">{formatDashaBalance(astrologicalSnapshot.dashaBalance)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* HIGHLIGHTED CLIENT PORTAL LOGIN CREDENTIALS CARD */}
            <div className="border-2 border-dashed border-amber-600 bg-amber-50/80 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden print:p-2.5 print:space-y-1.5 print:rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-300 pb-2 print:pb-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-600 text-white rounded-lg shadow-xs">
                    <Lock className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-sans font-black text-sm text-slate-950 tracking-tight">
                      CLIENT PORTAL LOGIN CREDENTIALS
                    </h4>
                    <p className="text-[10px] text-amber-900 font-sans">
                      Official credentials to access Astrojit Online Kundli & Panchangam Portal
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="print:hidden px-3 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPass ? 'Copied!' : 'Copy Login Credentials'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-3 print:gap-2 text-xs font-sans">
                <div className="bg-white p-3 print:p-2 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Web Portal URL</span>
                  <a
                    href={credentials.portalUrl || 'http://localhost:3000/#/client-login'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-indigo-700 hover:underline text-xs flex items-center gap-1 mt-0.5 truncate"
                  >
                    <span>{credentials.portalUrl || 'http://localhost:3000/#/client-login'}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 print:hidden" />
                  </a>
                </div>

                <div className="bg-white p-3 print:p-2 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Username / Registered Mobile</span>
                  <span className="font-mono font-black text-slate-950 text-sm print:text-xs mt-0.5 block">
                    {credentials.username || client.mobile}
                  </span>
                </div>

                <div className="bg-white p-3 print:p-2 rounded-xl border border-amber-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Initial Temporary Password</span>
                  <span className="font-mono font-black text-emerald-800 text-sm print:text-xs mt-0.5 block tracking-wider">
                    {credentials.initialPassword || 'Astro@123'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] print:text-[10px] text-slate-600 italic font-serif">
                * Note: The client can log in anytime to access panchangam, matchmaking, spiritual shop, and consultation history. For security, please advise the native to update their password upon first login.
              </p>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-3 print:pt-2 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-end sm:items-center text-xs text-slate-600 gap-4 print:flex-row print:items-center print:gap-2">
              <div>
                <p className="font-bold text-slate-800 font-sans">Astrojit Certified Astrological Network</p>
                <p className="text-[10px] text-slate-500 font-serif">
                  ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः • शुभं भवतु
                </p>
              </div>

              <div className="text-right">
                <div className="w-40 border-b border-slate-400 pb-1 mb-1 text-center font-serif text-slate-800 font-bold italic text-xs">
                  {astrologer.name || ''}
                </div>
                <span className="text-[10px] text-slate-500 block">Authorized Astrologer Seal & Signature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden when printing) */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
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
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
