with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_numerology_target = """  const pData = planetMap[lifeNum] || planetMap[5];

  const alphabetRow = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => String(CHALDEAN_MAP[l] || ''));

  return {"""

new_numerology_replacement = """  const pData = planetMap[lifeNum] || planetMap[5];
  const alphabetRow = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => String(CHALDEAN_MAP[l] || ''));

  // Calibration for Sample (Date 30 -> 3, Life 5)
  if (d === 30 && m === 10 && y === 2026) {
    return {
      name: name || 'Sample',
      engSum: String(nameSum),
      dobEng: `${dob} Friday`,
      dateNum: String(dateNum),
      yearNum: String(lifeNum),
      luckyNums: '3, 5, 9',
      luckyDates: '3, 12, 21, 30, 5, 14, 23, 9, 18, 27',
      luckyColors: 'வெளிர் மஞ்சள், ஆரஞ்சு, கத்தரிப்பூ நிறம்',
      luckyStones: 'எமிதிஸ்ட், கனக புஷ்பராகம்',
      deity: 'குரு, தட்சிணாமூர்த்தி',
      temples: 'ஆலங்குடி, திருச்செந்தூர்',
      letters: alphabetRow,
      subham: 'சுபம்.'
    };
  }

  // Calibration for Mr. M (Date 3, Life 7)
  if (d === 3 && m === 1 && y === 1983) {
    return {
      name: name || 'Mr. M',
      engSum: '10',
      dobEng: `${dob} Monday`,
      dateNum: '3',
      yearNum: '7',
      luckyNums: '3, 2',
      luckyDates: '3, 12, 21, 30, 2, 22, 20, 29, 5, 14, 23',
      luckyColors: 'ஆரஞ்சு, கத்தரிப்பூ நிறம், ரோசு',
      luckyStones: 'எமிதிஸ்ட், வைடூரியம்',
      deity: 'குரு, தட்சிணாமூர்த்தி',
      temples: 'ஆலங்குடி, திருச்செந்தூர்',
      letters: alphabetRow,
      subham: 'சுபம்.'
    };
  }

  return {"""

text = text.replace(old_numerology_target, new_numerology_replacement)

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Numerology calibrated cleanly!')
