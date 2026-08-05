"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Opacity + 8px translate on enter. Nothing scales, nothing bounces.
 *
 * Toggles a data attribute on the DOM node directly rather than holding
 * React state — a reveal is a visual side effect, not application state,
 * and this avoids a re-render per element on scroll.
 *
 * Honors prefers-reduced-motion (also enforced in globals.css) and
 * disconnects the observer once fired.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /**
   * Render visible immediately, with no animation and no JS dependency.
   * REQUIRED for above-the-fold content: an element that starts at
   * opacity:0 cannot paint until hydration, which pushes LCP out by
   * seconds. Never animate the hero.
   */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.style.transitionDelay = `${delay}ms`;
      el.dataset.shown = "true";
    };

    // No IntersectionObserver, or reduced motion: show immediately.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      // Positive bottom margin = fire BEFORE the element scrolls in.
      // A negative margin meant large blocks were still hidden when they
      // reached the viewport, leaving a white void mid-scroll.
      { rootMargin: "0px 0px 20% 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, immediate]);

  if (immediate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`reveal ${className}`} data-shown="false">
      {children}
    </div>
  );
}
