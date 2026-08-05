"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";

const SECTIONS = [
  { id: "thesis", label: "Why me" },
  { id: "programs", label: "Loan programs" },
  { id: "estimate", label: "Estimate" },
  { id: "process", label: "How it works" },
  { id: "reviews", label: "Reviews" },
  { id: "area", label: "Where I lend" },
  { id: "start", label: "Get started" },
];

/**
 * Persistent left index, desktop only. The signature layout element —
 * it gives the page an editorial/ledger spine instead of a stack of bands.
 */
export function LedgerRail() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-label="Page sections"
      className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col justify-between border-r border-rule px-7 py-10 lg:flex"
    >
      <nav>
        {/* py-2 keeps each target ≥24px tall (WCAG 2.5.8 target size). */}
        <ul>
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center gap-3 py-2 text-[13px] transition-colors duration-[160ms] ${
                    isActive ? "text-ink" : "text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-px transition-all duration-[160ms] ${
                      isActive ? "w-5 bg-brick" : "w-2.5 bg-rule group-hover:w-4"
                    }`}
                  />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="text-[13px] leading-relaxed text-ink-faint">
        <a
          href={site.loanOfficer.phoneHref}
          className="tnum block text-[15px] text-ink hover:text-brick"
        >
          {site.loanOfficer.phone}
        </a>
        <p className="mt-2">{site.loanOfficer.name}</p>
        <p className="tnum">NMLS #{site.loanOfficer.nmls}</p>
      </div>
    </aside>
  );
}
