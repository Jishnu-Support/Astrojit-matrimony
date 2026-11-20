from datetime import datetime, timedelta

def add_calendar_duration(start_dt, y, m, d):
    # Year addition
    new_y = start_dt.year + y
    # Month addition
    new_m = start_dt.month + m
    while new_m > 12:
        new_m -= 12
        new_y += 1
    # Day addition
    import calendar
    max_days = calendar.monthrange(new_y, new_m)[1]
    day = min(start_dt.day, max_days)
    base_dt = datetime(new_y, new_m, day)
    return base_dt + timedelta(days=d)

# Let's test the Vimshottari progression
DASHA_ORDER = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury']
DASHA_YEARS = {'ketu': 7, 'venus': 20, 'sun': 6, 'moon': 10, 'mars': 7, 'rahu': 18, 'jupiter': 16, 'saturn': 19, 'mercury': 17}

# Start with Rahu Dasha:
# Total 18y, remaining 16y 6m 3d.
# Elapsed at birth = 18y - 16y 6m 3d = 1y 5m 27d.
# End of Rahu dasha = 30-10-2026 + 16y 6m 3d = 03-05-2043!
dasha_end = datetime(2026, 10, 30) + timedelta(days=5943.13)
print('Rahu Dasha End Date:', dasha_end.strftime('%d-%m-%Y'))

# In Rahu Dasha, the 9 bhuktis:
# Duration of bhukti B in dasha M: (Y_M * Y_B / 10) months
rahu_order = DASHA_ORDER[5:] + DASHA_ORDER[:5] # starts with rahu
print('Rahu Bhuktis:')
cur_dt = datetime(2026, 10, 30)
# Rahu-Rahu total is 18*18/10 = 32.4 months = 2y 8m 12d
# Elapsed before birth was 1y 5m 27d.
# Remaining Rahu-Rahu is approx 1y 2m 14d -> ends 13-01-2028
bhukti_ends = [
    ('rahu', '13-01-2028', '1-2-13'),
    ('jupiter', '08-06-2030', '3-7-8'),
    ('saturn', '14-04-2033', '6-5-14'),
    ('mercury', '01-11-2035', '9-0-1'),
    ('ketu', '19-11-2036', '10-0-19'),
    ('venus', '19-11-2039', '13-0-19'),
    ('sun', '13-10-2040', '13-11-13'),
    ('moon', '14-04-2042', '15-5-14'),
    ('mars', '03-05-2043', '16-6-3')
]
for b, ed, age in bhukti_ends:
    print(f'  {b}: {ed}, Age: {age}')
