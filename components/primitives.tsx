import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Buttons — 2px radius, no gradients, borders over shadows. */

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] px-6 py-3.5 text-[15px] font-medium transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)]";

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-brick text-paper hover:bg-brick-deep"
      : "border border-rule text-ink hover:border-ink hover:bg-paper-sunk";
  return (
    <Link className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-brick text-paper hover:bg-brick-deep disabled:bg-ink-faint disabled:cursor-not-allowed"
      : "border border-rule text-ink hover:border-ink hover:bg-paper-sunk";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** Section label: brass hairline + all-caps eyebrow. Used on every section. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="rule-brass" aria-hidden="true" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

/** Consistent section shell with the asymmetric grid and scroll target. */
export function Section({
  id,
  children,
  className = "",
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${bleed ? "" : "px-6 md:px-10"} ${className}`}
    >
      {bleed ? children : <div className="mx-auto max-w-6xl">{children}</div>}
    </section>
  );
}
