/* ============================================================
   RASD — Research Presentation — Interactive Explore
   Privacy-safe: reads precomputed per-cell tallies only (no individual records).
   ============================================================ */
(function () {
  'use strict';

  var D = window.RASD_DATA;
  var CH = window.RASD_CHARTS;
  if (!D || !CH) { console.error('RASD_DATA/RASD_CHARTS not found'); return; }

  var REGION_EN = {
    'مكة المكرمة': 'Makkah', 'الرياض': 'Riyadh', 'المنطقة الشرقية': 'Eastern Province',
    'حائل': 'Hail', 'القصيم': 'Qassim', 'المدينة المنورة': 'Madinah', 'الباحة': 'Al-Baha',
    'عسير': 'Asir', 'تبوك': 'Tabuk'
  };
  var AGE_EN = { 'Less than 18': 'Under 18', '18-28': '18–28', '25-34': '25–34', '45+': '45+' };
  var AGE_AR = { 'Less than 18': 'أقل من 18', '18-28': '18–28', '25-34': '25–34', '45+': '45+' };
  var MONTH_EN = { '2026-10': 'Oct 2026', '2026-11': 'Nov 2026' };
  var MONTH_AR = { '2026-10': 'أكتوبر ٢٠٢٦', '2026-11': 'نوفمبر ٢٠٢٦' };

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
  var LIKELIHOOD_AR = ['مرتفعة جدا','مرتفعة','متوسطة'];
  var LIKELIHOOD_EN = ['Very high','High','Medium'];
  var FACTORS_AR = ['موثوقية المعلومات ومصادرها','سهولة الاستخدام','سرعة وصول التنبيهات','دقة تحديد المناطق المتأثرة','وضوح الإرشادات الوقائية','المحافظة على خصوصية المستخدم','أخرى'];
  var FACTORS_EN = ['Reliability of information','Ease of use','Speed of alerts','Accuracy of affected areas','Clarity of guidance','User privacy','Other'];

  function lang() { return document.documentElement.lang || 'ar'; }
  function L(ar, en) { return lang() === 'ar' ? ar : en; }

  var state = {
    regions: new Set(),
    ages: new Set(),
    months: new Set()
  };

  var FULL = D.full;
  var N_FULL = FULL.n;

  function filteredData() {
    var cells = D.cells.filter(function (c) {
      if (state.regions.size && !state.regions.has(c.region)) return false;
      if (state.ages.size && !state.ages.has(c.age)) return false;
      if (state.months.size && !state.months.has(c.month)) return false;
      return true;
    });
    var tot = {
      n: 0,
      hazards: [0,0,0,0,0], procedures: [0,0,0,0,0], alert: [0,0,0], clarity: [0,0,0,0,0],
      challenges: [0,0,0,0,0,0,0], likelihood: [0,0,0], factors: [0,0,0,0,0,0,0]
    };
    var byRegion = {}, byAge = {};
    cells.forEach(function (c) {
      tot.n += c.n;
      add(tot.hazards, c.hazards); add(tot.procedures, c.procedures);
      add(tot.alert, c.alert); add(tot.clarity, c.clarity);
      add(tot.challenges, c.challenges); add(tot.likelihood, c.likelihood);
      add(tot.factors, c.factors);
      byRegion[c.region] = (byRegion[c.region] || 0) + c.n;
      byAge[c.age] = (byAge[c.age] || 0) + c.n;
    });
    return { tot: tot, byRegion: byRegion, byAge: byAge };
  }

  function add(a, b) { for (var i = 0; i < a.length; i++) a[i] += b[i] || 0; }

  function $(id) { return document.getElementById(id); }

  function fmtPct(n, d) {
    if (d <= 0) return '—';
    return (n / d * 100).toFixed(1) + '%';
  }

  function smallSample(total) { return total > 0 && total < 20; }

  // ---------- chip builder ----------
  function chip(container, label, value, count, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip-btn';
    b.dataset.kind = value;
    b.setAttribute('aria-pressed', 'false');
    b.appendChild(document.createTextNode(label));
    if (count !== undefined && count !== null) {
      var cnt = document.createElement('span');
      cnt.className = 'cnt';
      cnt.textContent = ' (' + count + ')';
      b.appendChild(cnt);
    }
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', String(!on));
      onClick(value, !on);
    });
    container.appendChild(b);
  }

  function renderChips() {
    var rc = $('region-chips'), ac = $('age-chips'), mc = $('month-chips');
    if (!rc) return;
    rc.innerHTML = ''; ac.innerHTML = ''; mc.innerHTML = '';

    D.sample.regions && Object.keys(D.sample.regions).forEach(function (r) {
      chip(rc, (lang() === 'ar' ? r : REGION_EN[r] || r), r, D.sample.regions[r], function (v, on) {
        if (on) state.regions.add(v); else state.regions.delete(v);
        applyFilters();
      });
    });
    D.sample.ages && Object.keys(D.sample.ages).forEach(function (a) {
      chip(ac, (lang() === 'ar' ? AGE_AR[a] : AGE_EN[a]), a, D.sample.ages[a], function (v, on) {
        if (on) state.ages.add(v); else state.ages.delete(v);
        applyFilters();
      });
    });
    D.sample.months && Object.keys(D.sample.months).forEach(function (m) {
      chip(mc, (lang() === 'ar' ? MONTH_AR[m] : MONTH_EN[m]), m, D.sample.months[m], function (v, on) {
        if (on) state.months.add(v); else state.months.delete(v);
        applyFilters();
      });
    });
    syncChips();
  }

  function syncChips() {
    document.querySelectorAll('#region-chips .chip-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(state.regions.has(b.dataset.kind)));
    });
    document.querySelectorAll('#age-chips .chip-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(state.ages.has(b.dataset.kind)));
    });
    document.querySelectorAll('#month-chips .chip-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(state.months.has(b.dataset.kind)));
    });
  }

  // ---------- active filter pills ----------
  function renderPills() {
    var box = $('active-filter-list');
    if (!box) return;
    box.innerHTML = '';
    var has = false;
    function pill(kind, value, onRemove) {
      has = true;
      var label = kind === 'region' ? (lang() === 'ar' ? value : (REGION_EN[value] || value))
        : kind === 'age' ? (lang() === 'ar' ? AGE_AR[value] : AGE_EN[value])
        : (lang() === 'ar' ? MONTH_AR[value] : MONTH_EN[value]);
      var p = document.createElement('span');
      p.className = 'filter-pill';
      p.appendChild(document.createTextNode(label));
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', L('إزالة الفلتر', 'Remove filter'));
      btn.textContent = '×';
      btn.addEventListener('click', function () { onRemove(value); });
      p.appendChild(btn);
      box.appendChild(p);
    }
    state.regions.forEach(function (v) { pill('region', v, function (v2) { state.regions.delete(v2); applyFilters(); }); });
    state.ages.forEach(function (v) { pill('age', v, function (v2) { state.ages.delete(v2); applyFilters(); }); });
    state.months.forEach(function (v) { pill('month', v, function (v2) { state.months.delete(v2); applyFilters(); }); });

    var lbl = $('active-filter-label');
    if (lbl) lbl.textContent = has ? L('عوامل التصفية النشطة', 'Active filters') : L('لا توجد عوامل تصفية نشطة', 'No active filters');
    var resetBtn = $('btn-reset');
    if (resetBtn) resetBtn.disabled = !has;
  }

  // ---------- bar row builder (keeps count/pct hidden for small samples) ----------
  function barList(container, items, total) {
    container.innerHTML = '';
    var showPct = total >= 20;
    items.forEach(function (it) {
      var v = it.value;
      var p = total > 0 ? (v / total * 100) : 0;
      var row = document.createElement('div');
      row.className = 'bar-row';
      var lbl = document.createElement('div');
      lbl.className = 'bar-label';
      lbl.textContent = it.label;
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill' + (it.variant ? ' ' + it.variant : '');
      fill.style.width = Math.min(100, p).toFixed(1) + '%';
      track.appendChild(fill);
      var meta = document.createElement('div');
      meta.className = 'bar-meta';
      meta.textContent = showPct ? (v + ' · ' + p.toFixed(1) + '%') : String(v);
      row.appendChild(lbl); row.appendChild(track); row.appendChild(meta);
      container.appendChild(row);
    });
    if (smallSample(total)) {
      var warn = document.createElement('div');
      warn.className = 'viz-note';
      warn.innerHTML = '<span class="ico">⊘</span><span>' + L('عينة صغيرة (n<20) — نسبة مئوية مخفية؛ الأعداد فقط.', 'Small sample (n<20) — percentage hidden; counts only.') + '</span>';
      container.appendChild(warn);
    }
  }

  function barsHTML(items, total, opts) {
    // reuse the HTML-builder with the same markup but into given container
    var box = document.createElement('div');
    box.innerHTML = CH.bars(items, total, opts);
    return box;
  }

  // ---------- KPI strip ----------
  function renderKpis(filt) {
    var strip = $('kpi-strip');
    if (!strip) return;
    strip.innerHTML = '';
    var n = filt.tot.n;
    var highRisk = filt.tot.hazards[0] + filt.tot.hazards[1];
    var highPrev = filt.tot.procedures[0] + filt.tot.procedures[1];
    var intentHigh = filt.tot.likelihood[0] + filt.tot.likelihood[1];
    var ease = filt.tot.factors[1];

    var kpis = [
      { v: String(n), k: L('استجابة مطابقة', 'matching responses') },
      { v: n ? fmtPct(highRisk, n) : '—', k: L('معرفة المخاطر مرتفعة (عالية+عالية جدا)', 'High risk knowledge (high+very high)') },
      { v: n ? fmtPct(highPrev, n) : '—', k: L('معرفة وقائية مرتفعة (عالية+عالية جدا)', 'High preventive knowledge (high+very high)') },
      { v: n ? fmtPct(intentHigh, n) : '—', k: L('نية استخدام عالية/جدا', 'Adoption intent high/very high') },
      { v: n ? fmtPct(ease, n) : '—', k: L('سهولة الاستخدام — أعلى عامل', 'Top driver: ease of use') }
    ];
    kpis.forEach(function (k) {
      var item = document.createElement('div');
      item.className = 'kpi';
      var v = document.createElement('div'); v.className = 'v'; v.textContent = k.v;
      var kk = document.createElement('div'); kk.className = 'k'; kk.textContent = k.k;
      item.appendChild(v); item.appendChild(kk);
      strip.appendChild(item);
    });
  }

  // ---------- main render ----------
  function render() {
    var filt = filteredData();
    var n = filt.tot.n;

    var metaEl = $('explore-meta-count');
    if (metaEl) {
      metaEl.textContent = L('الاستجابات المطابقة: ' + n + ' من ' + N_FULL, 'Showing ' + n + ' of ' + N_FULL + ' responses');
    }

    var empty = $('empty-state');
    var charts = $('explore-charts');

    if (n === 0) {
      if (empty) empty.hidden = false;
      if (charts) charts.style.display = 'none';
      renderKpis(filt);
      return;
    }
    if (empty) empty.hidden = true;
    if (charts) charts.style.display = '';

    renderKpis(filt);

    var showPct = n >= 20;

    // regions — donut
    var rbox = $('chart-regions');
    if (rbox) {
      rbox.innerHTML = '';
      var rItems = Object.keys(filt.byRegion).map(function (r, i) {
        return {
          label: lang() === 'ar' ? r : (REGION_EN[r] || r),
          value: filt.byRegion[r],
          color: CH.PALETTES.all[i % CH.PALETTES.all.length]
        };
      }).filter(function (it) { return it.value > 0; });
      var rTotal = rItems.reduce(function (s, it) { return s + it.value; }, 0);
      rbox.innerHTML = '<div class="chart-pair side">' +
        CH.donut(rItems, String(rTotal), { centerN: String(rTotal), centerSub: L('استجابة', 'responses'), size: 120, stroke: 15 }) +
        '<div>' + CH.legend(rItems, rTotal) + '</div></div>';
    }

    // ages — segmented bar
    var abox = $('chart-ages');
    if (abox) {
      abox.innerHTML = '';
      var aItems = D.lists.ages.map(function (a, i) {
        return {
          label: lang() === 'ar' ? AGE_AR[a] : AGE_EN[a],
          value: filt.byAge[a] || 0,
          color: CH.PALETTES.all[i + 1]
        };
      });
      var aTotal = aItems.reduce(function (s, it) { return s + it.value; }, 0);
      abox.innerHTML = CH.segmentBar(aItems, aTotal);
    }

    // Q3 risk — bars
    var q3 = $('chart-q3');
    if (q3) barList(q3, (lang() === 'ar' ? HAZARDS_AR : HAZARDS_EN).map(function (label, i) { return { label: label, value: filt.tot.hazards[i] }; }), n);

    // Q4 — bars
    var q4 = $('chart-q4');
    if (q4) barList(q4, (lang() === 'ar' ? PROCS_AR : PROCS_EN).map(function (label, i) { return { label: label, value: filt.tot.procedures[i] }; }), n);

    // Q5 — bars
    var q5 = $('chart-q5');
    if (q5) barList(q5, (lang() === 'ar' ? ALERT_AR : ALERT_EN).map(function (label, i) { return { label: label, value: filt.tot.alert[i] }; }), n);

    // Q6 — bars
    var q6 = $('chart-q6');
    if (q6) barList(q6, (lang() === 'ar' ? CLARITY_AR : CLARITY_EN).map(function (label, i) { return { label: label, value: filt.tot.clarity[i] }; }), n);

    // Q13 — segmented bar
    var q13 = $('chart-q13');
    if (q13) {
      q13.innerHTML = '';
      var likItems = (lang() === 'ar' ? LIKELIHOOD_AR : LIKELIHOOD_EN).map(function (label, i) {
        return { label: label, value: filt.tot.likelihood[i], color: ['#3ECF96','#6FD9AC','#E5D26F'][i] };
      });
      var likTotal = likItems.reduce(function (s, it) { return s + it.value; }, 0);
      q13.innerHTML = CH.segmentBar(likItems, likTotal);
    }

    // Q7 — bars (multi-select)
    var q7 = $('chart-q7');
    if (q7) {
      var challItems = (lang() === 'ar' ? CHALLENGES_AR : CHALLENGES_EN).map(function (label, i) { return { label: label, value: filt.tot.challenges[i], variant: 'warn' }; });
      barList(q7, challItems, n);
      var note = document.createElement('div');
      note.className = 'multi-note';
      note.innerHTML = '<span class="ico">⚠</span><span>' + L('اختيار متعدد — مجموع الأشرطة يتجاوز 100%.', 'Multi-select — bar totals exceed 100%.') + '</span>';
      q7.appendChild(note);
    }

    // Q14 factors — bars (multi-select, info)
    var q14 = $('chart-q14');
    if (q14) {
      var factorItems = (lang() === 'ar' ? FACTORS_AR : FACTORS_EN).map(function (label, i) { return { label: label, value: filt.tot.factors[i], variant: 'info' }; });
      barList(q14, factorItems, n);
      var note2 = document.createElement('div');
      note2.className = 'multi-note';
      note2.innerHTML = '<span class="ico">⚠</span><span>' + L('اختيار متعدد — مجموع الأشرطة يتجاوز 100%.', 'Multi-select — bar totals exceed 100%.') + '</span>';
      q14.appendChild(note2);
    }
  }

  function applyFilters() {
    renderPills();
    render();
  }

  function resetFilters() {
    state.regions.clear(); state.ages.clear(); state.months.clear();
    syncChips();
    applyFilters();
  }

  window.__explore = { rerender: function () { renderChips(); renderPills(); render(); } };
  window.rerenderExplore = function () { renderChips(); renderPills(); render(); };

  function init() {
    renderChips();
    renderPills();
    render();

    var resetBtn = $('btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

})();
