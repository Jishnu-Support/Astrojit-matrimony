import os
import re

path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update summary in calculateThirukanithaHoroscope to include lagnaDeg360
content = content.replace(
    'lagnaDMS: formatDMS(Lagna_nirayana),',
    'lagnaDeg360: Lagna_nirayana,\n      lagnaDMS: formatDMS(Lagna_nirayana),'
)

# 2. Update return in calculateThirukanithaHoroscope to include getPlanetBhava
content = content.replace(
    'charts\n  };',
    'charts,\n    getPlanetBhava\n  };'
)

# 3. Update Karana calculation in computeHoroscopePagerData
old_karana = """  const phase = N(moonLong - sunLong);
  const karanaIndex = Math.floor(phase / 6) % 11;
  const karanaName = KARANAS_TA[karanaIndex] || '';"""

new_karana = """  const phase = N(moonLong - sunLong);
  const karanaK = Math.floor(phase / 6);
  let karanaName = '';
  if (karanaK === 0) {
    karanaName = 'கிம்ஸ்துக்னம்';
  } else if (karanaK >= 57) {
    const fixedK = ['சகுனி', 'சதுஷ்பாதம்', 'நாகவம்'];
    karanaName = fixedK[karanaK - 57] || 'நாகவம்';
  } else {
    const movableK = ['பவ', 'பாலவ', 'கௌலவம்', 'தைதுலை', 'கரசை', 'வனசை', 'பத்திரை'];
    karanaName = movableK[(karanaK - 1) % 7];
  }"""

if old_karana in content:
    content = content.replace(old_karana, new_karana)
    print('Replaced Karana calculation!')
else:
    print('Warning: old_karana not found directly')

# 4. Update computeClassicalMandi for night birth previous day handling
old_mandi = """  const mandiHoro = calculateThirukanithaHoroscope({
    dob: `${Y}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`,
    dobTime: `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}:${String(eS).padStart(2, '0')}`,
    lat,
    lon,
    utcOffset: utcOffsetNum
  });"""

new_mandi = """  let mY = Y, mM = M, mD = D;
  if (!isDay && birthHour < sunriseHours) {
    const prevDate = new Date(Y, M - 1, D - 1);
    mY = prevDate.getFullYear();
    mM = prevDate.getMonth() + 1;
    mD = prevDate.getDate();
  }

  const mandiHoro = calculateThirukanithaHoroscope({
    dob: `${mY}-${String(mM).padStart(2, '0')}-${String(mD).padStart(2, '0')}`,
    dobTime: `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}:${String(eS).padStart(2, '0')}`,
    lat,
    lon,
    utcOffset: utcOffsetNum
  });"""

if old_mandi in content:
    content = content.replace(old_mandi, new_mandi)
    print('Updated computeClassicalMandi previous day handling!')
else:
    print('Warning: old_mandi not found directly')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Phase 1 applied successfully!')
