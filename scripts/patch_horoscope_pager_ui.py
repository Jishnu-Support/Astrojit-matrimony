import re

# 1. Patch HoroscopePagerView.jsx
with open('frontend/src/components/HoroscopePagerView.jsx', 'r', encoding='utf-8') as f:
    hpv = f.read()

# Add labels to L
l_target = """    nakshatraSyllables: isTa ? 'நக்ஷத்திர எழுத்துக்கள்' : 'Nakshatra Letters',"""
l_repl = """    nakshatraSyllables: isTa ? 'நக்ஷத்திர எழுத்துக்கள்' : 'Nakshatra Letters',
    age: isTa ? 'வயது' : 'Age',
    subhar: isTa ? 'சுபர்கள்' : 'Benefics (Subhar)',
    asubhar: isTa ? 'அசுபர்கள்' : 'Malefics (Asubhar)',
    lagnagathipathi: isTa ? 'லக்னாதிபதி' : 'Lagna Lord',
    bhagayathipathi: isTa ? 'பாக்யாதிபதி' : 'Bhagya Lord (9th)',
    bhathagathipathi: isTa ? 'பாதகாதிபதி' : 'Badhaka Lord',"""

assert l_target in hpv, "l_target not found in HoroscopePagerView.jsx"
hpv = hpv.replace(l_target, l_repl)

# Add footer labels to L
l_foot_target = """    bhavaTransitions: isTa ? 'பாவக மாறுதல்:' : 'Bhava Transitions:',"""
l_foot_repl = """    bhavaTransitions: isTa ? 'பாவக மாறுதல்:' : 'Bhava Transitions:',
    bhodhagar: isTa ? 'போதகர்:' : 'Bhodhagar:',
    vedhagar: isTa ? 'வேதகர்:' : 'Vedhagar:',
    pasagar: isTa ? 'பாசகர்:' : 'Pasagar:',
    karagar: isTa ? 'காரகர்:' : 'Karagar:',"""

assert l_foot_target in hpv, "l_foot_target not found in HoroscopePagerView.jsx"
hpv = hpv.replace(l_foot_target, l_foot_repl)

# Add Form Inputs in Tab 1 (Person Editor)
tab1_target = """                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.nakshatraSyllables}</label>
                    <input
                      type="text"
                      value={data.person.nakshatraSyllables}
                      onChange={e => updateField('person', 'nakshatraSyllables', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>"""

tab1_repl = """                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.nakshatraSyllables}</label>
                    <input
                      type="text"
                      value={data.person.nakshatraSyllables || ''}
                      onChange={e => updateField('person', 'nakshatraSyllables', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.age}</label>
                    <input
                      type="text"
                      value={data.person.age || ''}
                      onChange={e => updateField('person', 'age', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.subhar}</label>
                    <input
                      type="text"
                      value={data.person.subhar || ''}
                      onChange={e => updateField('person', 'subhar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.asubhar}</label>
                    <input
                      type="text"
                      value={data.person.asubhar || ''}
                      onChange={e => updateField('person', 'asubhar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.lagnagathipathi}</label>
                    <input
                      type="text"
                      value={data.person.lagnagathipathi || ''}
                      onChange={e => updateField('person', 'lagnagathipathi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.bhagayathipathi}</label>
                    <input
                      type="text"
                      value={data.person.bhagayathipathi || ''}
                      onChange={e => updateField('person', 'bhagayathipathi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.bhathagathipathi}</label>
                    <input
                      type="text"
                      value={data.person.bhathagathipathi || ''}
                      onChange={e => updateField('person', 'bhathagathipathi', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>"""

assert tab1_target in hpv, "tab1_target not found in HoroscopePagerView.jsx"
hpv = hpv.replace(tab1_target, tab1_repl)

