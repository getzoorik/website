import {
  crunchbaseProfile,
  f6sCompany,
  g2Coral,
  tracxnCompany,
  wellfoundCompany,
  wikidataEntity,
} from "@/config/entity";
import { calendarUrl, contactEmail, routes, site } from "@/config/site";
import { caseStudy } from "@/content/case-studies";
import type { FooterSocialPlatform } from "@/content/footer";
import { newsFromZoorik } from "@/content/news";
import { platformLabel, products, type ProductId } from "@/content/products";

/**
 * `/about`: every string the page prints, verbatim from the mock. It is built
 * on the live site's own sections at the full width, with no founders, and
 * "Available on" as the two stores' buttons with no product named, then
 * Milestones and the "Zoorik on the web" card.
 *
 * 🔴 THE SITE'S WORDING STAYS. The mock's hero deck ("to cut cloud cost while
 * your systems keep serving") and "What we build" line ("reduces cloud cost,
 * continuously") went back to retired words: the deck says "reduce …
 * autonomously, without any downtime" and the line "autonomously", as the rest
 * of the site does.
 *
 * Product names are written plainly here; the page keeps each one out of a
 * translator's hands (`named()`), as the mock marks them.
 *
 * ─── THE SECTION IDS ARE ADDRESSES ─────────────────────────────────────────
 * `#what-we-build`, `#how-we-build`, `#company` and `#find-us`: a link to a
 * part of the page keeps its hash (`hashKeepingRoutes`), so these ids are
 * shared addresses. Keep an id when its heading changes.
 */

export interface AboutSection {
  readonly id: "what-we-build" | "how-we-build" | "company" | "milestones" | "find-us";
  readonly title: string;
}

/** A link of the page's own: its words and where it goes. */
export interface AboutLink {
  readonly text: string;
  readonly href: string;
}

/** One milestone: its date, what happened, one line, and the page that tells more. */
export interface AboutMilestone {
  /** The time element's machine form ("2026-10-12", or a year alone) and what it prints ("12 Oct 2026"). */
  readonly date: { readonly iso: string; readonly text: string };
  readonly title: string;
  /** The line; the link, when there is one, follows it after a space and ends on a full stop. */
  readonly line: string;
  readonly link?: AboutLink;
}

/** One card of "Zoorik on the web": the place's name, what is there, and the address. */
export interface AboutWebLink {
  readonly name: string;
  readonly line: string;
  readonly href: string;
}

export interface AboutFact {
  readonly term: string;
  /** Plain text; or a link, which is a mailto or a new tab by its href. */
  readonly value: string | { readonly text: string; readonly href: string };
  /** The registered office takes two columns where four sit in a row. */
  readonly wide?: true;
}

/**
 * The registered office in its parts, which the structured data's address
 * reads; the page prints them as one line (`officeLine`).
 */
export const registeredOffice = {
  street: "Vaishnavi Signature, No. 78/9, Outer Ring Road, Bellandur, Bangalore South",
  locality: "Bangalore",
  postalCode: "560103",
  region: "Karnataka",
  country: { code: "IN", name: "India" },
} as const;

const officeLine = `${registeredOffice.street}, ${registeredOffice.locality} ${registeredOffice.postalCode}, ${registeredOffice.region}, ${registeredOffice.country.name}`;

/** The Corporate Identity Number, as /about prints it and the structured data names it. */
export const cin = "U62011KA2026PTC228102";

/**
 * The day /about's content last changed, for the sitemap's `lastmod` only: the
 * page does not print it. Whoever changes /about's content moves this to that
 * day in the same PR; never the build's date.
 */
export const aboutLastUpdated = "19 October 2026";

/** The year Zoorik Private Limited was incorporated: the Company facts' and the first milestone's. */
const incorporated = "2026";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** A day in its machine form ("2026-10-16"): the time element's value, and the mock's "16 Oct 2026". */
function dayOf(iso: string): AboutMilestone["date"] {
  const [year, month, date] = iso.split("-") as [string, string, string];
  return { iso, text: `${Number(date)} ${MONTHS[Number(month) - 1]!.slice(0, 3)} ${year}` };
}

/** A day as the site writes it ("12 October 2026"), as `dayOf` gives it. */
function day(long: string): AboutMilestone["date"] {
  const [date, month, year] = long.split(" ") as [string, (typeof MONTHS)[number], string];
  const index = MONTHS.indexOf(month);
  if (index < 0) throw new Error(`about: "${long}" is not a day`);
  return dayOf(`${year}-${String(index + 1).padStart(2, "0")}-${date.padStart(2, "0")}`);
}

/* The announcement on /news's From Zoorik (`news.ts`) that links to a page: the Helm and Terraform milestone's day,
   and the assessment's day and version ("1.3", from its title), are read from it. Found by its link, so a newer
   announcement at the top moves nothing here. */
const announced = (href: string) => newsFromZoorik.find((item) => item.href === href)!;
const installs = announced(routes.openSource);
const assessment = announced(routes.assessment);
const assessmentVersion = assessment.title.match(/\d+\.\d+/)![0];

/* The case study's own figures: its label (the first part of its kicker, "Validation Lab"), its headline figure
   (−58%), the bill on the day Coral was connected and today's, and the day it was published. */
const studyLabel = caseStudy.hero.kicker.split(" · ")[0]!;
const studySteps = caseStudy.result.costs.steps;
const studyBefore = studySteps[0]!.label;
const studyAfter = studySteps[studySteps.length - 1]!.label;

