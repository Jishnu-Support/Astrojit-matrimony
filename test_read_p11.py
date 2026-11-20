import pypdf

reader = pypdf.PdfReader(r'C:\Users\HP\.gemini\antigravity\brain\4900a36f-37a2-45c5-917a-9a9382269cdd\.user_uploaded\media_1794995445987_9523962a.pdf')
page = reader.pages[10]

glyphs = {
    'ã¬': 'Sun', 'Nk': 'Moon', 'ùNq': 'Mars', '×R': 'Mercury', 'ÏÚ': 'Jupiter',
    'Ñd': 'Venus', 'N²': 'Saturn', 'WôÏ': 'Rahu', 'úLÕ': 'Ketu', '1-Xd': 'Lagna', 'Uôk': 'Mandi'
}

def visitor(text, cm, tm, fontDict, fontSize):
    t = text.strip()
    for g, name in glyphs.items():
        if g in t:
            print(f'{g:6} ({name:8}) in "{t}" at x={tm[4]:6.1f}, y={tm[5]:6.1f}')

page.extract_text(visitor_text=visitor)
