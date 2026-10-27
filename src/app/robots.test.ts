import { describe, expect, it } from "vitest";

import robots, { namedCrawlers } from "./robots";

/** A crawler's view of a path: blocked when any disallow rule is a prefix of it. */
function blocked(path: string): boolean {
  const { rules } = robots();
  const list = Array.isArray(rules) ? rules : [rules];
  return list.some((rule) =>
    [rule.disallow ?? []].flat().some((prefix) => path.startsWith(prefix)),
  );
}

describe("robots.txt", () => {
  it("allows everything but the lead API and the assessment-script redirects, and names three AI crawlers", () => {
    expect(robots()).toEqual({
      rules: [
        {
          userAgent: ["GPTBot", "ClaudeBot", "CCBot"],
          allow: "/",
          disallow: ["/api/", "/assess/"],
        },
        { userAgent: "*", allow: "/", disallow: ["/api/", "/assess/"] },
      ],
      sitemap: "https://zoorik.com/sitemap.xml",
    });
  });

  it("gives GPTBot, ClaudeBot and CCBot exactly the rules everyone gets", () => {
    /* A named group replaces `*` for that crawler: a group without the
       disallows would open /api/ and /assess/ to it. */
    const { rules } = robots();
    const [named, everyone] = Array.isArray(rules) ? rules : [rules];
    expect(named!.userAgent).toEqual([...namedCrawlers]);
    expect({ ...named, userAgent: "*" }).toEqual(everyone);
  });

  it("never blocks a page, /login included: its noindex only works if it can be fetched", () => {
    for (const path of [
      "/",
      "/amoeba",
      "/coral",
      "/assessment",
      "/assessment?p=amoeba",
      "/login",
      "/docs",
      "/coral/guide",
      "/coral/faq",
      "/privacy",
      "/docs/coral-product-guide.pdf",
      "/docs/amoeba-product-guide.pdf",
    ]) {
      expect(blocked(path), path).toBe(false);
    }
  });

  it("leaves the static assets fetchable", () => {
    for (const path of ["/_next/static/chunks/main.js", "/icon.svg", "/hero-racks-graded.png"]) {
      expect(blocked(path), path).toBe(false);
    }
    expect(blocked("/assess/disks")).toBe(true);
    expect(blocked("/api/lead")).toBe(true);
  });
});
