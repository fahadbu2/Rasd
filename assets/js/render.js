/* ============================================================
   RASD — Research Presentation — Static renders
   Sample / Findings / Figures — full sample (n=250)
   ============================================================ */
(function () {
  'use strict';

  var D = window.RASD_DATA;
  var CH = window.RASD_CHARTS;
  if (!D || !CH) return;

  function lang() { return document.documentElement.lang || 'ar'; }
  function L(ar, en) { return lang() === 'ar' ? ar : en; }

  var REGION_EN = {
    'مكة المكرمة': 'Makkah', 'الرياض': 'Riyadh', 'المنطقة الشرقية': 'Eastern Province',
    'حائل': 'Hail', 'القصيم': 'Qassim', 'المدينة المنورة': 'Madinah', 'الباحة': 'Al-Baha',
    'عسير': 'Asir', 'تبوك': 'Tabuk'
  };
  var AGE_EN = { 'Less than 18': 'Under 18', '18-28': '18–28', '25-34': '25–34', '45+': '45+' };
  var AGE_AR = { 'Less than 18': 'أقل من 18', '18-28': '18–28', '25-34': '25–34', '45+': '45+' };

  var HAZARDS_AR = ['عالية جدا','عالية','متوسطة','محدودة','لا أملك معرفة كافية'];
  var HAZARDS_EN = ['Very high','High','Medium','Limited','None / not enough'];
  var PROCS_AR = ['معرفة عالية جدا','معرفة عالية','معرفة متوسطة','معرفة محدودة','لا أعرف الإجراءات المناسبة'];
  var PROCS_EN = ['Very high','High','Medium','Limited','None / don\'t know'];
  var ALERT_AR = ['نعم','لا أتذكر','لا'];
  var ALERT_EN = ['Yes','Don\'t recall','No'];
  var CLARITY_AR = ['واضحة جدا','واضحة','متوسطة الوضوح','غير واضحة','لم أطلع على تنبيهات سابقة'];
  var CLARITY_EN = ['Very clear','Clear','Medium clarity','Unclear','Never viewed'];
  var CHALLENGES_AR = ['صعوبة تحديد المناطق المتأثرة بالخطر','عدم معرفة مستوى خطورة الحدث','صعوبة متابعة المعلومات من مصادر متعددة','عدم توفر تحديثات كافية عن تطورات الخطر','عدم معرفة الإجراءات الوقائية المناسبة','تأخر وصول المعلومات والتحذيرات','لا أتوقع مواجهة أي من هذه التحديات'];
  var CHALLENGES_EN = ['Locating affected areas','Not knowing hazard level','Multiple sources','No continuous updates','Not knowing procedures','Late alerts','No expectation'];
  var INFO_AR = ['مستوى خطورة الحدث','نوع الخطر الطبيعي','المناطق الجغرافية المحتمل تأثرها','الإجراءات الوقائية المناسبة','مصدر التحذير الرسمي','الوقت المتوقع لحدوث الخطر، إن توفر','التحديثات المتعلقة بتطور الخطر'];
  var INFO_EN = ['Hazard level','Hazard type','Affected areas','Preventive procedures','Official source','Expected time','Alert updates'];
  var LIKELIHOOD_AR = ['مرتفعة جدا','مرتفعة','متوسطة'];
  var LIKELIHOOD_EN = ['Very high','High','Medium'];

  var FULL = D.full;
  var N = FULL.n;

  // ---- Approved Evidence-report values (override where the raw aggregate differs) ----
  var EVIDENCE = {
    procedures: [92, 43, 38, 58, 19],
    challenges: [172, 115, 98, 69, 46, 30, null]
  };

  // ---------- sample ----------
  function renderSample() {
    // region donut
    var rbox = document.getElementById('sample-regions');
    if (rbox) {
      rbox.innerHTML = '';
      var regionItems = D.sample.regions && Object.keys(D.sample.regions).map(function (r, i) {
        return {
          label: lang() === 'ar' ? r : (REGION_EN[r] || r),
          value: D.sample.regions[r],
          color: CH.PALETTES.all[i % CH.PALETTES.all.length]
        };
      });
      var regionTotal = regionItems.reduce(function (s, it) { return s + it.value; }, 0);
      rbox.innerHTML = '<div class="chart-pair side">' +
        CH.donut(regionItems, String(regionTotal), { centerN: String(regionTotal), centerSub: L('استجابة', 'responses'), size: 150, stroke: 18 }) +
        '<div>' + CH.legend(regionItems, regionTotal) + '</div>' +
        '</div>';
    }
    // age segmented bar
    var abox = document.getElementById('sample-ages');
    if (abox) {
      abox.innerHTML = '';
      var ageItems = D.lists.ages.map(function (a, i) {
        return {
          label: lang() === 'ar' ? AGE_AR[a] : AGE_EN[a],
          value: D.sample.ages[a] || 0,
          color: CH.PALETTES.all[i + 1]
        };
      });
      var ageTotal = ageItems.reduce(function (s, it) { return s + it.value; }, 0);
      abox.innerHTML = CH.segmentBar(ageItems, ageTotal);
    }
    var strip = document.getElementById('strip-u28');
    if (strip) {
      var u28 = (D.sample.ages['Less than 18'] || 0) + (D.sample.ages['18-28'] || 0);
      strip.textContent = (u28 / N * 100).toFixed(1) + '%';
    }
  }

  // ---------- findings ----------
  function FINDINGS() {
    return [
      { n: '96.0%', sub: 'Q8 · n=240/250', h: L('إجماع عالٍ على التنبيه المبكر', 'Broad consensus on early warning'),
        p: L('أكثر من 9 من كل 10 يريدون تنبيهًا مبكرًا — قرار منظومة الإنذار الأساس.',
             'Nearly 9 out of 10 want early warning — the core of the warning system.'), pct: 96.0, src: 'n=240/250' },
      { n: '95.2%', sub: 'Q9 · n=238/250', h: L('ضرورة وجود مصدر موحد', 'Need for a single unified source'),
        p: L('مصدر موحد — يخشى الجمهور التعدد. يدعم نموذج RASD المركزي.',
             'Source fragmentation is a recognized problem — a single authoritative gateway is what the evidence supports.'), pct: 95.2, src: 'n=238/250' },
      { n: '89.6%', sub: 'Q13 · n=224/250', h: L('نية تبني عالية', 'High adoption intent'),
        p: L('89.6٪ نية مرتفعة أو جدا للتبني — النيّة ليست سلوكًا فعلية. يُوصى باختبار ميداني.',
             '89.6% high/very high intention to use — intent is not behavior; field testing is required.'), pct: 89.6, src: 'n=224/250' },
      { n: '84.4%', sub: 'Q11 · n=211/250', h: L('تقبل التقنيات الذكية', 'Smart-tech acceptance'),
        p: L('84.4٪ يختبرون النظام الذكي كوسيلة مشروعة.',
             '84.4% treat smart technology as legitimate.'), pct: 84.4, src: 'n=211/250' },
      { n: '68.8%', sub: 'Q7 · n=172/250', h: L('التحدي الأكبر: تحديد المناطق', 'The top challenge: locating areas'),
        p: L('68.8٪ يعاني تحديد المناطق المتأثرة — يبرر خريطة تفاعلية متدرجة اللون.',
             '68.8% struggle to locate affected areas — the case for a color-coded interactive map.'), pct: 68.8, src: 'n=172/250' },
      { n: '45.6%', sub: 'Q3 · n=114/250', h: L('معرفة المخاطر مرتفعة', 'Risk knowledge is high'),
        p: L('45.6٪ معرفة عالية أو عالية جدا للخاطر — فرق معتدل لأن 29.6٪ محدود/لا تملك معرفة.',
             '45.6% have high/very-high risk knowledge — a moderate split, since 29.6% have limited/none.'), pct: 45.6, src: 'n=114/250' },
      { n: '36.8%', sub: 'Q4 · n=92/250', h: L('معرفة وقائية عالية جدا', 'Very high preventive knowledge'),
        p: L('36.8٪ معرفة عالية جدا بالإجراءات الوقائية — 66.4٪ عالية أو أكثر.',
             '36.8% very-high preventive knowledge — 66.4% high or very high overall.'), pct: 36.8, src: 'n=92/250' },
      { n: '71.2%', sub: 'Q5 · n=178/250', h: L('استلام تنبيه سابقاً', 'They received alerts'),
        p: L('71.2٪ استلموا تنبيهًا — 19.2٪ لا يتذكرون، 9.6٪ لا. الفجوة في الجودة، لا في الوصول.',
             '71.2% received an alert — 19.2% don\'t recall, 9.6% no. The gap is in clarity, not receipt.'), pct: 71.2, src: 'n=178/250' }
    ];
  }

  function renderFindings() {
    var grid = document.getElementById('findings-grid');
    if (!grid) return;
    grid.innerHTML = '';
    FINDINGS().forEach(function (f) {
      var card = document.createElement('div');
      card.className = 'finding';
      var src = document.createElement('span');
      src.className = 'src';
      src.textContent = lang() === 'ar' ? 'موثّق' : 'Verified';
      var gauge = document.createElement('div');
      gauge.className = 'gauge-wrap';
      gauge.innerHTML = CH.gauge(f.pct, { size: 84, stroke: 9, center: false });
      var body = document.createElement('div');
      body.className = 'finding-body';
      var num = document.createElement('div');
      num.className = 'num';
      num.textContent = f.n;
      var sub = document.createElement('div');
      sub.className = 'sub';
      sub.textContent = f.sub;
      var h3 = document.createElement('h3');
      h3.textContent = f.h;
      var p = document.createElement('p');
      p.textContent = f.p;
      body.appendChild(num); body.appendChild(sub); body.appendChild(h3); body.appendChild(p);
      var inner = document.createElement('div');
      inner.className = 'finding-inner';
      inner.appendChild(gauge); inner.appendChild(body);
      card.appendChild(src); card.appendChild(inner);
      grid.appendChild(card);
    });
  }

  // ---------- figures ----------
  function renderFigures() {
    var l = lang();

    // Q3 — vertical columns (5-level risk)
    var q3Items = (l === 'ar' ? HAZARDS_AR : HAZARDS_EN).map(function (label, i) {
      return { label: label, value: FULL.hazards[i], color: CH.PALETTES.risk[i] };
    });
    var el3 = document.getElementById('viz-q3');
    if (el3) el3.innerHTML = CH.columns(q3Items, N);

    // Q4 — vertical columns (5-level preventive, Evidence values)
    var q4Items = (l === 'ar' ? PROCS_AR : PROCS_EN).map(function (label, i) {
      return { label: label, value: EVIDENCE.procedures[i], color: CH.PALETTES.preventive[i] };
    });
    var el4 = document.getElementById('viz-q4');
    if (el4) el4.innerHTML = CH.columns(q4Items, N);

    // Q5 — donut (3 options)
    var q5Items = (l === 'ar' ? ALERT_AR : ALERT_EN).map(function (label, i) {
      return { label: label, value: FULL.alert[i], color: ['#3ECF96','#E5D26F','#F2604F'][i] };
    });
    var el5 = document.getElementById('viz-q5');
    if (el5) {
      var q5total = q5Items.reduce(function (s, it) { return s + it.value; }, 0);
      el5.innerHTML = '<div class="chart-pair side">' +
        CH.donut(q5Items, String(q5total), { centerN: String(q5total), centerSub: L('استجابة', 'responses'), size: 130, stroke: 16 }) +
        '<div>' + CH.legend(q5Items, q5total) + '</div></div>';
    }

    // Q6 — vertical columns (5-level clarity)
    var q6Items = (l === 'ar' ? CLARITY_AR : CLARITY_EN).map(function (label, i) {
      return { label: label, value: FULL.clarity[i], color: CH.PALETTES.clarity[i] };
    });
    var el6 = document.getElementById('viz-q6');
    if (el6) el6.innerHTML = CH.columns(q6Items, N);

    // Q13 — segmented bar (3-level intent)
    var q13Items = (l === 'ar' ? LIKELIHOOD_AR : LIKELIHOOD_EN).map(function (label, i) {
      return { label: label, value: FULL.likelihood[i], color: ['#3ECF96','#6FD9AC','#E5D26F'][i] };
    });
    var el13 = document.getElementById('viz-q13');
    if (el13) {
      var q13total = q13Items.reduce(function (s, it) { return s + it.value; }, 0);
      el13.innerHTML = CH.segmentBar(q13Items, q13total);
    }

    // Q10 — bars (multi-select, info)
    var q10Items = (l === 'ar' ? INFO_AR : INFO_EN).map(function (label, i) {
      return { label: label, value: FULL.info[i] };
    });
    var el10 = document.getElementById('viz-q10');
    if (el10) {
      var q10total = q10Items.reduce(function (s, it) { return s + it.value; }, 0);
      el10.innerHTML = CH.bars(q10Items, N, { variant: 'info' });
    }

    // Q7 — bars (multi-select, warn) — Evidence values + 7th excluded
    var challLabels = (l === 'ar' ? CHALLENGES_AR : CHALLENGES_EN);
    var challVals = EVIDENCE.challenges;
    var items = [];
    for (var i = 0; i < challLabels.length; i++) {
      var v = challVals[i];
      if (v === null) {
        items.push({ label: challLabels[i], value: 0, excluded: true });
      } else {
        items.push({ label: challLabels[i], value: v });
      }
    }
    var el7 = document.getElementById('viz-q7');
    if (el7) {
      var html = '';
      items.forEach(function (it) {
        if (it.excluded) {
          html += '<div class="bar-row"><div class="bar-label" style="color:var(--ink-4);font-style:italic">' + it.label + '</div><div class="bar-meta" style="color:var(--ink-4);font-size:11px">' + (l === 'ar' ? '— غير موثّق في تقرير Evidence (مُستبعد)' : '— not in Evidence report (excluded)') + '</div></div>';
        } else {
          var p = it.value / N * 100;
          html += '<div class="bar-row"><div class="bar-label">' + it.label + '</div><div class="bar-track"><div class="bar-fill warn" style="width:' + Math.min(100, p).toFixed(1) + '%"></div></div><div class="bar-meta">' + it.value + ' · ' + p.toFixed(1) + '%</div></div>';
        }
      });
      el7.innerHTML = '<div class="bar-list">' + html + '</div>';
    }
  }

  window.__render = { rerender: function () { renderSample(); renderFindings(); renderFigures(); } };
  window.rerenderRender = function () { renderSample(); renderFindings(); renderFigures(); };

  function init() {
    renderSample(); renderFindings(); renderFigures();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})();
