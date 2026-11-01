import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-macc/1";

export const term: GlossaryTerm = {
  slug: "azure-macc",
  term: "Azure MACC (Microsoft Azure Consumption Commitment)",
  title: "What is Azure MACC?",
  meta: "Azure MACC is a contract to spend a set amount on Azure over a set period. See what counts toward it, and what you pay if you miss it by the end date.",
  h1: "What is Azure MACC?",
  card: "Azure MACC, the Microsoft Azure Consumption Commitment, is a contract to spend a set amount on Azure over a set period.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-01",
  definition: [
    {
      kind: "p",
      text: "Azure MACC, the Microsoft Azure Consumption Commitment, is a contract to spend a set amount on Azure over a set period. An Azure MACC agreement is part of a Microsoft Customer Agreement or Enterprise Agreement. Eligible spend on each invoice reduces the balance.",
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
      title: "What counts toward it",
      blocks: [
        { kind: "p", text: "Only Azure MACC-eligible spend counts." },
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
      title: "Why it matters for your cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Miss the total by the end date, and you pay the remaining balance as a shortfall charge. It comes as an Azure prepayment credit.",
            "So a saving that takes spend below the commitment may not reduce the invoice.",
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
      line: "A commitment to an hourly compute spend.",
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
