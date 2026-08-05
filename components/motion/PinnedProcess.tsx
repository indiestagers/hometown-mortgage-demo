"use client";

import { useEffect, useRef } from "react";

export type Step = { n: string; t: string; d: string };

/**
 * The four-step process, revealed in sequence as the section enters view.
 *
 * DELIBERATELY NOT PINNED. An earlier version held the viewport for ~4 screens
 * and scrubbed the steps on scroll. In real use it read as the page hanging:
 * you scroll, nothing moves, and it feels broken rather than considered.
 * Hijacking scroll is the one kind of motion users actively resent, and the
 * effect was not worth the cost. Do not reintroduce pinning here.
 *
 * The progress rail fills once, on entry, tied to the reveal rather than to
 * scroll position, so it can never desync from what the user actually sees.
 *
 * State lives in a `data-shown` attribute rather than React state: React 19's
 * compiler lint forbids setState inside an effect, and a reveal is a visual
 * side effect, not application state.
 */
export function PinnedProcess({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      { rootMargin: "0px 0px 15% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="process" data-shown="false">
      <div className="relative h-px w-full bg-rule" aria-hidden="true">
        <div className="process__rail absolute inset-y-0 left-0 bg-brick" />
      </div>

      <ol className="mt-12 grid gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li
            key={s.n}
            className="process__step bg-paper p-6"
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="process__mark h-px bg-brass"
                style={{ transitionDelay: `${i * 110 + 160}ms` }}
              />
              <span className="tnum text-[13px] text-brick">{s.n}</span>
            </div>
            <h3 className="mt-3 text-[20px]">{s.t}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              {s.d}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
