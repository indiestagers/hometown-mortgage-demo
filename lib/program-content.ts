/**
 * All copy and structured data for the /programs, /about and /contact routes.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REGULATED CONTENT — READ BEFORE EDITING
 *
 * This is consumer-facing mortgage content. Two rules govern every string
 * in this file:
 *
 *   1. No interest rates. Pricing changes daily and varies by borrower;
 *      quoting a rate on a marketing page is both wrong and a compliance
 *      problem. The calculators take a rate as *user input* instead.
 *   2. No guarantees. Nothing here promises approval, a term, or a cost.
 *      Program parameters are described as what the program allows, not
 *      as what any given borrower will get.
 *
 * Figures that agencies reset periodically (conforming limits, FHA county
 * limits, the VA funding fee table, USDA income limits and fee rates) are
 * either omitted or carry a NEEDS_CONFIRMATION marker. Do not fill them in
 * from memory — pull the current number from the agency and date it.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type ProgramSlug = "conventional" | "fha" | "va" | "usda";

export type Fact = {
  label: string;
  /** Rendered in IBM Plex Mono via `.tnum`. Keep it short. */
  value: string;
  note?: string;
};

export type Passage = { heading: string; body: string[] };

export type ProgramDetail = {
  slug: ProgramSlug;
  name: string;
  /** <h1>. One per page. */
  headline: string;
  /** <title>; the layout template appends " · The Hometown Mortgage". */
  metaTitle: string;
  metaDescription: string;
  /** Standfirst under the h1. First person singular. */
  lead: string;
  facts: Fact[];
  qualify: Passage[];
  insurance: Passage;
  pros: string[];
  costs: string[];
  wrongChoice: string[];
  kansasCity: string[];
  /** Rendered verbatim in a marked box. Anything I could not source. */
  needsConfirmation: string[];
};

/* ── Conventional ─────────────────────────────────────────────────────── */

