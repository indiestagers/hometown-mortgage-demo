"use client";

import { useEffect } from "react";

/**
 * Scroll-linked effects, driven by Motion's VANILLA `scroll()`.
 *
 * Why this is not a repeat of the earlier mistake: the first attempt imported
 * `motion/react`, which pulls the whole React runtime and animated ~20
 * components on the main thread — 49KB and TBT 100ms -> 660ms. This imports
 * only `scroll` + `animate` from the vanilla entry and, where the browser
 * supports it, hands the work to a native `ScrollTimeline`, so the animation
 * runs off the main thread entirely. Everything here is transform/opacity only
 * — never a layout property.
 *
 * All of it is skipped under prefers-reduced-motion.
 */
export function ScrollFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const stops: Array<() => void> = [];

    import("motion").then(({ scroll, animate }) => {
      if (cancelled) return;

      // 2. Hero plate parallax. The sunflower drifts slower than the page, so
      //    the opening gains depth without the headline moving. Small offset
      //    on purpose — big parallax is the tell of a template.
      //    Range is +/-28px against a constant scale-1.15 overscan (~53px per
      //    edge on the hero), so the plate can never drift far enough to
      //    expose a gap. Note: Motion ignored the `offset` option here and
      //    used its default ["start end","end start"], which is why the range
      //    is symmetric rather than 0 -> n.
      const plate = document.querySelector<HTMLElement>("[data-hero-plate]");
      const heroSection = document.getElementById("hero-track");
      if (plate && heroSection) {
        stops.push(
          scroll(
            animate(plate, { y: [-28, 28] }, { ease: "linear" }),
            { target: heroSection, offset: ["start start", "end start"] },
          ),
        );
      }

      // 3. Program rows: each row lifts and settles as it crosses the viewport.
      //    Staggered by position, not by index, so it reads as physical.
      document
        .querySelectorAll<HTMLElement>("[data-program-row]")
        .forEach((row) => {
          stops.push(
            scroll(
              animate(row, { y: [28, 0, 0] }, { ease: "easeOut" }),
              { target: row, offset: ["start end", "center 0.9", "end start"] },
            ),
          );
        });
    });

    return () => {
      cancelled = true;
      stops.forEach((stop) => {
        try {
          stop();
        } catch {
          /* already torn down */
        }
      });
    };
  }, []);

  return null;
}
