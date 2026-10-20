import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { contactEmail, routes } from "@/config/site";
import { assessmentProducts } from "@/content/assessment";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/referrals" }));

import ReferralsRoute, { metadata } from "@/app/referrals/page";

/**
 * `/referrals`: the metadata, the hero, the pair (the program to come with the assessment's two commands to share,
 * and a ready email), How it will work as three cards joined by arrows, who to introduce, the Copy buttons; and no
 * terms of any kind, since the program has none. The sitemap entry is in `src/app/sitemap.test.ts`, the structured
 * data in `src/config/structured-data.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const main = () => render(<ReferralsRoute />).container.querySelector("main")!;
/** What a reader hears: the page's text without the drawings hidden from them. */
const words = (): string => {
  const copy = main().cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"], .sr-only')) hidden.remove();
  return text(copy);
};
const tiles = (section: Element) =>
  [...section.querySelectorAll("article.dt")].map((tile) => [
    text(tile.querySelector(".dt-t")),
    text(tile.querySelector(".dt-l")),
  ]);

/** The page's clipboard and whether it is a secure context, which jsdom leaves out. */
function allowCopying(clipboard: Pick<Clipboard, "writeText"> | undefined, secure: boolean): void {
  Object.defineProperty(window.navigator, "clipboard", { value: clipboard, configurable: true });
  Object.defineProperty(window, "isSecureContext", { value: secure, configurable: true });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("/referrals's metadata", () => {
  it("has the mock's title through the site's template, its description and its canonical", () => {
    expect(metadata.title).toBe("Referral program (coming soon)");
    expect(metadata.description).toBe(
      "Introduce a team that runs Kubernetes or block storage on Azure or AWS to Zoorik. The referral program is coming soon.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/referrals" });
    expect(metadata).not.toHaveProperty("robots");
  });
});

describe("/referrals", () => {
  it("opens on the utility hero: the h1 and one line", () => {
    const hero = main().querySelector(":scope > header.hero.doc-hero")!;
    expect(hero).toHaveAttribute("id", "top");
    expect(hero.querySelector(".zk-art")).not.toBeNull();
    expect(text(hero.querySelector("h1"))).toBe("Referral program");
    expect(text(hero.querySelector(".doc-deck"))).toBe(
      "Introduce a team that runs Kubernetes or block storage on Azure or AWS, and be rewarded when they become a customer.",
    );
    expect(hero.querySelector(".hero-cta, .pg-soon")).toBeNull();
  });

  it("lays out the mock's sections in its order, each at its address", () => {
    const m = main();
    const sections = [...m.querySelectorAll(":scope > section")];
    expect(sections.map((s) => s.className)).toEqual([
      "sec sec-band cp-pair",
      "sec cp-sec",
      "sec cp-sec",
    ]);
    expect(sections.slice(1).map((s) => s.id)).toEqual(["how", "who"]);
    expect(sections.slice(1).map((s) => text(s.querySelector(".sec-hrow h2")))).toEqual([
      "How it will work",
      "Who you could introduce",
    ]);
    /* The mock ends on the last tiles: no closing assessment row. */
    expect(m.querySelector("#assess, #contact")).toBeNull();
  });

  it("puts the program on the white card, with the assessment's two commands to share", () => {
    const card = main().querySelector(".cp-pair .as-grid > .as-card.as-mini.cp-w.rise")!;
    expect(text(card.querySelector(".cp-flag"))).toBe("Coming soon");
    expect(card.querySelector("svg.cp-own.cp-own-l")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector("h2.as-h"))).toBe("Introduce a team, be rewarded");
    expect(text(card.querySelector(":scope > p"))).toBe(
      "The terms will be on this page when the program opens. Until then, share the free assessment: one command, one PDF with their estimated saving.",
    );
    const lines = [...card.querySelectorAll(".cp-share > .cp-cmd")];
    expect(lines.map((line) => text(line.querySelector("code")))).toEqual([
      `$ ${assessmentProducts.coral.run}`,
      `$ ${assessmentProducts.amoeba.run}`,
    ]);
    for (const line of lines) {
      expect(line.querySelector("code")).toHaveAttribute("translate", "no");
      expect(line.querySelector("code > i")).toHaveAttribute("aria-hidden", "true");
    }
    const buttons = lines.map((line) => line.querySelector<HTMLButtonElement>("button.cp-copy")!);
    expect(buttons.map((button) => button.getAttribute("data-copy"))).toEqual([
      assessmentProducts.coral.run,
      assessmentProducts.amoeba.run,
    ]);
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
      assessmentProducts.coral.copy,
      assessmentProducts.amoeba.copy,
    ]);
    expect(buttons.map(text)).toEqual(["Copy", "Copy"]);
    const go = card.querySelector<HTMLAnchorElement>("a.btn-ink")!;
    expect(text(go)).toBe("See the free assessment");
    expect(go.getAttribute("href")).toBe(routes.assessment);
  });

  it("puts a ready email on the navy card", () => {
    const card = main().querySelector(".cp-pair .as-grid > .as-cal.cp-d.rise")!;
    expect(card).toHaveAttribute("data-i", "1");
    expect(card.querySelector("svg.cp-own")).toHaveAttribute("aria-hidden", "true");
    expect(text(card.querySelector("h2.as-h"))).toBe("Want to hear when it opens?");
    expect(text(card.querySelector("p"))).toBe("Write to us and we will tell you first.");
    const write = card.querySelector<HTMLAnchorElement>("a.cta-go")!;
    expect(text(write)).toBe("Write to us");
    expect(write.getAttribute("href")).toBe(`mailto:${contactEmail}?subject=Referral%20program`);
    expect(write).not.toHaveAttribute("target");
    expect(write.querySelector("svg.ext")).not.toBeNull();
  });

  it("draws How it will work as three cards joined by arrows, each naming who acts", () => {
    const list = main().querySelector("#how ol.cp-chain")!;
    const items = [...list.children];
    expect(items.map((item) => item.className)).toEqual(["", "cp-ar", "", "cp-ar", ""]);
    /* A list holds only items: the arrows are items hidden from assistive tech, so it reads as its three cards. */
    for (const arrow of list.querySelectorAll(":scope > li.cp-ar")) {
      expect(arrow).toHaveAttribute("aria-hidden", "true");
    }
    const cards = items.filter((item) => !item.classList.contains("cp-ar"));
    expect(
      cards.map((card) => [
        text(card.querySelector(".cp-who")),
        text(card.querySelector("h3")),
        text(card.querySelector("p")),
      ]),
    ).toEqual([
      ["You", "Introduce a team", "Send us their name, or share the free assessment with them."],
      [
        "Their team",
        "They see their number",
        "The free assessment shows their estimated saving at list price, in one PDF.",
      ],
      [
        "Zoorik",
        "You’re rewarded",
        "When they become a customer, on the terms this page will set out.",
      ],
    ]);
    expect(cards[2]!.querySelector('.cp-who [translate="no"]')).toHaveTextContent("Zoorik");
  });

  it("names six teams to introduce, each with its mark and its product, words alone", () => {
    const who = main().querySelector("#who")!;
    expect(who.querySelector(".dt-grid")).toHaveClass("cp-3");
    expect(tiles(who)).toEqual([
      ["Platform teams on AKS", "Coral"],
      ["Platform teams on Amazon EKS", "Coral"],
      ["Teams whose Azure managed disks keep growing", "Amoeba"],
      ["Teams with large Amazon EBS volumes", "Amoeba"],
      ["FinOps practitioners", "Coral and Amoeba"],
      ["SRE and DevOps leads", "Coral and Amoeba"],
    ]);
    expect(who.querySelectorAll("a")).toHaveLength(0);
    expect(who.querySelectorAll(".dt-ic.cp-ic")).toHaveLength(6);
  });
});

