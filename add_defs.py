with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    text = f.read()

defs = """export function createEmpty33PageBookletData() {
  const empty = {};
  for (let i = 1; i <= 33; i++) {
    empty[`p${i}`] = {};
  }
  return empty;
}

export function createEmpty51PageBookletData() {
  const empty = {};
  for (let i = 1; i <= 51; i++) {
    empty[`p${i}`] = {};
  }
  return empty;
}
"""

pos = text.find('export function compute33PageBookletData')
text = text[:pos] + defs + "\n\n" + text[pos:]

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added createEmpty33 and createEmpty51 definitions")
