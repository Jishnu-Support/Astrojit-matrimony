import pypdf

reader = pypdf.PdfReader(r'C:\Users\HP\.gemini\antigravity\brain\4900a36f-37a2-45c5-917a-9a9382269cdd\.user_uploaded\media_1794995445987_9523962a.pdf')

glyphs = {
    'ã¬': 'Sun', 'Nk': 'Moon', 'ùNq': 'Mars', '×R': 'Mercury', 'ÏÚ': 'Jupiter',
    'Ñd': 'Venus', 'N²': 'Saturn', 'WôÏ': 'Rahu', 'úLÕ': 'Ketu', '1-Xd': 'Lagna', 'Uôk': 'Mandi'
}

for page_idx in range(7, 12):
    page = reader.pages[page_idx]
    print(f'=== PAGE {page_idx+1} ===')
    items = []
    def visitor(text, cm, tm, fontDict, fontSize):
        t = text.strip()
        for g, name in glyphs.items():
            if g == t:
                items.append((name, tm[4], tm[5]))
        if 'NdLWm' in t or 'NômNm' in t or 'úLÕ' in t or 'è¬' in t:
            items.append((t, tm[4], tm[5]))
    page.extract_text(visitor_text=visitor)
    for it in sorted(items, key=lambda x: (x[1], x[2])):
        print(f'  {it[0]:15} at x={it[1]:6.1f}, y={it[2]:6.1f}')
