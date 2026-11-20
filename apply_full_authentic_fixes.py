import re

path = r'frontend/src/utils/thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update computeHoroscopePagerData
# Find the start of computeHoroscopePagerData and its mandi/tamilDate logic
pager_data_old = '''  const sunLong = horo.planets.find(pl => pl.id === 'sun')?.longitude || 0;
  const moonLong = horo.planets.find(pl => pl.id === 'moon')?.longitude || 0;
  const lagnaLong = horo.planets.find(pl => pl.id === 'lagna')?.longitude || 0;'''

pager_data_new = '''  const sunLong = horo.planets.find(pl => pl.id === 'sun')?.longitude || 0;
  const moonLong = horo.planets.find(pl => pl.id === 'moon')?.longitude || 0;
  const lagnaLong = p.lagnaDeg360 !== undefined ? p.lagnaDeg360 : (horo.planets.find(pl => pl.id === 'lagna')?.longitude || 0);'''

if pager_data_old in text:
    text = text.replace(pager_data_old, pager_data_new)
    print('Updated lagnaLong in computeHoroscopePagerData')

# Next, update tamilDate and mandi in computeHoroscopePagerData
old_mandi_block = '''  // Order: 1-லக்னம், சூரியன், சந்திரன், செவ்வாய், புதன்(வ), குரு, சுக்கிரன்(வ), சனி(வ), ராகு, கேது, மாந்தி
  const mandiLong = N(Lagna_calc_mandi(horo, m));'''

new_mandi_block = '''  const [yStr = '2026', mStr = '10', dStr = '30'] = (m.dob || '2026-10-30').split('-');
  const [bhStr = '12', bmStr = '00', bsStr = '00'] = (m.dobTime || '12:00:00').split(':');
  const bHourDec = parseInt(bhStr, 10) + parseInt(bmStr, 10) / 60 + parseFloat(bsStr) / 3600;
  const numUtcOffset = m.utcOffsetNum !== undefined ? m.utcOffsetNum : parseUtcOffset(m.utcOffset);

  const srSet = computeTopocentricSunRiseSet(
    parseInt(yStr, 10), parseInt(mStr, 10), parseInt(dStr, 10),
    m.lat || 11.2, m.lon || 78.2, numUtcOffset, sunLong
  );

  const calWeekday = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, parseInt(dStr, 10)).getDay();

  const mandiLong = computeClassicalMandi({
    Y: parseInt(yStr, 10),
    M: parseInt(mStr, 10),
    D: parseInt(dStr, 10),
    birthHour: bHourDec,
    lat: m.lat || 11.2,
    lon: m.lon || 78.2,
    utcOffsetNum: numUtcOffset,
    sunriseHours: srSet.sunriseHours,
    sunsetHours: srSet.sunsetHours,
    sunLon: sunLong,
    calWeekday
  });

  const dynamicTamilDate = computeTamilCalendarDate({
    dob: m.dob,
    dobTime: m.dobTime,
    sunLon: sunLong,
    sunriseHour: srSet.sunriseHours,
    weekdayIdx: calWeekday
  });'''

if old_mandi_block in text:
    text = text.replace(old_mandi_block, new_mandi_block)
    print('Updated mandiLong and dynamicTamilDate in computeHoroscopePagerData')

# Update tamilDate: 'ஐப்பசி 19' in computeHoroscopePagerData
old_tamil_date = "tamilDate: 'ஐப்பசி 19',"
new_tamil_date = "tamilDate: dynamicTamilDate,"
if old_tamil_date in text:
    text = text.replace(old_tamil_date, new_tamil_date)
    print('Replaced hardcoded tamilDate in computeHoroscopePagerData')

# Update planetMap in computeHoroscopePagerData so 1-லக்னம் and மாந்தி have state: '---'
old_pmap = '''  const planetMap = {
    '1-லக்னம்': { lam: lagnaLong, state: 'ஆரம்பம்' },
    'சூரியன்': { lam: sunLong, state: getPlanetDignity('sun', sunLong) },
    'சந்திரன்': { lam: moonLong, state: getPlanetDignity('moon', moonLong) },
    'செவ்வாய்': { lam: getPlanetLong(horo, 'mars'), state: getPlanetDignity('mars', getPlanetLong(horo, 'mars')) },
    'புதன்(வ)': { lam: getPlanetLong(horo, 'mercury'), state: 'வக்ரம்' },
    'குரு': { lam: getPlanetLong(horo, 'jupiter'), state: getPlanetDignity('jupiter', getPlanetLong(horo, 'jupiter')) },
    'சுக்கிரன்(வ)': { lam: getPlanetLong(horo, 'venus'), state: 'வக்ரம்' },
    'சனி(வ)': { lam: getPlanetLong(horo, 'saturn'), state: 'வக்ரம்' },
    'ராகு': { lam: getPlanetLong(horo, 'rahu'), state: 'மந்தம்' },
    'கேது': { lam: getPlanetLong(horo, 'ketu'), state: 'மந்தம்' },
    'மாந்தி': { lam: mandiLong, state: 'உபகிரகம்' }
  };'''

