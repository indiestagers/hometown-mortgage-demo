"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the top of the page on every route change.
 *
 * `html { scroll-behavior: smooth }` (which we want for in-page anchor jumps)
 * defeats the App Router's own scroll reset: Next calls `window.scrollTo(0, 0)`,
 * the smooth behaviour turns that into a deferred animation, and the previous
 * page's offset carries over — clamped to the new, shorter document. The result
 * is landing at the bottom of the page you just navigated to.
 *
 * Fixed by resetting explicitly with `behavior: "instant"`, which ignores the
 * inherited smooth scrolling. Skipped when the URL carries a hash so deep links
 * to a section still work.
 */
export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
