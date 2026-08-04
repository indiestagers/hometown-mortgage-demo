import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/pages/PageShell";
import { AffordabilityCalculator } from "@/components/pages/AffordabilityCalculator";
import { CalculatorNav, NextStep } from "@/components/pages/NextStep";

export const metadata: Metadata = {
  title: "Affordability calculator",
  description:
    "Work backwards from your income and existing debts to a realistic Kansas City purchase price — before you start looking at houses.",
};

export default function AffordabilityCalculatorPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Calculator"
        title="How much house is actually sensible?"
        lead={[
          "This works backwards: from what you earn and what you already owe, to the price you can carry without the payment running your life.",
          "It shows the number underwriting would allow and a more conservative one. They are rarely the same, and the gap is worth a conversation.",
        ]}
        crumbs={[{ href: "/calculators/affordability", label: "Calculators" }]}
      />
      <AffordabilityCalculator />
      <CalculatorNav exclude="/calculators/affordability" />
      <NextStep />
    </PageShell>
  );
}
