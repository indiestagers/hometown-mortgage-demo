"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Scroll-scrubbed hero: a house resolves from an architect's blueprint into a
 * finished, lit home as you scroll.
 *
 * WHY A FRAME SEQUENCE AND NOT A VIDEO
 * This was a <video> with currentTime driven by scroll. It worked in Chrome and
 * in Playwright, and did nothing at all on a real iPhone. iOS Safari will not
 * decode or seek a video that has never been played by a user gesture, so the
 * seeks were silently ignored and the hero just sat there.
 *
 * Playwright's "iPhone 13" device profile is Chromium with a phone-sized
 * viewport and a spoofed user agent — it does NOT reproduce iOS media policy,
 * so it reported the scrub working when it was not. Rather than special-case
 * iOS, this uses 24 preloaded JPEGs and swaps which one is visible. There is no
 * media-policy behaviour left to get wrong, and it is identical on every
 * browser.
 *
 * Cost: 24 frames x ~30KB = ~1MB, versus 1.5MB for the video. All frames are
 * fetched after load + idle, so nothing competes with first paint.
 *
 * WHY IT IS SMOOTH
 * Every frame is decoded once up front and then only its opacity changes, so
 * scrolling never triggers a decode. 24 steps is enough because this is a slow
 * dissolve, not fast motion.
 *
 * REDUCED MOTION / SAVE-DATA
 * Renders the FINISHED house as a single static image and loads nothing else.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const FRAME_COUNT = 24;
const frameSrc = (i: number) =>
  `${BASE}/media/build/f${String(i + 1).padStart(2, "0")}.jpg`;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

export function HeroBuild() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReduced,
    () => false,
  );

  // Fetch and decode every frame after the page has settled.
  useEffect(() => {
    if (reduced) return;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|\W)(2g|slow-2g)/.test(conn.effectiveType)) return;

    let cancelled = false;
    let idle: number;

    const start = () => {
      const ric =
        window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
      idle = ric(async () => {
        await Promise.all(
          Array.from({ length: FRAME_COUNT }, (_, i) => {
            const img = new Image();
            img.src = frameSrc(i);
            return img.decode?.().catch(() => {}) ?? Promise.resolve();
          }),
        );
        if (!cancelled) setLoaded(true);
      }) as unknown as number;
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (idle) (window.cancelIdleCallback ?? clearTimeout)(idle);
    };
  }, [reduced]);

  // Map scroll position to the visible frame.
  useEffect(() => {
    if (!loaded) return;
    const layer = layerRef.current;
    const track = document.getElementById("hero-track");
    if (!layer || !track) return;

    const frames = Array.from(
      layer.querySelectorAll<HTMLElement>("[data-frame]"),
    );
    let raf = 0;
    let shown = -1;

    const apply = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      // Desktop pins the hero, so progress maps to the pinned distance
      // (track - viewport). Mobile does not pin — the hero is taller than the
      // viewport there — so progress maps to scrolling through it.
      const pinnable = r.height - window.innerHeight;
      const span = pinnable > 80 ? pinnable : r.height;
      if (span <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / span));
      const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
      if (idx === shown) return;
      if (shown >= 0) frames[shown].style.opacity = "0";
      frames[idx].style.opacity = "1";
      shown = idx;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [loaded]);

  const plate =
    "absolute inset-x-0 bottom-0 h-[42%] w-full object-cover object-bottom [filter:brightness(1.7)_contrast(1.12)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_16%)] md:h-[78%]";

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Static base. Under reduced motion this is the finished house and is
          all that ever renders; otherwise it is frame 1 and the sequence
          fades in over it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reduced ? `${BASE}/media/house-build-end.jpg` : frameSrc(0)}
        alt=""
        className={plate}
        fetchPriority="low"
        decoding="async"
      />

      {!reduced && loaded && (
        <div ref={layerRef}>
          {Array.from({ length: FRAME_COUNT }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              data-frame={i}
              src={frameSrc(i)}
              alt=""
              className={plate}
              style={{ opacity: i === 0 ? 1 : 0 }}
              decoding="async"
            />
          ))}
        </div>
      )}

      {/* Even scrim. A directional gradient protected the headline by blacking
          out the left third, which killed the drawing exactly where it is most
          legible. The type carries its own legibility via .hero-type. */}
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_64%,transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-ink)_86%,transparent)_0%,color-mix(in_srgb,var(--color-ink)_34%,transparent)_34%,color-mix(in_srgb,var(--color-ink)_34%,transparent)_72%,color-mix(in_srgb,var(--color-ink)_62%,transparent)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]" />
    </div>
  );
}
