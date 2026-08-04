/**
 * Single source of truth for all client-supplied facts.
 *
 * ⚠️  DEMO PLACEHOLDERS ARE MARKED `NEEDS_CONFIRMATION`.
 * The live site currently discloses TWO different sponsoring lenders
 * (Canopy Mortgage in the footer/logo, Bayshore Mortgage Funding in the
 * "Apply Now" flow). We default to Bayshore here because that is where the
 * live application actually terminates. Flip `brokerage` to `CANOPY` below
 * once Josh confirms — nothing else in the codebase needs to change.
 */

export const BROKERAGES = {
  BAYSHORE: {
    name: "Bayshore Mortgage Funding, LLC",
    nmls: "196858",
    address: "2108 Emmorton Park Road, Suite 204, Edgewood, MD 21040",
    phone: "877-741-8091",
    applyUrl:
      "https://myloan.bsmfunding.com/homehub/signup/jpennebaker@bsmfunding.com",
    privacyUrl: "https://bayshoremortgage.com/privacy-policy/",
    licensesUrl: "https://bayshoremortgage.com/licensing/",
  },
  CANOPY: {
    name: "Canopy Mortgage, LLC",
    nmls: "1359687",
    address: "360 Technology Court, Suite 200, Lindon, UT 84042",
    phone: "877-426-5500",
    applyUrl: "https://canopymortgage.com/lo/JoshPennebaker/",
    privacyUrl: "https://canopymortgage.com/privacy-policy/",
    licensesUrl: "https://canopymortgage.com/state-licenses/",
  },
} as const;

/** NEEDS_CONFIRMATION — which brokerage currently sponsors Josh's license. */
export const brokerage = BROKERAGES.BAYSHORE;

export const site = {
  name: "The Hometown Mortgage",
  tagline: "Your neighborhood lender",
  url: "https://thehometownmortgage.com",

  loanOfficer: {
    name: "Josh Pennebaker",
    title: "Branch Manager",
    /** NOTE: correct acronym is NMLS. The live site misspells this "NLMS". */
    nmls: "1737680",
    nmlsLookup:
      "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1737680",
    phone: "(913) 600-7811",
    phoneHref: "tel:+19136007811",
    email: "jpennebaker@bsmfunding.com", // NEEDS_CONFIRMATION
    calendly: "https://calendly.com/jpennebaker-1",
    /** NEEDS_CONFIRMATION — awaiting real headshot. Placeholder frame is rendered. */
    photo: null as string | null,
  },

  social: {
    facebook: "https://web.facebook.com/profile.php?id=100085940066323",
    instagram: "https://www.instagram.com/thehometownmortgage/",
    reviews: "https://web.facebook.com/profile.php?id=100085940066323&sk=reviews",
  },

  /** NEEDS_CONFIRMATION — states Josh is actually licensed in. */
  licensedStates: ["Kansas", "Missouri"],

  serviceAreas: [
    "Overland Park",
    "Olathe",
    "Lenexa",
    "Shawnee",
    "Leawood",
    "Kansas City, MO",
    "Lee's Summit",
    "Blue Springs",
    "Liberty",
    "Prairie Village",
  ],
} as const;

export const programs = [
  {
    slug: "conventional",
    name: "Conventional",
    down: "3%",
    summary:
      "The standard path. Strongest terms if your credit is solid and you can put down 3% or more.",
    points: [
      "As little as 3% down for first-time buyers",
      "Mortgage insurance drops off at 20% equity — unlike FHA",
      "Fixed 15, 20, or 30-year terms",
    ],
    bestFor: "Buyers with credit around 620+ who want the lowest long-run cost.",
  },
  {
    slug: "fha",
    name: "FHA",
    down: "3.5%",
    summary:
      "Built for buyers whose credit is still recovering. More forgiving underwriting, higher insurance cost.",
    points: [
      "3.5% down with a credit score of 580 or higher",
      "Accepts higher debt-to-income ratios",
      "Gift funds allowed for the full down payment",
    ],
    bestFor: "Buyers rebuilding credit or carrying more debt than conventional allows.",
  },
  {
    slug: "va",
    name: "VA",
    down: "0%",
    summary:
      "For service members, veterans, and surviving spouses. The best loan in the country if you qualify.",
    points: [
      "No down payment, no monthly mortgage insurance",
      "Rates typically below conventional",
      "Reusable — it is not a one-time benefit",
    ],
    bestFor: "Anyone with VA entitlement. If you qualify, start here.",
  },
  {
    slug: "usda",
    name: "USDA",
    down: "0%",
    summary:
      "$0 down for homes in rural and suburban areas. More of the KC metro qualifies than most people expect.",
    points: [
      "100% financing — no down payment required",
      "Household income limits apply (roughly 115% of area median)",
      "Much of Miami, Franklin, and outer Johnson County qualify",
    ],
    bestFor: "Buyers outside the urban core who assume they need a down payment.",
  },
] as const;

/** Real reviews pulled from the live site. Verify before publishing. */
export const testimonials = [
  {
    name: "Mike Hafertepe",
    quote:
      "Worked with Josh on my new house and also refinancing for a lower interest rate. Both times Josh made the process incredibly easy and straightforward for us. I could not have been happier with the service we received.",
  },
  {
    name: "Abbie Crowley",
    quote:
      "Absolutely love working with Josh! He's such a great resource and always has a creative way to help. He's a straight shooter when it comes to mortgage and doesn't try to only get the sale. He genuinely cares about his clients.",
  },
  {
    name: "Nick Vogt",
    quote:
      "Josh helped my wife and I refinance in 2020. Even through the early stages of the pandemic Josh found a way to make the entire process quick and convenient. I've refinanced with other lenders in the past but this was by far the easiest to get done.",
  },
  {
    name: "Erika Forster",
    quote:
      "Highly recommend. In love with our beautiful home that we closed on through The Hometown Mortgage!",
  },
] as const;