const conventional: ProgramDetail = {
  slug: "conventional",
  name: "Conventional",
  headline: "Conventional loans",
  metaTitle: "Conventional loans in Kansas City",
  metaDescription:
    "How conventional loans work in the Kansas City metro: 3% down, a 620 credit floor, PMI that cancels at 20% equity, and when a conventional loan is the wrong choice. Josh Pennebaker, NMLS #1737680.",
  lead: "This is the loan most of my buyers end up with. It is not government-insured — it follows Fannie Mae and Freddie Mac rules — and it rewards good credit more directly than any other program.",
  facts: [
    {
      label: "Minimum down payment",
      value: "3%",
      note: "3% is available on qualifying first-time-buyer and low-to-moderate-income programs. 5% is the ordinary floor otherwise.",
    },
    {
      label: "Credit score floor",
      value: "620",
      note: "620 gets you approved. Pricing improves in steps at 660, 680, 700, 720, and 740 — the last one is where it flattens out.",
    },
    {
      label: "Mortgage insurance",
      value: "Cancels",
      note: "PMI applies above 80% loan-to-value and comes off the payment as you build equity. It is not permanent.",
    },
    {
      label: "Occupancy",
      value: "Any",
      note: "Primary residence, second home, or investment property. The other three programs are primary-residence only.",
    },
  ],
  qualify: [
    {
      heading: "Credit and history",
      body: [
        "620 is the usual minimum score. That gets you in the door; it does not get you the same terms as a 760. Conventional pricing is tiered by score and by how much you put down, and the two interact — a 660 score with 5% down is priced very differently from a 660 with 20% down.",
        "Standard waiting periods apply after a bankruptcy or foreclosure, and they are longer than FHA's. If either is in your recent past, tell me the discharge date on the first call. It usually decides the program for you.",
      ],
    },
    {
      heading: "Income and debt",
      body: [
        "Underwriting looks at your total monthly debt payments — including the new house payment, taxes, insurance, and any HOA — against your gross monthly income. Automated underwriting will stretch past 45% with strong reserves or a large down payment, but the further you push it, the more everything else has to be clean.",
        "Self-employed income is averaged from tax returns, not deposits. If you write off aggressively, your qualifying income is lower than your take-home feels. Bring two years of returns to the first conversation and we will know quickly.",
      ],
    },
    {
      heading: "Down payment and reserves",
      body: [
        "Gift funds from a family member are allowed on a primary residence, with a signed gift letter and a paper trail. Money that appears in your account without a source is money underwriting will not count.",
        "Reserves — cash left over after closing — are not always required, but they are the single most useful compensating factor when something else in the file is tight.",
      ],
    },
    {
      heading: "Loan size",
      body: [
        "Above the conforming limit, a loan becomes a jumbo and the rules change: higher credit and reserve requirements, different pricing. The Federal Housing Finance Agency resets that limit every year, so ask me for the current figure for the county you are buying in rather than trusting a number you read online.",
      ],
    },
  ],
  insurance: {
    heading: "How mortgage insurance works here",
    body: [
      "Private mortgage insurance is required when you borrow more than 80% of the home's value. It protects the lender, not you, and it is priced on your credit score and your loan-to-value — so the same 5% down costs one borrower noticeably more than another.",
      "The important part: it ends. Under the federal Homeowners Protection Act, borrower-paid PMI on a primary residence must automatically terminate once the loan reaches 78% of the original value on the amortization schedule, and you can request cancellation at 80%. If your home appreciates, a new appraisal can get you there sooner.",
      "That cancellation is the structural difference between conventional and FHA. On an FHA loan taken with the minimum down payment, the insurance does not come off — you refinance out or you pay it for the life of the loan.",
      "You can also buy lender-paid PMI, where the cost is folded into the rate instead of a separate line. It lowers the payment today and never cancels. Sometimes it wins, usually it does not. I will run both.",
    ],
  },
  pros: [
    "PMI cancels — the payment gets cheaper on a schedule you can predict.",
    "No upfront insurance premium added to the loan balance, unlike FHA and USDA.",
    "Strong credit is priced in your favor rather than ignored.",
    "Works on second homes and rentals, which the government programs do not.",
    "Sellers in a multiple-offer situation generally read a conventional offer as the least likely to fall apart on appraisal.",
  ],
  costs: [
    "620 is a hard floor at most lenders, and below roughly 680 the pricing hit is real.",
    "Underwriting is less forgiving than FHA on debt-to-income and on recent credit events.",
    "The 3%-down versions carry income limits or first-time-buyer requirements — not everyone qualifies for the headline number.",
    "PMI on a low down payment with a mid-600s score can be more expensive than FHA's insurance.",
  ],
  wrongChoice: [
    "Your score is in the low 600s and your down payment is small. Run FHA against it — with a thin file, FHA often wins on total monthly cost even after its insurance.",
    "You have VA entitlement and have not used it. Compare VA first, every time.",
    "Your debt-to-income is above what conventional automated underwriting will take. FHA's tolerance is higher.",
    "You are buying a house that needs work before it is livable. That is a renovation-loan conversation, not a standard conventional one.",
  ],
  kansasCity: [
    "Property taxes swing hard across this metro. Two houses at the same price, one in Johnson County and one across the line in Jackson County, can carry meaningfully different monthly payments once taxes are in — and taxes count in your debt-to-income. That is why I quote payments as full PITI and not as principal and interest.",
    "Newer construction in Johnson County frequently carries a special assessment on the tax bill for the infrastructure that built the subdivision. It shows up on the tax statement, it counts against you in underwriting, and it surprises buyers who only budgeted for the mill levy. I check for it before we write.",
  ],
  needsConfirmation: [
    "Current conforming loan limits for the Kansas and Missouri counties in the KC metro (reset annually by the FHFA).",
  ],
};

/* ── FHA ──────────────────────────────────────────────────────────────── */

