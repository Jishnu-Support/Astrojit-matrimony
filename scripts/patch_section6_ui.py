with open('frontend/src/components/ThirukanithaHoroscopeView.jsx', 'r', encoding='utf-8') as f:
    thv = f.read()

# 1. Add expandedBhuktiKey state
old_state = "  const [expandedMdIndex, setExpandedMdIndex] = useState(0);"
new_state = """  const [expandedMdIndex, setExpandedMdIndex] = useState(0);
  const [expandedBhuktiKey, setExpandedBhuktiKey] = useState(null);"""

if old_state in thv and "const [expandedBhuktiKey" not in thv:
    thv = thv.replace(old_state, new_state)

# 2. Add Live Current Dasha Tracker & Age & Antaras to Section 6
old_s6_block = """            {/* Quick Status Badges at Top */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {horoscope.summary?.dashaBalance && (
                <div className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1.5">
                  <span className="text-xs">👶</span>
                  <span className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                    {isTamil ? horoscope.summary.dashaBalance.textTa : horoscope.summary.dashaBalance.textEn}
                  </span>
                </div>
              )}
              {horoscope.summary?.currentDashaToday && (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-700/50 flex items-center gap-1.5">
                  <span className="text-xs">🌟</span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    {isTamil ? `இன்றைய நடப்பு: ${horoscope.summary.currentDashaToday.textTa}` : `Active Today: ${horoscope.summary.currentDashaToday.textEn}`}
                  </span>
                </div>
              )}
            </div>
          </div>"""

new_s6_block = """            {/* Quick Status Badges at Top */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {horoscope.summary?.dashaBalance && (
                <div className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1.5">
                  <span className="text-xs">👶</span>
                  <span className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">
                    {isTamil ? horoscope.summary.dashaBalance.textTa : horoscope.summary.dashaBalance.textEn}
                  </span>
                </div>
              )}
              {horoscope.summary?.currentDashaToday && (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-700/50 flex items-center gap-1.5">
                  <span className="text-xs">🌟</span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    {isTamil ? `இன்றைய நடப்பு: ${horoscope.summary.currentDashaToday.textTa}` : `Active Today: ${horoscope.summary.currentDashaToday.textEn}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* LIVE CURRENT DASHA - BHUKTI - ANTARA TRACKER WIDGET */}
          {horoscope.summary?.currentDashaToday && (
            <div className="bg-gradient-to-r from-emerald-900/10 via-amber-500/10 to-transparent dark:from-emerald-950/40 dark:via-stone-900/40 p-4 rounded-xl border border-emerald-500/30 dark:border-emerald-600/30 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 dark:border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
                    🌟
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                      {isTamil ? 'இன்றைய நேரடி தசா புக்தி அந்தர சஞ்சாரம்' : 'Active Dasha - Bhukti - Antara Live Tracker'}
                    </h3>
                    <p className="text-[11px] font-mono text-stone-600 dark:text-stone-400">
                      {isTamil ? horoscope.summary.currentDashaToday.textTa : horoscope.summary.currentDashaToday.textEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    {isTamil ? `${horoscope.summary.currentDashaToday.progressPct}% முடிந்தது` : `${horoscope.summary.currentDashaToday.progressPct}% Elapsed`}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    {isTamil ? `${horoscope.summary.currentDashaToday.daysRemaining} நாட்கள் மீதம்` : `${horoscope.summary.currentDashaToday.daysRemaining} days left`}
                  </span>
                </div>
              </div>

              {/* 3 Interactive Cards: Mahadasha -> Bhukti -> Antara */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-900 border border-emerald-500/20 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold uppercase">{isTamil ? 'மகாதிசை (Level 1)' : 'Mahadasha (Level 1)'}</span>
                  <span className="text-sm font-bold text-[#7A1A22] dark:text-[#E8838B] block mt-0.5">
                    {isTamil ? horoscope.summary.currentDashaToday.mahadasha?.nameTa : horoscope.summary.currentDashaToday.mahadasha?.nameEn}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500 block">
                    {horoscope.dashaTable.find(d => d.isOngoingToday)?.startDate} ➔ {horoscope.dashaTable.find(d => d.isOngoingToday)?.endDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-900 border border-emerald-500/30 shadow-2xs">
                  <span className="block text-[10px] text-stone-500 font-bold uppercase">{isTamil ? 'புக்தி (Level 2)' : 'Bhukti (Level 2)'}</span>
                  <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 block mt-0.5">
                    {isTamil ? horoscope.summary.currentDashaToday.bhukti?.nameTa : horoscope.summary.currentDashaToday.bhukti?.nameEn}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500 block">
                    {horoscope.summary.currentDashaToday.startDate} ➔ {horoscope.summary.currentDashaToday.endDate}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-900 border border-emerald-500/40 shadow-2xs ring-1 ring-emerald-500/30">
                  <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">{isTamil ? 'அந்தரம் (Level 3 - சூட்சுமம்)' : 'Antara (Level 3)'}</span>
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-300 block mt-0.5">
                    {isTamil ? horoscope.summary.currentDashaToday.antara?.nameTa : horoscope.summary.currentDashaToday.antara?.nameEn}
                  </span>
                  <span className="text-[10.5px] font-mono text-stone-500 block">
                    {horoscope.summary.currentDashaToday.antaraStartDate} ➔ {horoscope.summary.currentDashaToday.antaraEndDate}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${horoscope.summary.currentDashaToday.progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>{horoscope.summary.currentDashaToday.startDate} ({isTamil ? 'துவக்கம்' : 'Start'})</span>
                  <span>{horoscope.summary.currentDashaToday.endDate} ({isTamil ? 'முடிவு' : 'End'})</span>
                </div>
              </div>
            </div>
          )}"""

