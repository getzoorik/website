import { openSourceLinks } from "@/config/open-source";
import { calendarUrl, contactEmail } from "@/config/site";
import type { DocumentId } from "@/content/documents";
import type { ProductId } from "@/content/products";

/**
 * `/assessment`: the hero with its one line under the h1 and the one command to copy, What you get (one run and the
 * example report), What it does, Before you run it (three questions), and After the run.
 *
 * One command, `npx zoorik assess`, reads Kubernetes and disks alike and writes one PDF report, so the page has no
 * product to choose. An older link's `?p=` or `?c=` leaves the address when the page arrives.
 */

/**
 * The day /assessment's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /assessment's content moves this to that day in the same PR; never the build's date.
 */
export const assessmentLastUpdated = "27 November 2026";

/** A run of text in an answer or a fact: plain, or set as code. */
export interface TextRun {
  readonly text: string;
  readonly code?: boolean;
}

/** One question in Before you run it, and its answer: paragraphs, or a short list; a paragraph answer may end on a
 *  link of its own line. */
export type AssessmentQuestion = { readonly title: string } & (
  | {
      readonly paragraphs: readonly string[];
      readonly link?: { readonly text: string; readonly href: string };
    }
  | { readonly items: readonly string[] }
);

export const assessmentCopy = {
  /** The page's `<title>` (through the site's template) and description. */
  meta: {
    title: "Cloud cost assessment",
    description:
      "A free, read-only assessment for AKS, EKS and block storage on Azure and AWS. One command in your terminal, one PDF with your estimated saving.",
  },
  /** The h1; the page's `<title>` is `meta.title`. */
  title: "Cloud cost assessment",
  /** The one line under the h1. */
  lead: "One command reads your Kubernetes clusters and VM disks, and writes one PDF of everything you could save.",
  /** The one command, its Copy button, and what the live region says. */
  run: {
    command: "npx zoorik assess",
    label: "Copy the command",
    copy: "Copy",
    copied: "Copied",
    blocked: "The line is selected; copy it with your keyboard.",
  },
  get: {
    title: "What you get",
    /** The example run's output, after its typed command: the keys padded as a terminal aligns them. */
    found: "3 clusters and 10 VMs read",
    lines: [
      { key: "Cost today   ", value: "$8,396 a month (example)", tone: "f" },
      { key: "Saving       ", value: "$3,530 a month (42%, example)", tone: "v" },
      { key: "Report       ", value: "zoorik-assessment-20261126-0930.pdf", tone: "f" },
    ] as const,
    /** The example report under the run (`public/docs/`); its pages and size are read from the file at build. */
    document: "assessment-example" satisfies DocumentId,
    kind: "Example report",
    download: "Download",
    downloadAs: "zoorik-assessment-example.pdf",
  },
  what: {
    title: "What it does",
    reads: {
      title: "Reads",
      text: "Your clusters’ nodes, pods, ReplicaSets, Jobs, volumes and their claims, CSI nodes, limit ranges, autoscalers and disruption budgets, pod usage, your VMs and their disks, 14 days of disk activity, and list and spot prices. Never Secrets or ConfigMaps.",
    },
    runs: {
      title: "Runs",
      text: [
        { text: "az aks command invoke", code: true },
        {
          text: ", only for a private AKS cluster or one limited to authorized IP ranges. A read of used space inside running Linux VMs, only after you answer ",
        },
        { text: "y", code: true },
        { text: "." },
      ] as readonly TextRun[],
    },
    sends: { title: "Sends", nothing: "Nothing." },
    /** Under "Nothing.": the code itself. */
    code: {
      title: "GitHub",
      line: "Open source",
      license: "Apache-2.0",
      href: openSourceLinks.assessment,
    },
  },
  /** After What it does: how long a run takes, the access it needs and how the saving is worked out. */
  before: {
    id: "before-you-run",
    title: "Before you run it",
    questions: [
      {
        title: "How long does it take?",
        paragraphs: [
          "A little over 5 minutes: it samples usage for 5 minutes. Private AKS clusters, many or large clusters, and many VMs take longer.",
        ],
      },
      {
        title: "What access does it need?",
        items: [
          "AKS: read access to your clusters and the Azure Kubernetes Service Cluster User Role on each, plus Run Command for a private or IP-limited cluster.",
          "EKS: read-only EKS, EC2 and pricing actions, and an EKS access entry.",
          "Disks on Azure: Reader on the subscriptions, plus Run Command for the used-space read.",
          "Disks on AWS: read-only EC2, CloudWatch and pricing actions, plus Systems Manager Run Command for the used-space read.",
        ],
      },
      {
        title: "How is the saving worked out?",
        paragraphs: [
          "Each Kubernetes step works on what the step before left: smaller pods, spare machines, cheaper machine types, packing across pools, fewer copies at quiet times, and spot. Disks are counted on their own, all at public list prices.",
        ],
        link: {
          text: "How the estimate works",
          href: `${openSourceLinks.assessment}#how-the-estimate-works`,
        },
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
      subject: "Cloud cost assessment",
    },
    book: {
      title: "Book 30 minutes",
      /** "Walk through your report with the people who build Coral and Amoeba.": both names, in the order the
       *  closing row names them. */
      line: "Walk through your report with the people who build ",
      both: ["coral", "amoeba"] as const satisfies readonly ProductId[],
      cta: "Book a demo",
      href: calendarUrl,
    },
  },
} as const;