const fha: ProgramDetail = {
  slug: "fha",
  name: "FHA",
  headline: "FHA loans",
  metaTitle: "FHA loans in Kansas City",
  metaDescription:
    "How FHA loans work in the Kansas City metro: 3.5% down at a 580 score, upfront and annual mortgage insurance premiums, the 11-year rule, and when FHA is the wrong choice. Josh Pennebaker, NMLS #1737680.",
  lead: "FHA is insured by the federal government, which is why it can accept credit and debt loads conventional will not. You pay for that flexibility through mortgage insurance, and on a minimum down payment you pay for it indefinitely.",
  facts: [
    {
      label: "Minimum down payment",
      value: "3.5%",
      note: "3.5% at a 580 score or higher. FHA's own rules allow 500–579 with 10% down, but most lenders will not go there.",
    },
    {
      label: "Credit score floor",
      value: "580",
      note: "That is FHA's floor. Individual lenders add their own — 600 and 620 overlays are common. Ask before you assume.",
    },
    {
      label: "Mortgage insurance",
      value: "Both",
      note: "An upfront premium of 1.75% of the loan amount, financed into the balance, plus an annual premium collected monthly.",
    },
    {
      label: "Occupancy",
      value: "Primary",
      note: "Owner-occupied only. You may buy a 2–4 unit building if you live in one of the units.",
    },
  ],
  qualify: [
    {
      heading: "Credit",
      body: [
        "580 gets you the 3.5% down payment. Below 580, FHA's guidelines allow 500–579 with 10% down, but almost no lender actually originates in that band — they layer their own minimum on top, and 620 overlays are common even on FHA. If you are being told no at one lender, that is often the overlay talking and not the program.",
        "FHA is also more forgiving on timing. The waiting periods after a bankruptcy or a foreclosure are shorter than conventional's, and a file with a couple of old collections is not automatically dead.",
      ],
    },
    {
      heading: "Debt-to-income",
      body: [
        "This is the real reason to look at FHA. Its automated underwriting will approve ratios that conventional will not, especially when your credit is decent but your student loans and car payment are heavy. There is no single published cutoff — it is the whole file — but there is meaningful room above where conventional stops.",
      ],
    },
    {
      heading: "Down payment source",
      body: [
        "The entire 3.5% can be a gift from a family member. That is genuinely useful for buyers whose income supports a payment but whose savings do not yet cover a down payment. Documentation still applies: a gift letter and a traceable transfer.",
      ],
    },
    {
      heading: "The house itself",
      body: [
        "FHA appraisals check condition, not just value. Peeling paint on a pre-1978 house, a roof at the end of its life, missing handrails, an inoperable furnace — any of these can be called out and have to be fixed before closing. On a well-kept house it is a non-event. On a fixer, it can end the deal or push you toward a 203(k) renovation loan.",
        "FHA also sets a maximum loan amount by county, and it is lower than the conforming limit in most places. Ask me for the current figure for your county — HUD resets it annually.",
      ],
    },
  ],
  insurance: {
    heading: "How mortgage insurance works here",
    body: [
      "FHA charges two premiums, and you need to understand both before you compare an FHA payment to a conventional one.",
      "The upfront premium is 1.75% of the loan amount. It is almost always financed into the balance rather than paid at closing, which means you start out owing more than the purchase price minus your down payment.",
      "The annual premium is collected monthly. For a typical 30-year purchase with the minimum down payment it currently runs 0.55% of the loan balance per year — that is the figure the estimator on this site uses. HUD sets it and has changed it before, most recently downward in 2023.",
      "The rule that decides the whole comparison: if your loan starts above 90% loan-to-value, the annual premium stays for the full loan term. At 90% or below at origination, it drops off after 11 years. With 3.5% down you are at 96.5%, so it is permanent. The only exit is refinancing into a conventional loan once you have 20% equity — which works, but it depends on where rates are when you get there, and nobody can promise you that.",
    ],
  },
  pros: [
    "3.5% down at a 580 score, when conventional wants 620 and prices a 620 poorly.",
    "The most room on debt-to-income of any program here.",
    "The entire down payment can be gifted.",
    "Insurance pricing barely moves with your credit score, so a weaker score is not punished twice.",
    "FHA loans are assumable — a future buyer may be able to take over your rate. That is worth little today and could be worth a great deal later.",
  ],
  costs: [
    "1.75% added to your loan balance on day one.",
    "Annual insurance for the life of the loan at the minimum down payment.",
    "Property condition standards that a dated house may fail.",
    "Some sellers in a competitive situation will take a conventional offer over an FHA one at the same price, on appraisal-risk grounds.",
    "County loan limits are lower than conforming, which can rule FHA out on a higher-priced house.",
  ],
  wrongChoice: [
    "Your credit is 700+ and you have 5% or more to put down. Conventional PMI will almost certainly cost you less, and it cancels.",
    "You are competing for a house with multiple offers on it and you have a conventional-eligible file. The financing type on your offer is part of what the seller is weighing.",
    "You plan to sell or refinance within a few years and you are only choosing FHA for the lower payment. The 1.75% upfront premium does not amortize away in three years.",
    "You have VA entitlement. VA has no monthly insurance at all.",
    "The house needs real repair. Standard FHA will not close on it — ask me about 203(k) instead of finding out at the appraisal.",
  ],
  kansasCity: [
    "A lot of the housing stock in the older parts of this metro — the Northeast, parts of Wyandotte County, the pre-war neighborhoods on both sides of the line — was built before 1978. Lead-based-paint rules make FHA appraisers strict about peeling exterior paint on those houses. It is fixable, but it needs to be known before the appraisal, not after.",
    "FHA works well on the 2–4 unit buildings in the urban core if you are going to live in one unit. That is one of the few ways I see first-time buyers in Kansas City get into a property that helps pay for itself.",
  ],
  needsConfirmation: [
    "Current FHA county loan limits for the KC metro (reset annually by HUD).",
    "Current annual MIP schedule — verify against HUD's live mortgagee letters before quoting, not from memory.",
  ],
};

