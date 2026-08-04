import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/pages/PageShell";
import { PurchaseCalculator } from "@/components/pages/PurchaseCalculator";
import { CalculatorNav, NextStep } from "@/components/pages/NextStep";

export const metadata: Metadata = {
  title: "Purchase calculator",
  description:
    "Estimate the full monthly payment on a Kansas City home — principal, interest, taxes, insurance, and mortgage insurance included.",
};

export default function PurchaseCalculatorPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Calculator"
        title="What will the payment actually be?"
        lead={[
          "Most payment calculators quote you principal and interest and stop there. That number is never what leaves your account.",
          "This one includes property taxes, homeowner's insurance, and mortgage insurance — the three line items that decide whether a house is comfortable or tight.",
        ]}
        crumbs={[{ href: "/calculators/purchase", label: "Calculators" }]}
      />
      <PurchaseCalculator />
      <CalculatorNav exclude="/calculators/purchase" />
      <NextStep />
    </PageShell>
  );
}
