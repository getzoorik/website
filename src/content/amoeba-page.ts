import { amoebaDocs, amoebaOnePager, routes } from "@/config/site";
import { assessContent, assessmentHref } from "@/content/assess";
import { elasticContent } from "@/content/elastic";
import { howItWorksSteps } from "@/content/how-it-works";
import { productFilms } from "@/content/product-films";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";

/**
 * `/amoeba`: every string the page prints, verbatim from the mock.
 *
 * The product tour adds each row's line, the "?" on What Amoeba does and the
 * film (`product-films.ts`).
 *
 * The Runs on chips and the line under the How it works cards are read from
 * `elastic.ts`, and the cards from `how-it-works.ts`, rather than copied: a
 * second copy would be a second claim free to drift. The savings figures on the
 * hero's right are the three ranges read from `savings.ts`; nothing here is a
 * new figure.
 *
 * Amoeba is "Block storage cost optimization" for Windows and Linux VMs on Azure
 * and AWS: the site's one name for what it does.
 */

/**
 * 🔴 THE READ MORE ROW HOLDS ONLY WHAT IS PUBLISHED. The mock draws four tiles:
 * the guide and the FAQ (behind `amoebaDocs`), the one-pager download (behind
 * `amoebaOnePager`) and the /learn article. A tile whose flag is off drops out.
 */
const guideAndFaq: readonly ReadMoreTile[] = [
  {
    kind: "page",
    title: "Product guide",
    line: "Onboard, what changes, staying in control",
    href: routes.amoebaGuide,
  },
  {
    kind: "page",
    title: "FAQ",
    line: "Safety, downtime, expanding, agent and costs",
    href: routes.amoebaFaq,
  },
];

/**
 * The day /amoeba's content last changed (the product tour and its film), for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes /amoeba's content
 * moves this to that day in the same PR; never the build's date.
 */
export const amoebaPageLastUpdated = "17 October 2026";

export const amoebaPageContent: ProductPageContent = {
  product: "amoeba",
  meta: {
    title: "Amoeba: Azure disk and Amazon EBS cost optimization",
    description:
      "Amoeba rightsizes Azure managed disks and Amazon EBS volumes to the data you store, to reduce your cloud bill, autonomously, without any downtime.",
    /* What "What is Amoeba?" says: structured data must say what the page
       says. */
    appDescription:
      "Block storage cost optimization for VMs on Azure and AWS. Amoeba moves a VM’s data disks onto one pool sized to the data plus 20%, then expands and shrinks that pool online, one disk at a time.",
  },
  hero: {
    /* "Block storage" is tied with a no-break space, as the mock writes the h1:
       the longer line never leaves "Block" alone at a line end. */
    title: "Block\u00a0storage cost optimization",
    supportedOn: { label: "Supported on", platforms: "Windows and Linux" },
    cta: { label: assessContent.assessment.cta.label, href: assessmentHref("amoeba") },
  },
  about: {
    title: "What is Amoeba?",
    paragraphs: [
      "Amoeba is a block storage cost optimization platform for VMs on Azure and AWS. Cloud disks only grow: an Azure managed disk or an Amazon Elastic Block Store (EBS) volume can be made larger, but not smaller. Amoeba moves a VM’s data disks onto one pool sized to the data plus 20%, then expands and shrinks that pool online, one disk at a time, so you pay for the space your data uses, plus headroom, rather than the space you once provisioned.",
      "Amoeba installs an agent on each VM you onboard, through Azure Run Command or AWS Systems Manager, with no application code changes. The systemd services that use the data mounts restart at the switch onto the pool. After that, every resize runs online, without unmounting.",
      "With Amoeba, you see used and provisioned space on every disk, what each VM’s disks cost at list price, and what the pool saves. You choose, per VM, whether shrinks run on their own or wait for you.",
    ],
  },
  offerings: [
    {
      id: "monitoring",
      label: "Monitoring",
      icon: "monitor",
      line: "Used and provisioned space on every disk.",
    },
    {
      id: "savings-insights",
      label: "Savings insights",
      icon: "savings",
      line: "What each VM costs, and what you save.",
    },
    {
      id: "block-storage-optimization",
      label: "Block storage optimization",
      icon: "storage",
      line: "Expands and shrinks online, one disk at a time.",
    },
  ],
  what: {
    title: "What Amoeba does",
    heading: "What Amoeba does?",
    runsOn: elasticContent.runsOn,
  },
  film: productFilms.amoeba,
  how: {
    title: "How it works",
    steps: howItWorksSteps.amoeba,
    example: elasticContent.caption,
  },
  readMore: {
    title: "Read more",
    allDocs: { label: "All docs", href: `${routes.docs}#amoeba` },
    tiles: [
      ...(amoebaDocs ? guideAndFaq : []),
      ...(amoebaOnePager
        ? [{ kind: "download", title: "One-pager", document: "amoeba-one-pager" } as const]
        : []),
      /* Its /learn article. */
      {
        kind: "page",
        title: "Shrinking an Azure managed disk",
        line: "Why it can’t, and what works",
        href: routes.learnShrinkAzureDisk,
      },
    ],
  },
};
