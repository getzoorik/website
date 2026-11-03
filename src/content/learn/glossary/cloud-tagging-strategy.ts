import type { GlossaryTerm } from "@/content/learn/glossary-term";
import { figure as figure1 } from "@/features/learn/figures/glossary/cloud-tagging-strategy/1";

export const term: GlossaryTerm = {
  slug: "cloud-tagging-strategy",
  term: "Cloud tagging strategy",
  title: "Cloud tagging strategy",
  meta: "A cloud tagging strategy sets which tags every cloud resource carries and how you enforce them. Example tags, limits and tag policies on AWS and Azure.",
  h1: "Cloud tagging strategy",
  card: "A cloud tagging strategy is your set of rules for the tags on cloud resources.",
  group: "finops-pricing",
  product: "both",
  published: "2026-10-26",
  updated: "2026-11-03",
  definition: [
    {
      kind: "p",
      text: "A cloud tagging strategy is your set of rules for the tags on cloud resources. It says which tag keys every resource must carry, which values each key allows, and how you enforce them.",
    },
    { kind: "svg", figure: figure1 },
  ],
  sections: [
    {
      id: "what-is-cloud-tagging",
      title: "What is cloud tagging?",
      blocks: [
        {
          kind: "p",
          text: [
            "Cloud tagging is adding labels, called tags or resource tags, to your cloud resources. Each tag is a key and a value, such as ",
            { code: "Environment: Production" },
            ".",
          ],
        },
        {
          kind: "p",
          text: [
            "On AWS, each resource can carry up to 50 tags you create. Tags that AWS creates start with ",
            { code: "aws:" },
            " and don’t count. Keys and values are case sensitive.",
          ],
        },
        {
          kind: "p",
          text: "Azure tags go on resources, resource groups and subscriptions, up to 50 on each. Tag names aren’t case sensitive, but values are. Resources don’t inherit tags from their resource group or subscription unless a policy adds them.",
        },
      ],
    },
    {
      id: "an-example-tag-set",
      title: "Example tag set",
      blocks: [
        {
          kind: "p",
          text: "Microsoft sorts tags into five types: functional, classification, accounting, purpose and ownership. A small strategy might require three keys, here with Microsoft’s examples:",
        },
        {
          kind: "ul",
          items: [
            [{ code: "costcenter: 55332" }, " (accounting): who pays."],
            [{ code: "businessunit: finance" }, " (ownership): who owns it."],
            [{ code: "env: prod" }, " (functional): which environment."],
          ],
        },
        { kind: "p", text: "Two rules hold on both clouds:" },
        {
          kind: "ul",
          items: [
            [
              "Keep one case for keys and values. On Azure, ",
              { code: "Production" },
              " and ",
              { code: "production" },
              " are two values, and cost reports show them apart.",
            ],
            "Keep passwords, personal data and other sensitive values out of tags. Tags are plain text, and cost reports show them.",
          ],
        },
      ],
    },
    {
      id: "tag-policy-on-aws-and-azure",
      title: "Tag policies",
      blocks: [
        { kind: "h3", id: "aws-tag-policies", title: "AWS tag policies" },
        {
          kind: "p",
          text: "AWS Organizations tag policies set a key’s exact case and its allowed values. With enforcement on, a request that breaks them fails.",
        },
        {
          kind: "p",
          text: "Tag policies don’t stop a resource created with no tags. To require tags, AWS points to service control policies (SCPs). It also points to “required tag key” rules in infrastructure as code (IaC) tools such as AWS CloudFormation.",
        },
        {
          kind: "p",
          text: [
            "AWS’s tag best practices suggest lowercase keys, hyphens between words and a company prefix, as in ",
            { code: "anycompany:cost-center" },
            ".",
          ],
        },
        {
          kind: "h3",
          id: "azure-tagging-with-azure-policy",
          title: "Azure Policy",
        },
        {
          kind: "p",
          text: "Azure Policy’s built-in “Require a tag on resources” definition blocks a deployment that lacks the tag. Other definitions, such as “Inherit a tag from the resource group if missing”, add the tag instead. A remediation task can tag resources that already exist.",
        },
      ],
    },
    {
      id: "why-it-matters-for-your-cloud-cost",
      title: "Tags and cloud cost",
      blocks: [
        {
          kind: "ul",
          items: [
            "Tags let you assign cloud cost to an owner. Cost on an untagged resource is a gap to fix.",
            [
              "Tagged cost feeds ",
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
            "Tag inheritance in Microsoft Cost Management copies subscription and resource group tags onto cost data. It doesn’t change the tags on your resources.",
            [
              "Tags show where cost goes. They don’t ",
              { a: "reduce your cloud cost", href: "/cloud-cost-optimization" },
              " by themselves.",
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
  relatedTitle: "Related terms",
  next: {
    title: "Cloud cost optimization",
    href: "/cloud-cost-optimization",
  },
  sources: [
    {
      publisher: "Microsoft Learn",
      title: "“Define your tagging strategy”",
      url: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging",
    },
    {
      publisher: "Microsoft Learn",
      title: "“Use tags to organize your Azure resources and management hierarchy”",
      url: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources",
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
      publisher: "Microsoft Learn",
      title: "“Group and allocate costs using tag inheritance”",
      url: "https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance",
    },
    {
      publisher: "AWS",
      title: "“Best practices and strategies”",
      url: "https://docs.aws.amazon.com/tag-editor/latest/userguide/best-practices-and-strats.html",
      note: " (Tagging AWS resources)",
    },
    {
      publisher: "AWS",
      title: "“Enforce tagging consistency”",
      url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_tag-policies-enforcement.html",
      note: " (AWS Organizations)",
    },
  ],
};
