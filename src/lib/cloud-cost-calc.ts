/**
 * The arithmetic behind /node-cost-calculator and /disk-cost-calculator. Pure functions: no React, no fetch, no
 * clock. Ported line for line from the checked calc.ts (docs/website-seo/new-pages-2026-10-30/calculators), where
 * every rule traces to an official page quoted in that folder's ledger.md and checked by its fetch_docs.py. The data
 * is `@/content/cloud-prices`; the pages' formats are at the end of this file.
 *
 * Value, then reason, then hide: a figure the clouds don't publish is a reason, never a number (`Figure`), and a
 * field that is blank or out of range is an error the page shows in place of every figure.
 */

/** A month is 730 hours everywhere on the site. */
export const HOURS_PER_MONTH = 730;

export type Cloud = "azure" | "aws";
export type SizeKind = "general" | "compute" | "memory";

/** A figure the page shows, or the reason it can't: value, then reason, then hide. */
export type Figure<T> = { readonly value: T } | { readonly reason: UnavailableReason };

export type UnavailableReason =
  /** AKS publishes kube-reserved CPU for 1, 2, 4, 8, 16, 32 and 64 cores only. */
  | "aks-cpu-reserve-not-published-for-this-core-count"
  /** EKS names a max pods cap below 30 vCPUs and above 30, not at exactly 30. */
  | "eks-max-pods-cap-not-published-at-30-vcpu"
  /** AWS subtracts the reserves from the memory the node reports, which AWS does not publish per instance type. */
  | "eks-node-memory-capacity-not-published";

