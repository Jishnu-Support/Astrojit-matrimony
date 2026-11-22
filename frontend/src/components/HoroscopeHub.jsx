import React, { useEffect } from 'react';
import {
  Sparkles,
  Printer
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useClientBirth } from '../context/ClientBirthContext';
import ThirukanithaHoroscopeView from './ThirukanithaHoroscopeView';
import BirthDetailsIntakeCard from './BirthDetailsIntakeCard';

export default function HoroscopeHub({
  initialClient = null,
  onClose,
  hideClientLookup = false
}) {
  const { lang } = useLang();
  const { user } = useAuth();
  const isTa = lang === 'ta';

  // Client view should not have the previous client search bar; astrologer portal requires it
  const shouldHideLookup = Boolean(hideClientLookup || user?.role === 'client');

  const {
    activeBirthData,
    calcKey,
    selectClient,
    refreshCalculations
  } = useClientBirth();

  // Sync state if initialClient prop is passed from outside
  useEffect(() => {
    if (initialClient) {
      selectClient(initialClient);
    }
  }, [initialClient, selectClient]);

  const handlePrintHoroscope = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* ======================================================== */}
      {/* 1. HOROSCOPE MAIN TITLE & PRINT ACTION */}
      {/* ======================================================== */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#7A1A22] to-[#99222C] text-amber-200 flex items-center justify-center text-xl sm:text-2xl shadow-md shadow-red-950/20 shrink-0">
            🪐
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-[#7A1A22] dark:text-[#E8838B] tracking-tight flex items-center gap-2">
              <span>{isTa ? 'ஜாதகம்' : 'Horoscope'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                {isTa ? 'திருக்கணித பராசர முறை' : 'Thirukanitha Parashara'}
              </span>
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {isTa
                ? 'திருக்கணித வாக்கிய முறைப்படி அமைக்கப்பட்ட துல்லியமான வேத ஜோதிடக் கணிப்பு'
                : 'Complete Thirukanitha Sidereal Ephemeris Engine & Authentic Vedic Horoscope Calculations'}
            </p>
          </div>
        </div>

        {/* Print Horoscope Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handlePrintHoroscope}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 hover:from-[#5C1017] hover:to-[#7A1A22] text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{isTa ? 'ஜாதகம் அச்சிடுக (Print Horoscope)' : 'Print Horoscope'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BIRTH DETAILS INTAKE FORM WITH PREVIOUS CLIENT SEARCH */}
      {/* ======================================================== */}
      <BirthDetailsIntakeCard
        module="horoscope"
        hideClientLookup={shouldHideLookup}
        onCalculate={() => refreshCalculations()}
      />

      {/* ======================================================== */}
      {/* 3. THIRUKANITHA HOROSCOPE VIEW */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <ThirukanithaHoroscopeView
          key={`horo-${calcKey}`}
          initialData={activeBirthData}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
