import type { Article } from "@/content/learn/article";
import { figure as figure1 } from "@/features/learn/figures/aws-nat-gateway-pricing/1";
import { figure as figure2 } from "@/features/learn/figures/aws-nat-gateway-pricing/2";

export const article: Article = {
  slug: "aws-nat-gateway-pricing",
  title: "AWS NAT gateway pricing and how to reduce it",
  meta: "AWS NAT gateway pricing: a charge per hour plus one per GB processed. The rates, a worked month, zonal vs regional gateways, and how to reduce the cost.",
  h1: "AWS NAT gateway pricing",
  deck: "A NAT gateway charges by the hour even with no traffic, and per GB on top of data transfer.",
  card: "What an AWS NAT gateway costs per hour and per GB processed, a worked month, and how to reduce it.",
  product: "coral",
  hub: "Cloud cost",
  topic: "Cloud cost",
  published: "2026-11-02",
  updated: "2026-11-03",
  author: "zoorik",
  cover: "/learn-covers/zoorik-learn-aws-nat-gateway-pricing-1200x630.webp",
  coverAlt:
    "AWS NAT gateway pricing: a private subnet’s traffic passes a NAT gateway that meters hours provisioned and GB processed",
  short:
    "AWS NAT gateway pricing has two parts: a charge for each hour a NAT gateway runs, and one for each GB it processes. AWS’s US East (Ohio) rates, in November 2026, are $0.045 per NAT gateway-hour and $0.045 per GB processed. Data transfer is extra. Gateway endpoints and deleting unused gateways reduce the cost.",
  sections: [
    {
      id: "what-an-aws-nat-gateway-costs",
      title: "Hourly and per-GB charges",
      blocks: [
        {
          kind: "p",
          text: "A network address translation (NAT) gateway lets instances in a private subnet reach the internet and AWS services. A private subnet is one whose route table has no route to an internet gateway.",
        },
        { kind: "p", text: "AWS charges for a NAT gateway in three ways:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Hours." },
              " Each hour the gateway is provisioned and available. A partial hour counts as a full hour.",
            ],
            [
              { b: "Data processed." },
              " Each GB through the gateway, whatever the traffic’s source or destination.",
            ],
            [
              { b: "Data transfer." },
              " Standard AWS data transfer charges on that data, such as the ",
              { a: "egress cost", href: "/learn/glossary/egress-cost" },
              " of data going out to the internet.",
            ],
          ],
        },
        {
          kind: "p",
          text: "A public NAT gateway also uses an Elastic IP address. AWS charges $0.005 an hour for every public IPv4 address, in use or idle: $3.65 over a 730-hour month.",
        },
        {
          kind: "callout",
          label: "Worked example",
          text: "One public NAT gateway at the Ohio rates processes 1,000 GB in a 730-hour month. It pays 730 × $0.045 = $32.85 for the hours, 1,000 × $0.045 = $45 for processing and $3.65 for the IPv4 address. That’s $81.50 before data transfer. Rates vary by Region and change.",
        },
        { kind: "svg", figure: figure1 },
      ],
    },
    {
      id: "zonal-vs-regional-nat-gateways-one-hourly",
      title: "Zonal vs regional gateways",
      blocks: [
        {
          kind: "p",
          text: "A standard NAT gateway is zonal: it works in one Availability Zone. For high availability, you create one in each zone and route each zone’s private subnets to it.",
        },
        {
          kind: "p",
          text: "Three zones then pay three hourly charges: 3 × 730 × $0.045 = $98.55 a month at the Ohio rate, before any data is processed.",
        },
        {
          kind: "p",
          text: "A regional NAT gateway is one gateway across zones. In automatic mode, which AWS recommends, it expands to each zone where your workloads have network interfaces. AWS charges for it by the hour in each zone, so three zones cost $0.135 an hour, as three zonal gateways do.",
        },
        {
          kind: "callout",
          label: "Watch out",
          text: "A regional gateway can take up to 60 minutes to expand to a new zone. Until then, it processes that zone’s traffic in one of its existing zones. It doesn’t support private NAT, for which AWS says to use zonal gateways.",
        },
        { kind: "svg", figure: figure2 },
      ],
    },
    {
      id: "why-nat-gateway-cost-grows-in-an",
      title: "NAT gateway cost in EKS",
      blocks: [
        {
          kind: "p",
          text: [
            "AWS recommends private subnets for the nodes of an ",
            { a: "Amazon Elastic Kubernetes Service (EKS)", href: "/learn/glossary/eks" },
            " cluster. Those nodes and their pods reach the internet through a NAT device. They reach AWS services through it too, or through virtual private cloud (VPC) endpoints.",
          ],
        },
        {
          kind: "p",
          text: "Without VPC endpoints, traffic to AWS services also crosses the NAT gateway, and each GB pays the processing charge. AWS names these services as examples:",
        },
        {
          kind: "ul",
          items: [
            "Amazon Elastic Container Registry (Amazon ECR)",
            "Elastic Load Balancing",
            "Amazon CloudWatch",
            "AWS Security Token Service (AWS STS)",
            "Amazon Simple Storage Service (Amazon S3)",
          ],
        },
        {
          kind: "p",
          text: "In AWS’s own pricing example, an instance sends 1 GB to Amazon S3 in the same Region. The NAT gateway charges $0.045 to process it, and the data transfer itself has no charge.",
        },
      ],
    },
    {
      id: "how-to-reduce-nat-gateway-charges",
      title: "Reduce NAT gateway cost",
      blocks: [
        {
          kind: "h3",
          id: "send-amazon-s3-and-dynamodb-traffic-through",
          title: "Use gateway endpoints",
        },
        {
          kind: "p",
          text: "A gateway endpoint reaches Amazon S3 or Amazon DynamoDB without a NAT device, with no hourly or data processing charge. When you create one, AWS adds a route to each route table you pick.",
        },
        {
          kind: "p",
          text: "It covers only its own Region, because its route uses that Region’s prefix list for the service. Traffic to S3 in another Region doesn’t use it.",
        },
        {
          kind: "h3",
          id: "weigh-interface-endpoints-for-other-aws-services",
          title: "Weigh interface endpoints",
        },
        {
          kind: "p",
          text: "If most NAT traffic goes to services such as Amazon ECR or CloudWatch, AWS suggests interface endpoints. They’re priced under AWS PrivateLink, so compare that price with the processing charge first.",
        },
        {
          kind: "h3",
          id: "keep-heavy-traffic-in-the-nat-gateways",
          title: "Avoid cross-zone traffic",
        },
        {
          kind: "p",
          text: "Data between an instance and a NAT gateway in another zone pays data transfer charges. For heavy traffic across zones, AWS suggests moving the resources into the NAT gateway’s zone. The other choice is a NAT gateway in each zone with resources, which adds an hourly charge per zone.",
        },
        {
          kind: "h3",
          id: "delete-nat-gateways-nothing-routes-to",
          title: "Delete unused gateways",
        },
        {
          kind: "p",
          text: "First check which route tables send traffic to the gateway. Their subnets lose that way out, and the routes stay in a blackhole status until you update or delete them.",
        },
        {
          kind: "p",
          text: "Deleting a gateway doesn’t release its Elastic IP address. Release it too if nothing else needs it, or it keeps its $0.005 hourly charge as an idle public IPv4 address.",
        },
      ],
    },
    {
      id: "azure-nat-gateway-pricing",
      title: "Azure NAT Gateway pricing",
      blocks: [
        {
          kind: "p",
          text: "Azure NAT Gateway gives the resources in a subnet outbound internet access, and doesn’t permit unsolicited inbound connections. Since 31 March 2026, new virtual networks default to private subnets without default outbound access. They need an explicit way out, such as a NAT gateway.",
        },
        { kind: "p", text: "Azure charges for it in two ways, as AWS does:" },
        {
          kind: "ul",
          items: [
            [
              { b: "Resource hours." },
              " From the moment the gateway is created, with or without subnets or public IP addresses attached. A partial hour counts as a full hour.",
            ],
            [{ b: "Data processed." }, " Each GB, outbound and return traffic alike."],
          ],
        },
        {
          kind: "p",
          text: "Standard NAT gateways are zonal and StandardV2 ones are zone redundant, at the same price. Bandwidth charges for data leaving Azure apply on top. Azure lists its rates by region.",
        },
      ],
    },
  ],
  sources: [
    {
      publisher: "AWS",
      title: "“Amazon VPC Pricing”",
      url: "https://aws.amazon.com/vpc/pricing/",
    },
    {
      publisher: "AWS",
      title: "“Work with NAT gateways”",
      url: "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-working-with.html",
      note: " (Amazon VPC User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Regional NAT gateways for automatic multi-AZ expansion”",
      url: "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html",
      note: " (Amazon VPC User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Pricing for NAT gateways”",
      url: "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
      note: " (Amazon VPC User Guide)",
    },
    {
      publisher: "AWS",
      title: "“Gateway endpoints”",
      url: "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
    },
    {
      publisher: "AWS",
      title: "“View Amazon EKS networking requirements for VPC and subnets”",
      url: "https://docs.aws.amazon.com/eks/latest/userguide/network-reqs.html",
    },
    {
      publisher: "Microsoft Learn",
      title: "“What is Azure NAT Gateway?”",
      url: "https://learn.microsoft.com/en-us/azure/nat-gateway/nat-overview",
    },
    {
      publisher: "Microsoft Azure",
      title: "“Azure NAT Gateway pricing”",
      url: "https://azure.microsoft.com/en-us/pricing/details/azure-nat-gateway/",
    },
  ],
  related: [
    {
      title: "Egress vs ingress: meaning and cost",
      where: "Glossary",
      href: "/learn/glossary/egress-cost",
    },
    {
      title: "AWS cost optimization: data transfer",
      where: "Learn",
      href: "/aws-cost-optimization#aws-data-transfer-cost",
    },
    {
      title: "Cloud cost optimization",
      where: "Learn",
      href: "/cloud-cost-optimization",
    },
    {
      title: "What are cost allocation tags?",
      where: "Glossary",
      href: "/learn/glossary/cost-allocation-tags",
    },
  ],
};
