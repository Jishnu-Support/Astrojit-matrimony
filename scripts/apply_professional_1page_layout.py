import re

# 1. Update HoroscopePagerView.jsx
with open('frontend/src/components/HoroscopePagerView.jsx', 'r', encoding='utf-8') as f:
    hpv = f.read()

# Fix L labels
hpv = re.sub(
    r"dateWeekday:\s*isTa\s*\?\s*'[^']*'\s*:\s*'[^']*',",
    "dateWeekday: isTa ? 'பிறந்த தேதி (D.O.B)' : 'Date of Birth (D.O.B)',",
    hpv
)
hpv = re.sub(
    r"age:\s*isTa\s*\?\s*'[^']*'\s*:\s*'[^']*',",
    "age: isTa ? 'வயது (Age)' : 'Age',",
    hpv
)

# Re-arrange Tab 1 inputs so D.O.B is followed immediately by Age
old_tab1_date_block = """                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.dateWeekday}</label>
                    <input
                      type="text"
                      value={data.person.dateWeekday}
                      onChange={e => updateField('person', 'dateWeekday', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>"""

new_tab1_date_block = """                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.dateWeekday}</label>
                    <input
                      type="text"
                      value={data.person.dateWeekday}
                      onChange={e => updateField('person', 'dateWeekday', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-bold text-[#7A1A22]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.age}</label>
                    <input
                      type="text"
                      value={data.person.age || ''}
                      onChange={e => updateField('person', 'age', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs font-semibold"
                    />
                  </div>"""

if old_tab1_date_block in hpv:
    hpv = hpv.replace(old_tab1_date_block, new_tab1_date_block)

# Remove the redundant age input below nakshatraSyllables if it exists
old_redundant_age = """                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.age}</label>
                    <input
                      type="text"
                      value={data.person.age || ''}
                      onChange={e => updateField('person', 'age', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>"""
if old_redundant_age in hpv:
    hpv = hpv.replace(old_redundant_age, "")

with open('frontend/src/components/HoroscopePagerView.jsx', 'w', encoding='utf-8') as f:
    f.write(hpv)
print("HoroscopePagerView.jsx labels and inputs updated!")


# 2. Update ClientDashboard.jsx to add Horoscope Pager button
with open('frontend/src/pages/ClientDashboard.jsx', 'r', encoding='utf-8') as f:
    cd = f.read()

target_btn = """          <button
            onClick={() => setActiveTab('thirukanitha')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'thirukanitha' || activeTab === 'horoscope'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🪐</span>
            <span>{lang === 'ta' ? 'திருக்கணித ஜாதகம்' : 'Thirukanitha Horoscope'}</span>
          </button>"""

repl_btn = """          <button
            onClick={() => setActiveTab('thirukanitha')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'thirukanitha' || activeTab === 'horoscope'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🪐</span>
            <span>{lang === 'ta' ? 'திருக்கணித ஜாதகம்' : 'Thirukanitha Horoscope'}</span>
          </button>
          <button
            onClick={() => setActiveTab('horoscope_pagers')}
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'horoscope_pagers' || activeTab === 'pager'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white/40 text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>📄</span>
            <span>{lang === 'ta' ? 'ஜாதக ஏடு (1-பக்கம்)' : 'Horoscope Pager (1-Page)'}</span>
          </button>"""