/* ── VA ───────────────────────────────────────────────────────────────── */

const va: ProgramDetail = {
  slug: "va",
  name: "VA",
  headline: "VA loans",
  metaTitle: "VA loans in Kansas City",
  metaDescription:
    "How VA loans work in the Kansas City metro: no down payment, no monthly mortgage insurance, the funding fee and who is exempt, and when a VA loan is the wrong choice. Josh Pennebaker, NMLS #1737680.",
  lead: "If you have VA entitlement, start here. No down payment and no monthly mortgage insurance is a combination no other program offers, and the benefit is reusable — it is not a one-time card you spend on your first house.",
  facts: [
    {
      label: "Minimum down payment",
      value: "0%",
      note: "100% financing with full entitlement. Putting money down is optional and reduces the funding fee.",
    },
    {
      label: "Credit score floor",
      value: "None",
      note: "The VA publishes no minimum. Lenders set their own — 580 to 620 is the usual range.",
    },
    {
      label: "Mortgage insurance",
      value: "None",
      note: "No monthly mortgage insurance at any loan-to-value. There is a one-time funding fee instead.",
    },
    {
      label: "Occupancy",
      value: "Primary",
      note: "You must intend to occupy the home. 2–4 units are allowed if you live in one.",
    },
  ],
  qualify: [
    {
      heading: "Service requirements",
      body: [
        "Eligibility runs through service history: veterans who meet the minimum active-duty service requirement, active-duty service members, and members of the National Guard and Reserve who meet the service thresholds. Surviving spouses of service members who died in service or from a service-connected disability may also be eligible.",
        "The document that settles it is your Certificate of Eligibility. I pull it — you do not need to chase it down before we talk. If it comes back with partial entitlement because you already have a VA loan outstanding, that changes the math but rarely ends the conversation.",
      ],
    },
    {
      heading: "Residual income",
      body: [
        "VA underwriting does something no other program does: after your house payment, your other debts, and estimated taxes and utilities, it checks how much money is actually left over each month, against a table that varies by family size and region. It is a sanity check on the debt ratio, and it is a large part of why VA loans have historically performed well.",
        "In practice this means a VA file can be approved with a debt-to-income ratio that would fail elsewhere, provided the residual income is there.",
      ],
    },
    {
      heading: "Entitlement and loan size",
      body: [
        "Since 2020, a borrower with full entitlement has no VA loan limit — the county limit only constrains you if your entitlement is partial, usually because you have another VA loan outstanding or had one that was not restored.",
        "The benefit is reusable. Entitlement can be restored when you sell and pay off the loan, and in some cases you can hold two VA loans at once. If you are PCSing and thinking about keeping the current house, tell me early — the order of operations matters.",
      ],
    },
    {
      heading: "The house itself",
      body: [
        "VA appraisals apply Minimum Property Requirements: safe, sound, sanitary. Similar in spirit to FHA's standards. Condominiums must be on the VA-approved list, and that list is narrower than most buyers expect in this metro — check the specific complex before you fall in love with a unit.",
      ],
    },
  ],
  insurance: {
    heading: "The funding fee, in place of insurance",
    body: [
      "There is no monthly mortgage insurance on a VA loan. Instead there is a one-time VA funding fee, charged as a percentage of the loan amount and usually financed into the balance rather than paid in cash.",
      "The percentage depends on three things: whether this is your first use of the benefit or a subsequent use, how much you put down, and the type of loan. First use with nothing down carries the lowest fee; subsequent use with nothing down carries the highest. Putting 5% or 10% down reduces it in steps.",
      "You are exempt from the fee entirely if you receive VA compensation for a service-connected disability, and in certain other cases including eligible surviving spouses. Exempt borrowers get the full benefit with no fee at all, which makes VA very difficult to beat.",
      "Congress has adjusted the fee schedule more than once. I will quote you the exact percentage that applies to your situation from the current table before you commit to anything — I am not going to print a number here that may be stale by the time you read it.",
    ],
  },
  pros: [
    "No down payment and no monthly mortgage insurance. Nothing else does both.",
    "No funding fee at all if you are disability-compensation exempt.",
    "The residual-income test lets strong files through that debt ratios alone would block.",
    "Reusable, and restorable when you sell.",
    "VA loans are assumable by a qualified buyer, veteran or not — a real asset if you sell in a higher-rate market.",
    "The VA limits what closing costs a veteran is allowed to pay.",
  ],
  costs: [
    "The funding fee is added to your balance, so you start with less equity than a down payment would give you.",
    "Zero down means you may owe more than the house is worth if values dip and you need to sell early.",
    "Minimum Property Requirements can complicate a dated or as-is purchase.",
    "Condo options are limited to VA-approved projects.",
    "Primary residence only — this is not a path to a rental portfolio.",
  ],
  wrongChoice: [
    "You are buying an investment property or a second home. VA does not do that.",
    "You are putting 20% or more down, you are not fee-exempt, and your credit is excellent. Run conventional against it — with no PMI on either side, the funding fee may be the only difference, and conventional can win.",
    "The specific condo you want is not on the VA-approved list and you are not willing to look elsewhere.",
    "You have partial entitlement and a large purchase price, and the required down payment on the VA loan is bigger than the down payment conventional would ask for.",
    "Never assume VA is wrong for you because you have heard it is slow or that sellers dislike it. That reputation is decades out of date, and in this metro it is not what I see.",
  ],
  kansasCity: [
    "Leavenworth County and the corridor around Fort Leavenworth carry steady VA volume, and there are agents on both sides of the state line who handle PCS timelines well. If you are moving in on orders with a hard report date, say so on the first call — it changes how I sequence the file.",
    "Whiteman Air Force Base is a two-hour drive from the metro, and I get VA buyers who work in Kansas City and want to be closer to family stationed there. The entitlement travels; the property just has to be one you intend to occupy.",
  ],
  needsConfirmation: [
    "Current VA funding fee percentages — the statutory schedule has changed before. Pull the live table from the VA before quoting.",
    "Whether Josh holds any military-lending designation worth naming here.",
  ],
};

