const fs = require('fs');

const orig = fs.readFileSync('./frontend/src/components/ThirukanithaHoroscopeView.jsx.bak', 'utf8');

// Find all indices
const sec2Start = orig.indexOf('{/* SECTION 2: Birth Summary Strip');
const sec3Start = orig.indexOf('{/* SECTION 3: South Indian Charts');
const dasavargaStart = orig.indexOf('{/* Interactive Dasavarga & Shodashavarga Dignity Strength Section');
const sec3bStart = orig.indexOf('{/* SECTION 3B: ORAI');
const sec3cStart = orig.indexOf('{/* SECTION 3C: GOCHARAM');
const sec4Start = orig.indexOf('{/* SECTION 4: Planetary Positions Table');
const sec5Start = orig.indexOf('{/* SECTION 5: Sripati Bhava Sphutam Table');
const sec5bStart = orig.indexOf('{/* SECTION 5B: Shadbala & Bhava Bala Analysis');
const sec5cStart = orig.indexOf('{/* SECTION 5C: Ashtakavarga & Sarvashtakavarga');
const sec6Start = orig.indexOf('{/* SECTION 6: Vimshottari Dasha');
const footerStart = orig.indexOf('{/* Footer */');

if ([sec2Start, sec3Start, dasavargaStart, sec3bStart, sec3cStart, sec4Start, sec5Start, sec5bStart, sec5cStart, sec6Start, footerStart].some(x => x === -1)) {
  console.error('Marker not found!');
  process.exit(1);
}

// Slice before Section 2 (Form and Header)
const partBefore = orig.slice(0, sec2Start);

// Slice after Section 6 (Footer and helper subcomponents)
const partAfter = orig.slice(footerStart);

// 1. Janana Vivara Kurippu (Birth Summary Details)
const raw1 = orig.slice(sec2Start, sec3Start).trim();

// 2. Varga Chakras (16 Shodashavarga Charts)
let raw2 = orig.slice(sec3Start, dasavargaStart).trim();
raw2 += '\n        </div>'; // ensure closing card div

// 7. Dasavarga Table (Page 20)
let raw7 = orig.slice(dasavargaStart, sec3bStart).trim();
if (raw7.endsWith('</div>')) {
  raw7 = raw7.slice(0, raw7.lastIndexOf('</div>')).trim();
}

// 10. Orai (Planetary Hora Analysis)
const raw10 = orig.slice(sec3bStart, sec3cStart).trim();

// 9. Gocharam (Planetary Transit Analysis)
const raw9 = orig.slice(sec3cStart, sec4Start).trim();

// 3. Planetary Positions (Nirayana Planet Table)
const raw3 = orig.slice(sec4Start, sec5Start).trim();

// 4. Sripati Bhava Sphutam Table
const raw4 = orig.slice(sec5Start, sec5bStart).trim();

// 5. Shadbala & Bhava Bala Analysis
const raw5 = orig.slice(sec5bStart, sec5cStart).trim();

// 8. Ashtakavarga & Sarvashtakavarga (337 Bindus)
const raw8 = orig.slice(sec5cStart, sec6Start).trim();

// 6. Vimshottari Dasha (120 Years)
const raw6 = orig.slice(sec6Start, footerStart).trim();

// Wrapper helper to generate collapsible drop-list card
function wrapSection({ idNum, num, titleTa, titleEn, subtitleTa, subtitleEn, icon, badgeChip, rawContent }) {
  return `
        {/* ======================================================== */}
        {/* ITEM ${num}: ${titleTa} (${titleEn}) */}
        {/* ======================================================== */}
        <div id="horoscope-section-${num}" className="bg-white/80 dark:bg-[#251E1A] rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs overflow-hidden transition-all">
          {/* Dropdown / Accordion Header Button */}
          <button
            type="button"
            onClick={() => toggleSection(${num})}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/10 dark:bg-amber-500/15 text-[#7A1A22] dark:text-amber-300 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 font-mono">
                ${num}
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#7A1A22] dark:text-[#E8838B] flex items-center gap-2">
                  <span>${icon}</span>
                  <span>{isTamil ? '${titleTa}' : '${titleEn}'}</span>
                </h2>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {isTamil ? '${subtitleTa}' : '${subtitleEn}'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              ${badgeChip}
              <span className={\`w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-stone-800 text-[#7A1A22] dark:text-amber-200 flex items-center justify-center text-xs transition-transform duration-200 \${openSections[${num}] ? 'rotate-180' : 'rotate-0'}\`}>
                ▼
              </span>
            </div>
          </button>

          {/* Collapsible Dropdown Content */}
          {openSections[${num}] && (
            <div className="p-4 sm:p-5 pt-0 border-t border-amber-900/10 dark:border-amber-500/15 space-y-4">
              ${rawContent}
            </div>
          )}
        </div>
  `;
}

