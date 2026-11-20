with open(r'frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "date: `${m.dob} (${p.weekday}) ${m.dobTime || ''}`,"
replacement = "date: `${m.dob} (${p.weekday?.ta || p.weekday?.en || (typeof p.weekday === 'string' ? p.weekday : '')}) ${m.dobTime || ''}`,"

if target in text:
    text = text.replace(target, replacement)
    print('Replaced!')
else:
    print('Target not found')

with open(r'frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)
