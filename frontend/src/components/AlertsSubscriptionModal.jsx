import React, { useState } from 'react';
import { Bell, Check, Sparkles, MessageCircle, ShieldCheck, Share2, Copy, ExternalLink } from 'lucide-react';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import Logo from './Logo';

export default function AlertsSubscriptionModal({ isOpen, onClose, panchang }) {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [receivePanchang, setReceivePanchang] = useState(true);
  const [receiveRahuKalam, setReceiveRahuKalam] = useState(true);
  const [receiveHoroscope, setReceiveHoroscope] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previewMsg, setPreviewMsg] = useState(null);
  const [directUrl, setDirectUrl] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.subscribeAlerts({
        mobile,
        receivePanchangam: receivePanchang,
        receiveRahuKalam,
        receiveHoroscopeTips: receiveHoroscope,
        lang,
      });

      setPreviewMsg(res.messagePreview);
      setDirectUrl(res.whatsappDirectUrl);
      setShareUrl(res.whatsappShareUrl);

      // Open WhatsApp directly in new tab/app
      if (res.whatsappDirectUrl) {
        window.open(res.whatsappDirectUrl, '_blank');
      }
    } catch (err) {
      alert('Subscription failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (previewMsg) {
      navigator.clipboard.writeText(previewMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleQuickShare = () => {
    let cleanPhone = (mobile || user?.mobile || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    const fallbackText = previewMsg || `🌟 Astrojit Daily Vedic Panchangam & Kundli\nDate: ${panchang?.formattedDate || new Date().toLocaleDateString()}\nVaara: ${panchang?.vaar?.name || ''}\nTithi: ${panchang?.tithi?.name || ''}\nNakshatra: ${panchang?.nakshatra?.name || ''}\nAbhijit Muhurat: ${panchang?.timings?.abhijitMuhurat || ''}\nRahu Kalam: ${panchang?.timings?.rahuKalam || ''}\nhttps://astrojit.com`;
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(fallbackText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(fallbackText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl my-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'ta' ? 'வாட்ஸ்அப் பஞ்சாங்க அறிவிப்புகள்' : lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಪಂಚಾಂಗ ಎಚ್ಚರಿಕೆಗಳು' : 'WhatsApp Daily Panchangam Alerts'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ta' ? 'தினசரி காலை பஞ்சாங்கம், அபிஜித் முகூர்த்தம் & இராகு கால எச்சரிக்கை' : lang === 'kn' ? 'ದೈನಂದಿನ ಬೆಳಗಿನ ಪಂಚಾಂಗ, ಅಭಿಜಿತ್ ಮುಹೂರ್ತ ಮತ್ತು ರಾಹು ಕಾಲದ ಮಾಹಿತಿ' : 'Instant morning Panchang, Abhijit Muhurat & Rahu alerts on your mobile'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        {previewMsg ? (
          <div className="mt-4 space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-emerald-900 font-bold">
                  {lang === 'ta' ? 'வாட்ஸ்அப் செய்தி தயாராக உள்ளது!' : lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ಸಿದ್ಧವಾಗಿದೆ!' : 'WhatsApp Dispatch Activated & Ready!'}
                </strong>
                <span>
                  {lang === 'ta' ? 'கீழே உள்ள பொத்தானை அழுத்தி வாட்ஸ்அப்பில் நேரடியாகத் திறக்கலாம்.' : lang === 'kn' ? 'ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ತಕ್ಷಣ ತೆರೆಯಿರಿ.' : 'Click below to open WhatsApp chat or share with family & friends.'}
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {directUrl && (
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'வாட்ஸ்அப்பில் திறக்கவும்' : lang === 'kn' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ' : 'Open in WhatsApp'}</span>
                </a>
              )}

              <a
                href={shareUrl || `https://api.whatsapp.com/send?text=${encodeURIComponent(previewMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-center"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'ta' ? 'வாட்ஸ்அப்பில் பகிரவும்' : lang === 'kn' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share to Any Chat/Group'}</span>
              </a>
            </div>

            {/* WhatsApp Message Preview UI */}
            <div className="bg-[#EFEAE2] border border-[#d1d7db] rounded-2xl p-4 text-xs font-sans shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                <div className="flex items-center gap-2">
                  <Logo size="xs" iconOnly={true} />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Astrojit Official Dispatch</div>
                    <div className="text-[10px] text-slate-500">Verified Service • Daily Panchangam</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? (lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (lang === 'ta' ? 'நகலெடு' : 'Copy Text')}</span>
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-xl text-slate-900 whitespace-pre-line leading-relaxed text-[11px] font-mono border-l-4 border-emerald-500 shadow-2xs max-h-56 overflow-y-auto">
                {previewMsg}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {lang === 'ta' ? 'மூடுக' : lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Done & Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 mt-3 text-xs">
            <div>
              <label className="text-slate-800 font-bold block mb-1">
                {lang === 'ta' ? 'வாட்ஸ்அப் மொபைல் எண் *' : lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *' : 'WhatsApp / SMS Mobile Number *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-semibold text-xs">+91</span>
                <input
                  type="tel"
                  required
                  value={mobile.length > 10 ? mobile.slice(-10) : mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {lang === 'ta' ? 'உங்கள் எண்ணுக்கு தினசரி காலை 6:00 மணிக்கு பஞ்சாங்கம் அனுப்பப்படும்' : lang === 'kn' ? 'ನಿಮ್ಮ ಸಂಖ್ಯೆಗೆ ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ 6:00 ಗಂಟೆಗೆ ಪಂಚಾಂಗ ತಲುಪಲಿದೆ' : 'Daily sunrise alert will be dispatched to this WhatsApp number'}
              </span>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-700 font-bold block text-[11px] uppercase tracking-wider">
                {lang === 'ta' ? 'அறிவிப்பு விருப்பங்களைத் தேர்ந்தெடுக்கவும்:' : lang === 'kn' ? 'ಎಚ್ಚರಿಕೆ ಆದ್ಯತೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ:' : 'Select Alert Preferences:'}
              </span>

              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={receivePanchang}
                  onChange={(e) => setReceivePanchang(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                />
                <span>{lang === 'ta' ? 'தினசரி காலை பஞ்சாங்கம் & திதி (காலை 06:00)' : lang === 'kn' ? 'ದೈನಂದಿನ ಬೆಳಗಿನ ಪಂಚಾಂಗ ಮತ್ತು ತಿಥಿ (ಬೆಳಿಗ್ಗೆ 06:00)' : 'Daily Morning Panchangam & Tithi at 06:00 AM'}</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={receiveRahuKalam}
                  onChange={(e) => setReceiveRahuKalam(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                />
                <span>{lang === 'ta' ? 'இராகு கால எச்சரிக்கை (தொடங்குவதற்கு 30 நிமிடங்களுக்கு முன்)' : lang === 'kn' ? 'ರಾಹು ಕಾಲ ಮುನ್ನೆಚ್ಚರಿಕೆ (30 ನಿಮಿಷಗಳ ಮೊದಲು)' : 'Rahu Kalam Pre-Warning (30 mins before onset)'}</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={receiveHoroscope}
                  onChange={(e) => setReceiveHoroscope(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                />
                <span>{lang === 'ta' ? 'சுப முகூர்த்தம் & நவரத்தின வழிகாட்டுதல்' : lang === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತ ಮತ್ತು ರತ್ನ ಸಲಹೆಗಳು' : 'Auspicious Abhijit Muhurat & Astrological Tips'}</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleQuickShare}
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'உடனடி பகிர்வு' : lang === 'kn' ? 'ತಕ್ಷಣ ಹಂಚಿಕೊಳ್ಳಿ' : 'Instant WhatsApp Share'}</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {t('cancelBtn') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                  <span>{lang === 'ta' ? 'வாட்ஸ்அப் எச்சரிக்கையை இயக்குக' : lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯಗೊಳಿಸಿ' : 'Activate Free WhatsApp Alerts'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
