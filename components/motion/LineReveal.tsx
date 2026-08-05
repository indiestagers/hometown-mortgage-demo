"use client";

import { useEffect, useRef, type ElementType } from "react";

/**
 * The signature move: display headings wipe up from behind a mask, line by line.
 *
 * Implemented with CSS transitions + one IntersectionObserver per heading —
 * deliberately NOT with an animation library. Using `motion` here cost 49KB of
 * JS and pushed Total Blocking Time from 100ms to 660ms (Lighthouse 95 -> 76)
 * for an effect CSS does natively. The masked wipe is identical; the cost is not.
 *
 * Pass `immediate` for above-the-fold headings: an element that starts
 * translated cannot paint until hydration, which delays LCP by seconds.
 */
export function LineReveal({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Seconds of extra delay before the first line moves. */
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    const show = () => el.setAttribute("data-shown", "true");

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 20% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={`line-reveal ${className}`}
      data-shown={immediate ? "true" : "false"}
    >
      {lines.map((line, i) => (
        // Clip box. Small vertical padding stops descenders (g, y, p) from
        // being sheared by the mask edge.
        <span key={line} className="block overflow-hidden py-[0.06em]">
          <span
            className="line-reveal__line block"
            style={{ transitionDelay: `${delay + i * 0.075}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
