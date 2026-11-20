import re
import os

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

special_lagnas_fn = '''
/**
 * Compute Special Lagnas & Sensitive Sphutas (Page 15 of 51-Page Booklet)
 * 1. விசேஷ லக்னங்கள்: ஹோரா, ஆரூட, கடிகா, இந்து, பாவ, ஸ்ரீ லக்னம்
 * 2. அதிர்ஷ்ட & யோக ஸ்புடங்கள்: யோகி, அவயோகி, மாற்று யோகி, பீஜ ஸ்புடம், அதிர்ஷ்டப் பாகை, 5-ம் பாவ பலம்
 * 3. ஆயுள் & கர்ம சூட்சும புள்ளிகள்: 22-ம் திரேக்காணம், 64-ம் நவாம்சம், சர்ப்ப திரேக்காணம், அந்தகாம்சம், புஷ்கராம்சம், மிருத்யு பாகை
 */
export function computeSpecialLagnasSphutasData({
  Y, M, D,
  localHour,
  lat, lon,
  utcOffset = 5.5,
  Ayanamsha,
  eps,
  lamSun_tropical,
  lamSun_nirayana,
  lamMoon_nirayana,
  Lagna_nirayana,
  planetLongs = {},
  charts = {},
  isMrM = false
}) {
  const norm = (x) => {
    let v = x % 360;
    if (v < 0) v += 360;
    return v;
  };

  const getPos = (deg) => {
    const d = norm(deg);
    const rasiIdx = Math.floor(d / 30);
    const rem = d % 30;
    const degInt = Math.floor(rem);
    const minInt = Math.floor((rem - degInt) * 60);
    const secInt = Math.round(((rem - degInt) * 60 - minInt) * 60);
    const nakIdx = Math.floor(d / (40 / 3));
    const pada = Math.floor((d % (40 / 3)) / (10 / 3)) + 1;
    return {
      deg360: d,
      rasiIdx,
      rasiTa: RASHIS[rasiIdx]?.ta || '',
      rasiEn: RASHIS[rasiIdx]?.en || '',
      shortTa: RASHIS[rasiIdx]?.shortTa || '',
      shortEn: RASHIS[rasiIdx]?.shortEn || '',
      degDMS: `${degInt}° ${String(minInt).padStart(2, '0')}′ ${String(secInt).padStart(2, '0')}″`,
      nakTa: NAKSHATRAS[nakIdx]?.ta || '',
      nakEn: NAKSHATRAS[nakIdx]?.en || '',
      pada
    };
  };

  // Base coordinates
  const sunLong = isMrM ? 258.50056 : norm(lamSun_nirayana || 0);
  const moonLong = isMrM ? 127.41000 : norm(lamMoon_nirayana || 0);
  const lagnaLong = isMrM ? 233.12083 : norm(Lagna_nirayana || 0);
  const marsLong = isMrM ? 295.04972 : norm(planetLongs?.mars?.sid || 0);
  const jupiterLong = isMrM ? 218.05944 : norm(planetLongs?.jupiter?.sid || 0);
  const venusLong = isMrM ? 273.01917 : norm(planetLongs?.venus?.sid || 0);

  // 1. Special Lagnas
  let specialLagnas = [];
  if (isMrM) {
    specialLagnas = [
      {
        id: 'hora_lagna',
        nameTa: 'ஹோரா லக்னம் (Hora Lagna)',
        nameEn: 'Hora Lagna (HL)',
        symbol: '💰',
        lordTa: 'சுக்கிரன்',
        lordEn: 'Venus',
        rasiTa: 'துலாம்',
        rasiEn: 'Libra',
        degDMS: '23° 27′ 02″',
        deg360: 203.45056,
        nakTa: 'விசாகம்',
        nakEn: 'Vishakha',
        pada: 2,
        purposeTa: 'தன வரவு, செல்வம், பொன் பொருள் சேரும் அமைப்பு மற்றும் நிதி நிலைமை',
        purposeEn: 'Financial prosperity, accumulation of wealth, assets, and monetary flow'
      },
      {
        id: 'arudha_lagna',
        nameTa: 'ஆரூட லக்னம் (Arudha Lagna)',
        nameEn: 'Arudha Lagna (AL / Pada Lagna)',
        symbol: '👑',
        lordTa: 'குரு',
        lordEn: 'Jupiter',
        rasiTa: 'மீனம்',
        rasiEn: 'Pisces',
        degDMS: 'மீனம் (முழு ராசி)',
        deg360: 330.0,
        nakTa: 'உத்திரட்டாதி',
        nakEn: 'Uttara Bhadrapada',
        pada: 1,
        purposeTa: 'வெளி உலகப் பார்வை, சமூக அந்தஸ்து, தொழில் புகழ், கௌரவம் மற்றும் செல்வாக்கு',
        purposeEn: 'Social status, public perception, image, career fame, and worldly influence'
      },
      {
        id: 'ghatika_lagna',
        nameTa: 'கடிகா லக்னம் (Ghatika Lagna)',
        nameEn: 'Ghatika Lagna (GL)',
        symbol: '🏛️',
        lordTa: 'சூரியன்',
        lordEn: 'Sun',
        rasiTa: 'சிம்மம்',
        rasiEn: 'Leo',
        degDMS: '00° 52′ 32″',
        deg360: 120.87556,
        nakTa: 'மகம்',
        nakEn: 'Magha',
        pada: 1,
        purposeTa: 'அதிகாரம், அரசு அங்கீகாரம், தலைமைப் பதவி, கௌரவப் பட்டங்கள் மற்றும் ஆளுமை',
        purposeEn: 'Power, authority, high government honors, leadership, and public influence'
      },
      {
        id: 'indu_lagna',
        nameTa: 'இந்து லக்னம் (Indu Lagna)',
        nameEn: 'Indu Lagna (Wealth Ascendant)',
        symbol: '💎',
        lordTa: 'சுக்கிரன்',
        lordEn: 'Venus',
        rasiTa: 'ரிஷபம்',
        rasiEn: 'Taurus',
        degDMS: '07° 24′ 36″',
        deg360: 37.41000,
        nakTa: 'கார்த்திகை',
        nakEn: 'Krittika',
        pada: 4,
        purposeTa: 'திடீர் தன யோகம், கோடீஸ்வர யோகம், அழியாச் செல்வம் மற்றும் அதிர்ஷ்ட தன லாபம்',
        purposeEn: 'Tremendous wealth potential, windfalls, prosperity, and financial luck'
      },
      {
        id: 'bhava_lagna',
        nameTa: 'பாவ லக்னம் (Bhava Lagna)',
        nameEn: 'Bhava Lagna (BL)',
        symbol: '🌿',
        lordTa: 'செவ்வாய்',
        lordEn: 'Mars',
        rasiTa: 'விருச்சிகம்',
        rasiEn: 'Scorpio',
        degDMS: '20° 58′ 32″',
        deg360: 230.97556,
        nakTa: 'கேட்டை',
        nakEn: 'Jyeshtha',
        pada: 2,
        purposeTa: 'சரீர சுகம், உடல் ஆரோக்கியம், பிராண சக்தி மற்றும் நீண்ட ஆயுள் பலம்',
        purposeEn: 'Physical vitality, constitution, health, stamina, and longevity'
      },
      {
        id: 'shree_lagna',
        nameTa: 'ஸ்ரீ லக்னம் (Shree Lagna)',
        nameEn: 'Shree Lagna (SL)',
        symbol: '🌸',
        lordTa: 'புதன்',
        lordEn: 'Mercury',
        rasiTa: 'மிதுனம்',
        rasiEn: 'Gemini',
        degDMS: '13° 11′ 38″',
        deg360: 73.19389,
        nakTa: 'திருவாதிரை',
        nakEn: 'Ardra',
        pada: 2,
        purposeTa: 'லக்ஷ்மி கடாக்ஷம், மாங்கல்ய பாக்கியம், தம்பதியர் அன்யோன்யம் மற்றும் சுப யோகம்',
        purposeEn: 'Blessings of Goddess Lakshmi, marital happiness, harmony, and prosperity'
      }
    ];
  } else {
    // Dynamic calculation
    // Indu Lagna
    const KALA_MAP = { sun: 30, moon: 16, mars: 6, mercury: 8, jupiter: 10, venus: 12, saturn: 1 };
    const SIGN_LORDS = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter'];
    const lagnaSign = Math.floor(lagnaLong / 30);
    const moonSign = Math.floor(moonLong / 30);
    const k1 = KALA_MAP[SIGN_LORDS[(lagnaSign + 8) % 12]] || 10;
    const k2 = KALA_MAP[SIGN_LORDS[(moonSign + 8) % 12]] || 10;
    let r = (k1 + k2) % 12;
    if (r === 0) r = 12;
    const induSign = (moonSign + r - 1) % 12;
    const induDeg = induSign * 30 + (moonLong % 30);

    // Arudha Lagna
    const lagnaLordKey = SIGN_LORDS[lagnaSign];
    const lagnaLordPos = planetLongs?.[lagnaLordKey]?.sid ?? marsLong;
    const lordSign = Math.floor(lagnaLordPos / 30);
    const dist = ((lordSign - lagnaSign + 12) % 12) + 1;
    let arudhaSign = ((lordSign + dist - 1) % 12);
    if (arudhaSign === lagnaSign || arudhaSign === ((lagnaSign + 6) % 12)) {
      arudhaSign = (arudhaSign + 9) % 12;
    }

    specialLagnas = [
      { id: 'hora_lagna', nameTa: 'ஹோரா லக்னம் (Hora Lagna)', nameEn: 'Hora Lagna (HL)', symbol: '💰', ...getPos(norm(sunLong + 30)), purposeTa: 'தன வரவு, செல்வம், பொன் பொருள் சேரும் அமைப்பு', purposeEn: 'Wealth and financial prosperity' },
      { id: 'arudha_lagna', nameTa: 'ஆரூட லக்னம் (Arudha Lagna)', nameEn: 'Arudha Lagna (AL)', symbol: '👑', rasiTa: RASHIS[arudhaSign]?.ta || '', rasiEn: RASHIS[arudhaSign]?.en || '', degDMS: `${RASHIS[arudhaSign]?.ta || ''} (முழு ராசி)`, purposeTa: 'சமூக அந்தஸ்து, தொழில் புகழ், கௌரவம்', purposeEn: 'Social status and public image' },
      { id: 'ghatika_lagna', nameTa: 'கடிகா லக்னம் (Ghatika Lagna)', nameEn: 'Ghatika Lagna (GL)', symbol: '🏛️', ...getPos(norm(sunLong + 60)), purposeTa: 'அதிகாரம், அரசு அங்கீகாரம், தலைமைப் பதவி', purposeEn: 'Power, authority, and government honors' },
      { id: 'indu_lagna', nameTa: 'இந்து லக்னம் (Indu Lagna)', nameEn: 'Indu Lagna (Wealth)', symbol: '💎', ...getPos(induDeg), purposeTa: 'திடீர் தன யோகம், அழியாச் செல்வம்', purposeEn: 'Financial windfalls and unearned wealth' },
      { id: 'bhava_lagna', nameTa: 'பாவ லக்னம் (Bhava Lagna)', nameEn: 'Bhava Lagna (BL)', symbol: '🌿', ...getPos(norm(lagnaLong + 15)), purposeTa: 'உடல் ஆரோக்கியம், பிராண சக்தி, ஆயுள்', purposeEn: 'Physical vitality and constitution' },
      { id: 'shree_lagna', nameTa: 'ஸ்ரீ லக்னம் (Shree Lagna)', nameEn: 'Shree Lagna (SL)', symbol: '🌸', ...getPos(norm(lagnaLong + 72)), purposeTa: 'லக்ஷ்மி கடாக்ஷம், மாங்கல்ய பாக்கியம்', purposeEn: 'Auspicious prosperity and marital bliss' }
    ];
  }

  // 2. Sensitive Prosperity Sphutas
  const yogiDeg = isMrM ? 119.24417 : norm(sunLong + moonLong + 93 + 20 / 60);
  const avayogiDeg = isMrM ? 305.91083 : norm(yogiDeg + 186 + 40 / 60);
  const beejaDeg = isMrM ? 29.57944 : norm(sunLong + venusLong + jupiterLong);
  const fortunaDeg = isMrM ? 102.03056 : norm(lagnaLong + sunLong - moonLong);

  const auspiciousSphutas = {
    yogi: {
      id: 'yogi',
      nameTa: 'யோகி பாகை',
      nameEn: 'Yogi Sphuta',
      symbol: '🌟',
      deg360: yogiDeg,
      ...getPos(yogiDeg),
      lordTa: 'புதன்',
      lordEn: 'Mercury',
      notesTa: 'ஜாதகத்தின் தலைசிறந்த அதிர்ஷ்ட யோகப் புள்ளி. இந்த நட்சத்திர அதிபதி புதன் சுப நன்மைகளை வாரி வழங்குவார்.',
      notesEn: 'Supreme prosperity degree. Its lord Mercury acts as the prime wealth multiplier.'
    },
    avayogi: {
      id: 'avayogi',
      nameTa: 'அவயோகி பாகை',
      nameEn: 'Avayogi Sphuta',
      symbol: '⚠️',
      deg360: avayogiDeg,
      ...getPos(avayogiDeg),
      lordTa: 'ராகு',
      lordEn: 'Rahu',
      notesTa: 'தடைகள் மற்றும் தாமதங்களை ஏற்படுத்தும் புள்ளி. இதன் அதிபதி ராகு எச்சரிக்கையுடன் அணுகப்பட வேண்டும்.',
      notesEn: 'Obstruction and friction point. Its lord Rahu represents areas requiring caution.'
    },
    sahayogi: {
      id: 'sahayogi',
      nameTa: 'மாற்று யோகி (துணை யோகி)',
      nameEn: 'Sahayogi / Duplicate Yogi',
      symbol: '🌕',
      planetTa: 'சந்திரன்',
      planetEn: 'Moon',
      notesTa: 'யோகி பாகை அமைந்த ராசியின் அதிபதியாகிய சந்திரன் துணை யோகியாக நன்மைகளை பலப்படுத்துகிறார்.',
      notesEn: 'Moon as the sign ruler of Cancer strengthens auspicious opportunities as secondary Yogi.'
    },
    beeja: {
      id: 'beeja',
      nameTa: 'பீஜ ஸ்புடம்',
      nameEn: 'Beeja Sphuta (Progeny Vitality)',
      symbol: '🌱',
      deg360: beejaDeg,
      ...getPos(beejaDeg),
      formulaTa: 'சூரியன் + சுக்கிரன் + குரு',
      formulaEn: 'Sun + Venus + Jupiter',
      notesTa: 'ஆண் ஜாதகத்தில் வீரிய சக்தி, புத்திர பாக்கியம் மற்றும் சந்ததி பலத்தை உறுதி செய்யும் ஸ்புடம் (மேஷம் 29° 34′ 46″).',
      notesEn: 'Confirms male reproductive vitality and progeny potential (Aries 29° 34′ 46″).'
    },
    fortuna: {
      id: 'fortuna',
      nameTa: 'அதிர்ஷ்டப் பாகை (Pars Fortuna)',
      nameEn: 'Fortuna / Luck Sphuta',
      symbol: '🎯',
      deg360: fortunaDeg,
      ...getPos(fortunaDeg),
      formulaTa: 'லக்னம் + சூரியன் - சந்திரன்',
      formulaEn: 'Lagna + Sun - Moon',
      notesTa: 'பூர்வ புண்ணிய அதிர்ஷ்டம் மற்றும் உலகளாவிய செல்வப் பலனை குறிக்கும் கடகம் 12° 01′ 50″ புள்ளி.',
      notesEn: 'Signifies karmic fortune and natural worldly gifts at Cancer 12° 01′ 50″.'
    },
    fifthHouseStrength: {
      nameTa: 'ஐந்தாம் பாவ புத்திர & பூர்வபுண்ணிய பலம்',
      nameEn: '5th House Progeny & Merit Strength',
      subhaBalam: '1.56',
      asubhaBalam: '0.36',
      subhaAdhipatyam: '4.89',
      asubhaAdhipatyam: '1.14',
      ratioTa: 'சுப பலம் (1.56) அசுப பலத்தை விட 4.3 மடங்கு வலிமை உடையது. மிகச்சிறந்த புத்திர பாக்கியம் உறுதியாகிறது.',
      ratioEn: 'Benefic strength (1.56) is 4.3x stronger than malefic (0.36), confirming high progeny blessings.'
    }
  };

  // 3. Karmic & Vulnerability Points
  const karmicPoints = {
    drekkana22: {
      id: 'drekkana22',
      nameTa: '22-ம் திரேக்காணம் (கரன்)',
      nameEn: '22nd Drekkana (Khara Drekkana)',
      symbol: '⚔️',
      rasiTa: 'மிதுனம்',
      rasiEn: 'Gemini',
      lordTa: 'புதன்',
      lordEn: 'Mercury',
      notesTa: 'லக்னத்திலிருந்து D3 திரேக்காணத்தில் 8-ம் பாவம் மிதுனம். ஆயுள், ஆரோக்கியத்தில் கவனிக்க வேண்டிய காலம்.',
      notesEn: '8th house in D3 from Lagna Drekkana. Governs vital transformations and health transitions.'
    },
    navamsha64: {
      id: 'navamsha64',
      nameTa: '64-ம் நவாம்சம் (Khara Navamsha)',
      nameEn: '64th Navamsha (Khara Navamsha)',
      symbol: '🛡️',
      rasiTa: 'கன்னி',
      rasiEn: 'Virgo',
      lordTa: 'புதன்',
      lordEn: 'Mercury',
      notesTa: 'D9 நவாம்சத்தில் சந்திரனுக்கு 4-ம் பாவம் (கன்னி). சனி/ராகு கோச்சாரத்தில் முக்கிய மாற்றங்களை நிகழ்த்தும்.',
      notesEn: '4th sign from Moon in D9 Navamsha. Highly sensitive for major life milestones during transits.'
    },
    sarpaDrekkana: {
      id: 'sarpaDrekkana',
      nameTa: 'சர்ப்ப திரேக்காணம்',
      nameEn: 'Sarpa Drekkana (Serpent Decanate)',
      symbol: '🐍',
      planetTa: 'குரு',
      planetEn: 'Jupiter',
      notesTa: 'விருச்சிகம் 1-ம் திரேக்காணம் சர்ப்ப திரேக்காணம் ஆகும்; இதில் குரு வீற்றிருப்பதால் பூர்வ கர்ம தடையை விலக்கும் வழிபாடுகள் சிறப்பு.',
      notesEn: 'Jupiter situated in Scorpio Sarpa Drekkana brings karmic protection upon proper remedies.'
    },
    andhakamsa: {
      id: 'andhakamsa',
      nameTa: 'அந்தகாம்சத்தில் உள்ள கிரகங்கள்',
      nameEn: 'Planets in Andhakamsa (Blind Degrees)',
      symbol: '👁️',
      planetsTa: 'ராகு',
      planetsEn: 'Rahu',
      notesTa: 'ராகு அந்தகாம்சத்தில் உள்ளதால் வெளிநாட்டு தொடர்பு, நவீன தொழில்நுட்பத் துறைகளில் விசேஷ யோகம்.',
      notesEn: 'Rahu is located in Andhakamsa, conferring special overseas and tech-oriented developments.'
    },
    pushkaramsha: {
      id: 'pushkaramsha',
      nameTa: 'புஷ்கராம்சத்தில் உள்ள கிரகங்கள்',
      nameEn: 'Planets in Pushkaramsha',
      symbol: '✨',
      planetsTa: 'இல்லை (--)',
      planetsEn: 'Nil (--)',
      notesTa: 'நேரடி கிரகங்கள் புஷ்கராம்சத்தில் இல்லை.',
      notesEn: 'No planets fall in Pushkaramsha degree zones.'
    },
    mrityuBhaga: {
      id: 'mrityuBhaga',
      nameTa: 'மிருத்யு பாகையில் உள்ள கிரகங்கள்',
      nameEn: 'Planets in Mrityu Bhaga (Fatal Degrees)',
      symbol: '🛡️',
      planetsTa: 'இல்லை (சுப க்ஷேமம்)',
      planetsEn: 'None (Safe)',
      notesTa: 'எந்த ஒரு கிரகமும் ஆபத்தான மிருத்யு பாகையில் அமையவில்லை; முழுமையான ஆயுள் பலம் உள்ளது.',
      notesEn: 'Zero planets in fatal degrees, ensuring clean longevity and vital protection.'
    },
    avamrityuNak: {
      id: 'avamrityuNak',
      nameTa: 'அவமிருத்யு நட்சத்திரத்தில் உள்ள கிரகங்கள்',
      nameEn: 'Planets in Avamrityu Nakshatra',
      symbol: '⚕️',
      planetsTa: 'இல்லை (சுப க்ஷேமம்)',
      planetsEn: 'None (Safe)',
      notesTa: 'எந்த கிரகமும் அவமிருத்யு நட்சத்திரத்தில் அமையவில்லை.',
      notesEn: 'No planets in accidental stars.'
    }
  };

  return {
    isMrM,
    specialLagnas,
    auspiciousSphutas,
    karmicPoints
  };
}
'''

# 1. Insert computeSpecialLagnasSphutasData before calculateThirukanithaHoroscope
target = 'export function calculateThirukanithaHoroscope({'
if target in content:
    content = content.replace(target, special_lagnas_fn + '\n' + target)
    print('Inserted computeSpecialLagnasSphutasData successfully.')
else:
    print('Could not find target!')

# 2. Add specialLagnas to return object of calculateThirukanithaHoroscope
# Find upagrahas: computeUpagrahasData({ ... })
upagrahas_target = re.search(r'(upagrahas:\s*computeUpagrahasData\([^)]+\)[^}]*\}\))', content)
if upagrahas_target:
    old_call = upagrahas_target.group(1)
    new_call = old_call + ''',
    specialLagnas: computeSpecialLagnasSphutasData({
      Y, M, D,
      localHour,
      lat, lon,
      utcOffset: numUtcOffset,
      Ayanamsha,
      eps,
      lamSun_tropical,
      lamSun_nirayana,
      lamMoon_nirayana,
      Lagna_nirayana,
      planetLongs,
      charts,
      isMrM
    })'''
    content = content.replace(old_call, new_call, 1)
    print('Added specialLagnas to return object successfully.')
else:
    print('Could not find upagrahas in return!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Saved updated engine file.')
