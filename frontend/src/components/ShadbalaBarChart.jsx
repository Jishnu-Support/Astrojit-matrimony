import React, { useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, AlertTriangle, Layers, Award, Sparkles } from 'lucide-react';

/**
 * Classical Parashari Required Minimum Shadbala (in Rupas):
 * Sun: 6.5, Moon: 6.0, Mars: 5.0, Mercury: 7.0, Jupiter: 6.5, Venus: 5.5, Saturn: 5.0
 */
const GRAHA_REQUIREMENTS = [
  { key: 'Sun', nameTa: 'சூரியன்', glyph: '☉', minRupas: 6.5, color: 'from-amber-500 to-orange-500', barBg: '#F59E0B' },
  { key: 'Moon', nameTa: 'சந்திரன்', glyph: '☽', minRupas: 6.0, color: 'from-blue-400 to-indigo-400', barBg: '#818CF8' },
  { key: 'Mars', nameTa: 'செவ்வாய்', glyph: '♂', minRupas: 5.0, color: 'from-rose-500 to-red-600', barBg: '#EF4444' },
  { key: 'Mercury', nameTa: 'புதன்', glyph: '☿', minRupas: 7.0, color: 'from-emerald-500 to-teal-600', barBg: '#10B981' },
  { key: 'Jupiter', nameTa: 'குரு', glyph: '♃', minRupas: 6.5, color: 'from-yellow-400 to-amber-500', barBg: '#FBBF24' },
  { key: 'Venus', nameTa: 'சுக்கிரன்', glyph: '♀', minRupas: 5.5, color: 'from-pink-400 to-rose-400', barBg: '#F472B6' },
  { key: 'Saturn', nameTa: 'சனி', glyph: '♄', minRupas: 5.0, color: 'from-blue-600 to-indigo-700', barBg: '#3B82F6' },
];

const BHAVA_NAMES = [
  { num: 1, nameEn: '1st - Self / Tanu', nameTa: '1 - லக்னம் / தனு', type: 'Kendra/Trikona' },
  { num: 2, nameEn: '2nd - Wealth / Dhana', nameTa: '2 - தனம் / குடும்பம்', type: 'Panapara' },
  { num: 3, nameEn: '3rd - Siblings / Sahaja', nameTa: '3 - தைரியம் / சகோதரம்', type: 'Apoklima' },
  { num: 4, nameEn: '4th - Mother / Sukha', nameTa: '4 - சுகம் / தாய்', type: 'Kendra' },
  { num: 5, nameEn: '5th - Intellect / Putra', nameTa: '5 - புத்திரம் / பூர்வபுண்ணியம்', type: 'Trikona' },
  { num: 6, nameEn: '6th - Health / Ari', nameTa: '6 - சத்ரு / ரோகம்', type: 'Dusthana' },
  { num: 7, nameEn: '7th - Spouse / Yuvati', nameTa: '7 - களத்திரம் / கூட்டாண்மை', type: 'Kendra' },
  { num: 8, nameEn: '8th - Longevity / Randhra', nameTa: '8 - ஆயுள் / அஷ்டமம்', type: 'Dusthana' },
  { num: 9, nameEn: '9th - Fortune / Dharma', nameTa: '9 - பாக்யம் / தந்தை', type: 'Trikona' },
  { num: 10, nameEn: '10th - Career / Karma', nameTa: '10 - தொழில் / கர்மா', type: 'Kendra' },
  { num: 11, nameEn: '11th - Gains / Labha', nameTa: '11 - லாபம் / ஆசை', type: 'Upachaya' },
  { num: 12, nameEn: '12th - Losses / Vyaya', nameTa: '12 - விரயம் / மோக்ஷம்', type: 'Dusthana' },
];

