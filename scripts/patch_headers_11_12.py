with open('frontend/src/components/ThirukanithaHoroscopeView.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = "<span>{isTamil ? '11. உபகிரகங்கள் - குளிகாதி ஐவர் & தூமாதி ஐவர் விபரங்கள்' : '11. Secondary Planets (Upagrahas) - Gulikaadi & Dhumadi Details'}</span>"
replacement1 = "<span>{isTamil ? '11. உபகிரகங்கள் - குளிகாதி ஐவர் விபரங்கள்.' : '11. Upagrahas - Gulikadi Five Details'}</span>"

target2 = "<span>{isTamil ? '12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்' : '12. Special Lagnas & Sensitive Sphutas Analysis'}</span>"
replacement2 = "<span>{isTamil ? '12. உப கிரகங்கள் - முக்கிய ஸ்புடங்கள் - லக்ன பாகைகள்.' : '12. Upagrahas - Special Sphutas - Lagna Degrees'}</span>"

assert target1 in content, 'target1 not found'
assert target2 in content, 'target2 not found'

content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)

with open('frontend/src/components/ThirukanithaHoroscopeView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully patched ThirukanithaHoroscopeView headers!')
