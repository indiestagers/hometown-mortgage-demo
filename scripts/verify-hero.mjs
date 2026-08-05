/**
 * Hero verification: contrast over the moving image, and the scrub itself.
 *
 * ⚠️  SCOPE LIMIT, LEARNED THE HARD WAY.
 * Playwright's "iPhone 13" profile is Chromium with a phone-sized viewport and
 * a spoofed user agent. It does NOT reproduce iOS Safari's media policy. An
 * earlier version of the hero scrubbed a <video> via currentTime; that passed
 * every check here and did nothing at all on a real iPhone, because iOS will
 * not decode or seek a video that has never been played by a user gesture.
 *
 * The hero now uses a preloaded frame sequence, which has no media-policy
 * behaviour to diverge on. These checks therefore mean what they say again —
 * but treat "mobile" below as "narrow viewport", never as "verified on iOS".
 *
 * The contrast half is deliberately awkward. Lighthouse cannot judge text over
 * video — it has no computed background to compare against — so this samples
 * real rendered pixels. Critically it renders the page ONCE WITH THE HERO TEXT
 * HIDDEN to capture the true background, then compares that against the known
 * text colours. Sampling a normal screenshot inside the text box measures the
 * glyphs themselves and always returns ~1:1, which is what my first attempt
 * did.
 *
 * Usage: node scripts/verify-hero.mjs [url]
 */
import { chromium, devices } from "playwright";
import { PNG } from "pngjs";

const URL = process.argv[2] ?? "http://localhost:3000/hometown-mortgage-demo/";

const results = [];
const check = (n, pass, d = "") => results.push({ n, pass, d });

const srgb = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const PAPER = lum(247, 244, 239); // --color-paper
const DIM = lum(207, 198, 186); // --color-paper-dim

const browser = await chromium.launch();

async function contrastAt(page, scrollY, label) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(1200);

  // Where the text sits.
  const boxes = await page.evaluate(() => {
    const out = [];
    const hero = document.getElementById("hero-section");
    if (!hero) return out;
    // Only measure text FULLY inside the visible hero. Anything clipped by the
    // sticky header or scrolled past it samples header/paper pixels and
    // reports a meaningless ~1:1.
    const header = document.querySelector("header");
    const top = header ? header.getBoundingClientRect().bottom : 0;
    // The mobile action bar is fixed to the bottom and is paper-coloured, so
    // anything behind it samples the bar, not the hero.
    const bar = [...document.querySelectorAll("div")].find(
      (d) => getComputedStyle(d).position === "fixed" && d.getBoundingClientRect().bottom >= innerHeight - 2 && d.getBoundingClientRect().height > 20,
    );
    const floor = bar ? bar.getBoundingClientRect().top : innerHeight;
    const heroBox = hero.getBoundingClientRect();
    const add = (el, name, dim) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inside =
        r.width > 4 && r.height > 4 &&
        r.top >= top + 2 && r.bottom <= floor - 2 &&
        r.top >= heroBox.top - 1 && r.bottom <= heroBox.bottom + 1;
      if (inside)
        out.push({ name, dim, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
    };
    add(hero.querySelector("h1"), "h1", false);
    add(hero.querySelector("p.measure"), "lede", true);
    hero.querySelectorAll("dt").forEach((e, i) => add(e, `dt${i}`, false));
    hero.querySelectorAll("dd").forEach((e, i) => add(e, `dd${i}`, true));
    return out;
  });

  // Hide the text and re-shoot: that gives the TRUE background behind it.
  await page.evaluate(() => {
    const hero = document.getElementById("hero-section");
    hero.querySelectorAll("h1,p,dt,dd,span,a").forEach((e) => {
      e.style.visibility = "hidden";
    });
  });
  await page.waitForTimeout(250);
  const bgShot = await page.screenshot();
  await page.evaluate(() => {
    const hero = document.getElementById("hero-section");
    hero.querySelectorAll("h1,p,dt,dd,span,a").forEach((e) => {
      e.style.visibility = "";
    });
  });

  const png = PNG.sync.read(bgShot);
  const dpr = png.width / (await page.evaluate(() => window.innerWidth));

  let worst = null;
  for (const b of boxes) {
    let brightest = 0;
    for (let y = b.y + 1; y < b.y + b.h - 1; y += 2) {
      for (let x = b.x; x < b.x + b.w; x += 3) {
        const px = Math.round(x * dpr), py = Math.round(y * dpr);
        if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
        const i = (png.width * py + px) << 2;
        const L = lum(png.data[i], png.data[i + 1], png.data[i + 2]);
        if (L > brightest) brightest = L;
      }
    }
    const r = ratio(b.dim ? DIM : PAPER, brightest);
    if (!worst || r < worst.r) worst = { name: b.name, r: +r.toFixed(2) };
  }
  if (!worst) { check(`contrast ${label}`, false, "no text fully visible in hero to measure"); return; }
  check(`contrast ${label} (worst: ${worst.name})`, worst.r >= 4.5, `${worst.r}:1`);
}

