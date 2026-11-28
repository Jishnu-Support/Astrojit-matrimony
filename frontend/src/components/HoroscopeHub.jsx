import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Printer,
  Monitor,
  FileText,
  Clock,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { useLang } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useClientBirth } from '../context/ClientBirthContext';
import ThirukanithaHoroscopeView from './ThirukanithaHoroscopeView';
import BirthDetailsIntakeCard from './BirthDetailsIntakeCard';
import HoroscopeA4PatrikaPrint from './HoroscopeA4PatrikaPrint';
import HoroscopeMultiPagePrint from './HoroscopeMultiPagePrint';

export default function HoroscopeHub({
  initialClient = null,
  onClose,
  hideClientLookup = false,
  onClientSaved
}) {
  const { lang } = useLang();
  const { user } = useAuth();
  const isTa = lang === 'ta';

  // Toggle Mode: 'screen' (Horoscope Screen View) | 'print' (Horoscope Print)
  const [horoscopeMode, setHoroscopeMode] = useState('screen');
  // Print Sub-Mode: 'onepage' (A4 1-Pager) | 'multipage' (Half A4 / A5 Multi-Pager)
  const [printFormat, setPrintFormat] = useState('onepage');

  // Client view should not have the previous client search bar; astrologer portal requires it
  const shouldHideLookup = Boolean(hideClientLookup || user?.role === 'client');

  const {
    clientData,
    updateField,
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

  return (
    <div className="space-y-5">
      {/* ======================================================== */}
      {/* 1. HOROSCOPE MAIN TITLE & SCREEN/PRINT TOGGLE BAR */}
      {/* ======================================================== */}
      <div className="bg-white/95 dark:bg-[#251E1A] p-4 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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
          </div>
        </div>

        {/* View Mode Toggle: Horoscope Screen View & Horoscope Print */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setHoroscopeMode('screen')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                horoscopeMode === 'screen'
                  ? 'bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isTa ? 'ஜாதகத் திரை பார்வை' : 'Horoscope Screen View'}</span>
            </button>

            <button
              type="button"
              onClick={() => setHoroscopeMode('print')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                horoscopeMode === 'print'
                  ? 'bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isTa ? 'ஜாதகம் அச்சு' : 'Horoscope Print'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CONDITIONAL VIEW: SCREEN VIEW vs PRINT VIEW */}
      {/* ======================================================== */}
      {horoscopeMode === 'screen' ? (
        <>
          {/* BIRTH DETAILS INTAKE FORM WITH PREVIOUS CLIENT SEARCH */}
          <div className="print:hidden">
            <BirthDetailsIntakeCard
              module="horoscope"
              hideClientLookup={shouldHideLookup}
              onCalculate={() => refreshCalculations()}
              onClientSaved={onClientSaved}
            />
          </div>

          {/* THIRUKANITHA HOROSCOPE SCREEN VIEW (DIRECTLY PRINTABLE) */}
          <div className="space-y-4">
            <ThirukanithaHoroscopeView
              key={`horo-${calcKey}`}
              initialData={activeBirthData}
              onClose={onClose}
              onSwitchToPrint={() => {
                setHoroscopeMode('print');
              }}
            />
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {/* Print Format Switcher: 1-Page A4 vs Multi-Page Half A4 (A5: 148 x 210 mm) */}
          <div className="bg-white/95 dark:bg-[#251E1A] px-4 py-2.5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-wrap items-center justify-between gap-2 print:hidden">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isTa ? 'அச்சு வடிவமைப்பு:' : 'Print Format:'}
            </span>
            <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900/80 rounded-xl border border-stone-200 dark:border-stone-800 max-w-full">
              <button
                type="button"
                onClick={() => setPrintFormat('onepage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  printFormat === 'onepage'
                    ? 'bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isTa ? '1-பக்க ஜாதகம் (A4)' : '1-Page Patrika (A4)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('multipage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  printFormat === 'multipage'
                    ? 'bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isTa ? 'பலபக்க புத்தகம் (Half A4 / A5)' : 'Multi-Page Booklet (Half A4 / A5)'}</span>
              </button>
            </div>
          </div>

          {printFormat === 'onepage' ? (
            <HoroscopeA4PatrikaPrint
              key={`print-a4-${calcKey}`}
              birthData={activeBirthData}
              onSwitchToScreen={() => setHoroscopeMode('screen')}
            />
          ) : (
            <HoroscopeMultiPagePrint
              key={`print-a5-${calcKey}`}
              birthData={activeBirthData}
              onSwitchToScreen={() => setHoroscopeMode('screen')}
              onSwitchToOnePage={() => setPrintFormat('onepage')}
            />
          )}
        </div>
      )}
    </div>
  );
}