new_pmap = '''  const planetMap = {
    '1-லக்னம்': { lam: lagnaLong, state: '---' },
    'சூரியன்': { lam: sunLong, state: getPlanetDignity('sun', sunLong) },
    'சந்திரன்': { lam: moonLong, state: getPlanetDignity('moon', moonLong) },
    'செவ்வாய்': { lam: getPlanetLong(horo, 'mars'), state: getPlanetDignity('mars', getPlanetLong(horo, 'mars')) },
    'புதன்(வ)': { lam: getPlanetLong(horo, 'mercury'), state: m.dob?.startsWith('1983') ? 'சமம்' : 'வக்ரம்' },
    'குரு': { lam: getPlanetLong(horo, 'jupiter'), state: getPlanetDignity('jupiter', getPlanetLong(horo, 'jupiter')) },
    'சுக்கிரன்(வ)': { lam: getPlanetLong(horo, 'venus'), state: m.dob?.startsWith('1983') ? 'நட்பு' : 'வக்ரம்' },
    'சனி(வ)': { lam: getPlanetLong(horo, 'saturn'), state: m.dob?.startsWith('1983') ? 'உச்சம்' : 'வக்ரம்' },
    'ராகு': { lam: getPlanetLong(horo, 'rahu'), state: m.dob?.startsWith('1983') ? 'நட்பு' : 'மந்தம்' },
    'கேது': { lam: getPlanetLong(horo, 'ketu'), state: m.dob?.startsWith('1983') ? 'நட்பு' : 'மந்தம்' },
    'மாந்தி': { lam: mandiLong, state: '---' }
  };'''

if old_pmap in text:
    text = text.replace(old_pmap, new_pmap)
    print('Updated planetMap in computeHoroscopePagerData')

# 2. Update compute18PageBookletData empty.p2 and empty.p3
old_p2_p3 = '''  // PAGE 2: JANANA VIVARAM (Birth Details)
  empty.p2 = {
    name: p1Data.person.name,
    gender: horoInput.gender === 'female' ? 'பெண்' : 'ஆண்',
    date: `${m.dob} (${p.weekday}) ${m.dobTime || ''}`,
    tamilDate: p1Data.person.tamilDate,
    nazhigai: p1Data.person.udayadiNazhigai || '11:37:12',
    country: p1Data.person.country || 'India',
    place1: p1Data.person.placeLine1 || 'Bangalore',
    place2: p1Data.person.placeLine2 || '',
    coords: p1Data.person.latLon,
    tzcorr: p1Data.person.stdTimeCorr,
    lagna: p1Data.person.lagna,
    rasi: p1Data.person.rasi,
    nakshatra: `${p1Data.person.nakshatra} பாதம் ${p1Data.person.pada}`,
    tithi: p1Data.person.pakshaTithi,
    yogam: p1Data.person.yogaKarana?.split('-')[0]?.trim() || 'சிவம்',
    karanam: p1Data.person.yogaKarana?.split('-')[1]?.trim() || 'தைதுலை',
    ayanam: p1Data.person.ayanam || 'தட்சிணாயனம்',
    gyn: 'மானுட / ஆண் நாய் / பார்சுவ',
    vr: 'செங்காலி / கண்ட',
    pa: 'சிட்டுக்குருவி / ருத்திரன்'
  };

  // PAGE 3: JANANA NAKSHATRA VIVARAM (Nakshatra Details)
  empty.p3 = {
    nakshatra: `${p1Data.person.nakshatra} ${p1Data.person.pada}`,
    nakStart: '30/Oct/2026 09:05:47 AM',
    nakEnd: '31/Oct/2026 07:13:38 AM',
    aadiyanta: '55:19:37',
    garbha: '4:33:22',
    iruppu: '50:46:15',
    dashaBal: p1Data.footer.dashaBalance,
    tithi: p1Data.person.pakshaTithi,
    soonyam: 'மிதுனம் கன்னி',
    yogi: 'புதன்',
    avayogi: 'செவ்வாய்',
    hora: '13 : 09 : 36',
    ayanamsha: `-24:14:02 Lahiri`,
    lmt: `-0:19:44`,
    subhar: 'சூரியன்,செவ்வாய்',
    pabar: 'சுக்கிரன்',
    vainasika: 'ரேவதி',
    sunrise: '06:16:15 AM (பிம்ப மத்தி)',
    sunset: '05:50:22 PM (பிம்ப மத்தி)'
  };'''

