/**
 * Scrolls the whole page in viewport steps and asserts nothing large is left
 * unrevealed while it is on screen.
 *
 * Catches the "section goes white as you scroll into it" class of bug: reveals
 * that fire too late leave a big empty block visible mid-scroll.
 */
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3000/hometown-mortgage-demo/";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(URL, { waitUntil: "networkidle" });

const H = await p.evaluate(() => document.body.scrollHeight);
let worst = null;
for (let y = 0; y < H; y += 450) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(320);
  const hidden = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.reveal[data-shown="false"], .line-reveal[data-shown="false"], .process[data-shown="false"]')
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        // on screen (any part) and big enough to read as a void
        const onScreen = r.top < innerHeight && r.bottom > 0;
        if (onScreen && r.height > 60) {
          bad.push({ h: Math.round(r.height), top: Math.round(r.top), t: (el.textContent || "").trim().slice(0, 30) });
        }
      });
    return bad;
  });
  if (hidden.length && (!worst || hidden[0].h > worst.h)) worst = { y, ...hidden[0] };
}
await b.close();
if (worst) {
  console.log(`FAIL  blank block on screen at scrollY=${worst.y}: ${worst.h}px tall, top=${worst.top} ("${worst.t}")`);
  process.exit(1);
}
console.log("PASS  no unrevealed block visible at any scroll position");
