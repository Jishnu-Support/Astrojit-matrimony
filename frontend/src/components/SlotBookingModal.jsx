import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  Video,
  MessageSquare,
  Building2,
  MapPin,
  Star,
  Users,
  AlertCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { API } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

const TOP_QUERY_AREAS = [
  { id: 'Horoscope', labelKey: 'qaHoroscope', label: 'Horoscope (Janma Kundli & Predictions)', icon: '🌟' },
  { id: 'Kundali Matching', labelKey: 'qaKundaliMatching', label: 'Kundali (Marriage / Matchmaking Review)', icon: '💍' },
  { id: 'Numerology', labelKey: 'qaNumerology', label: 'Numerology (Name & Life Path Balancing)', icon: '🔢' },
  { id: 'Vastu', labelKey: 'qaVastu', label: 'Vastu Shastra (Home, Office & Energy Alignment)', icon: '🏡' },
  { id: 'Career & Finance', labelKey: 'qaCareerFinance', label: 'Career, Business & Financial Growth', icon: '💼' },
  { id: 'Health & Longevity', labelKey: 'qaHealthLongevity', label: 'Health, Vitality & Medical Astrology', icon: '🩺' },
  { id: 'Muhurat Selection', labelKey: 'qaMuhuratSelection', label: 'Muhurat (Auspicious Dates for Ceremonies)', icon: '⏳' },
  { id: 'Gemstone & Remedies', labelKey: 'qaGemstoneRemedies', label: 'Gemstones, Mantras & Dosha Remedies', icon: '💎' },
];

