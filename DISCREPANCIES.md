# Unresolved Discrepancies — RASD Research Presentation

These are the figures where two different authoritative sources disagree. They are **not silently resolved** —
the presentation uses the approved Evidence/Findings figures as the headline and shows the raw aggregate as a footnote for transparency. Until the user confirms which source is authoritative, the presentation
marks the two as "Evidence-confirmed" with the raw aggregate shown beside it for transparency.

## 1. Q4 — Procedures / Preventive knowledge (CRITICAL — affects headline numbers)

| Source | 1 Very high | 2 High | 3 Medium | 4 Limited | 5 None |
|--------|-------------|--------|----------|-----------|--------|
| Raw aggregate (`aggregates.json`) | 92 | 74 | 49 | 28 | 7 |
| **Approved Evidence report** | **92** | **43** | **38** | **58** | **19** |

- Source of difference: raw aggregate was computed from a different extraction path than the approved
  report. Both are valid readings of related fields, but **the Evidence report was approved as the presentation
  source of truth**, so Q4 charts display 92/43/38/58/19. The raw aggregate is still used for filtering.

## 2. Q7 — Challenges (multi-select)

| Source | 1 Locating | 2 Hazard level | 3 Sources | 4 Updates | 5 Procedures | 6 Late alerts | 7 No expectation |
|--------|------------|---------------|-----------|-----------|--------------|---------------|---------------|
| Raw aggregate | 179 | 124 | 101 | 83 | 46 | 37 | 27 |
| **Approved Evidence report** | **172** | **115** | **98** | **69** | **46** | **30** | (not in Evidence) |

- Source of difference: Evidence lists only 6 of 7 challenges (the 7th "no expectation of facing challenges"
  is absent). Presentation shows 6 bars with Evidence values; the 7th row is excluded and explicitly flagged as
  "not in Evidence report (excluded)". Raw aggregate remains for filtering.

## 3. Q11 — Importance of smart technology

| Source | n | % |
|--------|---|---|
| Raw aggregate | 212/250 | 84.8% |
| **Approved Evidence report** | **211/250** | **84.4%** |

- Presentation shows 211 (84.4%) as the approved figure. See VALIDATION.md.

## 4. Challenges — raw aggregate on Q11 (features/factors)

- The raw aggregates for Q8 (challenges/info) are as follows, with the multi-list totals shown:
  challenges 597 / info 1177 / features 1137 / factors 1152. These do not match the Evidence report notes
  (which describe only partial sub-counts), and are NOT referenced in VALIDATION.md's approved summary.
  They are retained for the explore filter only.

## What was deliberately NOT done

- The raw aggregate values are NOT silently substituted in the presentation sections.
- Any figure that cannot be reconciled with the approved report is explicitly flagged.
- The approved Evidence report is shown as the presentation source, except where evidence conflicts
  with the dataset (e.g. Q4). The raw values are preserved in aggregates.json for filtering.
- The 7th challenge ("no expectation of facing challenges") is shown explicitly excluded, not hidden.
