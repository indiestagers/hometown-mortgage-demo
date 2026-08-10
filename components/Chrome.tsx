import Image from "next/image";
import Link from "next/link";
import { site, brokerage } from "@/site.config";

const SECTIONS = [
  { id: "thesis", label: "Why me" },
  { id: "programs", label: "Loan programs" },
  { id: "estimate", label: "Estimate" },
  { id: "process", label: "How it works" },
  { id: "reviews", label: "Reviews" },
  { id: "area", label: "Where I lend" },
  { id: "start", label: "Get started" },
  { id: "contact", label: "Contact" },
];

/** next/image does not prepend basePath when images.unoptimized is set. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Padding sits OUTSIDE the max-width wrapper, exactly as Section does it —
// otherwise the logo misaligns with every heading above 1456px.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper px-6 md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src={`${BASE}/media/hometown-logo.svg`}
            alt="The Hometown Mortgage — your neighborhood lender"
            width={469}
            height={252}
            priority
            className="h-11 w-auto md:h-12"
          />
          <span className="hidden text-[13px] text-ink-faint lg:inline">
            Kansas City
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 md:gap-4">
          {/* The whole pitch is that he answers his own phone — never hide it
              on the viewport where people are most likely to just call. */}
          <a
            href={site.loanOfficer.phoneHref}
            aria-label={`Call Josh at ${site.loanOfficer.phone}`}
            className="flex items-center gap-2 rounded-[2px] px-2 py-3 text-ink hover:text-brick sm:px-3"
          >
            <PhoneIcon />
            <span className="tnum hidden text-[15px] lg:inline">
              {site.loanOfficer.phone}
            </span>
          </a>
          {/* Primary action on a lead-gen site is booking time, so this opens
              Calendly directly rather than scrolling to a form. Hidden on
              mobile because MobileBar carries it; `hidden` on the ButtonLink
              itself would lose to its base `inline-flex`. */}
          <span className="hidden sm:block">
            <a
              href={site.loanOfficer.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] bg-brick px-4 py-3 text-[15px] font-medium text-paper transition-colors duration-[160ms] hover:bg-brick-deep md:px-6"
            >
              Schedule a meeting
            </a>
          </span>

          {/* Mobile has no ledger rail, so it had no section index at all
              across ~12,000px. <details> gives it one with no JS. */}
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[2px] border border-rule px-3 py-3 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
              Sections
            </summary>
            <nav
              aria-label="Page sections"
              className="absolute right-0 z-50 mt-2 w-56 rounded-[2px] border border-rule bg-paper shadow-float"
            >
              <ul className="py-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block px-4 py-3 text-[15px] text-ink-muted hover:bg-paper-sunk hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

// No top margin on <footer>: the border-t + sunk background already mark the
// boundary. mt-32 stacked on the last section's padding produced a 289px void.
export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper-sunk px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src={`${BASE}/media/hometown-logo.svg`}
              alt="The Hometown Mortgage — your neighborhood lender"
              width={469}
              height={252}
              className="h-16 w-auto"
            />
            <p className="mt-2 text-[15px] text-ink-muted">
              {site.loanOfficer.name}, {site.loanOfficer.title}
            </p>
            <a
              href={site.loanOfficer.nmlsLookup}
              target="_blank"
              rel="noopener noreferrer"
              className="tnum mt-1 inline-block text-[15px] text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              NMLS #{site.loanOfficer.nmls}
            </a>
            <a
              href={site.loanOfficer.phoneHref}
              className="tnum mt-4 block text-[17px] hover:text-brick"
            >
              {site.loanOfficer.phone}
            </a>
          </div>

          <nav aria-label="Loan programs">
            <p className="eyebrow mb-3">Programs</p>
            <ul className="text-[15px] text-ink-muted">
              {["Conventional", "FHA", "VA", "USDA"].map((p) => (
                <li key={p}>
                  <a href="#programs" className="block py-1.5 hover:text-ink">
                    {p} loans
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="More">
            <p className="eyebrow mb-3">More</p>
            <ul className="text-[15px] text-ink-muted">
              <li>
                <a href="#estimate" className="block py-1.5 hover:text-ink">
                  Payment estimator
                </a>
              </li>
              <li>
                <a
                  href={site.loanOfficer.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-1.5 hover:text-ink"
                >
                  Schedule a call
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-1.5 hover:text-ink"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-1.5 hover:text-ink"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Compliance block — single sponsoring lender, NMLS spelled correctly,
            Equal Housing mark present. All three are defects on the live site. */}
        <div className="mt-12 border-t border-rule pt-8">
          <div className="flex items-start gap-4">
            <EqualHousingMark />
            <div className="text-[13px] leading-relaxed text-ink-faint">
              <p>
                The Hometown Mortgage is a division of {brokerage.name}, NMLS{" "}
                <span className="tnum">#{brokerage.nmls}</span>. {brokerage.address}.
              </p>
              <p className="mt-2">
                Licensed in {site.licensedStates.join(" and ")}. Verify any
                licensee at{" "}
                <a
                  href="https://www.nmlsconsumeraccess.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  nmlsconsumeraccess.org
                </a>
                . Equal Housing Lender. This is not a commitment to lend. All
                loans subject to credit approval, income verification, and
                property appraisal. Rates and terms subject to change.
              </p>
              <p className="mt-3">
                © {new Date().getFullYear()} The Hometown Mortgage. All rights
                reserved.
              </p>
            </div>
          </div>

          <p className="mt-6 rounded-[2px] border border-brass/40 px-4 py-3 text-[13px] text-ink-faint">
            <strong className="font-medium text-ink-muted">Demo build.</strong>{" "}
            Sponsoring lender shown here is a placeholder — the live site
            currently discloses two different lenders. Confirm the correct entity
            and required disclosure language with compliance before launch.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 3h-3A1.5 1.5 0 0 0 2 4.6C2 13.1 8.9 20 17.4 20a1.5 1.5 0 0 0 1.6-1.5v-3l-4-1.5-2 2a13.6 13.6 0 0 1-6-6l2-2L6.5 3Z" />
    </svg>
  );
}

/** Equal Housing Opportunity mark — legally expected and missing on the live site. */
function EqualHousingMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className="mt-1 shrink-0 text-ink-faint"
      role="img"
      aria-label="Equal Housing Lender"
    >
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5.5 12v7.5h13V12" />
      <path d="M9 19.5v-4h6v4" />
    </svg>
  );
}
