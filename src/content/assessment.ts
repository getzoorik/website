import { openSourceLinks } from "@/config/open-source";
import { calendarUrl, contactEmail } from "@/config/site";
import type { DocumentId } from "@/content/documents";
import type { ProductId } from "@/content/products";

/**
 * `/assessment`: the hero with its one line under the h1, the product switch and the chosen product's one line to run,
 * What you get (both products' runs and their example reports), What it does, Before you run it (three questions), and
 * After the run. The layout is the mock's; the words were rewritten on 2 Nov 2026 to the site's plain style.
 *
 * The output is one PDF report. No curl line and no "one Python file" anywhere on the page.
 *
 * ─── THE PRODUCT IS THE ONE CHOICE ─────────────────────────────────────────
 * `?p=coral|amoeba` (Coral by default) sets the run line and its copy text, the two facts in What it does, the mail
 * subject and the estimate link (`assessmentProducts`). What you get and the booking line name both products whatever
 * the switch says.
 */

/**
 * The day /assessment's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /assessment's content moves this to that day in the same PR; never the build's date.
 */
export const assessmentLastUpdated = "3 November 2026";

/** One run in What you get: the terminal's lines and the example report under it. */
export interface AssessmentDemo {
  /** "✓ 3 clusters read": what the run found, after the tick. */
  readonly found: string;
  readonly saving: string;
  /** The report the run writes, and the example's file name when downloaded. */
  readonly file: string;
  readonly download: string;
  /** The example report in the documents registry (`public/docs/`), and its first page as a thumbnail. */
  readonly document: DocumentId;
  readonly thumb: string;
}

export interface AssessmentProduct {
  /** The one line to run (`npx -y zoorik assess …`), and its copy button's name. */
  readonly run: string;
  readonly copy: string;
  /** What it does: what the script reads, and what it runs only when it must. A `code` run is set as code. */
  readonly reads: string;
  readonly runs: readonly { readonly text: string; readonly code?: boolean }[];
  /** After the run: the mail subject and the estimate's section in the assessment's README. */
  readonly subject: string;
  readonly how: string;
  readonly demo: AssessmentDemo;
}

export const assessmentProducts: Readonly<Record<ProductId, AssessmentProduct>> = {
  coral: {
    run: "npx -y zoorik assess coral",
    copy: "Copy the Coral command",
    reads:
      "Nodes, pods, ReplicaSets and Jobs, 3 minutes of usage and list prices. Never Secrets or ConfigMaps.",
    runs: [
      { text: "az aks command invoke", code: true },
      { text: ", only when kubectl can’t reach an AKS cluster." },
    ],
    subject: "Coral assessment",
    how: `${openSourceLinks.assessment}#how-the-estimate-works`,
    demo: {
      found: "3 clusters read",
      saving: "$2,668 a month (example)",
      file: "zoorik-coral-assessment.pdf",
      download: "zoorik-coral-assessment-example.pdf",
      document: "coral-assessment-example",
      thumb: "/reports/coral-assessment-page-1.webp",
    },
  },
  amoeba: {
    run: "npx -y zoorik assess amoeba",
    copy: "Copy the Amoeba command",
    reads: "Your VMs, their disks, 14 days of disk activity and list prices.",
    runs: [
      { text: "A read of used space inside running Linux VMs, only after you answer " },
      { text: "y", code: true },
      { text: "." },
    ],
    subject: "Amoeba assessment",
    how: `${openSourceLinks.assessment}#how-the-estimate-works-1`,
    demo: {
      found: "8 VMs read",
      saving: "$862 a month (example)",
      file: "zoorik-amoeba-assessment.pdf",
      download: "zoorik-amoeba-assessment-example.pdf",
      document: "amoeba-assessment-example",
      thumb: "/reports/amoeba-assessment-page-1.webp",
    },
  },
};

/** A run of a line under the command: plain, code or bold. */
export interface HintRun {
  readonly text: string;
  readonly code?: boolean;
  readonly bold?: boolean;
}

/** A part of such a line: a run, or one cloud's runs under its mark (`az login` beside the Azure mark). */
export type HintPart =
  HintRun | { readonly cloud: "azure" | "aws"; readonly runs: readonly HintRun[] };

/** One question in Before you run it, and its answer: a paragraph, or a short list. */
export type AssessmentQuestion = { readonly title: string } & (
  { readonly text: string } | { readonly items: readonly string[] }
);

