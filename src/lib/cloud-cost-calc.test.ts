import assert from "node:assert/strict";

import { describe, expect, it } from "vitest";

import { cloudPrices as prices, eniFacts as eni } from "@/content/cloud-prices";
import {
  HOURS_PER_MONTH,
  aksAllocatableMemoryGb,
  aksKubeReservedCpuMillicores,
  aksKubeReservedMemoryMb,
  amount,
  azureDiskCost,
  azureTierFor,
  azureTiers,
  ebsDiskCost,
  ebsPrice,
  eksAllocatableMemoryMib,
  eksEniMaxPods,
  eksKubeReservedCpuMillicores,
  eksKubeReservedMemoryMib,
  eksManagedNodeGroupMaxPods,
  has,
  monthlyCost,
  nodeCost,
  nodeSizes,
  parseNumberInput,
  share,
  unitPrice,
  usd,
  type Figure,
  type NodeResult,
} from "@/lib/cloud-cost-calc";

/**
 * The calculators' arithmetic against the clouds' own worked examples and hand-worked cases on the 30 Oct 2026
 * prices: the checked calc.test.ts (docs/website-seo/new-pages-2026-10-30/calculators), ported to this suite with its
 * assertions unchanged, then what the pages need on top: every size and tier priced, the 730-hour month, the next
 * Azure tier, the clamp, blank and zero, and the formats.
 */

const close = (a: number, b: number, eps = 1e-9): void =>
  assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
const value = <T>(f: Figure<T>): T => {
  assert.ok(has(f), `expected a value, got ${JSON.stringify(f)}`);
  return f.value;
};