// Build the 10 sections in exact order requested by user:
// 1. ஜனன விவரக் குறிப்பு
// 2. வர்க்கச் சக்கரங்கள் (16 Shodashavarga Charts)
// 3. கிரக நிலைகள் அட்டவணை (நிராயண)
// 4. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு
// 5. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு
// 6. விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்)
// 7. ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்
// 8. ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)
// 9. ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)
// 10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்

const sec1Wrapped = wrapSection({
  idNum: 1,
  num: 1,
  titleTa: '1. ஜனன விவரக் குறிப்பு',
  titleEn: '1. Birth Summary Details',
  subtitleTa: 'லக்னம், ராசி, நட்சத்திரம், திதி, கிழமை, திசா இருப்பு மற்றும் அயனாம்ச விவரங்கள்',
  subtitleEn: 'Ascendant, Moon sign, Nakshatra, Tithi, Weekday, Dasha balance & Ayanamsha',
  icon: '✨',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? RASHIS[horoscope.summary.lagnaRasi]?.ta : RASHIS[horoscope.summary.lagnaRasi]?.en} / {isTamil ? RASHIS[horoscope.summary.moonRasi]?.ta : RASHIS[horoscope.summary.moonRasi]?.en}</span>`,
  rawContent: raw1
});

const sec2Wrapped = wrapSection({
  idNum: 2,
  num: 2,
  titleTa: '2. வர்க்கச் சக்கரங்கள் (16 Shodashavarga Charts)',
  titleEn: '2. Divisional Charts (16 Shodashavarga)',
  subtitleTa: 'பராசரர் முறைப்படி 16 வர்க்கச் சக்கரங்கள் மற்றும் பாவ சூட்சும பலன்கள்',
  subtitleEn: 'Parashari 16 Divisional Varga Chakras & Subtle Karakatva Domains',
  icon: '☸️',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{activeChartKey} ({isTamil ? (SHODASHAVARGA_DEFS.find(d => d.key === activeChartKey)?.nameTa || '') : activeChartKey})</span>`,
  rawContent: raw2
});

const sec3Wrapped = wrapSection({
  idNum: 3,
  num: 3,
  titleTa: '3. கிரக நிலைகள் அட்டவணை (நிராயண)',
  titleEn: '3. Nirayana Planetary Positions Table',
  subtitleTa: 'துல்லியமான நிராயண கிரக நிலைகள், பாகை, நட்சத்திரம், பாதம், நவாம்சம் மற்றும் பாவகம்',
  subtitleEn: 'Accurate Nirayana Planetary Longitudes, Nakshatra, Pada, Navamsa & Bhava',
  icon: '🌌',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">11 {isTamil ? 'கிரக நிலைகள்' : 'Planets'}</span>`,
  rawContent: raw3
});

const sec4Wrapped = wrapSection({
  idNum: 4,
  num: 4,
  titleTa: '4. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு',
  titleEn: '4. Sripati Bhava Sphutam Table',
  subtitleTa: 'ஸ்ரீபதி பத்ததி முறைப்படி 12 பாவகங்களின் ஆரம்பம், மத்திமம் (Cusp) மற்றும் முடிவு நிலைகள்',
  subtitleEn: 'Sripati System 12 House Cusps (Prarambha, Madhya, Antya)',
  icon: '📐',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">12 {isTamil ? 'பாவங்கள்' : 'Bhavas'}</span>`,
  rawContent: raw4
});