if target_btn in cd and "setActiveTab('horoscope_pagers')" not in cd:
    cd = cd.replace(target_btn, repl_btn)
    with open('frontend/src/pages/ClientDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(cd)
    print("ClientDashboard.jsx updated with 1-page pager button!")


# 3. Update horoscope_pager.html and frontend/public/horoscope_pager.html
def update_standalone_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        h = f.read()

    # Replace two column section with professional layout
    old_details_regex = r'<div class="details-grid">.*?<!-- 5\. Heading for Planet Table -->'
    new_details = '''<div class="details-grid">
          <!-- Left Column: Astrological & Panchangam System (15 lines) -->
          <div>
            <div class="detail-row"><span class="detail-label" id="lbl-lagna">லக்னம்</span><span class="detail-colon">:</span><span class="detail-value val-highlight" id="ui-p-lagna"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-lagnagathipathi">லக்னாதிபதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-lagnagathipathi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-rasi">ராசி</span><span class="detail-colon">:</span><span class="detail-value val-highlight" id="ui-p-rasi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-nakshatra">நட்சத்திரம்</span><span class="detail-colon">:</span><span class="detail-value val-highlight" id="ui-p-nakshatra"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-nakshatraSyllables">நக்ஷத்திர எழுத்துக்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-nakshatraSyllables"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-bhagayathipathi">பாக்யாதிபதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-bhagayathipathi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-bhathagathipathi">பாதகாதிபதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-bhathagathipathi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-subhar">சுபர்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-subhar"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-asubhar">அசுபர்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-asubhar"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-pakshaTithi">பட்சம் & திதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-pakshaTithi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-yogaKarana">யோகம்-கரணம்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-yogaKarana"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-ayanam">அயனம்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-ayanam"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-hora">நட்சத்திர ஹோரை</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-hora"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-ayanamsha">அயனாம்சம்</span><span class="detail-colon">:</span><span class="detail-value val-mono" id="ui-p-ayanamsha"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-lmtCorr">சுதேச நேரத்திருத்தம்</span><span class="detail-colon">:</span><span class="detail-value val-mono" id="ui-p-lmtCorr"></span></div>
          </div>

          <!-- Right Column: Birth, Timing & Family Details (14 lines, D.O.B and Age below) -->
          <div>
            <div class="detail-row"><span class="detail-label" id="lbl-dateWeekday">பிறந்த தேதி (D.O.B)</span><span class="detail-colon">:</span><span class="detail-value val-highlight" id="ui-p-dateWeekday"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-age">வயது (Age)</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-age"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-time">நேரம்</span><span class="detail-colon">:</span><span class="detail-value val-mono" id="ui-p-time"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-tamilDate">தமிழ் தேதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-tamilDate"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-udayadiNazhigai">உதயாதி நாழிகை</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-udayadiNazhigai"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-sunriseSunset">சூரிய (பிம்ப மத்தி) sunrise/sunset</span><span class="detail-colon">:</span><span class="detail-value val-mono" style="font-size: 7.2pt;" id="ui-p-sunriseSunset"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-place">இடம்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-placeLine1"></span></div>
            <div class="place-line-2" id="ui-p-placeLine2"></div>
            <div class="detail-row"><span class="detail-label" id="lbl-country">நாடு</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-country"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-latLon">அட்ச தீர்க்க ரேகை</span><span class="detail-colon">:</span><span class="detail-value val-mono" id="ui-p-latLon"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-stdTimeCorr">பொது நேரம் திருத்தம்</span><span class="detail-colon">:</span><span class="detail-value val-mono" id="ui-p-stdTimeCorr"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-yogiAvayogi">யோகி-அவயோகி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-yogiAvayogi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-father">தந்தை</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-father"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-mother">தாய்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-mother"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-nativePlace">பூர்வீகம்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-nativePlace"></span></div>
          </div>
        </div>

        <!-- 5. Heading for Planet Table -->'''

    h = re.sub(old_details_regex, new_details, h, flags=re.DOTALL)
    
    # Update label text in dictionary
    h = h.replace("dateWeekday: 'தேதி',", "dateWeekday: 'பிறந்த தேதி (D.O.B)',")
    h = h.replace("dateWeekday: 'Date',", "dateWeekday: 'Date of Birth (D.O.B)',")
    h = h.replace("age: 'வயது',", "age: 'வயது (Age)',")
    h = h.replace("age: 'Age',", "age: 'Age',")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(h)
    print(f"{path} updated successfully!")

update_standalone_html('horoscope_pager.html')
update_standalone_html('frontend/public/horoscope_pager.html')

# 4. Update ThirukanithaHoroscopeView.jsx print header and Section 1 summary
with open('frontend/src/components/ThirukanithaHoroscopeView.jsx', 'r', encoding='utf-8') as f:
    thv = f.read()

# Helper in ThirukanithaHoroscopeView if not present
if "const formatDobDDMMYYYY" not in thv:
    thv = thv.replace(
        "function parseInitialTime(timeStr) {",
        """function formatDobDDMMYYYY(dobStr) {
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
}

function parseInitialTime(timeStr) {"""
    )

# Print header line: replace {form.dob} with {formatDobDDMMYYYY(form.dob)}
thv = thv.replace("{form.dob} ({form.dobTime12", "{formatDobDDMMYYYY(form.dob)} ({form.dobTime12")

with open('frontend/src/components/ThirukanithaHoroscopeView.jsx', 'w', encoding='utf-8') as f:
    f.write(thv)
print("ThirukanithaHoroscopeView.jsx print header updated with DD-MM-YYYY!")