# Add Form Inputs in Tab 4 (Footer Editor)
tab4_target = """                <div>
                  <label className="block font-bold mb-1 opacity-80">{L.bhavaTransitions}</label>
                  <input
                    type="text"
                    value={data.footer.bhavaTransitions}
                    onChange={e => updateField('footer', 'bhavaTransitions', e.target.value)}
                    placeholder="e.g. லக்ன பாவக ஆரம்பம்: ரிஷபம் 22° 15′ | முடிவு: மிதுனம் 22° 15′"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>"""

tab4_repl = """                <div>
                  <label className="block font-bold mb-1 opacity-80">{L.bhavaTransitions}</label>
                  <input
                    type="text"
                    value={data.footer.bhavaTransitions || ''}
                    onChange={e => updateField('footer', 'bhavaTransitions', e.target.value)}
                    placeholder="e.g. லக்ன பாவக ஆரம்பம்: ரிஷபம் 22° 15′ | முடிவு: மிதுனம் 22° 15′"
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.bhodhagar}</label>
                    <input
                      type="text"
                      value={data.footer.bhodhagar || ''}
                      onChange={e => updateField('footer', 'bhodhagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.vedhagar}</label>
                    <input
                      type="text"
                      value={data.footer.vedhagar || ''}
                      onChange={e => updateField('footer', 'vedhagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.pasagar}</label>
                    <input
                      type="text"
                      value={data.footer.pasagar || ''}
                      onChange={e => updateField('footer', 'pasagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 opacity-80">{L.karagar}</label>
                    <input
                      type="text"
                      value={data.footer.karagar || ''}
                      onChange={e => updateField('footer', 'karagar', e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>"""

assert tab4_target in hpv, "tab4_target not found in HoroscopePagerView.jsx"
hpv = hpv.replace(tab4_target, tab4_repl)

# Add to Sheet: Person Details (Right Column) below nakshatraSyllables
sheet_person_target = """                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.nakshatraSyllables}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nakshatraSyllables || <span className="opacity-0">&nbsp;</span>}</span></div>"""

sheet_person_repl = """                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.nakshatraSyllables}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.nakshatraSyllables || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.age}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.age || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.subhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.subhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.asubhar}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.asubhar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.lagnagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.lagnagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.bhagayathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhagayathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex"><span className="w-36 font-bold shrink-0">{L.bhathagathipathi}</span><span className="mr-1">:</span><span className="font-semibold truncate">{data.person.bhathagathipathi || <span className="opacity-0">&nbsp;</span>}</span></div>"""

assert sheet_person_target in hpv, "sheet_person_target not found in HoroscopePagerView.jsx"
hpv = hpv.replace(sheet_person_target, sheet_person_repl)

# Add to Sheet: Footer below bhavaTransitions
sheet_footer_target = """                <div className="flex">
                  <span className="font-bold shrink-0 mr-1.5">{L.bhavaTransitions}</span>
                  <span className="font-semibold truncate">{data.footer.bhavaTransitions || <span className="opacity-0">&nbsp;</span>}</span>
                </div>"""

sheet_footer_repl = """                <div className="flex">
                  <span className="font-bold shrink-0 mr-1.5">{L.bhavaTransitions}</span>
                  <span className="font-semibold truncate">{data.footer.bhavaTransitions || <span className="opacity-0">&nbsp;</span>}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 text-[8.5px] sm:text-[9px]">
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.bhodhagar}</span><span className="font-semibold truncate">{data.footer.bhodhagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.vedhagar}</span><span className="font-semibold truncate">{data.footer.vedhagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.pasagar}</span><span className="font-semibold truncate">{data.footer.pasagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                  <div className="flex truncate"><span className="font-bold mr-1 shrink-0">{L.karagar}</span><span className="font-semibold truncate">{data.footer.karagar || <span className="opacity-0">&nbsp;</span>}</span></div>
                </div>"""

assert sheet_footer_target in hpv, "sheet_footer_target not found in HoroscopePagerView.jsx"
hpv = hpv.replace(sheet_footer_target, sheet_footer_repl)

with open('frontend/src/components/HoroscopePagerView.jsx', 'w', encoding='utf-8') as f:
    f.write(hpv)

print('Successfully patched HoroscopePagerView.jsx!')
