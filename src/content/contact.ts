import { calendarUrl, contactEmail, routes, site } from "@/config/site";
import { about, registeredOffice, type AboutFact } from "@/content/about";

/**
 * `/contact`: every string it prints, word for word from the checked draft
 * (docs/website-seo/new-pages-2026-10-30/contact-pricing/contact.md, each fact traced in its ledger.md) and the mock
 * (contact.html). The owner added the page on 28 Oct 2026.
 *
 * Two ways to reach us and nothing else: the calendar and the one address. No phone number, no form and no chat, as
 * the site has none. The only reply times are the three the sources state, each in its own row: the emailed
 * assessment report, a privacy request and a grievance. Every address is read from config (`calendarUrl`,
 * `contactEmail`, the routes), the company's facts from /about's, and the grievance officer is /privacy's §15.
 *
 * The text is the draft's small markup, drawn by `RichText`: **bold**, [text](href), the address as a mailto. A mail
 * link carries a subject only where the site already uses that subject.
 */

/**
 * The day /contact's content last changed, for the sitemap's `lastmod` only: the page prints no date. Whoever changes
 * the page moves it in the same PR; never the build's date.
 */
export const contactLastUpdated = "1 November 2026";

/** A ready email with its subject, as the mock encodes it ("Design%20partner%20program"). */
const mail = (subject: string): string =>
  `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;

/** One of /about's company facts, by its term: /contact prints the same words. */
function aboutFact(term: string): {
  readonly term: string;
  readonly value: string;
  readonly wide?: true;
} {
  const fact: AboutFact | undefined = about.company.facts.find((each) => each.term === term);
  if (!fact || typeof fact.value !== "string")
    throw new Error(`/contact: /about has no fact "${term}"`);
  return { term: fact.term, value: fact.value, ...(fact.wide ? { wide: fact.wide } : {}) };
}

/** One topic: its name (the summary's term), its text, and the links listed under it. */
export interface ContactTopic {
  readonly term: string;
  readonly text: string;
  readonly list?: readonly string[];
}

/** /privacy's grievance officer (§15), as /contact repeats it under Security and privacy. */
export const grievanceOfficer = {
  title: "Grievance officer and privacy contact (India)",
  line: "This person handles grievances and answers questions about how we process your personal data.",
  facts: [
    { term: "Name and title", value: "Sheldon, CXO" },
    { term: "Email", value: contactEmail },
    {
      term: "Postal address",
      value: `${site.legalName}, ${registeredOffice.street}, ${registeredOffice.locality} ${registeredOffice.postalCode}, ${registeredOffice.region}`,
      wide: true,
    },
  ],
  after: `We acknowledge a grievance within 2 working days and resolve it within 30 days. [Privacy policy: Contact us and grievance officer](${routes.privacy}#contact)`,
} as const;

