"use client";

import { useId, useMemo, useState } from "react";
import { maxHomePrice, usd, clamp } from "@/lib/mortgage";
import { housingBudgetFromDti, breakdownAtPrice } from "@/lib/calc";
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
  { value: 30, label: "30 yr", a11yLabel: "30 yr term" },
];

/**
 * Works backwards from a debt-to-income ceiling to a purchase price, using
 * the same payment model as the purchase calculator so the two agree.
 */
export function AffordabilityCalculator() {
  const uid = useId();
  const [income, setIncome] = useState("8500");
  const [debts, setDebts] = useState("650");
  const [dti, setDti] = useState(45);
  const [downPct, setDownPct] = useState(5);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [program, setProgram] = useState<ProgramSlug>("conventional");

  const minDown = MIN_DOWN[program];
  const effectiveDown = Math.max(downPct, minDown);
  const grossMonthlyIncome = Number(income || 0);
  const monthlyDebts = Number(debts || 0);

  const budget = useMemo(
    () => housingBudgetFromDti({ grossMonthlyIncome, monthlyDebts, dtiPct: dti }),
    [grossMonthlyIncome, monthlyDebts, dti],
  );

  const price = useMemo(
    () =>
      maxHomePrice({
        targetMonthly: budget,
        downPct: effectiveDown,
        ratePct: rate,
        years,
        program,
      }),
    [budget, effectiveDown, rate, years, program],
  );

  const breakdown = useMemo(
    () =>
      breakdownAtPrice({
        homePrice: price,
        downPct: effectiveDown,
        ratePct: rate,
        years,
        program,
      }),
    [price, effectiveDown, rate, years, program],
  );

  const downDollars = price * (effectiveDown / 100);

  return (
    <CalcFrame
      inputs={
        <fieldset className="border-0 p-0">
          <legend className="sr-only">Affordability inputs</legend>

          <MoneyField
            id={`${uid}-income`}
            label="Gross household income, per month"
            value={income}
            onChange={setIncome}
            note="Before taxes. Only income you can document counts — underwriting averages self-employment from tax returns."
          />

          <MoneyField
            id={`${uid}-debts`}
            label="Other monthly debt payments"
            value={debts}
            onChange={setDebts}
            note="Car payments, student loans, credit card minimums, child support. Not groceries, utilities, or phone."
          />

          <Slider
            id={`${uid}-dti`}
            label="Debt-to-income ceiling"
            value={dti}
            display={`${dti}%`}
            min={30}
            max={50}
            step={1}
            onChange={setDti}
            note="45% is a reasonable working assumption. Automated underwriting goes higher on strong files and lower on thin ones — this is not a number you get to choose."
          />

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
            id={`${uid}-down`}
            label="Down payment"
            value={effectiveDown}
            display={`${effectiveDown}%`}
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
            columns={2}
          />
        </fieldset>
      }
      results={
        <div>
          <Headline
            caption="Estimated purchase price you could support"
            figure={usd(price)}
            sub={
              budget > 0 ? (
                <>
                  at a total payment of{" "}
                  <span className="tnum">{usd(breakdown.total)}</span> per month
                </>
              ) : (
                "Your existing debt payments already use the whole ratio."
              )
            }
          />

          <dl className="mt-7 border-t border-rule">
            <ResultRow
              label="Monthly housing budget"
              value={usd(budget)}
              emphasis
            />
            <ResultRow
              label="Principal & interest"
              value={usd(breakdown.principalInterest)}
            />
            <ResultRow label="Property taxes" value={usd(breakdown.taxes)} />
            <ResultRow
              label="Homeowner's insurance"
              value={usd(breakdown.insurance)}
            />
            <ResultRow
              label="Mortgage insurance"
              value={
                breakdown.mortgageInsurance > 0
                  ? usd(breakdown.mortgageInsurance)
                  : "—"
              }
            />
          </dl>

          <dl className="mt-7 border-t border-rule">
            <ResultRow label="Cash needed for the down payment" value={usd(downDollars)} />
            <ResultRow label="Loan amount" value={usd(breakdown.loanAmount)} />
          </dl>

          <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
            This is the ceiling, not a recommendation. Plenty of people who
            qualify at the top of this range should buy below it — the number
            does not know about your childcare, your retirement contributions, or
            the roof you will replace in year four.
          </p>

          <p className="mt-4 text-[13px] leading-relaxed text-ink-faint">
            {ESTIMATE_DISCLAIMER} Taxes assume a 1.3% effective KC-metro rate and
            insurance of $1,800 a year; HOA dues and closing costs are not
            included.
          </p>

          <ButtonLink href="/contact#start" className="mt-6 w-full">
            Get a real pre-approval number
          </ButtonLink>
        </div>
      }
    />
  );
}
