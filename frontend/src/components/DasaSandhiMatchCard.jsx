import React from 'react';
import { Clock, Calendar, AlertTriangle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';

function PersonDasaTimelineCard({ person, title, isBride, isTa }) {
  const upcomingList = (person?.transitions || []).slice(0, 4);

  return (
    <div className={`border rounded-xl p-3 space-y-2.5 ${isBride ? 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50' : 'bg-indigo-50/40 dark:bg-indigo-950/35 border-indigo-200 dark:border-indigo-800/50'}`}>
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-bold">
        <span className={isBride ? 'text-rose-900 dark:text-rose-300' : 'text-indigo-900 dark:text-indigo-300'}>{title}</span>
        {person?.inDashaChidram ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
            {isTa ? 'தசா சித்ரம் (மாற்ற அருகில்)' : 'Near Transition (Chidram)'}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-[#1E1815] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
            {isTa ? person?.starTa : person?.starEn}
          </span>
        )}
      </div>

      {/* Birth Balance, Running Dasha & Running Bhukti */}
      <div className="bg-white dark:bg-[#1E1815] rounded-lg border border-stone-200 dark:border-stone-700 p-2.5 text-[11px] space-y-1">
        <div className="flex justify-between gap-2">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'பிறப்பு தசா இருப்பு:' : 'Birth Dasha Balance:'}</span>
          <strong className="text-stone-900 dark:text-stone-100 text-right">
            {isTa ? person?.birthBalanceTa : person?.birthBalanceEn}
          </strong>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'நடப்பு மகா தசை:' : 'Running Mahadasha:'}</span>
          <strong className="text-[#7A1A22] dark:text-amber-300 text-right">
            {isTa ? person?.currentDasha?.lordTa : person?.currentDasha?.lord}{' '}
            ({isTa ? `${person?.currentDasha?.endDate} வரை` : `till ${person?.currentDasha?.endDate}`})
          </strong>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-stone-500 dark:text-stone-400">{isTa ? 'நடப்பு புக்தி:' : 'Current Bhukti:'}</span>
          <strong className="text-indigo-900 dark:text-indigo-300 text-right">
            {isTa ? person?.currentBhukti?.lordTa : person?.currentBhukti?.lord}{' '}
            ({isTa ? `${person?.currentBhukti?.endDate} வரை` : `till ${person?.currentBhukti?.endDate}`})
          </strong>
        </div>
      </div>

      {/* Upcoming 4 Mahadasha Transitions */}
      <div className="bg-white dark:bg-[#1E1815] rounded-lg border border-stone-200 dark:border-stone-700 p-2.5 space-y-1.5">
        <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-1">
          <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400" />
          <span>{isTa ? 'வரவிருக்கும் மகா தசா மாற்றங்கள்:' : 'Upcoming Mahadasha Transitions:'}</span>
        </div>
        <div className="space-y-1 text-[10.5px]">
          {upcomingList.map((tr, idx) => (
            <div
              key={`${tr.dateStr}-${idx}`}
              className="flex flex-wrap items-center justify-between gap-1 px-2 py-1 rounded bg-stone-50 dark:bg-stone-900/70 border border-stone-100 dark:border-stone-800"
            >
              <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                <span>{isTa ? tr.fromTa : tr.fromEn}</span>
                <ArrowRight className="w-2.5 h-2.5 text-stone-400" />
                <span className={
                  tr.toNature === 'malefic'
                    ? 'text-rose-700 dark:text-rose-400 font-bold'
                    : tr.toNature === 'benefic'
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-amber-700 dark:text-amber-400 font-bold'
                }>
                  {isTa ? tr.toTa : tr.toEn}
                </span>
              </span>
              <span className="text-stone-500 dark:text-stone-400 font-mono">
                {tr.dateStr} ({isTa ? `வயது ${tr.ageAtTransition}` : `Age ${tr.ageAtTransition}`})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSeverityBadgeClass(severity) {
  if (severity === 'critical') return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/50';
  if (severity === 'high') return 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
  return 'bg-sky-50 dark:bg-sky-950/35 text-sky-800 border-sky-200';
}

export default function DasaSandhiMatchCard({ matchReport }) {
  const { lang } = useLang();
  const isTa = lang === 'ta';

  const ds = matchReport?.dasaSandhiAnalysis;
  if (!ds) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200">
        {isTa
          ? 'விரிவான தசா சந்திப் பொருத்த ஆய்வைக் காண பொருத்தத்தை மீண்டும் கணக்கிடவும்.'
          : 'Please recalculate the match to generate the full 45-year Dasa Sandhi transition scan.'}
      </div>
    );
  }

  const {
    boy,
    girl,
    collisions,
    overallStatus,
    statusLabelEn,
    statusLabelTa,
    score,
    verdictEn,
    verdictTa,
  } = ds;

  const isClear = overallStatus === 'clear';
  const isWatch = overallStatus === 'watch';

  return (
    <div className="space-y-4 pt-2 text-xs">
      {/* 1. Overall Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        isClear
          ? 'bg-emerald-50/75 dark:bg-emerald-950/35 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
          : isWatch
          ? 'bg-amber-50/75 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-950 dark:text-amber-200'
          : 'bg-rose-50/75 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-white dark:bg-[#1E1815] border border-black/10 shrink-0">
            <Clock className="w-4 h-4 text-[#7A1A22] dark:text-amber-300" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm">
              {isTa ? statusLabelTa : statusLabelEn}
            </div>
            <p className="text-[11px] font-medium mt-0.5 leading-relaxed">
              {isTa ? verdictTa : verdictEn}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 self-end sm:self-center bg-white dark:bg-[#1E1815] px-3 py-1.5 rounded-xl border border-black/10">
          <div className="text-lg font-black text-[#7A1A22] dark:text-amber-300">{score}%</div>
          <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
            {isTa ? 'தசா சந்தி பலம்' : 'Sandhi Score'}
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Bride & Groom Dasha Timelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonDasaTimelineCard
          person={girl}
          title={isTa ? `மணமகள்: ${matchReport.girl?.name || 'Bride'}` : `Bride: ${matchReport.girl?.name || 'Bride'}`}
          isBride
          isTa={isTa}
        />
        <PersonDasaTimelineCard
          person={boy}
          title={isTa ? `மணமகன்: ${matchReport.boy?.name || 'Groom'}` : `Groom: ${matchReport.boy?.name || 'Groom'}`}
          isBride={false}
          isTa={isTa}
        />
      </div>

      {/* 3. 45-Year Dasa Sandhi Overlap Scan Table */}
      <div className="bg-white dark:bg-[#1E1815] border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
        <div className="px-3.5 py-2.5 bg-amber-50/70 dark:bg-amber-950/30 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <span className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>
              {isTa ? 'தசா சந்திப்பு இடைவெளி சோதனை (அடுத்த 45 ஆண்டுகள்)' : '45-Year Simultaneous Transition Overlap Scan (≤ 18 Months)'}
            </span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            (collisions || []).length === 0 ? 'bg-emerald-100 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
          }`}>
            {(collisions || []).length === 0
              ? (isTa ? 'சந்திப்பு இல்லை' : '0 Overlaps')
              : (isTa ? `${collisions.length} சந்திப்பு(கள்)` : `${collisions.length} Overlap(s)`)}
          </span>
        </div>

        {(collisions || []).length === 0 ? (
          <div className="p-4 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/35 text-[11px] font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isTa
                ? 'இருவரின் மகா தசை மாற்றங்களுக்கும் இடையே குறைந்தது 18 மாதங்களுக்கு மேல் இடைவெளி உள்ளதால் தசா சந்தி தோஷம் இல்லை.'
                : 'Every Mahadasha switch for Bride and Groom is separated by more than 18 months over the next 45 years — No Dasa Sandhi conflict!'}
            </span>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {collisions.map((c) => (
              <div key={c.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="space-y-0.5">
                  <div className="font-bold text-stone-900 dark:text-stone-100 flex flex-wrap items-center gap-1.5">
                    <span>~{c.approxYear}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-[#7A1A22] dark:text-amber-300">
                      {isTa ? `${c.gapLabel} இடைவெளி` : `${c.gapLabel} apart`}
                    </span>
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {isTa
                      ? `மணமகள்: ${c.girlTransition.fromTa} → ${c.girlTransition.toTa} (${c.girlTransition.dateStr})`
                      : `Bride: ${c.girlTransition.fromEn} → ${c.girlTransition.toEn} (${c.girlTransition.dateStr})`}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    {isTa
                      ? `மணமகன்: ${c.boyTransition.fromTa} → ${c.boyTransition.toTa} (${c.boyTransition.dateStr})`
                      : `Groom: ${c.boyTransition.fromEn} → ${c.boyTransition.toEn} (${c.boyTransition.dateStr})`}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold shrink-0 self-start sm:self-center ${getSeverityBadgeClass(c.severity)}`}>
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{isTa ? c.severityTa : c.severityEn}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Classical Guidance & Pariharam */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#7A1A22] dark:text-amber-300">
            {isTa ? 'சாஸ்திர குறிப்பு (தசா சந்திப் பொருத்தம்):' : 'Classical Note (Dasa Sandhi):'}
          </strong>{' '}
          {isTa
            ? 'தம்பதியரின் மகா தசைகள் ஒரே காலத்தில் (6 முதல் 12 மாதங்களுக்குள்) மாறும்போது தசா சந்தி எனப்படும். குறிப்பாக பாவ கிரக தசை மாற்றம் எனில் திருமணத்திற்கு முன் தசா சந்தி சாந்தி, நவக்கிரக ஹோமம் & மிருத்யுஞ்சய ஜபம் செய்வது குடும்பத்திற்குப் பாதுகாப்பு தரும்.'
            : 'When Bride and Groom undergo Mahadasha transitions within 6–12 months of each other (especially into malefic periods like Saturn, Rahu, Ketu, or Mars), Tamil Jyotish recommends performing Dasa Sandhi Shanti / Mrityunjaya Homam prior to the wedding muhurat.'}
        </div>
      </div>
    </div>
  );
}