export const contactPage = {
  /** The page's `<title>` (through the site's "%s | Zoorik" template) and its description. */
  meta: {
    title: "Contact",
    description: `Book a demo with the people who build Coral and Amoeba, or email ${contactEmail}. For early access, partners, press, security and privacy.`,
  },
  hero: {
    title: "Contact Zoorik",
    deck: "Book a demo with the people who build Coral and Amoeba, or write to us.",
  },
  /**
   * The pair on the band: the calendar on the white card, the address on the navy one. The calendar is "Book a demo",
   * as everywhere on the site (owner, 1 Nov 2026; D228 counts a booked demo as the lead).
   */
  call: {
    title: "Book a demo",
    line: "Pick a time with the people who build Coral and Amoeba. A call takes thirty minutes.",
    go: { label: "Book a demo", href: calendarUrl },
  },
  email: {
    title: "Email",
    line: `Write to ${contactEmail}. Every topic below uses this one address.`,
    go: { label: "Write to us", href: `mailto:${contactEmail}` },
    fine: "Remove tokens, keys and other secrets from anything you send.",
  },
  /** What to write to us about: three groups of topics; the grievance officer closes the last. */
  topics: {
    id: "topics",
    title: "What to write to us about",
    groups: [
      {
        title: "Coral and Amoeba",
        topics: [
          {
            term: "A demo",
            text: `[Book a demo](${calendarUrl}), or write to us. How Coral and Amoeba are priced is on [Pricing](${routes.pricing}).`,
          },
          {
            term: "Early access",
            text: `Coral and Amoeba are in early access. [Book a demo for early access](${calendarUrl}).`,
          },
          {
            term: "Your assessment report",
            text: "The free assessment writes one PDF report on your machine and uploads nothing. You decide whether to email it to us. If you do, a founder replies within 24 hours.",
            list: [
              `[Email your Coral report](${mail("Coral assessment")})`,
              `[Email your Amoeba report](${mail("Amoeba assessment")})`,
              `No report yet? [Run the free assessment](${routes.assessment}).`,
            ],
          },
          {
            term: "Help with Coral or Amoeba",
            text: `Start with [Coral troubleshooting](${routes.coralTroubleshooting}) or [Amoeba troubleshooting](${routes.amoebaTroubleshooting}). Still stuck? Email us, or [pick a time to talk](${calendarUrl}). Tell us what you ran and what the console shows.`,
          },
          {
            term: "Buying through a marketplace",
            text: `We can set up a private offer on AWS or Microsoft Marketplace. [Write to us](${mail("Marketplace")}).`,
          },
        ],
      },
      {
        title: "Programs, press and jobs",
        topics: [
          {
            term: "Design partners",
            text: `Run Coral and Amoeba free on your non-production clusters and disks, and shape what we build next. [Apply to be a design partner](${mail("Design partner program")}), or read about the [Design partner program](${routes.designPartners}).`,
          },
          {
            term: "Partners",
            text: `For consultancies, managed service providers and resellers. The program is coming soon. [Write to us](${mail("Partner program")}), or read about the [Partner program](${routes.partners}).`,
          },
          {
            term: "Referrals",
            text: `The program is coming soon. [Write to us](${mail("Referral program")}) and we will tell you first, or read about the [Referral program](${routes.referrals}).`,
          },
          {
            term: "Press, or writing about Zoorik",
            text: `Our logo, colours and words are on [Brand assets](${routes.brandAssets}). Need a format that isn't there? [Write to us](${mail("Brand assets")}).`,
          },
          {
            term: "Jobs",
            text: `No open roles right now. [Introduce yourself](${mail("Introducing myself")}) anyway, or read about [Careers](${routes.careers}).`,
          },
        ],
      },
      {
        title: "Security and privacy",
        topics: [
          {
            term: "Report a security issue",
            text: `Email ${contactEmail}. Please don't test Zoorik's security without our written permission. More on [Security](${routes.security}#report) and the [Trust center](${routes.trust}).`,
          },
          {
            term: "Privacy requests",
            text: `Email us from the address you sign in with, or the address you used to contact us. Tell us what you want. For Amoeba, include your directory id. We reply within 30 days. Your rights are in the [Privacy policy](${routes.privacy}#your-rights).`,
          },
        ],
        grievance: true,
      },
    ] satisfies readonly {
      readonly title: string;
      readonly topics: readonly ContactTopic[];
      readonly grievance?: true;
    }[],
  },
  /** The company, as /about prints it, without its hosting and contact rows. */
  company: {
    id: "company",
    title: "Company details",
    facts: ["Legal name", "Incorporated", "CIN", "Registered office"].map(aboutFact),
    after: `To write to us by post, use our registered office. More about the company is on [About](${routes.about}#company).`,
  },
  /** The footer's social row, then Zoorik's own page in each store and the way to every listing. */
  follow: {
    title: "Follow us",
    label: "Follow us and buy through your cloud marketplace",
  },
  buy: {
    title: "Buy through your cloud marketplace",
    line: "Coral and Amoeba are available in AWS Marketplace and Microsoft Marketplace.",
    all: { text: "Every marketplace, review site and registry", href: routes.marketplaces },
  },
} as const;
