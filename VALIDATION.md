# RASD Research Presentation — Validation Report

Date: 2026-11-21  ·  Final build  ·  Browsers: Chromium (Playwright) desktop / tablet / mobile

## 1. Verification summary

| # | Test | Result | Detail |
|---|------|--------|--------|
| 1 | Data-vs-source accuracy | **PASS** | Aggregates rebuilt from RASD_Combined_250_Records.pdf; n=250; non-empty region×age×month cells: 45/72; all single-choice sums = 250 (hazards/procedures/alert/clarity/likelihood/techImp). Multi-list sums: challenges 597, info 1177, features 1137, factors 1152 (expected >250). |
| 2 | Offline-disconnect | **PASS** | Full site loaded with network severed. **Zero external requests** observed; no network requests from `data.js`, `app.js`, `render.js`, `explore.js`, fonts, or CSS. |
| 3 | Filter-without-reload | **PASS** | Region/age/month chips render, combine, replace KPIs and charts instantly. Reset button restores the full sample. Active-filter pill row shows removal buttons. Empty state displays for 0-match combos (e.g. Tabuk + 45+). |
| 4 | Desktop viewport | **PASS** | 1440×900 RTL and LTR renders via desktop screenshots; no console errors. |
| 5 | Tablet viewport | **PASS** | 820×1100 renders; no horizontal overflow (desktop/tablet/mobile all 0px overflow). |
| 6 | Mobile viewport | **PASS** | 375×812 renders; 0px horizontal overflow; hero, sample, findings, figures, explore, reports all readable. |
| 7 | Report download test | **PASS** | HTTP 200 + correct byte sizes for all 4 approved PDFs (Findings_AR 385,319 B; Findings_EN 336,957 B; Evidence_AR 452,091 B; Evidence_EN 388,591 B). Files served only from the 4 approved paths; byte-identical to originals (sha256-verified). |
| 8 | Language toggle | **PASS** | AR → EN toggle re-renders all static text, findings, sample, figures, explore, reports (no reload). EN → AR is reversed. |
| 9 | Small-sample protection | **PASS** | Bars with n < 20 (e.g. Riyadh + 25–34, n=5) show counts only — percentages are suppressed (rendered as —). |
| 10 | Multi-select explainability | **PASS** | Q7, Q10, Q14 (multi-select) show the "multi-select — bar totals exceed 100%" note on every static chart and on each explore chart. |
| 11 | Original file integrity | **PASS** | All 4 PDF copies in `assets/reports/` are sha256-identical to `uploads/` originals. Original PDFs were not modified or re-generated. |

## 2. Small-sample edge cases

- Tabuk + 45+ → 0 matching responses → empty state shown, no charts hidden, reset enabled.
- Makkah + 25–34 → 9 responses → charts visible, ages show counts only (n<20).
- Makkah + Under 18 → 27 responses → bars visible with percentages (n≥20).

## 2b. Charts — shape diversity (per the brief's "diverse in appropriate shapes")

| Chart | Where | Shape |
|-------|-------|--------|
| Donut | sample regions, explore regions, viz-q5 | SVG donut with center label + legend |
| Segmented 100% bar | sample ages, viz-q13, chart-q13 | HTML/CSS flex segments with captions |
| Vertical columns | viz-q3, viz-q4, viz-q6 | HTML/CSS column chart with value/percent/label |
| Radial gauge | all 8 findings cards | SVG ring (no center text — value in body) |
| Horizontal bars | viz-q7, viz-q10, chart-q3/q4/q5/q6/q7/q14 (explore) | existing `.bar-row` design |
| KPIs | KPI strip | large-value cards |

All chart types render in RTL (Arabic) and LTR (English) via direction-aware flexbox/grid and SVG coordinates.

## 3. Approved Evidence-report vs. raw aggregates

Two fields differ between the raw dataset aggregates and the approved Evidence report.
The presentation shows the Evidence value as the approved headline figure and explicitly shows the raw
aggregate as a footnote for transparency. Read `DISCREPANCIES.md` for the exact figures.

| Field | Approved Evidence | Raw aggregate | Presentation shows |
|-------|-------------------|---------------|-------------------|
| Q4 procedures | 92/43/38/58/19 | 92/74/49/28/7 | Evidence + raw footnote |
| Q7 challenges | 172/115/98/69/46/30 | 179/124/101/83/46/37/27 | Evidence (6 bars + 7th excluded) + raw footnote |
| Q11 importance | 211 (84.4%) | 212 (84.8%) | Evidence (211, 84.4%) + raw footnote |

## 4. Confirmed exact-source numbers

### Composition
- Total responses: **250**
- Period: **2026-10-20 → 2026-11-20** · Mean completion time **2:47**
- Regions: Makkah 81 · Riyadh 60 · Eastern 31 · Hail 24 · Qassim 14 · Madinah 12 · Baha 11 · Asir 9 · Tabuk 8
- Age groups: Under 18 = 100 (40.0%) · 18–28 = 116 (46.4%) · 25–34 = 20 (8.0%) · 45+ = 14 (5.6%)
- Under-28 share: **86.4%** (216/250)

### Q3 Risk knowledge (Evidence)
| Level | n | % |
|-------|---|---|
| Very high | 32 | 12.8% |
| High | 82 | 32.8% |
| Medium | 62 | 24.8% |
| Limited | 58 | 23.2% |
| None | 16 | 6.4% |

High + Very high = **114 (45.6%)** · Limited + None = **74 (29.6%)**

### Q5 Alert (Evidence)
- Yes = 178 (71.2%) · Don't recall = 48 (19.2%) · No = 24 (9.6%)

### Q6 Clarity (Evidence)
- Very clear = 102 (40.8%) · Clear = 44 (17.6%) · Medium = 59 (23.6%) · Unclear = 14 (5.6%) · Never viewed = 31 (12.4%)

### Q7 Challenges (Evidence) — multi-select
| Item | n | % |
|------|---|---|
| Locating affected areas | 172 | 68.8% |
| Not knowing hazard level | 115 | 46.0% |
| Multiple sources | 98 | 39.2% |
| No continuous updates | 69 | 27.6% |
| Not knowing procedures | 46 | 18.4% |
| Late alerts | 30 | 12.0% |

### Q8/Q9/Q11 (Evidence)
- Early warning = 240/250 **96.0%**
- Single source = 238/250 **95.2%**
- Smart tech = 211/250 **84.4%**

### Q10 Alert content (Evidence) — multi-select
- Level = 201 (80.4%) · Location map = 183 (73.2%) · Action = 168 (67.2%) · Type = 143 (57.2%)

### Q13 Adoption intent (Evidence)
- Very high = 146 (58.4%) · High = 78 (31.2%) · Medium = 26 (10.4%)
- High + Very high = **224 (89.6%)**

### Q14 Drivers (Evidence) — multi-select
- Ease = 230 (92.0%) · Reliability = 198 (79.2%) · Real-time = 155 (62.0%) · Instant alerts = 131 (52.4%)

## 5. How to verify locally

```bash
cd rasd-research
python3 -m http.server 8080   # or: open index.html
# In your browser: open http://localhost:8080
```

To re-generate aggregates from the original dataset:
```bash
python3 scripts/build_aggregates.py
```

All 4 PDFs (Findings_AR, Findings_EN, Evidence_AR, Evidence_EN) are byte-identical to the originals in `uploads/` (sha256-verified).
