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
        className="absolute inset-0 bg-cover bg-center opacity-[0.34] [filter:saturate(0.85)_contrast(0.92)_brightness(1.06)]"
        style={{
          backgroundImage: `url(${BASE}/media/kansas-sunflowers-poster.jpg)`,
        }}
      />
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.34] [filter:saturate(0.85)_contrast(0.92)_brightness(1.06)]"
          src={`${BASE}/media/kansas-sunflowers.mp4`}
          poster={`${BASE}/media/kansas-sunflowers-poster.jpg`}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      {/* Paper veil: keeps text off busy pixels and guarantees contrast.
          The direction has to change with the layout — a horizontal wipe
          tuned for the wide two-column hero covers a 390px screen almost
          entirely, which erased the texture on mobile. Vertical below md. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-paper)_18%,color-mix(in_srgb,var(--color-paper)_62%,transparent)_60%,color-mix(in_srgb,var(--color-paper)_45%,transparent)_100%)] md:bg-[linear-gradient(100deg,var(--color-paper)_38%,color-mix(in_srgb,var(--color-paper)_72%,transparent)_78%,color-mix(in_srgb,var(--color-paper)_58%,transparent)_100%)]" />
      {/* Feather the bottom edge — without this the plate ends on a hard
          rectangle and reads as a pasted-in box rather than page texture. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]" />
    </div>
  );
}
