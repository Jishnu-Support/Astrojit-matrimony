import math

def get_ascendant(jd_ut, lat_deg, lon_deg, ayanamsa_deg):
    T = (jd_ut - 2451545.0) / 36525.0
    gmst = 280.46061837 + 360.98564736629 * (jd_ut - 2451545.0) + 0.000387933 * T * T
    gmst = gmst % 360
    lst = (gmst + lon_deg) % 360
    ramc = lst * math.pi / 180
    eps = (23.4392911 - 0.0130042 * T) * math.pi / 180
    phi = lat_deg * math.pi / 180
    
    y = math.cos(ramc)
    x = -math.sin(ramc) * math.cos(eps) - math.tan(phi) * math.sin(eps)
    sayana_asc = (math.atan2(y, x) * 180 / math.pi) % 360
    nirayana_asc = (sayana_asc - ayanamsa_deg) % 360
    return nirayana_asc

asc = get_ascendant(2461343.82, 12.95, 77.56, 24.234)
deg = int(asc)
m = int((asc - deg) * 60)
s = int(((asc - deg) * 60 - m) * 60)
print(f"Calculated Ascendant at Mandi time: {deg} deg {m} min {s} sec (Total: {asc:.4f})")
