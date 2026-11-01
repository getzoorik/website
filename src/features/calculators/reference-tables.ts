import {
  diskCalculatorUi,
  nodeCalculator,
  nodeCalculatorUi,
  sizeKindNames,
} from "@/content/calculators";
import { cloudPrices, eniFacts, regionNames } from "@/content/cloud-prices";
import {
  amount,
  azureTiers,
  ebsPrice,
  has,
  monthlyCost,
  nodeCost,
  nodeSizes,
  share,
  unitPrice,
  usd,
  type Cloud,
  type NodeResult,
} from "@/lib/cloud-cost-calc";

/**
 * The reference tables under each calculator ("List prices and reserves, 30 October 2026", closed), worked out from
 * the same data through the same functions as the calculator, as the drafts' tables.ts prints them, so the page's
 * static figures never drift from its live ones. A cell is the drafts' small markup (a size in `code`).
 */

export interface ReferenceTable {
  /** An h3 over the table, named for its search. */
  readonly heading?: string;
  readonly title: string;
  readonly head: readonly string[];
  /** The columns' widths, as the mock's colgroup sets them. */
  readonly widths: readonly string[];
  readonly rows: readonly (readonly string[])[];
  /** A line under the table: on EKS's, the note its "Not shown (see the note)" cells point to. */
  readonly note?: string;
}

/**
 * The EKS note under its table: the calculator's note without its last sentence, whose figure follows the size chosen
 * above (the table's Kubernetes keeps column gives it for each size). Without it, "see the note" would point at a
 * note the result shows only while AWS is chosen.
 */
export const eksTableNote = nodeCalculator.eksNote.slice(
  0,
  nodeCalculator.eksNote.indexOf(" From what the node reports"),
);

const CLOUD_NAME: Readonly<Record<Cloud, string>> = { azure: "Azure (AKS)", aws: "AWS (EKS)" };
const PRICE_WIDTHS = ["21%", "15%", "8%", "11%", "15%", "15%", "15%"];
const PODS_WIDTHS = ["21%", "11%", "23%", "23%", "22%"];

/** Each cloud's monthly list price per node in its three regions, then what pods can use on each size. */
export function nodeReferenceTables(): readonly ReferenceTable[] {
  return (["azure", "aws"] as const).flatMap((cloud) => {
    const regions = cloud === "azure" ? cloudPrices.azure.regions : cloudPrices.aws.regions;
    const first = nodeSizes(cloudPrices, eniFacts, cloud, regions[0]!);
    const prices: ReferenceTable = {
      heading: nodeCalculatorUi.tableHeadings[cloud],
      title: `${CLOUD_NAME[cloud]}: monthly list price per node`,
      head: ["Size", "Kind", "vCPUs", "Memory", ...regions.map((region) => regionNames[region]!)],
      widths: PRICE_WIDTHS,
      rows: first.map(({ size }) => [
        `\`${size.name}\``,
        sizeKindNames[size.kind],
        String(size.vcpu),
        `${amount(size.memoryGib)} GiB`,
        ...regions.map((region) => {
          const listed = nodeSizes(cloudPrices, eniFacts, cloud, region).find(
            (each) => each.size.name === size.name,
          );
          if (!listed) throw new Error(`${size.name} is not listed in ${region}`);
          return usd(monthlyCost(listed.usdPerHour, 1));
        }),
      ]),
    };
    const pods: ReferenceTable = {
      title: `${CLOUD_NAME[cloud]}: what pods can use on each node`,
      head: ["Size", "Max pods", "CPU pods can use", "Memory pods can use", "Kubernetes keeps"],
      widths: PODS_WIDTHS,
      rows: first.map(({ size, usdPerHour }) => {
        const result = nodeCost({ size, usdPerHour, nodes: 1 }) as NodeResult;
        const { maxPods, perNode, reserved } = result;
        if (
          !has(maxPods) ||
          !has(perNode.cpuVcpu) ||
          !has(perNode.cpuShare) ||
          !has(reserved.cpuMillicores) ||
          !has(reserved.memoryGib)
        ) {
          throw new Error(`${size.name}: a figure the table prints is missing`);
        }
        const memory =
          has(perNode.memoryGib) && has(perNode.memoryShare)
            ? `${amount(perNode.memoryGib.value)} of ${amount(size.memoryGib)} GiB (${share(perNode.memoryShare.value)})`
            : "Not shown (see the note)";
        return [
          `\`${size.name}\``,
          String(maxPods.value),
          `${amount(perNode.cpuVcpu.value)} of ${size.vcpu} vCPUs (${share(perNode.cpuShare.value)})`,
          memory,
          `${amount(reserved.cpuMillicores.value / 1000)} vCPU, ${amount(reserved.memoryGib.value)} GiB`,
        ];
      }),
      ...(cloud === "aws" ? { note: eksTableNote } : {}),
    };
    return [prices, pods];
  });
}

/** Each Azure disk type's tiers and monthly list prices, then EBS's price per GB-month. */
export function diskReferenceTables(): readonly ReferenceTable[] {
  const azure = cloudPrices.azure.regions;
  const aws = cloudPrices.aws.regions;
  const tiers = (["premium-ssd", "standard-ssd"] as const).map((type): ReferenceTable => ({
    heading: diskCalculatorUi.tableHeadings[type],
    title: `Azure ${type === "premium-ssd" ? "Premium SSD" : "Standard SSD"} (LRS): monthly list price per disk`,
    head: ["Tier", "Size", ...azure.map((region) => regionNames[region]!)],
    widths: ["16%", "18%", "22%", "22%", "22%"],
    rows: azureTiers(cloudPrices, azure[0]!, type).map((tier) => [
      tier.name,
      `${amount(tier.gib)} GiB`,
      ...azure.map((region) => {
        const priced = azureTiers(cloudPrices, region, type).find(
          (each) => each.name === tier.name,
        );
        if (!priced) throw new Error(`${tier.name} is not listed in ${region}`);
        return usd(priced.usdPerMonth);
      }),
    ]),
  }));
  return [
    ...tiers,
    {
      heading: diskCalculatorUi.tableHeadings.ebs,
      title: "Amazon EBS: storage list price per GB-month",
      head: ["Volume type", ...aws.map((region) => regionNames[region]!)],
      widths: ["28%", "24%", "24%", "24%"],
      rows: (["gp3", "gp2"] as const).map((type) => [
        type,
        ...aws.map((region) => unitPrice(ebsPrice(cloudPrices, region, type))),
      ]),
    },
  ];
}