export function has<T>(f: Figure<T>): f is { readonly value: T } {
  return "value" in f;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Node cost                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface NodeSize {
  readonly cloud: Cloud;
  /** Standard_D4s_v5, m6i.xlarge. */
  readonly name: string;
  readonly kind: SizeKind;
  readonly vcpu: number;
  /** As the cloud lists it: Microsoft Learn's size table (Azure), the AWS price list's Memory (AWS). */
  readonly memoryGib: number;
  /** AWS only, from the EKS-optimized AMI's instance-info.jsonl: network interfaces and IPv4 addresses on each. */
  readonly enis?: number;
  readonly ipv4PerEni?: number;
}

/** Hourly list price × 730 hours × nodes. */
export function monthlyCost(usdPerHour: number, nodes: number): number {
  return usdPerHour * HOURS_PER_MONTH * nodes;
}

/* AKS: Microsoft Learn, "Node resource reservations in Azure Kubernetes Service (AKS)", AKS 1.29 and later. */

/** Kube-reserved CPU in millicores, by CPU cores on the host. */
export const AKS_KUBE_RESERVED_CPU_M: Readonly<Record<number, number>> = {
  1: 60,
  2: 100,
  4: 140,
  8: 180,
  16: 260,
  32: 420,
  64: 740,
};

/** "memory.available < 100 Mi eviction rule", counted as 0.1 GB the way Microsoft's own example counts it. */
export const AKS_EVICTION_MB = 100;

/** Default max pods per node by network plugin (Microsoft Learn, IP address planning: Maximum pods per node). */
export const AKS_DEFAULT_MAX_PODS = {
  "azure-cni-overlay": 250,
  "azure-cni-pod-subnet": 110,
  "azure-cni-legacy": 30,
  kubenet: 110,
} as const;
export type AksNetworkPlugin = keyof typeof AKS_DEFAULT_MAX_PODS;

/** "If you don't specify --network-plugin, AKS defaults to Azure CNI Overlay." */
export const AKS_DEFAULT_NETWORK_PLUGIN: AksNetworkPlugin = "azure-cni-overlay";

/** Max pods per node may be set from 10 to 250 on AKS. */
export const AKS_MAX_PODS_RANGE = { min: 10, max: 250 } as const;

/** "10 if and only if the configuration of each node pool has space for a minimum of 30 pods": max pods × nodes ≥ 30. */
export const AKS_MIN_PODS_PER_NODE_POOL = 30;

export function aksKubeReservedCpuMillicores(vcpu: number): Figure<number> {
  const m = AKS_KUBE_RESERVED_CPU_M[vcpu];
  return m === undefined
    ? { reason: "aks-cpu-reserve-not-published-for-this-core-count" }
    : { value: m };
}

/**
 * Kube-reserved memory in MB: the lesser of 20 MB × max pods + 50 MB, or 25% of the node's memory. Microsoft's
 * examples count 1 GB as 1,000 MB (8 GB at 30 pods → 650 MB; 4 GB → 1000 MB), so the node's memory figure is taken
 * × 1,000 here, and the result reads back in the same unit as the size table.
 */
export function aksKubeReservedMemoryMb(memoryGb: number, maxPods: number): number {
  return Math.min(20 * maxPods + 50, 0.25 * memoryGb * 1000);
}

/** Memory pods can use: the node's memory − kube-reserved − the 100 Mi eviction threshold, in the node's unit. */
export function aksAllocatableMemoryGb(memoryGb: number, maxPods: number): number {
  return (memoryGb * 1000 - aksKubeReservedMemoryMb(memoryGb, maxPods) - AKS_EVICTION_MB) / 1000;
}

/* EKS: the EKS-optimized Amazon Linux AMI (nodeadm), as AWS documents it for AWS Batch on Amazon EKS. */

/** Kube-reserved CPU: 6% of the first core, 1% of the second, 0.5% of the third and fourth, 0.25% of every core after. */
export function eksKubeReservedCpuMillicores(vcpu: number): number {
  const total = vcpu * 1000;
  const bounds = [0, 1000, 2000, 4000, total];
  const basisPoints = [600, 100, 50, 25];
  let reserved = 0;
  for (let i = 0; i < basisPoints.length; i++) {
    const start = bounds[i];
    if (total <= start) continue;
    const end = Math.min(total, bounds[i + 1]);
    reserved += Math.trunc(((end - start) * basisPoints[i]) / 10000);
  }
  return reserved;
}

/** Max pods with the default VPC CNI: ENIs × (IPv4 addresses per ENI − 1) + 2. */
export function eksEniMaxPods(enis: number, ipv4PerEni: number): number {
  return enis * (ipv4PerEni - 1) + 2;
}

/** A managed node group without a custom AMI caps max pods at 110 below 30 vCPUs and at 250 above 30. */
export function eksManagedNodeGroupMaxPods(
  enis: number,
  ipv4PerEni: number,
  vcpu: number,
): Figure<number> {
  const eni = eksEniMaxPods(enis, ipv4PerEni);
  if (vcpu < 30) return { value: Math.min(eni, 110) };
  if (vcpu > 30) return { value: Math.min(eni, 250) };
  return { reason: "eks-max-pods-cap-not-published-at-30-vcpu" };
}

/**
 * Kube-reserved memory in MiB: 11 × max pods + 255. The pods counted are "the maximum number of pods that is supported
 * by the instance type" (AWS Batch on EKS), the ENI figure from instance-info.jsonl. A managed node group's 110 or 250
 * cap sets the node's maxPods but not this reserve: nodeadm computes the reserve from CalcMaxPods before the injected
 * kubelet maxPods applies (config.go withDefaultReservedResources; the e2e fixture kubelet-config-max-pods keeps 915Mi
 * for 60 pods with a kubelet maxPods of 1).
 */
export function eksKubeReservedMemoryMib(instanceTypeMaxPods: number): number {
  return 11 * instanceTypeMaxPods + 255;
}

/** The AMI's hard eviction threshold for memory: memory.available 100Mi. */
export const EKS_EVICTION_MIB = 100;

/**
 * Memory pods can use, from the memory the node reports (its capacity in MiB, which AWS gives only for one example:
 * an 8 GB instance reports 7,748 MiB). The node calculator can't call this for a listed size, because that capacity
 * isn't published per instance type; it is here for the doc's worked example and for a capacity read from a node.
 */
export function eksAllocatableMemoryMib(
  nodeCapacityMib: number,
  instanceTypeMaxPods: number,
): number {
  return nodeCapacityMib - eksKubeReservedMemoryMib(instanceTypeMaxPods) - EKS_EVICTION_MIB;
}

/* The node calculator. */

/**
 * Reads a number field's text. Blank (or only spaces) is NaN, never 0, so a cleared field shows its message instead of
 * a figure. `Number("")` is 0 in JavaScript, which is why the page must parse through this.
 */
export function parseNumberInput(raw: string): number {
  const t = raw.trim();
  return t === "" ? Number.NaN : Number(t);
}

export interface NodeInput {
  readonly size: NodeSize;
  /** The region's hourly list price for this size. */
  readonly usdPerHour: number;
  readonly nodes: number;
  /**
   * AKS only; leave out for the default (Azure CNI Overlay, 250). On EKS max pods isn't an input: a managed node group
   * sets it, and the memory reserve follows the instance type's own pod limit whatever max pods is set to.
   */
  readonly maxPods?: number;
}

export interface NodeResult {
  readonly usdPerHour: number;
  readonly usdPerMonthPerNode: number;
  readonly usdPerMonth: number;
  readonly maxPods: Figure<number>;
  /** EKS only: the pods the instance type supports (ENIs × (IPv4 per ENI − 1) + 2), which the memory reserve counts. */
  readonly instanceTypeMaxPods?: number;
  /** What the node is: vCPUs and memory as the cloud lists them. */
  readonly node: { readonly vcpu: number; readonly memoryGib: number };
  /** What Kubernetes keeps on each node before pods: kube-reserved plus, for memory, the hard eviction threshold. */
  readonly reserved: {
    readonly cpuMillicores: Figure<number>;
    readonly memoryGib: Figure<number>;
  };
  /** What pods can use on each node, and its share of the node. */
  readonly perNode: {
    readonly cpuVcpu: Figure<number>;
    readonly cpuShare: Figure<number>;
    readonly memoryGib: Figure<number>;
    readonly memoryShare: Figure<number>;
  };
  /** The same across all the nodes. */
  readonly total: {
    readonly vcpu: number;
    readonly memoryGib: number;
    readonly podsCpuVcpu: Figure<number>;
    readonly podsMemoryGib: Figure<number>;
  };
}

export type NodeInputError =
  | "nodes-must-be-a-whole-number-from-1"
  | "max-pods-out-of-range"
  | "max-pods-is-an-aks-setting"
  | "aks-node-pool-needs-room-for-30-pods"
  | "aws-size-needs-eni-facts";

export function defaultMaxPods(size: NodeSize): Figure<number> {
  if (size.cloud === "azure") return { value: AKS_DEFAULT_MAX_PODS[AKS_DEFAULT_NETWORK_PLUGIN] };
  if (size.enis === undefined || size.ipv4PerEni === undefined) {
    throw new Error(`${size.name}: no ENI facts`);
  }
  return eksManagedNodeGroupMaxPods(size.enis, size.ipv4PerEni, size.vcpu);
}

function map<T, U>(f: Figure<T>, fn: (v: T) => U): Figure<U> {
  return has(f) ? { value: fn(f.value) } : f;
}

export function nodeCost(input: NodeInput): NodeResult | { readonly error: NodeInputError } {
  const { size, usdPerHour, nodes } = input;
  /* A safe integer, not just an integer: "1e308" is an integer to JavaScript, and its cost would print as "$∞". */
  if (!Number.isSafeInteger(nodes) || nodes < 1)
    return { error: "nodes-must-be-a-whole-number-from-1" };
  if (size.cloud === "aws" && (size.enis === undefined || size.ipv4PerEni === undefined)) {
    return { error: "aws-size-needs-eni-facts" };
  }
  if (input.maxPods !== undefined) {
    if (size.cloud === "aws") return { error: "max-pods-is-an-aks-setting" };
    const ok = Number.isInteger(input.maxPods);
    const inAksRange =
      input.maxPods >= AKS_MAX_PODS_RANGE.min && input.maxPods <= AKS_MAX_PODS_RANGE.max;
    if (!ok || !inAksRange) return { error: "max-pods-out-of-range" };
    if (input.maxPods * nodes < AKS_MIN_PODS_PER_NODE_POOL)
      return { error: "aks-node-pool-needs-room-for-30-pods" };
  }
  const maxPods: Figure<number> =
    input.maxPods !== undefined ? { value: input.maxPods } : defaultMaxPods(size);

  let reservedCpu: Figure<number>;
  let reservedMemGib: Figure<number>;
  let podsMemGib: Figure<number>;
  let instanceTypeMaxPods: number | undefined;
  if (size.cloud === "azure") {
    reservedCpu = aksKubeReservedCpuMillicores(size.vcpu);
    reservedMemGib = map(
      maxPods,
      (p) => (aksKubeReservedMemoryMb(size.memoryGib, p) + AKS_EVICTION_MB) / 1000,
    );
    podsMemGib = map(maxPods, (p) => aksAllocatableMemoryGb(size.memoryGib, p));
  } else {
    // Checked above: an AWS size always carries its ENI facts here.
    instanceTypeMaxPods = eksEniMaxPods(size.enis as number, size.ipv4PerEni as number);
    reservedCpu = { value: eksKubeReservedCpuMillicores(size.vcpu) };
    reservedMemGib = {
      value: (eksKubeReservedMemoryMib(instanceTypeMaxPods) + EKS_EVICTION_MIB) / 1024,
    };
    podsMemGib = { reason: "eks-node-memory-capacity-not-published" };
  }
  const podsCpu = map(reservedCpu, (m) => (size.vcpu * 1000 - m) / 1000);

  return {
    usdPerHour,
    usdPerMonthPerNode: monthlyCost(usdPerHour, 1),
    usdPerMonth: monthlyCost(usdPerHour, nodes),
    maxPods,
    ...(instanceTypeMaxPods !== undefined ? { instanceTypeMaxPods } : {}),
    node: { vcpu: size.vcpu, memoryGib: size.memoryGib },
    reserved: { cpuMillicores: reservedCpu, memoryGib: reservedMemGib },
    perNode: {
      cpuVcpu: podsCpu,
      cpuShare: map(podsCpu, (c) => c / size.vcpu),
      memoryGib: podsMemGib,
      memoryShare: map(podsMemGib, (m) => m / size.memoryGib),
    },
    total: {
      vcpu: size.vcpu * nodes,
      memoryGib: size.memoryGib * nodes,
      podsCpuVcpu: map(podsCpu, (c) => c * nodes),
      podsMemoryGib: map(podsMemGib, (m) => m * nodes),
    },
  };
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Disk cost                                                                                                           */
/* ------------------------------------------------------------------------------------------------------------------ */

export type AzureDiskType = "premium-ssd" | "standard-ssd";
export type EbsVolumeType = "gp3" | "gp2";

export interface AzureDiskTier {
  /** P10, E15. */
  readonly name: string;
  readonly gib: number;
  /** LRS, pay-as-you-go, per month. */
  readonly usdPerMonth: number;
}

/** EBS volume sizes (Amazon EBS User Guide, General Purpose SSD volumes): gp3 1 GiB to 64 TiB, gp2 1 GiB to 16 TiB. */
export const EBS_SIZE_GIB: Readonly<
  Record<EbsVolumeType, { readonly min: number; readonly max: number }>
> = {
  gp3: { min: 1, max: 64 * 1024 },
  gp2: { min: 1, max: 16 * 1024 },
};

export interface DiskInput {
  /** The size the disk was created or last grown to. */
  readonly provisionedGib: number;
  /** The space its files take, as the VM reports it. */
  readonly usedGib: number;
}

export interface DiskResult {
  /** The size the price is for: the tier's size on Azure, the provisioned size on EBS. */
  readonly pricedGib: number;
  /** Azure only: the tier Azure maps the disk to. */
  readonly tier?: string;
  readonly usdPerMonth: number;
  /** Provisioned minus used, and never below 0. */
  readonly emptyGib: number;
  /**
   * True when the used space entered is more than the disk size. Empty space is then 0 (never negative), and the page
   * says so beside the figures.
   */
  readonly usedAboveSize: boolean;
  /** Empty ÷ provisioned. */
  readonly emptyShare: number;
  /** What the empty space costs a month: Azure, the tier's price × empty ÷ the tier's size; EBS, the GB price × empty. */
  readonly emptyUsdPerMonth: number;
  /** Azure only, when the tier is larger than the disk: the extra GiB paid for, and their share of the price. */
  readonly roundUpGib?: number;
  readonly roundUpUsdPerMonth?: number;
}

export type DiskInputError =
  "size-must-be-a-whole-number-of-gib" | "size-out-of-range" | "used-must-be-a-number-from-0";

function checkDisk(input: DiskInput, min: number, max: number): DiskInputError | undefined {
  const { provisionedGib: p, usedGib: u } = input;
  if (!Number.isInteger(p)) return "size-must-be-a-whole-number-of-gib";
  if (p < min || p > max) return "size-out-of-range";
  if (!Number.isFinite(u) || u < 0) return "used-must-be-a-number-from-0";
  return undefined;
}

/** Empty space, clamped at 0 when the used space entered is more than the disk size. */
function emptySpace(input: DiskInput): {
  readonly emptyGib: number;
  readonly usedAboveSize: boolean;
} {
  const usedAboveSize = input.usedGib > input.provisionedGib;
  return { emptyGib: usedAboveSize ? 0 : input.provisionedGib - input.usedGib, usedAboveSize };
}

/** The smallest tier that holds the size: "Azure maps the provisioned size (rounded up) to the nearest offered disk size." */
export function azureTierFor(
  provisionedGib: number,
  tiers: readonly AzureDiskTier[],
): AzureDiskTier | undefined {
  return [...tiers].sort((a, b) => a.gib - b.gib).find((t) => t.gib >= provisionedGib);
}

export function azureDiskCost(
  input: DiskInput,
  tiers: readonly AzureDiskTier[],
): DiskResult | { readonly error: DiskInputError } {
  const largest = Math.max(...tiers.map((t) => t.gib));
  const err = checkDisk(input, 1, largest);
  if (err) return { error: err };
  const tier = azureTierFor(input.provisionedGib, tiers);
  if (!tier) return { error: "size-out-of-range" };
  const { emptyGib, usedAboveSize } = emptySpace(input);
  const roundUpGib = tier.gib - input.provisionedGib;
  return {
    pricedGib: tier.gib,
    tier: tier.name,
    usdPerMonth: tier.usdPerMonth,
    emptyGib,
    usedAboveSize,
    emptyShare: emptyGib / input.provisionedGib,
    emptyUsdPerMonth: (tier.usdPerMonth * emptyGib) / tier.gib,
    roundUpGib,
    roundUpUsdPerMonth: (tier.usdPerMonth * roundUpGib) / tier.gib,
  };
}

/** EBS storage only: gp3's included baseline IOPS and throughput are assumed; extra IOPS or throughput isn't counted. */
export function ebsDiskCost(
  input: DiskInput,
  type: EbsVolumeType,
  usdPerGbMonth: number,
): DiskResult | { readonly error: DiskInputError } {
  const err = checkDisk(input, EBS_SIZE_GIB[type].min, EBS_SIZE_GIB[type].max);
  if (err) return { error: err };
  const { emptyGib, usedAboveSize } = emptySpace(input);
  return {
    pricedGib: input.provisionedGib,
    usdPerMonth: usdPerGbMonth * input.provisionedGib,
    emptyGib,
    usedAboveSize,
    emptyShare: emptyGib / input.provisionedGib,
    emptyUsdPerMonth: usdPerGbMonth * emptyGib,
  };
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* From the data files                                                                                                 */
/* ------------------------------------------------------------------------------------------------------------------ */

/** The parts of the price data the calculators read (`@/content/cloud-prices`). */
export interface PricesFile {
  readonly retrieved: string;
  readonly azure: {
    readonly regions: readonly string[];
    readonly vm: {
      readonly sizes: Readonly<
        Record<
          string,
          { readonly vcpu: number; readonly memory_gib: number; readonly kind: SizeKind }
        >
      >;
      readonly usd_per_hour: Readonly<
        Record<string, Readonly<Record<string, { readonly usd_per_hour: number }>>>
      >;
    };
    readonly disk: {
      readonly lrs_usd_per_month: Readonly<
        Record<
          string,
          Readonly<
            Record<
              AzureDiskType,
              Readonly<Record<string, { readonly gib: number; readonly usd_per_month: number }>>
            >
          >
        >
      >;
    };
  };
  readonly aws: {
    readonly regions: readonly string[];
    readonly ec2: Readonly<
      Record<
        string,
        Readonly<
          Record<
            string,
            {
              readonly usd_per_hour: number;
              readonly vcpu: number;
              readonly memory_gib: number;
              readonly kind: SizeKind;
            }
          >
        >
      >
    >;
    readonly ebs: {
      readonly usd_per_gb_month: Readonly<
        Record<string, Readonly<Record<EbsVolumeType, { readonly usd_per_gb_month: number }>>>
      >;
    };
  };
}

/** Each AWS size's ENI facts, as the EKS-optimized AMI lists them. */
export type EniFacts = Readonly<
  Record<string, { readonly enis: number; readonly ipv4_per_eni: number }>
>;

/** The sizes a region lists, with their hourly prices, in the order the price data lists them. */
export function nodeSizes(
  prices: PricesFile,
  eni: EniFacts,
  cloud: Cloud,
  region: string,
): readonly { readonly size: NodeSize; readonly usdPerHour: number }[] {
  if (cloud === "azure") {
    const regional = prices.azure.vm.usd_per_hour[region];
    return Object.entries(prices.azure.vm.sizes).map(([name, s]) => ({
      size: { cloud, name, kind: s.kind, vcpu: s.vcpu, memoryGib: s.memory_gib },
      usdPerHour: regional[name].usd_per_hour,
    }));
  }
  return Object.entries(prices.aws.ec2[region]).map(([name, s]) => ({
    size: {
      cloud,
      name,
      kind: s.kind,
      vcpu: s.vcpu,
      memoryGib: s.memory_gib,
      enis: eni[name]?.enis,
      ipv4PerEni: eni[name]?.ipv4_per_eni,
    },
    usdPerHour: s.usd_per_hour,
  }));
}

export function azureTiers(
  prices: PricesFile,
  region: string,
  type: AzureDiskType,
): readonly AzureDiskTier[] {
  return Object.entries(prices.azure.disk.lrs_usd_per_month[region][type]).map(([name, t]) => ({
    name,
    gib: t.gib,
    usdPerMonth: t.usd_per_month,
  }));
}

export function ebsPrice(prices: PricesFile, region: string, type: EbsVolumeType): number {
  return prices.aws.ebs.usd_per_gb_month[region][type].usd_per_gb_month;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* The pages' formats                                                                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

/** Money to the cent: "$420.48", "$1,040.64". */
export const usd = (n: number): string =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** A unit price as the price list gives it, to at most four places: "$0.192", "$0.0912", "$0.08". */
export const unitPrice = (n: number): string =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

/** vCPUs and GiB: at most two places, trailing zeros dropped ("3.86", "16", "1,024"). */
export const amount = (n: number, places = 2): string =>
  n.toLocaleString("en-US", { maximumFractionDigits: places });

/** A share to one place: "96.5%", "98%". */
export const share = (n: number): string =>
  (n * 100).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "%";
