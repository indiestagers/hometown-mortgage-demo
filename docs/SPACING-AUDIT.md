# SPACING-AUDIT.md — The Hometown Mortgage

**Scope:** read-only spacing / rhythm / type-scale audit against `docs/DESIGN.md`.
**Method:** static extraction from `app/page.tsx`, `app/globals.css`, `components/*.tsx`, plus live measurement of the running dev server at `http://localhost:3000` (responded 200; no server was started by this audit). Measured at **1440×900**, **1600×900**, and **390×844**, DPR 1.
**Date:** 2026-08-03. No files in `web/` were modified.

---

## 0. The one-sentence answer to "spaces are off"

**The section rhythm numbers from DESIGN.md (96 / 128 / 160) were applied as *per-side padding* instead of as the *distance between sections*, so every gap on the page renders at double the intended value.** Measured inter-section whitespace is **224px at 1440px** (112 top + 112 bottom) and **160px at 390px** (80 + 80) — 224px exceeds the largest sanctioned rhythm step by 40%. Three secondary bugs stack on top of it: a **289px void above the footer**, a **230px void below the sticky header after every ledger-rail anchor jump**, and **427–625px of dead right column** in four full-width sections. Together those are the "off" spaces.

---

## 1. Prioritized defect table

Ranked by visual impact, most severe first. All px values are **measured rendered values** unless marked *(source)*.