if old_s6_block in thv:
    thv = thv.replace(old_s6_block, new_s6_block)

# 3. Add Age at End pill to Mahadasha button
old_md_dates = """                    <div className="flex items-center gap-2 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{md.startDate}</span>
                      <span>➔</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{md.endDate}</span>
                    </div>"""

new_md_dates = """                    <div className="flex items-center gap-2 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                      {md.ageAtEnd && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-300 border border-amber-300 dark:border-stone-700">
                          {isTamil ? `முடிவு வயது: ${md.ageAtEnd.textTa}` : `Age at End: ${md.ageAtEnd.textEn}`}
                        </span>
                      )}
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{md.startDate}</span>
                      <span>➔</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{md.endDate}</span>
                    </div>"""

if old_md_dates in thv:
    thv = thv.replace(old_md_dates, new_md_dates)

# 4. Enhance Bhukti card to add Age at End, Duration, Antaras button, and expandable Antaras Grid
old_bh_card = """                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-[#7A1A22] dark:text-amber-200 text-[11.5px]">
                                  {bIdx + 1}. {isTamil ? `${md.lord.nameTa} - ${bh.bhuktiLord.nameTa}` : `${md.lord.nameEn} - ${bh.bhuktiLord.nameEn}`}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                                  {isTamil ? bh.duration.textTa : bh.duration.textEn}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10.5px] font-mono text-stone-600 dark:text-stone-400">
                                <span>{bh.startDate}</span>
                                <span>➔</span>
                                <span>{bh.endDate}</span>
                              </div>

                              {/* Bhukti status pill */}
                              <div className="flex items-center justify-end pt-0.5">
                                {isOngoingToday && (
                                  <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-emerald-600 text-white flex items-center gap-0.5">
                                    <span>🌟</span>
                                    <span>{T.bhuktiCurrentToday}</span>
                                  </span>
                                )}
                                {!isOngoingToday && isOngoingAtBirth && (
                                  <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-amber-500 text-white flex items-center gap-0.5">
                                    <span>👶</span>
                                    <span>{T.bhuktiOngoingAtBirth}</span>
                                  </span>
                                )}
                                {!isOngoingToday && !isOngoingAtBirth && isPastAtBirth && (
                                  <span className="text-[9px] px-1 py-0.2 rounded text-stone-400">
                                    {T.bhuktiPriorToBirth}
                                  </span>
                                )}
                                {!isOngoingToday && !isPastAtBirth && bh.isPastToday && (
                                  <span className="text-[9px] px-1 py-0.2 rounded text-stone-400">
                                    {T.completedStatus}
                                  </span>
                                )}
                              </div>
                            </div>"""