const sec5Wrapped = wrapSection({
  idNum: 5,
  num: 5,
  titleTa: '5. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு',
  titleEn: '5. Shadbala & Bhava Bala Analysis',
  subtitleTa: 'பராசரர் முறைப்படி கிரகங்களின் அறுவகை பலங்கள் மற்றும் 12 பாவகங்களின் பலங்கள் (ரூபங்களில்)',
  subtitleEn: 'Parashari 6-fold planetary strengths and 12 house strengths (in Rupas)',
  icon: '⚖️',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? 'ஷட்பலம் & பாவக பலம்' : 'Shadbala Rupas'}</span>`,
  rawContent: raw5
});

const sec6Wrapped = wrapSection({
  idNum: 6,
  num: 6,
  titleTa: '6. விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்)',
  titleEn: '6. Vimshottari Dasha & Bhukti Table (120 Years)',
  subtitleTa: 'பராசரர் முறைப்படி 120 ஆண்டுகளுக்கான 9 மகாதிகைகள் மற்றும் 81 புக்திகள் கணக்கீடு',
  subtitleEn: 'Parashari 120-Year Vimshottari Cycle with 9 Mahadashas and 81 Sub-Periods',
  icon: '⏳',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{isTamil ? horoscope.summary.dashaBalance?.textTa : horoscope.summary.dashaBalance?.textEn}</span>`,
  rawContent: raw6
});

const sec7Wrapped = wrapSection({
  idNum: 7,
  num: 7,
  titleTa: '7. ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
  titleEn: '7. Planetary Dasavarga & Dignity Strength Matrix',
  subtitleTa: 'பராசரர் முறைப்படி 10 வர்க்கங்களில் கிரகங்களின் ஆட்சி, உச்சம், நட்பு, சமம், பகை, நீச நிலைகள் மற்றும் சுப/அசுப பலம்',
  subtitleEn: 'Parashari 10-Varga Dignity Strengths with 79 Subha / 21 Asubha Total Scores',
  icon: '👑',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">{isTamil ? 'சுபம் 79 / அசுபம் 21' : 'Subha 79 / Asubha 21'}</span>`,
  rawContent: raw7
});

