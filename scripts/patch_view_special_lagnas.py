import re

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\components\ThirukanithaHoroscopeView.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update openSections initial state to include 12: true
content = content.replace('11: true\n  });', '11: true,\n    12: true\n  });')

# 2. Update expandAllSections and collapseAllSections
content = content.replace(
    'setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true });',
    'setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true });'
)
content = content.replace(
    'setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false });',
    'setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false, 11: false, 12: false });'
)

# 3. Add specialLagnaTab state
state_target = "const [upagrahaTab, setUpagrahaTab] = useState('all'); // 'all' | 'gulikaadi' | 'dhumadi'"
if state_target in content:
    content = content.replace(
        state_target,
        state_target + "\n  const [specialLagnaTab, setSpecialLagnaTab] = useState('all'); // 'all' | 'lagnas' | 'sphutas' | 'karmic'"
    )
    print('Added specialLagnaTab state.')

# 4. Update master select options:
old_select_header = '<option value="">{isTamil ? \'-- 11 பிரிவுகள் பட்டியல் (தேர்வு செய்க) --\' : \'-- Select Section to Jump (1 to 11) --\'}</option>'
new_select_header = '<option value="">{isTamil ? \'-- 12 பிரிவுகள் பட்டியல் (தேர்வு செய்க) --\' : \'-- Select Section to Jump (1 to 12) --\'}</option>'
content = content.replace(old_select_header, new_select_header)

old_opt_11 = '<option value="11">11. உபகிரகங்கள் - குளிகாதி & தூமாதி ஐவர் விபரங்கள்</option>'
new_opt_11_12 = '''<option value="11">11. உபகிரகங்கள் - குளிகாதி & தூமாதி ஐவர் விபரங்கள்</option>
              <option value="12">12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்</option>'''
content = content.replace(old_opt_11, new_opt_11_12)
print('Updated dropdown jumper for Section 12.')