/* ── USDA ─────────────────────────────────────────────────────────────── */

const usda: ProgramDetail = {
  slug: "usda",
  name: "USDA",
  headline: "USDA loans",
  metaTitle: "USDA loans in Kansas City",
  metaDescription:
    "How the USDA Section 502 Guaranteed loan works around Kansas City: no down payment, household income limits, property eligibility maps, guarantee fees, and when USDA is the wrong choice. Josh Pennebaker, NMLS #1737680.",
  lead: "This is the program people rule out without checking. It is zero down, it is not just for farms, and the eligible area starts closer to Kansas City than almost anyone expects. Two things have to line up: the address and your household income.",
  facts: [
    {
      label: "Minimum down payment",
      value: "0%",
      note: "100% financing on the Section 502 Guaranteed program.",
    },
    {
      label: "Credit score floor",
      value: "640",
      note: "USDA publishes no minimum, but 640 is the practical threshold for the automated underwriting most lenders rely on.",
    },
    {
      label: "Mortgage insurance",
      value: "Both",
      note: "A guarantee fee financed into the loan, plus a smaller annual fee collected monthly for the life of the loan.",
    },
    {
      label: "Occupancy",
      value: "Primary",
      note: "Owner-occupied single-family only. No duplexes, no rentals, no second homes.",
    },
  ],
  qualify: [
    {
      heading: "The address has to be eligible",
      body: [
        "USDA maintains a property eligibility map, and the boundaries do not follow anyone's intuition about what counts as rural. Whole towns with grocery stores and school districts are inside the line. Subdivisions ten minutes from a Costco are sometimes inside it too.",
        "The map is the only authority. A neighboring house being eligible does not make yours eligible — the boundary can run down a street. Send me an address and I will check it in a minute; do not rule a house in or out on assumption.",
      ],
    },
    {
      heading: "Household income has to be under the limit",
      body: [
        "This is the requirement that catches people, because it is not the same test as every other program. The limit is based on total household income — the income of all adults living in the home, whether or not they are on the loan — and it is capped at a percentage of the area median income for the county, adjusted for household size.",
        "So a working adult child or a parent living with you counts toward the limit even though their income cannot be used to qualify you. The limits are reset periodically and are county-specific. I will run your exact household against the current figure for the county you are buying in.",
      ],
    },
    {
      heading: "Credit and debt",
      body: [
        "USDA sets no published minimum score, but its automated underwriting system is where the file wants to land, and 640 is the practical entry point for that. Below it, manual underwriting is possible and considerably more work.",
        "Debt ratios are moderately flexible — roughly comparable to conventional, with more room than that when the rest of the file supports it.",
      ],
    },
    {
      heading: "The house itself",
      body: [
        "Single-family, owner-occupied, and it has to be in decent repair — USDA applies condition standards similar in spirit to FHA's. Working systems, sound roof, safe. Large acreage and anything with a working income-producing operation on it can create problems; the property is supposed to be a house, not a farm.",
      ],
    },
  ],
  insurance: {
    heading: "How the guarantee fees work",
    body: [
      "USDA does not call it mortgage insurance, but it functions the same way and it belongs in your payment comparison.",
      "There is an upfront guarantee fee charged as a percentage of the loan amount, normally financed into the balance rather than paid at closing. And there is an annual fee, charged on the loan balance and collected monthly.",
      "The annual fee is the smallest of any program on this site — materially less than FHA's — which is why a USDA payment can undercut an FHA payment on the same house even with nothing down. The estimator on this site models it at 0.35% per year.",
      "It does not cancel. The annual fee runs for the life of the loan, so if you build equity and want out of it, that is a refinance into a conventional loan. Both fee rates are set by USDA and have been adjusted before — I will confirm the current figures against the agency before you sign anything.",
    ],
  },
  pros: [
    "Zero down, with the lowest monthly insurance-equivalent cost of any program here.",
    "The eligible area covers more of the KC region than almost any buyer expects.",
    "No minimum credit score published by the agency.",
    "The seller is allowed to pay your closing costs, and USDA lets you finance an appraised value above the purchase price to cover them.",
  ],
  costs: [
    "Household income limits, counting adults who are not on the loan.",
    "Property eligibility is a hard geographic boundary — no exceptions, no appeals.",
    "The annual fee never cancels.",
    "Primary-residence single-family only.",
    "USDA files route through a state office and can take longer than a conventional file. Build that into your contract dates.",
  ],
  wrongChoice: [
    "Your household income is over the county limit. It is a cliff, not a slope — there is no partial qualification.",
    "The house you want is inside the metro core. Most of Johnson, Wyandotte, and Jackson counties' developed areas are not eligible, and wanting them to be does not change the map.",
    "You want a duplex, a rental, or a second home.",
    "You are competing on a house where a slower close would cost you the deal.",
    "You have VA entitlement — VA is zero down with no annual fee at all.",
  ],
  kansasCity: [
    "The eligible area generally begins where the continuous suburban development ends. In practice that means parts of Miami and Franklin counties in Kansas, and parts of Cass, Clay, and Platte counties in Missouri, have eligible addresses — while the developed cores of Johnson, Wyandotte, and Jackson counties do not. Treat that as a starting point for where to look, not as a determination.",
    "I check the address against the USDA map before we look at anything else, because it is the one requirement that no amount of underwriting can work around. It takes a minute and it saves people weeks.",
  ],
  needsConfirmation: [
    "Current USDA household income limits by county and household size for the KC-area counties.",
    "Current upfront and annual guarantee fee percentages for the fiscal year.",
    "County-level eligibility should be verified address by address on the USDA map — the county summaries above are directional only and must not be presented to a client as a determination.",
  ],
};