new_bh_card = """                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-[#7A1A22] dark:text-amber-200 text-[11.5px]">
                                  {bIdx + 1}. {isTamil ? `${md.lord.nameTa} - ${bh.bhuktiLord.nameTa}` : `${md.lord.nameEn} - ${bh.bhuktiLord.nameEn}`}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                                    {isTamil ? bh.duration.textTa : bh.duration.textEn}
                                  </span>
                                  {bh.ageAtEnd && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-stone-800 border border-amber-300 dark:border-stone-700 text-[#7A1A22] dark:text-amber-300 font-semibold">
                                      {isTamil ? `வயது: ${bh.ageAtEnd.textTa}` : `Age: ${bh.ageAtEnd.textEn}`}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[10.5px] font-mono text-stone-600 dark:text-stone-400">
                                <span>{bh.startDate}</span>
                                <span>➔</span>
                                <span>{bh.endDate}</span>
                              </div>

                              {/* Bhukti status pill & Antaras Button */}
                              <div className="flex items-center justify-between pt-0.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const key = `${md.lord.id}-${bh.bhuktiLord.id}`;
                                    setExpandedBhuktiKey(expandedBhuktiKey === key ? null : key);
                                  }}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/60 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1A22] dark:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>⚡</span>
                                  <span>{isTamil ? 'அந்தரங்கள் (9)' : 'Antaras (9)'}</span>
                                  <span>{expandedBhuktiKey === `${md.lord.id}-${bh.bhuktiLord.id}` ? '▲' : '▼'}</span>
                                </button>

                                <div>
                                  {isOngoingToday && (
                                    <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-emerald-600 text-white flex items-center gap-0.5 shadow-2xs">
                                      <span>🌟</span>
                                      <span>{T.bhuktiCurrentToday}</span>
                                    </span>
                                  )}
                                  {!isOngoingToday && isOngoingAtBirth && (
                                    <span className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-amber-500 text-white flex items-center gap-0.5">
                                      <span>👶</span>
                                      <span>{T.bhuktiOngoingAtBirth}</span>
                                    </span>
                                  )}
                                  {!isOngoingToday && !isOngoingAtBirth && isPastAtBirth && (
                                    <span className="text-[9px] px-1 py-0.2 rounded text-stone-400">
                                      {T.bhuktiPriorToBirth}
                                    </span>
                                  )}
                                  {!isOngoingToday && !isPastAtBirth && bh.isPastToday && (
                                    <span className="text-[9px] px-1 py-0.2 rounded text-stone-400">
                                      {T.completedStatus}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* LEVEL 3 ANTARAS BREAKDOWN GRID */}
                              {expandedBhuktiKey === `${md.lord.id}-${bh.bhuktiLord.id}` && bh.antaras && (
                                <div className="p-2.5 bg-white dark:bg-[#1A1513] rounded-lg border border-amber-900/20 shadow-xs space-y-2 mt-1">
                                  <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
                                    <span className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1">
                                      <span>⚡</span>
                                      <span>{isTamil ? `${bh.bhuktiLord.nameTa} புக்தியின் 9 அந்தரங்கள்:` : `9 Antaras of ${bh.bhuktiLord.nameEn}:`}</span>
                                    </span>
                                    <span className="text-[9.5px] text-stone-500 font-mono">
                                      {isTamil ? 'சூட்சும காலம் (Antaras)' : 'Sub-Sub Periods'}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 gap-1.5">
                                    {bh.antaras.map((an, aIdx) => {
                                      let anBg = 'bg-stone-50/70 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800';
                                      if (an.isOngoingToday) {
                                        anBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold ring-1 ring-emerald-400';
                                      } else if (an.isPastToday) {
                                        anBg = 'bg-stone-100/40 dark:bg-stone-900/20 border-stone-200 opacity-60';
                                      }

                                      return (
                                        <div key={an.lord.id} className={`p-1.5 rounded border text-[10.5px] flex items-center justify-between gap-1.5 ${anBg}`}>
                                          <div className="flex items-center gap-1 min-w-[70px]">
                                            <span className="text-stone-400 text-[9.5px]">{aIdx + 1}.</span>
                                            <span className="font-bold text-[#7A1A22] dark:text-amber-200">
                                              {isTamil ? an.lord.nameTa : an.lord.nameEn}
                                            </span>
                                          </div>

                                          <div className="font-mono text-[10px] text-stone-600 dark:text-stone-400">
                                            <span>{an.startDate}</span> ➔ <span>{an.endDate}</span>
                                          </div>

                                          <div className="flex items-center gap-1 shrink-0">
                                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500">
                                              {an.durationDays}{isTamil ? 'நா' : 'd'}
                                            </span>
                                            {an.isOngoingToday && (
                                              <span className="text-[8.5px] px-1 py-0.2 rounded font-bold bg-emerald-600 text-white shrink-0">
                                                {isTamil ? 'நடப்பு' : 'Live'}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>"""

if old_bh_card in thv:
    thv = thv.replace(old_bh_card, new_bh_card)

with open('frontend/src/components/ThirukanithaHoroscopeView.jsx', 'w', encoding='utf-8') as f:
    f.write(thv)
print("ThirukanithaHoroscopeView.jsx successfully updated with Live Tracker, Age pills, and Antaras!")
