"use client";

import { useId, useMemo, useState } from "react";
import { estimatePayment, usd, clamp } from "@/lib/mortgage";
import { programs } from "@/site.config";
import { Button } from "./primitives";
import { useEstimate } from "./EstimateContext";

type ProgramSlug = "conventional" | "fha" | "va" | "usda";

const MIN_DOWN: Record<ProgramSlug, number> = {
  conventional: 3,
  fha: 3.5,
  va: 0,
  usda: 0,
};

/**
 * On-page payment estimator. The current site sends every visitor off-domain
 * to a full application; this captures intent on-site first.
 */
export function Estimator() {
  const uid = useId();
  const { setEstimate } = useEstimate();
  const [price, setPrice] = useState(325_000);
  const [downPct, setDownPct] = useState(5);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [program, setProgram] = useState<ProgramSlug>("conventional");

  const minDown = MIN_DOWN[program];
  const effectiveDown = Math.max(downPct, minDown);

  const result = useMemo(
    () =>
      estimatePayment({
        homePrice: price,
        downPct: effectiveDown,
        ratePct: rate,
        years,
        program,
      }),
    [price, effectiveDown, rate, years, program],
  );

  const rows = [
    { label: "Principal & interest", value: result.principalInterest },
    { label: "Property taxes (est.)", value: result.taxes },
    { label: "Homeowner's insurance (est.)", value: result.insurance },
    {
      label: program === "va" ? "Mortgage insurance" : "Mortgage insurance (est.)",
      value: result.mortgageInsurance,
    },
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-[2px] border border-rule bg-rule lg:grid-cols-[1.1fr_1fr]">
      {/* Inputs */}
      <div className="bg-paper p-7 md:p-9">
        <fieldset className="border-0 p-0">
          <legend className="sr-only">Estimate your monthly payment</legend>

          {/* Program */}
          <div role="radiogroup" aria-labelledby={`${uid}-prog`} className="mb-8">
            <span
              id={`${uid}-prog`}
              className="mb-3 block text-[13px] font-medium text-ink-muted"
            >
              Loan program
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {programs.map((p) => {
                const active = program === p.slug;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setProgram(p.slug as ProgramSlug);
                      setDownPct((d) => Math.max(d, MIN_DOWN[p.slug as ProgramSlug]));
                    }}
                    className={`rounded-[2px] border px-4 py-2 text-[15px] transition-colors duration-[160ms] ${
                      active
                        ? "border-brick bg-brick text-paper"
                        : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Slider
            id={`${uid}-price`}
            label="Home price"
            value={price}
            display={usd(price)}
            min={75_000}
            max={1_200_000}
            step={5_000}
            onChange={setPrice}
          />

          <Slider
            id={`${uid}-down`}
            label="Down payment"
            value={effectiveDown}
            display={`${effectiveDown}% · ${usd(price * (effectiveDown / 100))}`}
            min={0}
            max={40}
            step={0.5}
            onChange={(v) => setDownPct(clamp(v, minDown, 40))}
            note={
              minDown > 0
                ? `${programs.find((p) => p.slug === program)?.name} requires at least ${minDown}%`
                : undefined
            }
          />

          <Slider
            id={`${uid}-rate`}
            label="Interest rate"
            value={rate}
            display={`${rate.toFixed(2)}%`}
            min={3}
            max={10}
            step={0.125}
            onChange={setRate}
          />

          <div className="mt-6">
            <span className="mb-3 block text-[13px] font-medium text-ink-muted">
              Term
            </span>
            <div className="flex gap-2">
              {[15, 20, 30].map((y) => (
                <button
                  key={y}
                  type="button"
                  aria-pressed={years === y}
                  /* WCAG 2.5.3: the accessible name must contain the visible
                     text, which reads "15 yr" — not "15 year". */
                  aria-label={`${y} yr term`}
                  onClick={() => setYears(y)}
                  className={`rounded-[2px] border px-4 py-2 text-[15px] transition-colors duration-[160ms] ${
                    years === y
                      ? "border-ink bg-ink text-paper"
                      : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  <span className="tnum">{y}</span> yr
                </button>
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      {/* Result */}
      <div className="bg-paper-sunk p-7 md:p-9">
        <p className="text-[13px] text-ink-muted">Estimated monthly payment</p>
        <p
          className="tnum mt-2 text-[40px] leading-none text-ink"
          aria-live="polite"
          aria-atomic="true"
        >
          {usd(result.total)}
        </p>
        <p className="mt-2 text-[13px] text-ink-faint">
          on a <span className="tnum">{usd(result.loanAmount)}</span> loan
        </p>

        <dl className="mt-7 border-t border-rule">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-baseline justify-between border-b border-rule py-3"
            >
              <dt className="text-[15px] text-ink-muted">{r.label}</dt>
              <dd className="tnum text-[15px] text-ink">
                {r.value > 0 ? usd(r.value) : "—"}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-[13px] leading-relaxed text-ink-faint">
          An estimate, not a pre-approval. Taxes assume a 1.3% effective KC-metro
          rate and insurance $1,800/yr; your actual figures depend on the property,
          your credit, and current pricing.
        </p>

        <Button
          className="mt-6 w-full"
          onClick={() => {
            // Hand the numbers to the lead form instead of discarding them.
            setEstimate({
              homePrice: price,
              downPct: effectiveDown,
              ratePct: rate,
              years,
              program,
              programLabel:
                programs.find((p) => p.slug === program)?.name ?? program,
              monthlyTotal: result.total,
              loanAmount: result.loanAmount,
            });
            document
              .getElementById("start")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Have Josh check these numbers
        </Button>
      </div>
    </div>
  );
}

function Slider({
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
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  note?: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-muted">
          {label}
        </label>
        <span className="tnum text-[15px] text-ink">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        /* Screen readers otherwise announce the raw number ("325000"). */
        aria-valuetext={display}
        aria-describedby={note ? `${id}-note` : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-rule accent-brick"
      />
      {note && (
        <p id={`${id}-note`} className="mt-2 text-[13px] text-ink-faint">
          {note}
        </p>
      )}
    </div>
  );
}
