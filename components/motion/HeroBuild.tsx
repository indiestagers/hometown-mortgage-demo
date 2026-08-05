"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Scroll-scrubbed hero: a house resolves from an architect's blueprint into a
 * finished, lit home as you scroll.
 *
 * WHY THIS AND NOT A LOOPING PLATE
 * A background loop has no beginning or end, so it reads as decoration and the
 * eye discards it. This has an arc — drawing -> materialised -> warm windows —
 * and the arc is bound to scroll position, so the visitor drives it. That is
 * the difference between motion that means something and motion that just
 * moves.
 *
 * It also says the right thing for a mortgage, which construction footage does
 * not: Josh writes purchase and refinance loans, not construction loans. A
 * framing-to-roof time-lapse is the builder's story. Plan -> home is the
 * buyer's, and it is what a mortgage actually does.
 *
 * WHY IT DOES NOT STUTTER
 * The clip is re-encoded all-intra (-g 1, 12fps) so every seek lands on a
 * keyframe and decodes immediately. A normally-encoded video has to decode
 * forward from the previous keyframe on each seek, which is what makes naive
 * scroll-scrubbing judder — badly on Safari/macOS.
 *
 * LCP DISCIPLINE
 * The poster is a 51KB JPEG painted as a background immediately. The 1.5MB
 * video element only mounts after load + idle, so it never competes with the
 * hero text for first paint. Skipped on save-data and slow connections.
 *
 * REDUCED MOTION
 * Shows the FINISHED house — the end state is the meaningful image; a
 * blueprint alone would read as an unfinished page.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

export function HeroBuild() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReduced, () => false);

  useEffect(() => {
    if (reduced) return;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|\W)(2g|slow-2g)/.test(conn.effectiveType)) return;

    let idle: number;
    const start = () => {
      const ric =
        window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
      idle = ric(() => setMounted(true)) as unknown as number;
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (idle) (window.cancelIdleCallback ?? clearTimeout)(idle);
    };
  }, [reduced]);

  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    const hero = document.getElementById("hero-section");
    if (!video || !hero) return;

    let frame = 0;
    let duration = 0;
    let target = 0;

    const onMeta = () => {
      duration = video.duration || 0;
      apply();
    };

    // Ease the seek toward the target instead of snapping to it. Scroll events
    // are coarse; interpolating gives the transformation a sense of weight and
    // hides any single dropped frame.
    const tick = () => {
      frame = 0;
      if (!duration) return;
      const current = video.currentTime;
      const next = current + (target - current) * 0.18;
      if (Math.abs(target - current) > 0.008) {
        video.currentTime = next;
        frame = requestAnimationFrame(tick);
      } else {
        video.currentTime = target;
      }
    };

    const apply = () => {
      if (!duration) return;
      const r = hero.getBoundingClientRect();
      if (r.height <= 0) return;
      // Progress = how far you have scrolled THROUGH the hero: 0 at the top of
      // the page, 1 once the hero has fully scrolled past. Measuring entry into
      // the viewport instead would start at ~48% on load, so the blueprint
      // stage — the whole point — would never be seen.
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      target = p * (duration - 0.05);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
      apply();
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mounted]);

  const poster = reduced
    ? `${BASE}/media/house-build-end.jpg`
    : `${BASE}/media/house-build-start.jpg`;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 scale-[1.04] bg-cover bg-[position:50%_62%]"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {mounted && !reduced && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[50%_62%]"
          src={`${BASE}/media/house-build.mp4`}
          poster={poster}
          muted
          playsInline
          preload="auto"
        />
      )}

      {/* Warm ink scrim, same two-layer construction as before: a flat wash so
          no frame can drop text contrast below AA, plus a directional gradient
          heaviest where the headline sits. */}
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_38%,transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_2%,color-mix(in_srgb,var(--color-ink)_48%,transparent)_52%,color-mix(in_srgb,var(--color-ink)_70%,transparent)_100%)] md:bg-[linear-gradient(100deg,var(--color-ink)_24%,color-mix(in_srgb,var(--color-ink)_46%,transparent)_66%,color-mix(in_srgb,var(--color-ink)_20%,transparent)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]" />
    </div>
  );
}
