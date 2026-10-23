import { readFileSync } from "node:fs";

import { act, fireEvent, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs } from "@/config/site";
import { documentFacts } from "@/features/documents/document-facts";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/coral/guide" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import { DocCommandWell } from "@/features/documents/doc-command-well";
import { DocOsWell, type DocOsOption } from "@/features/documents/doc-os-well";
import { DocumentBody } from "@/features/documents/document-body";
import { CONTENTS_LINE } from "@/features/documents/document-contents";
import { DocRow } from "@/features/doc-rows/doc-rows";
import { DocumentFolds } from "@/features/documents/document-folds";
import { DocumentHero } from "@/features/documents/document-hero";
import { DocumentPage } from "@/features/documents/document-page";
import {
  DocCallout,
  DocCode,
  DocProse,
  DocSection,
  DocSteps,
  DocTable,
} from "@/features/documents/prose";

/**
 * The documents section's shared pieces, as the guide, the FAQ and /privacy
 * use them. The pages
 * have their own files (`coral-guide.test.tsx`, `coral-faq.test.tsx`,
 * `docs-hub.test.tsx`, `privacy-policy.test.tsx`).
 */

beforeEach(() => {
  pathname.current = "/coral/guide";
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** The kit's sheet, comments removed: a few rules here are contracts the DOM cannot show. */
const documentsSheet = (): string =>
  readFileSync("src/styles/documents.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

describe("the document hero", () => {
  const hero = () =>
    render(
      <DocumentHero
        title="Product guide"
        deck="How to connect a cluster."
        productSwitch={{ menu: "guide", current: "coral" }}
        downloads={[{ label: "PDF", document: "coral-guide" }]}
      />,
    ).container;

  it("is a dark .hero with no photograph, opening on the turning mark", () => {
    const header = hero().querySelector("header")!;
    expect(header).toHaveClass("hero", "doc-hero");
    expect(header).toHaveAttribute("id", "top");
    expect(header.querySelector("img, .hero-photo")).toBeNull();
    const [glow, art, wrap] = [...header.children];
    expect(glow).toHaveClass("zk-glow");
    expect(art).toHaveClass("zk-art");
    expect(wrap).toHaveClass("wrap", "hero-in");
  });

  it("reads h1, Choose a product and the product switch, then the deck, with no breadcrumb, date or second line", () => {
    const container = hero();
    const column = container.querySelector(".doc-hero-grid > div")!;
    expect([...column.children].map((el) => el.tagName + "." + el.className)).toEqual([
      "H1.",
      "P.ax-pick",
      "NAV.as-switch ax-switch",
      "P.doc-deck",
    ]);
    /* The line names the switch. */
    expect(column.querySelector("nav")).toHaveAttribute("aria-labelledby", "ax-pick");
    expect(text(column.querySelector("#ax-pick"))).toBe("Choose a product");
    expect(text(container.querySelector("h1"))).toBe("Product guide");
    expect(container.querySelector(".doc-crumb, .doc-date, .doc-q")).toBeNull();
  });

  it("draws the switch as page links, Coral alone while the Amoeba documents are held", () => {
    const nav = within(hero()).getByRole("navigation", { name: "Choose a product" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => [text(a), a.getAttribute("href")])).toEqual([
      ["Coral Kubernetes", "/coral/guide"],
      /* Amoeba's item appears the day `amoebaDocs` publishes its guide. */
      ...(amoebaDocs ? [["Amoeba Block storage", "/amoeba/guide"]] : []),
    ]);
    expect(links[0]).toHaveAttribute("aria-current", "page");
    /* The name is kept out of translation; the category is translated. */
    expect(links[0]!.querySelector('span[translate="no"]')).toHaveTextContent("Coral");
    expect(links[0]!.querySelector("small")).toHaveTextContent("Kubernetes");
    expect(links[0]!.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("offers one download row, its facts read from the file", () => {
    const facts = documentFacts("coral-guide");
    const rows = hero().querySelectorAll(".dl > a.dl-r");
    expect(rows).toHaveLength(1);
    const row = rows[0]!;
    expect(row).toHaveAttribute("href", "/docs/coral-product-guide.pdf");
    expect(row).toHaveAttribute("download");
    expect(row).toHaveAttribute("aria-label", `Download the Coral product guide, ${facts.spoken}`);
    expect(text(row.querySelector(".dl-t"))).toBe("PDF");
    expect(row.querySelector(".dl-f")!.textContent).toBe(facts.short);
    expect(facts.spoken).toMatch(/^PDF, \d+ pages?, [\d.]+ (MB|KB), A4$/);
  });

  it("draws the title and deck alone on a page with no switch and no file", () => {
    const { container } = render(<DocumentHero title="Docs" deck="Read online." />);
    expect([...container.querySelector(".hero-in")!.children].map((el) => el.tagName)).toEqual([
      "H1",
      "P",
    ]);
    expect(container.querySelector(".as-switch, .dl, .doc-hero-grid")).toBeNull();
  });
});

describe("the document body", () => {
  const contents = [
    { id: "how-coral-works", label: "How Coral works" },
    { id: "stay-in-control", label: "Stay in control" },
  ];

  const body = () =>
    render(
      <DocumentBody contents={contents}>
        <DocProse>
          <DocSection id="how-coral-works" title="How Coral works" lede="Coral rebalances.">
            <p>Text.</p>
          </DocSection>
          <DocSection id="stay-in-control" title="Stay in control">
            <p>Switches.</p>
          </DocSection>
        </DocProse>
      </DocumentBody>,
    ).container;

  it("is a .sec, so the closing row after it sits as the mock draws it", () => {
    const root = body().firstElementChild!;
    expect(root).toHaveClass("sec", "doc-body");
    expect(root.querySelector(":scope > .wrap > .doc-layout > nav.doc-rail")).not.toBeNull();
    expect(
      root.querySelector(":scope > .wrap > .doc-layout > article.doc-main > details.doc-toc"),
    ).not.toBeNull();
  });

  it("lists the sections twice, the rail and the folded contents, each a list in a labelled nav", () => {
    const container = body();
    const navs = within(container).getAllByRole("navigation", { name: "On this page" });
    expect(navs).toHaveLength(2);
    for (const nav of navs) {
      expect(nav.querySelector("ol")).toHaveAttribute("role", "list");
      const links = [...nav.querySelectorAll("ol a")];
      expect(links.map((a) => a.getAttribute("href"))).toEqual([
        "#how-coral-works",
        "#stay-in-control",
      ]);
      expect(links.every((a) => a.classList.contains("rl"))).toBe(true);
    }
  });

  it("closes the folded contents when one of its links is followed", async () => {
    const details = body().querySelector("details.doc-toc") as HTMLDetailsElement;
    details.open = true;
    await userEvent.click(within(details).getByRole("link", { name: "Stay in control" }));
    expect(details.open).toBe(false);
  });

  describe("the rail's current section", () => {
    /** Puts each section's top where a test wants it. */
    function place(container: HTMLElement, tops: Record<string, number>) {
      for (const [id, top] of Object.entries(tops)) {
        vi.spyOn(container.querySelector(`#${id}`)!, "getBoundingClientRect").mockReturnValue({
          top,
        } as DOMRect);
      }
    }
    const current = (container: HTMLElement) =>
      container.querySelector(".doc-rail a[aria-current='true']")?.getAttribute("href");
    /** How far down the page can scroll: jsdom lays nothing out, so every page reads 0 tall, at its bottom. */
    function pageHeight(height: number) {
      vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(height);
    }
    beforeEach(() => pageHeight(5000));

    it("is the last section whose top has passed 140px", () => {
      expect(CONTENTS_LINE).toBe(140);
      /* A frame that runs at once and leaves no frame pending. */
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((step) => {
        step(0);
        return 0;
      });
      const container = body();
      place(container, { "how-coral-works": -400, "stay-in-control": 140 });
      act(() => void window.dispatchEvent(new Event("scroll")));
      expect(current(container)).toBe("#stay-in-control");
      place(container, { "how-coral-works": -400, "stay-in-control": 141 });
      act(() => void window.dispatchEvent(new Event("scroll")));
      expect(current(container)).toBe("#how-coral-works");
    });

    it("is the first section while the reader is above them all", () => {
      /* A frame that runs at once and leaves no frame pending. */
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((step) => {
        step(0);
        return 0;
      });
      const container = body();
      place(container, { "how-coral-works": 600, "stay-in-control": 2000 });
      act(() => void window.dispatchEvent(new Event("scroll")));
      expect(current(container)).toBe("#how-coral-works");
    });

    it("is the last section at the bottom of the page, though its top never reached the line", () => {
      /* A frame that runs at once and leaves no frame pending. */
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((step) => {
        step(0);
        return 0;
      });
      const container = body();
      place(container, { "how-coral-works": -400, "stay-in-control": 300 });
      act(() => void window.dispatchEvent(new Event("scroll")));
      expect(current(container)).toBe("#how-coral-works");
      /* The mocks' rule, with their 2px of slack. */
      pageHeight(window.innerHeight + window.scrollY + 2);
      act(() => void window.dispatchEvent(new Event("scroll")));
      expect(current(container)).toBe("#stay-in-control");
    });
  });

  it("ends the rail on Back to top, which scrolls up, drops the hash and focuses main", async () => {
    const { container } = render(
      <main id="main" tabIndex={-1}>
        <DocumentBody contents={contents}>
          <p>Body</p>
        </DocumentBody>
      </main>,
    );
    window.history.replaceState(null, "", "/coral/guide#stay-in-control");
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const top = within(container.querySelector(".doc-rail") as HTMLElement).getByRole("link", {
      name: "Back to top",
    });
    expect(top).toHaveAttribute("href", "#top");
    expect(top).toHaveClass("alink", "doc-top");
    await userEvent.click(top);
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    expect(window.location.hash).toBe("");
    expect(window.location.pathname).toBe("/coral/guide");
    expect(document.activeElement).toBe(container.querySelector("#main"));
  });
});

/* The fold script (`DocumentFolds`) opens the numbered rows (`DocRow`) the guides,
   FAQs, /terms and /security draw: a link into one, an address that names one. */
describe("the rows that open in place", () => {
  const folds = () =>
    render(
      <>
        <article className="doc-main">
          <section id="workload-optimization">
            <h2>Workload optimization</h2>
            <DocRow
              id="how-a-workload-gets-its-policy"
              n={1}
              title="How a workload gets its policy"
              prose
            >
              <p>
                See <a href="#per-workload-settings">Per-workload settings</a>.
              </p>
            </DocRow>
            <DocRow id="per-workload-settings" n={2} title="Per-workload settings" prose>
              <p>Add the annotation.</p>
            </DocRow>
          </section>
          <section id="disconnect">
            <h2>Disconnect</h2>
            <p>
              See <a href="#workload-optimization">Workload optimization</a>.
            </p>
          </section>
        </article>
        <DocumentFolds />
      </>,
    ).container;

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("puts the id on a closed <details>, its h3 in the summary with no id", () => {
    const fold = folds().querySelector("#per-workload-settings")!;
    expect(fold.tagName).toBe("DETAILS");
    expect(fold).toHaveClass("fq", "gd-row");
    expect(fold).not.toHaveAttribute("open");
    const summary = fold.querySelector(":scope > summary")!;
    expect(summary.querySelector("h3")).not.toHaveAttribute("id");
    expect(text(summary.querySelector("h3"))).toBe("Per-workload settings");
    expect(summary.querySelector("svg.fq-chev")).toHaveAttribute("aria-hidden", "true");
    expect(fold.querySelector(":scope > .fq-body")).toHaveTextContent("Add the annotation.");
  });

  it("opens the fold a link leads into, keeps the one it came from open, and writes the hash", async () => {
    window.history.replaceState(null, "", "/coral/guide");
    const container = folds();
    const from = container.querySelector("#how-a-workload-gets-its-policy") as HTMLDetailsElement;
    from.open = true;
    await userEvent.click(within(from).getByRole("link", { name: "Per-workload settings" }));
    const to = container.querySelector("#per-workload-settings") as HTMLDetailsElement;
    expect(to.open).toBe(true);
    expect(from.open).toBe(true);
    expect(document.activeElement).toBe(to.querySelector("summary"));
    expect(window.location.hash).toBe("#per-workload-settings");
    expect(to.scrollIntoView).toHaveBeenCalled();
  });

  it("leaves a link to an open section to the site's in-page script", () => {
    const container = folds();
    const link = within(container.querySelector("#disconnect") as HTMLElement).getByRole("link");
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
  });

  it("leaves a modified click to the browser", () => {
    const container = folds();
    const from = container.querySelector("#how-a-workload-gets-its-policy") as HTMLDetailsElement;
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, metaKey: true });
    within(from).getByRole("link").dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect((container.querySelector("#per-workload-settings") as HTMLDetailsElement).open).toBe(
      false,
    );
  });

  it("opens the fold an address names on arrival, and nothing else", () => {
    window.history.replaceState(null, "", "/coral/guide#per-workload-settings");
    const container = folds();
    const open = [...container.querySelectorAll("details[open]")].map((d) => d.id);
    expect(open).toEqual(["per-workload-settings"]);
  });

  it("opens the fold a hash change names", () => {
    const container = folds();
    window.history.replaceState(null, "", "/coral/guide#how-a-workload-gets-its-policy");
    act(() => void window.dispatchEvent(new HashChangeEvent("hashchange")));
    expect(
      (container.querySelector("#how-a-workload-gets-its-policy") as HTMLDetailsElement).open,
    ).toBe(true);
  });

  it("opens every fold to print, and puts each back after", () => {
    const { container } = render(
      <article className="doc-main">
        <DocRow id="one" n={1} title="One">
          <p>1</p>
        </DocRow>
        <DocRow id="two" n={2} title="Two">
          <p>2</p>
        </DocRow>
        <DocumentFolds />
      </article>,
    );
    const [one, two] = [...container.querySelectorAll("details")] as HTMLDetailsElement[];
    two!.open = true;
    act(() => void window.dispatchEvent(new Event("beforeprint")));
    expect([one!.open, two!.open]).toEqual([true, true]);
    act(() => void window.dispatchEvent(new Event("afterprint")));
    expect([one!.open, two!.open]).toEqual([false, true]);
  });
});

describe("the prose kit", () => {
  it("keeps a stacking table a table, with explicit roles and a label on every cell", () => {
    const { container } = render(
      <DocTable
        columns={[
          { label: "Engine", width: "24%" },
          { label: "What it does", width: "76%" },
        ]}
        rows={[["Workload optimization", "Right-sizes requests."]]}
      />,
    );
    const table = within(container).getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((th) => th.textContent),
    ).toEqual(["Engine", "What it does"]);
    expect(within(table).getAllByRole("rowgroup")).toHaveLength(2);
    expect(
      within(table)
        .getAllByRole("cell")
        .map((td) => td.getAttribute("data-label")),
    ).toEqual(["Engine", "What it does"]);
    expect([...container.querySelectorAll("col")].map((col) => col.style.width)).toEqual([
      "24%",
      "76%",
    ]);
  });

  it("keeps each cell's content in one block, so a stacked cell is its label and one item", () => {
    const { container } = render(
      <DocTable
        columns={[{ label: "Key" }, { label: "Effect" }]}
        rows={[
          [
            "coral.zoorik.com/ignore",
            <>
              Coral leaves the pod <code>as it is</code>.
            </>,
          ],
        ]}
      />,
    );
    for (const cell of container.querySelectorAll("td")) {
      expect(cell.childNodes).toHaveLength(1);
      expect(cell.firstElementChild!.tagName).toBe("DIV");
    }
  });

  it("marks a continuation table, whose header stays in the markup for screen readers", () => {
    const { container } = render(
      <DocTable continuation columns={[{ label: "Page" }]} rows={[["Optimization"]]} />,
    );
    expect(container.querySelector("table")).toHaveClass("doc-tbl", "is-cont");
    expect(container.querySelector("thead th")).toHaveTextContent("Page");
  });

  it("draws a callout as one kind of aside, its title a plain line with no glyph", () => {
    const { container } = render(
      <>
        <DocCallout title="Review it first">
          <p>Add a flag.</p>
        </DocCallout>
        <DocCallout>
          <p>Once a snapshot is deleted, it cannot be recovered.</p>
        </DocCallout>
      </>,
    );
    const [titled, bare] = [...container.querySelectorAll("aside")];
    expect(titled).toHaveClass("doc-call");
    expect(text(titled!.querySelector(".doc-call-t"))).toBe("Review it first");
    expect(bare!.querySelector(".doc-call-t")).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
    const rules = documentsSheet().match(/\.doc-call-t\{[^}]*\}/g) ?? [];
    expect(rules.join("")).not.toMatch(/display:\s*(inline-)?flex/);
  });

  it("keeps each command-line flag in inline code whole", () => {
    const { container } = render(
      <>
        <DocCode>systemctl disable --now amoeba-agent</DocCode>
        <DocCode>{"--kube-context <name>"}</DocCode>
      </>,
    );
    const codes = [...container.querySelectorAll("code")];
    expect(codes.map((code) => [...code.querySelectorAll(".nb")].map(text))).toEqual([
      ["--now"],
      ["--kube-context"],
    ]);
  });

  it("breaks a guide's code after its dots and slashes, and holds short hyphenated names whole", () => {
    const { container } = render(
      <>
        <DocCode breaks>zoorik.com/login</DocCode>
        <DocCode breaks>zoorikctl cluster grant-node-deletion</DocCode>
        <DocCode breaks>{"--kube-context <name>"}</DocCode>
        <DocCode breaks>app.kubernetes.io/part-of=zoorik-agent</DocCode>
      </>,
    );
    const codes = [...container.querySelectorAll("code")];
    expect(codes.map((code) => code.textContent)).toEqual([
      "zoorik.com/login",
      "zoorikctl cluster grant-node-deletion",
      "--kube-context <name>",
      "app.kubernetes.io/part-of=zoorik-agent",
    ]);
    expect(codes[0]!.innerHTML).toBe("zoorik.<wbr>com/<wbr>login");
    expect(codes.map((code) => [...code.querySelectorAll(".nb")].map(text))).toEqual([
      [],
      ["grant-node-deletion"],
      ["--kube-context"],
      ["part-of=zoorik-agent"],
    ]);
    expect(codes[3]!.querySelectorAll("wbr")).toHaveLength(3);
  });

  it("names a section by its h2 only when asked", () => {
    const { container } = render(
      <DocProse className="pp-prose">
        <DocSection id="who-we-are" title="1. Who we are" labelled />
        <DocSection id="scope" title="2. What this policy covers" />
      </DocProse>,
    );
    expect(container.firstElementChild).toHaveClass("doc-prose", "pp-prose");
    const [named, plain] = [...container.querySelectorAll("section")];
    expect(named).toHaveAttribute("aria-labelledby", "who-we-are-h");
    expect(plain!.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("numbers steps from a counter, as a list that keeps its semantics", () => {
    const { container } = render(
      <DocSteps
        steps={[
          { title: "Connect", body: <p>One command.</p> },
          { title: "Watch", body: <p>Figures.</p> },
        ]}
      />,
    );
    const list = container.querySelector("ol.doc-steps")!;
    expect(list).toHaveAttribute("role", "list");
    expect([...list.querySelectorAll(":scope > li > div > .doc-st")].map(text)).toEqual([
      "Connect",
      "Watch",
    ]);
    expect(documentsSheet()).toContain("content:counter(st,decimal-leading-zero)");
  });

  it("gives the plain numbered lists their numerals and bottom margin back from the reset", () => {
    expect(documentsSheet()).toContain(
      ".doc-prose ol:not(.doc-steps){margin-top:16px;padding-left:1.4em;list-style:decimal;margin-bottom:1em}",
    );
  });

  it("guards the shared well's rules to the documents while /assessment draws its own", () => {
    const rules = documentsSheet()
      .split("}")
      .filter((rule) => /\.as-(well|copy)/.test(rule));
    expect(rules.length).toBeGreaterThan(0);
    /* Guarded, or reached only through a document's own well or OS block. */
    for (const rule of rules) expect(rule, rule).toMatch(/:where\(\.doc-well\)|\.doc-well |\.os /);
  });
});

describe("a command well", () => {
  it("prints each line after its prompt, which is hidden and not copied, and has no button", () => {
    const { container } = render(
      <DocCommandWell
        prompt="$ "
        lines={['zoorikctl cluster connect --connect-token="zoorik_v1_…" --api-region="us"']}
        note="Your own command comes from the console."
      />,
    );
    const well = container.querySelector(".as-well")!;
    expect(well).toHaveClass("doc-well", "is-line");
    expect(well.querySelector("pre i")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("button, [aria-live]")).toBeNull();
    expect(container.querySelector(".doc-well-note")).toHaveTextContent("Your own command");
  });

  it("lets the YAML well scroll inside itself, with no prompt", () => {
    const { container } = render(
      <DocCommandWell yaml prompt="$ " lines={["metadata:", "  annotations:"]} />,
    );
    const well = container.querySelector(".as-well")!;
    expect(well).toHaveClass("doc-well", "is-yaml");
    expect(well).not.toHaveClass("is-line");
    expect(container.querySelector("pre i")).toBeNull();
    expect(container.querySelector("pre")!.textContent).toBe("metadata:\n  annotations:");
  });

  it("takes keyboard focus while it overflows, and fades only while more line remains", () => {
    const { container } = render(<DocCommandWell prompt="$ " lines={["zoorikctl cluster x"]} />);
    const pre = container.querySelector("pre")!;
    expect(pre).not.toHaveAttribute("tabindex");
    Object.defineProperty(pre, "scrollWidth", { value: 600, configurable: true });
    Object.defineProperty(pre, "clientWidth", { value: 300, configurable: true });
    fireEvent.scroll(pre);
    expect(pre).toHaveClass("is-clip");
    Object.defineProperty(pre, "scrollLeft", { value: 300, configurable: true });
    fireEvent.scroll(pre);
    expect(pre).not.toHaveClass("is-clip");
  });
});

describe("the install's OS switch", () => {
  const OPTIONS: readonly DocOsOption[] = [
    {
      os: "mac",
      name: "macOS",
      prompt: "$ ",
      lines: ["brew tap getzoorik/tap", "brew install zoorikctl"],
    },
    {
      os: "linux",
      name: "Linux",
      prompt: "$ ",
      lines: ["curl -fsSL https://get.zoorik.com/linux | sh"],
    },
    {
      os: "windows",
      name: "Windows",
      prompt: "PS> ",
      lines: ["irm https://get.zoorik.com/windows.ps1 | iex"],
    },
  ];

  function agent(userAgent: string, platform: string) {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);
    vi.spyOn(navigator, "platform", "get").mockReturnValue(platform);
  }

  const well = () => render(<DocOsWell options={OPTIONS} />);

  it("is a radio group over one well with one copy button", () => {
    agent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel");
    const { container, getByRole } = well();
    const group = getByRole("radiogroup", { name: "Operating system" });
    const radios = within(group).getAllByRole("radio");
    expect(
      radios.map((radio) => [text(radio), radio.getAttribute("aria-checked"), radio.tabIndex]),
    ).toEqual([
      ["macOS", "true", 0],
      ["Linux", "false", -1],
      ["Windows", "false", -1],
    ]);
    expect(container.querySelectorAll(".as-well.doc-well")).toHaveLength(1);
    expect(container.querySelector("pre")!.textContent).toBe(
      "$ brew tap getzoorik/tap\n$ brew install zoorikctl",
    );
    expect(getByRole("button", { name: "Copy the macOS command" })).toHaveTextContent("Copy");
  });

  it.each([
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Win32", "Windows"],
    ["Mozilla/5.0 (X11; Linux x86_64)", "Linux x86_64", "Linux"],
    ["Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)", "Linux x86_64", "Linux"],
    ["Mozilla/5.0 (Linux; Android 14; Pixel 8)", "Linux armv8l", "macOS"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", "macOS"],
  ])("picks the visitor's system first: %s", (userAgent, platform, expected) => {
    agent(userAgent, platform);
    const { getByRole } = well();
    expect(getByRole("radio", { checked: true })).toHaveTextContent(expected);
  });

  it("follows a click, and arrows, Home and End move the choice and focus, wrapping", async () => {
    agent("Mozilla/5.0 (Macintosh)", "MacIntel");
    const { container, getByRole } = well();
    await userEvent.click(getByRole("radio", { name: "Linux" }));
    expect(container.querySelector("pre")!.textContent).toBe(
      "$ curl -fsSL https://get.zoorik.com/linux | sh",
    );
    expect(container.querySelector(".as-copy")).toHaveAttribute(
      "aria-label",
      "Copy the Linux command",
    );
    getByRole("radio", { name: "Linux" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(getByRole("radio", { name: "Windows" }));
    expect(container.querySelector("pre")!.textContent).toBe(
      "PS> irm https://get.zoorik.com/windows.ps1 | iex",
    );
    await userEvent.keyboard("{ArrowDown}");
    expect(getByRole("radio", { checked: true })).toHaveTextContent("macOS");
    await userEvent.keyboard("{ArrowUp}");
    expect(getByRole("radio", { checked: true })).toHaveTextContent("Windows");
    await userEvent.keyboard("{Home}");
    expect(getByRole("radio", { checked: true })).toHaveTextContent("macOS");
    await userEvent.keyboard("{End}");
    expect(getByRole("radio", { checked: true })).toHaveTextContent("Windows");
    expect(document.activeElement).toBe(getByRole("radio", { name: "Windows" }));
  });

  it("copies the command without prompts, says Copied for 1.6s and announces it once", async () => {
    agent("Mozilla/5.0 (Macintosh)", "MacIntel");
    vi.useFakeTimers({ shouldAdvanceTime: true });
    Object.defineProperty(window, "isSecureContext", { value: true, configurable: true });
    /* user-event puts its own clipboard on the navigator: spy on it after setup. */
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    const { container, getByRole } = well();
    const button = getByRole("button", { name: "Copy the macOS command" });
    await user.click(button);
    expect(writeText).toHaveBeenCalledWith("brew tap getzoorik/tap\nbrew install zoorikctl");
    expect(button).toHaveTextContent("Copied");
    expect(button).toHaveAttribute("data-done");
    expect(button).toHaveAttribute("aria-label", "Copy the macOS command");
    const live = container.querySelector("[aria-live='polite']")!;
    expect(live).toHaveTextContent("Copied");
    /* The clock also runs in real time here, so the edges are checked with room to spare. */
    act(() => void vi.advanceTimersByTime(1400));
    expect(button.textContent).toBe("Copied");
    act(() => void vi.advanceTimersByTime(200));
    expect(button.textContent).toBe("Copy");
    expect(button).not.toHaveAttribute("data-done");
    expect(live.textContent).toBe("");
    await user.click(button);
    await user.click(getByRole("radio", { name: "Linux" }));
    expect(container.querySelector(".as-copy")).not.toHaveAttribute("data-done");
  });

  it("stores nothing: no cookie and no browser storage", async () => {
    agent("Mozilla/5.0 (Macintosh)", "MacIntel");
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { getByRole } = well();
    await userEvent.click(getByRole("radio", { name: "Windows" }));
    expect(setItem).not.toHaveBeenCalled();
    expect(document.cookie).toBe("");
    const source = [
      "doc-os-well.tsx",
      "document-contents.tsx",
      "document-folds.tsx",
      "faq-chips.tsx",
    ]
      .map((file) => readFileSync(`src/features/documents/${file}`, "utf8"))
      .join("\n");
    expect(source).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
  });
});

describe("a document page's chrome", () => {
  it("marks Docs current and opens the assessment on its product, in the nav and the closing row", () => {
    pathname.current = "/coral/guide";
    const { container } = render(
      <DocumentPage hero={{ title: "Product guide", deck: "Deck." }} product="coral">
        <p>Body</p>
      </DocumentPage>,
    );
    /* Product guide and FAQ left the header: a guide is in Docs, which is no page of it. */
    expect(container.querySelector("a.nv-lbl.is-cur")).toHaveTextContent("Docs");
    expect(container.querySelector("a.nv-lbl.is-cur")).not.toHaveAttribute("aria-current");
    expect(container.querySelector("#assess .btn-ink")).toHaveAttribute(
      "href",
      "/assessment?p=coral",
    );
    /* Nothing on a document page rises: the row's cards are drawn still. */
    expect(container.querySelectorAll("#assess .rise, #assess [data-i]")).toHaveLength(0);
    expect(text(container.querySelector("#contact p"))).toBe(
      "Thirty minutes with the people who build Coral.",
    );
  });

  it("leaves out the closing assessment row when a page asks", () => {
    pathname.current = "/privacy";
    const { container } = render(
      <DocumentPage hero={{ title: "Privacy policy", deck: "Deck." }} assessmentRow={false}>
        <DocumentBody contents={[{ id: "who-we-are", label: "Who we are" }]}>
          <p>Body</p>
        </DocumentBody>
      </DocumentPage>,
    );
    expect(container.querySelector("#assess, #contact")).toBeNull();
    expect(container.querySelector("footer.site-foot")).not.toBeNull();
  });

  it("prints a document without the bar, the skip link, the mark, the closing row or the footer", () => {
    expect(documentsSheet()).toContain(
      "body:has(.doc-main) :is(.nav,.skip,.zk-art,.zk-glow,#assess,.site-foot){display:none}",
    );
  });
});