export const programDetails: Record<ProgramSlug, ProgramDetail> = {
  conventional,
  fha,
  va,
  usda,
};

export const programOrder: ProgramSlug[] = ["conventional", "fha", "va", "usda"];

/* ── Programs hub ─────────────────────────────────────────────────────── */

export const programsHub = {
  metaTitle: "Loan programs",
  metaDescription:
    "Conventional, FHA, VA, and USDA loans compared plainly for Kansas City buyers — down payment, credit floor, and how mortgage insurance is treated in each. Josh Pennebaker, NMLS #1737680.",
  headline: "Four programs. The right one is a matter of arithmetic, not preference.",
  lead: [
    "Every lender in Kansas City offers all four of these. What differs is whether anyone sits down and tells you which one actually costs you less over the years you plan to own the house — including the times when the program you qualify for is the wrong one to take.",
    "Here is the short version. Each page below goes into who qualifies, how the mortgage insurance is treated, and where the program falls down.",
  ],
  /** Column headers for the comparison table. */
  comparison: {
    columns: ["Program", "Down", "Credit", "Mortgage insurance", "Occupancy"],
    rows: programOrder.map((slug) => {
      const p = programDetails[slug];
      return {
        slug,
        name: p.name,
        down: p.facts[0].value,
        credit: p.facts[1].value,
        insurance: p.facts[2].value,
        occupancy: p.facts[3].value,
      };
    }),
  },
};

