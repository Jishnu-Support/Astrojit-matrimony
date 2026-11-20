import sys

with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect where compute51PageBookletData starts and ends
pos51 = text.find('export function compute51PageBookletData')
pos33 = text.find('export function compute33PageBookletData')
pos25 = text.find('export function compute25PageBookletData')

print('pos25:', pos25, 'pos33:', pos33, 'pos51:', pos51)
