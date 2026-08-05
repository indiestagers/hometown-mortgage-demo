import { site } from "@/site.config";

/**
 * Persistent bottom action bar, mobile only.
 *
 * The page's entire thesis is "he answers his own phone", yet on mobile the
 * number was invisible: the ledger rail is `lg:` only and the header showed a
 * bare icon with the digits `hidden lg:inline`. The first visible digits were
 * ~10,000px down the page — on the device people actually call from.
 *
 * Sits in the thumb zone rather than the header, and pads the page bottom via
 * a spacer so it never covers the footer's licensing text.
 */
export function MobileBar() {
  return (
    <>
      <div aria-hidden="true" className="h-[72px] lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper lg:hidden">
        <div className="flex items-stretch gap-2 px-3 py-3">
          <a
            href={site.loanOfficer.phoneHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-[2px] border border-rule px-4 py-3 whitespace-nowrap text-[15px] font-medium text-ink transition-colors duration-[160ms] hover:border-ink hover:bg-paper-sunk"
          >
            <svg
              width="17"
              height="17"
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
            <span className="tnum whitespace-nowrap">{site.loanOfficer.phone}</span>
          </a>
          <a
            href="#start"
            className="flex flex-1 items-center justify-center rounded-[2px] bg-brick px-4 py-3 text-[15px] font-medium text-paper transition-colors duration-[160ms] hover:bg-brick-deep"
          >
            Get started
          </a>
        </div>
      </div>
    </>
  );
}
