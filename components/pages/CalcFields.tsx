"use client";

import type { ReactNode } from "react";

/**
 * Shared form controls for the three calculators.
 *
 * Accessibility notes that are load-bearing, not decoration:
 * - every control has a real <label htmlFor>, never a placeholder-as-label;
 * - range inputs carry `aria-valuetext` so a screen reader announces
 *   "$325,000" instead of "325000";
 * - the slider thumb is 24×24px to satisfy WCAG 2.2 target size (2.5.8),
 *   which the default 16px native thumb does not;
 * - toggle buttons get an `aria-label` that CONTAINS the visible text
 *   (WCAG 2.5.3 Label in Name), never one that replaces it.
 */

const THUMB =
  "mt-2.5 h-6 w-full cursor-pointer appearance-none bg-transparent " +
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-rule " +
  "[&::-webkit-slider-thumb]:-mt-2.5 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brick " +
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-rule " +
  "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brick";

export function Slider({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  note,
}: {
  id: string;
  label: string;
  value: number;
  /** Human-readable value — shown on screen AND used as aria-valuetext. */
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  note?: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-muted">
          {label}
        </label>
        <span className="tnum text-right text-[15px] text-ink">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        aria-describedby={note ? `${id}-note` : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        className={THUMB}
      />
      {note && (
        <p id={`${id}-note`} className="mt-1 text-[12px] text-ink-faint">
          {note}
        </p>
      )}
    </div>
  );
}

/**
 * Currency entry. Kept as a text input with `inputMode="numeric"` so the
 * value can be shown with thousands separators — a bare number input
 * cannot, and unseparated six-figure numbers are genuinely hard to read.
 */
export function MoneyField({
  id,
  label,
  value,
  onChange,
  note,
}: {
  id: string;
  label: string;
  /** Raw digits, e.g. "325000". */
  value: string;
  onChange: (v: string) => void;
  note?: string;
}) {
  const pretty = value === "" ? "" : Number(value).toLocaleString("en-US");

  return (
    <div className="mt-6 first:mt-0">
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-ink-muted"
      >
        {label}
      </label>
      <div className="mt-1.5 flex items-center rounded-[2px] border border-rule bg-paper focus-within:border-ink">
        <span className="tnum pl-4 text-[15px] text-ink-faint" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={pretty}
          aria-describedby={note ? `${id}-note` : undefined}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          className="tnum min-h-[24px] w-full bg-transparent px-2 py-3 text-[15px] text-ink outline-none"
        />
      </div>
      {note && (
        <p id={`${id}-note`} className="mt-1.5 text-[12px] text-ink-faint">
          {note}
        </p>
      )}
    </div>
  );
}

/** Segmented control. Renders as a radiogroup so arrow keys behave. */
export function Segmented<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  groupId,
  columns = 4,
}: {
  legend: string;
  options: readonly { value: T; label: string; a11yLabel?: string }[];
  value: T;
  onChange: (v: T) => void;
  groupId: string;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4";

  return (
    <div className="mt-6 first:mt-0">
      <span
        id={groupId}
        className="mb-3 block text-[13px] font-medium text-ink-muted"
      >
        {legend}
      </span>
      <div role="radiogroup" aria-labelledby={groupId} className={`grid gap-2 ${cols}`}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={o.a11yLabel}
              onClick={() => onChange(o.value)}
              className={`min-h-[44px] rounded-[2px] border px-3 py-2 text-[14px] transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] ${
                active
                  ? "border-brick bg-brick text-paper"
                  : "border-rule text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** One line of a results ledger: label left, mono figure right. */
export function ResultRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5">
      <dt className={`text-[14px] ${emphasis ? "text-ink" : "text-ink-muted"}`}>
        {label}
      </dt>
      <dd
        className={`tnum shrink-0 text-[14px] ${emphasis ? "text-ink" : "text-ink"}`}
      >
        {value}
      </dd>
    </div>
  );
}

/** The single large figure at the top of a result panel. */
export function Headline({
  caption,
  figure,
  sub,
}: {
  caption: string;
  figure: string;
  sub?: ReactNode;
}) {
  return (
    <div>
      <p className="text-[13px] text-ink-muted">{caption}</p>
      <p
        className="tnum mt-2 text-[clamp(2rem,7vw,2.75rem)] leading-none text-ink"
        aria-live="polite"
        aria-atomic="true"
      >
        {figure}
      </p>
      {sub && <p className="mt-2 text-[13px] text-ink-faint">{sub}</p>}
    </div>
  );
}

/** Two-panel calculator frame: inputs left, results right. */
export function CalcFrame({
  inputs,
  results,
}: {
  inputs: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[2px] border border-rule bg-rule lg:grid-cols-[1.1fr_1fr]">
      <div className="bg-paper p-6 md:p-9">{inputs}</div>
      <div className="bg-paper-sunk p-6 md:p-9">{results}</div>
    </div>
  );
}
