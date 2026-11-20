with open(r'frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('const sunriseSunset = உதயம்:  | அஸ்தமனம்: ;', 'const sunriseSunset = `உதயம்: ${srSet.sunriseStr} | அஸ்தமனம்: ${srSet.sunsetStr}`;')
text = text.replace('const udayadiNazhigai = ${nazh} நாழிகை  விநாடி;', 'const udayadiNazhigai = `${nazh} நாழிகை ${vinazh} விநாடி`;')

with open(r'frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed backtick interpolations!')
