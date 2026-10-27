import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-tagging-strategy/1";

export const term: GlossaryTerm = {
  slug: "cloud-tagging-strategy",
  term: "Cloud tagging strategy",
  title: "What is a cloud tagging strategy?",
  meta: "A cloud tagging strategy sets the tags your resources must carry and how you enforce them. See an example tag set, plus tag policy on AWS and Azure.",
  h1: "What is a cloud tagging strategy?",
  card: "A cloud tagging strategy is your set of rules for the labels on cloud resources.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-10-26",
  definition: [
    {
      kind: "p",
      text: "A cloud tagging strategy is your set of rules for the labels on cloud resources. It says which tag keys your resources must carry, which values they allow, and how you enforce them.",
    },
    { kind: "svg", figure: figure1 },
    {
      kind: "p",
      text: [
        "Cloud tagging, or tagging in cloud computing, is adding the labels. Each tag is a key and a value, such as ",
        { code: "Environment: Production" },
        ".",
      ],
    },
  ],
  sections: [
    {
      id: "an-example-tag-set",
      title: "An example tag set",
      blocks: [
        {
          kind: "p",
          text: "Microsoft sorts Azure tags into five types. A small strategy might require three, here with Microsoft’s examples:",
        },
        {
          kind: "ul",
          items: [
            [{ code: "costcenter: 55332" }, " (accounting): who pays."],
            [{ code: "businessunit: finance" }, " (ownership): who owns it."],
            [{ code: "env: prod" }, " (functional): which environment."],
          ],
        },
        {
          kind: "p",
          text: [
            "Keep the case of values consistent. On Azure, ",
            { code: "Production" },
            " and ",
            { code: "production" },
            " show as two lines in cost reports.",
          ],
        },
      ],
    },
    {
      id: "tag-policy-on-aws-and-azure",
      title: "Tag policy on AWS and Azure",
      blocks: [
        {
          kind: "ul",
          items: [
            "In an AWS tagging strategy, AWS Organizations tag policies set a key’s case and allowed values. With enforcement on, a tagging request that breaks them fails. Missing tags need a “required tag key” rule, checked in infrastructure as code (IaC) tools such as AWS CloudFormation.",
            "In an Azure tagging strategy, Azure Policy’s built-in “Require a tag on resources” definition blocks deploying a resource without the tag. Other definitions add a missing tag, and a remediation task can tag existing resources.",
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
            "A FinOps tagging strategy lets you assign spend to an owner. Untagged spend is a gap to fix.",
            [
              "Tagged spend feeds ",
              { a: "showback", href: "/learn/glossary/showback" },
              " and ",
              { a: "chargeback", href: "/learn/glossary/cloud-chargeback" },
              ".",
            ],
            [
              "Microsoft suggests tracking ",
              { a: "tag compliance", href: "/learn/glossary/cloud-cost-governance" },
              " as a key performance indicator (KPI).",
            ],
            [
              "Tags don’t ",
              { a: "reduce your cloud cost", href: "/learn/how-to-reduce-cloud-costs" },
              " by themselves.",
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
      title: "Cost allocation tags",
      line: "Tags that group your cloud cost.",
      href: "/learn/glossary/cost-allocation-tags",
    },
    { title: "Showback", line: "Reports each team’s costs.", href: "/learn/glossary/showback" },
    {
      title: "Cloud chargeback",
      line: "Charges each team’s budget.",
      href: "/learn/glossary/cloud-chargeback",
    },
    {
      title: "Kubernetes cost allocation",
      line: "Splits a shared cluster’s cost.",
      href: "/learn/glossary/kubernetes-cost-allocation",
    },
  ],
  next: { title: "How to reduce cloud costs", href: "/learn/how-to-reduce-cloud-costs" },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Define your tagging strategy”",
      url: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Policy definitions for tagging resources”",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Allocation”",
      url: "https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/allocation",
      note: " (FinOps Framework)",
    },
    {
      publisher: "AWS",
      title: "“Enforce tagging consistency”",
      url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_tag-policies-enforcement.html",
      note: " (AWS Organizations)",
    },
  ],
};
