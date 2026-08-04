import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ScrollReset } from "@/components/ScrollReset";
import { site, brokerage } from "@/site.config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "The Hometown Mortgage — Kansas City home loans, answered by a person",
    template: "%s · The Hometown Mortgage",
  },
  description:
    "Josh Pennebaker, NMLS #1737680. A Kansas City mortgage broker who answers his own phone. Conventional, FHA, VA, and USDA loans across Kansas and Missouri.",
  openGraph: {
    title: "The Hometown Mortgage — Kansas City home loans",
    description:
      "A Kansas City mortgage broker who answers his own phone. Conventional, FHA, VA, and USDA loans across Kansas and Missouri.",
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  /**
   * NOINDEX — deliberate and important.
   *
   * This is an unapproved concept demo of a real, licensed business. It must
   * never be indexed, never rank against Josh's actual site, and never be
   * mistaken by a consumer for the real thing. Flip this only after the client
   * approves the work and it moves to the production domain.
   */
  robots: { index: false, follow: false, nocache: true },
};

/** LocalBusiness + FinancialService schema — absent from the current site. */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": ["FinancialService", "LocalBusiness"],
    name: site.name,
    url: site.url,
    telephone: site.loanOfficer.phone,
    areaServed: site.licensedStates.map((s) => ({ "@type": "State", name: s })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kansas City",
      addressRegion: "KS",
      addressCountry: "US",
    },
    employee: {
      "@type": "Person",
      name: site.loanOfficer.name,
      jobTitle: site.loanOfficer.title,
      identifier: `NMLS #${site.loanOfficer.nmls}`,
    },
    parentOrganization: { "@type": "Organization", name: brokerage.name },
    sameAs: [site.social.facebook, site.social.instagram],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <ScrollReset />
        {children}
        <StructuredData />
      </body>
    </html>
  );
}
