# The Hometown Mortgage — Technical & Design Audit

**Site:** https://thehometownmortgage.com/
**Audited:** 2026-08-03
**Client:** Josh Pennebaker, Branch Manager, NMLS #1737680 — Kansas City, KS

---

## 1. What the site actually is

| Attribute | Finding |
|---|---|
| CMS | WordPress 7.0.2 |
| Page builder | Elementor (+ Elementor HF, `ae_global_templates`) |
| CDN / host | Cloudflare (Kinsta — `ki-cf-cache-status` header) |
| Fonts | Mulish + Roboto (self-hosted via Elementor Google Fonts) |
| Tracking | Meta Pixel (PixelYourSite plugin), GA4 (`G-XE4YRSWEVR`) |
| Optimization | Asset CleanUp plugin (concatenated head/body bundles) |
| Built by | Media Ally (`yourmediaally.com`) |
| Total pages | 11 pages + 1 post |
| Homepage weight | 244 KB HTML, 19 images, 5,017px tall (desktop) |

### Page inventory
- `/` — homepage
- `/programs/` + 4 children: `conventional-loan`, `usda-loan`, `va-loans`, `fha-loan`
- `/purchase-calculator/`, `/refinance-calculator/`, `/affordability-calculator/`
- `/privacy-policy/`
- **`/sample-page/`** ← default WordPress page, live, HTTP 200, in sitemap
- **`/hello-world/`** ← default WordPress post, live, HTTP 200, in sitemap

---

## 2. Critical findings, ranked by business impact

### 🔴 P0 — Dual-lender identity conflict (compliance + credibility)

The site references **two different sponsoring lenders simultaneously**:

| Location | Entity |
|---|---|
| Logo lockup | "POWERED BY CANOPY MORTGAGE" |
| Footer legal block | Canopy Mortgage, LLC — 360 Technology Court, Lindon, UT |
| Footer licensing line | "Bayshore Mortgage **NLMS** #196858" |
| Parent company address | Bayshore Mortgage Funding, LLC — Edgewood, MD |
| **Primary "Apply Now" CTA** | `myloan.bsmfunding.com` (Bayshore) |
| Nav / profile link | `canopymortgage.com/lo/JoshPennebaker/` |
| Privacy Policy / Terms / State Licenses | All point to `canopymortgage.com` |

**Read:** Josh moved brokerages (Canopy → Bayshore) and the site was never fully migrated. For a licensed mortgage originator this is not cosmetic — NMLS and state regulators require licensing disclosures to accurately identify the sponsoring entity. Consumers applying through the CTA land at a different company than the one legally disclosed in the footer.

**This is the single highest-value thing to raise in the pitch.** It reframes the conversation from "your site looks dated" (subjective, easy to dismiss) to "your site is exposing you" (objective, urgent). Ask him which entity is current before touching anything.

> ⚠️ Not legal advice — flag it, recommend he confirm required disclosure language with his compliance officer at the current brokerage.

### 🔴 P0 — "NLMS" typo, used consistently

Appears **twice**: `Branch Manager | NLMS #1737680` and `Bayshore Mortgage NLMS #196858`.
The acronym is **NMLS** (Nationwide Multistate Licensing System). A mortgage professional misspelling his own regulator's acronym, on his own license number, is a trust-killer for any informed buyer — and it's on every page in the footer.

### 🟠 P1 — Mobile performance is failing

Lighthouse (mobile, throttled):

| Metric | Value | Verdict |
|---|---|---|
| Performance | **58** | Poor |
| **Largest Contentful Paint** | **11.0 s** | **Fail** (target < 2.5s) |
| Time to Interactive | 11.0 s | Poor |
| First Contentful Paint | 2.8 s | Needs work |
| Total Blocking Time | 420 ms | Needs work |
| Cumulative Layout Shift | 0 | Good |
| Accessibility | 91 | Decent |
| Best Practices | 96 | Good |
| SEO | 85 | Needs work |

**Root cause is not the server** — TTFB is 46ms (Cloudflare/Kinsta is doing its job). It's front-end payload:
- `Home-hero.jpg` — **724 KB**, unoptimized JPEG, no WebP/AVIF
- Zero images use `loading="lazy"` (all 19 are `loading="auto"`)
- Elementor loads Font Awesome **two** webfont files (`fa-solid-900.woff2`, `fa-brands-400.woff2`) plus Mulish + Roboto
- `wp-emoji-release.min.js` still loading (pure dead weight)
- Meta Pixel fires a `wp-json` POST + `admin-ajax.php` call on load

