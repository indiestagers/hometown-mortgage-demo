/**
 * Proof-by-pixels that the hero plate actually changes as you scroll.
 *
 * Every other check in this repo asserts on state — an opacity value, a
 * currentTime, a data attribute. All of those passed while the hero was doing
 * nothing at all on a real iPhone. This one screenshots the same screen region
 * at three scroll positions and compares the actual pixels, so it cannot be
 * satisfied by a mechanism that reports success without rendering anything.
 *
 * Usage: node scripts/verify-plate-moves.mjs [url]
 */
import { chromium, devices } from "playwright";
import { PNG } from "pngjs";
const URL = process.argv[2] ?? "http://localhost:3000/hometown-mortgage-demo/";
const b = await chromium.launch();

async function run(label, ctxOpts, positions) {
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForTimeout(3000);
  // crop to the plate band only, so page text/layout changes don't count
  // Viewport-fixed band: on mobile the hero scrolls, so a hero-relative crop
  // walks off screen. This samples the same screen region every time.
  const box = await p.evaluate(() => ({
    x: 0, y: Math.round(innerHeight * 0.45),
    width: Math.round(innerWidth), height: Math.round(innerHeight * 0.35),
  }));
  const shots = [];
  for (const y of positions) {
    await p.evaluate(yy => window.scrollTo(0, yy), y);
    await p.waitForTimeout(900);
    shots.push(PNG.sync.read(await p.screenshot({ clip: box })));
  }
  await ctx.close();
  const diff = (a, c) => {
    let n = 0;
    for (let i = 0; i < a.data.length; i += 4) {
      if (Math.abs(a.data[i] - c.data[i]) > 12) n++;
    }
    return (n / (a.data.length / 4) * 100).toFixed(1);
  };
  const d1 = diff(shots[0], shots[1]);
  const d2 = diff(shots[1], shots[2]);
  console.log(`${label}: plate changed ${d1}% then ${d2}%  -> ${(+d1 > 5 && +d2 > 5) ? "ANIMATING ✓" : "STATIC ✗"}`);
  return +d1 > 5 && +d2 > 5;
}

const okDesk = await run("desktop", { viewport: { width: 1440, height: 900 } }, [0, 500, 1000]);
const okMob = await run("mobile ", { ...devices["iPhone 13"] }, [0, 250, 600]);
await b.close();
process.exit(okDesk && okMob ? 0 : 1);
