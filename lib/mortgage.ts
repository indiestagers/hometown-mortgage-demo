/**
 * Mortgage math. Kept pure and unit-testable — no UI concerns here.
 *
 * These are industry-standard approximations suitable for an on-page
 * estimator. They are NOT a pre-approval and must always be labeled as such.
 */

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * Monthly principal + interest for a fully amortizing fixed-rate loan.
 * Handles the 0% edge case (straight division) rather than dividing by zero.
 */
export function monthlyPI(
  principal: number,
  annualRatePct: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

/**
 * Estimated monthly mortgage insurance.
 * Conventional PMI drops off at 20% equity; FHA MIP generally does not.
 */
export function monthlyMI(
  loanAmount: number,
  downPct: number,
  program: "conventional" | "fha" | "va" | "usda",
): number {
  if (loanAmount <= 0) return 0;
  switch (program) {
    case "va":
      return 0; // No monthly MI on VA.
    case "fha":
      return (loanAmount * 0.0055) / 12; // ~0.55% annual MIP
    case "usda":
      return (loanAmount * 0.0035) / 12; // ~0.35% annual guarantee fee
    case "conventional":
      if (downPct >= 20) return 0;
      // PMI rises as the down payment shrinks.
      if (downPct >= 15) return (loanAmount * 0.0035) / 12;
      if (downPct >= 10) return (loanAmount * 0.005) / 12;
      return (loanAmount * 0.0075) / 12;
  }
}

export type PaymentBreakdown = {
  principalInterest: number;
  taxes: number;
  insurance: number;
  mortgageInsurance: number;
  total: number;
  loanAmount: number;
};

export function estimatePayment(opts: {
  homePrice: number;
  downPct: number;
  ratePct: number;
  years: number;
  program: "conventional" | "fha" | "va" | "usda";
  /** Effective annual property tax rate. KC metro runs ~1.2–1.4%. */
  taxRatePct?: number;
  /** Annual homeowner's insurance premium. */
  annualInsurance?: number;
}): PaymentBreakdown {
  const {
    homePrice,
    downPct,
    ratePct,
    years,
    program,
    taxRatePct = 1.3,
    annualInsurance = 1800,
  } = opts;

  const down = homePrice * (downPct / 100);
  const loanAmount = Math.max(0, homePrice - down);

  const principalInterest = monthlyPI(loanAmount, ratePct, years);
  const taxes = (homePrice * (taxRatePct / 100)) / 12;
  const insurance = annualInsurance / 12;
  const mortgageInsurance = monthlyMI(loanAmount, downPct, program);

  return {
    principalInterest,
    taxes,
    insurance,
    mortgageInsurance,
    loanAmount,
    total: principalInterest + taxes + insurance + mortgageInsurance,
  };
}

/**
 * Largest home price whose total monthly payment fits the target payment,
 * found by binary search (the payment function is monotonic in price, so
 * this converges reliably and avoids a closed-form inversion of the MI tiers).
 */
export function maxHomePrice(opts: {
  targetMonthly: number;
  downPct: number;
  ratePct: number;
  years: number;
  program: "conventional" | "fha" | "va" | "usda";
  taxRatePct?: number;
  annualInsurance?: number;
}): number {
  const { targetMonthly, ...rest } = opts;
  if (targetMonthly <= 0) return 0;

  let lo = 0;
  let hi = 5_000_000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const { total } = estimatePayment({ homePrice: mid, ...rest });
    if (total > targetMonthly) hi = mid;
    else lo = mid;
  }
  return Math.floor(lo / 1000) * 1000;
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
