import sys

code = """
// Authentic Savana and Calendar Date Helpers
function addSavanaYearsMonthsDays(baseDateStr, y, m, d) {
  const parts = baseDateStr.split('-');
  let dNum, mNum, yNum;
  if (parts[0].length === 4) {
    yNum = parseInt(parts[0], 10);
    mNum = parseInt(parts[1], 10);
    dNum = parseInt(parts[2], 10);
  } else {
    dNum = parseInt(parts[0], 10);
    mNum = parseInt(parts[1], 10);
    yNum = parseInt(parts[2], 10);
  }

  dNum += d;
  while (dNum > 30) {
    dNum -= 30;
    mNum += 1;
  }
  mNum += m;
  while (mNum > 12) {
    mNum -= 12;
    yNum += 1;
  }
  yNum += y;

  return `${String(dNum).padStart(2, '0')}-${String(mNum).padStart(2, '0')}-${yNum}`;
}
"""
print("Helper ready")