export default function SlotBookingModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { lang, t } = useLang();
  const [astrologers, setAstrologers] = useState([]);
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null); // specific astrologer inside consultancy

  // Appointment Type: 'online' | 'offline' | 'chat'
  const [appointmentType, setAppointmentType] = useState('online');

  // Date and Slots
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isCustomSlot, setIsCustomSlot] = useState(false);
  const [customSlotTime, setCustomSlotTime] = useState('');

  // Query Area & Query to Ask
  const [queryArea, setQueryArea] = useState('Horoscope');
  const [clientQuery, setClientQuery] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      API.getAvailableAstrologers().then((data) => {
        setAstrologers(data);

        // Check if client is referred by a particular astrologer or consultancy
        const clientRefCode = (user?.astrologerReferralCode || '').toUpperCase().trim();
        let matchedAstro = null;
        let matchedMember = null;

        if (clientRefCode) {
          // Check direct astrologer / consultancy referral code
          matchedAstro = data.find((a) => (a.referralCode || '').toUpperCase() === clientRefCode);

          // If not direct, check if it matches a member in a consultancy
          if (!matchedAstro) {
            for (const a of data) {
              if (a.teamMembers && a.teamMembers.length > 0) {
                const mem = a.teamMembers.find((m) => (m.referralCode || '').toUpperCase() === clientRefCode);
                if (mem) {
                  matchedAstro = a;
                  matchedMember = mem;
                  break;
                }
              }
            }
          }
        }

        if (matchedAstro) {
          setSelectedAstro(matchedAstro);
          if (matchedMember) {
            setSelectedMember(matchedMember);
          } else if (matchedAstro.teamMembers && matchedAstro.teamMembers.length > 0) {
            // Default to first member or general
            setSelectedMember(matchedAstro.teamMembers[0]);
          } else {
            setSelectedMember(null);
          }
        } else if (data.length > 0) {
          setSelectedAstro(data[0]);
          if (data[0].teamMembers && data[0].teamMembers.length > 0) {
            setSelectedMember(data[0].teamMembers[0]);
          }
        }
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Determine current active slots
  const activeSlots =
    selectedMember?.availableSlots ||
    selectedAstro?.availableSlots ||
    ['10:00 AM', '11:30 AM', '04:00 PM', '06:30 PM'];

  const effectiveSlot = isCustomSlot ? customSlotTime : selectedSlot;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedAstro) {
      alert('Please select an astrologer or consultancy.');
      return;
    }
    if (!effectiveSlot) {
      alert('Please select or specify a consultation time slot.');
      return;
    }
    if (!clientQuery.trim()) {
      alert('Please enter your query to ask the astrologer.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        astrologerId: selectedAstro.id,
        astrologerName: selectedAstro.name,
        consultancyId: selectedAstro.type === 'company' ? selectedAstro.id : null,
        consultancyName: selectedAstro.type === 'company' ? selectedAstro.name : null,
        memberAstrologerId: selectedMember ? selectedMember.id : null,
        memberAstrologerName: selectedMember ? selectedMember.name : null,
        appointmentType,
        officeAddress: selectedAstro.officeAddress || selectedAstro.address || '',
        slotTime: effectiveSlot + (isCustomSlot ? ' (Requested Custom Time)' : ''),
        isCustomSlot,
        date: selectedDate,
        queryArea,
        consultationTopic: queryArea,
        clientQuery: clientQuery.trim(),
      };

      const res = await API.bookAppointment(payload);
      setBookedSuccess(res.appointment);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReferredAstro = (astro) => {
    const clientRefCode = (user?.astrologerReferralCode || '').toUpperCase().trim();
    if (!clientRefCode) return false;
    if ((astro.referralCode || '').toUpperCase() === clientRefCode) return true;
    if (astro.teamMembers?.some((m) => (m.referralCode || '').toUpperCase() === clientRefCode)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1815] border border-slate-200 dark:border-stone-700 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl my-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-stone-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> {t('modalBookConsultationTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-stone-400">
              {t('modalBookConsultationSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-stone-200 text-lg font-bold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {bookedSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/45 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl border-2 border-emerald-300 dark:border-emerald-700/60">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-stone-100">{t('bookingConfirmedSuccess')}</h4>
              <p className="text-xs text-slate-600 dark:text-stone-400 max-w-md mx-auto mt-1 leading-relaxed">
                Your appointment with{' '}
                <strong className="text-amber-800 dark:text-amber-300">
                  {bookedSuccess.memberAstrologerName
                    ? `${bookedSuccess.memberAstrologerName} (${bookedSuccess.astrologerName})`
                    : bookedSuccess.astrologerName}
                </strong>{' '}
                has been successfully scheduled.
              </p>
            </div>

            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">{t('bookingIdLabel')}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-stone-200">{bookedSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">{t('consultationTypeLabel')}</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase">{bookedSuccess.appointmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">{t('dateSlotLabel')}</span>
                <span className="font-bold text-slate-900 dark:text-stone-100">
                  {bookedSuccess.date} • {bookedSuccess.slotTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-stone-400">{t('queryAreaDisplayLabel')}</span>
                <span className="font-bold text-amber-900 dark:text-amber-300">{bookedSuccess.queryArea}</span>
              </div>
              {bookedSuccess.appointmentType === 'offline' && bookedSuccess.officeAddress && (
                <div className="pt-2 border-t border-amber-200 dark:border-amber-800/50">
                  <span className="text-slate-500 dark:text-stone-400 block mb-0.5">{t('officeAddressDisplayLabel')}</span>
                  <span className="font-medium text-slate-800 dark:text-stone-200">{bookedSuccess.officeAddress}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setBookedSuccess(null);
                onClose();
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              {t('bookingDoneBtn')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4 mt-3 text-xs">
            {/* 1. Astrologer / Consultancy Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-800 dark:text-stone-200 font-bold block">
                  {t('selectAstrologerFirm')}
                </label>
                {user?.astrologerReferralCode && (
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {t('yourReferralCode')} {user.astrologerReferralCode}
                  </span>
                )}
              </div>

              {/* Astrologers List / Selector */}
              <div className="space-y-2">
                {astrologers.map((astro) => {
                  const isReferred = isReferredAstro(astro);
                  const isSelected = selectedAstro?.id === astro.id;
                  return (
                    <div
                      key={astro.id}
                      onClick={() => {
                        setSelectedAstro(astro);
                        if (astro.teamMembers && astro.teamMembers.length > 0) {
                          setSelectedMember(astro.teamMembers[0]);
                        } else {
                          setSelectedMember(null);
                        }
                        setSelectedSlot('');
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-400 text-slate-900 dark:text-stone-100 shadow-sm ring-1 ring-amber-400'
                          : 'bg-white dark:bg-[#1E1815] border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-stone-100 text-xs sm:text-sm">
                              {astro.name}
                            </span>
                            {isReferred && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" /> {t('yourReferredAstrologer')}
                              </span>
                            )}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                astro.isOnline ? 'bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-stone-800/80 text-slate-500 dark:text-stone-400'
                              }`}
                            >
                              {astro.isOnline ? `● ${t('online')}` : t('offline')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-stone-400">
                            {astro.type === 'company' ? t('astrologicalFirm') : t('individualAstrologer')} • {t('expLabel')}:{' '}
                            {astro.experience?.toString().replace(/years?/gi, '').trim()} {t('yearsSuffix')}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-amber-600 bg-amber-600 text-white text-[10px]'
                                : 'border-slate-300 dark:border-stone-600'
                            }`}
                          >
                            {isSelected && '✓'}
                          </div>
                        </div>
                      </div>

                      {/* If Consultancy is selected: Option to select particular Astrologer in Consultancy */}
                      {isSelected && astro.teamMembers && astro.teamMembers.length > 0 && (
                        <div
                          className="mt-3 pt-3 border-t border-amber-200/80 dark:border-amber-800/50 bg-white/70 dark:bg-[#1E1815]/70 -mx-3 -mb-3 p-3 rounded-b-2xl space-y-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-[11px] text-slate-800 dark:text-stone-200 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                              {t('selectSpecialistWithin', 'Select Specialist within')} {astro.name}:
                            </label>
                            <span className="text-[10px] text-slate-500 dark:text-stone-400 font-medium">
                              {t('optionToChangeSpecialist', '(Option to change specialist anytime)')}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {astro.teamMembers.map((member) => {
                              const isMemSelected = selectedMember?.id === member.id;
                              const isMemReferred =
                                (user?.astrologerReferralCode || '').toUpperCase() ===
                                (member.referralCode || '').toUpperCase();
                              return (
                                <button
                                  type="button"
                                  key={member.id}
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setSelectedSlot('');
                                  }}
                                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                                    isMemSelected
                                      ? 'bg-amber-100/80 dark:bg-amber-900/40 border-amber-500 text-amber-950 dark:text-amber-200 font-bold shadow-2xs'
                                      : 'bg-white dark:bg-[#1E1815] border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] truncate">{member.name}</span>
                                    {isMemReferred && (
                                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600 shrink-0" />
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-500 dark:text-stone-400 block truncate font-normal">
                                    {member.title}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Type of Appointment: Online, Offline, In-Platform Chat */}
            <div>
              <label className="text-slate-800 dark:text-stone-200 font-bold block mb-1.5">
                {t('appointmentMode')} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Online */}
                <div
                  onClick={() => setAppointmentType('online')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex sm:flex-col items-center sm:items-start gap-2 ${
                    appointmentType === 'online'
                      ? 'bg-indigo-50 dark:bg-indigo-950/35 border-indigo-400 text-indigo-950 dark:text-indigo-200 shadow-2xs'
                      : 'bg-slate-50/60 dark:bg-stone-900/70 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/45 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">{t('modeOnlineVideo')}</span>
                    <span className="text-[10px] text-slate-500 dark:text-stone-400 block">{t('privateVideoStream', 'Private video stream')}</span>
                  </div>
                </div>

                {/* Offline */}
                <div
                  onClick={() => setAppointmentType('offline')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex sm:flex-col items-center sm:items-start gap-2 ${
                    appointmentType === 'offline'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-950 dark:text-amber-200 shadow-2xs'
                      : 'bg-slate-50/60 dark:bg-stone-900/70 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">{t('modeOfflineChamber')}</span>
                    <span className="text-[10px] text-slate-500 dark:text-stone-400 block">{t('inPersonChamberVisit', 'In-person chamber visit')}</span>
                  </div>
                </div>

                {/* Chat */}
                <div
                  onClick={() => setAppointmentType('chat')}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex sm:flex-col items-center sm:items-start gap-2 ${
                    appointmentType === 'chat'
                      ? 'bg-teal-50 dark:bg-teal-950/35 border-teal-400 text-teal-950 dark:text-teal-200 shadow-2xs'
                      : 'bg-slate-50/60 dark:bg-stone-900/70 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">{t('modePlatformChat')}</span>
                    <span className="text-[10px] text-slate-500 dark:text-stone-400 block">{t('realTimeConsultation', 'Real-time consultation')}</span>
                  </div>
                </div>
              </div>

              {/* Show Astrologer's Office Address if Offline is chosen */}
              {appointmentType === 'offline' && (
                <div className="mt-2 p-2.5 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-start gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 dark:text-amber-200 block">{t('officeAddressDisplayLabel')}</span>
                    <span className="text-slate-700 dark:text-stone-300">
                      {selectedAstro?.officeAddress || selectedAstro?.address || 'Chamber details will be shared upon confirmation.'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Date & Time Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-800 dark:text-stone-200 font-bold block mb-1">
                  {t('dateLabel')}
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-800 dark:text-stone-200 font-bold block">
                    {isCustomSlot ? t('customTimeSlot') : t('timeSlotLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSlot(!isCustomSlot);
                      setSelectedSlot('');
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                  >
                    {isCustomSlot ? 'Show Regular Slots' : `+ ${t('customTimeSlot')}`}
                  </button>
                </div>

                {isCustomSlot ? (
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={t('enterPreferredTime')}
                      value={customSlotTime}
                      onChange={(e) => setCustomSlotTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <span className="text-[10px] text-slate-500 dark:text-stone-400 mt-0.5 block">
                      The astrologer will review and confirm your requested custom timing.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {activeSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-stone-900/70 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Top / Query Area */}
            <div>
              <label className="text-slate-800 dark:text-stone-200 font-bold block mb-1.5">
                {t('topicQueryAreaLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {TOP_QUERY_AREAS.map((area) => (
                  <button
                    type="button"
                    key={area.id}
                    onClick={() => setQueryArea(area.id)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                      queryArea === area.id
                        ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold shadow-2xs'
                        : 'bg-slate-50/70 dark:bg-stone-900/70 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{area.icon}</span>
                    <span className="text-[11px] truncate">{t(area.labelKey, area.label)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Query to Ask (Enter query to ask with astrologer) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-800 dark:text-stone-200 font-bold block">
                  {t('queryToAskLabel')}
                </label>
                <span className="text-[10px] text-slate-500 dark:text-stone-400">{t('recordedForPrivateReview', 'Recorded for private astrologer review')}</span>
              </div>
              <textarea
                rows={3}
                required
                value={clientQuery}
                onChange={(e) => setClientQuery(e.target.value)}
                placeholder={t('queryToAskPlaceholder')}
                className="w-full bg-slate-50 dark:bg-stone-900/70 border border-slate-300 dark:border-stone-600 rounded-xl px-3 py-2 text-slate-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-stone-800/80 text-slate-700 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-stone-700 transition-colors font-semibold cursor-pointer"
              >
                {t('cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !effectiveSlot || !clientQuery.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : null}
                {t('confirmAppointmentBtn')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}