/* ── About ────────────────────────────────────────────────────────────── */

export const about = {
  metaTitle: "About Josh Pennebaker",
  metaDescription:
    "Josh Pennebaker, mortgage broker in Kansas City, NMLS #1737680. Small-town southeast Missouri, moved to KC in 2011, licensed in Kansas and Missouri.",
  headline: "I grew up in a town where the bank knew your name.",
  lead: "I am Josh Pennebaker. I do home loans in Kansas City, on both sides of the state line, and I answer my own phone. That is not a slogan — it is the whole operating model.",
  sections: [
    {
      heading: "Where I am from",
      body: [
        "Small-town southeast Missouri. The kind of place where the person handling your mortgage was someone you saw at the grocery store, and where being hard to reach was not an option because everyone knew where you lived.",
        "I moved to Kansas City in 2011 and never left. My wife and I married in 2015. We have two kids. They go to school here, we buy our groceries here, and when I say I know this market I mean I have watched it change block by block for more than a decade.",
      ],
    },
    {
      heading: "How I work",
      body: [
        "The big lenders give you a case number and a queue. I give you my cell number. When your agent needs a pre-approval letter on a Saturday afternoon because a house just came on and the seller wants offers by Sunday, a call center cannot help you. I can, and I have.",
        "One person handles your file from the first call through closing. Not a loan officer who hands you to a processor who hands you to an underwriter you never speak to. If something goes sideways in underwriting, you hear it from me, and you hear it the day I hear it.",
        "I will also tell you when the answer is no, or not yet. If you are better off waiting six months to fix a credit issue or pay down a card, that is what I will tell you, and I will tell you exactly what to do in those six months. I would rather have you as a client later than put you in a bad loan now.",
      ],
    },
    {
      heading: "What I actually do all day",
      body: [
        "Conventional, FHA, VA, and USDA loans for purchases and refinances across Kansas and Missouri. Most of it is people buying a house to live in.",
        "The unglamorous part is the part that matters: reading tax statements before we write an offer so a Johnson County special assessment does not blow up your debt ratio, checking a USDA map before you get attached to a house, knowing which agents actually close and which ones create work.",
        "Almost all of my business comes from people I have already helped sending me their family and their coworkers. That is the only marketing I have ever really needed, and it is also the only accountability that matters — if I do this badly, the phone stops ringing.",
      ],
    },
    {
      heading: "Off the clock",
      body: [
        "Golf, badly and often. Chiefs, every Sunday, with the whole family in red. If you call me during a game I will still pick up, but you will hear about it.",
      ],
    },
  ],
  /**
   * Facts a prospect will look for that I could not source. Do NOT invent
   * numbers here — years in business, loan volume, and closed-loan counts
   * are exactly the claims a regulator or a competitor would check.
   */
  needsConfirmation: [
    "Years originating mortgages, and the year Josh entered the industry.",
    "Number of loans closed and/or total dollar volume — with the period it covers, since an unqualified lifetime figure is misleading.",
    "Any professional designations, awards, or production rankings, with the awarding body and year.",
    "Prior employers or brokerages, if he wants them listed.",
    "Whether the Kansas and Missouri state license numbers should be published alongside the NMLS ID.",
    "A real headshot and, ideally, one photograph of Kansas City that is his own. No stock photography and no generated likeness.",
  ],
};

