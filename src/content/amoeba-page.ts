import { amoebaDocs, amoebaOnePager, learnPath, routes } from "@/config/site";
import { assessContent, assessmentHref } from "@/content/assess";
import { elasticContent } from "@/content/elastic";
import { howItWorksSteps } from "@/content/how-it-works";
import { productFilms } from "@/content/product-films";
import type { ProductPageContent, ReadMoreTile } from "@/content/product-page";

/**
 * `/amoeba`: every string the page prints, in the mock's layout.
 *
 * The product tour adds each row's line and the film (`product-films.ts`).
 * What Amoeba does is a heading, so it has no "?" (owner, 1 Nov 2026).
 *
 * The Runs on chips and the line under the How it works cards are read from
 * `elastic.ts`, and the cards from `how-it-works.ts`, rather than copied: a
 * second copy would be a second claim free to drift. The hero's line is this
 * page's own. Nothing here is a new figure.
 *
 * Amoeba is "Block storage optimization" for Windows and Linux VMs on Azure
 * and AWS: the site's one name for what it does.
 */

/**
 * 🔴 THE READ MORE ROW HOLDS ONLY WHAT IS PUBLISHED. The mock draws six tiles,
 * two by two: the guide and the FAQ (behind `amoebaDocs`), the one-pager
 * download (behind `amoebaOnePager`) and the /learn article, then the two cloud
 * pages (owner, 1 Nov 2026). A tile whose flag is off drops out.
 * The per-cloud pages (`/azure-managed-disk-cost-optimization`, `/ebs-cost-optimization`) open their row
 * on the same two tiles, behind the same flag.
 */
export const amoebaGuideAndFaq: readonly ReadMoreTile[] = [
  {
    kind: "page",
    title: "Product guide",
    line: "Onboard, what changes, staying in control",
    href: routes.amoebaGuide,
  },
  {
    kind: "page",
    title: "FAQ",
    line: "Data safety, downtime, requirements and costs",
    href: routes.amoebaFaq,
  },
];

/**
 * The day /amoeba's content last changed (its title), for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes /amoeba's content
 * moves this to that day in the same PR; never the build's date.
 */
export const amoebaPageLastUpdated = "3 November 2026";

export const amoebaPageContent: ProductPageContent = {
  product: "amoeba",
  meta: {
    title: "Amoeba: Block storage optimization",
    description:
      "Amoeba rightsizes Azure managed disks and Amazon EBS volumes on Windows and Linux VMs to your data, autonomously and without any downtime.",
    /* What "What is Amoeba?" says: structured data must say what the page
       says. */
    appDescription:
      "Block storage optimization for VMs on Azure and AWS. Amoeba moves a VM’s data disks onto one btrfs pool sized to your data, with room to grow. Then it grows and shrinks that pool as your data changes.",
  },
  hero: {
    /* "Block storage" is tied with a no-break space, as the mock writes the h1:
       the longer line never leaves "Block" alone at a line end. */
    title: "Block\u00a0storage optimization",
    /* The page's own line: what Amoeba does, on which disks and VMs, and how. */
    line: "Amoeba rightsizes Azure managed disks and Amazon EBS volumes on Windows and Linux VMs, autonomously and without any downtime.",
    cta: { label: assessContent.assessment.cta.label, href: assessmentHref("amoeba") },
  },
  about: {
    title: "What is Amoeba?",
    paragraphs: [
      /* "btrfs pool" links the Learn article on how one works (owner, 1 Nov 2026). */
      [
        "Amoeba is a block storage optimization platform for VMs on Azure and AWS. Cloud disks only grow: an Azure managed disk or an Amazon Elastic Block Store (EBS) volume can be made larger, but not smaller. Amoeba moves a VM’s data disks onto one ",
        { a: "btrfs pool", href: learnPath("btrfs-multiple-disks") },
        " sized to your data, with room to grow. Then it grows and shrinks that pool while it stays mounted, so you pay for the space your data uses.",
      ],
      "Amoeba installs its agent on each VM you onboard, through Azure Run Command or AWS Systems Manager, with no application code changes. It copies your data while your services run, then switches each mount to the pool with a short restart of the services that use it.",
      "You see used and provisioned space on every disk, what each VM’s disks cost at list price, and what the pool saves. Per VM, you choose whether shrinks run on their own or wait for you.",
    ],
    more: "More about Amoeba",
  },
  offerings: [
    {
      id: "monitoring",
      label: "Monitoring",
      drawing: "disks",
      line: "Used and provisioned space on every disk.",
    },
    {
      id: "savings-insights",
      label: "Savings insights",
      drawing: "saving",
      line: "What each VM costs, and what you save.",
    },
    {
      /* The id stays, as it is an address; the label no longer repeats the h1. */
      id: "block-storage-optimization",
      label: "Rightsizing",
      drawing: "pool",
      line: "Grows before it fills, and shrinks one disk at a time.",
    },
  ],
  what: {
    heading: "What Amoeba does",
    runsOn: elasticContent.runsOn,
  },
  film: productFilms.amoeba,
  how: {
    /* The same heading as /coral's; the section keeps its id. */
    title: "How it works",
    steps: howItWorksSteps.amoeba,
    example: elasticContent.caption,
  },
  readMore: {
    title: "Amoeba docs and guides",
    allDocs: { label: "All docs", href: `${routes.docs}#amoeba` },
    tiles: [
      ...(amoebaDocs ? amoebaGuideAndFaq : []),
      ...(amoebaOnePager
        ? [{ kind: "download", title: "One-pager", document: "amoeba-one-pager" } as const]
        : []),
      /* Its /learn article. */
      {
        kind: "page",
        title: "Shrinking an Azure managed disk",
        line: "Why it can’t, and what works",
        href: learnPath("shrink-azure-managed-disk"),
      },
      /* Its two cloud pages (owner, 1 Nov 2026), each line what that page covers. */
      {
        kind: "page",
        title: "Azure managed disk cost optimization",
        line: "Data disks on Windows and Linux VMs in Azure",
        href: routes.azureManagedDiskCostOptimization,
      },
      {
        kind: "page",
        title: "EBS cost optimization",
        line: "Data volumes on Windows and Linux EC2 instances",
        href: routes.ebsCostOptimization,
      },
    ],
  },
};