| # | File:line | Current | Measured effect | Problem | Recommended |
|---|---|---|---|---|---|
| **1** | `app/page.tsx:103, 188, 246, 297, 330, 375, 419` — all seven `<Section className="py-20 md:py-28">` | `py-20 md:py-28` = 80 / **112px per side** | Inter-section gap **224px** @1440 (measured: hero→thesis 655→879; thesis→programs 1406→1630; programs→estimate 2657→2881; estimate→process 3694→3918; process→reviews 4410→4642; reviews→area 5396→5621; area→start 5904→6128). **160px** @390. | DESIGN.md §Spacing mandates section rhythm **96/128/160** as the rhythm, not as one side of it. Two adjacent sections each contributing 112px produce 224px — off the sanctioned scale entirely. This is the single largest source of the "dead space" complaint. | `py-12 md:py-16` (48 / 64 per side) → **96px mobile / 128px desktop** gaps, both on-scale. |
| **2** | `components/Chrome.tsx:45` `mt-32 … py-14` | `mt-32` = 128px margin + `py-14` = 56px padding, stacked on the preceding `pb-28` = 112px | **289px** of unbroken empty paper between the last body ink (y 6632) and the first footer ink (y 6921) @1440. **257px** @390. Largest single void on the page. | Three spacing sources compound: section bottom padding + footer top margin + footer top padding. The footer's `border-t` visually lands 232px after the last content. | Drop `mt-32` entirely (the `border-t` + `bg-paper-sunk` already mark the boundary); use `py-16` (64). Result: 64 (section pb) + 64 (footer pt) = **128px**, on-scale. |
| **3** | `components/primitives.tsx:68` `scroll-mt-24` **and** `app/globals.css:36` `scroll-padding-top: 96px` | Both = 96px, and **both apply** | Verified by `scrollIntoView` to `#programs`: section top lands **192px** below viewport top; its eyebrow lands at **312px**. Sticky header is only **82px** tall → **230px of blank paper below the header** after every ledger-rail click. | `scroll-margin-top` (on the target) and `scroll-padding-top` (on the scroll container) are additive. Neither value matches the 82px header. The ledger rail is the primary nav, so this is the most *frequently seen* spacing defect. | Delete `scroll-mt-24` from `Section` (primitives.tsx:68). Keep `scroll-padding-top: 96px` only. With fix #1 the eyebrow then lands 160px down — 78px below the header. |
| **4** | `app/page.tsx:40` `pt-20 pb-24 md:pt-24 md:pb-28` | Hero pt = **96px**, every other section pt = **112px**; hero pb = 96/112 | Measured `sectionTop → eyebrowTop`: hero **96px**, all seven others **120px** (112 padding + 8px reveal offset baseline). | The hero uses a bespoke four-value padding string that no other section uses. The first section reads 16px tighter at the top than every section below it — a subtle but real "the top doesn't match" signal. | One rule for all sections. Hero: `pt-16 pb-12 md:pt-20 md:pb-16`. No section should carry a four-value padding override. |
| **5** | `app/page.tsx:198, 256` (`measure` intro `<p>`) inside full-width sections `programs`, `estimate`; also `process` (`page.tsx:302`) and `reviews` (`page.tsx:335`) headings | `.measure` = `max-width: 68ch` → **693.6px** rendered | Content column is **1121px** @1440. Empty right column: **programs 427px**, **estimate 427px**, **process 561px**, **reviews 499px**, **area 625px**, **start 560/623px**. | The 68ch measure is correct per DESIGN.md — the failure is that these sections are *not columnar*. A 694px text block sits in a 1121px full-bleed container with nothing to its right, so 38–56% of every section header band is empty. This is the horizontal half of "spaces are off." | Either (a) put these headers in the same asymmetric grid the `thesis`/`area`/`start` sections use, so the right column carries a fact, rule, or figure, or (b) constrain the header band to a declared `lg:grid-cols-[1fr_320px]` and let the right column stay deliberately empty with a hairline — an intentional void reads differently from an accidental one. Do not simply widen the measure past 68ch. |
| **6** | `app/page.tsx:54` `mt-7`, `:115` `mt-7` **vs** `:198, 256, 387, 431` `mt-6` | 28px vs 24px | Measured `h→body` gap: hero **28**, thesis **28**, programs **24**, estimate **24**, area **24**, start **24**. | The same optical slot (display heading → body copy) uses two different values across the page. Eyebrow→heading is correctly **24px everywhere** (measured 24 × 8 sections), which makes the 28/24 split more conspicuous, not less. | Pick one. `mt-6` (24px) everywhere, matching the eyebrow→heading gap; change `page.tsx:54` and `:115` to `mt-6`. |
| **7** | `app/page.tsx:205, 308, 341` `mt-14` **vs** `:263, 341→358` `mt-12` | 56px vs 48px | Header-stack → content-block gap: programs `mt-14` (56), process `mt-14` (56), reviews `mt-14` (56), **estimate `mt-12` (48)**. Then reviews' trailing link uses `mt-12` (48). | Same slot, two values, and the estimator — the heaviest module on the page — is the odd one out. | `mt-12` (48px) for all four. 56 is not on the proposed scale (see §2). |
| **8** | `components/Estimator.tsx:57, 162` `p-7 md:p-9`; `components/StartForm.tsx:96` `p-7 md:p-9`; `:70` `p-8 md:p-10`; `app/page.tsx:312` `p-7`; `:401, 406` `px-4 py-4`; `:208` `py-9` | 28 / 36 / 32 / 40 / 16px | Four distinct card paddings and two distinct 1px-gap-grid cell paddings coexist. `Process` cells (`p-7` = 28) and `Area` cells (`py-4 px-4` = 16) use the **identical** `gap-px border bg-rule` construction with a 12px difference in padding. | Card interiors have no single token. 28 and 36 are multiples of 4 but sit off any coherent doubling scale. | Cards: `p-6 md:p-8` (24/32). Grid cells in the `gap-px` pattern: `p-6` (24) for both `Process` and `Area`. Programs rows: `py-8` (32). |
| **9** | `app/page.tsx:85` `py-4` **vs** `components/Estimator.tsx:179` `py-2.5` | 16px vs **10px** | Two bordered `<dl>` ledgers — the hero facts list and the estimator breakdown — use the same visual construct (hairline `border-b`, baseline-aligned dt/dd) with row padding differing by 6px. | Same component pattern, two row heights. Also `py-2.5` = 10px is off the 4px grid (see #10). | `py-3` (12px) for the estimator rows, `py-4` (16px) for the hero rows if a deliberate density difference is wanted — but pick from the scale, not 10. |
| **10** | 14 occurrences of `.5` spacing steps (list below) | 2 / 6 / 10 / 14px | Off the mandated 4px grid — `.5` steps resolve to **2px** multiples. | DESIGN.md §Spacing: "Base unit 4px. **All** spacing is a multiple of 4." These are 2px-grid values. | Round each to the nearest scale step (mapping in §2.3). |
| **11** | `app/globals.css:99` `.eyebrow { font-size: 12px }` + 10 × `text-[12px]`, 21 × `text-[14px]` | 12px, 14px | Two of the three most-used text sizes on the page are **not on the mandated type scale**. | DESIGN.md scale is `72/56/40/30/24/20/17/15/13`. There is no 12 and no 14. The page is effectively running a 12/13/14/15 quadruple where the system allows only 13/15 — four near-identical sizes make surrounding gaps read as uneven even when they are numerically correct. | 12 → **13**, 14 → **15**. Full map in §3. |
| **12** | `components/Chrome.tsx:8` header inner `<div>` has no `mx-auto max-w-6xl` | Header spans full width; `Section` (primitives.tsx:70) and `Footer` (Chrome.tsx:46) both cap at `max-w-6xl` (1152px) | @1600: header inner spans l=224→r=1585 while all page content spans l=**329**→r=**1481**. Logo sits **65px left** of every heading; header CTA sits **64px right** of the content edge. Invisible at ≤1456px, wrong above it. | The header is the only top-level band not wrapped in the shared max-width container. | Wrap the header's flex row in `<div className="mx-auto max-w-6xl">`, matching `Section` and `Footer`. |
| **13** | `app/globals.css:113` `.measure { max-width: 68ch }` applied at `app/page.tsx:54` (19px) and `:115, 198, 256, 387, 431` (17px) | 68ch = **775.2px** at 19px, **693.6px** at 17px | The same class produces two different column widths — an 82px difference — depending on the font size of the element it lands on. | `ch` is font-size-relative, so "68ch" is not a single measure; the hero lede would be 12% wider than every other body block if its grid column did not happen to clip it at 608px. The constraint is currently inert in the hero. | Either set `.measure` to a fixed `max-width: 42rem` (672px) so all body columns match, or keep `ch` and stop varying body font size (see #14). |
| **14** | `app/page.tsx:54` `text-[19px]` on the hero lede | 19px vs 17px body base (`globals.css:56`) | Hero lede runs 19px/1.65; every other body paragraph runs 17px/1.65. | 19px is off the mandated scale (`…24/20/17/15/13`). Two body sizes 2px apart is a difference the reader registers as inconsistency rather than hierarchy. | `text-[20px]` (on-scale) — or drop the override and let it inherit 17px. |
| **15** | `app/page.tsx:48` `text-[clamp(2.75rem,5.5vw,4.25rem)]`; `:110, 193, 251, 302, 335, 382, 426` `text-[clamp(2rem,4.5vw,3rem)]` | h1 renders **44px** @390, **68px** @1440. h2 renders **32px** @390, **48px** @1440. | None of 32 / 44 / 48 / 68 is on the mandated scale. | A fluid `clamp()` renders *every* value between its endpoints — a locked type scale and unbounded fluid type are mutually exclusive. This is structural, not a typo. | Step at breakpoints instead of clamping: h1 `text-[40px] md:text-[56px] lg:text-[72px]`; h2 `text-[30px] md:text-[40px]`. All four values are on the mandated scale. |
| **16** | `app/page.tsx:344` `md:pt-12` stagger on odd testimonials | 48px | Deliberate editorial stagger, but it pushes the right column's bottom 48px past the left, so the section's bottom edge is ragged before a 112px `pb`. | Not a defect on its own — noted so it is not "fixed" by mistake, and so the ragged bottom is not misread as a rhythm break when #1 is corrected. | Keep. Once section padding drops to 64, verify the ragged bottom still reads as intentional. |

### 10a. Full list of off-4px-grid (`.5` step) values

| File:line | Class | px | → |
|---|---|---|---|
| `components/primitives.tsx:7` | `py-3.5` | **14** | `py-3` (12) or `py-4` (16) — affects **every button on the page** |
| `components/Chrome.tsx:9` | `gap-2.5` | 10 | `gap-2` (8) |
| `components/Chrome.tsx:24` | `py-2.5` | 10 | `py-3` (12) |
| `components/Chrome.tsx:33` | `py-2.5` | 10 | `py-3` (12) |
| `components/Chrome.tsx:71` | `space-y-1.5` | 6 | `space-y-2` (8) |
| `components/Chrome.tsx:84` | `space-y-1.5` | 6 | `space-y-2` (8) |
| `components/Chrome.tsx:196` | `mt-0.5` | 2 | `mt-1` (4) or optical nudge via `translate-y` |
| `components/LedgerRail.tsx:58` | `gap-2.5`, `py-1.5` | 10, 6 | `gap-3` (12), `py-2` (8) — note: `py-2` keeps the ≥24px WCAG 2.5.8 target (8+8+~17 line-box) |
| `components/Estimator.tsx:179` | `py-2.5` | 10 | `py-3` (12) |
| `components/Estimator.tsx:250` | `mt-2.5` | 10 | `mt-3` (12) |
| `components/Estimator.tsx:253` | `mt-1.5` | 6 | `mt-2` (8) |
| `components/StartForm.tsx:101` | `gap-1.5` | 6 | `gap-2` (8) |
| `components/StartForm.tsx:266` | `mt-1.5` | 6 | `mt-2` (8) |
| `app/page.tsx:224` | `space-y-2.5` | 10 | `space-y-3` (12) |
| `app/page.tsx:228` | `mt-2.5` | 10 | *optical bullet alignment — see note* |
| `app/page.tsx:315` | `mt-2.5` | 10 | `mt-3` (12) |

*Note on `page.tsx:228`:* `mt-2.5` centers a 1px brass dash against a 14px/1.5 line box. This is a legitimate **optical** alignment, not layout spacing. If it must stay off-grid, express it as `translate-y-[10px]` on a grid-aligned element so grep-based grid audits stay clean.

---

## 2. Proposed single spacing scale

### 2.1 The scale

Eleven steps, every one a multiple of 4, every step above 16 a doubling or a clean 1.5× — nothing else may appear in the codebase.

| Token | px | Tailwind | Use |
|---|---|---|---|
| `space-1` | 4 | `1` | icon↔label, hairline offsets |
| `space-2` | 8 | `2` | tight list rows, chip gaps |
| `space-3` | 12 | `3` | label→input, ledger row padding |
| `space-4` | 16 | `4` | control padding, small stack gaps |
| `space-6` | 24 | `6` | **the workhorse** — eyebrow→h, h→body, card padding, grid cells |
| `space-8` | 32 | `8` | card padding (desktop), form field groups |
| `space-12` | 48 | `12` | header-stack → content-block |
| `space-16` | 64 | `16` | section padding (desktop, per side) |
| `space-24` | 96 | `24` | **section rhythm — tight** |
| `space-32` | 128 | `32` | **section rhythm — default** |
| `space-40` | 160 | `40` | **section rhythm — chapter break** |

**Banned:** every `.5` step; and `5` (20), `7` (28), `9` (36), `10` (40), `14` (56), `20` (80), `28` (112) as *spacing* values. The current page uses **22 distinct spacing values**; the scale above is 11, and only 8 of them appear more than twice.

### 2.2 The section-rhythm rule

> **The rhythm token is the distance between two sections' ink, not one section's padding.**
> Every `<Section>` carries the *same* symmetric padding equal to **half** the target rhythm.

| Target gap | Section padding | Where |
|---|---|---|
| 96px (tight) | `py-12` | mobile default, all sections |
| 128px (default) | `md:py-16` | desktop default, all sections |
| 160px (chapter break) | `md:py-20` on **both** adjacent sections | reserved — currently nothing on this page needs it |

Corollaries, all currently violated:
1. **No section overrides the shared padding.** Delete the bespoke `pt-20 pb-24 md:pt-24 md:pb-28` on the hero (`page.tsx:40`); give it the standard `py-12 md:py-16` with a top-only exception of `pt-16 md:pt-20` to clear the 82px sticky header.
2. **No margin may bridge two sections.** `mt-32` on the footer (`Chrome.tsx:45`) must go; adjacency is a padding concern only.
3. **`scroll-padding-top` is the only anchor offset.** Delete `scroll-mt-24` (`primitives.tsx:68`).

Net effect at 1440px: inter-section gaps drop **224 → 128px** (−43%), the footer void drops **289 → 128px** (−56%), and the post-anchor void below the header drops **230 → 78px** (−66%). Estimated page height reduction ≈ **900px** of the 6,900px document.

### 2.3 Intra-section stack (apply identically in all 8 sections)

```
section padding-top          64        (md:py-16)
  eyebrow
  ↓ 24                                 (mt-6)  ← already correct everywhere
  h1 / h2
  ↓ 24                                 (mt-6)  ← fix page.tsx:54, :115 (currently 28)
  body paragraph (.measure)
  ↓ 48                                 (mt-12) ← fix page.tsx:205, 308, 341 (currently 56)
  content block (grid / list / module)
section padding-bottom       64
```

---

## 3. Reconciled type scale

DESIGN.md mandates `72 / 56 / 40 / 30 / 24 / 20 / 17 / 15 / 13`. Sizes in use and their mapping:

| In use | Count | On scale? | Where | → Map to |
|---|---|---|---|---|
| **68** | 1 (rendered) | ✗ | h1 @1440 (`page.tsx:48` clamp cap 4.25rem) | **72** (`lg:text-[72px]`) |
| **48** | 7 (rendered) | ✗ | all h2 @1440 (`page.tsx:110,193,251,302,335,382,426` clamp cap 3rem) | **40** (`md:text-[40px]`) |
| **44** | 2 | ✗ | h1 @390 (clamp floor 2.75rem); estimator total `Estimator.tsx:165` | **40** both |
| **32** | 7 (rendered) | ✗ | all h2 @390 (clamp floor 2rem) | **30** |
| **30** | 1 | ✓ | `StartForm.tsx:73` success heading | keep |
| **28** | 1 | ✗ | `page.tsx:210` program name h3 | **30** |
| **26** | 3 | ✗ | `page.tsx:442` phone; `StartForm.tsx:140, 211` | **24** |
| **22** | 1 | ✗ | `Chrome.tsx:49` footer wordmark | **24** |
| **21** | 3 | ✗ | `Chrome.tsx:10` header wordmark; `page.tsx:314` step h3; `page.tsx:346` testimonial quote | wordmark + step h3 → **20**; testimonial quote → **24** |
| **19** | 2 | ✗ | `page.tsx:54` hero lede; `page.tsx:87` hero fact key | **20** |
| **18** | 2 | ✗ | `Chrome.tsx:10` wordmark @mobile; `Chrome.tsx:63` footer phone | **17** and **20** respectively |
| **17** | base | ✓ | `globals.css:56` body | keep — the only body size |
| **15** | 7 | ✓ | buttons, links, inputs, slider values | keep |
| **14** | **21** | ✗ | body-adjacent small text throughout | **15** |
| **13** | 12 | ✓ | labels, captions, rail links | keep |
| **12** | **10** + `.eyebrow` | ✗ | eyebrow (`globals.css:99`), legal, notes, step counter | **13** |

**Resulting inventory: 72 / 40 / 30 / 24 / 20 / 17 / 15 / 13 — eight slots, all on the mandated scale.** (56 goes unused on this page; that is fine.)

Two structural notes:
1. **Drop the `clamp()`s.** Fluid clamps render every intermediate value, so a locked scale cannot survive them. Step at breakpoints: h1 `text-[40px] md:text-[56px] lg:text-[72px]`, h2 `text-[30px] md:text-[40px]`. This also removes 32/44/48/68 from the rendered page in one change.
2. **Collapsing 14→15 and 12→13 is the highest-leverage typographic fix** — 31 of 62 hardcoded sizes. Four sizes within a 3px band (12/13/14/15) is why spacing between them looks unequal even where the margins are identical: unequal line boxes produce unequal optical gaps from equal margins.

---

## 4. Horizontal rhythm — assessment

- **Left edge: consistent.** Ledger rail is 224px (`w-56`, `LedgerRail.tsx:46`) with `px-7` (28px, off the proposed scale — should be `px-6`/24 or `px-8`/32). Content starts at x=264 @1440 and x=329 @1600. Every section heading, eyebrow, and body block shares that left edge. **No defect.**
- **Right edge: breaks in the header only** at ≥1456px (defect #12). `max-w-6xl` (1152px) never binds at 1440 — content is viewport-constrained to 1121px there, which is why the misalignment is invisible on a 1440 laptop and obvious on a 27" display.
- **Right column: the real horizontal problem** (defect #5). Four of eight sections (`programs`, `estimate`, `process`, `reviews`) are single-column bands whose intro stack occupies 496–694px of a 1121px container, leaving **427–561px of unclaimed space**. Because `thesis`, `area`, and `start` *do* fill their right column with a figure / list / form, the page alternates between "deliberate asymmetry" and "the text just stopped" — which reads as inconsistency, not editorial intent.
- **Mobile (390px):** no horizontal overflow (`scrollWidth` 390 = `innerWidth`). `px-6` (24px) gutters throughout. **No defect.**

---

## 5. Optical consistency — measured

| Section | eyebrow→h | h→body | sectionTop→eyebrow | h size |
|---|---|---|---|---|
| hero | 24 | **28** | **96** | 68 |
| thesis | 24 | **28** | 120 | 48 |
| programs | 24 | 24 | 120 | 48 |
| estimate | 24 | 24 | 120 | 48 |
| process | 24 | n/a (158 to grid) | 120 | 48 |
| reviews | 24 | n/a (56 to quote) | 120 | 48 |
| area | 24 | 24 | 120 | 48 |
| start | 24 | 24 | 120 | 48 |

**eyebrow→heading is perfect** (24px × 8). The breaks are `h→body` (28 vs 24, defect #6) and `sectionTop→eyebrow` (96 vs 120, defect #4). Everything else in the header stack is already system-consistent — which is worth stating plainly, because the fix list is short and mechanical, not a redesign.

---

## 6. Fix order (highest impact per line changed)

1. **#1** — section padding, 7 lines in `page.tsx` + 1 in the hero. Removes ~700px of dead page height.
2. **#2** — footer `mt-32`, 1 line. Removes the single largest void.
3. **#3** — `scroll-mt-24`, 1 line. Fixes every anchor jump.
4. **#4, #6, #7** — hero padding + `mt-7`→`mt-6` + `mt-14`→`mt-12`, 6 lines. Makes all eight sections optically identical.
5. **#11 + #15** — `text-[14px]`→`15`, `text-[12px]`→`13`, drop clamps. 33 lines, mechanical, restores the mandated scale.
6. **#5** — right-column strategy. The only item requiring a layout decision rather than a value change.
7. **#8, #9, #10, #12, #13, #14** — cleanup.
