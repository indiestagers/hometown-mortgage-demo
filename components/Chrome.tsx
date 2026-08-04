import Link from "next/link";
import { site, brokerage } from "@/site.config";
import { ButtonLink } from "./primitives";

// Padding sits OUTSIDE the max-width wrapper, exactly as Section does it —
// otherwise the logo misaligns with every heading above 1456px.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 px-6 backdrop-blur-sm md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-4">
        <Link href="/" className="flex min-w-0 items-baseline gap-2">
          <span className="font-display text-[18px] leading-tight sm:text-[21px] sm:leading-none">
            The Hometown Mortgage
          </span>
          <span className="hidden text-[12px] text-ink-faint md:inline">
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
          <ButtonLink
            href="#start"
            className="px-4 py-3 text-[15px] md:px-6"
          >
            Get started
          </ButtonLink>
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
            <p className="font-display text-[22px]">The Hometown Mortgage</p>
            <p className="mt-2 text-[14px] text-ink-muted">
              {site.loanOfficer.name}, {site.loanOfficer.title}
            </p>
            <a
              href={site.loanOfficer.nmlsLookup}
              target="_blank"
              rel="noopener noreferrer"
              className="tnum mt-1 inline-block text-[14px] text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              NMLS #{site.loanOfficer.nmls}
            </a>
            <a
              href={site.loanOfficer.phoneHref}
              className="tnum mt-4 block text-[18px] hover:text-brick"
            >
              {site.loanOfficer.phone}
            </a>
          </div>

          <nav aria-label="Loan programs">
            <p className="eyebrow mb-3">Programs</p>
            <ul className="space-y-2 text-[14px] text-ink-muted">
              {["Conventional", "FHA", "VA", "USDA"].map((p) => (
                <li key={p}>
                  <a href="#programs" className="hover:text-ink">
                    {p} loans
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="More">
            <p className="eyebrow mb-3">More</p>
            <ul className="space-y-2 text-[14px] text-ink-muted">
              <li>
                <a href="#estimate" className="hover:text-ink">
                  Payment estimator
                </a>
              </li>
              <li>
                <a
                  href={site.loanOfficer.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Schedule a call
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
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
            <div className="text-[12px] leading-relaxed text-ink-faint">
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

          <p className="mt-6 rounded-[2px] border border-brass/40 px-4 py-3 text-[12px] text-ink-faint">
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
