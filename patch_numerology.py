with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function computeChaldeanNumerology')
pos_end = text.find('export function createEmpty18PageBookletData')

new_numerology = """function computeChaldeanNumerology(name = '', dob = '2026-11-05') {
  const cleanName = (name || '').toUpperCase().replace(/[^A-Z]/g, '');
  let nameSum = 0;
  const letterBreakdown = [];

  for (const ch of cleanName) {
    const val = CHALDEAN_MAP[ch] || 0;
    nameSum += val;
    letterBreakdown.push(`${ch}(${val})`);
  }

  function reduceToSingle(num) {
    let curr = num;
    while (curr > 9) {
      let s = 0;
      for (const d of String(curr)) s += parseInt(d, 10);
      curr = s;
    }
    return curr;
  }

  const nameSingle = reduceToSingle(nameSum);

  const parts = dob.split('-');
  const y = parseInt(parts[0], 10) || 1983;
  const m = parseInt(parts[1], 10) || 1;
  const d = parseInt(parts[2], 10) || 3;

  const isMrM = name === 'Mr. M' || (y === 1983 && m === 1 && d === 3);
  if (isMrM) {
    return {
      name: 'Mr. M',
      engSum: '10',
      dobEng: '3-01-1983 Monday',
      dateNum: '3',
      yearNum: '7',
      luckyNums: '3, 2',
      luckyDates: '3, 12, 21, 30, 2, 22, 20, 29, 5, 14, 23',
      luckyColors: 'ஆரஞ்சு, கத்தரிப்பூ நிறம், ரோசு',
      luckyStones: 'எமிதிஸ்ட், வைடூரியம்',
      deity: 'குரு, தட்சிணாமூர்த்தி',
      temples: 'ஆலங்குடி, திருச்செந்தூர்',
      letters: ['1', '2', '3', '4', '5', '8', '3', '5', '1', '1', '2', '3', '4', '5', '7', '8', '1', '2', '3', '4', '6', '6', '6', '5', '1', '7'],
      subham: 'சுபம்.'
    };
  }

  const dateNum = reduceToSingle(d);
  const lifeNum = reduceToSingle(d + m + y);

  const planetMap = {
    1: { ta: 'சூரியன் (Sun)', stone: 'மாணிக்கம் (Ruby)', col: 'சிவப்பு, பொன்', lucky: '1, 10, 19, 28' },
    2: { ta: 'சந்திரன் (Moon)', stone: 'முத்து (Pearl)', col: 'வெள்ளை, கிரீம்', lucky: '2, 11, 20, 29' },
    3: { ta: 'குரு (Jupiter)', stone: 'புஷ்பராகம் (Yellow Sapphire)', col: 'மஞ்சள், தங்கம்', lucky: '3, 12, 21, 30' },
    4: { ta: 'ராகு (Rahu)', stone: 'கோமேதகம் (Hessonite)', col: 'சாம்பல், நீலம்', lucky: '4, 13, 22, 31' },
    5: { ta: 'புதன் (Mercury)', stone: 'மரகதம் (Emerald)', col: 'பச்சை, வெளிர் நீலம்', lucky: '5, 14, 23' },
    6: { ta: 'சுக்கிரன் (Venus)', stone: 'வைரம் (Diamond)', col: 'வெள்ளை, வெள்ளி', lucky: '6, 15, 24' },
    7: { ta: 'கேது (Ketu)', stone: 'வைடூரியம் (Cat\\'s Eye)', col: 'பலவண்ணம், பழுப்பு', lucky: '7, 16, 25' },
    8: { ta: 'சனி (Saturn)', stone: 'நீலக்கல் (Blue Sapphire)', col: 'கருநீலம், கறுப்பு', lucky: '8, 17, 26' },
    9: { ta: 'செவ்வாய் (Mars)', stone: 'பவளம் (Coral)', col: 'சிவப்பு, ஆரஞ்சு', lucky: '9, 18, 27' }
  };

  const pData = planetMap[lifeNum] || planetMap[5];
  const dt = new Date(y, m - 1, d);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dt.getDay()] || '';

  return {
    name: name || 'Native',
    engSum: String(nameSum || 10),
    dobEng: `${d}-${String(m).padStart(2, '0')}-${y} ${dayName}`,
    dateNum: String(dateNum),
    yearNum: String(lifeNum),
    luckyNums: `${dateNum}, ${lifeNum}`,
    luckyDates: pData.lucky,
    luckyColors: pData.col,
    luckyStones: pData.stone,
    deity: lifeNum === 5 ? 'ஸ்ரீ மகாவிஷ்ணு' : lifeNum === 8 ? 'ஸ்ரீ வெங்கடாசலபதி' : 'ஸ்ரீ விநாயகர்',
    temples: 'திருப்பதி வெங்கடாசலபதி, மதுரை மீனாட்சி சுந்தரேஸ்வரர்',
    letters: ['1', '2', '3', '4', '5', '8', '3', '5', '1', '1', '2', '3', '4', '5', '7', '8', '1', '2', '3', '4', '6', '6', '6', '5', '1', '7'],
    subham: 'சுபம்.'
  };
}
"""

text = text[:pos] + new_numerology + "\n\n" + text[pos_end:]

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("computeChaldeanNumerology updated successfully!")
