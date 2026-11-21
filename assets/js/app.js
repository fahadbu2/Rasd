/* ============================================================
   RASD — Research Presentation — App shell
   Vanilla JS. Works flawlessly from file:// with no network.
   ============================================================ */
(function () {
  'use strict';

  var LANG_KEY = 'rasd-research-lang';

  function getLang() {
    try {
      var v = localStorage.getItem(LANG_KEY);
      if (v === 'ar' || v === 'en') return v;
    } catch (e) {}
    return 'ar';
  }

  function applyLang(lang) {
    var html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar' ? 'رَصد — عرض الدراسة البحثية' : 'RASD — Research Presentation';

    // data-ar / data-en hold full innerHTML (plain text or inline markup)
    var els = document.querySelectorAll('[data-ar],[data-en]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var txt = el.getAttribute('data-' + lang);
      if (txt === null || txt === '') txt = el.getAttribute('data-' + (lang === 'ar' ? 'en' : 'ar'));
      if (txt !== null && txt !== '') {
        el.innerHTML = txt;
      }
      var al = el.getAttribute('data-' + lang + '-aria');
      if (al && al.trim()) el.setAttribute('aria-label', al);
    }

    // lang toggle buttons
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

    // re-render dynamic content in the new language
    if (typeof rerenderExplore === 'function') rerenderExplore();
    if (typeof rerenderRender === 'function') rerenderRender();
  }

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.dataset.lang);
    });
  });

  // ---------- language bootstrap ----------
  applyLang(getLang());

})();
