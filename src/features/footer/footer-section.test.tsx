import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

/* The footer reads the pathname for its one home-aware link, the wordmark. */
const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import { amoebaDocs } from "@/config/site";
import { FooterSection } from "@/features/footer/footer-section";

/**
 * The footer: what it claims,
 * where each link goes, and the one thing that differs between pages.
 *
 * Every check here is something a screenshot would pass: a mark drifting back
 * into the badge, Privacy sliding out of last place, a column link opening a
 * new tab without saying so, the canvas coming back.
 */
beforeEach(() => {
  pathname.current = "/";
});

const footerOf = (path = "/") => {
  pathname.current = path;
  return render(<FooterSection />).container;
};

const text = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("the footer's brand column", () => {
  it("says what Zoorik and each product do, Coral first, each name kept out of translation", () => {
    const line = footerOf().querySelector(".foot-brand > p:not(.az-badge)")!;
    expect(line.textContent).toBe(
      "Zoorik reduces cloud cost. Coral optimizes Kubernetes on AKS and EKS. Amoeba optimizes block storage on Windows and Linux VMs, on Azure and AWS.",
    );
    expect([...line.querySelectorAll('[translate="no"]')].map((el) => el.textContent)).toEqual([
      "Zoorik",
      "Coral",
      "Amoeba",
    ]);
  });

  it("makes one claim, Built for Azure and AWS, as one paragraph with both marks", () => {
    const badges = footerOf().querySelectorAll(".az-badge");
    expect(badges).toHaveLength(1);
    const badge = badges[0]!;
    expect(badge.tagName).toBe("P");
    expect(badge).toHaveClass("foot-badge");
    expect(text(badge)).toBe("Built for Azure and AWS");
    expect(badge.querySelector("b")).toHaveTextContent("Azure and AWS");
    /* The marks are aria-hidden SVGs with no text; only their names tell them apart. */
    expect([...badge.querySelectorAll("svg")].map((svg) => svg.getAttribute("data-mark"))).toEqual([
      "azure",
      "aws",
    ]);
    for (const svg of badge.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("puts Available in and the two marketplaces as buttons under the badge, to Zoorik's page in each store", () => {
    const brand = footerOf().querySelector(".foot-brand")!;
    const market = brand.querySelector(":scope > div.mkt-btns.foot-mb")!;
    expect(market.previousElementSibling).toHaveClass("foot-badge");
    /* The registries' row follows, then the social row. */
    expect(market.nextElementSibling).toHaveClass("foot-ib");
    expect(market.nextElementSibling!.nextElementSibling).toHaveClass("foot-social");
    /* The lead-in, then one button per store: the mark, the name, the hint, the arrow. */
    expect(market.firstElementChild).toHaveClass("mkt-on");
    expect(market.firstElementChild).toHaveTextContent("Available in");
    const buttons = [...market.querySelectorAll<HTMLAnchorElement>("a.mkt-b")];
    expect(buttons.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      [
        "AWS Marketplace (opens in a new tab)",
        "https://aws.amazon.com/marketplace/seller-profile?id=seller-mtaavozrqchlk",
      ],
      [
        "Microsoft Marketplace (opens in a new tab)",
        "https://marketplace.microsoft.com/en-us/partners/04f64eb0-8878-4f14-9578-bc5d104737e7/overview",
      ],
    ]);
    for (const a of buttons) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      expect(a.firstElementChild).toHaveClass("mkt-mk");
      expect(a.firstElementChild).toHaveAttribute("aria-hidden", "true");
      expect(a.lastElementChild).toHaveClass("ext");
    }
    expect(
      [...market.querySelectorAll(".mkt-mk")].map((svg) => svg.getAttribute("data-mark")),
    ).toEqual(["aws", "azure"]);
  });

  it("closes the brand column on the legal name and city, one muted line", () => {
    const brand = footerOf().querySelector(".foot-brand")!;
    const company = brand.lastElementChild!;
    expect(company.tagName).toBe("P");
    expect(company).toHaveClass("foot-co");
    expect(company.previousElementSibling).toHaveClass("foot-social");
    expect(company.textContent).toBe("Zoorik Private Limited · Bangalore, India");
    expect(company.querySelector('[translate="no"]')).toHaveTextContent("Zoorik");
  });

  it("gives the badge's and the button's Azure gradients ids of their own", () => {
    /* `url(#id)` resolves against the document: an id another Azure mark on the
       page shares would paint both with whichever the browser saw first. */
    const footer = footerOf();
    const ids = [...footer.querySelectorAll(".foot-badge [id], .foot-mb [id]")].map((el) => el.id);
    expect(ids).toEqual(["azA-footer", "azC-footer", "azA-mkt-footer", "azC-mkt-footer"]);
    expect(new Set([...footer.querySelectorAll("[id]")].map((el) => el.id)).size).toBe(
      footer.querySelectorAll("[id]").length,
    );
  });

  it("has no per-product tags, no technology chips and no canvas any more", () => {
    const footer = footerOf();
    expect(footer.querySelector(".foot-built, .foot-clouds, .fcloud")).toBeNull();
    expect(footer.querySelector("canvas")).toBeNull();
  });

  it("goes back to the top at home, and home from any other page", () => {
    const home = footerOf().querySelector(".brand")!;
    expect(home).toHaveAttribute("href", "#top");
    expect(home.hasAttribute("aria-label")).toBe(false);

    const away = footerOf("/coral").querySelector(".brand")!;
    expect(away).toHaveAttribute("href", "/");
    expect(away).toHaveAttribute("aria-label", "Zoorik home");
  });
});

describe("the footer's social row", () => {
  const tiles = () => [...footerOf().querySelectorAll<HTMLAnchorElement>(".foot-social > a.soc")];

  it("has five tiles, Reddit in its place; YouTube waits until it carries something", () => {
    expect(tiles().map((a) => a.getAttribute("aria-label"))).toEqual([
      "Zoorik on LinkedIn (opens in a new tab)",
      "Zoorik on X (opens in a new tab)",
      "Zoorik on Reddit (opens in a new tab)",
      "Zoorik on Medium (opens in a new tab)",
      "Zoorik on GitHub (opens in a new tab)",
    ]);
  });

  it("opens each in a new tab that cannot reach back, behind a hidden glyph", () => {
    for (const a of tiles()) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
      expect(a.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(a.textContent).toBe("");
    }
  });
});

describe("the footer's install line", () => {
  it("puts Install from and the five channels under the stores, each a line icon, its name and the new-tab arrow", () => {
    const brand = footerOf().querySelector(".foot-brand")!;
    const install = brand.querySelector(":scope > div.mkt-btns.foot-ib")!;
    expect(install.firstElementChild).toHaveClass("mkt-on");
    expect(install.firstElementChild).toHaveTextContent("Install from");
    const buttons = [...install.querySelectorAll<HTMLAnchorElement>("a.mkt-b")];
    expect(buttons.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["Homebrew (opens in a new tab)", "https://github.com/getzoorik/homebrew-tap"],
      ["Scoop (opens in a new tab)", "https://github.com/getzoorik/scoop-bucket"],
      ["PyPI (opens in a new tab)", "https://pypi.org/project/zoorik/"],
      [
        "Artifact Hub (opens in a new tab)",
        "https://artifacthub.io/packages/helm/zoorik/coral-agent",
      ],
      [
        "Terraform Registry (opens in a new tab)",
        "https://registry.terraform.io/namespaces/getzoorik",
      ],
    ]);
    for (const button of buttons) {
      expect(button).toHaveAttribute("target", "_blank");
      expect(button.querySelector("svg.mkt-mk.mkt-ln")).toHaveAttribute("aria-hidden", "true");
    }
  });
});

