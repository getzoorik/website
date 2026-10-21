import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { routes } from "@/config/site";
import { communityLastUpdated, communityPage } from "@/content/community";
import { designPartnerPlaces } from "@/content/design-partners";
import { socialProfiles } from "@/content/footer";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/community" }));

import CommunityRoute, { metadata } from "@/app/community/page";

/**
 * `/community`, Zoorik Community: the metadata, the hero with its deck, our own two (r/zoorik and Zoorik News on
 * Medium), the communities in their four groups with their logos, More from Zoorik and the closing row. Its sitemap
 * entry is in `src/app/sitemap.test.ts`, its page graph in `src/config/structured-data.test.ts`, and that it names no
 * competitor in `src/features/learn/market-names.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

const page = () => render(<CommunityRoute />).container;

const profile = (platform: string) => socialProfiles.find((p) => p.platform === platform)!.href;

/** An off-site link the site's way: a new tab, no opener, and the hidden hint. */
function expectOffSite(link: Element, href: string) {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(text(link.querySelector(".sr-only"))).toBe("(opens in a new tab)");
}

describe("/community's metadata", () => {
  it("has its title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Community");
    expect(metadata.description).toBe(
      "The communities that matter for FinOps and cloud cost on Kubernetes, Azure and AWS, with r/zoorik and Zoorik News on Medium.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/community" });
    expect(metadata.openGraph).toMatchObject({
      url: "/community",
      title: "Zoorik | Community",
    });
    expect(communityLastUpdated).toBe("21 October 2026");
  });
});

describe("/community", () => {
  it("opens on its name and its deck, then our two, the communities, More from Zoorik and the closing row", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero h1"))).toBe("Zoorik Community");
    expect(root.querySelector("header.hero h1 [translate='no']")).toHaveTextContent("Zoorik");
    expect(text(root.querySelector("header.hero .doc-deck"))).toBe(communityPage.hero.deck);
    expect(root.querySelectorAll("header.hero .doc-deck [translate='no']")).toHaveLength(2);
    expect([...root.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
      "ours",
      "communities",
      "more",
      "assess",
    ]);
  });

  it("draws r/zoorik on the white card and Zoorik News on Medium on the navy one, on the band", () => {
    const section = page().querySelector("main > section#ours")!;
    expect(section).toHaveClass("sec", "sec-band");
    expect(section).toHaveAttribute("aria-label", "Zoorik on Reddit and Medium");
    const [reddit, news] = [...section.querySelectorAll(".as-grid > div")];
    expect(reddit).toHaveClass("as-card", "as-mini");
    expect(news).toHaveClass("as-cal");
    expect(reddit!.querySelector("svg.cm-own")).toHaveAttribute("data-mark", "reddit");
    expect(news!.querySelector("svg.cm-own")).toHaveAttribute("data-mark", "medium");
    expect(text(reddit!.querySelector("h2.as-h"))).toBe("r/zoorik");
    expect(text(reddit!.querySelector("p"))).toBe(
      "Our community on Reddit. Ask about Coral and Amoeba, share your results and talk to the people who build them.",
    );
    expect(
      [...reddit!.querySelectorAll("p [translate='no']")].map((span) => span.textContent),
    ).toEqual(["Coral", "Amoeba"]);
    const join = reddit!.querySelector("a.btn-ink")!;
    expect(text(join)).toBe("Join r/zoorik (opens in a new tab)");
    expectOffSite(join, profile("reddit"));
    expect(text(news!.querySelector("h2.as-h"))).toBe("Zoorik News");
    expect(text(news!.querySelector("p"))).toBe(
      "Our newsletter on Medium: what we ship, and each week’s Zoorik Radar, by email.",
    );
    const subscribe = news!.querySelector("a.cta-go")!;
    expect(text(subscribe)).toBe("Subscribe on Medium (opens in a new tab)");
    expectOffSite(subscribe, profile("medium"));
    expect(subscribe.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
  });

  it("lists three communities in each of four groups, each its own page in a new tab with its own logo", () => {
    const section = page().querySelector("main > section#communities")!;
    expect(text(section.querySelector(".sec-hrow h2"))).toBe("FinOps and cloud cost communities");
    const groups = [...section.querySelectorAll(":scope > .wrap > .cm-sub")];
    expect(groups.map((group) => text(group.querySelector("h3.cm-sl")))).toEqual([
      "FinOps",
      "Kubernetes",
      "Azure",
      "AWS",
    ]);
    groups.forEach((group, g) => {
      const content = communityPage.communities.groups[g]!.communities;
      const tiles = [...group.querySelectorAll(".dt-grid > article.dt > a.dt-a")];
      expect(tiles).toHaveLength(3);
      tiles.forEach((tile, t) => {
        const community = content[t]!;
        expect(text(tile.querySelector(".dt-t"))).toBe(community.name);
        expect(text(tile.querySelector(".dt-l"))).toBe(community.what);
        expectOffSite(tile, community.href);
        expect(tile.querySelector("svg.dt-go")).toHaveAttribute("aria-hidden", "true");
        const logo = tile.querySelector(".dt-ic.cm-logo")!;
        if (logo.tagName === "IMG") {
          expect(logo).toHaveAttribute("src", `/community-logos/${community.logo}.svg`);
          expect(logo).toHaveAttribute("alt", "");
        } else {
          expect(logo).toHaveAttribute("data-mark", community.logo);
          expect(logo).toHaveAttribute("aria-hidden", "true");
        }
      });
    });
    const note = section.querySelector("p.cm-note")!;
    expect(text(note)).toBe(
      "Checked on each community’s own page, 20 October 2026. Something missing? Write to founders@zoorik.com.",
    );
    expect(note.querySelector("a")).toHaveAttribute("href", "mailto:founders@zoorik.com");
  });

  it("ends on More from Zoorik: /events and /design-partners, in this tab", () => {
    const section = page().querySelector("main > section#more")!;
    expect(text(section.querySelector(".sec-hrow h2"))).toBe("More from Zoorik");
    const tiles = [...section.querySelectorAll(".dt-grid.dt-2x2 a.dt-a")];
    expect(
      tiles.map((a) => [
        a.getAttribute("href"),
        text(a.querySelector(".dt-t")),
        text(a.querySelector(".dt-l")),
      ]),
    ).toEqual([
      [
        routes.events,
        "Events",
        "The conferences and meetups on cloud cost, Kubernetes and FinOps.",
      ],
      [
        routes.designPartners,
        "Design partners",
        `The first ${designPartnerPlaces} run Coral and Amoeba free on non-production infrastructure.`,
      ],
    ]);
    for (const a of tiles) expect(a).not.toHaveAttribute("target");
  });
});
