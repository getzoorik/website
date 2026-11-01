import { amoebaDocs, amoebaOnePager, routes } from "@/config/site";
import { products, type ProductId } from "@/content/products";

/**
 * The published documents, and every string the site prints about them: the
 * Docs hub (`/docs`), the "Read more" row on a product page, and the downloads
 * on the guides and FAQs. Verbatim from the mocks.
 *
 * ─── ONE REGISTRY, ONE LIST OF TILES ───────────────────────────────────────
 * Each PDF is written down once (`documents`): where it is served, which page
 * is its web version, and the name a download's accessible name uses. Each
 * product's documents are listed once (`shelves`): the hub draws them with
 * their PDFs underneath, the Read more row draws the same tiles with the
 * one-pager as a download. A line changes in one place.
 *
 * ─── WHAT IS HELD IS LEFT OUT, NEVER DRAWN AS "COMING" ─────────────────────
 * The Amoeba guide and FAQ (`amoebaDocs`) and the Amoeba one-pager
 * (`amoebaOnePager`) can be held. A held tile is not listed, a product with no
 * listed tile has no hub group and no row, and a held PDF is not in
 * `public/docs/`. The mocks draw no held state, so holding only removes
 * things. "PDF to come" is the mock's own words for a released
 * page whose PDF does not exist yet.
 *
 * ─── NO FIGURE IS TYPED HERE ───────────────────────────────────────────────
 * Pages, size and paper are read from each file at build
 * (`src/features/documents/document-facts.ts`). Only the file's public path is
 * written down; `public/_headers` gives each one its canonical Link header.
 */

export type DocumentId =
  | "coral-guide"
  | "coral-faq"
  | "coral-one-pager"
  | "amoeba-guide"
  | "amoeba-one-pager"
  | "coral-case-study"
  | "coral-assessment-example"
  | "amoeba-assessment-example"
  | "coral-dpa";

export interface PublishedDocument {
  readonly id: DocumentId;
  readonly product: ProductId;
  /** Served from `public/`, so this is also the file under `public/`. */
  readonly pdf: `/docs/${string}.pdf`;
  /** The page the PDF's canonical Link header names. */
  readonly canonical: string;
  /**
   * Whether the file ships. A held document is not copied to `public/docs/`,
   * has no `_headers` rule, and no page offers it.
   */
  readonly released: boolean;
  /** The document inside a download's accessible name: "Download <spokenName>, PDF, 5 pages, 0.1 MB, A4". */
  readonly spokenName: string;
}

/**
 * The nine PDFs the site knows, each copied from its source, never from an earlier copy:
 *   coral-product-guide.pdf
 *   coral-faq.pdf
 *   coral-one-pager.pdf
 *   amoeba-product-guide.pdf
 *   amoeba-one-pager.pdf
 *   coral-case-study-dev-cluster.pdf
 *   coral-assessment-example.pdf
 *   amoeba-assessment-example.pdf
 *   coral-data-processing-agreement-v1.0.pdf
 *
 * 🔴 THERE IS NO TENTH. The internal FAQ for Zoorik's own team never ships:
 * not as a file, an entry, a link or a fact (`src/app/internal-docs.test.ts`).
 * Neither does the full security overview: /trust is its public summary, and
 * its PDF goes out with the pilot paperwork.
 */
/**
 * The day the /docs hub's content last changed, for the sitemap's
 * `lastmod` only: the page does not print it. Whoever changes the hub's content
 * moves this to that day in the same PR; never the build's date.
 */
export const docsHubLastUpdated = "1 November 2026";

