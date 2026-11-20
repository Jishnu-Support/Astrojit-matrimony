path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    upagrahas: computeUpagrahasData({
      Y, M, D,
      localHour,
      lat, lon,
      utcOffset: numUtcOffset,
      Ayanamsha,
      eps,
      lamSun_tropical,
      lamSun_nirayana,
      Lagna_nirayana,
      isMrM
    })'''

replacement = '''    upagrahas: computeUpagrahasData({
      Y, M, D,
      localHour,
      lat, lon,
      utcOffset: numUtcOffset,
      Ayanamsha,
      eps,
      lamSun_tropical,
      lamSun_nirayana,
      Lagna_nirayana,
      isMrM
    }),
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

if target in content:
    content = content.replace(target, replacement, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Successfully added specialLagnas to return object.')
else:
    print('Target not found!')
