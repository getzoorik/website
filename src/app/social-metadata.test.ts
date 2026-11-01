import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import { cardFor, pageCards, socialImage, xHandle } from "@/config/social";
import { articleCard, learnArticles } from "@/content/learn/published";
import { footerSocialLinks } from "@/content/footer";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-inter", className: "font-inter" }),
  IBM_Plex_Mono: () => ({ variable: "font-plex-mono", className: "font-plex-mono" }),
}));

const { metadata: layout } = await import("./layout");
const pages = {
  "/": (await import("./page")).metadata,
  "/assessment": (await import("./assessment/page")).metadata,
  "/login": (await import("./login/page")).metadata,
  "/amoeba": (await import("./amoeba/page")).metadata,
  "/coral": (await import("./coral/page")).metadata,
};

describe("social cards", () => {
  it("keeps the layout's card free of anything one page owns", () => {
    expect(layout.openGraph).not.toHaveProperty("url");
    expect(layout.openGraph).not.toHaveProperty("title");
    expect(layout.openGraph).not.toHaveProperty("description");
  });

  it("gives every page its own og:url, title and description, on the shared base", () => {
    for (const [path, page] of Object.entries(pages)) {
      const og = page.openGraph as Record<string, unknown>;
      /* the home page draws its og:url itself, with the slash (page.test.tsx) */
      expect(og.url, path).toBe(path === "/" ? undefined : path);
      expect(og.title, path).toBeTruthy();
      expect(og.description, path).toBeTruthy();
      expect(og.siteName, path).toBe("Zoorik");
    }
  });

  it("cards the home page with its title and its description", () => {
    /* The card repeats the page's head. */
    const home = pages["/"].openGraph as Record<string, unknown>;
    expect(home.title).toBe("Zoorik | Kubernetes and block storage cost optimization");
    expect(home.description).toBe(pages["/"].description);
  });

  it("cards each product page with its full title and its description", () => {
    const amoeba = pages["/amoeba"].openGraph as Record<string, unknown>;
    const coral = pages["/coral"].openGraph as Record<string, unknown>;
    expect(amoeba.title).toBe("Block storage cost optimization for Azure and AWS | Zoorik");
    expect(amoeba.description).toBe(
      "Amoeba rightsizes Azure managed disks and Amazon EBS volumes to the data you store, to reduce your cloud cost, autonomously, without any downtime.",
    );
    expect(coral.title).toBe("Coral: Kubernetes optimization for AKS and EKS | Zoorik");
    expect(coral.description).toBe(
      "Coral rebalances AKS and EKS clusters to reduce your cloud cost, autonomously, without any downtime. Works with HPA, Karpenter, NAP and Cluster Autoscaler.",
    );
    /* No page of its own: the X card is the layout's, filled from openGraph. */
    expect(pages["/amoeba"]).not.toHaveProperty("twitter");
    expect(pages["/coral"]).not.toHaveProperty("twitter");
  });

  it("ships every card at the size platforms ask for", () => {
    /* The articles' own cards with the rest. */
    for (const image of [
      socialImage,
      ...Object.values(pageCards),
      ...learnArticles.map(articleCard),
    ]) {
      const png = readFileSync(`public${image.url}`);
      expect(png.subarray(1, 4).toString("latin1"), image.url).toBe("PNG");
      expect(png.readUInt32BE(16), image.url).toBe(1200);
      expect(png.readUInt32BE(20), image.url).toBe(630);
      /* the size of a card platforms fetch quickly */
      expect(png.length, image.url).toBeLessThan(200 * 1024);
      expect(image.alt, image.url).toBeTruthy();
    }
  });

  it("gives every page in the sitemap its own card but the home page, which shows the brand card", async () => {
    const { default: sitemap } = await import("./sitemap");
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);
    expect(paths.filter((path) => path !== "/" && !pageCards[path])).toEqual([]);
    expect(cardFor("/")).toBe(socialImage);
    /* An article drawn no card of its own yet shows the /learn card. */
    expect(cardFor("/learn/no-card-yet")).toBe(pageCards["/learn"]);
    for (const [path, card] of Object.entries(pageCards)) {
      expect(card.url, path).toMatch(/^\/og\/pages\/[a-z0-9-]+\.png$/);
      expect(card.alt, path).toMatch(/^Zoorik\. .+[.?!]$/);
    }
  });

  it("puts a page's own card on it, and the brand card on the home page", () => {
    /* A new card, a new name: platforms cache cards by URL. */
    expect(socialImage.url).toBe("/og/zoorik-reduce-cloud-cost-autonomously-1200x630.png");
    expect(socialImage.alt).toBe("Zoorik. Reduce cloud cost, autonomously.");
    const cardOf: Record<keyof typeof pages, unknown> = {
      "/": socialImage,
      "/assessment": pageCards["/assessment"],
      "/login": pageCards["/login"],
      "/amoeba": pageCards["/amoeba"],
      "/coral": pageCards["/coral"],
    };
    expect((layout.openGraph as Record<string, unknown>).images).toEqual([socialImage]);
    for (const [path, page] of Object.entries(pages)) {
      expect((page.openGraph as Record<string, unknown>).images, path).toEqual([
        cardOf[path as keyof typeof pages],
      ]);
    }
    expect(layout.twitter).toEqual({
      card: "summary_large_image",
      site: xHandle,
      creator: xHandle,
    });
    expect(xHandle).toBe("@getzoorik");
  });

  it("names the X account the footer links to", () => {
    const x = footerSocialLinks.find((link) => link.platform === "x");
    expect(x?.href).toBe(`https://x.com/${xHandle.slice(1)}`);
  });
});
