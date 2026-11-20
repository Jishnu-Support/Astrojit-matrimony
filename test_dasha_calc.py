from datetime import datetime, timedelta

def compute_all_dashas(dob_str, moon_long, lagna_long, planet_signs):
    # Vimshottari order & spans
    DASHA_ORDER = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury']
    DASHA_YEARS = {'ketu': 7, 'venus': 20, 'sun': 6, 'moon': 10, 'mars': 7, 'rahu': 18, 'jupiter': 16, 'saturn': 19, 'mercury': 17}
    DASHA_NAMES_TA = {'ketu': 'கேது', 'venus': 'சுக்கிரன்', 'sun': 'சூரியன்', 'moon': 'சந்திரன்', 'mars': 'செவ்வாய்', 'rahu': 'ராகு', 'jupiter': 'குரு', 'saturn': 'சனி', 'mercury': 'புதன்'}
    
    star_idx = int(moon_long / (40/3))
    star_rem_deg = (40/3) - (moon_long % (40/3))
    frac_rem = star_rem_deg / (40/3)
    
    birth_lord = DASHA_ORDER[star_idx % 9]
    start_lord_idx = DASHA_ORDER.index(birth_lord)
    
    # Birth dasha remaining
    total_y = DASHA_YEARS[birth_lord]
    rem_y_float = total_y * frac_rem
    rem_y = int(rem_y_float)
    rem_m_float = (rem_y_float - rem_y) * 12
    rem_m = int(rem_m_float)
    rem_d = int(round((rem_m_float - rem_m) * 30))
    if rem_d >= 30:
        rem_d -= 30
        rem_m += 1
    if rem_m >= 12:
        rem_m -= 12
        rem_y += 1
        
    print(f'Birth Dasha: {birth_lord}, Remaining: {rem_y}y {rem_m}m {rem_d}d')

compute_all_dashas('2026-10-30', 67.771389, 256.6175, {})
