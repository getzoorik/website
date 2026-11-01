import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops-maturity-model/1";

export const term: GlossaryTerm = {
  slug: "finops-maturity-model",
  term: "FinOps maturity model (crawl, walk, run)",
  title: "What is the FinOps maturity model?",
  meta: "The FinOps maturity model rates each FinOps capability crawl, walk or run. See what each stage looks like, how to rate your team, and why run isn’t required.",
  h1: "What is the FinOps maturity model?",
  card: "The FinOps maturity model rates your team’s progress in each FinOps capability.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: [
        "The FinOps maturity model rates your team’s progress in each ",
        { a: "FinOps", href: "/learn/glossary/finops" },
        " capability. A capability is one area of FinOps work, such as budgeting or forecasting. Crawl, walk and run are its three stages.",
      ],
    },
  ],
  sections: [
    {
      id: "finops-maturity-stages-crawl-walk-run",
      title: "FinOps maturity stages: crawl, walk, run",
      blocks: [
        {
          kind: "p",
          text: "This is the FinOps Foundation maturity model, from its FinOps Framework. Microsoft describes each stage:",
        },
        {
          kind: "ul",
          items: [
            "At crawl, there’s little reporting or tooling. Basic processes exist, but not all major teams follow them.",
            "At walk, the organization follows the process. Automation or processes cover most needs.",
            "At run, all teams follow it, and hard cases are handled. Automation is preferred.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "FinOps doesn’t require every organization to reach run. The right stage depends on your goals and the value you want.",
        },
      ],
    },
    {
      id: "an-example-a-first-round",
      title: "How to assess FinOps maturity: a first round",
      blocks: [
        {
          kind: "p",
          text: "Microsoft advises rating each capability on its own, so your FinOps maturity levels can differ. For a first round, it suggests three to five capabilities.",
        },
        {
          kind: "p",
          text: "Say your picks include reporting and budgeting. You rate reporting at walk and budgeting at crawl. You plan steps to move budgeting up, then rate again in 3 to 6\u00a0months.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why the FinOps maturity model matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At crawl, some major teams skip the process, so their spend gets fewer checks.",
            [
              "A stage alone doesn’t ",
              { a: "reduce your cloud cost", href: "/cloud-cost-optimization" },
              ". Changing what you use, or the rate you pay, does.",
            ],
            [
              "Our library lists ",
              { a: "FinOps tools", href: "/cloud-cost-optimization-library" },
              " and other cloud cost optimization tools, with what each one does.",
            ],
            [
              "The ",
              { a: "free assessment", href: "/assessment" },
              " works out what your clusters and disks could save.",
            ],
          ],
        },
      ],
    },
  ],
  related: [
    { title: "FinOps", line: "The practice the model rates.", href: "/learn/glossary/finops" },
    {
      title: "FinOps personas",
      line: "The roles involved.",
      href: "/learn/glossary/finops-personas",
    },
    {
      title: "Cloud cost governance",
      line: "The policy and governance capability.",
      href: "/learn/glossary/cloud-cost-governance",
    },
    {
      title: "Cloud cost anomaly detection",
      line: "Anomaly management, a suggested starting capability.",
      href: "/learn/glossary/cloud-cost-anomaly-detection",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“FinOps Framework overview”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework",
    },
    {
      publisher: "Microsoft Learn",
      title: "“FinOps Maturity Model”",
      url: "https://learn.microsoft.com/en-us/training/modules/get-started-with-finops/6-finops-maturity-model",
      note: " (Get started with FinOps)",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Tutorial: Conduct a FinOps iteration”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/conduct-iteration",
    },
  ],
};