export default function ShadbalaBarChart({ shadbalaData, isTamil = false }) {
  const [activeTab, setActiveTab] = useState('graha'); // 'graha' | 'bhava' | 'breakdown'

  if (!shadbalaData || !shadbalaData.grahaRows) {
    return null;
  }

  // Find Total row in Graha table
  const totalRow = shadbalaData.grahaRows.find(r => r.isTotal || r.labelEn?.includes('Total') || r.label?.includes('மொத்தம்'));
  const totalVals = totalRow ? totalRow.vals.map(v => parseFloat(v) || 0) : [];

  // Find Bhava total row
  const bhavaTotalRow = shadbalaData.bhavaRows?.find(r => r.isTotal || r.labelEn?.includes('Total') || r.label?.includes('மொத்தம்'));
  const bhavaTotalVals = bhavaTotalRow ? bhavaTotalRow.vals.map(v => parseFloat(v) || 0) : [];

  // Parse planet stats
  const planetStats = GRAHA_REQUIREMENTS.map((req, idx) => {
    const val = totalVals[idx] || 0;
    const ratio = req.minRupas > 0 ? (val / req.minRupas) * 100 : 100;
    const isStrong = val >= req.minRupas;
    const diff = val - req.minRupas;

    // Component breakdown for this planet
    const breakdown = shadbalaData.grahaRows
      .filter(r => !r.isTotal)
      .map(r => ({
        label: isTamil ? r.label : r.labelEn,
        val: parseFloat(r.vals[idx]) || 0
      }));

    return {
      ...req,
      total: val,
      ratio,
      isStrong,
      diff,
      breakdown
    };
  });

  // Calculate highest planet score for bar scaling (capped at 10 to give visual headroom)
  const maxPlanetVal = Math.max(...planetStats.map(p => Math.max(p.total, p.minRupas)), 9);

  // Parse bhava stats
  const bhavaStats = BHAVA_NAMES.map((bh, idx) => {
    const val = bhavaTotalVals[idx] || 0;
    return {
      ...bh,
      val
    };
  });

  const maxBhavaVal = Math.max(...bhavaStats.map(b => b.val), 10);
  const sortedBhavas = [...bhavaStats].sort((a, b) => b.val - a.val);

  return (
    <div className="space-y-4 bg-amber-50/40 dark:bg-stone-900/40 p-3.5 sm:p-5 rounded-2xl border border-amber-900/15 dark:border-amber-500/20">
      {/* Chart Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-900/10 dark:border-amber-500/15">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#7A1A22] dark:text-amber-300">
              {isTamil ? 'ஷட்பல வரைபட ஒப்பீடு (Visual Strength Charts)' : 'Shadbala Visual Strength Charts'}
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {isTamil ? 'பராசரர் முறைப்படி கிரக மற்றும் பாவக பலங்களின் வரைபட ஆய்வு' : 'Parashari 6-fold planetary strength & house power distribution'}
            </p>
          </div>
        </div>

        {/* View Segmented Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('graha')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'graha'
                ? 'bg-white dark:bg-stone-700 text-[#7A1A22] dark:text-amber-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>🪐</span>
            <span>{isTamil ? 'கிரக பலம்' : 'Planets'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bhava')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'bhava'
                ? 'bg-white dark:bg-stone-700 text-[#7A1A22] dark:text-amber-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>🏛️</span>
            <span>{isTamil ? 'பாவக பலம்' : 'Houses'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'breakdown'
                ? 'bg-white dark:bg-stone-700 text-[#7A1A22] dark:text-amber-300 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{isTamil ? 'அறுவகை ஒப்பீடு' : '6-Fold Split'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PLANETARY SHADBALA BAR CHART (Graha Bala) */}
      {/* ======================================================== */}
      {activeTab === 'graha' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1">
            <span>{isTamil ? 'கிரகம் / பலம் (ரூபங்கள்)' : 'Planet / Total Shadbala (Rupas)'}</span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>{isTamil ? 'பலம் பெற்றது (≥ தேவை)' : 'Strong (≥ Req.)'}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                <span>{isTamil ? 'பலம் குறைவு (< தேவை)' : 'Deficit (< Req.)'}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full border border-stone-400 dark:border-stone-500 inline-block" />
                <span>{isTamil ? 'குறைந்தபட்ச தேவை கோடு' : 'Min Required Line'}</span>
              </span>
            </span>
          </div>

          <div className="space-y-2.5">
            {planetStats.map((p) => {
              const widthPct = Math.min(100, (p.total / maxPlanetVal) * 100);
              const reqPct = Math.min(100, (p.minRupas / maxPlanetVal) * 100);

              return (
                <div
                  key={p.key}
                  className="bg-white dark:bg-[#1E1815] p-2.5 sm:p-3 rounded-xl border border-amber-900/10 dark:border-amber-500/15 shadow-2xs flex flex-col gap-1.5 transition-all hover:border-amber-500/40"
                >
                  {/* Top Info Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                        {p.glyph}
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-100 text-xs sm:text-sm">
                        {isTamil ? p.nameTa : p.key}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        (Req: {p.minRupas.toFixed(1)} Rupas)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs sm:text-sm text-[#7A1A22] dark:text-amber-300">
                        {p.total.toFixed(3)} <span className="text-[10px] font-normal text-stone-500">Rupas</span>
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isStrong
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300/60 dark:border-rose-700/60'
                        }`}
                      >
                        {p.isStrong ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{p.ratio.toFixed(0)}% ({isTamil ? 'பலம்' : 'Strong'})</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>{p.ratio.toFixed(0)}% ({isTamil ? 'குறைவு' : 'Deficit'})</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart with Benchmark Marker */}
                  <div className="relative w-full h-4 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    {/* The Active Strength Bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${p.color}`}
                      style={{ width: `${widthPct}%` }}
                    />

                    {/* Benchmark Requirement Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-stone-900 dark:bg-white z-10 shadow-xs"
                      style={{ left: `${reqPct}%` }}
                      title={`Required Minimum: ${p.minRupas} Rupas`}
                    />
                  </div>

                  {/* Footer Stats Row */}
                  <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                    <span>
                      {p.isStrong ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          +{p.diff.toFixed(3)} Rupas {isTamil ? 'கூடுதல் பலம்' : 'above threshold'}
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                          {p.diff.toFixed(3)} Rupas {isTamil ? 'தேவைப்படுகிறது' : 'deficit from threshold'}
                        </span>
                      )}
                    </span>
                    <span className="font-mono">
                      Virupas: {(p.total * 60).toFixed(1)} / {(p.minRupas * 60).toFixed(0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BHAVA BALA BAR CHART (12 Houses) */}
      {/* ======================================================== */}
      {activeTab === 'bhava' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1">
            <span>{isTamil ? '12 பாவகங்களின் பலம் (ரூபங்களில்)' : '12 House Strengths (in Rupas)'}</span>
            <span>
              {isTamil ? 'அதிக பலம் பெற்ற பாவகங்கள் வரிசையில்' : 'Ranked from Strongest to Weakest'}
            </span>
          </div>

          {/* Grid of Bhava Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {bhavaStats.map((bh, idx) => {
              const widthPct = Math.min(100, (bh.val / maxBhavaVal) * 100);
              const rank = sortedBhavas.findIndex(s => s.num === bh.num) + 1;
              const isTopRanked = rank <= 3;

              return (
                <div
                  key={bh.num}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isTopRanked
                      ? 'bg-amber-100/50 dark:bg-amber-950/40 border-amber-400/60 dark:border-amber-700/60 shadow-2xs'
                      : 'bg-white dark:bg-[#1E1815] border-amber-900/10 dark:border-amber-500/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-md font-black text-[11px] flex items-center justify-center shrink-0 ${
                          isTopRanked
                            ? 'bg-[#7A1A22] text-amber-200 shadow-2xs'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {bh.num}
                      </span>
                      <span className="font-bold text-stone-800 dark:text-stone-100">
                        {isTamil ? bh.nameTa : bh.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="font-bold text-[#7A1A22] dark:text-amber-300">
                        {bh.val.toFixed(3)}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        #{rank}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTopRanked
                          ? 'bg-gradient-to-r from-amber-500 to-[#7A1A22]'
                          : 'bg-gradient-to-r from-amber-400/80 to-amber-600/80'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: 6-FOLD DETAILED BALA STACKED / RADIAL OVERVIEW */}
      {/* ======================================================== */}
      {activeTab === 'breakdown' && (
        <div className="space-y-3">
          <div className="text-[11px] text-stone-500 dark:text-stone-400 px-1">
            {isTamil
              ? 'ஒவ்வொரு கிரகத்தின் 6 வகை பலங்கள் (ஸ்தானம், திக், காலம், சேஷ்டா, நைசர்கிகம், திருஷ்டி)'
              : 'Six-fold breakdown of each planet: Positional, Directional, Temporal, Motional, Natural & Aspectual'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {planetStats.map((p) => (
              <div
                key={p.key}
                className="bg-white dark:bg-[#1E1815] p-3 rounded-xl border border-amber-900/10 dark:border-amber-500/15 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{p.glyph}</span>
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {isTamil ? p.nameTa : p.key}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#7A1A22] dark:text-amber-300">
                    {p.total.toFixed(3)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {p.breakdown.map((b, bIdx) => {
                    const bVal = b.val;
                    const maxBVal = 4.5;
                    const bWidth = Math.min(100, Math.max(0, (bVal / maxBVal) * 100));

                    return (
                      <div key={bIdx} className="space-y-0.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-stone-600 dark:text-stone-400 truncate max-w-[120px]">
                            {b.label}
                          </span>
                          <span className="font-mono font-medium text-stone-700 dark:text-stone-300">
                            {bVal.toFixed(3)}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bVal < 0 ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.abs(bWidth)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
