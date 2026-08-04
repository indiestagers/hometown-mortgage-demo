"use client";

import { useId, useMemo, useState } from "react";
import { estimatePayment, usd, clamp } from "@/lib/mortgage";
import { ESTIMATE_DISCLAIMER } from "@/lib/program-content";
import { ButtonLink } from "@/components/primitives";
import {
  CalcFrame,
  Headline,
  MoneyField,
  ResultRow,
  Segmented,
  Slider,
} from "./CalcFields";

type ProgramSlug = "conventional" | "fha" | "va" | "usda";

const MIN_DOWN: Record<ProgramSlug, number> = {
  conventional: 3,
  fha: 3.5,
  va: 0,
  usda: 0,
};

const PROGRAM_OPTIONS = [
  { value: "conventional" as const, label: "Conventional" },
  { value: "fha" as const, label: "FHA" },
  { value: "va" as const, label: "VA" },
  { value: "usda" as const, label: "USDA" },
];

const TERM_OPTIONS = [
  { value: 15, label: "15 yr", a11yLabel: "15 yr term" },
  { value: 20, label: "20 yr", a11yLabel: "20 yr term" },
  { value: 30, label: "30 yr", a11yLabel: "30 yr term" },
];

/** Full PITI purchase estimate with editable taxes and insurance. */
export function PurchaseCalculator() {
  const uid = useId();
  const [price, setPrice] = useState(325_000);
  const [downPct, setDownPct] = useState(5);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [program, setProgram] = useState<ProgramSlug>("conventional");
  const [taxRate, setTaxRate] = useState(1.3);
  const [insurance, setInsurance] = useState("1800");
  const [hoa, setHoa] = useState("0");

  const minDown = MIN_DOWN[program];
  const effectiveDown = Math.max(downPct, minDown);
  const annualInsurance = Number(insurance || 0);
  const monthlyHoa = Number(hoa || 0);

  const result = useMemo(
    () =>
      estimatePayment({
        homePrice: price,
        downPct: effectiveDown,
        ratePct: rate,
        years,
        program,
        taxRatePct: taxRate,
        annualInsurance,
      }),
    [price, effectiveDown, rate, years, program, taxRate, annualInsurance],
  );

  const downDollars = price * (effectiveDown / 100);
  const total = result.total + monthlyHoa;

  return (
    <div>
      <CalcFrame
        inputs={
          <fieldset className="border-0 p-0">
            <legend className="sr-only">Purchase payment inputs</legend>

            <Segmented
              groupId={`${uid}-program`}
              legend="Loan program"
              options={PROGRAM_OPTIONS}
              value={program}
              onChange={(v) => {
                setProgram(v);
                setDownPct((d) => Math.max(d, MIN_DOWN[v]));
              }}
            />

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
              display={`${effectiveDown}% · ${usd(downDollars)}`}
              min={0}
              max={40}
              step={0.5}
              onChange={(v) => setDownPct(clamp(v, minDown, 40))}
              note={
                minDown > 0
                  ? `${PROGRAM_OPTIONS.find((p) => p.value === program)?.label} requires at least ${minDown}%`
                  : "No down payment required on this program"
              }
            />

            <Slider
              id={`${uid}-rate`}
              label="Interest rate"
              value={rate}
              display={`${rate.toFixed(3).replace(/0$/, "")}%`}
              min={3}
              max={10}
              step={0.125}
              onChange={setRate}
              note="Your number, not a quote. Call me for a real one."
            />

            <Segmented
              groupId={`${uid}-term`}
              legend="Term"
              options={TERM_OPTIONS}
              value={years}
              onChange={setYears}
              columns={3}
            />

            <Slider
              id={`${uid}-tax`}
              label="Property tax rate"
              value={taxRate}
              display={`${taxRate.toFixed(2)}% · ${usd((price * taxRate) / 100)}/yr`}
              min={0.5}
              max={2.5}
              step={0.05}
              onChange={setTaxRate}
              note="KC metro runs roughly 1.1–1.6% effective, and it moves across the state line. Use the actual county figure when you have it."
            />

            <MoneyField
              id={`${uid}-ins`}
              label="Homeowner's insurance, per year"
              value={insurance}
              onChange={setInsurance}
            />

            <MoneyField
              id={`${uid}-hoa`}
              label="HOA dues, per month"
              value={hoa}
              onChange={setHoa}
              note="Leave at 0 if there is no association."
            />
          </fieldset>
        }
        results={
          <div>
            <Headline
              caption="Estimated monthly payment"
              figure={usd(total)}
              sub={
                <>
                  on a <span className="tnum">{usd(result.loanAmount)}</span> loan
                </>
              }
            />

            <dl className="mt-7 border-t border-rule">
              <ResultRow
                label="Principal & interest"
                value={usd(result.principalInterest)}
              />
              <ResultRow label="Property taxes" value={usd(result.taxes)} />
              <ResultRow
                label="Homeowner's insurance"
                value={result.insurance > 0 ? usd(result.insurance) : "—"}
              />
              <ResultRow
                label="Mortgage insurance"
                value={
                  result.mortgageInsurance > 0
                    ? usd(result.mortgageInsurance)
                    : "—"
                }
              />
              <ResultRow
                label="HOA dues"
                value={monthlyHoa > 0 ? usd(monthlyHoa) : "—"}
              />
            </dl>

            <dl className="mt-7 border-t border-rule">
              <ResultRow label="Down payment" value={usd(downDollars)} emphasis />
              <ResultRow
                label="Loan amount"
                value={usd(result.loanAmount)}
                emphasis
              />
            </dl>

            <p className="mt-5 text-[12px] leading-relaxed text-ink-faint">
              {ESTIMATE_DISCLAIMER}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
              Closing costs are not included above. Neither is FHA&apos;s upfront
              premium or USDA&apos;s upfront guarantee fee — both are normally
              financed into the balance, which raises the payment somewhat.
            </p>

            <ButtonLink href="/contact#start" className="mt-6 w-full">
              Have Josh check these numbers
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