describe("the footer's columns", () => {
  const columns = (path = "/") =>
    [...footerOf(path).querySelectorAll(".foot-col")].map((col) => ({
      heading: [col.firstElementChild!.tagName, col.firstElementChild!.textContent],
      links: [...col.querySelectorAll<HTMLAnchorElement>(":scope > a")].map((a) => [
        text(a),
        a.getAttribute("href"),
      ]),
    }));

  it("are Products, Resources and Company, each titled by a paragraph, with the mock's links in its order", () => {
    expect(columns()).toEqual([
      {
        heading: ["P", "Products"],
        links: [
          ["Coral", "/coral"],
          ["Amoeba", "/amoeba"],
          ["Assessment", "/assessment"],
          ["Marketplaces", "/marketplaces"],
        ],
      },
      {
        heading: ["P", "Resources"],
        links: [
          ["Learn", "/learn"],
          ["Value Lab", "/value-lab"],
          ["Events", "/events"],
          ["News", "/news"],
          ["Cloud cost optimization tools", "/cloud-cost-optimization-library"],
          ["Community", "/community"],
          ["Docs", "/docs"],
          ["Open source", "/open-source"],
          ["Coral guide", "/coral/guide"],
          ["Coral FAQ", "/coral/faq"],
          ...(amoebaDocs
            ? [
                ["Amoeba guide", "/amoeba/guide"],
                ["Amoeba FAQ", "/amoeba/faq"],
              ]
            : []),
        ],
      },
      {
        heading: ["P", "Company"],
        links: [
          ["About", "/about"],
          ["Careers", "/careers"],
          ["Brand assets", "/brand-assets"],
          ["Referrals", "/referrals"],
          ["Partners", "/partners"],
          ["Design partners", "/design-partners"],
          ["Security", "/security"],
          ["Book a demo (opens in a new tab)", "https://cal.com/zoorik/talk"],
          ["founders@zoorik.com", "mailto:founders@zoorik.com"],
          ["Login", "/login"],
          ["Privacy", "/privacy"],
          ["Terms", "/terms"],
        ],
      },
    ]);
    /* The titles are labels: the footer adds nothing to the page's outline. */
    const footer = footerOf();
    expect(footer.querySelector("h1, h2, h3, h4")).toBeNull();
    for (const title of footer.querySelectorAll(".foot-col > :first-child")) {
      expect(title).toHaveClass("foot-h");
    }
  });

  it("are the same on every page: the plain assessment, and each product's guide and FAQ", () => {
    /* No `?p=` from a product's pages. */
    for (const path of ["/coral", "/amoeba", "/amoeba/guide", "/docs", "/learn", "/privacy"]) {
      expect(columns(path), path).toEqual(columns("/"));
    }
  });

  it("put Privacy then Terms last in Company, and nothing beside the copyright line", () => {
    const company = columns()[2]!.links;
    expect(company.slice(-2)).toEqual([
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ]);
    const bar = footerOf().querySelector(".foot-bar")!;
    expect(bar.children).toHaveLength(1);
    expect(bar.firstElementChild!.tagName).toBe("SMALL");
    expect(bar.textContent).toBe("© 2026 Zoorik");
    expect(bar.querySelector("a")).toBeNull();
  });

  it("keep the product names and the wordmark out of translation", () => {
    const footer = footerOf();
    const products = [...footer.querySelectorAll<HTMLAnchorElement>(".foot-col a[translate='no']")];
    expect(products.map((a) => a.textContent)).toEqual(["Coral", "Amoeba"]);
    /* "Coral guide": the label is one span, the name in it untranslated. */
    const named = [...footer.querySelectorAll(".foot-col a > span > span[translate='no']")];
    expect(named.map((el) => el.textContent)).toEqual(
      amoebaDocs ? ["Coral", "Coral", "Amoeba", "Amoeba"] : ["Coral", "Coral"],
    );
    expect(footer.querySelector(".foot-bar [translate='no']")).toHaveTextContent("Zoorik");
    expect(footer.querySelector(".brand [translate='no']")).toHaveTextContent("Zoorik");
  });

  it("mark the one link that leaves the site, to the eye and to the ear", () => {
    const footer = footerOf();
    const away = [...footer.querySelectorAll<HTMLAnchorElement>(".foot-col a[target]")];
    expect(away).toHaveLength(1);
    const demo = away[0]!;
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");
    /* The label and the hidden phrase in one span, then the arrow. */
    expect(demo.firstElementChild!.tagName).toBe("SPAN");
    expect(demo.querySelector(".sr-only")).toHaveTextContent("(opens in a new tab)");
    expect(demo.lastElementChild).toHaveClass("ext");
    expect(demo.lastElementChild).toHaveAttribute("aria-hidden", "true");
    /* Only that one carries the arrow: a page of this site and the mailto stay put. */
    expect(footer.querySelectorAll(".foot-col .ext")).toHaveLength(1);
  });

  it("go nowhere never: no bare # anywhere in the footer", () => {
    const dead = [...footerOf().querySelectorAll("a")].filter(
      (a) => a.getAttribute("href") === "#",
    );
    expect(dead).toEqual([]);
  });

  it("say so whenever they open a new tab", () => {
    for (const a of footerOf().querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')) {
      const name = a.getAttribute("aria-label") ?? a.textContent!;
      expect(name, a.getAttribute("href")!).toMatch(/\(opens in a new tab\)$/);
    }
  });
});
