import re

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\components\ThirukanithaHoroscopeView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update openSections initial state to include 11: true
content = content.replace('10: true\n  });', '10: true,\n    11: true\n  });')

# 2. Update expandAllSections and collapseAllSections
content = content.replace(
    'setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true });',
    'setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true });'
)
content = content.replace(
    'setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false });',
    'setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false });'
)

# 3. Add upagrahaTab state if not present
state_target = 'const [horaDayNightFilter, setHoraDayNightFilter] = useState(\'all\'); // \'all\' | \'day\' | \'night\''
if state_target in content:
    content = content.replace(
        state_target,
        state_target + '\n  const [upagrahaTab, setUpagrahaTab] = useState(\'all\'); // \'all\' | \'gulikaadi\' | \'dhumadi\''
    )
    print('Added upagrahaTab state.')

# 4. Update master select options:
old_select_header = '<option value="">{isTamil ? \'-- 10 பிரிவுகள் பட்டியல் (தேர்வு செய்க) --\' : \'-- Select Section to Jump --\'}</option>'
new_select_header = '<option value="">{isTamil ? \'-- 11 பிரிவுகள் பட்டியல் (தேர்வு செய்க) --\' : \'-- Select Section to Jump (1 to 11) --\'}</option>'
content = content.replace(old_select_header, new_select_header)

old_opt_10 = '<option value="10">10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்</option>'
new_opt_10_11 = '''<option value="10">10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்</option>
              <option value="11">11. உபகிரகங்கள் - குளிகாதி & தூமாதி ஐவர் விபரங்கள்</option>'''
content = content.replace(old_opt_10, new_opt_10_11)
print('Updated dropdown jumper.')

