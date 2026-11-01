import type { EniFacts, PricesFile } from "@/lib/cloud-cost-calc";

/**
 * The list prices and node facts the two calculators read (/eks-and-aks-pricing-calculator,
 * /ebs-and-azure-disk-pricing), as the checked data files hold them:
 * docs/website-seo/new-pages-2026-10-30/calculators/prices.json (fetch_prices.py) and allocatable.json
 * (build_allocatable.ts), every figure traced in that folder's ledger.md and re-fetched by its verify stage. Only the
 * parts the pages read are here, in the files' own order; nothing is rounded or typed by hand.
 *
 *   Azure  the Azure Retail Prices API (https://prices.azure.com/api/retail/prices): Linux pay-as-you-go VM prices
 *          per hour, and Premium SSD and Standard SSD LRS managed disks per month, in East US, West Europe and
 *          Central India; each size's vCPUs and memory from Microsoft Learn's VM size pages.
 *   AWS    the AWS Price List for Amazon EC2
 *          (https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/region_index.json): Linux
 *          on-demand prices per hour with each size's vCPUs and memory, and EBS gp3 and gp2 per GB-month, in US East
 *          (N. Virginia), EU (Ireland) and Asia Pacific (Mumbai); each size's network interfaces and IPv4 addresses
 *          from the EKS-optimized AMI's instance-info.jsonl (awslabs/amazon-eks-ami at "f113a680e7218d7cf11601fdf318e67389a05552").
 *
 * All USD, list prices before any discount, reservation, savings plan or negotiated rate. The pages print the day
 * (`pricesRetrieved`) beside every figure they draw from here. Prices change: a refresh replaces this file whole from
 * new data files, and moves `pricesRetrieved` and the two pages' dates in the same PR.
 */

/** When the prices were read, as the data file records it. */
export const pricesRetrievedAt = "2026-10-30T04:03:43Z";

/** The same day, as the pages print it. */
export const pricesRetrieved = "30 October 2026";

