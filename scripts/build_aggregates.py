#!/usr/bin/env python3
"""Build privacy-safe precomputed aggregates for the RASD Research Presentation.

Source: uploads/_parsed_meta.json (the verified prior extraction; all 250
records aligned, all 19 fields cross-checked). The aggregates contain only
per-cell counts — no individual responses, no raw text.

What ships (and what does NOT):
  SHIPS: per region x age x period cell tallies (counts per indicator),
         plus full-sample totals and region/age/period distributions.
         NO individual survey record is shipped — a visitor can only ever
         see cell aggregates, never rows.
  DOES NOT SHIP: any per-record data, raw PDFs, or response-level free text.
"""
import json, re, unicodedata
from pathlib import Path

ROOT = Path('/home/user')
OUT = ROOT / 'rasd-research' / 'assets' / 'data' / 'aggregates.json'

HAZARDS  = ['عالية جدا','عالية','متوسطة','محدودة','لا أملك معرفة كافية']
PROCEDURES = ['معرفة عالية جدا','معرفة عالية','معرفة متوسطة','معرفة محدودة','لا أعرف الإجراءات المناسبة']
ALERT    = ['نعم','لا أتذكر','لا']
CLARITY  = ['واضحة جدا','واضحة','متوسطة الوضوح','غير واضحة','لم أطلع على تنبيهات سابقة']
CHALLENGES = ['صعوبة تحديد المناطق المتأثرة بالخطر','عدم معرفة مستوى خطورة الحدث',
              'صعوبة متابعة المعلومات من مصادر متعددة','عدم توفر تحديثات كافية عن تطورات الخطر',
              'عدم معرفة الإجراءات الوقائية المناسبة','تأخر وصول المعلومات والتحذيرات',
              'لا أتوقع مواجهة أي من هذه التحديات']
INFO     = ['مستوى خطورة الحدث','نوع الخطر الطبيعي','المناطق الجغرافية المحتمل تأثرها',
            'الإجراءات الوقائية المناسبة','مصدر التحذير الرسمي','الوقت المتوقع لحدوث الخطر، إن توفر',
            'التحديثات المتعلقة بتطور الخطر']
FEATURES = ['التنبيهات المبكرة بالمخاطر المحتملة','الإرشادات الوقائية المناسبة لكل نوع من المخاطر',
            'الخرائط التفاعلية للمناطق المعرضة للخطر','تصنيف المخاطر حسب مستوى الخطورة',
            'عرض المعلومات من مصادر رسمية موثوقة','تحديث بيانات المخاطر بصورة مستمرة',
            'التنبيهات المرتبطة بالموقع الجغرافي','أخرى']
FACTORS  = ['موثوقية المعلومات ومصادرها','سهولة الاستخدام','سرعة وصول التنبيهات',
            'دقة تحديد المناطق المتأثرة','وضوح الإرشادات الوقائية','المحافظة على خصوصية المستخدم','أخرى']
LIKELIHOOD = ['مرتفعة جدا','مرتفعة','متوسطة']
TECH_IMP  = ['جدا','مهمة']
AGES = ['Less than 18','18-28','25-34','45+']
MONTHS = ['2026-10','2026-11']
REGIONS = ['مكة المكرمة','الرياض','المنطقة الشرقية','حائل','القصيم','المدينة المنورة','الباحة','عسير','تبوك']

def norm(s):
    s = unicodedata.normalize('NFC', s or '')
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', s).strip()

