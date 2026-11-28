import React, { useState, useMemo } from 'react';
import { Star, Search, CheckCircle2, AlertTriangle, XCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useLang } from '../i18n';

function NakshatraResultTile({ item, isTa, isExpanded, onToggle }) {
  const tierStyles =
    item.tier === 'uttamam'
      ? 'bg-emerald-50/75 border-emerald-200 hover:border-emerald-400'
      : item.tier === 'madhyamam'
      ? 'bg-amber-50/75 border-amber-200 hover:border-amber-400'
      : 'bg-rose-50/60 border-rose-200 hover:border-rose-300';

  const scoreBadge =
    item.tier === 'uttamam'
      ? 'bg-emerald-600 text-white'
      : item.tier === 'madhyamam'
      ? 'bg-amber-600 text-white'
      : 'bg-rose-600 text-white';

  return (
    <div className={`rounded-xl border transition-all overflow-hidden ${tierStyles}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-2.5 flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <div className="min-w-0">
          <div className="font-bold text-xs text-stone-900 flex flex-wrap items-center gap-1.5">
            <span>{isTa ? item.starTamil : item.starName}</span>
            <span className="text-[10px] font-medium text-stone-500">
              ({isTa ? item.rasiTamil : item.rasiName})
            </span>
          </div>
          <div className="text-[10px] text-stone-600 flex flex-wrap items-center gap-1.5 mt-0.5">
            <span>{isTa ? item.padaLabelTa : item.padaLabelEn}</span>
            {item.subha68 && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                {isTa ? 'சுப 6/8' : 'Subha 6/8'}
              </span>
            )}
            {item.rajjuExempt && (
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                {isTa ? 'ஆரோக-அவரோக விதிவிலக்கு' : 'Aroha-Avaroha'}
              </span>
            )}
            {item.tier === 'avoid' && (item.failReasonsEn?.length > 0) && (
              <span className="text-rose-700 font-semibold">
                · {(isTa ? item.failReasonsTa : item.failReasonsEn).join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${scoreBadge}`}>
            {item.totalScore}/10
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-2.5 pb-2.5 pt-1.5 border-t border-black/10 bg-white/85">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px]">
            {(item.poruthams || []).map((p, idx) => (
              <div
                key={idx}
                className={`px-2 py-1 rounded border flex items-center justify-between gap-1 ${
                  p.points >= 1
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : p.points > 0
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-rose-50/60 border-rose-200 text-rose-800'
                }`}
              >
                <span className="truncate font-semibold">{isTa ? p.nameTamil : p.name}</span>
                <span className="font-bold shrink-0">{p.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchingNakshatrasCard({ matchReport, standaloneData = null }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const pairAnalysis = matchReport?.matchingNakshatrasAnalysis;
  const [targetSide, setTargetSide] = useState('forGirl'); // 'forGirl' | 'forBoy'
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'uttamam' | 'madhyamam' | 'avoid'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKey, setExpandedKey] = useState(null);

  const activeData = useMemo(() => {
    if (standaloneData) return standaloneData;
    if (!pairAnalysis) return null;
    return targetSide === 'forBoy' ? pairAnalysis.forBoy : pairAnalysis.forGirl;
  }, [standaloneData, pairAnalysis, targetSide]);

  const filteredSlots = useMemo(() => {
    if (!activeData) return [];
    let list = activeData.allSlots || [];
    if (tierFilter !== 'all') {
      list = list.filter((x) => x.tier === tierFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (x) =>
          x.starName.toLowerCase().includes(q) ||
          x.starTamil.includes(q) ||
          x.rasiName.toLowerCase().includes(q) ||
          x.rasiTamil.includes(q)
      );
    }
    return list;
  }, [activeData, tierFilter, searchQuery]);

  if (!activeData) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
        {isTa
          ? 'பொருந்தும் 27 நட்சத்திர பட்டியலைக் காண பொருத்தத்தை மீண்டும் கணக்கிடவும்.'
          : 'Please recalculate the match (or click Find Matching Stars) to inspect all 27 matching Nakshatras.'}
      </div>
    );
  }

  const { source, lookingFor, counts } = activeData;
  const isFindingGroomStars = lookingFor === 'groom';

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Source Horoscope Summary & Partner Direction Switcher */}
      <div className="p-3.5 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-black text-xs sm:text-sm text-[#7A1A22]">
              <Star className="w-4 h-4 text-amber-600 fill-amber-500/20" />
              <span>
                {isFindingGroomStars
                  ? (isTa ? 'மணமகளுக்குப் பொருந்தும் மணமகன் நட்சத்திரங்கள்' : 'Compatible Groom Nakshatras (For Bride)')
                  : (isTa ? 'மணமகனுக்குப் பொருந்தும் மணமகள் நட்சத்திரங்கள்' : 'Compatible Bride Nakshatras (For Groom)')}
              </span>
            </span>
          </div>
          <p className="text-[11px] text-stone-700 font-medium">
            {isTa
              ? `ஜாதகர்: ${source.name} · நட்சத்திரம்: ${source.starTamil} (${source.pada}-ம் பாதம், ${source.rasiTamil})`
              : `Chart: ${source.name} · Birth Star: ${source.starName} (Pada ${source.pada}, ${source.rasiName})`}
          </p>
        </div>

        {/* Toggle Bride vs Groom (when full matchReport exists and not standalone) */}
        {!standaloneData && pairAnalysis && (
          <div className="inline-flex rounded-lg bg-stone-100 border border-stone-200 p-0.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => { setTargetSide('forGirl'); setExpandedKey(null); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                targetSide === 'forGirl'
                  ? 'bg-[#7A1A22] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isTa ? 'மணமகளுக்கான வரன்கள்' : 'For Bride (Find Groom)'}
            </button>
            <button
              type="button"
              onClick={() => { setTargetSide('forBoy'); setExpandedKey(null); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                targetSide === 'forBoy'
                  ? 'bg-[#7A1A22] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isTa ? 'மணமகனுக்கான வரன்கள்' : 'For Groom (Find Bride)'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Tier Summary Cards & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
              tierFilter === 'all'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {isTa ? `அனைத்தும் (${counts.totalSlots})` : `All (${counts.totalSlots})`}
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('uttamam')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
              tierFilter === 'uttamam'
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{isTa ? `உத்தமம் (${counts.uttamam})` : `Uttamam / Best (${counts.uttamam})`}</span>
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('madhyamam')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
              tierFilter === 'madhyamam'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{isTa ? `மத்திமம் (${counts.madhyamam})` : `Madhyamam (${counts.madhyamam})`}</span>
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('avoid')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1 transition-colors cursor-pointer ${
              tierFilter === 'avoid'
                ? 'bg-rose-700 text-white border-rose-700'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>{isTa ? `தவிர்க்கவும் (${counts.avoid})` : `Avoid / Dosha (${counts.avoid})`}</span>
          </button>
        </div>

        <div className="relative w-full md:w-56">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTa ? 'நட்சத்திரம் / ராசி தேடு...' : 'Filter Nakshatra or Rasi...'}
            className="w-full bg-white border border-stone-300 rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] text-stone-800 focus:outline-none focus:border-[#7A1A22]"
          />
        </div>
      </div>

      {/* 3. Matching Nakshatra Cards Grid */}
      {filteredSlots.length === 0 ? (
        <div className="p-4 text-center rounded-xl bg-stone-50 border border-stone-200 text-stone-500 text-xs">
          {isTa ? 'தேடலுக்குப் பொருத்தமான நட்சத்திரம் இல்லை.' : 'No matching Nakshatras found for this filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredSlots.map((item) => (
            <NakshatraResultTile
              key={item.key}
              item={item}
              isTa={isTa}
              isExpanded={expandedKey === item.key}
              onToggle={() => setExpandedKey(expandedKey === item.key ? null : item.key)}
            />
          ))}
        </div>
      )}

      {/* 4. Classical Guidance */}
      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-[11px] text-stone-700 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22]">
            {isTa ? 'நட்சத்திரத் தேர்வு குறிப்பு:' : 'Nakshatra Selection Note:'}
          </strong>{' '}
          {isTa
            ? 'எந்த நட்சத்திரத்தையும் கிளிக் செய்து 10 பொருத்தங்களின் முழுப் பட்டியலைப் பார்க்கலாம். உத்தமம் பிரிவில் ரஜ்ஜு மற்றும் வேதை தோஷமின்றி ≥ 7 பொருத்தம் உள்ள நட்சத்திரங்கள் வரிசைப்படுத்தப்பட்டுள்ளன.'
            : 'Click any Nakshatra card to expand its 10-Porutham breakdown. Uttamam matches satisfy Rajju & Vedha clearance with ≥ 7/10 Poruthams (split by Pada where a star spans two Rasis).'}
        </div>
      </div>
    </div>
  );
}
