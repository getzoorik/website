import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/azure-macc/1";

export const term: GlossaryTerm = {
  slug: "azure-macc",
  term: "Azure MACC (Microsoft Azure Consumption Commitment)",
  title: "What is Azure MACC?",
  meta: "Azure MACC, the Microsoft Azure Consumption Commitment, is a contract to spend a set amount on Azure. What counts toward a MACC, and the shortfall charge.",
  h1: "What is Azure MACC?",
  card: "Azure MACC, the Microsoft Azure Consumption Commitment, is a contract to spend a set amount on Azure over a set period.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "Azure MACC, the Microsoft Azure Consumption Commitment, is a contract to spend a set amount on Azure over a set period. It sits under a Microsoft Customer Agreement or an Enterprise Agreement, and eligible charges on each invoice reduce what’s left.",
    },
  ],
  sections: [
    {
      id: "an-example-from-microsoft",
      title: "Microsoft’s example",
      blocks: [
        {
          kind: "p",
          text: "Contoso makes a $50,000 MACC in May. In June, it buys a $10,000 Azure prepayment, money paid ahead for Azure use. The purchase counts, so $40,000 is left.",
        },
        {
          kind: "p",
          text: "The Azure services the prepayment then pays for don’t count again. Once the prepayment is used up, eligible use counts toward the MACC.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "what-counts-toward-it",
      title: "What counts",
      blocks: [
        {
          kind: "ul",
          items: [
            "Eligible Azure services count.",
            "Microsoft Marketplace offers with the “Azure benefit eligible” badge count at 100% of the pretax price. Buy them in the Azure portal, not by credit card.",
            "Use paid for by Azure credits, a prepayment or a shortfall credit doesn’t count.",
            "A Marketplace license used even partly outside Azure doesn’t count.",
          ],
        },
      ],
    },
    {
      id: "the-macc-shortfall-charge",
      title: "Shortfall charge",
      blocks: [
        {
          kind: "ul",
          items: [
            "Miss the total by the end date, and you pay the remaining balance as a shortfall charge. It comes as an Azure prepayment credit.",
            "Some MACCs also have milestones, set amounts due by set dates. Missing one brings a shortfall charge too.",
            "Until a MACC or a milestone is met, the account admins get emails 90, 60 and 30 days before its end date.",
          ],
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Why it matters for cost",
      blocks: [
        {
          kind: "p",
          text: "A saving that takes your Azure use below the commitment may not reduce what you pay, because the shortfall charge makes up the difference.",
        },
        {
          kind: "p",
          text: [
            { a: "Reduce cloud costs", href: "/cloud-cost-optimization" },
            " before you sign a new MACC, so it matches real use. The ",
            { a: "free assessment", href: "/assessment" },
            " estimates what your clusters and disks could save.",
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
      title: "AWS EDP",
      line: "A discount for a commitment to AWS.",
      href: "/learn/glossary/aws-edp",
    },
    {
      title: "FinOps",
      line: "The practice of managing cloud cost and commitments.",
      href: "/learn/glossary/finops",
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