**Business translation:** ~53% of mortgage searches are mobile, and Google's field data (CrUX) feeds Core Web Vitals into local ranking. An 11-second LCP means a meaningful share of paid/organic mobile visitors bounce before the hero paints.

### 🟠 P1 — Duplicate rendered heading (visible bug)

The USDA band renders **"ASK US ABOUT USDA" twice, stacked** — once as `<h2>`, once as `<h3>`. Clearly visible on mobile. This is a builder mistake nobody QA'd.

### 🟠 P1 — Two `<h1>` tags on the homepage

Both "Let's Get You Home". Splits semantic focus and is a straightforward on-page SEO defect.

### 🟠 P1 — 18 of 19 images have no `alt` text

Only the logo has alt. Fails WCAG 1.1.1, costs image SEO, and for a business serving the public it's an ADA-exposure pattern — mortgage/real-estate sites are an active target category for accessibility demand letters.

### 🟡 P2 — Copy pasted from a PDF with broken ligatures

Live on the About section: *"what best fits your **specifi c** needs"* and *"in the most **fi nancially** sound way possible"*. The `fi` ligature broke on paste and was never proofread.

### 🟡 P2 — Default WordPress content live and indexed

`/sample-page/` and `/hello-world/` both return 200 and sit in `wp-sitemap.xml`. Signals an unfinished build to both crawlers and any prospect who pokes around.

### 🟡 P2 — Four empty `<h3>` tags

Empty heading elements in the DOM — screen-reader noise, semantic garbage.

---

## 3. Design critique (the "AI slop" lens, applied to a human-built site)

The site isn't AI slop — it's **2019 template slop**, which fails for the same underlying reason: nothing about it is specific to Josh.

| Tell | What's there | Why it fails |
|---|---|---|
| **Stock hero** | Backlit couple gazing at a house at golden hour | The single most clichéd image in the entire mortgage category. Says nothing true about Josh, Kansas City, or the business. |
| **Default fonts** | Mulish + Roboto | Roboto is the "I didn't choose a font" font. Zero brand voice. |
| **Generic value props** | "Best-in-class service", "Total transparency", "Works with your timeline" | Textbook hedged superlatives. Every lender in America claims all four. Unfalsifiable = unpersuasive. |
| **Dead vertical space** | Full blank viewport around 1000px scroll | Elementor section padding with no content. Reads as broken. |
| **Ragged testimonial grid** | Card heights 246 / 186 / 276 / 401px | Uneven, unaligned — the visual signature of an untended page builder. |
| **Voice mismatch** | Heading says "About **Me**", body says "**we**/our team" | Can't decide if it's a solo originator or a firm. |
| **Clip-art icons** | 115×110px PNGs for the four value props | Raster clip-art, not a designed icon system. |
| **Generic red/gold** | Brand colors present but applied flatly | No hierarchy, no restraint, no accent discipline. |

**The real strategic problem:** the copy says *"We are not a 1-800 number like the big box lenders; we genuinely care"* — that's the actual differentiator, and the design does nothing to support it. The site **looks exactly like a big-box lender template**. The design contradicts the value proposition. That's the thesis of the redesign.

---

## 4. Conversion & funnel gaps

1. **The primary CTA leaves the site.** "Apply Now" → `myloan.bsmfunding.com`. No on-site lead capture at all. Every visitor not ready to complete a full 1003 application is lost with zero retargeting handle beyond the pixel.
2. **No progressive/soft conversion.** There's a full application or nothing. No "get a rate estimate", "what can I afford", no email capture, no callback request.
3. **Calculators are dead ends.** Three calculator pages exist but are isolated utilities — they don't capture a lead or hand off to a next step.
4. **Only 4 testimonials, hardcoded.** No Google Business Profile review integration, no volume, no recency, no photos. "Read More Reviews" points to Facebook.
5. **Zero content marketing.** One `hello-world` post. For local mortgage SEO — where "first-time homebuyer programs Kansas City", "USDA eligible areas near KC", "Missouri vs Kansas closing costs" are exactly the queries that convert — this is the biggest untapped organic channel.
6. **No service-area pages.** He serves the KC metro across two states (KS + MO). No location pages, no local schema markup.
7. **No trust infrastructure.** No headshot above the fold, no closed-loan counter, no partner-agent logos, no response-time guarantee — despite "we respond ASAP" being a stated value prop.

---

## 5. The plan

### Phase 0 — Discovery & de-risk (before any design)
- Confirm **which brokerage is current** and get the exact required disclosure/licensing language from his compliance officer. Everything downstream depends on this.
- Get real assets: professional photos of Josh, his actual office/KC, closed-loan stats, Google review access, his 3–5 referral-partner agents.
- Confirm where the loan application must terminate (brokerage portal is likely non-negotiable — design the funnel *to* it, not around it).
- Get access: WordPress admin, domain/DNS, GA4, Meta Business, Google Business Profile.

