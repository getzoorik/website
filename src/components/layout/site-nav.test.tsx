import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pathname = vi.hoisted(() => ({ current: "/coral" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import { amoebaDocs, amoebaOnePager, learnPath, menuLabelHref, navMenus } from "@/config/site";
import { learnArticles } from "@/content/learn/published";

import { SiteNav } from "./site-nav";

/**
 * The header: what it draws, what each page marks as current, where each
 * link and the menu's word lead, and every way its Docs menu and its drawer
 * open and close. Each of these works in a browser and none of them shows in a
 * screenshot, so a regression would look like working software until somebody
 * pressed Escape.
 */

const HOVER_QUERY = "(hover:hover) and (pointer:fine)";

/** A `matchMedia` whose answers and `change` listeners the test controls. */
function stubMatchMedia(matching: Set<string>) {
  const listeners = new Map<string, Set<(e: MediaQueryListEvent) => void>>();
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return matching.has(query);
        },
        media: query,
        onchange: null,
        addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
          if (!listeners.has(query)) listeners.set(query, new Set());
          listeners.get(query)!.add(fn);
        },
        removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
          listeners.get(query)?.delete(fn);
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
  return (query: string, matches: boolean) => {
    for (const fn of listeners.get(query) ?? []) {
      fn({ matches, media: query } as MediaQueryListEvent);
    }
  };
}

let media: Set<string>;
let fireMedia: ReturnType<typeof stubMatchMedia>;
/* jsdom does not navigate; a followed link would only print that it cannot. */
const stayOnPage = (e: Event) => e.preventDefault();

beforeEach(() => {
  pathname.current = "/coral";
  media = new Set();
  fireMedia = stubMatchMedia(media);
  document.addEventListener("click", stayOnPage);
});

afterEach(() => {
  document.removeEventListener("click", stayOnPage);
  /* What /assessment's first-paint script and switch set (`first-paint.ts`), which the bar no longer reads. */
  document.documentElement.removeAttribute("data-ap");
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const text = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** A menu's word: its link. */
const labelOf = (dd: Element) => text(dd.querySelector(".nv-lbl"));

function renderNav(path = "/coral") {
  pathname.current = path;
  const view = render(<SiteNav />);
  const dd = (label: string) =>
    [...view.container.querySelectorAll<HTMLElement>(".nv-dd")].find(
      (el) => labelOf(el) === label,
    )!;
  /** The menu's button: the chevron after its word. */
  const button = (label: string) => dd(label).querySelector<HTMLButtonElement>("button.nv-btn")!;
  const word = (label: string) => dd(label).querySelector<HTMLAnchorElement>("a.nv-lbl")!;
  const card = (label: string) => dd(label).querySelector<HTMLElement>(".nv-menu")!;
  /** One of the plain links in the bar, drawn alike: Assessment or Login. */
  const link = (label: string) =>
    [...view.container.querySelectorAll<HTMLAnchorElement>(".nav-links > a.nav-opt")].find(
      (a) => text(a) === label,
    )!;
  return { ...view, dd, button, word, card, link };
}

describe("the bar", () => {
  it("runs Coral, Amoeba, Assessment, the Docs menu, Login, Book a demo, then the toggle", () => {
    const { container } = renderNav("/");
    const items = [...container.querySelector(".nav-links")!.children].map((el) =>
      el.matches(".nv-dd") ? `${labelOf(el)} ▾` : text(el) || el.className,
    );
    expect(items).toEqual([
      "Coral",
      "Amoeba",
      "Assessment",
      "Docs ▾",
      "Login",
      "Book a demo (opens in a new tab)",
      "nav-toggle",
    ]);
  });

  it("leaves Product guide and FAQ out, in the bar and the drawer: the Docs menu leads to them", () => {
    /* Owner, 23 Oct 2026: "Docs is the only menu". */
    for (const path of ["/", "/coral-guide", "/amoeba-faq"]) {
      const { container, unmount } = renderNav(path);
      const nav = container.querySelector("nav")!;
      /* No link, button or drawer label of their name: Docs' rows say "Guide, FAQ and one-pager". */
      const names = [...nav.querySelectorAll("a, button, .nd-h")].map(
        (el) => el.getAttribute("aria-label") ?? text(el),
      );
      expect(names, path).not.toContain("Product guide");
      expect(names, path).not.toContain("Product guide menu");
      expect(names, path).not.toContain("FAQ");
      expect(names, path).not.toContain("FAQ menu");
      const hrefs = [...nav.querySelectorAll("a")].map((a) => a.getAttribute("href"));
      for (const page of ["/coral-guide", "/coral-faq", "/amoeba-guide", "/amoeba-faq"]) {
        expect(hrefs, path).not.toContain(page);
      }
      unmount();
    }
  });

  it("draws each product with its mark and keeps the names out of translation", () => {
    const { container } = renderNav("/");
    const products = [...container.querySelectorAll(".nav-links > a.nav-prod")];
    expect(products.map((a) => [a.textContent, a.getAttribute("translate")])).toEqual([
      ["Coral", "no"],
      ["Amoeba", "no"],
    ]);
    for (const a of products) expect(a.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps Login in the bar as the link the CSS shows down to 1001px", () => {
    const login = renderNav("/").link("Login");
    expect(login).toHaveAttribute("href", "/login");
    expect(login).toHaveTextContent("Login");
  });

  it("sends Book a demo to the calendar in a new tab, said aloud and with no arrow", () => {
    const demo = renderNav("/").container.querySelector<HTMLAnchorElement>(".nav-links > a.btn")!;
    expect(demo).toHaveClass("btn-solid");
    expect(demo).toHaveAttribute("href", "https://cal.com/zoorik/talk");
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    expect(demo.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
    expect(demo.querySelector("svg")).toBeNull();
  });

  it("names the wordmark for where it goes: the top at home, the home page elsewhere", () => {
    const home = renderNav("/").container.querySelector(".brand")!;
    expect(home).toHaveAttribute("href", "#top");
    expect(home).toHaveAttribute("aria-label", "Zoorik, back to top");
    const away = renderNav("/docs").container.querySelector(".brand")!;
    expect(away).toHaveAttribute("href", "/");
    expect(away).toHaveAttribute("aria-label", "Zoorik home");
  });

  it("renders its one menu, Docs, closed, the button controlling its card", () => {
    const { container } = renderNav("/");
    const pairs = [...container.querySelectorAll(".nv-dd")].map((dd) => {
      const btn = dd.querySelector("button.nv-btn")!;
      const card = dd.querySelector<HTMLElement>(".nv-menu")!;
      expect(btn).toHaveAttribute("type", "button");
      expect(btn).toHaveAttribute("aria-expanded", "false");
      expect(btn.hasAttribute("aria-current")).toBe(false);
      expect(card.hidden).toBe(true);
      return [btn.getAttribute("aria-controls"), card.id];
    });
    expect(pairs).toEqual([["nvm-docs", "nvm-docs"]]);
    /* A disclosure, not an application menu. */
    expect(container.querySelector('[role="menu"], [role="menuitem"]')).toBeNull();
  });
});

/**
 * Assessment is a plain link to the assessment, on every page, drawn as Login
 * is; its page switches product itself. Docs is a word, a link to the hub's
 * Coral group, and a chevron that opens its menu.
 */
describe("the links and the menu's word", () => {
  it("draws Assessment as a plain link, as Login is, and Docs as a link and a chevron", () => {
    const { container } = renderNav("/");
    const plain = [...container.querySelectorAll(".nav-links > a.nav-opt")];
    expect(plain.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["Assessment", "/assessment"],
      ["Login", "/login"],
    ]);
    for (const a of plain) {
      /* No chevron, no menu: one link each. */
      expect(a.querySelector("svg")).toBeNull();
      expect(a.closest(".nv-dd")).toBeNull();
    }
    /* Docs' word is the one `.nv-lbl`. */
    expect([...container.querySelectorAll(".nav-links a.nv-lbl")].map((a) => text(a))).toEqual([
      "Docs",
    ]);
    const shapes = [...container.querySelectorAll(".nv-dd")].map((dd) => [
      labelOf(dd),
      [...dd.children].map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`),
    ]);
    expect(shapes).toEqual([["Docs", ["a.nv-lbl", "button.nv-btn.nv-tog", "div.nv-menu"]]]);
    const tog = container.querySelector<HTMLButtonElement>(".nv-tog")!;
    /* The chevron has no text of its own: its name says which menu it opens. */
    expect(tog).toHaveAccessibleName("Docs menu");
    expect(text(tog)).toBe("");
    expect(tog).toHaveAttribute("type", "button");
    expect(tog.querySelector("svg.nv-chev")).toHaveAttribute("aria-hidden", "true");
  });

  /* Amoeba's own pages included: the rule has no exception. */
  it.each([
    "/",
    "/coral",
    "/coral-guide",
    "/coral-faq",
    "/amoeba",
    "/amoeba-guide",
    "/amoeba-faq",
    "/assessment",
    "/docs",
    "/learn",
    /* An article, whichever the index lists first. */
    learnPath(learnArticles[0]!.slug),
    "/about",
    "/privacy",
  ])(
    "on %s, lead to the assessment and the hub's Coral group, in the bar and the drawer",
    (path) => {
      const { container } = renderNav(path);
      expect(
        [...container.querySelectorAll(".nav-links > a.nav-opt, .nav-links a.nv-lbl")].map((a) => [
          text(a),
          a.getAttribute("href"),
        ]),
      ).toEqual([
        ["Assessment", "/assessment"],
        ["Docs", "/docs#coral"],
        ["Login", "/login"],
      ]);
      const drawer = [...container.querySelectorAll(".nav-drop .wrap > a")].find(
        (a) => text(a) === "Assessment",
      );
      expect(drawer).toHaveAttribute("href", "/assessment");
    },
  );

  it("lead to each row set's first row, Coral's, which no switch holds back", () => {
    for (const menu of navMenus) {
      expect(menu.rows[0].product, menu.key).toBe("coral");
      expect(menuLabelHref(menu), menu.key).toBe(menu.rows[0].href);
    }
  });

  it("carry the section's current mark, and aria-current only on this very page", () => {
    /* /learn is in Docs, but `/docs#coral` is another page. */
    const learn = renderNav("/learn");
    expect(learn.word("Docs")).toHaveClass("is-cur");
    expect(learn.button("Docs")).toHaveClass("is-cur");
    expect(learn.word("Docs")).not.toHaveAttribute("aria-current");
    learn.unmount();
    /* /docs is: the word is a jump to its own `#coral` group. */
    const docs = renderNav("/docs");
    expect(docs.word("Docs")).toHaveAttribute("aria-current", "page");
    expect(docs.button("Docs")).not.toHaveAttribute("aria-current");
    docs.unmount();
    /* A guide or an FAQ is in Docs, and no row of the menu is it. */
    const faq = renderNav("/amoeba-faq");
    expect(faq.word("Docs")).toHaveClass("is-cur");
    expect(faq.button("Docs")).toHaveClass("is-cur");
    expect(faq.word("Docs")).not.toHaveAttribute("aria-current");
    faq.unmount();
    /* On the assessment its link is this very page: it names no product. */
    const assessment = renderNav("/assessment");
    expect(assessment.link("Assessment")).toHaveAttribute("aria-current", "page");
    expect(assessment.link("Assessment")).not.toHaveClass("is-cur");
  });

  it("follow Docs' word on a click without opening its menu", async () => {
    const { word, button } = renderNav("/");
    await userEvent.click(word("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });
});

describe("the menus' rows", () => {
  const rows = (card: HTMLElement) =>
    [...card.querySelectorAll<HTMLAnchorElement>("a.nv-item")].map((a) => [
      text(a.querySelector("b")),
      text(a.querySelector("small")),
      a.getAttribute("href"),
    ]);

  it("list Docs' products, then All docs, Zoorik Learn and Open source, in the one card", () => {
    const { card, container } = renderNav("/");
    /* Docs is the only menu: Assessment's page switches product itself. */
    expect(container.querySelectorAll(".nv-menu")).toHaveLength(1);
    /* No Amoeba row while all of Amoeba's documents are held: the hub has no
       `#amoeba` group for it to land on. */
    expect(rows(card("Docs"))).toEqual([
      ["Coral", "Guide, FAQ and one-pager", "/docs#coral"],
      ...(amoebaDocs || amoebaOnePager
        ? [["Amoeba", "Guide, FAQ and one-pager", "/docs#amoeba"]]
        : []),
      ["All docs", "", "/docs"],
      ["Zoorik Learn", "Cloud cost optimization guides for Kubernetes and block storage", "/learn"],
      ["Open source", "What you can read, run and contribute to", "/open-source"],
    ]);
  });

  it("set the Learn row after All docs, under its own hairline, with the book in the marks' slot", () => {
    /* The Learn row, after All docs: a 20px accent book where the products
       draw their marks. */
    const { card } = renderNav("/");
    const docs = card("Docs");
    const learn = docs.querySelector<HTMLAnchorElement>("a.nv-item.nv-learn")!;
    /* Open source follows it, the last row, under no hairline of its own. */
    expect(learn.nextElementSibling).toBe(docs.lastElementChild);
    expect(learn.nextElementSibling).toHaveAttribute("href", "/open-source");
    expect(learn.previousElementSibling).toHaveClass("nv-foot");
    const book = learn.firstElementChild!;
    expect(book.tagName.toLowerCase()).toBe("svg");
    expect(book).toHaveClass("nv-mk", "nv-ic");
    expect(book).toHaveAttribute("aria-hidden", "true");
    expect(book).toHaveAttribute("stroke-width", "1.7");
  });

  it.skipIf(amoebaDocs)(
    "leave Amoeba's guide and FAQ out of the menus and the drawer while they are held",
    () => {
      /* The held state: `amoebaDocs` is off. */
      const { container } = renderNav("/");
      const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
      expect(hrefs).not.toContain("/amoeba-guide");
      expect(hrefs).not.toContain("/amoeba-faq");
      const groups = [...container.querySelectorAll(".nd-grp")].map((grp) => [
        text(grp.querySelector(".nd-h")),
        [...grp.querySelectorAll(".nd-row a")].map((a) => a.textContent),
      ]);
      expect(groups).toEqual([
        [
          "Docs",
          [
            ...(amoebaOnePager ? ["Coral", "Amoeba"] : ["Coral"]),
            "All",
            "Zoorik Learn",
            "Open source",
          ],
        ],
      ]);
    },
  );

  it("would lead to the hub's Amoeba group the day any Amoeba document is released", () => {
    /* The Docs menu's Amoeba row and drawer chip follow the hub: there is an
       `#amoeba` group to land on exactly when one of the two holds is lifted. */
    const docs = navMenus.find((menu) => menu.key === "docs")!;
    expect(docs.rows.map((row) => row.href)).toEqual(
      amoebaDocs || amoebaOnePager ? ["/docs#coral", "/docs#amoeba"] : ["/docs#coral"],
    );
  });

  it("keep Amoeba's guide and FAQ rows, with Block storage's line, for the pages' own switch", () => {
    /* The header draws no menu of them, but each guide and FAQ draws its
       [Coral | Amoeba] switch from these rows, and the flag holds them back. */
    const amoebaRows = navMenus
      .filter((menu) => menu.key === "guide" || menu.key === "faq")
      .flatMap((menu) => menu.rows.filter((row) => row.product === "amoeba"));
    expect(amoebaRows).toEqual(
      amoebaDocs
        ? [
            {
              product: "amoeba",
              href: "/amoeba-guide",
              line: "Block storage cost optimization on Azure\u00a0and\u00a0AWS",
            },
            {
              product: "amoeba",
              href: "/amoeba-faq",
              line: "Block storage cost optimization on Azure\u00a0and\u00a0AWS",
            },
          ]
        : [],
    );
  });

  it("draw a 20px-class mark per product row and an arrow on the foot row, all hidden", () => {
    const { card } = renderNav("/");
    const docs = card("Docs");
    /* One per product row, the Learn row's book and the Open source row's brackets. */
    expect(docs.querySelectorAll("svg.nv-mk")).toHaveLength(
      navMenus.find((menu) => menu.key === "docs")!.rows.length + 2,
    );
    expect(docs.querySelector("a.nv-foot svg.nv-go")).not.toBeNull();
    for (const svg of docs.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    for (const name of docs.querySelectorAll("b > span")) {
      expect(name).toHaveAttribute("translate", "no");
    }
  });
});

/**
 * What each page marks as current: the product link, Assessment or Login in
 * the bar, Docs' `.is-cur`, the row inside the menu and its drawer chip, the
 * drawer row, and the word that is this very page.
 */
describe("the current page", () => {
  function stateOf(path: string) {
    const { container } = renderNav(path);
    const one = (selector: string) => {
      const found = [...container.querySelectorAll(selector)];
      expect(found.length, `${path} ${selector}`).toBeLessThanOrEqual(1);
      return found[0];
    };
    const bar = one('.nav-links > a:not(.nv-lbl)[aria-current="page"]');
    const section = one("a.nv-lbl.is-cur");
    const row = one('.nv-menu a[aria-current="page"]');
    const chip = one('.nd-row a[aria-current="page"]');
    const drawerRow = one('.nav-drop .wrap > a[aria-current="page"]');
    const word = one('a.nv-lbl[aria-current="page"]');
    /* A word and its chevron are one control: the mark is on both or neither. */
    for (const dd of container.querySelectorAll(".nv-split")) {
      expect(dd.querySelector(".nv-lbl")!.classList.contains("is-cur"), path).toBe(
        dd.querySelector(".nv-tog")!.classList.contains("is-cur"),
      );
    }
    const menuOf = (el: Element | undefined) => {
      if (!el) return "";
      const dd = el.closest(".nv-dd");
      return dd ? labelOf(dd) : text(el.closest(".nd-grp")!.querySelector(".nd-h"));
    };
    return [
      text(bar ?? null),
      text(section ?? null),
      row ? `${menuOf(row)} › ${text(row.querySelector("b"))}` : "",
      chip ? `${menuOf(chip)} › ${text(chip)}` : "",
      text(drawerRow ?? null),
      text(word ?? null),
    ];
  }

  it.each([
    ["/", "", "", "", "", "", ""],
    ["/coral", "Coral", "", "", "", "Coral", ""],
    ["/amoeba", "Amoeba", "", "", "", "Amoeba", ""],
    /* The link names no product, so it is this very page as prerendered. */
    ["/assessment", "Assessment", "", "", "", "Assessment", ""],
    /* The guides and FAQs are in Docs, and no row of its menu is any of them. */
    ["/coral-guide", "", "Docs", "", "", "", ""],
    ["/coral-faq", "", "Docs", "", "", "", ""],
    ["/amoeba-guide", "", "Docs", "", "", "", ""],
    ["/amoeba-faq", "", "Docs", "", "", "", ""],
    ["/docs", "", "Docs", "Docs › All docs", "Docs › All", "", "Docs"],
    /* The Learn hub marks Docs and its own row; every article marks Docs alone. */
    ["/learn", "", "Docs", "Docs › Zoorik Learn", "Docs › Zoorik Learn", "", ""],
    ...learnArticles.map((article): string[] => [
      learnPath(article.slug),
      "",
      "Docs",
      "",
      "",
      "",
      "",
    ]),
    ["/open-source", "", "Docs", "Docs › Open source", "Docs › Open source", "", ""],
    ["/login", "Login", "", "", "", "Login", ""],
    ["/about", "", "", "", "", "", ""],
    ["/security", "", "", "", "", "", ""],
    ["/privacy", "", "", "", "", "", ""],
    ["/terms", "", "", "", "", "", ""],
    ["/docs/", "", "Docs", "Docs › All docs", "Docs › All", "", "Docs"],
  ])("on %s", (path, bar, button, row, chip, drawerRow, word) => {
    expect(stateOf(path)).toEqual([bar, button, row, chip, drawerRow, word]);
  });

  it.each(["coral", "amoeba"])(
    "marks Assessment as this very page on /assessment on %s, and holds it as the switch moves",
    async (product) => {
      /* Set by the page's first-paint script and its switch; the bar does not read it. */
      document.documentElement.setAttribute("data-ap", product);
      const { container } = renderNav("/assessment");
      const marked = () =>
        [...container.querySelectorAll('[aria-current="page"]')].map(
          (a) => `${a.className || "drawer"} ${a.getAttribute("href")}`,
        );
      expect(marked()).toEqual(["nav-opt /assessment", "drawer /assessment"]);
      await act(async () => {
        document.documentElement.setAttribute("data-ap", product === "coral" ? "amoeba" : "coral");
      });
      expect(marked()).toEqual(["nav-opt /assessment", "drawer /assessment"]);
    },
  );

  it("never marks a menu button with aria-current: it is not a page", () => {
    for (const path of ["/assessment", "/coral-guide", "/coral-faq", "/docs"]) {
      const { container } = renderNav(path);
      expect(container.querySelector(".nv-btn[aria-current]"), path).toBeNull();
    }
  });
});

describe("a menu", () => {
  afterEach(() => {
    /* The own property a test set over the prototype's getter. */
    Reflect.deleteProperty(document.documentElement, "clientWidth");
  });

  it("opens and closes on a click", async () => {
    const { button, card } = renderNav();

    await userEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    expect(card("Docs").hidden).toBe(false);

    await userEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(card("Docs").hidden).toBe(true);
  });

  it("opens on Enter without moving focus, and closes on Escape with focus back on its button", async () => {
    const { button, card } = renderNav();
    button("Docs").focus();

    await userEvent.keyboard("{Enter}");
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    expect(button("Docs")).toHaveFocus();

    await userEvent.tab();
    expect(card("Docs").querySelector("a")).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(button("Docs")).toHaveFocus();
  });

  it("puts Assessment, then its word, its chevron and its rows in the Tab order, and Escape back on the chevron", async () => {
    const { link, word, button, card } = renderNav("/");
    link("Assessment").focus();

    await userEvent.tab();
    expect(word("Docs")).toHaveFocus();
    await userEvent.tab();
    expect(button("Docs")).toHaveFocus();
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{Enter}");
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    expect(button("Docs")).toHaveFocus();

    const rows = [...card("Docs").querySelectorAll("a")];
    expect(rows[0]).toHaveAttribute("href", "/docs#coral");
    await userEvent.tab();
    expect(rows[0]).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(button("Docs")).toHaveFocus();
  });

  it("passes from a closed menu's chevron to Login, past its rows", async () => {
    const { word, button, link } = renderNav("/");
    word("Docs").focus();
    await userEvent.tab();
    expect(button("Docs")).toHaveFocus();
    await userEvent.tab();
    expect(link("Login")).toHaveFocus();
  });

  it("stays open as Shift+Tab goes from its chevron back to its word", async () => {
    const { word, button } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.tab({ shift: true });
    expect(word("Docs")).toHaveFocus();
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    /* Escape from the word hands focus to the chevron, the menu's button. */
    await userEvent.keyboard("{Escape}");
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(button("Docs")).toHaveFocus();
  });

  it("closes when its word is followed", async () => {
    const { word, button, card } = renderNav("/docs");
    await userEvent.click(button("Docs"));
    expect(card("Docs").hidden).toBe(false);
    await userEvent.click(word("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(card("Docs").hidden).toBe(true);
  });

  it("lets Tab walk its rows, and closes as focus moves past the last one", async () => {
    const { button, card, link } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}");

    const rows = [...card("Docs").querySelectorAll("a")];
    for (const row of rows) {
      await userEvent.tab();
      expect(row).toHaveFocus();
    }
    await userEvent.tab();
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(link("Login")).toHaveFocus();
  });

  it("stays open as Shift+Tab goes back from its first row to its button", async () => {
    const { button } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    expect(button("Docs")).toHaveFocus();
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
  });

  it("does nothing with the arrow keys", async () => {
    const { button } = renderNav();
    button("Docs").focus();
    await userEvent.keyboard("{Enter}{ArrowDown}");
    expect(button("Docs")).toHaveFocus();
  });

  it("closes on a click outside it, and not on a click inside it", async () => {
    const { button, card } = renderNav();
    await userEvent.click(button("Docs"));

    await userEvent.click(card("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(document.body);
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when one of its rows is followed, the page's own row included", async () => {
    const { button, card } = renderNav("/docs");
    await userEvent.click(button("Docs"));
    const own = card("Docs").querySelector<HTMLAnchorElement>('a[aria-current="page"]')!;
    expect(own).toHaveAttribute("href", "/docs");

    await userEvent.click(own);
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(card("Docs").hidden).toBe(true);
  });

  it("closes when the window is resized", async () => {
    const { button } = renderNav();
    await userEvent.click(button("Docs"));
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("is shifted left by its overflow when it would run past the right edge", async () => {
    const { button, card } = renderNav();
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1001,
    });
    vi.spyOn(card("Docs"), "getBoundingClientRect").mockReturnValue({ right: 1000 } as DOMRect);

    await userEvent.click(button("Docs"));
    /* 1000 − (1001 − 16) = 15px over. */
    expect(card("Docs").style.marginLeft).toBe("-15px");
  });

  it("is left where it is when it fits", async () => {
    const { button, card } = renderNav();
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1001,
    });
    card("Docs").style.marginLeft = "-40px";
    vi.spyOn(card("Docs"), "getBoundingClientRect").mockReturnValue({ right: 983 } as DOMRect);

    await userEvent.click(button("Docs"));
    expect(card("Docs").style.marginLeft).toBe("");
  });
});

describe("a menu under a mouse", () => {
  beforeEach(() => {
    media.add(HOVER_QUERY);
    vi.useFakeTimers();
  });

  it("opens on hover over its word, which stays a link", () => {
    const { dd, button, word } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    expect(word("Docs")).toHaveAttribute("href", "/docs#coral");
  });

  it("opens on hover and closes 180ms after the pointer leaves", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseLeave(dd("Docs"));
    act(() => vi.advanceTimersByTime(100));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    act(() => vi.advanceTimersByTime(150));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("stays open when the pointer comes back in time", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.mouseLeave(dd("Docs"));
    act(() => vi.advanceTimersByTime(100));
    fireEvent.mouseEnter(dd("Docs"));
    act(() => vi.advanceTimersByTime(500));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps a hover-opened menu on a click that follows at once, and closes on a later one", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseLeave(dd("Docs"));
    act(() => vi.advanceTimersByTime(250));
    fireEvent.mouseEnter(dd("Docs"));
    act(() => vi.advanceTimersByTime(450));
    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("gives each hover-open its own 400ms, so an earlier one cannot cut it short", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.mouseLeave(dd("Docs"));
    act(() => vi.advanceTimersByTime(300));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");

    /* Back in at 300ms; the first hover's window would have ended at 400. */
    fireEvent.mouseEnter(dd("Docs"));
    act(() => vi.advanceTimersByTime(150));
    fireEvent.click(button("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
  });

  it("closes a hover-opened menu on Escape wherever focus is, and leaves focus there", () => {
    /* WCAG 1.4.13: content a hover shows can be put away without moving the
       pointer. The mock's script heard Escape only inside the menu. */
    const { dd, button, link } = renderNav();
    const login = link("Login");
    login.focus();
    fireEvent.mouseEnter(dd("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(login, { key: "Escape" });
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
    expect(login).toHaveFocus();

    fireEvent.mouseLeave(dd("Docs"));
    act(() => vi.advanceTimersByTime(250));

    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });

  it("leaves a hover-opened menu alone on any other key", () => {
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    fireEvent.keyDown(document.body, { key: "Tab" });
    expect(button("Docs")).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open on hover where the pointer cannot hover", () => {
    media.delete(HOVER_QUERY);
    const { dd, button } = renderNav();
    fireEvent.mouseEnter(dd("Docs"));
    expect(button("Docs")).toHaveAttribute("aria-expanded", "false");
  });
});

async function openDrawer(path = "/coral") {
  const view = renderNav(path);
  const toggle = view.getByRole("button", { name: "Open menu" });
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  return { ...view, toggle, drawer: view.container.querySelector<HTMLElement>(".nav-drop")! };
}

describe("the drawer", () => {
  it("lists the two product links, Assessment, the Docs group, then Login: five in all", () => {
    const { container } = renderNav("/");
    const drawer = container.querySelector(".nav-drop > .wrap")!;
    const items = [...drawer.children].map((el) =>
      el.matches(".nd-grp")
        ? `${text(el.querySelector("p.nd-h"))}: ${[...el.querySelectorAll(".nd-row a")]
            .map((a) => a.textContent)
            .join(", ")}`
        : text(el),
    );
    expect(items).toEqual([
      "Coral",
      "Amoeba",
      "Assessment",
      /* A group like the menu's. */
      amoebaDocs || amoebaOnePager
        ? "Docs: Coral, Amoeba, All, Zoorik Learn, Open source"
        : "Docs: Coral, All, Zoorik Learn, Open source",
      "Login",
    ]);
    /* Group labels are labels, not headings. */
    expect(drawer.querySelector("h2, h3, h4")).toBeNull();
    /* A product chip keeps its name out of translation on the chip; "All" is a word, and "Zoorik Learn" keeps
       only its "Zoorik" out, in a span of its own. */
    for (const chip of drawer.querySelectorAll(".nd-row a")) {
      expect(chip.getAttribute("translate"), text(chip)).toBe(
        chip.querySelector("svg") ? "no" : null,
      );
    }
  });

  it("is controlled by the toggle, which says what pressing it will do", async () => {
    const { toggle, drawer } = await openDrawer();
    expect(toggle).toHaveAttribute("aria-controls", drawer.id);
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(drawer).toHaveClass("open");
    /* Both icons are drawn; the CSS shows the X while it is open. */
    expect([...toggle.querySelectorAll("path")].map((p) => p.getAttribute("class"))).toEqual([
      "nt-open",
      "nt-close",
    ]);
  });

  it("closes on Escape and hands focus back to the toggle", async () => {
    const { toggle, drawer } = await openDrawer();
    drawer.querySelector("a")!.focus();

    await userEvent.keyboard("{Escape}");

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAccessibleName("Open menu");
    expect(drawer).not.toHaveClass("open");
    expect(toggle).toHaveFocus();
  });

  it("closes when one of its links is followed, a chip included", async () => {
    const { toggle, drawer } = await openDrawer();
    await userEvent.click(drawer.querySelector(".nd-row a")!);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(drawer).not.toHaveClass("open");
  });

  it("closes on a tap outside the bar", async () => {
    const { toggle, drawer } = await openDrawer();

    await userEvent.click(document.body);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(drawer).not.toHaveClass("open");
  });

  it("stays open on a tap inside the bar", async () => {
    const { toggle, container } = await openDrawer();

    await userEvent.click(container.querySelector(".nav-in")!);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when the bar widens past the breakpoint, where the CSS hides it", async () => {
    const { toggle, drawer } = await openDrawer();

    act(() => fireMedia("(min-width:1001px)", true));

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(drawer).not.toHaveClass("open");
  });
});

describe("focus under the fixed bar", () => {
  const keyboardFocus = (el: HTMLElement) => {
    const matches = el.matches.bind(el);
    vi.spyOn(el, "matches").mockImplementation((sel) => sel === ":focus-visible" || matches(sel));
  };

  it("scrolls a focused control out from under the bar by just enough", () => {
    const { container } = render(
      <>
        <SiteNav />
        <a href="/x">Below the fold</a>
      </>,
    );
    const bar = container.querySelector<HTMLElement>(".nav")!;
    const link = container.querySelector<HTMLAnchorElement>('a[href="/x"]')!;
    vi.spyOn(bar, "getBoundingClientRect").mockReturnValue({ bottom: 84 } as DOMRect);
    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({ top: 40, bottom: 60 } as DOMRect);
    const scrollBy = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    /* jsdom never matches :focus-visible; a keyboard focus is what this guards. */
    keyboardFocus(link);

    link.focus();

    /* 40 - 84 - 16: clear of the bar with 16px of air. */
    expect(scrollBy).toHaveBeenCalledWith(0, -60);
  });

  it("leaves a control the bar does not cover where it is", () => {
    const { container } = render(
      <>
        <SiteNav />
        <a href="/x">In view</a>
      </>,
    );
    const bar = container.querySelector<HTMLElement>(".nav")!;
    const link = container.querySelector<HTMLAnchorElement>('a[href="/x"]')!;
    vi.spyOn(bar, "getBoundingClientRect").mockReturnValue({ bottom: 84 } as DOMRect);
    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({ top: 300, bottom: 320 } as DOMRect);
    const scrollBy = vi.spyOn(window, "scrollBy").mockImplementation(() => {});
    keyboardFocus(link);

    link.focus();

    expect(scrollBy).not.toHaveBeenCalled();
  });
});