# 5. Add Section 11 right before {/* Footer */}
sec11_jsx = '''
        {/* ======================================================== */}
        {/* ITEM 11: 11. உபகிரகங்கள் - குளிகாதி ஐவர் & தூமாதி ஐவர் விபரங்கள் (11. Upagrahas - Gulikaadi & Dhumadi Details) */}
        {/* ======================================================== */}
        <div id="horoscope-section-11" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(11)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                11
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🪐</span>
                  <span>{isTamil ? '11. உபகிரகங்கள் - குளிகாதி ஐவர் & தூமாதி ஐவர் விபரங்கள்' : '11. Secondary Planets (Upagrahas) - Gulikaadi & Dhumadi Details'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'பராசரர் மற்றும் காளிதாஸர் முறைப்படி 5 குளிகாதி உபகிரகங்கள் மற்றும் 5 தூமாதி உபகிரகங்கள் ஸ்புடக் கணிதம்' : 'Mathematical Longitudes of Gulikaadi 5 and Dhumadi 5 Secondary Planets (Parashara & Kalidasa Methods)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/40 text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                {isTamil ? '10 உபகிரகங்கள்' : '10 Upagrahas'}
              </span>
              <span className={`w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-200 flex items-center justify-center text-xs transition-transform duration-200 ${openSections[11] ? 'rotate-180' : 'rotate-0'}`}>
                ▼
              </span>
            </div>
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[11] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-6">
              {/* Introduction Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 dark:bg-stone-900/50 border border-amber-900/10 dark:border-amber-500/15 text-xs text-stone-700 dark:text-stone-300 leading-relaxed space-y-1.5">
                <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>{isTamil ? 'வேத ஜோதிட உபகிரகக் கணிதக் கோட்பாடுகள்' : 'Classical Vedic Upagraha Calculation Principles'}</span>
                </div>
                <p>
                  {isTamil
                    ? 'ஒவ்வொரு முதன்மை கிரகத்திற்கும் துணை உபகிரகங்கள் உண்டு. ஒரு தினத்தின் ஜனன அடிப்படையில் பகல் அல்லது இரவு அகஸ் காலத்தை எட்டு சம பிரிவுகளாக்கி (கண்டங்கள்), பராசரர் முறைப்படி கண்டத்தின் ஆரம்ப நேரத்தையும், காளிதாஸர் (உத்தர காலாமிர்தம்) முறைப்படி கண்டத்தின் முடிவு நேரத்தையும் லக்ன உதய நேரமாகக் கொண்டு குளிகாதி ஐவர் ஸ்புடங்கள் கணிக்கப்படுகின்றன.'
                    : 'Each principal planet has corresponding secondary non-luminous planets (Upagrahas). By dividing the Day (Dinamana) or Night (Ratrimana) into 8 equal parts (khandas), the rising Lagna at the Start time (Parashara method) and End time (Kalidasa / Uttara Kalamrita method) determine the Gulikaadi Five positions.'}
                </p>
                <p>
                  {isTamil
                    ? 'தூமாதி ஐவர் ஸ்புடங்கள் சூரியனின் துல்லிய நிராயண பாகையை அடிப்படையாகக் கொண்டு வேத சூத்திரங்களால் கணிக்கப்படுகின்றன.'
                    : 'The Dhumadi Five Upagrahas are directly calculated from the Nirayana longitude of the Sun using classical Parashara mathematical formulas.'}
                </p>
              </div>

              {/* Sub-Tabs: All | Gulikaadi | Dhumadi */}
              <div className="flex items-center gap-2 border-b border-amber-900/10 dark:border-stone-800 pb-2">
                <button
                  type="button"
                  onClick={() => setUpagrahaTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    upagrahaTab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? 'அனைத்து உபகிரகங்கள் (10)' : 'All Upagrahas (10)'}
                </button>
                <button
                  type="button"
                  onClick={() => setUpagrahaTab('gulikaadi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    upagrahaTab === 'gulikaadi'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '1. குளிகாதி ஐவர் (5)' : '1. Gulikaadi Five (5)'}
                </button>
                <button
                  type="button"
                  onClick={() => setUpagrahaTab('dhumadi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    upagrahaTab === 'dhumadi'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '2. தூமாதி ஐவர் (5)' : '2. Dhumadi Five (5)'}
                </button>
              </div>

              {/* PART A: GULIKAADI FIVE (குளிகாதி ஐவர் விபரங்கள்) */}
              {(upagrahaTab === 'all' || upagrahaTab === 'gulikaadi') && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                        <span>🪐</span>
                        <span>{isTamil ? 'உபகிரகங்கள் - குளிகாதி ஐவர் விபரங்கள்' : 'Gulikaadi Five Upagrahas - Timing & Sphutas'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil
                          ? 'பராசரர் முறை (ஆரம்ப நேர லக்னம்) vs காளிதாஸர் முறை (முடிவு நேர லக்னம்) ஒப்பீட்டு ஆய்வு'
                          : 'Comparison between Parashara Method (Start Time Lagna) and Kalidasa Method (End Time Lagna)'}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EF] dark:bg-[#1A1513] text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'உப கிரகம்' : 'Upagraha'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'அதிபதி கிரகம்' : 'Ruling Planet'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'கால எல்லை (ஆரம்பம் ➔ முடிவு)' : 'Khanda Period (Start ➔ End)'}</th>
                          <th className="py-2.5 px-3 bg-amber-50/60 dark:bg-stone-900/40 border-l border-amber-900/10 dark:border-amber-500/15">
                            <div className="text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? 'பராசரர் முறை (ஆரம்பம்)' : 'Parashara Method (Start)'}</div>
                            <div className="text-[9px] font-normal text-stone-500">{isTamil ? 'ராசி / பாகை / நட்சத்திரம் / பாதம்' : 'Rasi / Deg DMS / Star / Pada'}</div>
                          </th>
                          <th className="py-2.5 px-3 bg-rose-50/50 dark:bg-stone-900/60 border-l border-amber-900/10 dark:border-amber-500/15">
                            <div className="text-[11px] font-bold text-rose-900 dark:text-rose-300">{isTamil ? 'காளிதாஸர் முறை (முடிவு)' : 'Kalidasa Method (End)'}</div>
                            <div className="text-[9px] font-normal text-stone-500">{isTamil ? 'ராசி / பாகை / நட்சத்திரம் / பாதம்' : 'Rasi / Deg DMS / Star / Pada'}</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 bg-white/50 dark:bg-[#201A17]">
                        {horoscope.upagrahas?.gulikaadi?.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{item.symbol}</span>
                                <div>
                                  <div className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.nameTa : item.nameEn}</div>
                                  <div className="text-[10px] text-stone-500">{isTamil ? `கண்டம் எண் ${item.slotNum}` : `Khanda #${item.slotNum}`}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-[11px] text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? item.lordTa : item.lordEn}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-stone-700 dark:text-stone-300">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{item.startTime}</span>
                              <span className="mx-1 text-stone-400">➔</span>
                              <span className="font-semibold text-rose-700 dark:text-rose-400">{item.endTime}</span>
                            </td>
                            <td className="py-2.5 px-3 bg-amber-50/30 dark:bg-stone-900/20 border-l border-amber-900/10 dark:border-amber-500/15 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.parashara.rasiTa : item.parashara.rasiEn}</span>
                                <span className="font-mono text-[11px] text-amber-900 dark:text-amber-200 font-semibold">{item.parashara.degDMS}</span>
                              </div>
                              <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                {isTamil ? `${item.parashara.nakTa} பாதம் ${item.parashara.pada}` : `${item.parashara.nakEn} Pada ${item.parashara.pada}`}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 bg-rose-50/20 dark:bg-stone-900/30 border-l border-amber-900/10 dark:border-amber-500/15 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.kalidasa.rasiTa : item.kalidasa.rasiEn}</span>
                                <span className="font-mono text-[11px] text-rose-900 dark:text-rose-200 font-semibold">{item.kalidasa.degDMS}</span>
                              </div>
                              <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                {isTamil ? `${item.kalidasa.nakTa} பாதம் ${item.kalidasa.pada}` : `${item.kalidasa.nakEn} Pada ${item.kalidasa.pada}`}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PART B: DHUMADI FIVE (தூமாதி ஐவர் ஸ்புடங்கள்) */}
              {(upagrahaTab === 'all' || upagrahaTab === 'dhumadi') && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                        <span>☀️</span>
                        <span>{isTamil ? 'உபகிரகங்கள் - தூமாதி ஐவர் ஸ்புடங்கள்' : 'Dhumadi Five Upagrahas - Solar Derived Sphutas'}</span>
                      </h3>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400">
                        {isTamil
                          ? 'சூரியனின் நிராயண பாகையைக் கொண்டு தூமாதி ஐவர் ஸ்புடங்கள் கணிக்கப்பெறுகின்றன'
                          : 'Calculated directly from the Nirayana longitude of the Sun'}
                      </p>
                    </div>
                    {horoscope.upagrahas?.sunNirayana && (
                      <div className="px-3 py-1 rounded-lg bg-amber-100/80 dark:bg-stone-800 border border-amber-900/20 text-xs font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                        <span>☉ {isTamil ? 'சூரியன் ஸ்புடம்' : 'Sun Nirayana'}:</span>
                        <span className="font-mono">{horoscope.upagrahas.sunNirayana.rasiTa} {horoscope.upagrahas.sunNirayana.degDMS}</span>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EF] dark:bg-[#1A1513] text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'உப கிரகம்' : 'Upagraha'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'அதிபதி' : 'Ruling Planet'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'கணித முறை / சூத்திரம்' : 'Calculation Formula'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'ராசி' : 'Rasi / Sign'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'பாகை - கலை - விகலை' : 'Deg - Min - Sec'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'பாதம்' : 'Pada'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 bg-white/50 dark:bg-[#201A17]">
                        {horoscope.upagrahas?.dhumadi?.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/30 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{item.symbol}</span>
                                <span className="font-bold text-stone-900 dark:text-stone-100">{isTamil ? item.nameTa : item.nameEn}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 font-bold text-[11px] text-[#7A1A22] dark:text-amber-300">
                                {isTamil ? item.lordTa : item.lordEn}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="font-mono text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                                {isTamil ? item.formulaTa : item.formulaEn}
                              </div>
                              <div className="text-[10px] text-stone-500">
                                {isTamil ? item.ruleDetailTa : item.formulaEn}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-bold text-stone-900 dark:text-stone-100">
                              {isTamil ? item.rasiTa : item.rasiEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-stone-800 dark:text-stone-200 font-bold">
                              {item.degDMS}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-stone-700 dark:text-stone-300">
                              {isTamil ? item.nakTa : item.nakEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-[#7A1A22] dark:text-amber-300">
                              {item.pada}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Maharishi Parashara Verification Rule Box */}
                  {horoscope.upagrahas?.verificationRule && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-600/30 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                          <span className="text-base">✓</span>
                          <span>{isTamil ? 'பராசரர் கணித சரிபார்ப்பு விதி (Verification Rule):' : 'Parashara Mathematical Verification Rule:'}</span>
                          <span className="font-mono px-2 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-[11px]">
                            {isTamil ? horoscope.upagrahas.verificationRule.formulaTa : horoscope.upagrahas.verificationRule.formulaEn}
                          </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-300 text-[11px]">
                          {isTamil ? horoscope.upagrahas.verificationRule.textTa : horoscope.upagrahas.verificationRule.textEn}
                        </p>
                      </div>
                      <div className="shrink-0 font-mono text-[11px] bg-white dark:bg-stone-900 px-3 py-2 rounded-lg border border-emerald-500/20 shadow-2xs space-y-0.5">
                        <div className="text-stone-600 dark:text-stone-400">உபகேது: <span className="font-bold text-stone-800 dark:text-stone-200">{horoscope.upagrahas.verificationRule.upaketuDeg}</span></div>
                        <div className="text-stone-600 dark:text-stone-400">+ 30° = <span className="font-bold text-emerald-700 dark:text-emerald-300">{horoscope.upagrahas.verificationRule.plus30Deg}</span></div>
                        <div className="text-stone-600 dark:text-stone-400">சூரியன்: <span className="font-bold text-[#7A1A22] dark:text-amber-300">{horoscope.upagrahas.verificationRule.sunDeg}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
'''

footer_target = '{/* Footer */}'
if footer_target in content:
    content = content.replace(footer_target, sec11_jsx + '\n' + footer_target)
    print('Inserted Section 11 before Footer.')
else:
    print('Could not find Footer!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Saved updated ThirukanithaHoroscopeView.jsx.')