export const documents: Readonly<Record<DocumentId, PublishedDocument>> = {
  "coral-guide": {
    id: "coral-guide",
    product: "coral",
    pdf: "/docs/coral-product-guide.pdf",
    canonical: routes.coralGuide,
    released: true,
    spokenName: "the Coral product guide",
  },
  "coral-faq": {
    id: "coral-faq",
    product: "coral",
    pdf: "/docs/coral-faq.pdf",
    canonical: routes.coralFaq,
    released: true,
    spokenName: "the Coral FAQ",
  },
  "coral-one-pager": {
    id: "coral-one-pager",
    product: "coral",
    pdf: "/docs/coral-one-pager.pdf",
    canonical: routes.coral,
    released: true,
    spokenName: "the Coral one-pager",
  },
  "amoeba-guide": {
    id: "amoeba-guide",
    product: "amoeba",
    pdf: "/docs/amoeba-product-guide.pdf",
    canonical: routes.amoebaGuide,
    released: true,
    spokenName: "the Amoeba product guide",
  },
  "amoeba-one-pager": {
    id: "amoeba-one-pager",
    product: "amoeba",
    pdf: "/docs/amoeba-one-pager.pdf",
    canonical: routes.amoeba,
    released: amoebaOnePager,
    spokenName: "the Amoeba one-pager",
  },
  /* The case study's PDF, the page's own source. Offered by the
     study (its hero and its end) and by its card on /case-studies; not a tile
     on the Docs hub. */
  "coral-case-study": {
    id: "coral-case-study",
    product: "coral",
    pdf: "/docs/coral-case-study-dev-cluster.pdf",
    canonical: routes.caseStudyCoralDevCluster,
    released: true,
    spokenName: "the case study",
  },
  /* The assessment's example reports: offered by /assessment alone, under each run in What you
     get; not tiles on the Docs hub. */
  "coral-assessment-example": {
    id: "coral-assessment-example",
    product: "coral",
    pdf: "/docs/coral-assessment-example.pdf",
    canonical: routes.assessment,
    released: true,
    spokenName: "the Coral example report",
  },
  "amoeba-assessment-example": {
    id: "amoeba-assessment-example",
    product: "amoeba",
    pdf: "/docs/amoeba-assessment-example.pdf",
    canonical: routes.assessment,
    released: true,
    spokenName: "the Amoeba example report",
  },
  /* The data processing agreement, version 1.0 (23 October 2026): offered by /trust alone, in its DPA section; not a
     tile on the Docs hub. A Pilot Schedule names a version, and a named version never changes, so the version is in
     the address: a later one gets a file and an address of its own, and this one stays. */
  "coral-dpa": {
    id: "coral-dpa",
    product: "coral",
    pdf: "/docs/coral-data-processing-agreement-v1.0.pdf",
    canonical: routes.trust,
    released: true,
    spokenName: "the data processing agreement, version 1.0",
  },
};

/** The documents that ship: exactly the files under `public/docs/`. */
export const publishedDocuments: readonly PublishedDocument[] = Object.values(documents).filter(
  (document) => document.released,
);

/* ─── The tiles: the hub and the Read more row ───────────────────────────── */

/** A PDF named under a tile on the hub: "PDF", "FAQ PDF". No document yet: "PDF to come". */
export interface TilePdf {
  readonly label: string;
  readonly document?: DocumentId;
}

/**
 * One document as the site lists it: a doc tile's title and the line under it.
 * A tile with a page links to it; the one-pager has no page, so the hub draws
 * it as a head over its PDF and the Read more row as a download.
 */
export interface DocTileEntry {
  readonly title: string;
  readonly line: string;
  /** A name in the line kept out of translation ("zoorikctl"). */
  readonly named?: string | readonly string[];
  /** The web version; none for the one-pager, a PDF only. */
  readonly href?: string;
  /** The PDF row on the hub; none for a page that has no PDF (the install guides, the open-source tiles). */
  readonly pdf?: TilePdf;
  /** Listed on the hub only, not in the product page's Read more row (the install guides). */
  readonly hubOnly?: boolean;
}

/** The hub's missing-file words. */
export const pdfToCome = "PDF to come";

/**
 * Each one-pager's line on the hub, where its facts sit in the PDF row under it. Coral's has a
 * worked example; Amoeba's has none, so its line names how it works instead.
 */
const ONE_PAGER_LINE: Readonly<Record<ProductId, string>> = {
  coral: "Cost, safety, visibility and an example",
  amoeba: "Cost, safety, visibility and how it works",
};

interface ShelfEntry extends DocTileEntry {
  /** Whether the tile is listed at all: its page is published, or its PDF is. */
  readonly released: boolean;
}

/** Each product's documents, in the mocks' order: guide, FAQ, one-pager. */
const shelves: Readonly<Record<ProductId, readonly ShelfEntry[]>> = {
  coral: [
    {
      title: "Product guide",
      line: "Connect, what changes, staying in control",
      href: routes.coralGuide,
      pdf: { label: "PDF", document: "coral-guide" },
      released: true,
    },
    {
      title: "FAQ",
      line: "Sizing, safety, HPA, nodes and autoscalers",
      href: routes.coralFaq,
      pdf: { label: "FAQ PDF", document: "coral-faq" },
      released: true,
    },
    {
      title: "One-pager",
      line: ONE_PAGER_LINE.coral,
      pdf: { label: "PDF", document: "coral-one-pager" },
      released: documents["coral-one-pager"].released,
    },
    /* The two install guides: page tiles with no PDF row, on the hub only. */
    {
      title: "Install with Helm",
      line: "The coral-agent chart, for Helm, Argo CD or Flux",
      href: routes.docsInstallHelm,
      released: true,
      hubOnly: true,
    },
    {
      title: "Install with Terraform + Helm",
      line: "The cloud permissions as code, then the chart",
      href: routes.docsInstallTerraform,
      released: true,
      hubOnly: true,
    },
    /* The troubleshooting page: a page tile with no PDF row, on the hub only, after the install guides. */
    {
      title: "Troubleshooting",
      line: "When a cluster doesn’t connect or a node isn’t removed",
      href: routes.coralTroubleshooting,
      released: true,
      hubOnly: true,
    },
  ],
  amoeba: [
    {
      title: "Product guide",
      line: "Onboard, what changes, staying in control",
      href: routes.amoebaGuide,
      pdf: { label: "PDF", document: "amoeba-guide" },
      released: amoebaDocs,
    },
    /* The FAQ has no PDF yet, so the hub says "PDF to come" under it. */
    {
      title: "FAQ",
      line: "Safety, downtime, expanding, agent and costs",
      href: routes.amoebaFaq,
      pdf: { label: "FAQ PDF" },
      released: amoebaDocs,
    },
    {
      title: "One-pager",
      line: ONE_PAGER_LINE.amoeba,
      pdf: { label: "PDF", document: "amoeba-one-pager" },
      released: documents["amoeba-one-pager"].released,
    },
    /* The troubleshooting page, on the hub only, after the one-pager; held with the guide and FAQ it links to. */
    {
      title: "Troubleshooting",
      line: "When a VM is missing or its disks aren’t rightsized",
      href: routes.amoebaTroubleshooting,
      released: amoebaDocs,
      hubOnly: true,
    },
  ],
};

