with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('p1Data.person.name', '(p1Data.name || p1Data.person?.name || "Mr. M")')
text = text.replace('p1Data.birth.time', '(p1Data.time || p1Data.birth?.time || "04:50")')

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Replaced p1Data.person.name and p1Data.birth.time safely")
