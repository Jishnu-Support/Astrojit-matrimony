import re

# 1. Update thirukanithaEngine.js
with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    engine_code = f.read()

# Add formatDobDDMMYYYY
dob_helper = """  // Helper to format date as DD-MM-YYYY
  const formatDobDDMMYYYY = (dobStr) => {
    if (!dobStr) return '';
    const parts = String(dobStr).trim().split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
      } else {
        return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
      }
    }
    return dobStr;
  };
"""

if "const formatDobDDMMYYYY =" not in engine_code:
    target_pos = "  // Age calculation\n  const computeAgeString"
    assert target_pos in engine_code, "target_pos not found in thirukanithaEngine.js"
    engine_code = engine_code.replace(target_pos, dob_helper + "\n  // Age calculation\n  const computeAgeString")

# Update dateWeekday line in computeHoroscopePagerData
old_date_line = "dateWeekday: `${m.dob} (${p.weekday?.ta || ''})`,"
new_date_line = "dateWeekday: `${formatDobDDMMYYYY(m.dob)} (${p.weekday?.ta || ''})`,"
if old_date_line in engine_code:
    engine_code = engine_code.replace(old_date_line, new_date_line)

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(engine_code)
print("thirukanithaEngine.js updated successfully!")


# 2. Update HoroscopePagerView.jsx
with open('frontend/src/components/HoroscopePagerView.jsx', 'r', encoding='utf-8') as f:
    hpv = f.read()

# Update L.dateWeekday label to include D.O.B
old_l_date = "dateWeekday: isTa ? 'தேதி' : 'Date / Weekday',"
new_l_date = "dateWeekday: isTa ? 'பிறந்த தேதி (D.O.B)' : 'Date of Birth (D.O.B)',"
if old_l_date in hpv:
    hpv = hpv.replace(old_l_date, new_l_date)

old_l_age = "age: isTa ? 'வயது' : 'Age',"
new_l_age = "age: isTa ? 'வயது (Age)' : 'Age',"
if old_l_age in hpv:
    hpv = hpv.replace(old_l_age, new_l_age)

# Replace the 2-column details block in #janana-jathagam-sheet
old_two_col = """              {/* 4. Two-column details block (label, colon, value) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px] sm:text-[10px] px-1 border-t border-stone-300 pt-1 leading-normal">
                {/* Left Column (12 lines) */}
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.father}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.father || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.mother}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.mother || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.nativePlace}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nativePlace || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.lagna}</span><span className="mr-1">:</span><span className="font-bold text-[#7A1A22] truncate">{data.person.lagna || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex items-center"><span className="w-32 font-bold shrink-0">{L.rasi}</span><span className="mr-1">:</span><span className="font-bold truncate flex items-center gap-1">{data.person.rasi || <span className="opacity-0">&nbsp;</span>} <span className="text-xs">{data.person.rasiGlyph}</span></span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.nakshatra}</span><span className="mr-1">:</span><span className="font-bold truncate">{data.person.nakshatra ? `${data.person.nakshatra} பாதம் ${data.person.pada || ''}` : <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.pakshaTithi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.pakshaTithi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.yogaKarana}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.yogaKarana || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.ayanam}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.ayanam || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.hora}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.hora || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.ayanamsha}</span><span className="mr-1">:</span><span className="font-mono font-bold truncate">{data.person.ayanamsha || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">{L.lmtCorr}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.lmtCorr || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>

                {/* Right Column (11 lines) */}
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.dateWeekday}</span><span className="mr-1">:</span><span className="font-bold truncate">{data.person.dateWeekday || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.time}</span><span className="mr-1">:</span><span className="font-mono font-bold truncate">{data.person.time || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.tamilDate}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.tamilDate || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.udayadiNazhigai}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.udayadiNazhigai || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.country}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.country || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex flex-col"><div className="flex"><span className="w-36 font-bold shrink-0">{L.place}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.placeLine1 || <span className="opacity-0">&nbsp;</span>}</span></div>{data.person.placeLine2 && <div className="pl-38 text-xs font-black tracking-tight">{data.person.placeLine2}</div>}</div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.latLon}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.latLon || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.stdTimeCorr}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.stdTimeCorr || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.sunriseSunset}</span><span className="mr-1">:</span><span className="font-mono text-[9px] truncate">{data.person.sunriseSunset || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.yogiAvayogi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.yogiAvayogi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.nakshatraSyllables}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nakshatraSyllables || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.age}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.age || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.subhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.subhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.asubhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.asubhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.lagnagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.lagnagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.bhagayathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhagayathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.bhathagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhathagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>
              </div>"""

