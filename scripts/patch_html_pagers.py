def patch_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. HTML person details
    p_target = '<div class="detail-row"><span class="detail-label" id="lbl-nakshatraSyllables">நக்ஷத்திர எழுத்துக்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-nakshatraSyllables"></span></div>'
    p_repl = '''<div class="detail-row"><span class="detail-label" id="lbl-nakshatraSyllables">நக்ஷத்திர எழுத்துக்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-nakshatraSyllables"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-age">வயது</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-age"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-subhar">சுபர்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-subhar"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-asubhar">அசுபர்கள்</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-asubhar"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-lagnagathipathi">லக்னாதிபதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-lagnagathipathi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-bhagayathipathi">பாக்யாதிபதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-bhagayathipathi"></span></div>
            <div class="detail-row"><span class="detail-label" id="lbl-bhathagathipathi">பாதகாதிபதி</span><span class="detail-colon">:</span><span class="detail-value" id="ui-p-bhathagathipathi"></span></div>'''

    if p_target in html:
        html = html.replace(p_target, p_repl)

    # 2. HTML footer lines
    f_target = '<div class="footer-row"><span class="footer-lbl" id="lbl-bhavaTransitions">பாவக மாறுதல்:</span><span class="footer-val" id="ui-f-bhavaTransitions"></span></div>'
    f_repl = '''<div class="footer-row"><span class="footer-lbl" id="lbl-bhavaTransitions">பாவக மாறுதல்:</span><span class="footer-val" id="ui-f-bhavaTransitions"></span></div>
          <div class="footer-row" style="display: flex; gap: 12px; flex-wrap: wrap;">
            <span><span class="footer-lbl" id="lbl-bhodhagar">போதகர்:</span> <span class="footer-val" id="ui-f-bhodhagar"></span></span>
            <span><span class="footer-lbl" id="lbl-vedhagar">வேதகர்:</span> <span class="footer-val" id="ui-f-vedhagar"></span></span>
            <span><span class="footer-lbl" id="lbl-pasagar">பாசகர்:</span> <span class="footer-val" id="ui-f-pasagar"></span></span>
            <span><span class="footer-lbl" id="lbl-karagar">காரகர்:</span> <span class="footer-val" id="ui-f-karagar"></span></span>
          </div>'''

    if f_target in html:
        html = html.replace(f_target, f_repl)

    # 3. PAGER_DATA person
    pdata_target = "nakshatraSyllables: ''"
    pdata_repl = "nakshatraSyllables: '', age: '', subhar: '', asubhar: '', lagnagathipathi: '', bhagayathipathi: '', bhathagathipathi: ''"
    if pdata_target in html:
        html = html.replace(pdata_target, pdata_repl, 1)

    # 4. PAGER_DATA footer
    fdata_target = "bhavaTransitions: '',"
    fdata_repl = "bhavaTransitions: '', bhodhagar: '', vedhagar: '', pasagar: '', karagar: '',"
    if fdata_target in html:
        html = html.replace(fdata_target, fdata_repl, 1)

    # 5. LANGUAGES ta
    ta_target = "nakshatraSyllables: 'நக்ஷத்திர எழுத்துக்கள்',"
    ta_repl = "nakshatraSyllables: 'நக்ஷத்திர எழுத்துக்கள்', age: 'வயது', subhar: 'சுபர்கள்', asubhar: 'அசுபர்கள்', lagnagathipathi: 'லக்னாதிபதி', bhagayathipathi: 'பாக்யாதிபதி', bhathagathipathi: 'பாதகாதிபதி',"
    if ta_target in html:
        html = html.replace(ta_target, ta_repl)

    ta_foot_target = "bhavaTransitions: 'பாவக மாறுதல்:',"
    ta_foot_repl = "bhavaTransitions: 'பாவக மாறுதல்:', bhodhagar: 'போதகர்:', vedhagar: 'வேதகர்:', pasagar: 'பாசகர்:', karagar: 'காரகர்:',"
    if ta_foot_target in html:
        html = html.replace(ta_foot_target, ta_foot_repl)

    # 6. LANGUAGES en
    en_target = "nakshatraSyllables: 'Nakshatra Letters',"
    en_repl = "nakshatraSyllables: 'Nakshatra Letters', age: 'Age', subhar: 'Benefics (Subhar)', asubhar: 'Malefics (Asubhar)', lagnagathipathi: 'Lagna Lord', bhagayathipathi: 'Bhagya Lord (9th)', bhathagathipathi: 'Badhaka Lord',"
    if en_target in html:
        html = html.replace(en_target, en_repl)

    en_foot_target = "bhavaTransitions: 'Bhava Transitions:',"
    en_foot_repl = "bhavaTransitions: 'Bhava Transitions:', bhodhagar: 'Bhodhagar:', vedhagar: 'Vedhagar:', pasagar: 'Pasagar:', karagar: 'Karagar:',"
    if en_foot_target in html:
        html = html.replace(en_foot_target, en_foot_repl)

    # 7. labelIds
    lbl_target = "'nakshatraSyllables',"
    lbl_repl = "'nakshatraSyllables', 'age', 'subhar', 'asubhar', 'lagnagathipathi', 'bhagayathipathi', 'bhathagathipathi',"
    if lbl_target in html:
        html = html.replace(lbl_target, lbl_repl)

    lbl_foot_target = "'bhavaTransitions',"
    lbl_foot_repl = "'bhavaTransitions', 'bhodhagar', 'vedhagar', 'pasagar', 'karagar',"
    if lbl_foot_target in html:
        html = html.replace(lbl_foot_target, lbl_foot_repl)

    # 8. applyData
    apply_p_target = "document.getElementById('ui-p-nakshatraSyllables').textContent = p.nakshatraSyllables;"
    apply_p_repl = '''document.getElementById('ui-p-nakshatraSyllables').textContent = p.nakshatraSyllables || '';
      if (document.getElementById('ui-p-age')) document.getElementById('ui-p-age').textContent = p.age || '';
      if (document.getElementById('ui-p-subhar')) document.getElementById('ui-p-subhar').textContent = p.subhar || '';
      if (document.getElementById('ui-p-asubhar')) document.getElementById('ui-p-asubhar').textContent = p.asubhar || '';
      if (document.getElementById('ui-p-lagnagathipathi')) document.getElementById('ui-p-lagnagathipathi').textContent = p.lagnagathipathi || '';
      if (document.getElementById('ui-p-bhagayathipathi')) document.getElementById('ui-p-bhagayathipathi').textContent = p.bhagayathipathi || '';
      if (document.getElementById('ui-p-bhathagathipathi')) document.getElementById('ui-p-bhathagathipathi').textContent = p.bhathagathipathi || '';'''
    if apply_p_target in html:
        html = html.replace(apply_p_target, apply_p_repl)

    apply_f_target = "document.getElementById('ui-f-bhavaTransitions').textContent = f.bhavaTransitions;"
    apply_f_repl = '''document.getElementById('ui-f-bhavaTransitions').textContent = f.bhavaTransitions || '';
      if (document.getElementById('ui-f-bhodhagar')) document.getElementById('ui-f-bhodhagar').textContent = f.bhodhagar || '';
      if (document.getElementById('ui-f-vedhagar')) document.getElementById('ui-f-vedhagar').textContent = f.vedhagar || '';
      if (document.getElementById('ui-f-pasagar')) document.getElementById('ui-f-pasagar').textContent = f.pasagar || '';
      if (document.getElementById('ui-f-karagar')) document.getElementById('ui-f-karagar').textContent = f.karagar || '';'''
    if apply_f_target in html:
        html = html.replace(apply_f_target, apply_f_repl)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Successfully patched {file_path}!')

patch_html_file('horoscope_pager.html')
patch_html_file('frontend/public/horoscope_pager.html')
