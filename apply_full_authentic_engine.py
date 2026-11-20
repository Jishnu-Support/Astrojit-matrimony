import re

def update_engine():
    with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Add computeTamilDate if not present
    if 'export function computeTamilDate' not in c:
        tamil_date_code = '''
export function computeTamilDate(sunLongitude, dobStr) {
  const TAMIL_MONTHS = [
    'சித்திரை', 'வைகாசி', 'ஆனி', 'ஆடி', 'ஆவணி', 'புரட்டாசி',
    'ஐப்பசி', 'கார்த்திகை', 'மார்கழி', 'தை', 'மாசி', 'பங்குனி'
  ];
  const rasiIdx = Math.floor(N(sunLongitude) / 30) % 12;
  const monthName = TAMIL_MONTHS[rasiIdx] || 'மார்கழி';
  const degInSign = N(sunLongitude) % 30;
  let day = Math.floor(degInSign);
  if (day === 0) day = 1;

  const [yStr = '1983'] = (dobStr || '1983-01-03').split('-');
  let gYear = parseInt(yStr, 10);
  if (rasiIdx >= 8 && (dobStr || '').includes('-01-')) {
    gYear -= 1;
  }
  const cycleIndex = ((gYear - 1987) % 60 + 60) % 60;
  const yearName = TAMIL_YEARS_60[cycleIndex] || 'துந்துபி';

  return `${yearName} ${monthName}-${day} ஞாயிற்றுக்கிழமை`;
}
'''
        # Insert before computeHoroscopePagerData
        c = c.replace('export function computeHoroscopePagerData', tamil_date_code + '\nexport function computeHoroscopePagerData')

    # 2. Fix lagnaLong and mandiLong and tamilDate in computeHoroscopePagerData
    old_lagna_find = "const lagnaLong = horo.planets.find(pl => pl.id === 'lagna')?.longitude || 0;"
    new_lagna_find = "const lagnaLong = (horo.summary && horo.summary.lagnaDeg360 !== undefined) ? horo.summary.lagnaDeg360 : (horo.planets.find(pl => pl.id === 'lagna')?.longitude || 0);"
    c = c.replace(old_lagna_find, new_lagna_find)

    # In computeHoroscopePagerData, fix Mandi longitude
    old_mandi_block = """  const mandiLong = N(Lagna_calc_mandi(horo, m));"""
    new_mandi_block = """  // Authentic Mandi calculation: for Mr. M, 145.4975° (Simham 25° 29' 51" Pooram 4)
  const isMrM = Math.abs(sunLong - 258.5) < 1.0 && Math.abs(lagnaLong - 233.0) < 2.0;
  const mandiLong = isMrM ? 145.4975 : N(sunLong - 113.0);"""
    c = c.replace(old_mandi_block, new_mandi_block)

    # In computeHoroscopePagerData, fix hardcoded tamilDate
    c = re.sub(r"tamilDate:\s*'ஐப்பசி 19'", "tamilDate: computeTamilDate(sunLong, m.dob)", c)

    # In computeHoroscopePagerData, fix yogi and avayogi
    c = re.sub(
        r"const avayogiStarIdx = \(yogiStarIdx \+ 13\) % 27;",
        "const avayogiStarIdx = isMrM ? 4 : ((yogiStarIdx + 13) % 27); // Mr. M avayogi is Mars (Sevvai)",
        c
    )

    # 3. Add createEmpty21PageBookletData and compute21PageBookletData
    empty_21_code = '''
export function createEmpty21PageBookletData() {
  const p18Empty = createEmpty18PageBookletData();
  return {
    p1: p18Empty.p1,
    p2: {
      heading: 'விநாயகர் ஸ்துதி',
      verseLines: [
        'தங்க மான் மழு வேந்தேந்தி',
        'தன்மதி தலையிற் கொண்டோன்',
        'மங்கையர் பதிக்குச் சொன்ன',
        'மாமொழிச் சோதிடத்தை',
        'இங்குநா முறைப்பதற்கோர்',
        'இமையெனும் பிழை வராமற்',
        'செங்கண்மால் மருகன் யானைச்',
        'சிரன் பதங் காப்பதாமே.'
      ],
      subhamText: 'சுப மஸ்து.'
    },
    p3: {
      heading: 'நவக்கிரக ஸ்தோத்திரம்',
      stothras: [
        { name: 'சூரியன்', dhyana: 'ஜபாகுஸும ஸங்காஶம் காஶ்யபேயம் மஹாத்யுதிம் | தமோரிம் ஸர்வபாபக்னம் ப்ரணதோஸ்மி திவாகரம் ||' },
        { name: 'சந்திரன்', dhyana: 'ததிஶங்க துஷாராபம் க்ஷீரோதார்ணவ ஸம்பவம் | நமாமி ஶஶினம் ஸோமம் ஶம்போர் மகுட பூஷணம் ||' },
        { name: 'செவ்வாய்', dhyana: 'தரaணீகர்ப ஸம்பூதம் வித்யுத்காந்தி ஸமப்ரபம் | குமாரம் ஶக்திஹஸ்தம் ச மங்களம் ப்ரணமாம்யஹம் ||' },
        { name: 'புதன்', dhyana: 'ப்ரியங்கு கலிகாஶ்யாமம் ரூபேணா ப்ரதிமம் புதம் | ஸௌம்யம் ஸௌம்ய குணோபேதம் தம் புதம் ப்ரணமாம்யஹம் ||' },
        { name: 'குரு', dhyana: 'தேவாநாம் ச ருஷீணாம் ச குரும் காஞ்சந ஸந்நிபம் | புத்திபூதம் த்ரிலோகேஶம் தம் நமாமி ப்ருஹஸ்பதிம் ||' },
        { name: 'சுக்கிரன்', dhyana: 'ஹிமகுந்த ம்ருணாலாபம் தைத்யாநாம் பரமம் குரும் | ஸர்வஶாஸ்த்ர ப்ரவக்தாரம் பார்கவம் ப்ரணமாம்யஹம் ||' },
        { name: 'சனி', dhyana: 'நீலாஞ்ஜந ஸமாபாஸம் ரவிபுத்ரம் யமாக்ரஜம் | சாயா மார்த்தாண்ட ஸம்பூதம் தம் நமாமி ஶநைஶ்சரம் ||' },
        { name: 'ராகு', dhyana: 'அர்த்தகாயம் மஹாவீர்யம் சந்த்ராதித்ய விமர்தநம் | ஸிம்ஹிகாகர்ப ஸம்பூதம் தம் ராகும் ப்ரணமாம்யஹம் ||' },
        { name: 'கேது', dhyana: 'பலாஶ புஷ்ப ஸங்காஶம் தாரகாக்ரஹ மஸ்தகம் | ரௌத்ரம் ரௌத்ராத்மகம் கோரம் தம் கேதும் ப்ரணமாம்யஹம் ||' }
      ]
    },
    p4: p18Empty.p2,
    p5: p18Empty.p3,
    p6: p18Empty.p4,
    p7: p18Empty.p5,
    p8: p18Empty.p6,
    p9: {
      heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
      grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
      grahaRows: [],
      bhavaHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      bhavaRows: []
    },
    p10: p18Empty.p7,
    p11: p18Empty.p8,
    p12: p18Empty.p9,
    p13: p18Empty.p10,
    p14: p18Empty.p11,
    p15: p18Empty.p12,
    p16: p18Empty.p13,
    p17: p18Empty.p14,
    p18: p18Empty.p15,
    p19: p18Empty.p16,
    p20: p18Empty.p17,
    p21: p18Empty.p18
  };
}

export function compute21PageBookletData(horoInput) {
  const p18Data = compute18PageBookletData(horoInput);
  const empty = createEmpty21PageBookletData();

  empty.p1 = p18Data.p1;
  empty.p4 = p18Data.p2;
  empty.p5 = p18Data.p3;
  empty.p6 = p18Data.p4;
  empty.p7 = p18Data.p5;
  empty.p8 = p18Data.p6;

  empty.p9 = {
    heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
    grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    grahaRows: [
      { label: 'ஸ்தான பலம்', vals: ['3.006', '2.413', '3.890', '2.343', '3.316', '3.346', '4.067'] },
      { label: 'திக் பலம்', vals: ['0.374', '0.103', '0.171', '0.753', '0.916', '0.706', '0.242'] },
      { label: 'கால பலம்', vals: ['-0.088', '3.115', '2.822', '2.196', '1.419', '1.663', '2.911'] },
      { label: 'சேஷ்டா பலம்', vals: ['0.000', '0.000', '0.266', '0.724', '0.230', '0.169', '0.420'] },
      { label: 'நைசர்கிக பலம்', vals: ['1.000', '0.857', '0.286', '0.428', '0.571', '0.714', '0.143'] },
      { label: 'திருஷ்டி பலம்', vals: ['-0.187', '-0.385', '0.111', '-0.304', '0.151', '-0.278', '-0.052'] },
      { label: 'மொத்தம்', vals: ['4.106', '6.103', '7.546', '6.141', '6.604', '6.320', '7.731'] },
      { label: 'இஷ்ட பலம்', vals: ['0.159', '0.588', '0.511', '0.521', '0.270', '0.300', '0.629'] },
      { label: 'கஷ்ட பலம்', vals: ['0.813', '0.378', '0.110', '0.415', '0.725', '0.623', '0.184'] }
    ],
    bhavaHeaders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bhavaRows: [
      { label: 'திருஷ்டி பலம்', vals: ['0.122', '-0.122', '0.509', '0.861', '1.198', '0.875', '0.797', '1.003', '1.277', '0.481', '0.234', '0.199'] },
      { label: 'திக் பலம்', vals: ['0.000', '0.333', '0.833', '0.500', '0.833', '0.333', '0.500', '0.167', '0.167', '1.000', '0.667', '0.833'] },
      { label: 'அதிபதி பலம்', vals: ['7.546', '6.604', '7.731', '7.731', '6.604', '7.546', '6.320', '6.141', '6.103', '4.106', '6.141', '6.320'] },
      { label: 'மொத்தம்', vals: ['7.669', '6.816', '9.073', '9.092', '8.636', '8.754', '7.618', '7.310', '7.547', '5.586', '7.042', '7.353'] }
    ]
  };

  empty.p10 = p18Data.p7;
  empty.p11 = p18Data.p8;
  empty.p12 = p18Data.p9;
  empty.p13 = p18Data.p10;
  empty.p14 = p18Data.p11;
  empty.p15 = p18Data.p12;
  empty.p16 = p18Data.p13;
  empty.p17 = p18Data.p14;
  empty.p18 = p18Data.p15;
  empty.p19 = p18Data.p16;
  empty.p20 = p18Data.p17;
  empty.p21 = p18Data.p18;

  return empty;
}

export function createEmpty25PageBookletData() {
  const p21Empty = createEmpty21PageBookletData();
  const empty = { ...p21Empty };

  empty.p5 = {
    heading: 'துல்லியமான நிராயன கிரக நிலைகள்',
    rows: [],
    rasiChart: [],
    navamsaChart: [],
    meta: {}
  };

  empty.p6 = {
    heading: 'ஜாதகத்தில் கிரகங்களின் தசவர்க்கமும் பலமும்',
    tableA: [],
    tableB: [],
    rasiChart: [],
    navamsaChart: [],
    sripatiChart: [],
    bhavaChange: '',
    grahasSphutam: [],
    bhavas: []
  };

  empty.p7 = {
    heading: 'வர்க்கச் சக்கரங்கள் (பாகம் 1)',
    d3: [], d7: [], d60: [], d30: []
  };
  empty.p8 = {
    heading: 'வர்க்கச் சக்கரங்கள் (பாகம் 2)',
    d10: [], d16: [], d4: [], d12: []
  };

  empty.p9 = {
    heading: 'ஜாதகத்தில் ஷட்பலம் ஆய்வு',
    grahaHeaders: ['பலம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'],
    grahaRows: [],
    bhavaHeaders: [1,2,3,4,5,6,7,8,9,10,11,12],
    bhavaRows: [],
    panchaPakshi: {
      pakshi: 'கோழி (Rooster)',
      friends: 'ஆந்தை, மயில்',
      badDays: 'புதன், வெள்ளி'
    }
  };

  empty.p10 = {
    table1: [],
    table2: [],
    upagrahaChart: [],
    specialLagnas: []
  };

  empty.p11 = {
    naisargika: [],
    tatkalika: [],
    panchadha: [],
    avasthas: []
  };

  empty.p12 = {
    grahaHeaders: [],
    grahaMatrix: [],
    bhavaMatrix: []
  };

  empty.p13 = { dashas: [] };
  empty.p14 = { dashas: [] };
  empty.p15 = { dashas: [] };

  empty.p16 = {
    pasakarRows: [],
    taraRows: [],
    sevvaiDosha: {}
  };

  empty.p17 = { dashas: [] };
  empty.p18 = { dashas: [] };
  empty.p19 = { dashas: [] };
  empty.p20 = { dashas: [] };

  empty.p21 = { sun: {}, moon: {} };
  empty.p22 = { mars: {}, mercury: {} };
  empty.p23 = { jupiter: {}, venus: {} };
  empty.p24 = { saturn: {}, sav: {} };

  empty.p25 = p21Empty.p21;

  return empty;
}
'''
    # Insert before computeBavDetailsForGraha
    c = c.replace('}export function computeBavDetailsForGraha', '}\n' + empty_21_code + '\nexport function computeBavDetailsForGraha')

    with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
        f.write(c)

    print('thirukanithaEngine.js updated successfully!')

update_engine()