export const about = {
  /** An absolute `<title>` (with /careers's): the mock's, with no " · Zoorik" after it. */
  meta: {
    title: "About Zoorik: who builds Coral and Amoeba",
    description:
      "Zoorik Private Limited builds Coral, Kubernetes cost optimization on AKS and EKS, and Amoeba, block storage cost optimization on Azure and AWS.",
  },
  hero: {
    title: "About Zoorik",
    deck: "We build Coral and Amoeba to reduce your cloud bill, autonomously, without any downtime.",
  },
  what: {
    section: { id: "what-we-build", title: "What we build" },
    lede: "Zoorik reduces cloud cost, autonomously. Coral is Kubernetes cost optimization on AKS and EKS. Amoeba is block storage cost optimization on Azure and AWS.",
    /** One tile per product, Coral first: its mark, its name and its one line, to its page. */
    products: ["coral", "amoeba"] as const satisfies readonly ProductId[],
  },
  /** The home page's four cards, a tick where the home cards draw a figure. */
  how: {
    section: { id: "how-we-build", title: "How we build" },
    cards: [
      {
        title: "No code changes",
        body: "Coral never edits your manifests or Git sources. Amoeba keeps every mount path.",
      },
      {
        title: "You stay in control",
        body: "You decide what each product manages, and see every change it makes.",
      },
      {
        title: "Figures you can check",
        body: "Coral and Amoeba show where each figure comes from. One they can’t know shows a dash and the reason.",
      },
      {
        title: "Outbound only",
        body: "Our agents open every connection themselves and accept none from outside.",
      },
    ],
  },
  /** The facts in reading order: four to a row on a wide screen puts the address under the first two. */
  company: {
    section: { id: "company", title: "Company" },
    facts: [
      { term: "Legal name", value: site.legalName },
      { term: "Incorporated", value: `In India, ${incorporated}` },
      { term: "CIN", value: cin },
      { term: "Hosting", value: "Microsoft Azure, Central India" },
      {
        term: "Registered office",
        value: officeLine,
        wide: true,
      },
      { term: "Email", value: { text: contactEmail, href: `mailto:${contactEmail}` } },
      { term: "Book a demo", value: { text: "cal.com/zoorik/talk", href: calendarUrl } },
    ] satisfies readonly AboutFact[] as readonly AboutFact[],
  },
  /**
   * Milestones: public, dated facts only; no customer, revenue or user figure until there is one to state. The
   * case study's figures are read from the study (`case-studies.ts`); "eight days" is its "8 days"
   * (`band.stats[3]`), in words as its prose and the hub's card say it. The Helm and Terraform milestone's day, and
   * the assessment's day and version, are read from their announcements on /news (`newsFromZoorik`).
   */
  milestones: {
    section: { id: "milestones", title: "Milestones" },
    items: [
      {
        date: { iso: incorporated, text: incorporated },
        title: `${site.legalName} is founded`,
        line: `Incorporated in ${registeredOffice.locality} to build Coral and Amoeba.`,
      },
      {
        date: day(caseStudy.band.date),
        title: `${studyLabel}: ${caseStudy.band.stats[0].value} on our own cluster`,
        line: `${products.coral.name} reduced our own ${platformLabel.aks} development cluster’s machine bill from ${studyBefore} to ${studyAfter} a month in eight days.`,
        link: { text: "Read the case study", href: caseStudy.route },
      },
      {
        date: dayOf(installs.date),
        title: "Coral installs with Helm and Terraform",
        line: "A public Helm chart, and AKS and EKS modules on the Terraform Registry, beside zoorikctl.",
        link: { text: "See open source", href: routes.openSource },
      },
      {
        date: dayOf(assessment.date),
        title: `Free assessment ${assessmentVersion}`,
        line: "One command on PyPI and npm writes one PDF report for Coral and Amoeba.",
        link: { text: "Run it", href: routes.assessment },
      },
    ] satisfies readonly AboutMilestone[] as readonly AboutMilestone[],
  },
  find: {
    section: { id: "find-us", title: "Find us" },
    stores: "Available on",
    follow: "Follow us",
    /** The third card, across the width: the footer's "Install from" channels and GitHub (`aboutChannels`). */
    published: "Published on",
    /** The social row, in the footer's order and from its list (the same row as the footer's),
     *  Reddit included. */
    social: [
      "linkedin",
      "x",
      "reddit",
      "medium",
      "github",
    ] as const satisfies readonly FooterSocialPlatform[],
    /**
     * The fourth card, across the width: six profiles, each address `entity.ts`'s, and the line to /marketplaces,
     * where every one is listed.
     */
    web: {
      title: "Zoorik on the web",
      links: [
        { name: "Crunchbase", line: "Company profile", href: crunchbaseProfile },
        { name: "Wellfound", line: "Company and roles", href: wellfoundCompany },
        { name: "Tracxn", line: "Company profile", href: tracxnCompany },
        { name: "G2", line: "Reviews of Coral", href: g2Coral },
        { name: "F6S", line: "Company profile", href: f6sCompany },
        /* The entry's own ID (Q141717592), the last part of its address. */
        {
          name: "Wikidata",
          line: wikidataEntity.slice(wikidataEntity.lastIndexOf("/") + 1),
          href: wikidataEntity,
        },
      ] satisfies readonly AboutWebLink[] as readonly AboutWebLink[],
      all: {
        text: "Every marketplace, review site and registry",
        href: routes.marketplaces,
      } satisfies AboutLink,
    },
    /** "New articles go out on Learn and our Medium publication.", split around its two links. */
    note: {
      before: "New articles go out on ",
      learn: { text: "Learn", href: routes.learn },
      between: " and our ",
      medium: { text: "Medium publication", href: "https://medium.com/zoorik" },
      after: ".",
    },
  },
} as const;