describe("/referrals's Copy buttons", () => {
  it("copy exactly the command, then say Copied with a tick for 1.6 s", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    allowCopying({ writeText }, true);
    const line = main().querySelectorAll(".cp-cmd")[1]!;
    const button = line.querySelector<HTMLButtonElement>("button.cp-copy")!;

    await act(async () => {
      fireEvent.click(button);
    });
    expect(writeText).toHaveBeenCalledWith(assessmentProducts.amoeba.run);
    expect(button).toHaveAttribute("data-done", "");
    expect(text(button)).toBe("Copied");
    expect(text(line.querySelector('[aria-live="polite"]'))).toBe("Copied");

    act(() => {
      vi.advanceTimersByTime(1599);
    });
    expect(text(button)).toBe("Copied");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(button).not.toHaveAttribute("data-done");
    expect(text(button)).toBe("Copy");
    allowCopying(undefined, false);
  });
});

describe("/referrals states no terms", () => {
  /* The program has no terms yet: no reward amount, commission, payout or figure of our own. */
  it("names no reward, commission or payout, and no amount beside the reward", () => {
    expect(words()).not.toMatch(
      /commission|payout|pay out|bounty|per referral|referral fee|\bbonus|credit|discount/i,
    );
    const reward = [...main().querySelectorAll("#how ol.cp-chain > li:not(.cp-ar)")][2]!;
    for (const line of [text(reward.querySelector("h3")), text(reward.querySelector("p"))]) {
      expect(line).not.toMatch(/\d|\$|%|€|£|₹/);
    }
  });

  it("prints no figure at all", () => {
    expect(words().match(/[−-]?\$?\d[\d.,]*%?/g)).toBeNull();
  });

  it("keeps to the house words", () => {
    expect(words()).not.toMatch(/\bcut\b|\blower\b|\bwaste/i);
  });
});
