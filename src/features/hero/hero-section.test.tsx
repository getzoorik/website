import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { marketplaces } from "@/config/marketplaces";
import { site } from "@/config/site";
import { heroFilmGrounds } from "@/features/hero-film/hero-films";

import { HeroSection } from "./hero-section";

/**
 * The home hero: five things over the Gargantua film, in the mock's order
 * (owner, 23 Oct 2026).
 */
let hero: HTMLElement;

beforeEach(() => {
  /* jsdom implements no film playback, and the film plays itself. */
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  hero = render(<HeroSection />).container.querySelector<HTMLElement>("header.hero")!;
  return () => vi.restoreAllMocks();
});

describe("the home hero", () => {
  it("is the film, then the words, in the one-screen home hero", () => {
    expect(hero).toHaveClass("hero", "hero-home");
    expect(hero).toHaveAttribute("id", "top");
    expect([...hero.children].map((el) => `${el.tagName.toLowerCase()}.${el.className}`)).toEqual([
      "video.hero-film",
      "div.wrap hero-in",
    ]);
  });

  it("fills itself with the Gargantua film on its own sky, silent and hidden from the ear", () => {
    const film = hero.querySelector("video")!;
    expect(film.getAttribute("poster")).toMatch(
      /^https:\/\/media\.zoorik\.com\/hero-films\/hero-gargantua-poster-\d+\.jpg$/,
    );
    expect(film.style.backgroundColor).toBe("rgb(8, 0, 20)");
    expect(heroFilmGrounds.gargantua).toBe("#080014");
    expect(film).toHaveAttribute("aria-hidden", "true");
    expect(film).toHaveAttribute("tabindex", "-1");
    expect(film.muted).toBe(true);
    /* Never the photo's class: its scaleX(-1) would mirror the film. */
    expect(film).not.toHaveClass("hero-photo");
  });

  it("holds six things only, in order: the name, the h1, the line, the company, one button, the stores", () => {
    const words = hero.querySelector(".hero-in")!;
    expect([...words.children].map((el) => `${el.tagName.toLowerCase()}.${el.className}`)).toEqual([
      "h1.",
      "p.hero-sub",
      "p.hero-co",
      "div.hero-cta",
      "p.hx-mkt",
    ]);
    /* The company sentence, in the Organization's words, its three names kept out of translation. */
    const company = words.querySelector("p.hero-co")!;
    expect(company.textContent).toBe(
      "Zoorik is a cloud cost optimization company. Coral reduces Kubernetes cost on AKS and EKS, and Amoeba reduces block storage cost on Azure and AWS, without any downtime.",
    );
    expect(company.textContent).toBe(site.description);
    expect([...company.querySelectorAll("[translate='no']")].map((el) => el.textContent)).toEqual([
      "Zoorik",
      "Coral",
      "Amoeba",
    ]);
    expect(words.querySelector("h1 > .hero-name:first-child")).toHaveTextContent("Zoorik");
    expect(words.querySelector("h1")!.textContent).toBe("Zoorik Reduce cloud cost, autonomously.");
    expect(words.querySelectorAll(".hero-cta a")).toHaveLength(1);
    expect(words.querySelector(".hero-cta a")).toHaveAttribute("href", "/assessment");
    /* No lockups, no figures, no mark, no second button. */
    expect(hero.querySelector(".hero-prods, .hp, .zk-art, .btn-ink, img")).toBeNull();
  });

  it("names where to buy both products, each store with its cloud's mark, in a new tab", () => {
    const line = hero.querySelector("p.hx-mkt")!;
    expect(line.textContent).toBe(
      "Coral and Amoeba are available in AWS Marketplace (opens in a new tab) and Microsoft Marketplace (opens in a new tab)",
    );
    expect(
      [...line.querySelectorAll(":scope > [translate='no']")].map((el) => el.textContent),
    ).toEqual(["Coral", "Amoeba"]);
    const links = [...line.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(marketplaces.map((m) => m.catalogue));
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      expect(a.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
      /* The mark leads the name; the mock draws no arrow after it. */
      expect(a.firstElementChild!.tagName.toLowerCase()).toBe("svg");
      expect(a.firstElementChild).toHaveAttribute("aria-hidden", "true");
      expect(a.querySelector(".ext")).toBeNull();
    }
    expect(links.map((a) => a.firstElementChild!.getAttribute("data-mark"))).toEqual([
      "aws",
      "azure",
    ]);
    expect(links[0]!.firstElementChild).toHaveClass("aws");
  });

  it("is one screen tall, under a scrim in the film's sky, the bar's strip in it on this page alone", () => {
    const sheet = readFileSync("src/styles/hero.css", "utf8");
    expect(sheet).toContain(
      ".hero-home{display:grid;align-content:center;min-height:100vh;min-height:100svh}",
    );
    expect(sheet).toContain(".hero.hero-home{background:#080014}");
    expect(sheet).toMatch(
      /\.hero\.hero-home::after\{background:\n {2}radial-gradient\(70% 60% at 14% 74%,/,
    );
    /* The bar is not inside the hero: the strip is found by the page's hero, so no other page takes it. */
    expect(sheet).toContain(
      ":root:has(.hero-home) .nav:not(.solid)::before{background:linear-gradient(180deg,#080014 0,#080014 66px,rgba(8,0,20,.55) 74px,rgba(8,0,20,0) 84px)}",
    );
    expect(sheet).not.toMatch(/(^|\})\s*\.nav:not\(\.solid\)::before/);
    /* The film drawn at 112%, grown from the hero's bottom right corner; at 1080 and below the frame keeps the ring. */
    expect(sheet).toContain(
      ".hero-home .hero-film{object-position:80% 50%;transform:scale(1.12);transform-origin:100% 100%}",
    );
    const narrow = sheet.slice(sheet.lastIndexOf("@media(max-width:1080px){"));
    expect(narrow).toContain(".hero-home .hero-film{object-position:80% 50%}");
    expect(narrow).toContain(
      ".hero.hero-home::after{background:linear-gradient(180deg,#080014 0,#080014 84px,",
    );
  });

  it("makes no claim it cannot source", () => {
    expect(hero.textContent).not.toMatch(/\d+\s?%|\b0s\b/);
  });
});
