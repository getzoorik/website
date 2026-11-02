import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-macc/1";

export const term: GlossaryTerm = {
  slug: "azure-macc",
  term: "Azure MACC (Microsoft Azure Consumption Commitment)",
  title: "Microsoft MACC: what is an Azure MACC agreement?",
  meta: "Azure MACC, the Microsoft Azure Consumption Commitment, commits you to a set amount of Azure consumption. What counts, and the MACC shortfall if you miss it.",
  h1: "Microsoft MACC: what is an Azure MACC agreement?",
  card: "Azure MACC, the Microsoft Azure Consumption Commitment, commits your organization to a set amount of Azure consumption over a set period.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-02",
  definition: [
    {
      kind: "p",
      text: "Azure MACC, the Microsoft Azure Consumption Commitment, commits your organization to a set amount of Azure consumption over a set period. An Azure MACC agreement is part of a Microsoft Customer Agreement or Enterprise Agreement. Eligible charges on each invoice reduce the balance.",
    },
  ],
  sections: [
    {
      id: "an-example-from-microsoft",
      title: "An example from Microsoft",
      blocks: [
        {
          kind: "p",
          text: "Contoso makes a $50,000 MACC in May. In June, it buys a $10,000 Azure prepayment, money paid ahead for Azure use. That purchase counts, so $40,000 is left.",
        },
        { kind: "p", text: "Azure services the prepayment then pays for don’t count again." },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-counts-toward-it",
      title: "What counts toward Azure MACC: eligible services and Marketplace offers",
      blocks: [
        {
          kind: "ul",
          items: [
            "Eligible Azure services count.",
            "Microsoft Marketplace offers with the “Azure benefit eligible” badge count at 100% of the pretax price. Buy them in the Azure portal, not by credit card.",
            "Use paid for by Azure credits or a prepayment doesn’t count.",
            "A Marketplace license used even partly outside Azure doesn’t count.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why Azure MACC matters for your cloud cost",
      blocks: [
        { kind: "h3", id: "the-macc-shortfall-charge", title: "The MACC shortfall charge" },
        {
          kind: "ul",
          items: [
            "Miss the total by the end date, and you pay the remaining balance as a shortfall charge. It comes as an Azure prepayment credit.",
            "So a saving that takes your Azure consumption below the commitment may not reduce the invoice.",
            "Some MACCs also have milestones, set amounts due by set dates. Missing one brings a shortfall charge too.",
            "While a MACC isn’t met, the account admins get emails 90, 60 and 30\u00a0days before it expires.",
            [
              { a: "Reduce cloud costs", href: "/cloud-cost-optimization" },
              " before you sign a new MACC, so it matches real use.",
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
    {
      title: "Savings plan",
      line: "A commitment to pay a set amount per hour for compute.",
      href: "/learn/glossary/savings-plan",
    },
    {
      title: "Reserved instance",
      line: "A commitment to one virtual machine setup.",
      href: "/learn/glossary/reserved-instance",
    },
    {
      title: "FinOps",
      line: "The practice of managing cloud cost and commitments.",
      href: "/learn/glossary/finops",
    },
  ],
  next: {
    title: "Cloud cost optimization: how to reduce cloud costs",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Track your Microsoft Azure Consumption Commitment (MACC)”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/benefits/macc/track-consumption-commitment",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Azure Consumption Commitment benefit”",
      url: "https://learn.microsoft.com/en-us/marketplace/azure-consumption-commitment-benefit",
    },
  ],
};