new_two_col = """              {/* 4. Professional Two-Column Details Block (Astrological Systems on Left, Birth & Personal Details on Right) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[9px] sm:text-[9.5px] px-1 border-t border-stone-300 pt-1 leading-normal">
                {/* Left Column: Astrological & Panchangam System (15 lines) */}
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.lagna}</span><span className="mr-1">:</span><span className="font-bold text-[#7A1A22] truncate">{data.person.lagna || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.lagnagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.lagnagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex items-center"><span className="w-34 font-bold shrink-0">{L.rasi}</span><span className="mr-1">:</span><span className="font-bold truncate flex items-center gap-1">{data.person.rasi || <span className="opacity-0">&nbsp;</span>} <span className="text-xs">{data.person.rasiGlyph}</span></span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.nakshatra}</span><span className="mr-1">:</span><span className="font-bold truncate">{data.person.nakshatra ? `${data.person.nakshatra} பாதம் ${data.person.pada || ''}` : <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.nakshatraSyllables}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nakshatraSyllables || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.bhagayathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhagayathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.bhathagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhathagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.subhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.subhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.asubhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.asubhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.pakshaTithi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.pakshaTithi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.yogaKarana}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.yogaKarana || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.ayanam}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.ayanam || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.hora}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.hora || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.ayanamsha}</span><span className="mr-1">:</span><span className="font-mono font-bold truncate">{data.person.ayanamsha || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-34 font-bold shrink-0">{L.lmtCorr}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.lmtCorr || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>

                {/* Right Column: Birth, Timing & Family Details (14 lines, D.O.B on top and Age right below) */}
                <div className="space-y-0.5">
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.dateWeekday}</span><span className="mr-1">:</span><span className="font-bold truncate text-[#7A1A22]">{data.person.dateWeekday || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.age}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.age || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.time}</span><span className="mr-1">:</span><span className="font-mono font-bold truncate">{data.person.time || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.tamilDate}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.tamilDate || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.udayadiNazhigai}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.udayadiNazhigai || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.sunriseSunset}</span><span className="mr-1">:</span><span className="font-mono text-[9px] truncate">{data.person.sunriseSunset || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex flex-col"><div className="flex"><span className="w-36 font-bold shrink-0">{L.place}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.placeLine1 || <span className="opacity-0">&nbsp;</span>}</span></div>{data.person.placeLine2 && <div className="pl-38 text-xs font-black tracking-tight">{data.person.placeLine2}</div>}</div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.country}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.country || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.latLon}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.latLon || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.stdTimeCorr}</span><span className="mr-1">:</span><span className="font-mono truncate">{data.person.stdTimeCorr || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.yogiAvayogi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.yogiAvayogi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.father}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.father || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.mother}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.mother || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.nativePlace}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nativePlace || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>
              </div>"""

assert old_two_col in hpv, "old_two_col block not found in HoroscopePagerView.jsx"
hpv = hpv.replace(old_two_col, new_two_col)

with open('frontend/src/components/HoroscopePagerView.jsx', 'w', encoding='utf-8') as f:
    f.write(hpv)
print("HoroscopePagerView.jsx updated successfully!")
