"use client";

import { useId, useMemo, useState } from "react";
import { usd } from "@/lib/mortgage";
import { compareRefinance, formatMonths } from "@/lib/calc";
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

const TERM_OPTIONS = [
  { value: 15, label: "15 yr", a11yLabel: "15 yr new term" },
  { value: 20, label: "20 yr", a11yLabel: "20 yr new term" },
  { value: 30, label: "30 yr", a11yLabel: "30 yr new term" },
];

const COST_OPTIONS = [
  { value: "finance" as const, label: "Roll into the loan" },
  { value: "cash" as const, label: "Pay at closing" },
];

/**
 * Refinance comparison. Principal and interest only on both sides — taxes,
 * insurance, and HOA do not change when you refinance, so including them
 * would just pad both numbers by the same amount and hide the difference.
 */
export function RefinanceCalculator() {
  const uid = useId();
  const [balance, setBalance] = useState("285000");
  const [currentRate, setCurrentRate] = useState(7.25);
  const [remainingYears, setRemainingYears] = useState(27);
  const [newRate, setNewRate] = useState(6.25);
  const [newYears, setNewYears] = useState(30);
  const [closingCosts, setClosingCosts] = useState("4500");
  const [cashOut, setCashOut] = useState("0");
  const [costHandling, setCostHandling] = useState<"finance" | "cash">("finance");

  const result = useMemo(
    () =>
      compareRefinance({
        currentBalance: Number(balance || 0),
        currentRatePct: currentRate,
        remainingYears,
        newRatePct: newRate,
        newYears,
        closingCosts: Number(closingCosts || 0),
        cashOut: Number(cashOut || 0),
        financeCosts: costHandling === "finance",
      }),
    [
      balance,
      currentRate,
      remainingYears,
      newRate,
      newYears,
      closingCosts,
      cashOut,
      costHandling,
    ],
  );

  const saves = result.monthlySavings > 0;
  const interestBetter = result.lifetimeInterestDifference > 0;

  return (
    <CalcFrame
      inputs={
        <fieldset className="border-0 p-0">
          <legend className="sr-only">Refinance comparison inputs</legend>

          <p className="mb-6 text-[13px] text-ink-faint">Your loan today</p>

          <MoneyField
            id={`${uid}-balance`}
            label="Current principal balance"
            value={balance}
            onChange={setBalance}
            note="What you still owe — not what you originally borrowed."
          />

          <Slider
            id={`${uid}-cur-rate`}
            label="Current interest rate"
            value={currentRate}
            display={`${currentRate.toFixed(3).replace(/0$/, "")}%`}
            min={2}
            max={12}
            step={0.125}
            onChange={setCurrentRate}
          />

          <Slider
            id={`${uid}-remaining`}
            label="Years left on the loan"
            value={remainingYears}
            display={`${remainingYears} yr`}
            min={1}
            max={30}
            step={1}
            onChange={setRemainingYears}
          />

          <p className="mt-10 mb-6 border-t border-rule pt-8 text-[13px] text-ink-faint">
            The loan you are considering
          </p>

          <Slider
            id={`${uid}-new-rate`}
            label="New interest rate"
            value={newRate}
            display={`${newRate.toFixed(3).replace(/0$/, "")}%`}
            min={2}
            max={12}
            step={0.125}
            onChange={setNewRate}
            note="Your number, not a quote. Call me for a real one."
          />

          <Segmented
            groupId={`${uid}-new-term`}
            legend="New term"
            options={TERM_OPTIONS}
            value={newYears}
            onChange={setNewYears}
            columns={3}
          />

          <MoneyField
            id={`${uid}-costs`}
            label="Estimated closing costs"
            value={closingCosts}
            onChange={setClosingCosts}
            note="Lender fees, title, appraisal, and prepaids. I will itemize yours before you commit."
          />

          <Segmented
            groupId={`${uid}-handling`}
            legend="Closing costs"
            options={COST_OPTIONS}
            value={costHandling}
            onChange={setCostHandling}
            columns={2}
          />

          <MoneyField
            id={`${uid}-cashout`}
            label="Cash out at closing"
            value={cashOut}
            onChange={setCashOut}
            note="Leave at 0 for a straight rate-and-term refinance."
          />
        </fieldset>
      }
      results={
        <div>
          <Headline
            caption={
              saves ? "Lower monthly payment by" : "Higher monthly payment by"
            }
            figure={usd(Math.abs(result.monthlySavings))}
            sub={
              <>
                <span className="tnum">{usd(result.currentPI)}</span> today vs{" "}
                <span className="tnum">{usd(result.newPI)}</span> after
              </>
            }
          />

          <dl className="mt-7 border-t border-rule">
            <ResultRow label="New loan amount" value={usd(result.newLoanAmount)} />
            <ResultRow
              label="Cash due at closing"
              value={
                result.cashDueAtClosing > 0 ? usd(result.cashDueAtClosing) : "—"
              }
            />
            <ResultRow
              label="Break even on costs"
              value={
                result.breakEvenMonths === null
                  ? "Never"
                  : formatMonths(result.breakEvenMonths)
              }
              emphasis
            />
          </dl>

          <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
            {result.breakEvenMonths === null
              ? "The new payment is not lower, so there is nothing to recover. That can still be the right move if you are shortening the term or taking cash out — but it is not a savings play."
              : `If you sell or refinance again before ${formatMonths(result.breakEvenMonths)} from now, this costs you money rather than saving it.`}
          </p>

          <p className="mt-8 text-[13px] text-ink-muted">
            Interest over the life of each loan
          </p>
          <dl className="mt-3 border-t border-rule">
            <ResultRow
              label="Remaining on your current loan"
              value={usd(result.currentRemainingInterest)}
            />
            <ResultRow
              label="Total on the new loan"
              value={usd(result.newTotalInterest)}
            />
            <ResultRow
              label={interestBetter ? "Interest saved" : "Additional interest"}
              value={usd(Math.abs(result.lifetimeInterestDifference))}
              emphasis
            />
          </dl>

          <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
            {interestBetter
              ? "Lower payment and less total interest. That is the clean case."
              : "Read this line before you sign anything. A lower payment bought by restarting a 30-year clock can still cost more in total interest than the loan you have. Sometimes that trade is worth it — cash flow is real — but you should make it on purpose."}
          </p>

          <p className="mt-6 text-[12px] leading-relaxed text-ink-faint">
            {ESTIMATE_DISCLAIMER} Principal and interest only — property taxes
            and homeowner&apos;s insurance are excluded on both sides because
            escrow does not change with a refinance. If part of your reason for
            refinancing is dropping mortgage insurance, that saving comes on top
            of the figure above; tell me and I will run it properly.
          </p>

          <ButtonLink href="/contact#start" className="mt-6 w-full">
            Have Josh check these numbers
          </ButtonLink>
        </div>
      }
    />
  );
}
