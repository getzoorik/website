// @vitest-environment node
import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { alternativesPages, versusPages, versusRoute } from "@/content/learn-compare";

import nextConfig from "../../next.config";

const respond = (url: string) => unstable_getResponseFromNextConfig({ url, nextConfig });

describe("the alias hosts, www.zoorik.com included", () => {
  it("308 to the apex with the path and query kept", async () => {
    for (const host of [
      "www.zoorik.com",
      "zoorik.in",
      "www.zoorik.net",
      "zoorick.com",
      "www.zoorick.com",
    ]) {
      const root = await respond(`https://${host}/`);
      expect(root.status, host).toBe(308);
      expect(getRedirectUrl(root)).toBe("https://zoorik.com/");
      const deep = await respond(`https://${host}/assessment?p=coral`);
      expect(deep.status, host).toBe(308);
      expect(getRedirectUrl(deep)).toBe("https://zoorik.com/assessment?p=coral");
    }
  });

  it("leaves the apex alone", async () => {
    expect((await respond("https://zoorik.com/assessment")).status).toBe(200);
  });

  it("only ever uses the two rule shapes OpenNext substitutes correctly", async () => {
    /* The host rules: the ones with a `has`. The /resources moves below are
       literal; the /compare move substitutes one never-empty `:slug` (OpenNext
       compiles the destination whenever the match holds a parameter, and only an
       empty match, as `:path*` at the root, comes out literally). */
    const rules = ((await nextConfig.redirects?.()) ?? []).filter((rule) => rule.has);
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) expect(["/", "/:path+"]).toContain(rule.source);
  });
});

describe("the Docs hub's old address", () => {
  it("308s /resources to /docs, the hub's address since the relaunch", async () => {
    const hub = await respond("https://zoorik.com/resources");
    expect(hub.status).toBe(308);
    expect(getRedirectUrl(hub)).toBe("https://zoorik.com/docs");
  });

  it("308s each PDF that moved to its new address, file for file", async () => {
    for (const file of ["coral-product-guide.pdf", "coral-faq.pdf", "coral-one-pager.pdf"]) {
      const pdf = await respond(`https://zoorik.com/resources/${file}`);
      expect(pdf.status, file).toBe(308);
      expect(getRedirectUrl(pdf)).toBe(`https://zoorik.com/docs/${file}`);
    }
  });

  it("moves nothing else under /resources: an address that never moved is not sent to /docs", async () => {
    expect((await respond("https://zoorik.com/resources/any-other.pdf")).status).toBe(200);
  });

  it("names its paths literally, with no parameter for OpenNext to substitute", async () => {
    const rules = ((await nextConfig.redirects?.()) ?? []).filter(
      (rule) => !rule.has && rule.source.startsWith("/resources"),
    );
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.source, rule.source).not.toMatch(/[:*(]/);
      expect(rule.destination, rule.source).toMatch(/^\/docs(\/[a-z-]+\.pdf)?$/);
      expect(rule.permanent, rule.source).toBe(true);
    }
  });

  it("reaches an alias host's old address through the apex", async () => {
    const alias = await respond("https://www.zoorik.com/resources");
    expect(alias.status).toBe(308);
    expect(getRedirectUrl(alias)).toBe("https://zoorik.com/resources");
  });
});

/** Each old address, and the page it now 301s to. */
async function expectMoved(moves: readonly (readonly [string, string])[]) {
  for (const [from, to] of moves) {
    const old = await respond(`https://zoorik.com${from}`);
    expect(old.status, from).toBe(301);
    expect(getRedirectUrl(old), from).toBe(`https://zoorik.com${to}`);
    expect((await respond(`https://zoorik.com${to}`)).status, to).toBe(200);
  }
}

describe("the case studies' old addresses", () => {
  it("301s /case-studies to Value Lab, which stays where it is, and each study's old address straight to its own at the root", async () => {
    await expectMoved([
      ["/case-studies", "/value-lab"],
      ["/case-studies/coral-dev-cluster", "/coral-value-lab"],
      ["/value-lab/coral-dev-cluster", "/coral-value-lab"],
      ["/value-lab/amoeba-lab-vms", "/amoeba-value-lab"],
    ]);
  });

  it("moves no other address under /case-studies or /value-lab", async () => {
    expect((await respond("https://zoorik.com/case-studies/no-such-study")).status).toBe(200);
    expect((await respond("https://zoorik.com/value-lab/no-such-study")).status).toBe(200);
  });
});

describe("the troubleshooting pages' old addresses under /docs", () => {
  it("301s each of the four old pages to its product's troubleshooting page", async () => {
    await expectMoved([
      ["/docs/coral-not-connecting-to-cluster", "/coral-troubleshooting"],
      ["/docs/coral-not-removing-nodes", "/coral-troubleshooting"],
      ["/docs/amoeba-not-showing-my-vm", "/amoeba-troubleshooting"],
      ["/docs/amoeba-not-rightsizing-disks", "/amoeba-troubleshooting"],
    ]);
  });
});