// ── Desktop: contrast at three points of the build, plus the pin ──────────
{
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForTimeout(2600);

  for (const [y, label] of [[0, "desktop@blueprint"], [700, "desktop@forming"], [1300, "desktop@lit"]]) {
    await contrastAt(p, y, label);
  }

  // Pin must hold until the build finishes.
  const pin = await p.evaluate(async () => {
    const track = document.getElementById("hero-track");
    const hero = document.getElementById("hero-section");
    const th = track.getBoundingClientRect().height;
    const pinnable = th - innerHeight;
    window.scrollTo(0, pinnable - 20);
    await new Promise((r) => setTimeout(r, 1400));
    const frames = [...document.querySelectorAll("[data-frame]")];
    const on = frames.findIndex((el) => getComputedStyle(el).opacity === "1");
    return {
      pinned: Math.abs(hero.getBoundingClientRect().top) < 4,
      progress: frames.length ? on / (frames.length - 1) : null,
    };
  });
  check("desktop: hero still pinned at end of track", pin.pinned, `heroTop~0=${pin.pinned}`);
  check("desktop: build completes before release", (pin.progress ?? 0) > 0.9, `progress=${(pin.progress ?? 0).toFixed(2)}`);
  await p.close();
}

// ── Mobile: no pin, scrub still advances, nothing cut off ────────────────
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForTimeout(2600);

  const layout = await p.evaluate(() => {
    const hero = document.getElementById("hero-section");
    return {
      position: getComputedStyle(hero).position,
      ctaVisible: (() => {
        const a = [...hero.querySelectorAll("a")].find((x) => /qualify/i.test(x.textContent || ""));
        if (!a) return false;
        const r = a.getBoundingClientRect();
        return r.height > 0 && r.bottom <= hero.getBoundingClientRect().bottom + 1;
      })(),
    };
  });
  check("mobile: hero is NOT pinned", layout.position === "static", layout.position);
  check("mobile: hero CTA is inside the hero (not cut off)", layout.ctaVisible);

  check("mobile: no <video> (iOS cannot scrub one)", await p.evaluate(() => !document.querySelector("video")));

  const seen = [];
  for (const y of [0, 300, 600, 900, 1200]) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(500);
    seen.push(await p.evaluate(() => {
      const on = [...document.querySelectorAll("[data-frame]")].findIndex(
        (el) => getComputedStyle(el).opacity === "1",
      );
      return on;
    }));
  }
  const monotonic = seen.every((v, i) => i === 0 || v >= seen[i - 1]);
  check("mobile: frame advances with scroll", seen.at(-1) > seen[0] && seen.at(-1) >= 20, JSON.stringify(seen));
  check("mobile: frame never runs backwards", monotonic, JSON.stringify(seen));

  await contrastAt(p, 0, "mobile@top");
  await contrastAt(p, 140, "mobile@mid");
  await ctx.close();
}

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.n}${r.d ? "  (" + r.d + ")" : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
