"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Estimate = {
  homePrice: number;
  downPct: number;
  ratePct: number;
  years: number;
  program: "conventional" | "fha" | "va" | "usda";
  programLabel: string;
  monthlyTotal: number;
  loanAmount: number;
};

type Ctx = {
  estimate: Estimate | null;
  setEstimate: (e: Estimate | null) => void;
};

const EstimateCtx = createContext<Ctx>({ estimate: null, setEstimate: () => {} });

/**
 * Carries the payment estimate from the estimator to the lead form.
 *
 * Without this the estimator was a dead end: the user built a number, clicked
 * "have Josh check these", and landed on an empty form that knew nothing about
 * it — so Josh received "first home / within 3 months" instead of "$325,000,
 * conventional, 5% down, $2,647/mo". That is the single most valuable field on
 * the whole page, and it was being discarded.
 *
 * It is also precisely the "calculators are dead ends" defect docs/AUDIT.md
 * indicts on the current live site, so reproducing it here would undercut the
 * pitch.
 */
export function EstimateProvider({ children }: { children: ReactNode }) {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  return (
    <EstimateCtx.Provider value={{ estimate, setEstimate }}>
      {children}
    </EstimateCtx.Provider>
  );
}

export const useEstimate = () => useContext(EstimateCtx);
