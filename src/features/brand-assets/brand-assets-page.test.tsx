import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { contactEmail } from "@/config/site";
import { pageStructuredData } from "@/config/structured-data";
import { brandAssetsPage, brandCompanyLine, brandTagline } from "@/content/brand-assets";
import { heroContent } from "@/content/hero";
import { formatKitSize } from "@/features/brand-assets/brand-kit-facts";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/brand-assets" }));
/* The photograph under "Don't place it on photographs" is the mock's own frame, imported as Next imports it. */
vi.mock("@/features/brand-assets/hero-racks.webp", () => ({
  default: { src: "/_next/static/media/hero-racks.webp", width: 1200, height: 1200 },
}));

import BrandAssetsRoute, { metadata } from "@/app/brand-assets/page";

/**
 * `/brand-assets`: the metadata, the hero and the kit's ZIP with its
 * size read from the file, the six sections in the mock's order, every download a file the site serves, the colours
 * and their figures proved from the hex values, the clear space and sizes, the six Don'ts, the words each Copy button
 * copies, and the button's 1.6 s "Copied". Its sitemap entry is in `src/app/sitemap.test.ts`, its structured data in
 * `src/config/structured-data.test.ts`, its sheet's scope in `brand-assets-css.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const main = () => render(<BrandAssetsRoute />).container.querySelector("main")!;
const servedFile = (href: string) => join(process.cwd(), "public", href);

/** WCAG 2 contrast of two "#RRGGBB" colours, to one decimal as the page prints it. */
function contrast(a: string, b: string): string {
  const luminance = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi! + 0.05) / (lo! + 0.05)).toFixed(1);
}

/** The page's clipboard and whether it is a secure context, which jsdom leaves out. */
function allowCopying(clipboard: Pick<Clipboard, "writeText"> | undefined, secure: boolean): void {
  Object.defineProperty(window.navigator, "clipboard", { value: clipboard, configurable: true });
  Object.defineProperty(window, "isSecureContext", { value: secure, configurable: true });
}

afterEach(() => {
  vi.useRealTimers();
  allowCopying(undefined, false);
});

describe("/brand-assets's metadata", () => {
  it("has the mock's title through the template, its description and its canonical", () => {
    expect(metadata.title).toBe("Brand assets");
    expect(metadata.description).toBe(
      "Download the Zoorik logo, mark and brand kit, with the colours, the tagline and the rules for using them.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/brand-assets" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/brand-assets",
      title: "Brand assets | Zoorik",
    });
  });
});

describe("/brand-assets's structured data", () => {
  it("is one block, the page's graph, its page named by the printed title", () => {
    const { container } = render(<BrandAssetsRoute />);
    const blocks = container.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    const data = JSON.parse(blocks[0]!.textContent!);
    expect(data).toEqual(JSON.parse(JSON.stringify(pageStructuredData("/brand-assets"))));
    expect(data["@graph"][2]).toMatchObject({
      url: "https://zoorik.com/brand-assets",
      name: "Brand assets | Zoorik",
      description: metadata.description,
      about: { "@id": "https://zoorik.com/#organization" },
    });
  });
});