/* ── Contact ──────────────────────────────────────────────────────────── */

export const contact = {
  metaTitle: "Contact Josh",
  metaDescription:
    "Call Josh Pennebaker directly, book a time on his calendar, or answer three questions and he will call you. Kansas City mortgage broker, NMLS #1737680, licensed in Kansas and Missouri.",
  headline: "Call me. I am the one who answers.",
  lead: "There is no phone tree and no lead form that routes you to whoever is next up. The number below rings my cell.",
  hours: [
    { label: "Weekdays", value: "8a – 7p" },
    { label: "Saturday", value: "By text or call" },
    { label: "Sunday", value: "If you are under contract" },
  ],
  expectations: [
    "A call back the same day, and always within one business day.",
    "A real conversation before any credit is pulled.",
    "A straight answer about whether now is the right time, including when it is not.",
    "Your information goes to me. It is never sold to a lead aggregator or resold as a shared lead.",
  ],
};

/* ── Shared disclaimer text ───────────────────────────────────────────── */

export const ESTIMATE_DISCLAIMER =
  "This is an estimate, not a pre-approval and not a commitment to lend. It is a math exercise on the numbers you entered — it does not verify your income, pull your credit, or price a rate. Actual terms depend on credit approval, income and asset verification, the property appraisal, and pricing on the day you lock.";

export const RATE_INPUT_NOTE =
  "You supply the interest rate. Nothing on this site quotes one — pricing moves daily and varies by borrower, so any rate printed on a marketing page would be wrong by the time you read it. Call me for a real number.";
