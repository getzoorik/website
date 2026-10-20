import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { calendarUrl, consoles, navLogin } from "@/config/site";
import { footerColumns } from "@/content/footer";
import { FIRST_PAINT_SCRIPT } from "@/lib/product-choice";

import { LoginScreen } from "./login-screen";

/* Next imports an image as its URL and its own size; Vite as a bare URL. The
   frame's size is the assertion, so the test hands it the shape Next does. */
vi.mock("@/features/hero/hero-racks-graded.webp", () => ({
  default: { src: "/_next/static/media/hero-racks-graded.webp", width: 1200, height: 1200 },
}));

/**
 * The product chooser at `/login`.
 *
 * Everything here is static markup, so the failures worth guarding are not
 * crashes — they are the ways this page can render perfectly and still be
 * wrong: a Continue that opens a new tab, a coming card with a console link, a
 * sentence that drifts from the mock's words, and the "Login" entries drifting
 * away from this page.
 */
const cards = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>("main > section.card"),
];

describe("the login screen", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-ap");
    window.history.replaceState(null, "", "/");
  });

  it("sets the page's product on <html> before paint, from ?p= or Coral", () => {
    const { container } = render(<LoginScreen />);
    const script = container.querySelector("script")!;
    /* Ahead of everything, so it runs while the HTML parses. */
    expect(container.firstElementChild).toBe(script);
    expect(script.innerHTML).toBe(FIRST_PAINT_SCRIPT);
  });

  it("switches between Coral and Amoeba, Coral first, each a real link", () => {
    const { container } = render(<LoginScreen />);
    const nav = screen.getByRole("navigation", { name: "Product" });
    expect(nav).toHaveClass("lg-switch");
    const links = [...nav.querySelectorAll("a")];

    expect(links.map((a) => [a.getAttribute("href"), a.dataset.p])).toEqual([
      ["/login?p=coral", "coral"],
      ["/login?p=amoeba", "amoeba"],
    ]);
    expect(links.map((a) => a.querySelector("span[translate='no']")?.textContent)).toEqual([
      "Coral",
      "Amoeba",
    ]);
    expect(links.map((a) => a.querySelector("small")?.textContent)).toEqual([
      "Kubernetes",
      "Block storage",
    ]);
    for (const a of links) expect(a.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[1]).not.toHaveAttribute("aria-current");
    expect(container.querySelector("main p.new a[href^='/assessment']")).toHaveAttribute(
      "href",
      "/assessment?p=coral",
    );

    fireEvent.click(links[1]!);
    expect(document.documentElement).toHaveAttribute("data-ap", "amoeba");
    expect(window.location.search).toBe("?p=amoeba");
    return waitFor(() => {
      expect(links[1]).toHaveAttribute("aria-current", "page");
      expect(links[0]).not.toHaveAttribute("aria-current");
      /* The estimate follows the product the page is on. */
      expect(container.querySelector("main p.new a[href^='/assessment']")).toHaveAttribute(
        "href",
        "/assessment?p=amoeba",
      );
    });
  });

  it("leaves a modified click to the browser", () => {
    render(<LoginScreen />);
    const amoeba = screen.getByRole("link", { name: /Amoeba/ });
    /* jsdom cannot open a new tab: stop its navigation after React has seen the click. */
    document.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(amoeba, { metaKey: true });
    expect(document.documentElement).not.toHaveAttribute("data-ap");
  });

  it("draws one card per product, named by it, Coral first", () => {
    const { container } = render(<LoginScreen />);
    const [coral, amoeba] = cards(container);

    expect(cards(container)).toHaveLength(2);
    expect(coral).toHaveAttribute("data-p", "coral");
    expect(amoeba).toHaveAttribute("data-p", "amoeba");
    expect(screen.getByRole("region", { name: "Coral" })).toBe(coral);
    expect(screen.getByRole("region", { name: "Amoeba" })).toBe(amoeba);
    /* The switch names the product: the card has no heading of its own. */
    expect(container.querySelectorAll("main h2")).toHaveLength(0);
  });

  /* Neither console is open to customers yet: both cards
     read "Coming soon" and offer the calendar, and no card leads to a console. */
  it.each([
    ["Coral", 0],
    ["Amoeba", 1],
  ])("shows %s as coming, with the calendar and no console", (_name, index) => {
    const { container } = render(<LoginScreen />);
    const card = cards(container)[index]!;
    const links = [...card.querySelectorAll("a")];

    expect(card.querySelector(".act .soon-t")).toHaveTextContent(/^Coming soon$/);
    /* Its only link is the calendar: no console link by any route. */
    expect(links).toHaveLength(1);
    const early = links[0]!;
    expect(early).toHaveClass("lk");
    expect(early).toHaveAttribute("href", calendarUrl);
    expect(early).toHaveAttribute("target", "_blank");
    expect(early).toHaveAttribute("rel", "noopener noreferrer");
    /* The visible label, then the hint a screen reader hears, then the arrow. */
    expect(early.textContent).toBe("Book a demo for early access (opens in a new tab)");
    expect(early.lastElementChild).toHaveClass("ext");
    expect(card.querySelector(".btn-ink")).toBeNull();
    expect(card.innerHTML).not.toContain(consoles.coral.href);
  });

  it("says what each product does, and where it runs as tags with their marks", () => {
    const { container } = render(<LoginScreen />);

    expect(cards(container).map((card) => card.querySelector(".line")?.textContent)).toEqual([
      "Optimizes your Kubernetes clusters.",
      "Optimizes your block storage.",
    ]);
    const tags = cards(container).map((card) =>
      [...card.querySelectorAll("ul.lg-tags > li.lg-tag")].map((li) => [
        li.textContent,
        li.querySelector("svg")?.getAttribute("data-mark"),
      ]),
    );
    expect(tags).toEqual([
      [
        ["AKS", "azure"],
        ["EKS", "aws"],
      ],
      [
        ["Azure", "azure"],
        ["AWS", "aws"],
        ["Windows", "windows"],
        ["Linux", "linux"],
      ],
    ]);
    /* Each Azure mark paints with its own gradients. */
    const ids = [...container.querySelectorAll("linearGradient")].map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("reads as one sentence under the cards, with no comma before or", () => {
    const { container } = render(<LoginScreen />);
    const line = container.querySelector("main p.new")!;

    /* What a screen reader reads: the calendar link says it opens a new tab. */
    expect(line.textContent).toBe(
      "New to Zoorik? Book a demo (opens in a new tab) or estimate your saving.",
    );
    expect(line.querySelector(":scope > span[translate='no']")).toHaveTextContent("Zoorik");
    const [demo, assessment] = [...line.querySelectorAll("a")];
    expect(demo).toHaveClass("lk");
    expect(demo).toHaveAttribute("href", calendarUrl);
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    expect(demo!.lastElementChild).toHaveClass("ext");
    /* A page of this site: it must not be flung into a new tab. */
    expect(assessment).toHaveClass("lk");
    expect(assessment).toHaveTextContent("estimate your saving");
    expect(assessment).toHaveAttribute("href", "/assessment?p=coral");
    expect(assessment!.hasAttribute("target")).toBe(false);
    expect(assessment!.querySelector(".ext")).toBeNull();
  });

  it("closes on the copyright line, then Privacy and Terms on the right, in the same tab", () => {
    const { container } = render(<LoginScreen />);
    const foot = container.querySelector("section.col > footer.foot")!;
    const [copyright, legals] = [...foot.children];

    expect(foot.children).toHaveLength(2);
    expect(copyright!.tagName).toBe("SMALL");
    expect(copyright).toHaveTextContent("© 2026 Zoorik");
    expect(copyright!.querySelector("span[translate='no']")).toHaveTextContent("Zoorik");
    expect(legals!.tagName).toBe("SPAN");
    expect(legals).toHaveClass("foot-legals");
    const links = [...legals!.querySelectorAll("a")];
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ]);
    for (const link of links) {
      expect(link).toHaveClass("foot-legal");
      expect(link.hasAttribute("target")).toBe(false);
    }
  });

  it("puts the hero's photo, the turning mark and one line of brand in the panel", () => {
    const { container } = render(<LoginScreen />);
    const panel = container.querySelector("aside.panel")!;

    /* Labelled, not hidden: it holds the only visible lockup below 900px. */
    expect(panel).toHaveAttribute("aria-label", "Zoorik");
    expect(panel).not.toHaveAttribute("aria-hidden");
    expect([...panel.children].map((el) => el.getAttribute("class"))).toEqual([
      "photo",
      "glow",
      "art",
      "lock bone",
      null,
      null,
    ]);

    const photo = panel.querySelector("img.photo")!;
    expect(photo).toHaveAttribute(
      "alt",
      "Server racks in a data centre, lit by blue status lights",
    );
    expect(photo).toHaveAttribute("aria-hidden", "true");
    expect(photo).toHaveAttribute("width", "1200");
    expect(photo).toHaveAttribute("height", "1200");
    expect(photo).toHaveAttribute("decoding", "async");
    expect(photo.hasAttribute("fetchpriority")).toBe(false);
    expect(panel.querySelector(".glow")).toHaveAttribute("aria-hidden", "true");
    const art = panel.querySelector("svg.art")!;
    expect(art).toHaveAttribute("aria-hidden", "true");
    expect(art).toHaveAttribute("focusable", "false");
    /* The 2.0 backdrop: the core at .14 in bone, as on every hero. */
    expect(art.querySelector(":scope > circle")).toHaveAttribute("opacity", ".14");
    expect(art.querySelector(":scope > circle")).toHaveAttribute("fill", "#FAF7F3");

    expect(panel.querySelector(":scope > h2")).toHaveTextContent(
      /^Reduce cloud cost, autonomously\.$/,
    );
    const line = panel.querySelector(":scope > p")!;
    expect(line.textContent).toBe("Coral optimizes Kubernetes. Amoeba optimizes block storage.");
    expect([...line.querySelectorAll("span[translate='no']")].map((s) => s.textContent)).toEqual([
      "Coral",
      "Amoeba",
    ]);
    /* No figure stands here: an earlier panel's "60% / 50% / 0s" had no source. */
    expect(panel.textContent).not.toMatch(/\d|%/);
  });

  it("offers exactly one way home at any width", () => {
    render(<LoginScreen />);
    /* Both lockups are in the DOM — the stylesheet hides one per breakpoint —
       so both must name themselves. */
    const home = screen.getAllByRole("link", { name: "Zoorik home" });
    expect(home).toHaveLength(2);
    for (const link of home) expect(link).toHaveAttribute("href", "/");
  });

  it("skips to the chooser and flags every new tab", () => {
    const { container } = render(<LoginScreen />);
    const skip = container.querySelector("a.skip");
    expect(skip).toHaveAttribute("href", "#main");
    expect(skip).toHaveTextContent("Skip to content");
    /* The first Tab stop, ahead of the page as in the mock. */
    expect(container.querySelector("a")).toBe(skip);
    expect(container.querySelector("main#main")).toHaveAttribute("tabindex", "-1");
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("h1")).toHaveTextContent(/^Choose a product to continue$/);
    /* No deck under the heading. */
    expect(container.querySelector("main .deck")).toBeNull();
    expect(container.textContent).not.toContain("Each product has its own console.");

    const newTabs = [...container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')];
    expect(newTabs).toHaveLength(3);
    for (const a of newTabs) {
      expect(a.querySelector(".sr-only")?.textContent, a.textContent ?? "").toBe(
        " (opens in a new tab)",
      );
    }
  });

  it("leaves the earlier design behind", () => {
    const { container } = render(<LoginScreen />);
    for (const gone of [
      ".kicker",
      ".az",
      ".works",
      ".host",
      ".chip",
      ".built",
      ".prods",
      ".grain",
    ]) {
      expect(container.querySelector(gone), gone).toBeNull();
    }
    const text = container.textContent ?? "";
    for (const gone of [
      "Rebalances",
      "Rightsizes",
      "Works with",
      "Built for",
      "find your own number",
      "free assessment",
      "—",
      "–",
    ]) {
      expect(text, gone).not.toContain(gone);
    }
    /* No mailbox on this page. */
    expect(container.querySelector("a[href^='mailto:']")).toBeNull();
  });
});

/**
 * The entries that bring anyone here. They were `#contact` for the life of the
 * port, under a comment saying to change them when a destination existed. It
 * does now — and nothing else in the repo would notice if one quietly went
 * back, because `#contact` is a valid anchor to a section that exists.
 */
describe("the Login entries", () => {
  it("point at the chooser from the bar, the drawer and the footer", () => {
    /* The bar and the drawer draw one entry, `navLogin`; the footer its own. */
    const company = footerColumns.find((c) => c.heading === "Company");
    const entries = [navLogin, ...(company?.links ?? []).filter((l) => l.label === "Login")];
    expect(entries).toHaveLength(2);
    for (const entry of entries) expect(entry.href).toBe("/login");
  });
});
