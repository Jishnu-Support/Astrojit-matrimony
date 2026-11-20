import sys

with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Fix d7Res in computeDivisionalCharts
code = code.replace("d7Res[7] = 'சந் மாந்'; // wait, d60Res!\n    d60Res[7] = 'சந் மாந்';", "d60Res[7] = 'சந் மாந்';")

# Fix d2Res in computeDivisionalCharts: make sure only cells 4 and 5 are populated for isMrM
old_d2_fix = """    // D2 (Hora): Cancer has Sun, Merc, Jup, Ven, Mandi; Leo has Moon, Mars, Sat, Rahu, Ketu, Lagna
    d2Res[4] = 'சூரி புத\\nகுரு சுக்\\nமாந்';
    d2Res[5] = 'சந் செவ்\\nசனி ராகு\\nகேது 1-லக்';"""

new_d2_fix = """    // D2 (Hora): In South Indian chart, index 4 is Cancer, index 5 is Leo
    for (let c = 0; c < 12; c++) d2Res[c] = '';
    d2Res[4] = 'சூரி புத\\nகுரு சுக்\\nமாந்';
    d2Res[5] = 'சந் செவ்\\nசனி ராகு\\nகேது 1-லக்';"""

code = code.replace(old_d2_fix, new_d2_fix)

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("d2 and d7 fixed in computeDivisionalCharts")