describe("/brand-assets", () => {
  it("opens on the utility hero: the turning mark, the h1, the line and the two buttons", () => {
    const hero = main().querySelector(":scope > header.hero.doc-hero#top")!;
    expect(hero.querySelector(":scope > .zk-glow")).not.toBeNull();
    expect(hero.querySelector(":scope > svg.zk-art")).not.toBeNull();
    expect(text(hero.querySelector("h1"))).toBe("Brand assets");
    const deck = hero.querySelector(".doc-deck")!;
    expect(text(deck)).toBe(
      "The Zoorik logo, colours and words, ready to use. Use the files as they are: never redraw or retype the logo.",
    );
    expect(deck.querySelector('span[translate="no"]')).toHaveTextContent("Zoorik");

    const [zip, rules] = [...hero.querySelectorAll(".hero-cta > a")];
    expect(zip).toHaveClass("btn", "btn-light");
    expect(zip).toHaveAttribute("href", "/brand-kit/zoorik-brand-kit.zip");
    expect(zip).toHaveAttribute("download", "");
    expect(rules).toHaveClass("btn", "btn-wire");
    expect(rules).toHaveAttribute("href", "#rules");
    expect(text(rules!)).toBe("How to use them");
  });

  it("prints the ZIP's size as the file measures, never a typed one", () => {
    const zip = main().querySelector(".hero-cta a[download]")!;
    const bytes = statSync(servedFile("/brand-kit/zoorik-brand-kit.zip")).size;
    expect(text(zip)).toBe(`Download all files ZIP · ${formatKitSize(bytes)}`);
    expect(text(zip.querySelector(".bk-sz"))).toBe(`ZIP · ${formatKitSize(bytes)}`);
  });

  it("reads in the mock's order, each section an address named by its heading, two on the band", () => {
    const page = main();
    const sections = [...page.querySelectorAll(":scope > section")];
    expect(sections.map((section) => section.id)).toEqual([
      "logo",
      "mark",
      "colours",
      "rules",
      "dont",
      "words",
    ]);
    for (const section of sections) {
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(section.querySelector(`.sec-head > h2#${section.id}-h`)).not.toBeNull();
    }
    expect(sections.filter((s) => s.classList.contains("sec-band")).map((s) => s.id)).toEqual([
      "mark",
      "rules",
    ]);
    expect(sections.map((s) => text(s.querySelector(".sec-head > h2")))).toEqual([
      "The logo",
      "The mark",
      "Colours and type",
      "Clear space and size",
      "Don’t",
      "Names and words",
    ]);
    /* Colours and type, and Clear space and size, have no lede. */
    expect(sections.map((s) => s.querySelector(".sec-head > p") !== null)).toEqual([
      true,
      true,
      false,
      false,
      true,
      true,
    ]);
    /* No closing assessment row: the mock ends on the words. */
    expect(page.querySelector("#contact, #assess")).toBeNull();
  });

  it("draws six logo tiles and four mark tiles, each its file on its ground", () => {
    const page = main();
    const logos = [...page.querySelectorAll("#logo .bk-g3 > .bk-tile")];
    const marks = [...page.querySelectorAll("#mark .bk-g4 > .bk-tile")];
    expect(logos.map((tile) => text(tile.querySelector("h3")))).toEqual([
      "Logo on navy",
      "Logo on white",
      "Bone, transparent",
      "Navy, transparent",
      "With the tagline, bone",
      "With the tagline, navy",
    ]);
    expect(marks.map((tile) => text(tile.querySelector("h3")))).toEqual([
      "Mark, bone",
      "Mark, navy",
      "Small mark, bone",
      "Small mark, navy",
    ]);
    expect([...logos, ...marks].map((tile) => tile.querySelector(".bk-prev")!.className)).toEqual([
      "bk-prev bk-navy",
      "bk-prev bk-white",
      "bk-prev bk-navy",
      "bk-prev bk-light",
      "bk-prev bk-navy",
      "bk-prev bk-light",
      "bk-prev bk-navy",
      "bk-prev bk-light",
      "bk-prev bk-navy",
      "bk-prev bk-light",
    ]);
    for (const tile of [...logos, ...marks]) {
      const img = tile.querySelector(".bk-prev > img")!;
      expect(img).toHaveAttribute("alt", text(tile.querySelector("h3")));
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img.getAttribute("src")).toMatch(/^\/brand-kit\/zoorik-[a-z-]+\.svg$/);
    }
    expect(text(logos[4]!.querySelector("p"))).toBe(`The logo over “${brandTagline}”`);
  });

  it("downloads only files the site serves, with the mock's labels", () => {
    const page = main();
    const links = [...page.querySelectorAll<HTMLAnchorElement>("a[download]")];
    expect(links).toHaveLength(1 + 6 * 2 + 2 * 2 + 2 * 4);
    for (const link of links) {
      const href = link.getAttribute("href")!;
      expect(href.startsWith("/brand-kit/"), href).toBe(true);
      expect(existsSync(servedFile(href)), href).toBe(true);
    }
    const labels = (tile: Element) => [...tile.querySelectorAll(".bk-dl")].map((a) => text(a));
    const [onNavy] = page.querySelectorAll("#logo .bk-tile");
    expect(labels(onNavy!)).toEqual(["SVG", "PNG"]);
    expect([...onNavy!.querySelectorAll(".bk-dl")].map((a) => a.getAttribute("href"))).toEqual([
      "/brand-kit/zoorik-logo-on-navy.svg",
      "/brand-kit/zoorik-logo-on-navy@2x.png",
    ]);
    const small = page.querySelectorAll("#mark .bk-tile")[3]!;
    expect(labels(small)).toEqual(["SVG", "PNG 16", "PNG 32", "PNG 64"]);
    expect([...small.querySelectorAll(".bk-dl")].map((a) => a.getAttribute("href"))).toEqual([
      "/brand-kit/zoorik-mark-small-navy-transparent.svg",
      "/brand-kit/zoorik-mark-small-navy-transparent-16.png",
      "/brand-kit/zoorik-mark-small-navy-transparent-32.png",
      "/brand-kit/zoorik-mark-small-navy-transparent-64.png",
    ]);
  });

  it("gives each colour its hex, its RGB from that hex and a Copy of the hex", () => {
    const swatches = [...main().querySelectorAll("#colours .bk-sw")];
    expect(swatches.map((s) => s.className)).toEqual(["bk-sw bk-sw-navy", "bk-sw bk-sw-bone"]);
    for (const swatch of swatches) {
      const hex = text(swatch.querySelector(".bk-hex"));
      const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");
      expect(text(swatch.querySelector(".bk-rgb"))).toBe(`RGB ${rgb}`);
      expect(swatch.querySelector(".bk-copy")).toHaveAttribute("data-copy", hex);
    }
    expect(swatches.map((s) => s.querySelector(".bk-copy")!.getAttribute("aria-label"))).toEqual([
      "Copy navy",
      "Copy bone",
    ]);
  });

  it("states contrast ratios that the two colours give", () => {
    const [navy, bone] = brandAssetsPage.colours.swatches.map((s) => s.hex);
    const page = main();
    const facts = [...page.querySelectorAll("#colours .bk-facts > p")].map((p) => text(p));
    expect(facts[1]).toBe(
      `Contrast. Bone on navy ${contrast(bone!, navy!)} : 1. Navy on white ${contrast(navy!, "#FFFFFF")} : 1.`,
    );
    expect(facts).toHaveLength(3);
    expect(page.querySelectorAll("#colours .bk-facts > p > b")).toHaveLength(3);
  });

  it("draws the clear space and the size ladder with its three rules", () => {
    const rules = main().querySelector("#rules")!;
    expect(rules.querySelector(".bk-clear .bk-cbox > img")).toHaveAttribute(
      "alt",
      "The Zoorik logo inside its clear space",
    );
    const rungs = [...rules.querySelectorAll(".bk-ladder > span")];
    expect(rungs.map((rung) => text(rung.querySelector("small")))).toEqual([
      "64 px",
      "33 px",
      "32 px",
      "16 px",
    ]);
    expect(rungs.map((rung) => rung.className)).toEqual(["", "", "bk-sm", "bk-sm"]);
    expect(
      rungs.map((rung) => (rung.querySelector("img") as HTMLImageElement).style.width),
    ).toEqual(["64px", "33px", "32px", "16px"]);
    expect(rungs[2]!.querySelector("img")).toHaveAttribute(
      "src",
      "/brand-kit/zoorik-mark-small-navy-transparent.svg",
    );
    expect([...rules.querySelectorAll(".bk-list > li")].map((li) => text(li))).toEqual([
      "The full mark from 33 px up.",
      "The small mark at 32 px and below, and never above.",
      "The whole logo at least 69 px wide.",
    ]);
  });

  it("shows six Don'ts, each picture hidden from screen readers, the photograph the mock's own", () => {
    const page = main();
    const donts = [...page.querySelectorAll("#dont .bk-dont")];
    expect(donts.map((d) => text(d.querySelector("figcaption")))).toEqual([
      "Don’t stretch or squash it",
      "Don’t rotate it",
      "Don’t recolour any part of it",
      "Don’t add shadows, glows or outlines",
      "Don’t place it on photographs",
      "Don’t retype the word",
    ]);
    for (const dont of donts)
      expect(dont.querySelector(".bk-dprev")).toHaveAttribute("aria-hidden", "true");
    const photo = page.querySelector<HTMLElement>(".bk-x-photo")!;
    expect(photo.style.backgroundImage).toBe('url("/_next/static/media/hero-racks.webp")');
    expect(page.querySelector(".bk-x-mark circle")).toHaveAttribute("fill", "#3B5BF5");
    expect(text(page.querySelector("#dont .bk-also"))).toBe(
      "Also: don’t change the gap between the mark and the word, resize one against the other, or move the mark off the word’s centre line.",
    );
  });

  it("offers the names and words to copy, each button copying exactly its row's words", () => {
    const page = main();
    const rows = [...page.querySelectorAll("#words .bk-row")];
    expect(rows.map((row) => text(row.querySelector(".bk-rk")))).toEqual([
      "Name",
      "Tagline",
      "Company line",
      "Coral",
      "Amoeba",
      "About Zoorik",
    ]);
    for (const row of rows) {
      expect(row.querySelector(".bk-copy")).toHaveAttribute(
        "data-copy",
        text(row.querySelector(".bk-text")),
      );
    }
    expect(rows.map((row) => row.querySelector(".bk-copy")!.getAttribute("aria-label"))).toEqual([
      "Copy name",
      "Copy tagline",
      "Copy company line",
      "Copy coral",
      "Copy amoeba",
      "Copy about zoorik",
    ]);
    expect(text(rows[1]!.querySelector(".bk-text"))).toBe(heroContent.headline);
    expect(text(rows[2]!.querySelector(".bk-text"))).toBe(brandCompanyLine);
    expect(text(rows[5]!.querySelector(".bk-text"))).toMatch(
      /^Zoorik is a cloud cost optimization company\. Coral rebalances Kubernetes on AKS and EKS\. Amoeba rightsizes block storage:/,
    );
    const ask = page.querySelector("#words .bk-ask a")!;
    expect(ask).toHaveAttribute("href", `mailto:${contactEmail}?subject=Brand%20assets`);
    expect(text(ask)).toBe(contactEmail);
  });

  /* The old product names (block storage's) are guarded for all of src/ by src/app/page.test.tsx. */
  it("keeps the site's words: reduce, never cut, lower or waste", () => {
    const words = text(main());
    expect(words).not.toMatch(/\b(cut|cuts|lower|lowers|waste|wasted)\b/i);
  });
});