describe("the checked calc.test.ts", () => {
  it("AKS: Microsoft's worked examples", () => {
    assert.equal(aksKubeReservedMemoryMb(8, 30), 650);
    close(aksAllocatableMemoryGb(8, 30), 7.25);
    close(aksAllocatableMemoryGb(8, 30) / 8, 0.90625);
    assert.equal(aksKubeReservedMemoryMb(4, 70), 1000);
    assert.equal(value(aksKubeReservedCpuMillicores(2)), 100);
    assert.equal(value(aksKubeReservedCpuMillicores(16)), 260);
    assert.deepEqual(aksKubeReservedCpuMillicores(48), {
      reason: "aks-cpu-reserve-not-published-for-this-core-count",
    });
  });

  it("EKS: AWS's worked examples", () => {
    assert.equal(eksKubeReservedCpuMillicores(2), 70);
    assert.equal(eksKubeReservedCpuMillicores(96), 310);
    assert.equal(eksKubeReservedMemoryMib(29), 574);
    assert.equal(eksAllocatableMemoryMib(7748, 29), 7074);
    assert.equal(eksEniMaxPods(3, 10), 29);
  });

  it("EKS: the memory reserve counts the instance type's pods, not the managed node group cap", () => {
    // AWS Batch: 11 × the max pods "supported by the instance type" + 255. nodeadm's fixture: 60 pods → 915Mi, with a
    // kubelet maxPods of 1 left out of the reserve.
    assert.equal(eksKubeReservedMemoryMib(60), 915);
    const m = nodeSizes(prices, eni, "aws", "us-east-1").find((s) => s.size.name === "m6i.4xlarge");
    assert.ok(m);
    const r = nodeCost({ size: m.size, usdPerHour: m.usdPerHour, nodes: 1 }) as NodeResult;
    assert.equal(value(r.maxPods), 110);
    assert.equal(r.instanceTypeMaxPods, 234);
    close(value(r.reserved.memoryGib), (11 * 234 + 255 + 100) / 1024);
    assert.deepEqual(nodeCost({ size: m.size, usdPerHour: m.usdPerHour, nodes: 1, maxPods: 50 }), {
      error: "max-pods-is-an-aks-setting",
    });
  });

  it("EKS: managed node group max pods cap", () => {
    assert.equal(value(eksManagedNodeGroupMaxPods(8, 30, 16)), 110);
    assert.equal(value(eksManagedNodeGroupMaxPods(4, 15, 4)), 58);
    assert.equal(value(eksManagedNodeGroupMaxPods(15, 50, 64)), 250);
    assert.deepEqual(eksManagedNodeGroupMaxPods(8, 30, 30), {
      reason: "eks-max-pods-cap-not-published-at-30-vcpu",
    });
  });

  it("730-hour month", () => {
    close(monthlyCost(0.192, 1), 140.16);
    close(monthlyCost(0.192, 3), 420.48);
  });

  it("node calculator: 3 × Standard_D4s_v5 in East US, default max pods", () => {
    const d4 = nodeSizes(prices, eni, "azure", "eastus").find(
      (s) => s.size.name === "Standard_D4s_v5",
    );
    assert.ok(d4);
    assert.equal(d4.usdPerHour, 0.192);
    const r = nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: 3 }) as NodeResult;
    close(r.usdPerMonthPerNode, 140.16);
    close(r.usdPerMonth, 420.48);
    assert.equal(value(r.maxPods), 250);
    assert.equal(value(r.reserved.cpuMillicores), 140);
    close(value(r.perNode.cpuVcpu), 3.86);
    close(value(r.perNode.cpuShare), 0.965);
    close(value(r.perNode.memoryGib), 11.9);
    close(value(r.perNode.memoryShare), 11.9 / 16);
    close(value(r.reserved.memoryGib), 4.1);
    close(value(r.total.podsCpuVcpu), 11.58);
    close(value(r.total.podsMemoryGib), 35.7);
    assert.equal(r.total.vcpu, 12);
    assert.equal(r.total.memoryGib, 48);
  });

  it("node calculator: max pods 30 on AKS leaves more memory", () => {
    const d4 = nodeSizes(prices, eni, "azure", "eastus").find(
      (s) => s.size.name === "Standard_D4s_v5",
    );
    assert.ok(d4);
    const r = nodeCost({
      size: d4.size,
      usdPerHour: d4.usdPerHour,
      nodes: 1,
      maxPods: 30,
    }) as NodeResult;
    close(value(r.perNode.memoryGib), 15.25);
  });

  it("node calculator: 2 × m6i.large in us-east-1 shows no pod memory figure", () => {
    const m = nodeSizes(prices, eni, "aws", "us-east-1").find((s) => s.size.name === "m6i.large");
    assert.ok(m);
    assert.equal(m.usdPerHour, 0.096);
    const r = nodeCost({ size: m.size, usdPerHour: m.usdPerHour, nodes: 2 }) as NodeResult;
    close(r.usdPerMonth, 140.16);
    assert.equal(value(r.maxPods), 29);
    assert.equal(value(r.reserved.cpuMillicores), 70);
    close(value(r.perNode.cpuVcpu), 1.93);
    assert.equal(r.instanceTypeMaxPods, 29);
    close(value(r.reserved.memoryGib), 674 / 1024);
    assert.deepEqual(r.perNode.memoryGib, { reason: "eks-node-memory-capacity-not-published" });
    assert.deepEqual(r.total.podsMemoryGib, { reason: "eks-node-memory-capacity-not-published" });
    close(value(r.total.podsCpuVcpu), 3.86);
  });

  it("node calculator: input errors, zero and blank", () => {
    const d4 = nodeSizes(prices, eni, "azure", "eastus")[0];
    const nodesError = { error: "nodes-must-be-a-whole-number-from-1" };
    for (const nodes of [
      0,
      -1,
      1.5,
      parseNumberInput(""),
      parseNumberInput("  "),
      parseNumberInput("3x"),
      Infinity,
      /* An integer to JavaScript whose cost is Infinity: the page would print "$∞". */
      parseNumberInput("1e308"),
      Number.MAX_SAFE_INTEGER + 1,
    ]) {
      assert.deepEqual(
        nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes }),
        nodesError,
        String(nodes),
      );
    }
    for (const maxPods of [300, 9, 0, 10.5, parseNumberInput("")]) {
      assert.deepEqual(nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: 1, maxPods }), {
        error: "max-pods-out-of-range",
      });
    }
    // AKS: max pods 10 only when the node pool has room for 30 pods (10 × 3 nodes).
    assert.deepEqual(
      nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: 2, maxPods: 10 }),
      {
        error: "aks-node-pool-needs-room-for-30-pods",
      },
    );
    assert.ok(
      !("error" in nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: 3, maxPods: 10 })),
    );
    assert.ok(
      !("error" in nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: 1, maxPods: 30 })),
    );
    assert.ok(
      !("error" in nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: 1, maxPods: 250 })),
    );
  });

  it("parseNumberInput: blank is NaN, never 0", () => {
    assert.ok(Number.isNaN(parseNumberInput("")));
    assert.ok(Number.isNaN(parseNumberInput("   ")));
    assert.ok(Number.isNaN(parseNumberInput("12 GiB")));
    assert.equal(parseNumberInput(" 200 "), 200);
    assert.equal(parseNumberInput("0"), 0);
    assert.equal(parseNumberInput("50.5"), 50.5);
  });

  it("every listed size and region gives finite, non-negative figures", () => {
    for (const cloud of ["azure", "aws"] as const) {
      for (const region of cloud === "azure" ? prices.azure.regions : prices.aws.regions) {
        for (const { size, usdPerHour } of nodeSizes(prices, eni, cloud, region)) {
          const r = nodeCost({ size, usdPerHour, nodes: 3 }) as NodeResult;
          const figures = [
            r.usdPerHour,
            r.usdPerMonthPerNode,
            r.usdPerMonth,
            r.total.vcpu,
            r.total.memoryGib,
          ];
          for (const f of [
            r.maxPods,
            r.reserved.cpuMillicores,
            r.reserved.memoryGib,
            r.perNode.cpuVcpu,
            r.perNode.cpuShare,
            r.perNode.memoryGib,
            r.perNode.memoryShare,
            r.total.podsCpuVcpu,
            r.total.podsMemoryGib,
          ]) {
            if (has(f)) figures.push(f.value);
          }
          for (const x of figures)
            assert.ok(Number.isFinite(x) && x >= 0, `${size.name} ${region}: ${x}`);
        }
      }
    }
  });

  it("Azure disk: Microsoft's example, 200 GiB Standard SSD maps to E15 (256 GiB)", () => {
    const tiers = azureTiers(prices, "eastus", "standard-ssd");
    const t = azureTierFor(200, tiers);
    assert.equal(t?.name, "E15");
    assert.equal(t?.gib, 256);
  });

  it("Azure disk: 200 GiB Standard SSD in East US with 50 GiB used", () => {
    const r = azureDiskCost(
      { provisionedGib: 200, usedGib: 50 },
      azureTiers(prices, "eastus", "standard-ssd"),
    );
    assert.ok(!("error" in r));
    assert.equal(r.tier, "E15");
    assert.equal(r.pricedGib, 256);
    assert.equal(r.usdPerMonth, 19.2);
    assert.equal(r.emptyGib, 150);
    close(r.emptyShare, 0.75);
    close(r.emptyUsdPerMonth, 11.25);
    assert.equal(r.roundUpGib, 56);
    close(r.roundUpUsdPerMonth ?? NaN, 4.2);
  });

  it("Azure disk: a size between tiers takes the next tier up", () => {
    const tiers = azureTiers(prices, "eastus", "premium-ssd");
    assert.equal(azureTierFor(1, tiers)?.name, "P1");
    assert.equal(azureTierFor(4, tiers)?.name, "P1");
    assert.equal(azureTierFor(5, tiers)?.name, "P2");
    assert.equal(azureTierFor(129, tiers)?.name, "P15");
    assert.equal(azureTierFor(1025, tiers)?.name, "P40");
    assert.equal(azureTierFor(16385, tiers)?.name, "P80");
    assert.equal(azureTierFor(32767, tiers)?.name, "P80");
    assert.equal(azureTierFor(32768, tiers), undefined);
  });

  it("Azure disk: a size exactly on a tier has no round-up", () => {
    const r = azureDiskCost(
      { provisionedGib: 128, usedGib: 32 },
      azureTiers(prices, "eastus", "premium-ssd"),
    );
    assert.ok(!("error" in r));
    assert.equal(r.tier, "P10");
    assert.equal(r.usdPerMonth, 19.71);
    assert.equal(r.roundUpGib, 0);
    close(r.emptyUsdPerMonth, (19.71 * 96) / 128);
  });

  it("EBS: 500 GiB gp3 in us-east-1 with 120 GiB used", () => {
    const price = ebsPrice(prices, "us-east-1", "gp3");
    assert.equal(price, 0.08);
    const r = ebsDiskCost({ provisionedGib: 500, usedGib: 120 }, "gp3", price);
    assert.ok(!("error" in r));
    close(r.usdPerMonth, 40);
    assert.equal(r.emptyGib, 380);
    close(r.emptyShare, 0.76);
    close(r.emptyUsdPerMonth, 30.4);
    assert.equal(r.tier, undefined);
  });

  it("disk: used space above the disk size is clamped to 0 empty, with a flag for the message", () => {
    const tiers = azureTiers(prices, "eastus", "premium-ssd");
    const a = azureDiskCost({ provisionedGib: 100, usedGib: 101 }, tiers);
    assert.ok(!("error" in a));
    assert.equal(a.usedAboveSize, true);
    assert.equal(a.emptyGib, 0);
    assert.equal(a.emptyShare, 0);
    assert.equal(a.emptyUsdPerMonth, 0);
    assert.equal(a.usdPerMonth, 19.71);
    const e = ebsDiskCost({ provisionedGib: 100, usedGib: 250 }, "gp3", 0.08);
    assert.ok(!("error" in e));
    assert.equal(e.usedAboveSize, true);
    assert.equal(e.emptyGib, 0);
    assert.equal(e.emptyUsdPerMonth, 0);
    const ok = ebsDiskCost({ provisionedGib: 100, usedGib: 100 }, "gp3", 0.08);
    assert.ok(!("error" in ok));
    assert.equal(ok.usedAboveSize, false);
    assert.equal(ok.emptyGib, 0);
  });

  it("disk: zero used, and blank or negative inputs", () => {
    const tiers = azureTiers(prices, "eastus", "standard-ssd");
    const z = azureDiskCost({ provisionedGib: 200, usedGib: 0 }, tiers);
    assert.ok(!("error" in z));
    assert.equal(z.emptyGib, 200);
    assert.equal(z.emptyShare, 1);
    close(z.emptyUsdPerMonth, (19.2 * 200) / 256);
    for (const usedGib of [-1, parseNumberInput(""), Number.NaN, Infinity]) {
      assert.deepEqual(azureDiskCost({ provisionedGib: 200, usedGib }, tiers), {
        error: "used-must-be-a-number-from-0",
      });
      assert.deepEqual(ebsDiskCost({ provisionedGib: 200, usedGib }, "gp2", 0.1), {
        error: "used-must-be-a-number-from-0",
      });
    }
    assert.deepEqual(azureDiskCost({ provisionedGib: parseNumberInput(""), usedGib: 0 }, tiers), {
      error: "size-must-be-a-whole-number-of-gib",
    });
    assert.deepEqual(azureDiskCost({ provisionedGib: 0, usedGib: 0 }, tiers), {
      error: "size-out-of-range",
    });
    assert.deepEqual(ebsDiskCost({ provisionedGib: 0, usedGib: 0 }, "gp3", 0.08), {
      error: "size-out-of-range",
    });
  });

  it("disk input errors", () => {
    const tiers = azureTiers(prices, "eastus", "premium-ssd");
    assert.deepEqual(azureDiskCost({ provisionedGib: 32768, usedGib: 1 }, tiers), {
      error: "size-out-of-range",
    });
    assert.deepEqual(azureDiskCost({ provisionedGib: 10.5, usedGib: 1 }, tiers), {
      error: "size-must-be-a-whole-number-of-gib",
    });
    assert.deepEqual(ebsDiskCost({ provisionedGib: 16385, usedGib: 1 }, "gp2", 0.1), {
      error: "size-out-of-range",
    });
    assert.ok(!("error" in ebsDiskCost({ provisionedGib: 16385, usedGib: 1 }, "gp3", 0.08)));
  });

  it("disk page worked example: 200 GiB gp3 in us-east-1 with 50 GiB used", () => {
    const r = ebsDiskCost(
      { provisionedGib: 200, usedGib: 50 },
      "gp3",
      ebsPrice(prices, "us-east-1", "gp3"),
    );
    assert.ok(!("error" in r));
    close(r.usdPerMonth, 16);
    assert.equal(r.emptyGib, 150);
    close(r.emptyShare, 0.75);
    close(r.emptyUsdPerMonth, 12);
  });
});