export const assessmentCopy = {
  /** The page's `<title>` (through the site's template) and description. */
  meta: {
    title: "Free cloud cost assessment",
    description:
      "A free, read-only assessment for AKS, EKS and block storage on Azure and AWS. One command in your terminal, one PDF with your estimated saving.",
  },
  /** The h1; the page's `<title>` is `meta.title`. */
  title: "Free cloud cost assessment",
  /** The one line under the h1, before the line to choose. The same on both products. */
  lead: "One read-only command estimates your saving at list price.",
  /** Over the switch, set like the lines under the command. */
  sub: "Choose what to assess.",
  run: {
    bar: "Cloud Shell or your terminal",
    copy: "Copy",
    copied: "Copied",
    blocked: "The line is selected; copy it with your keyboard.",
    /** Under the command, first: sign in to the cloud. Each cloud's mark stands in for its name, which screen readers
     *  still hear ("Azure: az login"). */
    signIn: [
      { text: "Sign in to your cloud first: " },
      { cloud: "azure", runs: [{ text: "az login", code: true }] },
      { text: " or " },
      { cloud: "aws", runs: [{ text: "aws sso login", code: true }] },
      { text: " in your terminal, or run it in Cloud Shell." },
    ] as readonly HintPart[],
    /** Then where Cloud Shell keeps the PDF, the menu words bold, each cloud's under its mark. */
    under: [
      { text: "In Cloud Shell, download your PDF from " },
      {
        cloud: "azure",
        runs: [
          { text: "Manage files", bold: true },
          { text: " → " },
          { text: "Download", bold: true },
        ],
      },
      { text: " or " },
      {
        cloud: "aws",
        runs: [
          { text: "Actions", bold: true },
          { text: " → " },
          { text: "Download file", bold: true },
        ],
      },
      { text: "." },
    ] as readonly HintPart[],
  },
  get: {
    title: "What you get",
    saving: "Estimated saving  ",
    report: "Report            ",
    kind: "Example report",
    download: "Download",
  },
  what: {
    title: "What it does",
    reads: "Reads",
    runs: "Runs, only when",
    sends: "Sends",
    nothing: "Nothing.",
    cards: [
      {
        title: "GitHub",
        line: "Open source · Apache-2.0",
        href: openSourceLinks.assessment,
        mark: "github",
      },
      {
        title: "PyPI",
        line: "Published as zoorik",
        href: openSourceLinks.pypiProject,
        mark: "python",
      },
    ] as const,
    trust: "Read-only",
  },
  /** After What it does: how long a run takes, the access it needs and how the saving is worked out. The same on
   *  both products. */
  before: {
    id: "before-you-run",
    title: "Before you run it",
    questions: [
      {
        title: "How long does it take?",
        text: "A Kubernetes run samples usage for 3 minutes by default, so it takes a little over 3 minutes. Private AKS clusters, and many or large clusters, take longer.",
      },
      {
        title: "What access does it need?",
        items: [
          "AKS: read access to your clusters, and the Azure Kubernetes Service Cluster User Role on each.",
          "EKS: read-only EKS, EC2 and pricing actions, and an EKS access entry.",
          "Block storage on Azure: Reader on the subscriptions, plus Run Command for the used-space read.",
          "Block storage on AWS: read-only EC2, Systems Manager, CloudWatch and pricing actions, plus Systems Manager Run Command for the used-space read.",
        ],
      },
      {
        title: "How is the saving worked out?",
        items: [
          "Kubernetes: it sets each container’s request from its peak use and counts the nodes needed. The saving is (nodes today − nodes needed) × hourly list price × 730 hours.",
          "Block storage: it sizes a pool to the used space on each VM it can read. The saving is the list price of the disks the pool replaces, less the pool’s.",
        ],
      },
    ] as readonly AssessmentQuestion[],
  },
  after: {
    title: "After the run",
    send: {
      title: "Send us your PDF",
      /** The founder's reply time. */
      reply: "A founder replies within 24 hours.",
      button: `Email ${contactEmail}`,
      email: contactEmail,
    },
    book: {
      title: "Book 30 minutes",
      /** "Walk through your report with the people who build Coral and Amoeba.": both names, whatever the switch
       *  says, in the order the closing row names them, so the line is one sentence before the page has arrived. */
      line: "Walk through your report with the people who build ",
      both: ["coral", "amoeba"] as const satisfies readonly ProductId[],
      cta: "Book a demo",
      href: calendarUrl,
    },
    how: "How the estimate works",
  },
} as const;