describe("the guides' and FAQs' old addresses under each product", () => {
  it("301s each product's guide and FAQ to its own address at the root, keeping the product page where it is", async () => {
    await expectMoved([
      ["/coral/guide", "/coral-guide"],
      ["/coral/faq", "/coral-faq"],
      ["/amoeba/guide", "/amoeba-guide"],
      ["/amoeba/faq", "/amoeba-faq"],
    ]);
    expect((await respond("https://zoorik.com/coral")).status).toBe(200);
    expect((await respond("https://zoorik.com/amoeba")).status).toBe(200);
  });
});

describe("the research papers' first address", () => {
  it("301s /research-cloud-cost-optimization to /cloud-cost-optimization-research-papers", async () => {
    await expectMoved([
      ["/research-cloud-cost-optimization", "/cloud-cost-optimization-research-papers"],
    ]);
  });
});

describe("every moved page", () => {
  it("is reached in one hop: no redirect lands on another redirect", async () => {
    /* The literal moves; a rule with a parameter is checked by its own describe above. */
    const rules = ((await nextConfig.redirects?.()) ?? []).filter(
      (rule) => !rule.has && !/[:*(]/.test(rule.destination),
    );
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      const landing = await respond(`https://zoorik.com${rule.destination}`);
      expect(landing.status, `${rule.source} → ${rule.destination}`).toBe(200);
    }
  });
});

describe("the comparison pages' old addresses under /compare", () => {
  it("301s /compare to Cloud cost optimization tools, and each page under it to the same page under the hub", async () => {
    const hub = await respond("https://zoorik.com/compare");
    expect(hub.status).toBe(301);
    expect(getRedirectUrl(hub)).toBe("https://zoorik.com/cloud-cost-optimization-library");
    const pages = [...versusPages.map(versusRoute), ...alternativesPages.map((page) => page.route)];
    expect(pages).toHaveLength(4);
    for (const path of pages) {
      expect(path.startsWith("/cloud-cost-optimization-library/"), path).toBe(true);
      const old = await respond(
        `https://zoorik.com${path.replace("/cloud-cost-optimization-library/", "/compare/")}`,
      );
      expect(old.status, path).toBe(301);
      expect(getRedirectUrl(old), path).toBe(`https://zoorik.com${path}`);
      const page = await respond(`https://zoorik.com${path}`);
      expect(page.status, path).not.toBe(301);
    }
  });
});

describe("the comparison pages' older addresses under /learn", () => {
  it("301 each live versus page and both alternatives pages straight to their pages under the hub", async () => {
    const moved = [
      ...versusPages.map((page) => [`/learn/compare/${page.slug}`, versusRoute(page)] as const),
      ...alternativesPages.map(
        (page) =>
          [page.route.replace("/cloud-cost-optimization-library/", "/learn/"), page.route] as const,
      ),
    ];
    expect(moved).toHaveLength(4);
    for (const [from, to] of moved) {
      const response = await respond(`https://zoorik.com${from}`);
      expect(response.status, from).toBe(301);
      expect(getRedirectUrl(response), from).toBe(`https://zoorik.com${to}`);
    }
  });

  it("sends any other old versus address under the hub too, where an unknown slug answers 404", async () => {
    const response = await respond("https://zoorik.com/learn/compare/no-such-page");
    expect(response.status).toBe(301);
    expect(getRedirectUrl(response)).toBe(
      "https://zoorik.com/cloud-cost-optimization-library/no-such-page",
    );
  });
});

describe("the retired autoscalers article", () => {
  it("301s /learn/coral-and-native-autoscalers to HPA vs VPA vs Cluster Autoscaler, which is no redirect itself", async () => {
    const old = await respond("https://zoorik.com/learn/coral-and-native-autoscalers");
    expect(old.status).toBe(301);
    expect(getRedirectUrl(old)).toBe("https://zoorik.com/learn/hpa-vs-vpa-vs-cluster-autoscaler");
    const article = await respond("https://zoorik.com/learn/hpa-vs-vpa-vs-cluster-autoscaler");
    expect(article.status).not.toBe(301);
  });
});

describe("Cloud cost optimization tools' old address", () => {
  it("301s /cloud-cost-optimization-tools and each page under it to the same page under /cloud-cost-optimization-library", async () => {
    const hub = await respond("https://zoorik.com/cloud-cost-optimization-tools");
    expect(hub.status).toBe(301);
    expect(getRedirectUrl(hub)).toBe("https://zoorik.com/cloud-cost-optimization-library");
    for (const path of [
      ...alternativesPages.map((page) => page.route),
      ...versusPages.map(versusRoute),
    ]) {
      const old = await respond(
        `https://zoorik.com${path.replace("/cloud-cost-optimization-library/", "/cloud-cost-optimization-tools/")}`,
      );
      expect(old.status, path).toBe(301);
      expect(getRedirectUrl(old), path).toBe(`https://zoorik.com${path}`);
    }
    const library = await respond("https://zoorik.com/cloud-cost-optimization-library");
    expect(library.status).not.toBe(301);
  });
});
