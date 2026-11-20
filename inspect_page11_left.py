import pypdf

reader = pypdf.PdfReader(r'C:\Users\HP\.gemini\antigravity\brain\4900a36f-37a2-45c5-917a-9a9382269cdd\.user_uploaded\media_1794995445987_9523962a.pdf')
page = reader.pages[10]

# Inspect all text in left chart with exact text and y
page.extract_text(visitor_text=lambda t, cm, tm, f, s: print(f'{t.strip():15} x={tm[4]:.1f} y={tm[5]:.1f}') if tm[4] < 380 and tm[5] < 370 and t.strip() else None)
