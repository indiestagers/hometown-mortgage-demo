import Link from "next/link";
import { site, programs, testimonials, brokerage } from "@/site.config";
import { Header, Footer } from "@/components/Chrome";
import { LedgerRail } from "@/components/LedgerRail";
import { Estimator } from "@/components/Estimator";
import { StartForm } from "@/components/StartForm";
import { Reveal } from "@/components/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { PinnedProcess } from "@/components/motion/PinnedProcess";
import { HeroPlate } from "@/components/motion/HeroPlate";
import { ButtonLink, Eyebrow, Section } from "@/components/primitives";

export default function Home() {
  return (
    <div className="flex">
      <LedgerRail />

      <div className="min-w-0 flex-1">
        <Header />

        <main id="main">
          <Hero />
          <Thesis />
          <Programs />
          <Estimate />
          <Process />
          <Reviews />
          <Area />
          <Start />
        </main>

        <Footer />
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────
   Type-led and left-aligned. No stock photography competing with
   the headline — that image is the category's biggest cliché.
   ──────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <Section className="relative bg-ink pt-20 pb-28 md:pt-28 md:pb-36">
      <HeroPlate />
      <div className="relative grid items-start gap-x-16 gap-y-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal immediate>
            <div className="flex items-center gap-3">
              <span className="rule-brass" aria-hidden="true" />
              <span className="eyebrow !text-[color:var(--color-paper-dim)]">
                Kansas City · Kansas &amp; Missouri
              </span>
            </div>
          </Reveal>

          <LineReveal
            immediate
            as="h1"
            className="mt-6 text-paper text-[40px] leading-[1.06] md:text-[56px] lg:text-[64px]"
            lines={["A mortgage broker", "who answers", "his own phone."]}
          />

          <Reveal immediate delay={120}>
            <p className="measure mt-6 text-[20px] text-[color:var(--color-paper-dim)]">
              I&apos;m Josh Pennebaker. I&apos;ve spent my career doing home loans
              in the Kansas City metro — and I do it the way I&apos;d want it done
              for my own family. You get my direct line, not a queue.
            </p>
          </Reveal>

          <Reveal immediate delay={180}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="#start">See what you qualify for</ButtonLink>
              <ButtonLink
                href="#estimate"
                variant="secondary"
                className="border-[color:var(--color-rule-dim)] text-paper hover:border-paper hover:bg-[color:color-mix(in_srgb,var(--color-paper)_10%,transparent)]"
              >
                Estimate a payment
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        {/* Concrete, checkable facts — set in mono, stacked as a ledger.
            Replaces the four unfalsifiable "best-in-class / total
            transparency" claims on the live site, and gives the hero a
            right-hand counterweight instead of dead space. */}
        <Reveal immediate delay={240} className="lg:pt-14">
          <dl className="border-t border-[color:var(--color-rule-dim)]">
            {[
              { k: "Same day", v: "Typical callback — not a queue ticket" },
              { k: "$0", v: "Down payment on VA and USDA loans" },
              { k: "KS + MO", v: "Licensed on both sides of the state line" },
              { k: "One", v: "Person handles your file, start to close" },
            ].map((s) => (
              <div
                key={s.v}
                className="flex items-baseline gap-5 border-b border-[color:var(--color-rule-dim)] py-4"
              >
                <dt className="tnum w-24 shrink-0 text-[19px] leading-none text-paper">
                  {s.k}
                </dt>
                <dd className="text-[14px] leading-snug text-[color:var(--color-paper-dim)]">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Thesis ─────────────────────────────────────────────────── */
function Thesis() {
  return (
    <Section id="thesis" className="py-12 md:py-16">
      <div className="grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Why work with me</Eyebrow>
          </Reveal>
          <LineReveal
            delay={0.05}
            className="mt-6 max-w-[20ch] text-[30px] leading-[1.08] md:text-[40px]"
            lines={["The big lenders give", "you a case number.", "I give you my cell."]}
          />
          <Reveal delay={120}>
            <div className="measure mt-6 space-y-5 text-ink-muted">
              <p>
                Buying a house is the largest transaction most people ever make,
                and it moves fast. When your agent needs an approval letter on a
                Saturday, or the seller wants an answer in two hours, a call
                center cannot help you. I can.
              </p>
              <p>
                I grew up in a small town in southeast Missouri and moved to
                Kansas City in 2011. My family is here. My kids go to school
                here. When I say I know this market, I mean I know which
                neighborhoods appraise, which USDA lines run through Johnson
                County, and which agents actually close.
              </p>
              <p className="text-ink">
                Most of my business comes from people I&apos;ve already helped
                sending me their family. That&apos;s the only marketing I&apos;ve
                ever really needed.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Headshot placeholder — sized to the final aspect ratio. */}
        <Reveal delay={180}>
          <figure className="lg:pt-16">
            <div className="relative aspect-[4/5] w-full border border-rule bg-paper-sunk">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-ink-faint"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8.5" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <p className="text-[12px] leading-relaxed text-ink-faint">
                  Photo placeholder
                  <br />
                  Josh&apos;s headshot goes here
                </p>
              </div>
              <span
                className="absolute left-0 top-0 h-3 w-3 border-l border-t border-brass"
                aria-hidden="true"
              />
              <span
                className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-brass"
                aria-hidden="true"
              />
            </div>
            <figcaption className="mt-3 text-[13px] text-ink-muted">
              {site.loanOfficer.name}
              <span className="block text-ink-faint">
                {site.loanOfficer.title} ·{" "}
                <span className="tnum">NMLS #{site.loanOfficer.nmls}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Programs ───────────────────────────────────────────────── */
function Programs() {
  return (
    <Section id="programs" className="py-12 md:py-16">
      <Reveal>
        <Eyebrow>Loan programs</Eyebrow>
      </Reveal>
      <LineReveal
            delay={0.05}
            className="mt-6 max-w-[22ch] text-[30px] leading-[1.08] md:text-[40px]"
            lines={["Four ways to buy. The", "right one depends on you."]}
          />
      <Reveal delay={120}>
        <p className="measure mt-6 text-ink-muted">
          Every lender offers these. The difference is whether someone actually
          walks you through which one fits — and tells you when a program
          you&apos;d qualify for is the wrong choice.
        </p>
      </Reveal>

      <div className="mt-12 border-t border-rule">
        {programs.map((p, i) => (
          <Reveal key={p.slug} delay={i * 60}>
            <article className="grid gap-6 border-b border-rule py-9 md:grid-cols-[auto_1fr_1fr] md:gap-12">
              <div className="md:w-32">
                <h3 className="text-[28px] leading-none">{p.name}</h3>
                <p className="mt-3 text-[13px] text-ink-faint">
                  from <span className="tnum text-brick">{p.down}</span> down
                </p>
              </div>

              <div>
                <p className="text-ink-muted">{p.summary}</p>
                <p className="mt-4 text-[14px] text-ink">
                  <span className="text-ink-faint">Best for: </span>
                  {p.bestFor}
                </p>
              </div>

              <ul className="space-y-3">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[14px] text-ink-muted">
                    <span
                      className="mt-2.5 h-px w-3 shrink-0 bg-brass"
                      aria-hidden="true"
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Estimator ──────────────────────────────────────────────── */
function Estimate() {
  return (
    <Section id="estimate" className="py-12 md:py-16">
      <Reveal>
        <Eyebrow>Payment estimator</Eyebrow>
      </Reveal>
      <LineReveal
            delay={0.05}
            className="mt-6 max-w-[20ch] text-[30px] leading-[1.08] md:text-[40px]"
            lines={["Run the numbers", "before you call anyone."]}
          />
      <Reveal delay={120}>
        <p className="measure mt-6 text-ink-muted">
          Real math, including taxes, insurance, and mortgage insurance — the
          three things most calculators quietly leave out to make the number look
          better.
        </p>
      </Reveal>
      <Reveal delay={180}>
        <div className="mt-12">
          <Estimator />
        </div>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-6 text-[15px]">
          <span className="text-ink-faint">Go deeper:</span>
          <Link
            href="/calculators/purchase/"
            className="text-brick underline underline-offset-4 hover:text-brick-deep"
          >
            Full purchase calculator →
          </Link>
          <Link
            href="/calculators/affordability/"
            className="text-brick underline underline-offset-4 hover:text-brick-deep"
          >
            What can I afford? →
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── Process ────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    t: "We talk",
    d: "Fifteen minutes on the phone. What you're trying to buy, what you earn, what you owe. No credit pull yet.",
  },
  {
    n: "02",
    t: "You get pre-approved",
    d: "A real underwritten pre-approval, not a prequalification letter. Sellers and agents can tell the difference.",
  },
  {
    n: "03",
    t: "You shop with a number",
    d: "You know exactly what you can spend and what the payment looks like. Your agent can write with confidence.",
  },
  {
    n: "04",
    t: "We close",
    d: "I stay on it through appraisal, underwriting, and closing. You hear from me before you have to ask.",
  },
];

function Process() {
  return (
    <Section id="process" className="py-12 md:py-16">
      <Reveal>
        <Eyebrow>How it works</Eyebrow>
      </Reveal>
      <LineReveal
            delay={0.05}
            className="mt-6 max-w-[18ch] text-[30px] leading-[1.08] md:text-[40px]"
            lines={["Four steps, and you always", "know which one you’re in."]}
          />

      <div className="mt-12">
        <PinnedProcess steps={STEPS} />
      </div>
    </Section>
  );
}

/* ── Reviews ────────────────────────────────────────────────── */
function Reviews() {
  return (
    <Section id="reviews" className="py-12 md:py-16">
      <Reveal>
        <Eyebrow>In their words</Eyebrow>
      </Reveal>
      <LineReveal
            delay={0.05}
            className="mt-6 max-w-[20ch] text-[30px] leading-[1.08] md:text-[40px]"
            lines={["The referrals", "are the business."]}
          />

      {/* Deliberately uneven column split — editorial, not a 3-up card grid. */}
      <div className="mt-12 grid gap-x-14 gap-y-12 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 60}>
            <figure className={i % 2 === 1 ? "md:pt-12" : ""}>
              <blockquote className="border-l border-brass pl-6">
                <p className="font-display text-[21px] leading-[1.45] text-ink">
                  {t.quote}
                </p>
              </blockquote>
              <figcaption className="mt-4 pl-6 text-[14px] text-ink-faint">
                {t.name}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={240}>
        <a
          href={site.social.reviews}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-block text-[15px] text-brick underline underline-offset-4 hover:text-brick-deep"
        >
          Read more reviews →
        </a>
      </Reveal>
    </Section>
  );
}

/* ── Service area ───────────────────────────────────────────── */
function Area() {
  return (
    <Section id="area" className="py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Where I lend</Eyebrow>
          </Reveal>
          <LineReveal
            delay={0.05}
            className="mt-6 text-[30px] leading-[1.08] md:text-[40px]"
            lines={["Both sides of", "the state line."]}
          />
          <Reveal delay={120}>
            <p className="measure mt-6 text-ink-muted">
              The KC metro is two states, dozens of school districts, and wildly
              different tax situations block to block. That matters more than
              most buyers realize — and it&apos;s the kind of thing a national
              lender&apos;s call center will never flag for you.
            </p>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <ul className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3">
            {site.serviceAreas.map((a) => (
              <li
                key={a}
                className="bg-paper px-4 py-4 text-[14px] text-ink-muted"
              >
                {a}
              </li>
            ))}
            <li className="bg-paper px-4 py-4 text-[14px] text-ink-faint">
              + surrounding
            </li>
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Start ──────────────────────────────────────────────────── */
function Start() {
  return (
    <Section id="start" className="py-12 md:py-16">
      <div className="grid gap-14 lg:grid-cols-[1fr_480px] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Get started</Eyebrow>
          </Reveal>
          <LineReveal
            delay={0.05}
            className="mt-6 max-w-[16ch] text-[30px] leading-[1.08] md:text-[40px]"
            lines={["Three questions.", "Then we talk."]}
          />
          <Reveal delay={120}>
            <p className="measure mt-6 text-ink-muted">
              No credit pull, no application, no obligation. If it turns out
              you&apos;re better off waiting six months, I&apos;ll tell you that —
              I&apos;d rather have you as a client later than a bad loan now.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-9 space-y-4 border-t border-rule pt-8">
              <p className="text-[14px] text-ink-faint">Or reach me directly:</p>
              <a
                href={site.loanOfficer.phoneHref}
                className="tnum block text-[26px] hover:text-brick"
              >
                {site.loanOfficer.phone}
              </a>
              <a
                href={site.loanOfficer.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[15px] text-brick underline underline-offset-4 hover:text-brick-deep"
              >
                Put time on my calendar →
              </a>
              <p className="pt-4 text-[13px] text-ink-faint">
                Ready to apply?{" "}
                <a
                  href={brokerage.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-ink"
                >
                  Start a secure application
                </a>{" "}
                through {brokerage.name}.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <StartForm />
        </Reveal>
      </div>
    </Section>
  );
}
