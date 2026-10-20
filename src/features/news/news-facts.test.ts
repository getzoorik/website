import { describe, expect, it } from "vitest";

import { newsDay, newsShortDay, radarMark } from "./news-facts";

/** What /news prints about a date, and the logo a Radar item draws. */
describe("/news's dates", () => {
  it("prints a full day for the latest announcement and the week, and a short one on a tile", () => {
    expect(newsDay("2026-10-19")).toBe("19 October 2026");
    expect(newsShortDay("2026-10-06")).toBe("6 Oct");
    expect(newsShortDay("2026-09-30")).toBe("30 Sep");
  });
});

describe("a Radar item's logo", () => {
  const mark = (source: string, url: `https://${string}`) => radarMark({ source, url });

  it("is Karpenter's for any Karpenter project, an Azure provider's too", () => {
    expect(
      mark(
        "GitHub: Azure/karpenter-provider-azure (merged PR)",
        "https://github.com/Azure/karpenter-provider-azure/pull/2002",
      ),
    ).toEqual({ logo: "karpenter" });
  });

  it("is the FinOps Foundation's for the Foundation and for FOCUS", () => {
    expect(mark("FinOps Foundation", "https://www.finops.org/insights/x/")).toEqual({
      logo: "finops-foundation",
    });
    expect(
      mark("FOCUS specification (GitHub)", "https://github.com/FinOps-Open-Cost-and-Usage-Spec/x"),
    ).toEqual({ logo: "finops-foundation" });
  });

  it("is the cloud's mark for AWS and Azure sources, read from the name or the address", () => {
    expect(mark("AWS: Amazon EKS pricing", "https://aws.amazon.com/eks/pricing/")).toEqual({
      logo: "aws",
    });
    expect(
      mark("GitHub: awslabs/amazon-eks-ami releases", "https://github.com/awslabs/amazon-eks-ami"),
    ).toEqual({ logo: "aws" });
    expect(
      mark("AKS Engineering Blog", "https://blog.aks.azure.com/2026/10/14/standardv2-nat-gateway"),
    ).toEqual({ logo: "azure" });
    expect(
      mark(
        "GitHub: kubernetes-sigs/azuredisk-csi-driver releases",
        "https://github.com/kubernetes-sigs/azuredisk-csi-driver",
      ),
    ).toEqual({ logo: "azure" });
  });

  it("is a monogram otherwise, the source's first letter with any 'The ' left out", () => {
    expect(mark("The New Stack", "https://thenewstack.io/gpus-on-kubernetes/")).toEqual({
      monogram: "N",
    });
    expect(mark("Kubernetes Blog", "https://kubernetes.io/blog/x/")).toEqual({ monogram: "K" });
  });
});