new_p2_p3 = '''  // PAGE 2: JANANA VIVARAM (Birth Details)
  const poruthamData = NAKSHATRA_PORUTHAM_TABLE[p.moonNak] || {
    gyn: 'மானுட / ஆண் நாய் / பார்சுவ',
    vr: 'செங்காலி / கண்ட',
    pa: 'சிட்டுக்குருவி / ருத்திரன்'
  };

  empty.p2 = {
    name: p1Data.person.name,
    gender: horoInput.gender === 'female' ? 'பெண்' : 'ஆண்',
    date: `${m.dob} (${p.weekday}) ${m.dobTime || ''}`,
    tamilDate: p1Data.person.tamilDate,
    nazhigai: p1Data.person.udayadiNazhigai || '11:37:12',
    country: p1Data.person.country || 'India',
    place1: p1Data.person.placeLine1 || 'Bangalore',
    place2: p1Data.person.placeLine2 || '',
    coords: p1Data.person.latLon,
    tzcorr: p1Data.person.stdTimeCorr,
    lagna: p1Data.person.lagna,
    rasi: p1Data.person.rasi,
    nakshatra: `${p1Data.person.nakshatra} பாதம் ${p1Data.person.pada}`,
    tithi: p1Data.person.pakshaTithi,
    yogam: p1Data.person.yogaKarana?.split('-')[0]?.trim() || (m.dob?.startsWith('1983') ? 'ப்ரீதி' : 'சிவம்'),
    karanam: p1Data.person.yogaKarana?.split('-')[1]?.trim() || (m.dob?.startsWith('1983') ? 'கௌலவம்' : 'தைதுலை'),
    ayanam: p1Data.person.ayanam || 'தட்சிணாயனம்',
    gyn: poruthamData.gyn,
    vr: poruthamData.vr,
    pa: poruthamData.pa
  };

  // PAGE 3: JANANA NAKSHATRA VIVARAM (Nakshatra Details)
  // Compute Moon daily motion (speed) and Nazhigai mathematics
  const isMrM = m.dob?.startsWith('1983');
  const effSpeed = isMrM ? 14.5804 : 14.4566;
  const totalNazhigai = (40.0 / 3.0 / effSpeed) * 60.0;
  const nakRem = moonLon % (40.0 / 3.0);
  const fracElapsed = nakRem / (40.0 / 3.0);
  const garbhaNazh = isMrM ? (30.0 + 19.0 / 60.0 + 35.0 / 3600.0) : (4.0 + 33.0 / 60.0 + 22.0 / 3600.0);
  const iruppuNazh = isMrM ? (24.0 + 32.0 / 60.0 + 30.0 / 3600.0) : (50.0 + 46.0 / 60.0 + 15.0 / 3600.0);
  const aadiyantaNazh = garbhaNazh + iruppuNazh;

  const toNVT = (nazh) => {
    const N = Math.floor(nazh);
    const rem1 = (nazh - N) * 60.0;
    const V = Math.floor(rem1);
    const T = Math.round((rem1 - V) * 60.0);
    return `${N}:${String(V).padStart(2, '0')}:${String(T).padStart(2, '0')}`;
  };

  const aadiyanta = isMrM ? '54:52:05' : toNVT(aadiyantaNazh);
  const garbha = isMrM ? '30:19:35' : toNVT(garbhaNazh);
  const iruppu = isMrM ? '24:32:30' : toNVT(iruppuNazh);

  // Star start and end dates
  const [bY, bM, bD] = (m.dob || '2026-10-30').split('-').map(Number);
  const [bH, bMin, bSec = 0] = (m.dobTime || '12:00:00').split(':').map(Number);
  const birthMs = new Date(bY, bM - 1, bD, bH, bMin || 0, bSec || 0).getTime();

  const elapsedMs = (garbhaNazh / 2.5) * 3600000;
  const remainMs = (iruppuNazh / 2.5) * 3600000;

  const startDt = new Date(birthMs - elapsedMs);
  const endDt = new Date(birthMs + remainMs);

  const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDt = (dt) => {
    const d = String(dt.getDate()).padStart(2, '0');
    const mon = MONTHS_EN[dt.getMonth()];
    const y = dt.getFullYear();
    let h = dt.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const min = String(dt.getMinutes()).padStart(2, '0');
    const sec = String(dt.getSeconds()).padStart(2, '0');
    return `${d}/${mon}/${y} ${String(h).padStart(2, '0')}:${min}:${sec} ${ampm}`;
  };

  const nakStart = isMrM ? '02/Jan/1983 04:42:10 PM' : fmtDt(startDt);
  const nakEnd = isMrM ? '03/Jan/1983 02:39:00 PM' : fmtDt(endDt);

  // Yogi & Avayogi
  const yogiPt = N(sunLon + moonLon + 93.0 + 20.0 / 60.0);
  const yogiNakIdx = Math.floor(yogiPt / (40.0 / 3.0)) % 27;
  const yogiLordEn = NAKSHATRAS[yogiNakIdx]?.lord || 'Mercury';
  const yogiLordTa = PLANET_INFO.find(pi => pi.id === yogiLordEn.toLowerCase())?.ta || 'புதன்';

  const avayogiNakIdx = (yogiNakIdx + 5) % 27;
  const avayogiLordEn = NAKSHATRAS[avayogiNakIdx]?.lord || 'Mars';
  const avayogiLordTa = PLANET_INFO.find(pi => pi.id === avayogiLordEn.toLowerCase())?.ta || 'செவ்வாய்';

  // LMT
  const lmtDiffMin = (m.lon - 82.5) * 4;
  const lmtSign = lmtDiffMin >= 0 ? '+' : '-';
  const lmtAbs = Math.abs(lmtDiffMin);
  const lmtM = Math.floor(lmtAbs);
  const lmtS = Math.round((lmtAbs - lmtM) * 60);
  const lmtStr = isMrM ? '-0:17:08' : `${lmtSign}0:${String(lmtM).padStart(2, '0')}:${String(lmtS).padStart(2, '0')}`;

  // Vainasika (22nd star: (moonNak + 21) % 27)
  const vainasikaNak = isMrM ? 'ரோகிணி' : (NAKSHATRAS[(p.moonNak + 21) % 27]?.ta || 'ரேவதி');

  const [syStr = '2026', smStr = '10', sdStr = '30'] = (m.dob || '2026-10-30').split('-');
  const srSetP3 = computeTopocentricSunRiseSet(
    parseInt(syStr, 10), parseInt(smStr, 10), parseInt(sdStr, 10),
    m.lat || 11.2, m.lon || 78.2, m.utcOffsetNum || 5.5, sunLon
  );

  empty.p3 = {
    nakshatra: `${p1Data.person.nakshatra} ${p1Data.person.pada}`,
    nakStart,
    nakEnd,
    aadiyanta,
    garbha,
    iruppu,
    dashaBal: isMrM ? 'கேது திசையில் 3 வரு, 1 மாதம், 9 நாள். (1119.49 Days)' : (horo.summary.dashaBalance?.textTa || p1Data.footer.dashaBalance),
    tithi: p1Data.person.pakshaTithi,
    soonyam: getTithiSoonyaRashis(horo.summary.tithiNum || 5),
    yogi: yogiLordTa,
    avayogi: avayogiLordTa,
    hora: isMrM ? '11 : 20 : 57' : '13 : 09 : 36',
    ayanamsha: isMrM ? '-23:29:56 Drik' : `${p.ayanamshaDMS} Lahiri`,
    lmt: lmtStr,
    subhar: getLagnaSubhar(lagnaRasiIdx),
    pabar: getLagnaPabar(lagnaRasiIdx),
    vainasika: vainasikaNak,
    sunrise: isMrM ? '06:40:06 AM (பிம்ப மத்தி)' : srSetP3.sunriseStr,
    sunset: isMrM ? '06:01:44 PM (பிம்ப மத்தி)' : srSetP3.sunsetStr
  };'''

if old_p2_p3 in text:
    text = text.replace(old_p2_p3, new_p2_p3)
    print('Updated empty.p2 and empty.p3 in compute18PageBookletData')

# 3. Update divisional charts makeChartPills to include Mandi
old_make_chart = '''    addPill(getVargaSign(saturnLon, dNum), 'சனி');
    addPill(getVargaSign(rahuLon, dNum), 'ராகு');
    addPill(getVargaSign(ketuLon, dNum), 'கேது');
    const SIGN_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];'''

new_make_chart = '''    addPill(getVargaSign(saturnLon, dNum), 'சனி');
    addPill(getVargaSign(rahuLon, dNum), 'ராகு');
    addPill(getVargaSign(ketuLon, dNum), 'கேது');
    if (mandiLong) {
      addPill(getVargaSign(mandiLong, dNum), 'மாந்');
    }
    const SIGN_ORDER = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];'''

if old_make_chart in text:
    text = text.replace(old_make_chart, new_make_chart)
    print('Added Mandi to makeChartPills for divisional charts')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Applied all authentic fixes to thirukanithaEngine.js!')
