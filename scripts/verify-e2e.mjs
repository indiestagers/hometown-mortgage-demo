/**
 * End-to-end checks across every route and breakpoint.
 *
 * Covers the classes of bug this project has actually shipped:
 * text collisions, horizontal overflow, navigation landing at the wrong
 * scroll position, dead links, and the estimator -> lead-form handoff.
 *
 * Usage: node scripts/verify-e2e.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3000/hometown-mortgage-demo").replace(/\/$/, "");
const ROUTES = ["/", "/calculators/purchase/", "/calculators/affordability/"];
const WIDTHS = [375, 768, 1024, 1440, 1920];

const results = [];
const check = (n, pass, d = "") => results.push({ n, pass, d });

const browser = await chromium.launch();

// ── Layout: no horizontal overflow, no colliding grid text ────────────────
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(BASE + route, { waitUntil: "networkidle" });
    await p.waitForTimeout(300);

    const overflow = await p.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    check(`no h-overflow ${route} @${width}`, overflow <= 1, `${overflow}px`);

    // Text must never cross into the next grid column.
    const collide = await p.evaluate(() => {
      const bad = [];
      document.querySelectorAll("[data-program-row]").forEach((row) => {
        const h = row.querySelector("h3");
        if (!h || row.children.length < 2) return;
        const r = document.createRange();
        r.selectNodeContents(h);
        const gap =
          row.children[1].getBoundingClientRect().left -
          r.getBoundingClientRect().right;
        // only meaningful while the row is side-by-side, not stacked
        const stacked =
          row.children[1].getBoundingClientRect().top >
          h.getBoundingClientRect().bottom;
        if (!stacked && gap < 4) bad.push(`${h.textContent.trim()}:${Math.round(gap)}px`);
      });
      return bad;
    });
    check(`no text collision ${route} @${width}`, collide.length === 0, collide.join(","));
    await p.close();
  }
}

// ── Navigation always lands at the top ────────────────────────────────────
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(200);
  await p.click('a[href*="/calculators/purchase/"]');
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(400);
  const y = await p.evaluate(() => window.scrollY);
  check("nav lands at top of destination", y < 10, `scrollY=${y}`);
  await p.close();
}

// ── No dead internal links ────────────────────────────────────────────────
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const hrefs = await p.evaluate(() =>
    [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))],
  );
  const internal = hrefs.filter((h) => h.startsWith("/"));
  const dead = [];
  for (const h of internal) {
    const r = await p.request.get(new URL(h, BASE).toString());
    if (!r.ok()) dead.push(`${h}=${r.status()}`);
  }
  check("no dead internal links", dead.length === 0, dead.join(",") || `${internal.length} ok`);

  // in-page anchors must resolve to a real element
  const badAnchors = await p.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h.length > 1 && !document.querySelector(h)),
  );
  check("all in-page anchors resolve", badAnchors.length === 0, badAnchors.join(","));
  await p.close();
}

// ── Estimator result reaches the lead form ────────────────────────────────
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.locator("#estimate").scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  await p.getByRole("radio", { name: "VA" }).click();
  await p.waitForTimeout(300);
  const total = (await p.locator('[aria-live="polite"]').innerText()).trim();
  await p.getByRole("button", { name: /Have Josh check/i }).click();
  await p.waitForTimeout(700);
  const summary = await p.locator("#start").innerText();
  check(
    "estimate carries into the lead form",
    summary.includes(total),
    `estimator=${total}, form ${summary.includes(total) ? "matches" : "MISSING"}`,
  );
  await p.close();
}

// ── Mobile: phone number must be visible ──────────────────────────────────
{
  const p = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const visible = await p.evaluate(() => {
    const els = [...document.querySelectorAll("a[href^='tel:']")];
    return els.some((a) => {
      const r = a.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && a.innerText.replace(/\s/g, "").includes("913");
    });
  });
  check("mobile shows the phone number", visible);
  await p.close();
}

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.pass) failed++;
  if (!r.pass || process.env.VERBOSE) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.n}${r.d ? "  (" + r.d + ")" : ""}`);
  }
}
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