describe("a Copy button", () => {
  it("copies its words, says Copied with a tick for 1.6 s, then is ready again", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    allowCopying({ writeText }, true);
    const button = main().querySelector<HTMLButtonElement>('.bk-copy[aria-label="Copy tagline"]')!;
    const live = button.nextElementSibling!;
    expect(live).toHaveAttribute("aria-live", "polite");
    expect(text(button)).toBe("Copy");

    await act(async () => {
      fireEvent.click(button);
    });
    expect(writeText).toHaveBeenCalledWith(brandTagline);
    expect(text(button)).toBe("Copied");
    expect(button).toHaveAttribute("data-done", "");
    expect(text(live)).toBe("Copied");

    act(() => {
      vi.advanceTimersByTime(1599);
    });
    expect(text(button)).toBe("Copied");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(text(button)).toBe("Copy");
    expect(button).not.toHaveAttribute("data-done");
    expect(text(live)).toBe("");
  });

  it("stays as it is when the page may not copy, as the mock's does", async () => {
    allowCopying(undefined, false);
    const button = main().querySelector<HTMLButtonElement>('.bk-copy[aria-label="Copy navy"]')!;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(text(button)).toBe("Copy");
    expect(button).not.toHaveAttribute("data-done");
    expect(window.getSelection()?.toString() ?? "").toBe("");
  });
});

describe("the kit's size", () => {
  it("is written the mock's way: MB to one decimal from a million bytes, else whole KB", () => {
    expect(formatKitSize(2_527_634)).toBe("2.5 MB");
    expect(formatKitSize(1_000_000)).toBe("1.0 MB");
    expect(formatKitSize(999_499)).toBe("999 KB");
    expect(formatKitSize(48_600)).toBe("49 KB");
  });
});
