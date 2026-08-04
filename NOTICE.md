# Third-party assets

## `public/media/kansas-sunflowers.mp4` and `-poster.jpg`

**Status: placeholder. License NOT verified. Do not ship to production as-is.**

- **Source:** Mixkit (`assets.mixkit.co/videos/4881`), downloaded 2026-08-03.
- **Transcoded** locally to a 10s silent loop, 1280×720, H.264 CRF 32
  (7.4MB → 676KB) plus a 640px poster frame.
- **Why this clip:** sunflowers are the Kansas state emblem, so it reads as
  regionally specific rather than as generic stock. It is rendered heavily
  desaturated at ~26% opacity behind the hero type — texture, not photography.

**The problem:** Mixkit's Free License terms could not be read
programmatically (the license text is behind a JS modal and a consent wall), so
the permitted-use terms have **not** been confirmed. Mixkit also serves some
clips under a *Restricted* license rather than the Free one, and it is not
established which applies here.

**Before launch, do one of:**

1. Read the Mixkit Free License at <https://mixkit.co/license/>, confirm this
   clip is covered, and record that here; or
2. Replace it with properly licensed footage; or
3. **Preferred —** replace it with real Kansas City footage. Thirty seconds shot
   on a phone would be more truthful than any stock clip and removes the
   licensing question entirely.

Related caution: several "free" stock-video listings encountered while sourcing
this (notably Coverr's neighbourhood category) were **iStock affiliate
placements**, not free assets. Verify the actual host before downloading.

## Fonts

Fraunces, IBM Plex Sans, and IBM Plex Mono — all SIL Open Font License, served
self-hosted via `next/font/google`.

## Client content

Business name, loan-officer details, NMLS numbers, and testimonials are
reproduced from the live site <https://thehometownmortgage.com> for the purpose
of demonstrating a redesign. They remain the property of that business. See the
README — this project is unaffiliated and unendorsed.
