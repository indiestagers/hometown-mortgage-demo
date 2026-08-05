/**
 * Scroll-motion verification.
 *
 * The Claude browser pane cannot do this: programmatic scrollTo fires no scroll
 * events there and does not re-trigger IntersectionObserver, and real wheel
 * events time out. So every scroll-driven effect in this project has shipped
 * unverified. Playwright drives a real browser, so reveals actually fire.
 *
 * Usage: node scripts/verify-motion.mjs [url]
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:3000/hometown-mortgage-demo/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle" });

const results = [];
const check = (name, pass, detail) => results.push({ name, pass, detail });

// 1. Hero must paint immediately — never gated on hydration (LCP discipline).
const heroShown = await page.getAttribute("h1.line-reveal", "data-shown");
check("hero h1 paints immediately", heroShown === "true", `data-shown=${heroShown}`);

// 2. Headings FAR below the fold must start masked. Ones within the 20%
//    pre-trigger zone are expected to fire on load — that is deliberate, so a
//    large block is never left blank as the user scrolls into it.
const farBelow = await page.$$eval(".line-reveal:not(h1)", (els) =>
  els
    .filter((e) => e.getBoundingClientRect().top > window.innerHeight * 1.3)
    .map((e) => e.dataset.shown),
);
check(
  "headings far below the fold start masked",
  farBelow.length > 0 && farBelow.every((v) => v === "false"),
  `${farBelow.filter((v) => v === "false").length}/${farBelow.length} masked`,
);

// 3. Scroll for real, then confirm they actually reveal.
for (const id of ["thesis", "programs", "estimate", "process", "reviews", "area", "start"]) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
}
await page.waitForTimeout(500);

const revealed = await page.$$eval(".line-reveal:not(h1)", (els) =>
  els.map((e) => ({ shown: e.dataset.shown, text: e.textContent.slice(0, 28) })),
);
const stillHidden = revealed.filter((r) => r.shown !== "true");
check(
  "headings reveal on real scroll",
  stillHidden.length === 0,
  stillHidden.length ? `still hidden: ${stillHidden.map((r) => r.text).join(" | ")}` : "all revealed",
);

// 4. The line mask must actually translate, not just fade.
const transform = await page.$eval(
  ".line-reveal[data-shown='true'] .line-reveal__line",
  (el) => getComputedStyle(el).transform,
);
check(
  "revealed lines sit at translateY(0)",
  transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)",
  transform,
);

// 5. Process section reveals.
await page.locator("#process").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const proc = await page.getAttribute(".process", "data-shown");
const railW = await page.$eval(".process__rail", (el) => getComputedStyle(el).width);
check("process section reveals", proc === "true", `data-shown=${proc}`);
check("process rail fills", parseFloat(railW) > 100, `rail width=${railW}`);

// 6. Reduced motion must disable everything.
const rmPage = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await rmPage.goto(URL, { waitUntil: "networkidle" });
await rmPage.waitForTimeout(400);
const rmLine = await rmPage.$eval(
  ".line-reveal:not(h1) .line-reveal__line",
  (el) => getComputedStyle(el).transform,
);
check(
  "reduced motion: no transform on lines",
  rmLine === "none" || rmLine === "matrix(1, 0, 0, 1, 0, 0)",
  rmLine,
);
const rmVideo = await rmPage.$("video");
check("reduced motion: hero video not mounted", rmVideo === null, rmVideo ? "video present" : "absent");

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}  (${r.detail})`);
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