describe("what the pages need on top", () => {
  it("prices every listed size in every region, a month at 730 hours", () => {
    expect(HOURS_PER_MONTH).toBe(730);
    let sizes = 0;
    for (const cloud of ["azure", "aws"] as const) {
      const regions = cloud === "azure" ? prices.azure.regions : prices.aws.regions;
      expect(regions).toHaveLength(3);
      for (const region of regions) {
        const listed = nodeSizes(prices, eni, cloud, region);
        expect(listed, `${cloud} ${region}`).toHaveLength(12);
        for (const { size, usdPerHour } of listed) {
          sizes++;
          expect(usdPerHour, size.name).toBeGreaterThan(0);
          const result = nodeCost({ size, usdPerHour, nodes: 4 }) as NodeResult;
          expect(result.usdPerMonthPerNode).toBeCloseTo(usdPerHour * 730, 9);
          expect(result.usdPerMonth).toBeCloseTo(usdPerHour * 730 * 4, 9);
          /* Every Azure size has a published CPU reserve; every AWS size its ENI facts and a max pods figure. */
          expect(has(result.reserved.cpuMillicores), size.name).toBe(true);
          expect(has(result.maxPods), size.name).toBe(true);
          expect(has(result.perNode.memoryGib), size.name).toBe(cloud === "azure");
        }
      }
    }
    expect(sizes).toBe(72);
  });

  it("prices every Azure tier in every region and type, each the smallest that holds its own size", () => {
    for (const region of prices.azure.regions) {
      for (const type of ["premium-ssd", "standard-ssd"] as const) {
        const tiers = azureTiers(prices, region, type);
        expect(tiers, `${region} ${type}`).toHaveLength(14);
        expect(tiers.map((tier) => tier.gib)).toEqual([
          4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32767,
        ]);
        for (const [index, tier] of tiers.entries()) {
          expect(tier.usdPerMonth, tier.name).toBeGreaterThan(0);
          expect(azureTierFor(tier.gib, tiers)).toBe(tier);
          /* One GiB over a tier takes the next one up, and the GiB paid above the disk are counted. */
          const next = tiers[index + 1];
          if (next) {
            const over = azureDiskCost({ provisionedGib: tier.gib + 1, usedGib: 0 }, tiers);
            assert.ok(!("error" in over));
            expect(over.tier).toBe(next.name);
            expect(over.roundUpGib).toBe(next.gib - tier.gib - 1);
            expect(over.usdPerMonth).toBe(next.usdPerMonth);
          }
        }
      }
    }
    for (const region of prices.aws.regions) {
      for (const type of ["gp3", "gp2"] as const) {
        expect(ebsPrice(prices, region, type), `${region} ${type}`).toBeGreaterThan(0);
      }
    }
  });

  it("rounds a size up to the next Azure tier and prices the space above the disk on its own", () => {
    const tiers = azureTiers(prices, "eastus", "standard-ssd");
    const result = azureDiskCost({ provisionedGib: 1000, usedGib: 400 }, tiers);
    assert.ok(!("error" in result));
    expect(result.tier).toBe("E30");
    expect(result.pricedGib).toBe(1024);
    expect(result.roundUpGib).toBe(24);
    close(result.roundUpUsdPerMonth ?? NaN, (76.8 * 24) / 1024);
    close(result.emptyUsdPerMonth, (76.8 * 600) / 1024);
    /* The empty space and the space above the disk never overlap: together they are the tier's unused GiB. */
    expect(result.emptyGib + (result.roundUpGib ?? 0)).toBe(1024 - 400);
  });

  it("clamps the empty space at 0, never below, and keeps the figures", () => {
    for (const usedGib of [200.5, 201, 10_000]) {
      const azure = azureDiskCost(
        { provisionedGib: 200, usedGib },
        azureTiers(prices, "westeurope", "premium-ssd"),
      );
      const ebs = ebsDiskCost(
        { provisionedGib: 200, usedGib },
        "gp2",
        ebsPrice(prices, "eu-west-1", "gp2"),
      );
      for (const result of [azure, ebs]) {
        assert.ok(!("error" in result));
        expect(result.emptyGib).toBe(0);
        expect(result.emptyShare).toBe(0);
        expect(result.emptyUsdPerMonth).toBe(0);
        expect(result.usedAboveSize).toBe(true);
        expect(result.usdPerMonth).toBeGreaterThan(0);
      }
    }
  });

  it("reads a blank field as no figure and 0 as 0", () => {
    const d4 = nodeSizes(prices, eni, "azure", "eastus").find(
      (s) => s.size.name === "Standard_D4s_v5",
    )!;
    expect(
      nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: parseNumberInput("") }),
    ).toEqual({
      error: "nodes-must-be-a-whole-number-from-1",
    });
    expect(
      nodeCost({ size: d4.size, usdPerHour: d4.usdPerHour, nodes: parseNumberInput("0") }),
    ).toEqual({
      error: "nodes-must-be-a-whole-number-from-1",
    });
    const tiers = azureTiers(prices, "eastus", "standard-ssd");
    expect(azureDiskCost({ provisionedGib: 200, usedGib: parseNumberInput("") }, tiers)).toEqual({
      error: "used-must-be-a-number-from-0",
    });
    const empty = azureDiskCost({ provisionedGib: 200, usedGib: parseNumberInput("0") }, tiers);
    assert.ok(!("error" in empty));
    expect(empty.emptyGib).toBe(200);
  });

  it("formats as the pages print: money to the cent, a unit price as listed, two places, one-place shares", () => {
    expect(usd(420.48)).toBe("$420.48");
    expect(usd(16)).toBe("$16.00");
    expect(usd(1040.64)).toBe("$1,040.64");
    expect(unitPrice(0.192)).toBe("$0.192");
    expect(unitPrice(0.0912)).toBe("$0.0912");
    expect(unitPrice(0.08)).toBe("$0.08");
    expect(amount(3.86)).toBe("3.86");
    expect(amount(16)).toBe("16");
    expect(amount(4.1000000000000005)).toBe("4.1");
    expect(amount(1024)).toBe("1,024");
    expect(share(0.965)).toBe("96.5%");
    expect(share(0.98)).toBe("98%");
    expect(share(11.9 / 16)).toBe("74.4%");
  });
});
