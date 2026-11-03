import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/finops-maturity-model/1";

export const term: GlossaryTerm = {
  slug: "finops-maturity-model",
  term: "FinOps maturity model (crawl, walk, run)",
  title: "What is the FinOps maturity model?",
  meta: "The FinOps maturity model rates each FinOps capability as crawl, walk or run. What each stage means, how to assess maturity, and why run isn’t required.",
  h1: "What is the FinOps maturity model?",
  card: "The FinOps maturity model rates your team’s progress in each FinOps capability as crawl, walk or run.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: [
        "The FinOps maturity model rates your team’s progress in each ",
        { a: "FinOps", href: "/learn/glossary/finops" },
        " capability as crawl, walk or run. A capability is one area of FinOps work, such as budgeting or forecasting. The model is part of the FinOps Foundation’s FinOps Framework.",
      ],
    },
  ],
  sections: [
    {
      id: "finops-maturity-stages-crawl-walk-run",
      title: "Crawl, walk, run",
      blocks: [
        { kind: "p", text: "Microsoft’s FinOps training describes each stage:" },
        {
          kind: "ul",
          items: [
            "Crawl: little reporting or tooling. Basic processes exist, but not all major teams follow them.",
            "Walk: the organization understands and follows the process. Automation or processes cover most needs.",
            "Run: all teams follow it, and hard edge cases are handled. Automation is preferred.",
          ],
        },
        { kind: "svg", figure: figure1 },
        {
          kind: "p",
          text: "FinOps doesn’t require every organization to reach run. The right stage depends on its goals and the value it wants.",
        },
      ],
    },
    {
      id: "an-example-a-first-round",
      title: "How to assess it",
      blocks: [
        {
          kind: "ol",
          items: [
            "Pick the capabilities that matter most. For a first round, Microsoft suggests three to five.",
            "Rate each one on its own, so a team can be at walk in one and crawl in another.",
            "Plan the steps that move each one up.",
            "Rate again every 3 to 6\u00a0months.",
          ],
        },
        {
          kind: "p",
          text: "Say you rate reporting at walk and budgeting at crawl. You plan steps to move budgeting up, then rate both again a few months later.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "At crawl, some major teams skip the process, so their cloud cost gets fewer checks.",
            "A stage alone doesn’t reduce your cloud cost. Changing what you use, or the rate you pay, does.",
            [
              "Our ",
              { a: "library of FinOps tools", href: "/cloud-cost-optimization-library" },
              " says what each one does.",
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
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
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