### Phase 1 — Taste library & direction (the anti-slop step)
Per the workflow: build a curated reference library *before* prompting anything. Pull from fintech/real-estate sites that feel premium and human, not from mortgage-template land. Then generate **5 distinct aesthetic directions** as real comps, present side by side, let Josh pick — then 3 refinements of the winner, then lock tokens into `DESIGN.md`.

**Candidate directions** (all explicitly avoiding purple/blue gradients, Inter, glassmorphism, 3D blobs):

1. **Kansas City Editorial** — warm neutrals, real local photography, editorial serif display + humanist sans, generous reading column. Leans hard into "neighborhood lender." Highest differentiation.
2. **Warm Modern Trust** — refined take on his existing red/gold, disciplined type scale, real photography, restrained motion. Lowest client risk, still a large step up.
3. **Data-Confident** — clean tabular treatment, live rate/scenario tooling as the hero, mono numerals. Positions him as the transparent operator. Strong if he'll commit to real numbers.
4. **Documentary** — black-and-white portrait photography of real KC clients + homes, heavy type, minimal chrome. Highest craft ceiling, needs real photo assets.
5. **Civic/Print** — letterpress-inspired, paper texture, strong grid, understated. Evokes institutional trust without corporate coldness.

### Phase 2 — Build
- Rebuild the homepage + 4 program pages + About + Contact on the locked design system.
- On-site lead capture: multi-step "Start your estimate" form (3 questions max before email), feeding to his CRM/email + then handing off to the brokerage portal.
- Rebuild the three calculators as first-class, fast, mobile-native tools with a soft conversion at the result.
- Google Business Profile review integration (live, not hardcoded).
- Local SEO foundation: service-area pages (KS + MO metro), `LocalBusiness` + `FinancialService` schema, correct NAP.
- Accessibility to WCAG 2.2 AA: alt text, heading order, focus states, contrast, keyboard nav.
- Performance budget: LCP < 2.0s mobile, total JS < 100KB, AVIF/WebP with responsive `srcset`, lazy-load everything below the fold.

### Phase 3 — Content & growth
- 8–12 seed articles targeting KC-metro buyer intent.
- Email nurture for captured leads not yet ready to apply.
- Conversion tracking properly wired (GA4 events + Meta CAPI, not just pixel).

### Tech stack recommendation — be honest about the tradeoff

| Option | Pros | Cons |
|---|---|---|
| **A. Next.js + headless/MDX, deploy on Vercel or Netlify** | Total design control, trivially hits performance budget, best-in-class DX, no Elementor ceiling | Josh can't edit it himself without a CMS layer; you own maintenance |
| **B. Stay on WordPress, custom block theme (drop Elementor)** | He keeps familiar editing, keeps existing SEO/URLs, cheaper migration | Still WP maintenance surface; performance ceiling is lower but 90+ is achievable |
| **C. Keep Elementor, restyle** | Cheapest, fastest | Cannot fix the root performance and craft problems. **Not recommended** — it's re-decorating. |

**Recommendation: A**, with a lightweight CMS (Sanity/Payload) for the blog and testimonials so Josh isn't blocked on you for content. If he insists on self-editing everything, **B** is the honest fallback — a custom block theme without Elementor still gets to LCP < 2s.

---

## 6. How to actually impress him

Do **not** open with "your site looks dated." He's heard it, it's subjective, and Media Ally will defend it.

Open with evidence he cannot argue with:

1. **The dual-lender problem.** "Your footer discloses Canopy, your Apply button sends clients to Bayshore, and both are labeled NLMS instead of NMLS. Which one is current?" — This demonstrates you read his site more carefully than the people who built it. It's a business risk, not a taste opinion.
2. **The Lighthouse number, on his phone, in the room.** 11-second LCP. Pull it up live.
3. **The visible duplicate heading**, on mobile, on his own phone.
4. **The `/sample-page/` and `/hello-world/` URLs** — still live, three-plus years in.
5. **Then** the strategic point: *"Your best line is 'we're not a 1-800 number like the big box lenders.' But your site looks exactly like one. The design is arguing against your own pitch."*
6. **Close with a real comp, not a mockup deck.** Build one of the five directions as a working page on his actual content and show it side by side with the current site on mobile. That's the close.

**Leverage:** the design credit in his footer belongs to another agency. This isn't a defense of his own work — it's an audit of a vendor's. That makes it far easier for him to accept.