/** A product's listed tiles: only what is released. */
function shelf(product: ProductId): readonly DocTileEntry[] {
  return shelves[product].filter((entry) => entry.released);
}

/**
 * The products in the documents' order: Coral first, as the header's menus and
 * the hub mock list them.
 */
const DOCS_ORDER: readonly ProductId[] = ["coral", "amoeba"];

/* ─── /docs ──────────────────────────────────────────────────────────────── */

export interface DocsHubGroup {
  readonly product: ProductId;
  /** The line after the name: the product's one descriptor. */
  readonly line: string;
  /** "Product page" with an arrow, at the right of the head. */
  readonly pageLink: { readonly label: string; readonly href: string };
  readonly tiles: readonly DocTileEntry[];
}

export const docsHub = {
  /* "Product docs" in the title and the h1, where the mock says "Coral and
     Amoeba docs". */
  meta: {
    title: "Product docs",
    description:
      "Product guides, FAQs and one-pagers for Coral (AKS and EKS cost optimization) and Amoeba (Azure managed disks and Amazon EBS), online or as PDFs.",
  },
  title: "Product docs",
  deck: "Read online or download as PDF.",
  /** After the groups, one line to the articles. */
  more: {
    label: "Cloud cost optimization guides for Kubernetes and block storage",
    href: routes.learn,
  },
  /** The third group, after Amoeba: what is open source, and how to contribute. */
  openSource: {
    id: "open-source",
    title: "Open source",
    line: "What you can read, run and contribute to",
    tiles: [
      {
        title: "Projects",
        line: "zoorikctl, kubernetes-scenarios, the assessment, the Terraform modules and the Helm chart",
        named: ["zoorikctl", "kubernetes-scenarios"],
        href: routes.openSource,
      },
      {
        title: "Contributing",
        line: "Pick an issue, run a repository, open a pull request",
        href: routes.docsContributing,
      },
    ] satisfies readonly DocTileEntry[],
  },
  /** One group per product with a released document, Coral first. */
  groups: DOCS_ORDER.flatMap((product): DocsHubGroup[] => {
    const tiles = shelf(product);
    if (tiles.length === 0) return [];
    return [
      {
        product,
        line: products[product].descriptor,
        pageLink: { label: "Product page", href: routes[product] },
        tiles,
      },
    ];
  }),
} as const;

/* ─── The Read more row on /coral and /amoeba ────────────────────────────── */

export interface ReadMoreRow {
  readonly product: ProductId;
  /** The section's h2, with no period. */
  readonly title: string;
  /** "All docs" with an arrow: the product's group on the hub. */
  readonly allDocs: { readonly label: string; readonly href: string };
  /** The hub's tiles with no PDF rows; the one-pager is a download whose line is its computed facts. */
  readonly tiles: readonly DocTileEntry[];
}

/** Per product; a product with nothing released has no row (both today, for `/amoeba`). */
export const readMoreRows: Partial<Readonly<Record<ProductId, ReadMoreRow>>> = Object.fromEntries(
  docsHub.groups.map((group) => [
    group.product,
    {
      product: group.product,
      title: `${products[group.product].name} docs and guides`,
      allDocs: { label: "All docs", href: `${routes.docs}#${group.product}` },
      tiles: group.tiles.filter((tile) => !tile.hubOnly),
    },
  ]),
);

/* ─── The document pages' shared strings ─────────────────────────────────── */

/**
 * The guide's copy button, under its OS switch.
 * The visible label changes with its state; its accessible name ("Copy the
 * macOS command") does not. "Copied" is announced once in the polite live
 * region. When copying is blocked the command is selected in its well and the
 * label stays "Copy", with no announcement, as the mock draws it.
 */
export const documentCopyButton = {
  idle: "Copy",
  done: "Copied",
  doneAnnouncement: "Copied",
} as const;

/** "On this page": the contents rail's header and the folded contents' summary. */
export const contentsLabel = "On this page";