const sec8Wrapped = wrapSection({
  idNum: 8,
  num: 8,
  titleTa: '8. ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)',
  titleEn: '8. Ashtakavarga & Sarvashtakavarga (337 Bindus)',
  subtitleTa: 'பராசரர் முறைப்படி 7 கிரகங்களின் பின்னாஷ்டகவர்க்கம், சர்வாஷ்டகவர்க்கப் பரல்கள் மற்றும் பாவக ஆய்வுகள்',
  subtitleEn: 'Parashari 7-Graha Bhinna Ashtakavarga, 12 Signs Sarvashtakavarga Chart & Diagnostics',
  icon: '🔢',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-[11px] font-bold text-[#7A1A22] dark:text-amber-300">{horoscope.ashtakavarga?.grandTotal || 337} {isTamil ? 'பரல்கள்' : 'Bindus'}</span>`,
  rawContent: raw8
});

const sec9Wrapped = wrapSection({
  idNum: 9,
  num: 9,
  titleTa: '9. ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)',
  titleEn: '9. Real-Time Gocharam (Planetary Transit) Analysis',
  subtitleTa: 'ஜென்ம ராசி மற்றும் லக்னத்தை அடிப்படையாகக் கொண்டு தற்போதைய 9 கிரக நிலைகள், வேதை & அஷ்டகவர்க்க பலன்கள்',
  subtitleEn: 'Real-time transits relative to Janma Rasi & Lagna with Vedha, SAV/BAV Bindus & Phalan',
  icon: '🪐',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-purple-100/70 dark:bg-purple-950/40 text-[11px] font-bold text-purple-800 dark:text-purple-300">{isTamil ? (horoscope.gocharam?.sadeSati?.titleTa?.slice(0, 15) || 'கோச்சாரம்') : (horoscope.gocharam?.sadeSati?.titleEn?.slice(0, 15) || 'Transit')}</span>`,
  rawContent: raw9
});

const sec10Wrapped = wrapSection({
  idNum: 10,
  num: 10,
  titleTa: '10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்',
  titleEn: '10. Planetary Hora (Orai) Analysis',
  subtitleTa: 'பராசரர் முறைப்படி 24 பகல் & இரவு ஓரைகள், பிறந்த ஹோரை மற்றும் இன்றைய நடப்பு ஹோரை',
  subtitleEn: 'Parashari 24 Day & Night Horas, Birth Hora & Live Real-Time Active Hora',
  icon: '⏱️',
  badgeChip: `<span className="px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">{isTamil ? (horoscope.orai?.birthHora?.nameTa || 'ஹோரை') : (horoscope.orai?.birthHora?.nameEn || 'Hora')}</span>`,
  rawContent: raw10
});

// Top Navigation Drop List & Master Expand/Collapse Toolbar
const masterToolbar = `
        {/* ======================================================== */}
        {/* MASTER SECTION DROP LIST & QUICK JUMPER TOOLBAR */}
        {/* ======================================================== */}
        <div className="bg-white/95 dark:bg-[#251E1A] p-3 sm:p-4 rounded-2xl border border-amber-900/15 dark:border-amber-500/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-2 z-20 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs sm:text-sm font-bold text-[#7A1A22] dark:text-amber-300 whitespace-nowrap flex items-center gap-1.5">
              <span>📑</span>
              <span>{isTamil ? 'பிரிவுக்குச் செல்ல (Drop List):' : 'Jump to Section:'}</span>
            </span>
            <select
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val) jumpToSection(val);
              }}
              className="bg-[#FAF6EF] dark:bg-[#1A1513] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none focus:border-[#7A1A22] cursor-pointer w-full max-w-sm shadow-2xs"
            >
              <option value="">{isTamil ? '-- 10 பிரிவுகள் பட்டியல் (தேர்வு செய்க) --' : '-- Select Section to Jump --'}</option>
              <option value="1">1. ஜனன விவரக் குறிப்பு</option>
              <option value="2">2. வர்க்கச் சக்கரங்கள் (16 Shodashavarga Charts)</option>
              <option value="3">3. கிரக நிலைகள் அட்டவணை (நிராயண)</option>
              <option value="4">4. ஸ்ரீபதி பாவ ஆரம்பம், மத்திமம், முடிவு</option>
              <option value="5">5. ஜாதகத்தில் ஷட்பலம் & பாவக பலம் ஆய்வு</option>
              <option value="6">6. விம்சோத்தரி திசா புக்தி விபரம் (120 ஆண்டுகள்)</option>
              <option value="7">7. ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்</option>
              <option value="8">8. ஜாதகத்தில் அஷ்டகவர்க்கம் & சர்வாஷ்டகவர்க்கம் (337 பரல்கள்)</option>
              <option value="9">9. ஜாதகத்தில் கோச்சாரப் பலன்கள் (தற்போதைய கிரக சஞ்சாரம்)</option>
              <option value="10">10. ஜாதகத்தில் ஹோரை (ஓரை) கணிதம்</option>
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={expandAllSections}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#7A1A22] dark:text-amber-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>▼</span>
              <span>{isTamil ? 'அனைத்தும் விரி' : 'Expand All'}</span>
            </button>
            <button
              type="button"
              onClick={collapseAllSections}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>▲</span>
              <span>{isTamil ? 'அனைத்தும் சுருக்கு' : 'Collapse All'}</span>
            </button>
          </div>
        </div>
`;

// Inject state in component
let modifiedPartBefore = partBefore;
const stateTarget = "const [selectedShodhanaPlanet, setSelectedShodhanaPlanet] = useState('sun');";
const stateAddition = `const [selectedShodhanaPlanet, setSelectedShodhanaPlanet] = useState('sun');
  const [openSections, setOpenSections] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true
  });

  const toggleSection = (secNum) => {
    setOpenSections(prev => ({ ...prev, [secNum]: !prev[secNum] }));
  };

  const expandAllSections = () => {
    setOpenSections({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true });
  };

  const collapseAllSections = () => {
    setOpenSections({ 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false });
  };

  const jumpToSection = (secNum) => {
    setOpenSections(prev => ({ ...prev, [secNum]: true }));
    setTimeout(() => {
      const el = document.getElementById(\`horoscope-section-\${secNum}\`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };`;

if (!modifiedPartBefore.includes('openSections')) {
  modifiedPartBefore = modifiedPartBefore.replace(stateTarget, stateAddition);
}

// Assemble full new file
const finalCode = [
  modifiedPartBefore,
  masterToolbar,
  sec1Wrapped,
  sec2Wrapped,
  sec3Wrapped,
  sec4Wrapped,
  sec5Wrapped,
  sec6Wrapped,
  sec7Wrapped,
  sec8Wrapped,
  sec9Wrapped,
  sec10Wrapped,
  partAfter
].join('\n');

fs.writeFileSync('./frontend/src/components/ThirukanithaHoroscopeView.jsx', finalCode);
console.log('File successfully reconstructed with all 10 sections in exact order in drop-list accordions!');
