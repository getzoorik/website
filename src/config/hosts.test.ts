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

describe("an article that took over another's address", () => {
  it("301s the old autoscaler comparison to the article that replaced it", async () => {
    const response = await respond("https://zoorik.com/learn/coral-and-native-autoscalers");
    expect(response.status).toBe(301);
    expect(getRedirectUrl(response)).toBe(
      "https://zoorik.com/learn/hpa-vs-vpa-vs-cluster-autoscaler",
    );
  });
});

describe("the comparison pages' old addresses under /learn", () => {
  it("301 each live versus page and both alternatives pages to /compare", async () => {
    const moved = [
      ...versusPages.map((page) => [`/learn/compare/${page.slug}`, versusRoute(page)] as const),
      ...alternativesPages.map(
        (page) => [page.route.replace("/compare/", "/learn/"), page.route] as const,
      ),
    ];
    expect(moved).toHaveLength(4);
    for (const [from, to] of moved) {
      const response = await respond(`https://zoorik.com${from}`);
      expect(response.status, from).toBe(301);
      expect(getRedirectUrl(response), from).toBe(`https://zoorik.com${to}`);
    }
  });

  it("sends any other old versus address to /compare too, where an unknown slug answers 404", async () => {
    const response = await respond("https://zoorik.com/learn/compare/no-such-page");
    expect(response.status).toBe(301);
    expect(getRedirectUrl(response)).toBe("https://zoorik.com/compare/no-such-page");
  });
});
