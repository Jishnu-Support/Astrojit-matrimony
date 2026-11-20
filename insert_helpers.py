with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    engine = f.read()

with open('recovered_12738.js', 'r', encoding='utf-8') as f:
    text_12738 = f.read()
pos_antara = text_12738.find('export function computeAntaraEndDates')
pos_empty25 = text_12738.find('export function createEmpty25PageBookletData')
helpers_12738 = text_12738[pos_antara:pos_empty25]

with open('recovered_12941.js', 'r', encoding='utf-8') as f:
    text_12941 = f.read()
pos_dignities = text_12941.find('export function computeDignitiesAndAspects')
pos_empty33 = text_12941.find('export function createEmpty33PageBookletData')
helpers_12941 = text_12941[pos_dignities:pos_empty33]

# In computeDivisionalCharts, add Mandi
helpers_12738 = helpers_12738.replace(
    "const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];",
    "const grahaKeys = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'maandi'];"
)

# Insert before createEmpty25PageBookletData
target = 'export function createEmpty25PageBookletData()'
new_content = helpers_12738 + '\n' + helpers_12941 + '\n' + target
engine = engine.replace(target, new_content)

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(engine)

print('Successfully inserted helper functions!')
