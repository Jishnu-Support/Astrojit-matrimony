with open('frontend/src/utils/thirukanithaEngine.js', 'r', encoding='utf-8') as f:
    engine = f.read()

# 1. Patch Mr. M branch inside calculateThirukanithaHoroscope
mr_m_old_bhukti_return = """        return {
          mdLord,
          bhuktiLord: bLord,
          duration: {
            years: bh.y,
            months: bh.m,
            days: bh.d,
            textTa: durationTextTa,
            textEn: durationTextEn
          },
          startDate: bh.startDate,
          endDate: bh.endDate,
          isPastAtBirth,
          isOngoingAtBirth,
          isFutureAtBirth,
          isOngoingToday,
          isPastToday,
          isOngoing: isOngoingAtBirth
        };"""

mr_m_new_bhukti_return = """        const bEndDateObjNative = new Date(bEndObj.year, bEndObj.month - 1, bEndObj.day);
        const birthDateNative = new Date(birthDateObjCl.year, birthDateObjCl.month - 1, birthDateObjCl.day);
        const ageAtEnd = computeAgeAtDate(birthDateNative, bEndDateObjNative);
        const antaras = computeAntarasForBhukti(bLord.id, bh.startDate, bh.endDate, now);

        return {
          mdLord,
          bhuktiLord: bLord,
          duration: {
            years: bh.y,
            months: bh.m,
            days: bh.d,
            textTa: durationTextTa,
            textEn: durationTextEn
          },
          startDate: bh.startDate,
          endDate: bh.endDate,
          ageAtEnd,
          antaras,
          isPastAtBirth,
          isOngoingAtBirth,
          isFutureAtBirth,
          isOngoingToday,
          isPastToday,
          isOngoing: isOngoingAtBirth
        };"""

if mr_m_old_bhukti_return in engine:
    engine = engine.replace(mr_m_old_bhukti_return, mr_m_new_bhukti_return)

# 2. Patch Mr. M dashaTable.push
mr_m_old_md_push = """      dashaTable.push({
        lord: mdLord,
        isBirthDasha,
        balanceAtBirth: isBirthDasha ? {
          years: balY,
          months: balM,
          days: balD,
          textTa: `${balY}ஆ ${balM}மா ${balD}நா`,
          textEn: `${balY}y ${balM}m ${balD}d`
        } : null,
        startDate: mdData.startDate,
        theoreticalStartDate: mdData.theoreticalStartDate,
        endDate: mdData.endDate,
        isOngoingToday: isMdOngoingToday,
        isPastToday: isMdPastToday,
        bhuktis
      });"""

mr_m_new_md_push = """      const mdEndDateObjNative = new Date(mdEndObj.year, mdEndObj.month - 1, mdEndObj.day);
      const birthDateNative = new Date(birthDateObjCl.year, birthDateObjCl.month - 1, birthDateObjCl.day);
      const ageAtEnd = computeAgeAtDate(birthDateNative, mdEndDateObjNative);

      dashaTable.push({
        lord: mdLord,
        isBirthDasha,
        balanceAtBirth: isBirthDasha ? {
          years: balY,
          months: balM,
          days: balD,
          textTa: `${balY}ஆ ${balM}மா ${balD}நா`,
          textEn: `${balY}y ${balM}m ${balD}d`
        } : null,
        startDate: mdData.startDate,
        theoreticalStartDate: mdData.theoreticalStartDate,
        endDate: mdData.endDate,
        ageAtEnd,
        isOngoingToday: isMdOngoingToday,
        isPastToday: isMdPastToday,
        bhuktis
      });"""

if mr_m_old_md_push in engine:
    engine = engine.replace(mr_m_old_md_push, mr_m_new_md_push)

# 3. Patch Dynamic branch bhukti push
dyn_old_bhukti_push = """        bhuktis.push({
          mdLord,
          bhuktiLord: bLord,
          duration: {
            years: bYears,
            months: bMonths,
            days: bDays,
            textTa: durationTextTa,
            textEn: durationTextEn
          },
          startDate: formatCalendarDate(curBhuktiStart),
          endDate: formatCalendarDate(curBhuktiEnd),
          isPastAtBirth,
          isOngoingAtBirth,
          isFutureAtBirth,
          isOngoingToday,
          isPastToday,
          isOngoing: isOngoingAtBirth
        });"""

dyn_new_bhukti_push = """        const bStartStr = formatCalendarDate(curBhuktiStart);
        const bEndStr = formatCalendarDate(curBhuktiEnd);
        const bEndDateObjNative = new Date(curBhuktiEnd.year, curBhuktiEnd.month - 1, curBhuktiEnd.day);
        const birthDateNative = new Date(birthDateObjCl.year, birthDateObjCl.month - 1, birthDateObjCl.day);
        const ageAtEnd = computeAgeAtDate(birthDateNative, bEndDateObjNative);
        const antaras = computeAntarasForBhukti(bLord.id, bStartStr, bEndStr, now);

        bhuktis.push({
          mdLord,
          bhuktiLord: bLord,
          duration: {
            years: bYears,
            months: bMonths,
            days: bDays,
            textTa: durationTextTa,
            textEn: durationTextEn
          },
          startDate: bStartStr,
          endDate: bEndStr,
          ageAtEnd,
          antaras,
          isPastAtBirth,
          isOngoingAtBirth,
          isFutureAtBirth,
          isOngoingToday,
          isPastToday,
          isOngoing: isOngoingAtBirth
        });"""

