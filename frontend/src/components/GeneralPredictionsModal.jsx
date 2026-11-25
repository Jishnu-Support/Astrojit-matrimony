import React from 'react';
import { X, Sparkles, Printer, CheckCircle } from 'lucide-react';

export default function GeneralPredictionsModal({
  isOpen,
  onClose,
  predictions = [],
  nativeName = 'Native',
  isTa = true,
  onPrint
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1815] border border-amber-900/20 dark:border-amber-500/20 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in duration-200 text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 dark:border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7A1A22] to-[#99222C] text-amber-200 flex items-center justify-center text-xl shadow-md">
              📜
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                <span>{isTa ? 'ஜாதகப் பொதுப் பலன்கள் (10 முக்கிய காரணிகள்)' : 'Natal Horoscope General Predictions (10 Key Factors)'}</span>
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isTa
                  ? `${nativeName} - திதி, யோகம், கரணம், யோகி, அவயோகி, லக்னாதிபதி மற்றும் கிரக ஆதிபத்திய பலன்கள்`
                  : `${nativeName} - Tithi, Yoga, Karana, Yogi, Ayogi, Lagna Lord & Functional Lordship Predictions`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Predictions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-1">
          {predictions.map((pred) => (
            <div
              key={pred.id}
              className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 space-y-2 hover:border-amber-600/40 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-amber-900/10 dark:border-amber-500/15 pb-1.5">
                <span className="font-bold text-xs text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                  <span className="text-base">{pred.icon}</span>
                  <span>{isTa ? pred.titleTa : pred.titleEn}</span>
                </span>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  {isTa ? pred.factorTa : pred.factorEn}
                </span>
              </div>

              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                {isTa ? pred.detailedTa : pred.detailedEn}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-900/10 dark:border-amber-500/15">
          <div className="text-[11px] text-stone-500 dark:text-stone-400">
            {isTa
              ? 'சுத்த வேத பராசர முறைப்படி கணிக்கப்பட்ட பொதுப் பலன்கள்'
              : 'Computed strictly following authentic Parashara Vedic principles'}
          </div>

          <div className="flex items-center gap-2">
            {onPrint && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPrint();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7A1A22] to-[#99222C] text-amber-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isTa ? 'அச்சிடுக (Print A4)' : 'Print Sheet (A4)'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-all cursor-pointer"
            >
              {isTa ? 'மூடுக' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
