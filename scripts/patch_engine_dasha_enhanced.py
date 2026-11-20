import re

with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    engine = f.read()

# Helper function to compute Antaras and Age
antaras_helper = """
// Classical Vimshottari Pratyantardasha (Level 3 Antara) & Age at Date calculation
function computeAntarasForBhukti(bLordId, startDateStr, endDateStr, todayDateObj) {
  const bIdx = DASHA_LORDS.findIndex(l => l.id === bLordId);
  if (bIdx === -1) return [];

  const parseToDate = (dStr) => {
    if (!dStr) return new Date();
    const parts = dStr.trim().split(/[-/.]/).map(Number);
    if (parts[0] > 1000) return new Date(parts[0], parts[1] - 1, parts[2]);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  const start = parseToDate(startDateStr);
  const end = parseToDate(endDateStr);
  const totalMs = Math.max(1, end.getTime() - start.getTime());

  let curStart = new Date(start);
  const antaras = [];

  for (let i = 0; i < 9; i++) {
    const aLord = DASHA_LORDS[(bIdx + i) % 9];
    const fraction = aLord.years / 120;
    const aMs = Math.round(totalMs * fraction);
    let curEnd = (i === 8) ? new Date(end) : new Date(curStart.getTime() + aMs);

    const isOngoingToday = todayDateObj >= curStart && todayDateObj < curEnd;
    const isPastToday = todayDateObj >= curEnd;
    const isUpcomingToday = todayDateObj < curStart;

    const diffDays = Math.max(1, Math.round((curEnd.getTime() - curStart.getTime()) / (1000 * 60 * 60 * 24)));

    const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

    antaras.push({
      lord: aLord,
      startDate: fmt(curStart),
      endDate: fmt(curEnd),
      durationDays: diffDays,
      isOngoingToday,
      isPastToday,
      isUpcomingToday
    });

    curStart = curEnd;
  }
  return antaras;
}

function computeAgeAtDate(birthDateObj, targetDateObj) {
  if (!birthDateObj || !targetDateObj) return { textTa: '', textEn: '', years: 0 };
  let y = targetDateObj.getFullYear() - birthDateObj.getFullYear();
  let m = targetDateObj.getMonth() - birthDateObj.getMonth();
  let d = targetDateObj.getDate() - birthDateObj.getDate();
  if (d < 0) {
    m--;
    d += 30;
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  if (y < 0) y = 0;
  if (m < 0) m = 0;
  return {
    years: y,
    months: m,
    days: d,
    textTa: m > 0 ? `${y}ஆ ${m}மா` : `${y} வயது`,
    textEn: m > 0 ? `${y}y ${m}m` : `${y} yrs`
  };
}
"""

if "function computeAntarasForBhukti" not in engine:
    engine = engine.replace("const DASHA_LORDS = [", antaras_helper + "\nconst DASHA_LORDS = [")

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(engine)
print("thirukanithaEngine.js helper added!")
