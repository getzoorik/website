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

describe("the case studies' hub's old address", () => {
  it("301s /case-studies to Value Lab, and each study's old address to its own under Value Lab", async () => {
    const hub = await respond("https://zoorik.com/case-studies");
    expect(hub.status).toBe(301);
    expect(getRedirectUrl(hub)).toBe("https://zoorik.com/value-lab");
    const old = await respond("https://zoorik.com/case-studies/coral-dev-cluster");
    expect(old.status).toBe(301);
    expect(getRedirectUrl(old)).toBe("https://zoorik.com/value-lab/coral-dev-cluster");
    const study = await respond("https://zoorik.com/value-lab/coral-dev-cluster");
    expect(study.status).not.toBe(301);
  });
});

describe("the comparison pages' old addresses under /compare", () => {
  it("301s /compare to Cloud cost optimization tools, and each page under it to the same page under the hub", async () => {
    const hub = await respond("https://zoorik.com/compare");
    expect(hub.status).toBe(301);
    expect(getRedirectUrl(hub)).toBe("https://zoorik.com/cloud-cost-optimization-tools");
    const pages = [...versusPages.map(versusRoute), ...alternativesPages.map((page) => page.route)];
    expect(pages).toHaveLength(4);
    for (const path of pages) {
      expect(path.startsWith("/cloud-cost-optimization-tools/"), path).toBe(true);
      const old = await respond(
        `https://zoorik.com${path.replace("/cloud-cost-optimization-tools/", "/compare/")}`,
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
          [page.route.replace("/cloud-cost-optimization-tools/", "/learn/"), page.route] as const,
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
      "https://zoorik.com/cloud-cost-optimization-tools/no-such-page",
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
