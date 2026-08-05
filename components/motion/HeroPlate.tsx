"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sunflower plate behind the hero type. Kansas is the Sunflower State — this is
 * regional, not generic stock, which is the whole point.
 *
 * Treated on purpose: lightly desaturated, lifted, ~34% opacity, with a paper veil
 * over it. It should read as texture on the page, never as a photograph, and
 * never compete with the headline.
 *
 * LCP DISCIPLINE — this is why the video is not a plain <video autoplay>:
 *  - The <video> element mounts only AFTER load + idle, so it never competes
 *    with the hero text for bandwidth or main thread during first paint.
 *  - A tiny poster JPEG (23KB) carries the visual until then.
 *  - preload="none" so nothing is fetched before we decide to mount it.
 *  - Skipped entirely under reduced motion and on save-data / 2g connections.
 */
/**
 * basePath is NOT applied to raw `src` attributes or inline-style url() —
 * Next only rewrites next/image, next/link and imported assets. Files served
 * from public/ must be prefixed by hand or they 404 on GitHub Pages.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function HeroPlate() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Respect data-saver and slow connections.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return;

    let idle: number;
    const start = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
      idle = ric(() => setShowVideo(true)) as unknown as number;
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (idle) (window.cancelIdleCallback ?? clearTimeout)(idle);
    };
  }, []);

  useEffect(() => {
    if (showVideo) videoRef.current?.play().catch(() => {});
  }, [showVideo]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        data-hero-plate
        className="absolute inset-0 scale-[1.15] will-change-transform"
      >
      <div
        className="absolute inset-0 bg-cover bg-[position:50%_65%] [filter:saturate(1.05)_contrast(1.02)]"
        style={{
          backgroundImage: `url(${BASE}/media/kansas-sunflowers-poster.jpg)`,
        }}
      />
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[50%_65%] [filter:saturate(1.05)_contrast(1.02)]"
          src={`${BASE}/media/kansas-sunflowers.mp4`}
          poster={`${BASE}/media/kansas-sunflowers-poster.jpg`}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      </div>
      {/* Warm ink scrim. Two layers, both necessary:
          1. A base wash so no frame of the video can drop text contrast below
             AA, whatever is on screen at that moment.
          2. A directional gradient that is heaviest where the headline sits —
             vertical on mobile (tall, narrow), diagonal from the left on
             desktop (wide, two-column). */}
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_62%,transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_2%,color-mix(in_srgb,var(--color-ink)_55%,transparent)_55%,color-mix(in_srgb,var(--color-ink)_78%,transparent)_100%)] md:bg-[linear-gradient(100deg,var(--color-ink)_28%,color-mix(in_srgb,var(--color-ink)_60%,transparent)_72%,color-mix(in_srgb,var(--color-ink)_40%,transparent)_100%)]" />
      {/* Hand the page back to paper at the bottom edge, so the dark opening
          resolves into the light editorial body instead of stopping dead. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]" />
    </div>
  );
}
