/* ============================================================
   RASD — Research Presentation — Chart primitives (SVG/HTML)
   Pure functions. No external libraries, no network.
   ============================================================ */
(function () {
  'use strict';

  var PALETTES = {
    risk: ['#F2604F', '#F2B14C', '#E5D26F', '#7FB2E5', '#3ECF96'],
    preventive: ['#3ECF96', '#6FD9AC', '#E5D26F', '#F2B14C', '#F2604F'],
    clarity: ['#3ECF96', '#6FCB9E', '#E5D26F', '#F2B14C', '#58706B'],
    signal: ['#3ECF96', '#2F9E76', '#E5D26F', '#7FB2E5', '#58706B'],
    all: ['#3ECF96', '#6FD9AC', '#7FB2E5', '#F2B14C', '#F2604F', '#E5D26F', '#58706B', '#20514A', '#8FA6A2']
  };

  function fmt(n) { return n.toLocaleString('en-US'); }
  function pct(n, d) { return d > 0 ? (n / d * 100) : 0; }
  function pctStr(n, d) { return d > 0 ? (n / d * 100).toFixed(1) + '%' : '—'; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  // ---------- Donut chart (SVG) ----------
  // items: [{label, value, color}]
  // Returns HTML string. RTL-safe.
  function donut(items, centerLabel, opts) {
    opts = opts || {};
    var size = opts.size || 140;
    var stroke = opts.stroke || 16;
    var total = items.reduce(function (s, it) { return s + (it.value || 0); }, 0);
    var radius = (size - stroke) / 2;
    var cx = size / 2, cy = size / 2;
    var circumference = 2 * Math.PI * radius;

    var svg = '<svg class="donut-svg" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + escapeHtml(centerLabel || 'donut chart') + '">';
    svg += '<g transform="rotate(-90 ' + cx + ' ' + cy + ')">';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="' + stroke + '"/>';
    var offset = 0;
    if (total > 0) {
      items.forEach(function (it) {
        var v = it.value || 0;
        if (v <= 0) return;
        var dashLen = (v / total) * circumference;
        svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="' + (it.color || '#3ECF96') + '" stroke-width="' + stroke + '" stroke-dasharray="' + dashLen.toFixed(2) + ' ' + (circumference - dashLen).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '" stroke-linecap="butt"/>';
        offset += dashLen;
      });
    }
    svg += '</g>';
    // center label
    svg += '<text x="' + cx + '" y="' + (cy - (opts.centerSub ? 8 : 0)) + '" text-anchor="middle" dominant-baseline="middle" class="donut-center-n">' + escapeHtml(opts.centerN || centerLabel || '') + '</text>';
    if (opts.centerSub) {
      svg += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" dominant-baseline="middle" class="donut-center-sub">' + escapeHtml(opts.centerSub) + '</text>';
    }
    svg += '</svg>';
    return '<div class="donut-wrap">' + svg + '</div>';
  }

  // ---------- Legend list (HTML) ----------
  function legend(items, total, opts) {
    opts = opts || {};
    var html = '<ul class="chart-legend">';
    items.forEach(function (it) {
      var v = it.value || 0;
      var p = total > 0 ? (v / total * 100).toFixed(1) + '%' : '—';
      html += '<li><span class="dot" style="background:' + (it.color || '#3ECF96') + '"></span><span class="leg-label">' + escapeHtml(it.label) + '</span><span class="leg-meta">' + fmt(v) + ' · ' + p + '</span></li>';
    });
    html += '</ul>';
    return html;
  }

  // ---------- Radial gauge (percentage arc) ----------
  // pct: 0..100, size: px
  function gauge(pctValue, opts) {
    opts = opts || {};
    var size = opts.size || 92;
    var stroke = opts.stroke || 9;
    var radius = (size - stroke) / 2;
    var cx = size / 2, cy = size / 2;
    var circumference = 2 * Math.PI * radius;
    var clamped = Math.max(0, Math.min(100, pctValue || 0));
    var dashLen = (clamped / 100) * circumference;
    var color = opts.color || '#3ECF96';
    var showCenter = opts.center !== false;
    var svg = '<svg class="gauge-svg" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + clamped.toFixed(1) + '%">';
    svg += '<g transform="rotate(-90 ' + cx + ' ' + cy + ')">';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="' + stroke + '"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-dasharray="' + dashLen.toFixed(2) + ' ' + (circumference - dashLen).toFixed(2) + '" stroke-linecap="round"/>';
    svg += '</g>';
    if (showCenter) {
      svg += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" dominant-baseline="middle" class="gauge-n">' + clamped.toFixed(1) + '%</text>';
      if (opts.sub) {
        svg += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" dominant-baseline="middle" class="gauge-sub">' + escapeHtml(opts.sub) + '</text>';
      }
    }
    svg += '</svg>';
    return svg;
  }

  // ---------- Segmented 100% stacked bar (HTML) ----------
  // items: [{label, value, color}] — shares of a total
  function segmentBar(items, total, opts) {
    opts = opts || {};
    total = total || items.reduce(function (s, it) { return s + (it.value || 0); }, 0);
    var html = '<div class="seg-bar" role="img" aria-label="100% stacked bar">';
    items.forEach(function (it) {
      var v = it.value || 0;
      if (v <= 0 || total <= 0) return;
      var w = (v / total) * 100;
      html += '<div class="seg-item" data-label="' + escapeHtml(it.label) + '" data-pct="' + w.toFixed(1) + '" style="width:' + w.toFixed(2) + '%;background:' + (it.color || '#3ECF96') + '" title="' + escapeHtml(it.label) + ': ' + w.toFixed(1) + '%"></div>';
    });
    html += '</div>';
    // captions
    var cap = '<div class="seg-captions">';
    items.forEach(function (it) {
      var v = it.value || 0;
      if (v <= 0) return;
      var w = (v / total) * 100;
      cap += '<div class="seg-caption"><span class="dot" style="background:' + (it.color || '#3ECF96') + '"></span><span class="seg-caption-label">' + escapeHtml(it.label) + '</span><span class="seg-caption-meta">' + fmt(v) + ' · ' + w.toFixed(1) + '%</span></div>';
    });
    cap += '</div>';
    return html + cap;
  }

  // ---------- Vertical columns (HTML) ----------
  // items: [{label, value, pct, color}] — vertical bar chart
  function columns(items, total, opts) {
    opts = opts || {};
    var max = 0;
    items.forEach(function (it) { if (it.value > max) max = it.value; });
    var html = '<div class="col-wrap">';
    items.forEach(function (it) {
      var hPct = max > 0 ? (it.value / max) * 100 : 0;
      var p = total > 0 ? (it.value / total * 100) : 0;
      html += '<div class="col-item">';
      html += '<div class="col-track"><div class="col-fill" style="height:' + hPct.toFixed(1) + '%;background:' + (it.color || '#3ECF96') + '" title="' + escapeHtml(it.label) + ': ' + it.value + ' (' + p.toFixed(1) + '%)"></div></div>';
      html += '<div class="col-value">' + fmt(it.value) + '</div>';
      html += '<div class="col-pct">' + (total > 0 ? p.toFixed(1) + '%' : '—') + '</div>';
      html += '<div class="col-label">' + escapeHtml(it.label) + '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  // ---------- Bars (horizontal, existing design language) ----------
  function bars(items, total, opts) {
    opts = opts || {};
    var html = '<div class="bar-list">';
    items.forEach(function (it) {
      var v = it.value;
      var p = total > 0 ? (v / total * 100) : 0;
      var variant = opts.variant || '';
      html += '<div class="bar-row">';
      html += '<div class="bar-label">' + escapeHtml(it.label) + '</div>';
      html += '<div class="bar-track"><div class="bar-fill' + (variant ? ' ' + variant : '') + '" style="width:' + Math.min(100, p).toFixed(1) + '%"></div></div>';
      html += '<div class="bar-meta">' + fmt(v) + ' · ' + p.toFixed(1) + '%</div>';
      html += '</div>';
    });
    html += '</div>';
    if (opts.note) {
      html += '<div class="viz-note"><span class="ico">⚠</span><span>' + escapeHtml(opts.note) + '</span></div>';
    }
    return html;
  }

  window.RASD_CHARTS = {
    PALETTES: PALETTES,
    donut: donut,
    legend: legend,
    gauge: gauge,
    segmentBar: segmentBar,
    columns: columns,
    bars: bars,
    fmt: fmt,
    pct: pct,
    pctStr: pctStr
  };
})();
