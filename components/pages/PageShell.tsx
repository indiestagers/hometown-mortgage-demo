import Link from "next/link";
import type { ReactNode } from "react";
import { Header, Footer } from "@/components/Chrome";
import { Eyebrow, Section } from "@/components/primitives";

/**
 * Chrome wrapper for every non-home route. Header and Footer come from
 * components/Chrome.tsx unmodified so the chrome is identical site-wide.
 *
 * The header carries the section menu; on non-home routes those anchors do
 * not exist, which is why this shell renders chrome only.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

export type Crumb = { href: string; label: string };

/**
 * Breadcrumb + eyebrow + the page's single <h1> + standfirst.
 * `title` is the only h1 on the page — no other component emits one.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs = [],
  aside,
}: {
  eyebrow: string;
  title: string;
  lead: string | string[];
  crumbs?: Crumb[];
  aside?: ReactNode;
}) {
  const paragraphs = Array.isArray(lead) ? lead : [lead];

  return (
    <Section className="pt-10 pb-16 md:pt-14 md:pb-20">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-faint">
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-2">
                <Link
                  href={c.href}
                  className="inline-block py-1.5 underline underline-offset-4 hover:text-ink"
                >
                  {c.label}
                </Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
            <li aria-current="page" className="py-1.5 text-ink-muted">
              {title}
            </li>
          </ol>
        </nav>
      )}

      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.5rem,5vw,3.5rem)]">{title}</h1>
          <div className="measure mt-7 space-y-5 text-[20px] text-ink-muted">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        {aside ? <div className="lg:pt-4">{aside}</div> : null}
      </div>
    </Section>
  );
}

/** Section heading pattern: brass rule + eyebrow + h2. */
export function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-6 max-w-[22ch] text-[clamp(1.875rem,4vw,2.75rem)]">
        {title}
      </h2>
      {intro && <p className="measure mt-6 text-ink-muted">{intro}</p>}
    </div>
  );
}

/**
 * The estimate/not-a-pre-approval caveat. Rendered anywhere a dollar figure
 * is shown. Bordered rather than filled — no new tokens.
 */
export function Caveat({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[2px] border border-rule px-4 py-3 text-[13px] leading-relaxed text-ink-faint">
      {children}
    </p>
  );
}

/**
 * Explicit, visible list of facts that could not be sourced. Left in the
 * build on purpose: an invented closed-loan count on a licensed originator's
 * site is a worse outcome than an obvious placeholder.
 */
export function NeedsConfirmation({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-[2px] border border-brass/40 px-5 py-4">
      <p className="eyebrow">Needs confirmation before launch</p>
      <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-ink-faint">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2.5 h-px w-3 shrink-0 bg-brass" aria-hidden="true" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
