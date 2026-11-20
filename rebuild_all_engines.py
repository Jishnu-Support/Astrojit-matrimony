import os
import subprocess

engine_path = r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\frontend\src\utils\thirukanithaEngine.js'

# Step 0: Restore baseline from git HEAD
subprocess.run(['git', '-C', r'C:\Users\HP\.gemini\antigravity\scratch\astrojit', 'checkout', 'HEAD', '--', r'frontend/src/utils/thirukanithaEngine.js'])

# Step 1: Run recovered_p21.js (appends 21-page engine)
subprocess.run(['python', r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\recovered_p21.js'], cwd=r'C:\Users\HP\.gemini\antigravity\scratch\astrojit')

# Step 2: Run recovered_12738.js (appends 25-page engine)
subprocess.run(['python', r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\recovered_12738.js'], cwd=r'C:\Users\HP\.gemini\antigravity\scratch\astrojit')

# Step 3: Append recovered_12941.js (appends 33-page engine)
with open(r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\recovered_12941.js', 'r', encoding='utf-8') as f:
    code_33 = f.read()

with open(engine_path, 'a', encoding='utf-8') as f:
    f.write('\n' + code_33)

# Step 4: Apply recovered_engine_extension.js (edits end of 33 to add 51-page engine)
with open(r'C:\Users\HP\.gemini\antigravity\scratch\astrojit\recovered_engine_extension.js', 'r', encoding='utf-8') as f:
    code_51 = f.read()

with open(engine_path, 'r', encoding='utf-8') as f:
    cur = f.read()

target = '''  // Page 32: Sarvashtavarga Table
  empty.p32 = p18Data.p17;

  // Page 33: Chaldean Numerology
  empty.p33 = p18Data.p18;

  return empty;
}'''

if target in cur:
    cur = cur.replace(target, code_51)
    with open(engine_path, 'w', encoding='utf-8') as f:
        f.write(cur)
    print('Applied 51-page extension successfully!')
else:
    print('Target not found for 51-page extension!')

print('Rebuilt all engines! Total file length:', os.path.getsize(engine_path))
