# RASD — Research Presentation

A fully offline, evidence-driven research presentation for RASD (رَصد) — built from the original 250-response survey
study, designed to **explain the evidence behind the project**, not to re-create the Project Showcase.

> **Status key**: every figure in the site is either (a) a count taken directly from the verified dataset, or
> (b) a figure from the approved Evidence/Findings reports. Where the two differ, the site shows the approved
> Evidence report value and flags the discrepancy in `VALIDATION.md`. Nothing is invented.

## What this is

An independent, offline-capable research presentation site — distinct from the RASD Project Showcase
(`https://fahadcs6.github.io/Rasd/`) and the RASD operational platform. It presents the 250-response RASD survey
study **without rebuilding it or any other RASD artifact**.

- **Design**: original bilingual (Arabic RTL / English LTR), built strictly on the approved RASD design system
  (tokens, Plex Sans/Arabic, dark glass idioms — see original files under `assets/`).
- **Offline**: zero CDN, zero external stylesheet/script, zero font download, zero tracking, zero telemetry.
  Open `index.html` directly from disk — no server required.
- **Data**: aggregates only (n=250). No response-level records, no PII, no raw datasets shipped.
- **No QR codes** (explicitly forbidden), no auth, no backend, no external API.

## Sections

| # | Section | Source |
|---|---------|--------|
| 01 | Study Overview | Survey methodology + dataset metadata |
| 02 | Participants & Sample | 250 real responses; donut + segmented bar + mini stats |
| 03 | Key Findings | 8 strongest verified findings — ring-gauge cards (Evidence values) |
| 04 | Data Visualisations | Full-sample charts — columns (Q3/Q4/Q6), donut (Q5), segments (Q13), bars (Q7/Q10); Evidence values for Q4/Q7 |
| 05 | Interactive Explore | Live filters (region/age/month); donut (regions), segments (ages/intent), bars (rest); small-sample protection; empty state |
| 06 | Research Reports | Four approved reports — Findings + Evidence, Arabic + English — downloadable only |

## Running

No install, no build step:

```bash
cd rasd-research
open index.html        # macOS
# or
xdg-open index.html    # Linux
# or any static server:
python3 -m http.server
```

The site must be served over plain `http(s)://` or `file://`. It does NOT need a backend, a build step,
or a CDN.

## Components

```
rasd-research/
├── index.html                 # single entry page
├── assets/
│   ├── css/
│   │   ├── fonts.css          # @font-face rules (4 bundled woff2 files)
│   │   └── site.css           # design system + layout (RTL-aware)
│   ├── data/aggregates.json   # precomputed aggregates (no individual responses)
│   ├── fonts/                 # Plex Sans 400/600 + Plex Arabic 400/700 (woff2, bundled)
│   ├── img/logo.svg           # RASD mark (favicon)
│   ├── js/
│   │   ├── data.js            # precomputed aggregates inlined (offline payload)
│   │   ├── charts.js          # chart primitives: donut, gauge, columns, segments, bars
│   │   ├── app.js             # i18n + sticky-nav highlighting
│   │   ├── render.js          # static full-sample renders (sample, figures, findings)
│   │   └── explore.js         # live explore filter engine
│   └── reports/               # four approved reports (byte-identical copies)
│       ├── RASD_Findings_AR.pdf   (385 KB)
│       ├── RASD_Findings_EN.pdf   (337 KB)
│       ├── RASD_Evidence_AR.pdf   (452 KB)
│       └── RASD_Evidence_EN.pdf   (389 KB)
├── scripts/
│   └── build_aggregates.py    # re-generates aggregates.json + data.js from RASD_Combined_250_Records.pdf
├── evidence/screenshots/      # desktop / tablet / mobile / EN screenshots
├── README.md                  # this file
├── VALIDATION.md              # data-vs-source + offline + filter + viewport + download test results
└── DISCREPANCIES.md           # unresolved discrepancies between raw aggregates and approved reports
```

## Language & RTL

Arabic is the default. Toggle Arabic ↔ English (topbar). All static text carries `data-ar`/`data-en` attributes
and is swapped in place via innerHTML — no full page reload. Multi-select question bars are labeled with a
"multi-select — totals exceed 100%" note.

## Privacy

- **No individual records** — aggregates only (n=250, ≤72 cells, all region×age×month combination rows).
- **No PII** — respondents are anonymous; no names, emails, coordinates, IDs.
- **No raw datasets** — the `RASD_Combined_250_Records.pdf` original is never copied into the site.
- **The approved reports** are byte-identical copies of the original PDFs and are not regenerated.
  (Findings + Evidence, AR + EN — 4 files.)

## Building the aggregates

```bash
python3 scripts/build_aggregates.py
```

Produces `assets/data/aggregates.json` + `assets/js/data.js` from
`uploads/RASD_Combined_250_Records.pdf`. Aggregates include per-cell counts (so the explore filter section
can re-aggregate without response-level data). See `VALIDATION.md` for verification details.

## Language note

Default `lang="ar"` and `dir="rtl"` (RTL). English toggle re-renders all content (static + dynamic) without reload.

## What this presentation does NOT contain

- No rebuilt Project Showcase, no operational platform.
- No QR codes (explicitly forbidden by the brief).
- No fabricated findings, no causal claims, no market/adoption forecasts.
- No unapproved report files (Methodology, Guide and dataset xlsx/CSV are **not** exposed).
- The approved reports (Findings + Evidence, AR + EN — 4 files) are byte-identical copies of the original PDFs.
