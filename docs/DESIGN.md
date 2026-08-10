# DESIGN.md — The Hometown Mortgage

**Direction:** Kansas City Editorial
**Thesis:** Josh's differentiator is *"we're not a 1-800 number like the big box lenders."* The current site looks exactly like one. This design must read as **a person in Kansas City**, not a national lending platform. Editorial, warm, human, unmistakably local.

---

## Personality tokens
`warm` · `considered` · `plainspoken`

**Anti-examples — never:** corporate SaaS, fintech neon, glassmorphism, dark-mode-by-default, purple/blue gradients, 3D blobs, floating abstract shapes, golden-hour stock couples, centered-everything hero, three-icon-card row, carousel testimonials.

---

## Typography

| Role | Family | Notes |
|---|---|---|
| Display | **Fraunces** (variable) | `opsz` + soft/wonk axes. Warm editorial serif. Headlines only. |
| Body / UI | **IBM Plex Sans** | Humanist, institutional-but-warm. Never Inter, never Roboto. |
| Numerals | **IBM Plex Mono** | All money, rates, percentages, NMLS numbers. `font-variant-numeric: tabular-nums`. |

**Type scale** (1.25 minor third, clamped fluid):
`72 / 56 / 40 / 30 / 24 / 20 / 17 / 15 / 13`

- Body copy: 17px / 1.65, max measure **68ch**
- Display: weight 400–500 only. **Never bold a serif display** — size creates hierarchy, not weight.
- Letter-spacing: display `-0.02em`; all-caps labels `+0.10em`

## Color

Semantic roles only — no decorative color anywhere.

```
--paper        #F7F4EF   warm off-white, page base
--paper-sunk   #EFEAE1   recessed panels
--ink          #17130F   primary text
--ink-muted    #5A5148   secondary text
--ink-faint    #8A8076   tertiary / captions
--rule         #DDD5C9   hairlines, borders
--brick        #9E2B25   THE accent. CTAs, active states, key figures.
--brick-deep   #7A1F1B   hover
--brass        #A67C34   hairline details + small marks ONLY. Never a fill.
--positive     #2F6B4F   qualifying / success
```

**Rules:**
- 90% of every screen is `paper` + `ink`. Brick appears **3–5 times per viewport, maximum**.
- Brass is a *detail* color: rules, small marks, underlines. Never a button, never a background.
- **No gradients. No colored shadows. No glows.**
- Contrast floor: WCAG AA (4.5:1 body, 3:1 large).

## Spacing & shape

- Base unit **4px**. All spacing is a multiple of 4. Section rhythm: 96 / 128 / 160.
- **Radius: 2px.** Buttons, inputs, cards. That's it. No pills, no 16px cards.
- **Borders over shadows.** 1px `--rule` hairlines carry structure.
- Exactly one shadow token, used only for genuinely floating UI (sticky bar):
  `0 1px 2px rgb(23 19 15 / 0.06), 0 8px 24px rgb(23 19 15 / 0.06)`

## Layout

**Forbidden:** full-bleed centered hero with centered subhead + centered button; three-equal-icon-card row; testimonial carousel; symmetric everything.

**Required instead:**
- 12-column grid, **asymmetric** placement. Content sits off-center deliberately.
- A persistent **left ledger rail** (desktop ≥1024px) — section index + NMLS + phone, scrolls with the page. This is the signature element.
- Left-aligned hero, type-led. No hero photograph competing with the headline.
- Section headers use a small brass rule + all-caps label above the display line.

## Motion

- Durations: 160ms (state) / 320ms (reveal). Easing: `cubic-bezier(0.2, 0, 0, 1)`.
- Reveal = opacity + 8px translate. **Nothing scales, nothing bounces, nothing slides in from off-screen.**
- Every reveal respects `prefers-reduced-motion`.
- Hover on interactive elements only, and it must communicate state — not decoration.

## Imagery

- **No stock photography.** Ever.
- Real photography of Josh + Kansas City only. Until supplied: an explicit, labeled placeholder frame at the exact final aspect ratio — never a generated or stand-in likeness of a real person.
- Any illustration is flat, 1px linework in `--rule`/`--brass`. No 3D, no gradients.

## Copy rules

- Ban list: "best-in-class", "seamless", "cutting-edge", "empower", "solutions", "journey", "unlock", "elevate", and any hedge ("may help", "can potentially").
- Every claim must be **specific and falsifiable**. "We answer the phone" beats "best-in-class service".
- First person singular where Josh is speaking. Never mix "I" and "we" in the same block.
- Numbers are always concrete and set in Plex Mono.

## Accessibility floor (non-negotiable)

WCAG 2.2 AA · visible focus rings on every interactive element · full keyboard operability · one `<h1>` per page · sequential heading order · alt text on every image · `prefers-reduced-motion` honored · form inputs with real `<label>`s and programmatic error association.

## Performance budget

| Metric | Budget |
|---|---|
| LCP (mobile) | < 2.0s |
| CLS | < 0.05 |
| Total JS (gzipped) | < 100 KB |
| Fonts | ≤ 3 files, `display: swap`, preloaded, subset latin |
| Images | AVIF/WebP, responsive `srcset`, lazy below fold |

*(Baseline to beat — current site: LCP 11.0s, Performance 58.)*

## Changelog
- 2026-08-03: Initial system locked. Direction: Kansas City Editorial.
