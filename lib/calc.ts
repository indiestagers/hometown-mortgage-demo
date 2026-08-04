/**
 * Additional pure math for the /calculators routes.
 *
 * The core amortization helpers live in `lib/mortgage.ts` and are imported,
 * not duplicated — there must be exactly one implementation of `monthlyPI`
 * in this codebase. Everything here is derived from it.
 *
 * Same rule as everywhere else: these are estimates. Nothing here is a
 * pre-approval, a quote, or a commitment to lend.
 */

import { monthlyPI, estimatePayment, type PaymentBreakdown } from "./mortgage";

/* ── Refinance ────────────────────────────────────────────────────────── */

export type RefinanceInput = {
  /** Current principal balance, not the original loan amount. */
  currentBalance: number;
  currentRatePct: number;
  /** Years left on the existing loan. */
  remainingYears: number;
  newRatePct: number;
  newYears: number;
  /** Lender and third-party costs to close the new loan. */
  closingCosts: number;
  /** Cash taken out at closing, added to the new balance. */
  cashOut: number;
  /** Roll closing costs into the new loan instead of paying them at the table. */
  financeCosts: boolean;
};

export type RefinanceResult = {
  currentPI: number;
  newPI: number;
  newLoanAmount: number;
  /** Positive means the new payment is lower. */
  monthlySavings: number;
  cashDueAtClosing: number;
  /**
   * Months to recover the closing costs out of the monthly savings.
   * `null` when the new payment is not lower — there is nothing to recover.
   */
  breakEvenMonths: number | null;
  /** Interest still owed on the existing loan if it runs to term. */
  currentRemainingInterest: number;
  /** Interest owed on the new loan if it runs to term. */
  newTotalInterest: number;
  /**
   * Current remaining interest minus new total interest. Positive means the
   * refinance costs less interest overall; negative means a lower payment is
   * being bought with a longer term. This is the number most refinance
   * calculators leave out.
   */
  lifetimeInterestDifference: number;
};

export function compareRefinance(input: RefinanceInput): RefinanceResult {
  const {
    currentBalance,
    currentRatePct,
    remainingYears,
    newRatePct,
    newYears,
    closingCosts,
    cashOut,
    financeCosts,
  } = input;

  const currentPI = monthlyPI(currentBalance, currentRatePct, remainingYears);

  const newLoanAmount =
    currentBalance + Math.max(0, cashOut) + (financeCosts ? closingCosts : 0);
  const newPI = monthlyPI(newLoanAmount, newRatePct, newYears);

  const monthlySavings = currentPI - newPI;
  const cashDueAtClosing = financeCosts ? 0 : closingCosts;

  const breakEvenMonths =
    monthlySavings > 0 ? closingCosts / monthlySavings : null;

  const currentRemainingInterest = Math.max(
    0,
    currentPI * remainingYears * 12 - currentBalance,
  );
  const newTotalInterest = Math.max(
    0,
    newPI * newYears * 12 - newLoanAmount,
  );

  return {
    currentPI,
    newPI,
    newLoanAmount,
    monthlySavings,
    cashDueAtClosing,
    breakEvenMonths,
    currentRemainingInterest,
    newTotalInterest,
    lifetimeInterestDifference: currentRemainingInterest - newTotalInterest,
  };
}

/** "2 yr 7 mo" — break-even is meaningless to a buyer expressed in months. */
export function formatMonths(months: number): string {
  const whole = Math.ceil(months);
  const years = Math.floor(whole / 12);
  const rest = whole % 12;
  if (years === 0) return `${rest} mo`;
  if (rest === 0) return `${years} yr`;
  return `${years} yr ${rest} mo`;
}

/* ── Affordability ────────────────────────────────────────────────────── */

/**
 * The monthly housing payment left over once existing debts are subtracted
 * from the debt-to-income ceiling. This is the back-end ratio underwriting
 * actually uses: (housing PITI + all other monthly debt) / gross income.
 */
export function housingBudgetFromDti(opts: {
  grossMonthlyIncome: number;
  monthlyDebts: number;
  /** Back-end DTI ceiling as a percentage. */
  dtiPct: number;
}): number {
  const ceiling = opts.grossMonthlyIncome * (opts.dtiPct / 100);
  return Math.max(0, ceiling - opts.monthlyDebts);
}

/**
 * What the resulting payment is actually made of, so the affordability
 * result can be shown as a breakdown rather than a single opaque number.
 */
export function breakdownAtPrice(opts: {
  homePrice: number;
  downPct: number;
  ratePct: number;
  years: number;
  program: "conventional" | "fha" | "va" | "usda";
}): PaymentBreakdown {
  return estimatePayment(opts);
}
