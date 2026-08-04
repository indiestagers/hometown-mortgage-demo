"use client";

import { useEffect, useRef, useState } from "react";

export type Step = { n: string; t: string; d: string };

/**
 * The one pinned, scroll-scrubbed moment on the page.
 *
 * A tall track holds a `position: sticky` viewport; scrolling through it
 * advances the four steps. Progress follows scroll position rather than a
 * timer, so the user stays in control — that is what separates scrubbed
 * motion from a carousel that plays at you.
 *
 * Driven by IntersectionObserver sentinels, not a scroll listener: sentinels
 * are dispatched by the compositor, need no per-frame math, and cannot drift
 * out of sync if a layout shift changes the track height. No animation
 * library — using `motion` here cost 49KB and pushed Total Blocking Time from
 * 100ms to 660ms (Lighthouse 95 -> 76) for an effect CSS handles natively.
 *
 * Degrades to a static list under reduced motion and below `lg`, where pinning
 * fights native scrolling and swallows the whole viewport.
 */
export function PinnedProcess({ steps }: { steps: Step[] }) {
  // Starts with every step lit. Dimming only begins once the observer has
  // actually reported a position — so if IntersectionObserver never fires
  // (older engine, odd embedding, prerender), the section still reads as a
  // clean pinned list instead of a long pin where nothing ever happens.
  const [active, setActive] = useState(steps.length - 1);
  const [scrubbing, setScrubbing] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(wide.matches && !reduced.matches);
    sync();
    wide.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const nodes = sentinels.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length === 0) return;

    // Each sentinel sits at the scroll depth where its step should take over.
    // Crossing the vertical midpoint of the viewport activates it.
    const io = new IntersectionObserver(
      (entries) => {
        let highest = -1;
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.i);
          if (e.boundingClientRect.top <= 0) highest = Math.max(highest, i);
        }
        // Re-scan all sentinels so we settle correctly when scrolling up too.
        const passed = nodes
          .filter((n) => n.getBoundingClientRect().top <= 0)
          .map((n) => Number(n.dataset.i));
        const next = passed.length ? Math.max(...passed, highest) : 0;
        setScrubbing(true);
        setActive(Math.min(steps.length - 1, Math.max(0, next)));
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [enabled, steps.length]);

  if (!enabled) return <StaticSteps steps={steps} />;

  return (
    <div className="relative" style={{ height: `${steps.length * 55}vh` }}>
      {/* Scroll-depth markers, evenly spaced down the track. */}
      {steps.map((s, i) => (
        <div
          key={s.n}
          data-i={i}
          ref={(el) => {
            sentinels.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute h-px w-full"
          style={{ top: `${(i / steps.length) * 100}%` }}
        />
      ))}

      <div className="sticky top-0 flex h-screen items-center">
        <div className="w-full">
          <div className="relative h-px w-full bg-rule" aria-hidden="true">
            <div
              className="absolute inset-y-0 left-0 bg-brick transition-[width] duration-500 ease-[cubic-bezier(0.2,0,0,1)]"
              style={{
                width: scrubbing
                  ? `${((active + 1) / steps.length) * 100}%`
                  : "100%",
              }}
            />
          </div>

          <ol className="mt-12 grid gap-px border border-rule bg-rule lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className="bg-paper p-6 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
                // Never below 0.45: an inactive step must stay readable, not
                // become decoration.
                style={{ opacity: !scrubbing || active >= i ? 1 : 0.45 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px bg-brass transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
                    style={{ width: !scrubbing || active >= i ? 28 : 12 }}
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
      </div>
    </div>
  );
}

/** Static fallback — also the real markup for mobile and reduced motion. */
function StaticSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s) => (
        <li key={s.n} className="bg-paper p-6">
          <span className="tnum text-[13px] text-brick">{s.n}</span>
          <h3 className="mt-3 text-[20px]">{s.t}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