export const cloudPrices: PricesFile = {
  retrieved: "2026-10-30T04:03:43Z",
  azure: {
    regions: ["eastus", "westeurope", "centralindia"],
    vm: {
      sizes: {
        Standard_D2s_v5: { vcpu: 2, memory_gib: 8.0, kind: "general" },
        Standard_D4s_v5: { vcpu: 4, memory_gib: 16.0, kind: "general" },
        Standard_D8s_v5: { vcpu: 8, memory_gib: 32.0, kind: "general" },
        Standard_D16s_v5: { vcpu: 16, memory_gib: 64.0, kind: "general" },
        Standard_D4as_v5: { vcpu: 4, memory_gib: 16.0, kind: "general" },
        Standard_D8as_v5: { vcpu: 8, memory_gib: 32.0, kind: "general" },
        Standard_F4s_v2: { vcpu: 4, memory_gib: 8.0, kind: "compute" },
        Standard_F8s_v2: { vcpu: 8, memory_gib: 16.0, kind: "compute" },
        Standard_F16s_v2: { vcpu: 16, memory_gib: 32.0, kind: "compute" },
        Standard_E4s_v5: { vcpu: 4, memory_gib: 32.0, kind: "memory" },
        Standard_E8s_v5: { vcpu: 8, memory_gib: 64.0, kind: "memory" },
        Standard_E16s_v5: { vcpu: 16, memory_gib: 128.0, kind: "memory" },
      },
      usd_per_hour: {
        eastus: {
          Standard_D2s_v5: { usd_per_hour: 0.096 },
          Standard_D4s_v5: { usd_per_hour: 0.192 },
          Standard_D8s_v5: { usd_per_hour: 0.384 },
          Standard_D16s_v5: { usd_per_hour: 0.768 },
          Standard_D4as_v5: { usd_per_hour: 0.172 },
          Standard_D8as_v5: { usd_per_hour: 0.344 },
          Standard_F4s_v2: { usd_per_hour: 0.169 },
          Standard_F8s_v2: { usd_per_hour: 0.338 },
          Standard_F16s_v2: { usd_per_hour: 0.677 },
          Standard_E4s_v5: { usd_per_hour: 0.252 },
          Standard_E8s_v5: { usd_per_hour: 0.504 },
          Standard_E16s_v5: { usd_per_hour: 1.008 },
        },
        westeurope: {
          Standard_D2s_v5: { usd_per_hour: 0.115 },
          Standard_D4s_v5: { usd_per_hour: 0.23 },
          Standard_D8s_v5: { usd_per_hour: 0.46 },
          Standard_D16s_v5: { usd_per_hour: 0.92 },
          Standard_D4as_v5: { usd_per_hour: 0.208 },
          Standard_D8as_v5: { usd_per_hour: 0.416 },
          Standard_F4s_v2: { usd_per_hour: 0.194 },
          Standard_F8s_v2: { usd_per_hour: 0.388 },
          Standard_F16s_v2: { usd_per_hour: 0.776 },
          Standard_E4s_v5: { usd_per_hour: 0.304 },
          Standard_E8s_v5: { usd_per_hour: 0.608 },
          Standard_E16s_v5: { usd_per_hour: 1.216 },
        },
        centralindia: {
          Standard_D2s_v5: { usd_per_hour: 0.101 },
          Standard_D4s_v5: { usd_per_hour: 0.202 },
          Standard_D8s_v5: { usd_per_hour: 0.404 },
          Standard_D16s_v5: { usd_per_hour: 0.808 },
          Standard_D4as_v5: { usd_per_hour: 0.111 },
          Standard_D8as_v5: { usd_per_hour: 0.222 },
          Standard_F4s_v2: { usd_per_hour: 0.17 },
          Standard_F8s_v2: { usd_per_hour: 0.34 },
          Standard_F16s_v2: { usd_per_hour: 0.68 },
          Standard_E4s_v5: { usd_per_hour: 0.26 },
          Standard_E8s_v5: { usd_per_hour: 0.52 },
          Standard_E16s_v5: { usd_per_hour: 1.04 },
        },
      },
    },
    disk: {
      lrs_usd_per_month: {
        eastus: {
          "premium-ssd": {
            P1: { gib: 4, usd_per_month: 0.6 },
            P2: { gib: 8, usd_per_month: 1.2 },
            P3: { gib: 16, usd_per_month: 2.4 },
            P4: { gib: 32, usd_per_month: 5.2795 },
            P6: { gib: 64, usd_per_month: 10.207 },
            P10: { gib: 128, usd_per_month: 19.71 },
            P15: { gib: 256, usd_per_month: 38.012142 },
            P20: { gib: 512, usd_per_month: 73.22 },
            P30: { gib: 1024, usd_per_month: 135.17 },
            P40: { gib: 2048, usd_per_month: 259.0457 },
            P50: { gib: 4096, usd_per_month: 495.5657 },
            P60: { gib: 8192, usd_per_month: 946.08 },
            P70: { gib: 16384, usd_per_month: 1802.06 },
            P80: { gib: 32767, usd_per_month: 3604.11 },
          },
          "standard-ssd": {
            E1: { gib: 4, usd_per_month: 0.3 },
            E2: { gib: 8, usd_per_month: 0.6 },
            E3: { gib: 16, usd_per_month: 1.2 },
            E4: { gib: 32, usd_per_month: 2.4 },
            E6: { gib: 64, usd_per_month: 4.8 },
            E10: { gib: 128, usd_per_month: 9.6 },
            E15: { gib: 256, usd_per_month: 19.2 },
            E20: { gib: 512, usd_per_month: 38.4 },
            E30: { gib: 1024, usd_per_month: 76.8 },
            E40: { gib: 2048, usd_per_month: 153.6 },
            E50: { gib: 4096, usd_per_month: 307.2 },
            E60: { gib: 8192, usd_per_month: 614.4 },
            E70: { gib: 16384, usd_per_month: 1228.8 },
            E80: { gib: 32767, usd_per_month: 2457.6 },
          },
        },
        westeurope: {
          "premium-ssd": {
            P1: { gib: 4, usd_per_month: 0.78 },
            P2: { gib: 8, usd_per_month: 1.56 },
            P3: { gib: 16, usd_per_month: 3.12 },
            P4: { gib: 32, usd_per_month: 5.8072 },
            P6: { gib: 64, usd_per_month: 11.2272 },
            P10: { gib: 128, usd_per_month: 21.68 },
            P15: { gib: 256, usd_per_month: 41.811428 },
            P20: { gib: 512, usd_per_month: 80.54 },
            P30: { gib: 1024, usd_per_month: 148.68 },
            P40: { gib: 2048, usd_per_month: 284.9371 },
            P50: { gib: 4096, usd_per_month: 545.0971 },
            P60: { gib: 8192, usd_per_month: 1040.64 },
            P70: { gib: 16384, usd_per_month: 1982.17 },
            P80: { gib: 32767, usd_per_month: 3964.34 },
          },
          "standard-ssd": {
            E1: { gib: 4, usd_per_month: 0.3 },
            E2: { gib: 8, usd_per_month: 0.6 },
            E3: { gib: 16, usd_per_month: 1.2 },
            E4: { gib: 32, usd_per_month: 2.4 },
            E6: { gib: 64, usd_per_month: 4.8 },
            E10: { gib: 128, usd_per_month: 9.6 },
            E15: { gib: 256, usd_per_month: 19.2 },
            E20: { gib: 512, usd_per_month: 38.4 },
            E30: { gib: 1024, usd_per_month: 76.8 },
            E40: { gib: 2048, usd_per_month: 153.6 },
            E50: { gib: 4096, usd_per_month: 307.2 },
            E60: { gib: 8192, usd_per_month: 614.4 },
            E70: { gib: 16384, usd_per_month: 1228.8 },
            E80: { gib: 32767, usd_per_month: 2457.6 },
          },
        },
        centralindia: {
          "premium-ssd": {
            P1: { gib: 4, usd_per_month: 0.84 },
            P2: { gib: 8, usd_per_month: 1.68 },
            P3: { gib: 16, usd_per_month: 3.36 },
            P4: { gib: 32, usd_per_month: 5.2795 },
            P6: { gib: 64, usd_per_month: 10.207 },
            P10: { gib: 128, usd_per_month: 19.71 },
            P15: { gib: 256, usd_per_month: 38.012142 },
            P20: { gib: 512, usd_per_month: 73.22 },
            P30: { gib: 1024, usd_per_month: 135.17 },
            P40: { gib: 2048, usd_per_month: 259.0457 },
            P50: { gib: 4096, usd_per_month: 495.5657 },
            P60: { gib: 8192, usd_per_month: 946.08 },
            P70: { gib: 16384, usd_per_month: 1802.06 },
            P80: { gib: 32767, usd_per_month: 3604.11 },
          },
          "standard-ssd": {
            E1: { gib: 4, usd_per_month: 0.33 },
            E2: { gib: 8, usd_per_month: 0.66 },
            E3: { gib: 16, usd_per_month: 1.32 },
            E4: { gib: 32, usd_per_month: 2.64 },
            E6: { gib: 64, usd_per_month: 5.28 },
            E10: { gib: 128, usd_per_month: 10.56 },
            E15: { gib: 256, usd_per_month: 21.12 },
            E20: { gib: 512, usd_per_month: 42.24 },
            E30: { gib: 1024, usd_per_month: 84.48 },
            E40: { gib: 2048, usd_per_month: 168.96 },
            E50: { gib: 4096, usd_per_month: 337.92 },
            E60: { gib: 8192, usd_per_month: 675.84 },
            E70: { gib: 16384, usd_per_month: 1351.68 },
            E80: { gib: 32767, usd_per_month: 2703.36 },
          },
        },
      },
    },
  },
  aws: {
    regions: ["us-east-1", "eu-west-1", "ap-south-1"],
    ec2: {
      "us-east-1": {
        "m6i.large": { usd_per_hour: 0.096, vcpu: 2, memory_gib: 8.0, kind: "general" },
        "m6i.xlarge": { usd_per_hour: 0.192, vcpu: 4, memory_gib: 16.0, kind: "general" },
        "m6i.2xlarge": { usd_per_hour: 0.384, vcpu: 8, memory_gib: 32.0, kind: "general" },
        "m6i.4xlarge": { usd_per_hour: 0.768, vcpu: 16, memory_gib: 64.0, kind: "general" },
        "m7i.xlarge": { usd_per_hour: 0.2016, vcpu: 4, memory_gib: 16.0, kind: "general" },
        "m7i.2xlarge": { usd_per_hour: 0.4032, vcpu: 8, memory_gib: 32.0, kind: "general" },
        "c6i.xlarge": { usd_per_hour: 0.17, vcpu: 4, memory_gib: 8.0, kind: "compute" },
        "c6i.2xlarge": { usd_per_hour: 0.34, vcpu: 8, memory_gib: 16.0, kind: "compute" },
        "c6i.4xlarge": { usd_per_hour: 0.68, vcpu: 16, memory_gib: 32.0, kind: "compute" },
        "r6i.large": { usd_per_hour: 0.126, vcpu: 2, memory_gib: 16.0, kind: "memory" },
        "r6i.xlarge": { usd_per_hour: 0.252, vcpu: 4, memory_gib: 32.0, kind: "memory" },
        "r6i.2xlarge": { usd_per_hour: 0.504, vcpu: 8, memory_gib: 64.0, kind: "memory" },
      },
      "eu-west-1": {
        "m6i.large": { usd_per_hour: 0.107, vcpu: 2, memory_gib: 8.0, kind: "general" },
        "m6i.xlarge": { usd_per_hour: 0.214, vcpu: 4, memory_gib: 16.0, kind: "general" },
        "m6i.2xlarge": { usd_per_hour: 0.428, vcpu: 8, memory_gib: 32.0, kind: "general" },
        "m6i.4xlarge": { usd_per_hour: 0.856, vcpu: 16, memory_gib: 64.0, kind: "general" },
        "m7i.xlarge": { usd_per_hour: 0.2247, vcpu: 4, memory_gib: 16.0, kind: "general" },
        "m7i.2xlarge": { usd_per_hour: 0.4494, vcpu: 8, memory_gib: 32.0, kind: "general" },
        "c6i.xlarge": { usd_per_hour: 0.1824, vcpu: 4, memory_gib: 8.0, kind: "compute" },
        "c6i.2xlarge": { usd_per_hour: 0.3648, vcpu: 8, memory_gib: 16.0, kind: "compute" },
        "c6i.4xlarge": { usd_per_hour: 0.7296, vcpu: 16, memory_gib: 32.0, kind: "compute" },
        "r6i.large": { usd_per_hour: 0.141, vcpu: 2, memory_gib: 16.0, kind: "memory" },
        "r6i.xlarge": { usd_per_hour: 0.282, vcpu: 4, memory_gib: 32.0, kind: "memory" },
        "r6i.2xlarge": { usd_per_hour: 0.564, vcpu: 8, memory_gib: 64.0, kind: "memory" },
      },
      "ap-south-1": {
        "m6i.large": { usd_per_hour: 0.101, vcpu: 2, memory_gib: 8.0, kind: "general" },
        "m6i.xlarge": { usd_per_hour: 0.202, vcpu: 4, memory_gib: 16.0, kind: "general" },
        "m6i.2xlarge": { usd_per_hour: 0.404, vcpu: 8, memory_gib: 32.0, kind: "general" },
        "m6i.4xlarge": { usd_per_hour: 0.808, vcpu: 16, memory_gib: 64.0, kind: "general" },
        "m7i.xlarge": { usd_per_hour: 0.2121, vcpu: 4, memory_gib: 16.0, kind: "general" },
        "m7i.2xlarge": { usd_per_hour: 0.4242, vcpu: 8, memory_gib: 32.0, kind: "general" },
        "c6i.xlarge": { usd_per_hour: 0.17, vcpu: 4, memory_gib: 8.0, kind: "compute" },
        "c6i.2xlarge": { usd_per_hour: 0.34, vcpu: 8, memory_gib: 16.0, kind: "compute" },
        "c6i.4xlarge": { usd_per_hour: 0.68, vcpu: 16, memory_gib: 32.0, kind: "compute" },
        "r6i.large": { usd_per_hour: 0.13, vcpu: 2, memory_gib: 16.0, kind: "memory" },
        "r6i.xlarge": { usd_per_hour: 0.26, vcpu: 4, memory_gib: 32.0, kind: "memory" },
        "r6i.2xlarge": { usd_per_hour: 0.52, vcpu: 8, memory_gib: 64.0, kind: "memory" },
      },
    },
    ebs: {
      usd_per_gb_month: {
        "us-east-1": { gp3: { usd_per_gb_month: 0.08 }, gp2: { usd_per_gb_month: 0.1 } },
        "eu-west-1": { gp3: { usd_per_gb_month: 0.088 }, gp2: { usd_per_gb_month: 0.11 } },
        "ap-south-1": { gp3: { usd_per_gb_month: 0.0912 }, gp2: { usd_per_gb_month: 0.114 } },
      },
    },
  },
};

