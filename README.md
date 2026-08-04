# Hometown Mortgage — concept demo

> **This is an unaffiliated design concept. It is not the official website of
> The Hometown Mortgage, Josh Pennebaker, or any lender, and it is not endorsed
> by or affiliated with them.**
>
> The real site is <https://thehometownmortgage.com>. This build exists solely
> to demonstrate a proposed redesign, has not been reviewed or approved by the
> business, and must not be used to apply for or obtain a mortgage.
>
> Every page is served `noindex, nofollow` and `robots.txt` disallows all
> crawlers. Do not remove either until the client approves the work and it moves
> to the production domain.

## What this is

A rebuild of a Kansas City mortgage broker's marketing site, used to pitch a
redesign. Direction is **"Kansas City Editorial"** — the design system is locked
in [`../docs/DESIGN.md`](../docs/DESIGN.md); do not introduce colours, radii, or
shadows outside it.

Background reading:

- [`../docs/AUDIT.md`](../docs/AUDIT.md) — audit of the current live site
- [`../docs/DESIGN.md`](../docs/DESIGN.md) — the locked design system
- [`../docs/SPACING-AUDIT.md`](../docs/SPACING-AUDIT.md) — spacing/rhythm audit

## Stack

Next.js 16.3 (Turbopack) · React 19.2 · Tailwind 4 · TypeScript. Statically
exported (`output: "export"`) — no server runtime.

**No animation library.** All motion is CSS transitions plus IntersectionObserver.
An earlier pass used `motion` + `lenis`; it cost 49KB of JS and pushed Total
Blocking Time from 100ms to 660ms (Lighthouse 95 → 76) for effects CSS does
natively. If you are tempted to add one back, measure first.

## Measured results

Lighthouse, mobile, throttled, against a production build:

| | Live site | This build |
|---|---|---|
| Performance | 58 | **95** |
| Largest Contentful Paint | 11.0s | **2.7–3.0s** |
| Total Blocking Time | 420ms | **40ms** |
| Accessibility | 91 | **100** |
| Best Practices | 96 | **100** |
| SEO | 85 | **100** |

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
```

## Rules worth keeping

1. **Never animate above-the-fold content.** Anything starting at `opacity: 0`
   or translated cannot paint until hydration. The hero passes `immediate` to
   `LineReveal` for exactly this reason — ignoring it cost ~0.5s of LCP.
2. **`--color-ink-faint` may not be lightened.** It is 5.05:1 on `paper-sunk`;
   the 12px eyebrow gets no WCAG large-text exemption.
3. **All figures use `.tnum`** (IBM Plex Mono, tabular numerals).
4. Mortgage maths lives in `lib/mortgage.ts` and is kept pure so it can be
   tested without a DOM.

## Placeholders — must be resolved before launch

Everything unverified is isolated in [`site.config.ts`](./site.config.ts) and
marked `NEEDS_CONFIRMATION`.

- **Sponsoring lender.** The live site currently discloses *two different*
  lenders — Canopy Mortgage in the footer and logo, Bayshore Mortgage Funding in
  the "Apply Now" flow. This build defaults to Bayshore because that is where the
  live application terminates. Confirm the correct entity, and confirm the
  required disclosure language with the brokerage's compliance officer.
- **Josh's headshot.** A labelled placeholder frame at the final 4:5 aspect. No
  likeness of a real person has been generated.
- **The lead form does not submit anywhere.** It logs locally. Wire it to a real
  CRM/ESP before launch — do not ship a form that silently drops leads.
- **Testimonials** are reproduced from the live site and should be re-verified
  (and permission confirmed) before publication.
- Licensed states, email address, and service areas are assumptions.

See [`NOTICE.md`](./NOTICE.md) for third-party asset provenance.
