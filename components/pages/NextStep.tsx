import Link from "next/link";
import { site } from "@/site.config";
import { ButtonLink, Section } from "@/components/primitives";
import { SectionHead } from "./PageShell";
import { programDetails, programOrder, type ProgramSlug } from "@/lib/program-content";

/**
 * Closing call-to-action. The id is `start` on purpose — the header's
 * "Get started" button links to `#start`, and without this anchor that
 * button would do nothing on any page other than the homepage.
 */
export function NextStep({
  title = "Talk to me before you talk to a portal.",
  intro = "Fifteen minutes on the phone tells us more than an hour of forms. No credit pull, no application, no obligation.",
}: {
  title?: string;
  intro?: string;
}) {
  return (
    <Section id="start" className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <SectionHead eyebrow="Next step" title={title} intro={intro} />

        <div className="border-t border-rule pt-8 lg:pt-4">
          <a
            href={site.loanOfficer.phoneHref}
            className="tnum block text-[clamp(1.75rem,6vw,2.25rem)] leading-none hover:text-brick"
          >
            {site.loanOfficer.phone}
          </a>
          <p className="mt-3 text-[14px] text-ink-faint">
            {site.loanOfficer.name}, {site.loanOfficer.title} ·{" "}
            <span className="tnum">NMLS #{site.loanOfficer.nmls}</span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">Answer three questions</ButtonLink>
            <a
              href={site.loanOfficer.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[2px] border border-rule px-6 py-3.5 text-[15px] font-medium text-ink transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:border-ink hover:bg-paper-sunk"
            >
              Put time on my calendar
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Sibling program links, shown at the foot of every program detail page. */
export function OtherPrograms({ current }: { current: ProgramSlug }) {
  const others = programOrder.filter((s) => s !== current);
  return (
    <Section className="py-16 md:py-20">
      <h2 className="text-[clamp(1.5rem,3.5vw,2rem)]">The other three</h2>
      <ul className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-3">
        {others.map((slug) => {
          const p = programDetails[slug];
          return (
            <li key={slug} className="bg-paper">
              <Link
                href={`/programs/${slug}`}
                className="flex h-full flex-col p-6 transition-colors duration-[160ms] hover:bg-paper-sunk"
              >
                <span className="font-display text-[24px] leading-none">
                  {p.name}
                </span>
                <span className="mt-3 text-[13px] text-ink-faint">
                  from <span className="tnum text-brick">{p.facts[0].value}</span>{" "}
                  down
                </span>
                <span className="mt-3 text-[14px] leading-snug text-ink-muted">
                  {p.lead.split(". ")[0]}.
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

const CALCULATORS = [
  {
    href: "/calculators/purchase",
    name: "Purchase",
    blurb: "Full payment on a house at a given price, taxes and insurance included.",
  },
  {
    href: "/calculators/refinance",
    name: "Refinance",
    blurb: "Break-even on closing costs, and what a longer term really costs you.",
  },
  {
    href: "/calculators/affordability",
    name: "Affordability",
    blurb: "Works backwards from your income and debts to a purchase price.",
  },
];

/** Cross-links between the three calculators. `exclude` hides the current one. */
export function CalculatorNav({ exclude }: { exclude?: string }) {
  const items = CALCULATORS.filter((c) => c.href !== exclude);
  return (
    <Section className="py-16 md:py-20">
      <h2 className="text-[clamp(1.5rem,3.5vw,2rem)]">
        {exclude ? "The other calculators" : "Three calculators"}
      </h2>
      <ul className="mt-8 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <li key={c.href} className="bg-paper">
            <Link
              href={c.href}
              className="flex h-full flex-col p-6 transition-colors duration-[160ms] hover:bg-paper-sunk"
            >
              <span className="font-display text-[24px] leading-none">
                {c.name}
              </span>
              <span className="mt-3 text-[14px] leading-snug text-ink-muted">
                {c.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