if dyn_old_bhukti_push in engine:
    engine = engine.replace(dyn_old_bhukti_push, dyn_new_bhukti_push)

# 4. Patch Dynamic branch dashaTable.push
dyn_old_md_push = """      dashaTable.push({
        lord: mdLord,
        isBirthDasha,
        balanceAtBirth: isBirthDasha ? {
          years: balY,
          months: balM,
          days: balD,
          textTa: `${balY}ஆ ${balM}மா ${balD}நா`,
          textEn: `${balY}y ${balM}m ${balD}d`
        } : null,
        startDate: formatCalendarDate(mdDisplayStartDateObj),
        theoreticalStartDate: formatCalendarDate(mdStartDateObj),
        endDate: formatCalendarDate(mdEndDateObj),
        isOngoingToday: isMdOngoingToday,
        isPastToday: isMdPastToday,
        bhuktis
      });"""

dyn_new_md_push = """      const mdEndDateObjNative = new Date(mdEndDateObj.year, mdEndDateObj.month - 1, mdEndDateObj.day);
      const birthDateNative = new Date(birthDateObjCl.year, birthDateObjCl.month - 1, birthDateObjCl.day);
      const ageAtEnd = computeAgeAtDate(birthDateNative, mdEndDateObjNative);

      dashaTable.push({
        lord: mdLord,
        isBirthDasha,
        balanceAtBirth: isBirthDasha ? {
          years: balY,
          months: balM,
          days: balD,
          textTa: `${balY}ஆ ${balM}மா ${balD}நா`,
          textEn: `${balY}y ${balM}m ${balD}d`
        } : null,
        startDate: formatCalendarDate(mdDisplayStartDateObj),
        theoreticalStartDate: formatCalendarDate(mdStartDateObj),
        endDate: formatCalendarDate(mdEndDateObj),
        ageAtEnd,
        isOngoingToday: isMdOngoingToday,
        isPastToday: isMdPastToday,
        bhuktis
      });"""

if dyn_old_md_push in engine:
    engine = engine.replace(dyn_old_md_push, dyn_new_md_push)

# 5. Patch currentDashaToday in summary
old_current_dasha = """      currentDashaToday: (() => {
        const curMd = dashaTable.find(d => d.isOngoingToday);
        if (!curMd) return null;
        const curBh = curMd.bhuktis.find(b => b.isOngoingToday);
        return {
          mahadasha: curMd.lord,
          bhukti: curBh ? curBh.bhuktiLord : null,
          startDate: curBh ? curBh.startDate : curMd.startDate,
          endDate: curBh ? curBh.endDate : curMd.endDate,
          textTa: `${curMd.lord.nameTa} திசை${curBh ? ' - ' + curBh.bhuktiLord.nameTa + ' புக்தி' : ''}`,
          textEn: `${curMd.lord.nameEn} Dasha${curBh ? ' - ' + curBh.bhuktiLord.nameEn + ' Bhukti' : ''}`
        };
      })()"""

new_current_dasha = """      currentDashaToday: (() => {
        const curMd = dashaTable.find(d => d.isOngoingToday);
        if (!curMd) return null;
        const curBh = curMd.bhuktis.find(b => b.isOngoingToday);
        const curAntara = curBh?.antaras?.find(a => a.isOngoingToday);

        let progressPct = 0;
        let daysRemaining = 0;
        if (curBh) {
          const parseDMY = (s) => {
            const p = s.split('-').map(Number);
            return new Date(p[2], p[1] - 1, p[0]);
          };
          const bStart = parseDMY(curBh.startDate);
          const bEnd = parseDMY(curBh.endDate);
          const totalMs = Math.max(1, bEnd.getTime() - bStart.getTime());
          const elapsedMs = Math.max(0, Math.min(totalMs, now.getTime() - bStart.getTime()));
          progressPct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
          daysRemaining = Math.max(0, Math.ceil((bEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        }

        return {
          mahadasha: curMd.lord,
          bhukti: curBh ? curBh.bhuktiLord : null,
          antara: curAntara ? curAntara.lord : null,
          startDate: curBh ? curBh.startDate : curMd.startDate,
          endDate: curBh ? curBh.endDate : curMd.endDate,
          antaraStartDate: curAntara?.startDate || '',
          antaraEndDate: curAntara?.endDate || '',
          progressPct,
          daysRemaining,
          textTa: `${curMd.lord.nameTa} திசை${curBh ? ' - ' + curBh.bhuktiLord.nameTa + ' புக்தி' : ''}${curAntara ? ' - ' + curAntara.lord.nameTa + ' அந்தரம்' : ''}`,
          textEn: `${curMd.lord.nameEn} Dasha${curBh ? ' - ' + curBh.bhuktiLord.nameEn + ' Bhukti' : ''}${curAntara ? ' - ' + curAntara.lord.nameEn + ' Antara' : ''}`
        };
      })()"""

assert old_current_dasha in engine, "old_current_dasha not found"
engine = engine.replace(old_current_dasha, new_current_dasha)

with open('frontend/src/utils/thirukanithaEngine.js', 'w', encoding='utf-8') as f:
    f.write(engine)
print("thirukanithaEngine.js successfully updated with Antaras, Age, and Live Progress!")
