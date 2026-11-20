import pypdf

reader = pypdf.PdfReader(r'C:\Users\HP\.gemini\antigravity\brain\4900a36f-37a2-45c5-917a-9a9382269cdd\.user_uploaded\media_1794995445987_9523962a.pdf')

glyphs = {
    'ã¬': 'sun', 'Nk': 'moon', 'ùNq': 'mars', '×R': 'mercury', 'ÏÚ': 'jupiter',
    'Ñd': 'venus', 'N²': 'saturn', 'WôÏ': 'rahu', 'úLÕ': 'ketu', '1-Xd': 'lagna', 'Uôk': 'mandi'
}

def get_col(x, is_right):
    if not is_right:
        if x < 145: return 0
        if x < 215: return 1
        if x < 285: return 2
        return 3
    else:
        if x < 470: return 0
        if x < 540: return 1
        if x < 610: return 2
        return 3

def get_row(y):
    if y < 135: return 0
    if y < 235: return 1
    if y < 285: return 2
    return 3

# South Indian cell to sign:
# Row 0: 11, 0, 1, 2
# Row 1: 10, -, -, 3
# Row 2: 9, -, -, 4
# Row 3: 8, 7, 6, 5
def cell_to_sign(r, c):
    if r == 0:
        return [11, 0, 1, 2][c]
    elif r == 1:
        return 10 if c == 0 else 3
    elif r == 2:
        return 9 if c == 0 else 4
    elif r == 3:
        return [8, 7, 6, 5][c]

pages = [
    (7, 'Page 8 (D3 Left, D7 Right)'),
    (8, 'Page 9 (D60 Left, D30 Right)'),
    (9, 'Page 10 (D10 Left, D16 Right)'),
    (10, 'Page 11 (D4 Left, D12 Right)')
]

for p_idx, p_name in pages:
    page = reader.pages[p_idx]
    print(f'\n=================== {p_name} ===================')
    left_planets = {}
    right_planets = {}

    def visitor(text, cm, tm, fontDict, fontSize):
        t = text.strip()
        x, y = tm[4], tm[5]
        # Ignore description texts at y > 370
        if y > 370: return
        for g, name in glyphs.items():
            if g in t:
                is_right = (x > 380)
                c = get_col(x, is_right)
                r = get_row(y)
                sign = cell_to_sign(r, c)
                target = right_planets if is_right else left_planets
                target.setdefault(name, []).append((sign, x, y))

    page.extract_text(visitor_text=visitor)
    print('LEFT CHART:')
    for k in ['lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi']:
        print(f'  {k:8}: sign {left_planets.get(k)}')
    print('RIGHT CHART:')
    for k in ['lagna', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu', 'mandi']:
        print(f'  {k:8}: sign {right_planets.get(k)}')