/** Each AWS size's network interfaces and IPv4 addresses on each: what EKS's max pods and memory reserve count. */
export const eniFacts: EniFacts = {
  "m6i.large": { enis: 3, ipv4_per_eni: 10 },
  "m6i.xlarge": { enis: 4, ipv4_per_eni: 15 },
  "m6i.2xlarge": { enis: 4, ipv4_per_eni: 15 },
  "m6i.4xlarge": { enis: 8, ipv4_per_eni: 30 },
  "m7i.xlarge": { enis: 4, ipv4_per_eni: 15 },
  "m7i.2xlarge": { enis: 4, ipv4_per_eni: 15 },
  "c6i.xlarge": { enis: 4, ipv4_per_eni: 15 },
  "c6i.2xlarge": { enis: 4, ipv4_per_eni: 15 },
  "c6i.4xlarge": { enis: 8, ipv4_per_eni: 30 },
  "r6i.large": { enis: 3, ipv4_per_eni: 10 },
  "r6i.xlarge": { enis: 4, ipv4_per_eni: 15 },
  "r6i.2xlarge": { enis: 4, ipv4_per_eni: 15 },
};

/** Each region's name, as the clouds' own pages write it. */
export const regionNames: Readonly<Record<string, string>> = {
  eastus: "East US",
  westeurope: "West Europe",
  centralindia: "Central India",
  "us-east-1": "US East (N. Virginia)",
  "eu-west-1": "EU (Ireland)",
  "ap-south-1": "Asia Pacific (Mumbai)",
};