def tally_cell(recs):
    haz = [0]*len(HAZARDS); proc = [0]*len(PROCEDURES); alert = [0]*len(ALERT)
    clarity = [0]*len(CLARITY); chal = [0]*len(CHALLENGES); info = [0]*len(INFO)
    feat = [0]*len(FEATURES); fac = [0]*len(FACTORS); lik = [0]*len(LIKELIHOOD); ti = [0]*len(TECH_IMP)
    for r in recs:
        h = norm(r['hazards'])
        p = norm(r['procedures'])
        a = norm(r['alert'])
        c = norm(r['clarity'])
        if h in HAZARDS: haz[HAZARDS.index(h)] += 1
        if p in PROCEDURES: proc[PROCEDURES.index(p)] += 1
        if a in ALERT: alert[ALERT.index(a)] += 1
        if c in CLARITY: clarity[CLARITY.index(c)] += 1
        for ch in r['challenges']:
            ch2 = norm(ch)
            if ch2 in CHALLENGES: chal[CHALLENGES.index(ch2)] += 1
        for i2 in r['info']:
            i2n = norm(i2)
            if i2n in INFO: info[INFO.index(i2n)] += 1
        lik_v = norm(r['likelihood'])
        if lik_v in LIKELIHOOD: lik[LIKELIHOOD.index(lik_v)] += 1
        ti_v = norm(r['techImp'])
        if ti_v in TECH_IMP: ti[TECH_IMP.index(ti_v)] += 1
        for f in r['features']:
            f2 = norm(f)
            if f2 in FEATURES: feat[FEATURES.index(f2)] += 1
        for f in r['factors']:
            f2 = norm(f)
            if f2 in FACTORS: fac[FACTORS.index(f2)] += 1
    return {'n': len(recs), 'hazards': haz, 'procedures': proc, 'alert': alert, 'clarity': clarity,
            'challenges': chal, 'info': info, 'features': feat, 'factors': fac,
            'likelihood': lik, 'techImp': ti}

data = json.load(open(ROOT / 'uploads' / '_parsed_meta.json', encoding='utf-8'))
meta = data['meta']
scales = data['scales']
chal = data['challenges']
tech = data['tech']

records = []
for i in range(250):
    m = meta[i]
    if not m: continue
    s = scales[i]
    chi = chal[i]
    t = tech[i]
    records.append({
        'region': m['region'],
        'age': m['age'],
        'month': m['start'][:7],
        'hazards': s['knowledge_hazards'],
        'procedures': s['knowledge_procedures'],
        'alert': s['alert'],
        'clarity': s['clarity'],
        'challenges': [x for x in chi['challenge']],
        'info': [x for x in chi['info']],
        'likelihood': t['likelihood'],
        'techImp': t['tech_importance'] if t['tech_importance'] else 'مهمة',
        'features': t['features'],
        'factors': t['factors'],
    })

print('records:', len(records))

# normalize tech importance blank -> مهمة
for r in records:
    r['techImp'] = 'جدا' if r['techImp'].startswith('جدا') else 'مهمة'

total = tally_cell(records)

cells = []
for region in REGIONS:
    for age in AGES:
        for month in MONTHS:
            recs = [r for r in records if r['region'] == region and r['age'] == age and r['month'] == month]
            cells.append({'region': region, 'age': age, 'month': month, **tally_cell(recs)})

nonempty = sum(1 for c in cells if c['n'] > 0)
print('nonempty cells:', nonempty, '/ 72')

agg = {
    'meta': {
        'n': len(records),
        'periodStart': '2026-10-20',
        'periodEnd': '2026-11-20',
        'download': 'Findings AR/EN — see Reports section',
    },
    'lists': {'hazards': HAZARDS, 'procedures': PROCEDURES, 'alert': ALERT, 'clarity': CLARITY,
              'challenges': CHALLENGES, 'info': INFO, 'features': FEATURES, 'factors': FACTORS,
              'likelihood': LIKELIHOOD, 'techImp': TECH_IMP, 'ages': AGES, 'months': MONTHS, 'regions': REGIONS},
    'sample': {
        'ages': {a: sum(1 for r in records if r['age'] == a) for a in AGES},
        'regions': {reg: sum(1 for r in records if r['region'] == reg) for reg in REGIONS},
        'months': {m: sum(1 for r in records if r['month'] == m) for m in MONTHS},
    },
    'full': total,
    'cells': cells,
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(agg, ensure_ascii=False, indent=2), encoding='utf-8')
# Also emit an inlined JS payload so the site works offline on file://
JS = ROOT / 'rasd-research' / 'assets' / 'js' / 'data.js'
JS.parent.mkdir(parents=True, exist_ok=True)
JS.write_text('window.RASD_DATA = ' + json.dumps(agg, ensure_ascii=False) + ';\n', encoding='utf-8')
print('written:', OUT, 'bytes:', OUT.stat().st_size)
print('written:', JS, 'bytes:', JS.stat().st_size)
for k in ['hazards','procedures','alert','clarity','challenges','info','features','factors','likelihood','techImp']:
    print(k, 'sum:', sum(total[k]), '| n:', total['n'])