# 5. Insert Section 12 right after Section 11 and before Footer
sec12_jsx = '''
        {/* ======================================================== */}
        {/* ITEM 12: 12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள் (12. Special Lagnas & Sensitive Sphutas) */}
        {/* ======================================================== */}
        <div id="horoscope-section-12" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(12)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                12
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>🔮</span>
                  <span>{isTamil ? '12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்' : '12. Special Lagnas & Sensitive Sphutas Analysis'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? 'விசேஷ லக்னங்கள் (ஹோரா, ஆரூட, கடிகா, இந்து, பாவ, ஸ்ரீ) மற்றும் யோகி, அவயோகி, பீஜ ஸ்புடம், 22-ம் திரேக்காணம், 64-ம் நவாம்சம்' : 'Special Lagnas (Hora, Arudha, Ghatika, Indu, Bhava, Shree) & Yogi, Avayogi, Beeja, 22nd Drekkana, 64th Navamsha'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-purple-100/70 dark:bg-purple-950/40 text-[11px] font-bold text-purple-800 dark:text-purple-300">
                {isTamil ? '12 முக்கிய ஸ்புடங்கள்' : '12 Special Sphutas'}
              </span>
              <span className={`w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-200 flex items-center justify-center text-xs transition-transform duration-200 ${openSections[12] ? 'rotate-180' : 'rotate-0'}`}>
                ▼
              </span>
            </div>
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[12] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-6">
              {/* Introduction Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-purple-50/70 dark:bg-stone-900/50 border border-purple-900/10 dark:border-purple-500/15 text-xs text-stone-700 dark:text-stone-300 leading-relaxed space-y-1.5">
                <div className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>{isTamil ? 'வேத ஜோதிட விசேஷ லக்னங்கள் & சூட்சும ஸ்புடக் கோட்பாடுகள்' : 'Vedic Principles of Special Lagnas and Sensitive Sphutas'}</span>
                </div>
                <p>
                  {isTamil
                    ? 'மகரிஷி பராசரர் மற்றும் ஜைமினி மகரிஷி முறைப்படி, மனித வாழ்க்கையின் குறிப்பிட்ட பலன்களை ஆராய விசேஷ லக்னங்கள் பயன்படுகின்றன: தன வரவிற்கு ஹோரா லக்னம், சமூக அந்தஸ்திற்கு ஆரூட லக்னம், அதிகார பதவிக்கு கடிகா லக்னம், அழியாச் செல்வ யோகத்திற்கு இந்து லக்னம், ஆயுள் ஆரோக்கியத்திற்கு பாவ லக்னம் மற்றும் மாங்கல்ய பாக்கியத்திற்கு ஸ்ரீ லக்னம் ஆகியவை கணிக்கப்படுகின்றன.'
                    : 'According to Maharishi Parashara and Jaimini Maharishi, Special Lagnas reveal specific life spheres: Hora Lagna for financial flow, Arudha Lagna for societal status, Ghatika Lagna for authority and power, Indu Lagna for wealth fortunes, Bhava Lagna for vitality, and Shree Lagna for Lakshmi Kataksham.'}
                </p>
                <p>
                  {isTamil
                    ? 'மேலும் ஜாதகத்தின் அதிர்ஷ்டத்தை நிர்ணயிக்கும் யோகி, அவயோகி, பீஜ ஸ்புடம் மற்றும் ஆயுள் சூட்சுமங்களை உணர்த்தும் 22-ம் திரேக்காணம், 64-ம் நவாம்சம் ஆகிய முக்கிய பாகைகள் கீழே வழங்கப்பட்டுள்ளன.'
                    : 'Key karmic indices including Yogi, Avayogi, Beeja Sphuta (fertility vitality), Pars Fortuna, 22nd Drekkana, and 64th Navamsha are computed below.'}
                </p>
              </div>

              {/* Sub-Tabs: All | Lagnas | Sphutas | Karmic */}
              <div className="flex flex-wrap items-center gap-2 border-b border-amber-900/10 dark:border-stone-800 pb-2">
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'all'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? 'அனைத்து விபரங்கள்' : 'All Details'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('lagnas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'lagnas'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '1. விசேஷ லக்னங்கள் (6)' : '1. Special Lagnas (6)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('sphutas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'sphutas'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '2. அதிர்ஷ்ட யோக ஸ்புடங்கள் (6)' : '2. Prosperity Sphutas (6)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSpecialLagnaTab('karmic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    specialLagnaTab === 'karmic'
                      ? 'bg-[#7A1A22] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isTamil ? '3. ஆயுள் & கர்ம சூட்சுமங்கள் (7)' : '3. Karmic Points (7)'}
                </button>
              </div>

              {/* PART 1: SPECIAL LAGNAS (விசேஷ லக்னங்கள்) */}
              {(specialLagnaTab === 'all' || specialLagnaTab === 'lagnas') && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>👑</span>
                      <span>{isTamil ? 'விசேஷ லக்னங்கள் அட்டவணை (Special Lagnas Table)' : 'Special Lagnas (Hora, Arudha, Ghatika, Indu, Bhava, Shree)'}</span>
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isTamil
                        ? 'பராசரர் மற்றும் ஜைமினி மகரிஷி அருளிய 6 சூட்சும விசேஷ லக்னங்களின் துல்லிய பாகைகள் மற்றும் பலன்கள்'
                        : 'Precision calculations and functional significance of the 6 Classical Special Lagnas'}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-amber-900/15 dark:border-amber-500/20 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF6EF] dark:bg-[#1A1513] text-[#7A1A22] dark:text-amber-200 font-bold border-b border-amber-900/15 dark:border-amber-500/20">
                        <tr>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'லக்னம்' : 'Special Lagna'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'அதிபதி' : 'Ruling Planet'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'ராசி' : 'Rasi / Sign'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'பாகை - கலை - விகலை' : 'Deg - Min - Sec'}</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">{isTamil ? 'நட்சத்திரம் / பாதம்' : 'Nakshatra / Pada'}</th>
                          <th className="py-2.5 px-3">{isTamil ? 'முக்கியத்துவம் & பலன்கள்' : 'Significance & Functional Areas'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-900/10 dark:divide-stone-800 bg-white/50 dark:bg-[#201A17]">
                        {horoscope.specialLagnas?.specialLagnas?.map((item, idx) => (
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
                            <td className="py-2.5 px-3 whitespace-nowrap font-bold text-stone-900 dark:text-stone-100">
                              {isTamil ? item.rasiTa : item.rasiEn}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-indigo-700 dark:text-indigo-400">
                              {item.degDMS}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-stone-700 dark:text-stone-300">
                              {item.nakTa ? `${isTamil ? item.nakTa : item.nakEn} (${item.pada})` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400 text-[11px] max-w-xs">
                              {isTamil ? item.purposeTa : item.purposeEn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PART 2: PROSPERITY SPHUTAS (அதிர்ஷ்ட & யோக ஸ்புடங்கள்) */}
              {(specialLagnaTab === 'all' || specialLagnaTab === 'sphutas') && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>🌟</span>
                      <span>{isTamil ? 'அதிர்ஷ்ட & யோக ஸ்புடங்கள் (Prosperity & Fortune Sphutas)' : 'Auspicious Sphutas (Yogi, Avayogi, Beeja, Fortuna)'}</span>
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isTamil
                        ? 'யோகி பாகை, அவயோகி பாகை, மாற்று யோகி, பீஜ ஸ்புடம், அதிர்ஷ்டப் பாகை மற்றும் 5-ம் பாவ பலம்'
                        : 'Yogi, Avayogi, Sahayogi, Beeja Sphuta, Pars Fortuna, and 5th House Strengths'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Yogi Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.yogi && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/30 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                            <span>🌟</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.yogi.nameTa : horoscope.specialLagnas.auspiciousSphutas.yogi.nameEn}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/60 font-bold text-[10px] text-emerald-900 dark:text-emerald-200">
                            {isTamil ? `அதிபதி: ${horoscope.specialLagnas.auspiciousSphutas.yogi.lordTa}` : `Lord: ${horoscope.specialLagnas.auspiciousSphutas.yogi.lordEn}`}
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                          {horoscope.specialLagnas.auspiciousSphutas.yogi.rasiTa} {horoscope.specialLagnas.auspiciousSphutas.yogi.degDMS}
                        </div>
                        <div className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                          {isTamil ? `நட்சத்திரம்: ${horoscope.specialLagnas.auspiciousSphutas.yogi.nakTa} பாதம் ${horoscope.specialLagnas.auspiciousSphutas.yogi.pada}` : `${horoscope.specialLagnas.auspiciousSphutas.yogi.nakEn} Pada ${horoscope.specialLagnas.auspiciousSphutas.yogi.pada}`}
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.yogi.notesTa : horoscope.specialLagnas.auspiciousSphutas.yogi.notesEn}
                        </p>
                      </div>
                    )}

                    {/* Avayogi Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.avayogi && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-500/30 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                            <span>⚠️</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.avayogi.nameTa : horoscope.specialLagnas.auspiciousSphutas.avayogi.nameEn}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 font-bold text-[10px] text-amber-900 dark:text-amber-200">
                            {isTamil ? `அதிபதி: ${horoscope.specialLagnas.auspiciousSphutas.avayogi.lordTa}` : `Lord: ${horoscope.specialLagnas.auspiciousSphutas.avayogi.lordEn}`}
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                          {horoscope.specialLagnas.auspiciousSphutas.avayogi.rasiTa} {horoscope.specialLagnas.auspiciousSphutas.avayogi.degDMS}
                        </div>
                        <div className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">
                          {isTamil ? `நட்சத்திரம்: ${horoscope.specialLagnas.auspiciousSphutas.avayogi.nakTa} பாதம் ${horoscope.specialLagnas.auspiciousSphutas.avayogi.pada}` : `${horoscope.specialLagnas.auspiciousSphutas.avayogi.nakEn} Pada ${horoscope.specialLagnas.auspiciousSphutas.avayogi.pada}`}
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.avayogi.notesTa : horoscope.specialLagnas.auspiciousSphutas.avayogi.notesEn}
                        </p>
                      </div>
                    )}

                    {/* Sahayogi & Fortuna Card */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-500/30 shadow-2xs space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 text-xs flex items-center gap-1">
                            <span>🌕</span>
                            <span>{isTamil ? 'மாற்று யோகி (Sahayogi):' : 'Sahayogi:'}</span>
                          </span>
                          <span className="font-bold text-indigo-800 dark:text-indigo-200 text-xs px-2 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900/40">
                            {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.planetTa : horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.planetEn}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400">
                          {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.notesTa : horoscope.specialLagnas?.auspiciousSphutas?.sahayogi?.notesEn}
                        </p>
                      </div>

                      <div className="border-t border-indigo-200 dark:border-indigo-800/40 pt-1.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 text-xs flex items-center gap-1">
                            <span>🎯</span>
                            <span>{isTamil ? 'அதிர்ஷ்டப் பாகை (Fortuna):' : 'Pars Fortuna:'}</span>
                          </span>
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200 text-xs">
                            {horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.rasiTa} {horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.degDMS}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400">
                          {isTamil ? horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.notesTa : horoscope.specialLagnas?.auspiciousSphutas?.fortuna?.notesEn}
                        </p>
                      </div>
                    </div>

                    {/* Beeja Sphuta Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.beeja && (
                      <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-500/30 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5 text-xs">
                            <span>🌱</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.beeja.nameTa : horoscope.specialLagnas.auspiciousSphutas.beeja.nameEn}</span>
                          </span>
                          <span className="font-mono font-bold text-rose-800 dark:text-rose-200 text-xs">
                            {horoscope.specialLagnas.auspiciousSphutas.beeja.degDMS}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono font-semibold text-stone-700 dark:text-stone-300">
                          {isTamil ? `சூத்திரம்: ${horoscope.specialLagnas.auspiciousSphutas.beeja.formulaTa}` : `Formula: ${horoscope.specialLagnas.auspiciousSphutas.beeja.formulaEn}`}
                        </div>
                        <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-tight">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.beeja.notesTa : horoscope.specialLagnas.auspiciousSphutas.beeja.notesEn}
                        </p>
                      </div>
                    )}

                    {/* 5th House Strengths Card */}
                    {horoscope.specialLagnas?.auspiciousSphutas?.fifthHouseStrength && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-stone-900/40 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1.5 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5 text-xs">
                            <span>👶</span>
                            <span>{isTamil ? horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.nameTa : horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.nameEn}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-xs">
                          <div className="p-1.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'சுப பலம்' : 'Subha Bala'}</div>
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.subhaBalam}</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-rose-100/60 dark:bg-rose-950/40 border border-rose-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'அசுப பலம்' : 'Asubha Bala'}</div>
                            <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.asubhaBalam}</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'சுப ஆதிப்பத்தியம்' : 'Subha Lordship'}</div>
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.subhaAdhipatyam}</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-rose-100/60 dark:bg-rose-950/40 border border-rose-500/20">
                            <div className="text-[10px] text-stone-500">{isTamil ? 'அசுப ஆதிப்பத்தியம்' : 'Asubha Lordship'}</div>
                            <div className="font-bold text-rose-800 dark:text-rose-300 text-sm">{horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.asubhaAdhipatyam}</div>
                          </div>
                        </div>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium pt-0.5">
                          {isTamil ? horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.ratioTa : horoscope.specialLagnas.auspiciousSphutas.fifthHouseStrength.ratioEn}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PART 3: KARMIC & CRITICAL POINTS (ஆயுள் & கர்ம சூட்சுமங்கள்) */}
              {(specialLagnaTab === 'all' || specialLagnaTab === 'karmic') && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>{isTamil ? 'ஆயுள் & கர்ம சூட்சும புள்ளிகள் (Karmic & Critical Vulnerability Points)' : 'Karmic Points (22nd Drekkana, 64th Navamsha, Sarpa Drekkana, Andhakamsa)'}</span>
                    </h3>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      {isTamil
                        ? '22-ம் திரேக்காணம், 64-ம் நவாம்சம், சர்ப்ப திரேக்காணம், அந்தகாம்சம் மற்றும் மிருத்யு பாகை நிலைப்பாடுகள்'
                        : 'Critical transit triggers and planetary vulnerability indicators'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* 22nd Drekkana */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">⚔️ 22-ம் திரேக்காணம்</span>
                        <span className="font-bold text-[#7A1A22] dark:text-amber-300 font-mono">{horoscope.specialLagnas?.karmicPoints?.drekkana22?.rasiTa}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? `அதிபதி: ${horoscope.specialLagnas?.karmicPoints?.drekkana22?.lordTa}` : `Lord: ${horoscope.specialLagnas?.karmicPoints?.drekkana22?.lordEn}`}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.drekkana22?.notesTa : horoscope.specialLagnas?.karmicPoints?.drekkana22?.notesEn}
                      </p>
                    </div>

                    {/* 64th Navamsha */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">🛡️ 64-ம் நவாம்சம்</span>
                        <span className="font-bold text-[#7A1A22] dark:text-amber-300 font-mono">{horoscope.specialLagnas?.karmicPoints?.navamsha64?.rasiTa}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? `அதிபதி: ${horoscope.specialLagnas?.karmicPoints?.navamsha64?.lordTa}` : `Lord: ${horoscope.specialLagnas?.karmicPoints?.navamsha64?.lordEn}`}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.navamsha64?.notesTa : horoscope.specialLagnas?.karmicPoints?.navamsha64?.notesEn}
                      </p>
                    </div>

                    {/* Sarpa Drekkana */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">🐍 சர்ப்ப திரேக்காணம்</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.planetTa}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? 'அமைந்துள்ள கிரகம்' : 'Occupying Planet'}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.notesTa : horoscope.specialLagnas?.karmicPoints?.sarpaDrekkana?.notesEn}
                      </p>
                    </div>

                    {/* Andhakamsa */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">👁️ அந்தகாம்சம்</span>
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 font-mono">{horoscope.specialLagnas?.karmicPoints?.andhakamsa?.planetsTa}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{isTamil ? 'அமைந்துள்ள கிரகம்' : 'Occupying Planet'}</div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.andhakamsa?.notesTa : horoscope.specialLagnas?.karmicPoints?.andhakamsa?.notesEn}
                      </p>
                    </div>

                    {/* Pushkaramsha */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">✨ புஷ்கராம்சம்</span>
                        <span className="font-bold text-stone-500 font-mono">{horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.planetsTa}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.notesTa : horoscope.specialLagnas?.karmicPoints?.pushkaramsha?.notesEn}
                      </p>
                    </div>

                    {/* Mrityu Bhaga */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">🛡️ மிருத்யு பாகை</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">{horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.planetsTa}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.notesTa : horoscope.specialLagnas?.karmicPoints?.mrityuBhaga?.notesEn}
                      </p>
                    </div>

                    {/* Avamrityu Nakshatra */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/15 dark:border-amber-500/20 shadow-2xs space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-200">⚕️ அவமிருத்யு நட்சத்திரம்</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">{horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.planetsTa}</span>
                      </div>
                      <p className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight">
                        {isTamil ? horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.notesTa : horoscope.specialLagnas?.karmicPoints?.avamrityuNak?.notesEn}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
'''

footer_target = '{/* Footer */}'
if footer_target in content:
    content = content.replace(footer_target, sec12_jsx + '\n' + footer_target)
    print('Inserted Section 12 before Footer.')
else:
    print('Could not find Footer!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Saved updated ThirukanithaHoroscopeView.jsx with Section 12.')
