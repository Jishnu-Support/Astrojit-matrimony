import re

with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect where compute18MahadashaPages, computeDivisionalCharts, computeAntaraEndDates, compute25PageBookletData, compute33PageBookletData, compute51PageBookletData are.
print('File length:', len(text))
