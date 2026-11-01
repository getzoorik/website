import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { assessmentCopy } from "@/content/assessment";

import { AssessmentPage } from "./assessment-page";
import { FIRST_PAINT_SCRIPT } from "./first-paint";

/**
 * `/assessment` as the reader meets it: the hero and its two lines to copy, What you get, What it
 * does, Before you run it and After the run, on Coral by default and on Amoeba with `?p=amoeba`,
 * every string the mock's.
 */

const text = (el: Element | null | undefined): string =>
  (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const at = (search: string) => window.history.replaceState(null, "", `/assessment${search}`);
const page = () => render(<AssessmentPage />).container;

beforeEach(() => {
  at("");
  document.documentElement.removeAttribute("data-ap");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const line = (container: HTMLElement, product: string) =>
  container.querySelector<HTMLElement>(`.ax-lines li[data-p="${product}"]`)!;

describe("the hero", () => {
  it("opens on Built for, the h1, the line and the switch, and on the right each product's one line, on Coral", () => {
    const hero = page().querySelector("header.hero.ax-hero")!;
    expect(hero.querySelector(".zk-art, .zk-glow")).toBeNull();
    const badge = hero.querySelector(".ax-hero-t > .hero-badges > p.az-badge.hero-badge")!;
    expect(text(badge)).toBe("Built for Azure and AWS");
    expect(badge.nextElementSibling).toBeNull();
    expect(hero.querySelector(".ax-hero-t > .hero-badges + h1")).not.toBeNull();
    /* The h1 does not say "Free"; the page's <title> keeps it. */
    expect(text(hero.querySelector("h1"))).toBe("Cloud cost assessment");
    /* Under the title, what the assessment is, set as the site's hero deck (W32). */
    expect(text(hero.querySelector(".ax-hero-t > h1 + p.doc-deck.ax-lead"))).toBe(
      "The free cloud cost assessment estimates what you could save on Kubernetes (AKS and EKS) or block storage on Azure and AWS. It’s read-only, runs in Cloud Shell or your terminal, and writes one PDF. It sends nothing to Zoorik.",
    );
    /* Then the line to choose over the switch. */
    const pick = hero.querySelector(".ax-hero-t > h1 + .ax-lead + .ax-pick")!;
    expect(text(pick.querySelector(":scope > p.ax-sub:first-child"))).toBe(
      "Choose the assessment you want.",
    );
    expect(pick.querySelector(":scope > p.ax-sub + nav.ax-switch")).not.toBeNull();
    const links = within(
      within(hero as HTMLElement).getByRole("navigation", { name: "Product" }),
    ).getAllByRole("link");
    expect(
      links.map((a) => [text(a), a.getAttribute("href"), a.getAttribute("aria-current")]),
    ).toEqual([
      ["Coral Kubernetes", "/assessment?p=coral", "page"],
      ["Amoeba Block storage", "/assessment?p=amoeba", null],
    ]);
    expect(hero.querySelector(".ax-chips")).toBeNull();
    /* On the right, What you get's terminal: its bar, then the lines. */
    const term = hero.querySelector(".ax-hero-in > .ax-hero-r > .ax-hero-run > .ax-term.ax-cmds")!;
    expect(text(term.querySelector(":scope > .ax-term-bar"))).toBe("Cloud Shell or your terminal");
    expect(term.querySelector(":scope > .ax-term-bar + ol.ax-lines")).not.toBeNull();
    /* Both lines are in the page; the sheet shows the one html[data-ap] names. */
    expect(
      [...hero.querySelectorAll(".ax-lines li")].map((li) => [
        li.getAttribute("data-p"),
        text(li.querySelector("pre")),
        li.querySelector(".ax-copy")!.getAttribute("aria-label"),
        li.querySelector('.ax-pm[aria-hidden="true"] svg') !== null,
      ]),
    ).toEqual([
      ["coral", "$ npx -y zoorik assess coral", "Copy the Coral command", true],
      ["amoeba", "$ npx -y zoorik assess amoeba", "Copy the Amoeba command", true],
    ]);
    expect(document.documentElement.getAttribute("data-ap")).toBe("coral");
    const [signIn, under] = [...hero.querySelectorAll(".ax-under")];
    /* Each cloud by its mark, its name kept for the ear. */
    expect(text(signIn)).toBe(
      "Sign in to your cloud first: Azure: az login or AWS: aws sso login in your terminal, or run it directly in Cloud Shell.",
    );
    for (const line of [signIn!, under!]) {
      expect(
        [...line.querySelectorAll(".ax-cl")].map((cl) => [
          cl.querySelector(":scope > svg")?.getAttribute("data-mark"),
          cl.querySelector(":scope > svg")?.getAttribute("class"),
          cl.querySelector(":scope > svg + .sr-only")?.textContent,
        ]),
      ).toEqual([
        ["azure", "az", "Azure: "],
        ["aws", "aws", "AWS: "],
      ]);
    }
    expect([...signIn!.querySelectorAll('code[translate="no"]')].map((c) => c.textContent)).toEqual(
      ["az login", "aws sso login"],
    );
    expect(text(under)).toBe(
      "In Cloud Shell, download your PDF from Azure: Manage files → Download or AWS: Actions → Download file.",
    );
    expect([...under!.querySelectorAll("b")].map((b) => b.textContent)).toEqual([
      "Manage files",
      "Download",
      "Actions",
      "Download file",
    ]);
  });

  it("shows only the chosen product's line, by the sheet, from the first paint on", () => {
    const css = readFileSync(join(process.cwd(), "src/styles/assessment.css"), "utf8");
    expect(css).toContain(
      'html:not([data-ap="amoeba"]) .ax-lines li[data-p="amoeba"],html[data-ap="amoeba"] .ax-lines li[data-p="coral"]{display:none}',
    );
  });

  it("opens on Amoeba with ?p=amoeba, and only the table's own keys pick a product", () => {
    at("?p=amoeba");
    const container = page();
    expect(document.documentElement.getAttribute("data-ap")).toBe("amoeba");
    expect(container.querySelector('.ax-switch a[aria-current="page"]')).toHaveAttribute(
      "href",
      "/assessment?p=amoeba",
    );
    for (const odd of ["?p=Amoeba", "?p=constructor", "?p=toString"]) {
      at(odd);
      render(<AssessmentPage />);
      expect(document.documentElement.getAttribute("data-ap")).toBe("coral");
    }
  });

  it("switches in place on an ordinary click, keeps the address's other parameters, and leaves a modified click alone", () => {
    at("?utm_source=x");
    const container = page();
    const amoeba = container.querySelector<HTMLAnchorElement>('.ax-switch a[href$="p=amoeba"]')!;
    expect(fireEvent.click(amoeba, { metaKey: true })).toBe(true);
    expect(document.documentElement.getAttribute("data-ap")).toBe("coral");
    expect(fireEvent.click(amoeba)).toBe(false);
    expect(document.documentElement.getAttribute("data-ap")).toBe("amoeba");
    expect(window.location.search).toBe("?utm_source=x&p=amoeba");
  });

  it("drops an older link's ?c= from the address, and opens the page all the same", () => {
    at("?p=amoeba&c=aws&utm_source=x");
    page();
    expect(window.location.search).toBe("?p=amoeba&utm_source=x");
    expect(document.documentElement.getAttribute("data-ap")).toBe("amoeba");
  });

  it("copies each product's line alone and says Copied for 1.6s", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    vi.stubGlobal("isSecureContext", true);
    const container = page();
    const coral = line(container, "coral").querySelector<HTMLButtonElement>(".ax-copy")!;
    await act(async () => {
      fireEvent.click(coral);
    });
    expect(writeText).toHaveBeenLastCalledWith("npx -y zoorik assess coral");
    expect(coral).toHaveAttribute("data-done", "");
    expect(text(coral)).toBe("Copied");
    expect(text(container.querySelector('.ax-hero-run [aria-live="polite"]'))).toBe("Copied");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(coral).not.toHaveAttribute("data-done");
    expect(text(coral)).toBe("Copy");
    await act(async () => {
      fireEvent.click(line(container, "amoeba").querySelector(".ax-copy")!);
    });
    expect(writeText).toHaveBeenLastCalledWith("npx -y zoorik assess amoeba");
  });

  it("names a copy that worked to Clarity, the action alone", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    vi.stubGlobal("isSecureContext", true);
    const clarity = vi.fn();
    vi.stubGlobal("clarity", clarity);
    const container = page();
    await act(async () => {
      fireEvent.click(line(container, "coral").querySelector(".ax-copy")!);
    });
    expect(clarity).toHaveBeenCalledExactlyOnceWith("event", "assessment_command_copied");
  });

  it("selects the line and says to copy it with the keyboard when there is no clipboard", async () => {
    vi.stubGlobal("navigator", { ...navigator, clipboard: undefined });
    const clarity = vi.fn();
    vi.stubGlobal("clarity", clarity);
    const container = page();
    await act(async () => {
      fireEvent.click(line(container, "coral").querySelector(".ax-copy")!);
    });
    /* Nothing was copied, so nothing is counted. */
    expect(clarity).not.toHaveBeenCalled();
    expect(text(container.querySelector('.ax-hero-run [aria-live="polite"]'))).toBe(
      "The line is selected; copy it with your keyboard.",
    );
    expect(window.getSelection()?.toString()).toContain("npx -y zoorik assess coral");
  });
});

describe("What you get", () => {
  const demos = (container: HTMLElement) => [
    ...container.querySelectorAll<HTMLElement>("#run .ax-demo"),
  ];

  it("shows Coral's run and Amoeba's, whatever the switch says, each with its example report", () => {
    at("?p=amoeba");
    const container = page();
    expect(text(container.querySelector("#run h2"))).toBe("What you get");
    const [coral, amoeba] = demos(container);
    expect(text(coral!.querySelector(".ax-demo-h"))).toBe("Coral Kubernetes");
    expect(text(amoeba!.querySelector(".ax-demo-h"))).toBe("Amoeba Block storage");
    expect([...coral!.querySelectorAll(".ax-term-b .ln")].map(text)).toEqual([
      "$ npx -y zoorik assess coral",
      "✓ 3 clusters read",
      "Estimated saving $2,668 a month",
      "Report zoorik-coral-assessment.pdf",
    ]);
    expect([...amoeba!.querySelectorAll(".ax-term-b .ln")].map(text)).toEqual([
      "$ npx -y zoorik assess amoeba",
      "✓ 8 VMs read",
      "Estimated saving $862 a month",
      "Report zoorik-amoeba-assessment.pdf",
    ]);
    for (const demo of [coral!, amoeba!]) {
      expect(demo.querySelector(".ax-term")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("offers each example report with its facts read from the file, and its own download name", () => {
    const [coral, amoeba] = demos(page());
    const card = (demo: HTMLElement) => ({
      thumb: demo.querySelector(".ax-file-th")!.getAttribute("src"),
      name: text(demo.querySelector(".ax-file-t b")),
      facts: demo.querySelector(".ax-file-t span")!.textContent,
      href: demo.querySelector(".ax-dl")!.getAttribute("href"),
      download: demo.querySelector(".ax-dl")!.getAttribute("download"),
      label: demo.querySelector(".ax-dl")!.getAttribute("aria-label"),
      button: text(demo.querySelector(".ax-dl")),
    });
    expect(card(coral!)).toEqual({
      thumb: "/reports/coral-assessment-page-1.webp",
      name: "zoorik-coral-assessment.pdf",
      facts: "Example report · PDF · 2 pages · 138 KB",
      href: "/docs/coral-assessment-example.pdf",
      download: "zoorik-coral-assessment-example.pdf",
      label: "Download the Coral example report, PDF, 2 pages, 138 KB",
      button: "Download",
    });
    expect(card(amoeba!)).toEqual({
      thumb: "/reports/amoeba-assessment-page-1.webp",
      name: "zoorik-amoeba-assessment.pdf",
      facts: "Example report · PDF · 2 pages · 107 KB",
      href: "/docs/amoeba-assessment-example.pdf",
      download: "zoorik-amoeba-assessment-example.pdf",
      label: "Download the Amoeba example report, PDF, 2 pages, 107 KB",
      button: "Download",
    });
  });

  it("draws both runs finished, with nothing armed, where there is no IntersectionObserver or motion is reduced", () => {
    for (const demo of demos(page())) expect(demo).not.toHaveClass("is-armed");
    vi.stubGlobal("IntersectionObserver", class {});
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    for (const demo of demos(page())) expect(demo).not.toHaveClass("is-armed");
  });

  it("plays each run once as it comes into view, Coral first and Amoeba 700ms later, then raises the report", async () => {
    vi.useFakeTimers();
    let fire: (targets: Element[]) => void = () => {};
    const unobserved: Element[] = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        targets: Element[] = [];
        constructor(callback: (entries: { isIntersecting: boolean; target: Element }[]) => void) {
          fire = (targets) => callback(targets.map((target) => ({ isIntersecting: true, target })));
        }
        observe(target: Element) {
          this.targets.push(target);
        }
        unobserve(target: Element) {
          unobserved.push(target);
        }
        disconnect() {}
      },
    );
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const container = page();
    const [coral, amoeba] = demos(container);
    /* Armed: what is still to come is hidden, the commands are empty, the card is down. */
    expect(coral).toHaveClass("is-armed");
    expect(coral!.querySelectorAll(".ln.on")).toHaveLength(0);
    expect(text(coral!.querySelector(".ty"))).toBe("");
    expect(coral!.querySelector(".ax-file")).not.toHaveClass("on");

    act(() => fire([coral!, amoeba!]));
    expect(unobserved).toEqual([coral, amoeba]);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(coral!.querySelectorAll(".ln.on").length).toBeGreaterThan(0);
    expect(amoeba!.querySelectorAll(".ln.on")).toHaveLength(0);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20000);
    });
    for (const demo of [coral!, amoeba!]) {
      expect(demo.querySelectorAll(".ln.on")).toHaveLength(4);
      expect(demo.querySelector(".ty.is-typing")).toBeNull();
      expect(demo.querySelector(".ax-file")).toHaveClass("on");
    }
    expect(text(coral!.querySelector(".ty"))).toBe("npx -y zoorik assess coral");
    expect(text(amoeba!.querySelector(".ty"))).toBe("npx -y zoorik assess amoeba");
  });
});

describe("What it does", () => {
  it("says Reads, Runs, only when and Sends, the GitHub and PyPI cards, and Read-only · Sends nothing", () => {
    const section = page().querySelector("#what-it-does")!;
    expect(section).toHaveClass("sec", "oc");
    expect(text(section.querySelector("h2"))).toBe("What it does");
    expect([...section.querySelectorAll(".oc-facts dt")].map(text)).toEqual([
      "Reads",
      "Runs, only when",
      "Sends",
    ]);
    expect([...section.querySelectorAll(".oc-facts dd")].map(text)).toEqual([
      "Nodes, pods, ReplicaSets and Jobs, 3 minutes of usage and list prices. Never Secrets or ConfigMaps.",
      "az aks command invoke, only when kubectl can’t reach an AKS cluster.",
      "Nothing.",
    ]);
    expect(section.querySelector('.oc-facts dd code[translate="no"]')).toHaveTextContent(
      "az aks command invoke",
    );
    const cards = [...section.querySelectorAll<HTMLAnchorElement>(".brs a.br")];
    expect(
      cards.map((a) => [
        text(a.querySelector(".br-t b")),
        text(a.querySelector(".br-t span")),
        a.getAttribute("href"),
        a.target,
      ]),
    ).toEqual([
      ["GitHub", "Open source · Apache-2.0", "https://github.com/getzoorik/assessment", "_blank"],
      ["PyPI", "Published as zoorik", "https://pypi.org/project/zoorik/", "_blank"],
    ]);
    expect(text(section.querySelector(".brs .ro"))).toBe("Read-only · Sends nothing");
  });

  it("says what Amoeba's script reads and runs on the Amoeba page", () => {
    at("?p=amoeba");
    const section = page().querySelector("#what-it-does")!;
    expect([...section.querySelectorAll(".oc-facts dd")].slice(0, 2).map(text)).toEqual([
      "Your VMs, their disks, 14 days of disk activity and list prices.",
      "A read of used space inside running Linux VMs, only after you answer y.",
    ]);
  });
});

describe("Before you run it", () => {
  it("follows What it does and comes before After the run, three questions under its h2, the same on both products", () => {
    for (const search of ["", "?p=amoeba"]) {
      /* One page at a time: jsdom finds an id in the document's first copy. */
      cleanup();
      at(search);
      const container = page();
      const section = container.querySelector("section#before-you-run")!;
      expect(section).toHaveClass("sec", "ax-before");
      expect(section.previousElementSibling).toBe(container.querySelector("#what-it-does"));
      expect(section.nextElementSibling).toBe(container.querySelector("#after"));
      expect(section).toHaveAttribute("aria-labelledby", "ax-before-h");
      expect(text(section.querySelector(".ax-head > h2#ax-before-h"))).toBe("Before you run it");
      const questions = [...section.querySelectorAll(".ax-qs > .ax-q")];
      expect(questions.map((question) => text(question.querySelector(":scope > h3")))).toEqual([
        "How long does it take?",
        "What access does it need?",
        "How is the saving worked out?",
      ]);
      const [time, access, saving] = questions.map((question) =>
        question.querySelector(":scope > .ax-a")!,
      );
      expect(text(time!.querySelector(":scope > p"))).toBe(
        "A Kubernetes run samples usage for 3 minutes by default, so it takes a little over 3 minutes. Private AKS clusters, and many or large clusters, take longer.",
      );
      /* The three access answers are a short list. */
      expect([...access!.querySelectorAll(":scope > ul > li")].map(text)).toEqual([
        "For AKS, it needs read access to your clusters and the Azure Kubernetes Service Cluster User Role on each.",
        "For EKS, it needs read-only EKS, EC2 and pricing actions, and an EKS access entry.",
        "For block storage on Azure, it needs Reader on the subscriptions, plus Run Command for the used-space read.",
      ]);
      expect(text(saving!.querySelector(":scope > p"))).toBe(
        "It sets each container’s request from its peak use, then works out how many nodes the pods need. The saving is (nodes today − nodes needed) × hourly list price × 730.",
      );
    }
  });
});

describe("the page's description", () => {
  it("says what the assessment is in 159 characters, and never says bill", () => {
    const { description } = assessmentCopy.meta;
    expect(description).toBe(
      "Free cloud cost assessment for Kubernetes and block storage on Azure and AWS: a read-only cloud cost analysis, run in Cloud Shell or your terminal, in one PDF.",
    );
    expect(description).toHaveLength(159);
    expect(description).not.toMatch(/\bbill/i);
  });
});

describe("After the run", () => {
  it("offers the PDF to the founders and a booking, on the product's terms, then the code and the estimate", () => {
    const section = page().querySelector("#after")!;
    expect(text(section.querySelector("h2"))).toBe("After the run");
    const card = section.querySelector(".as-card")!;
    expect(text(card.querySelector("h3"))).toBe("Send us your PDF");
    expect(text(card.querySelector("p"))).toBe("A founder replies within 24 hours.");
    const mail = card.querySelector("a.btn-ink")!;
    expect(text(mail)).toBe("Email founders@zoorik.com");
    expect(mail).toHaveAttribute("href", "mailto:founders@zoorik.com?subject=Coral%20assessment");
    const cal = section.querySelector(".as-cal")!;
    expect(text(cal.querySelector("h3"))).toBe("Book 30 minutes");
    expect(text(cal.querySelector("p"))).toBe(
      "Walk through your report with the people who build Coral and Amoeba.",
    );
    expect([...cal.querySelectorAll('p [translate="no"]')].map(text)).toEqual(["Coral", "Amoeba"]);
    expect(cal.querySelector("a.cta-go")).toHaveAttribute("href", "https://cal.com/zoorik/talk");
    expect(cal.querySelector("a.cta-go")).toHaveAttribute("target", "_blank");
    expect(
      [...section.querySelectorAll<HTMLAnchorElement>(".ax-foot a")].map((a) => [
        text(a),
        a.getAttribute("href"),
      ]),
    ).toEqual([
      ["Read the code (opens in a new tab)", "https://github.com/getzoorik/assessment"],
      [
        "How the estimate works (opens in a new tab)",
        "https://github.com/getzoorik/assessment#how-the-estimate-works",
      ],
    ]);
  });

  it("follows Amoeba: the mail's subject and the estimate's section; the booking line names both", () => {
    at("?p=amoeba");
    const section = page().querySelector("#after")!;
    expect(section.querySelector(".as-card a.btn-ink")).toHaveAttribute(
      "href",
      "mailto:founders@zoorik.com?subject=Amoeba%20assessment",
    );
    expect(text(section.querySelector(".as-cal p"))).toBe(
      "Walk through your report with the people who build Coral and Amoeba.",
    );
    expect(section.querySelectorAll(".ax-foot a")[1]).toHaveAttribute(
      "href",
      "https://github.com/getzoorik/assessment#how-the-estimate-works-1",
    );
  });
});

describe("what the page no longer says", () => {
  it("has no curl, pip, one Python file, e-mail, chips, steps, cloud cards or closing row", () => {
    const container = page();
    const words = text(container.querySelector("main"));
    for (const gone of [
      "curl",
      "one Python file",
      "One Python file",
      "e-mail",
      "Talk to the builders",
      "Estimate your Kubernetes saving",
      "Choose the cloud",
      "What the script does",
      "pip install",
      "Successfully installed",
      "Any laptop, any OS",
      "Your terminal or Cloud Shell",
    ]) {
      expect(words).not.toContain(gone);
    }
    expect(container.querySelector('input[name="as-cloud"], .as-steps, .as-what')).toBeNull();
  });
});

describe("the first paint", () => {
  it("sets html[data-ap] from ?p= before anything is painted", () => {
    at("?p=amoeba");
    new Function(FIRST_PAINT_SCRIPT)();
    expect(document.documentElement.getAttribute("data-ap")).toBe("amoeba");
    at("?p=nope");
    new Function(FIRST_PAINT_SCRIPT)();
    expect(document.documentElement.getAttribute("data-ap")).toBe("coral");
  });

  it("prerenders both products' lines, for the attribute to pick, and the switch marked to follow it", () => {
    const html = renderToString(<AssessmentPage />);
    expect(html).toMatch(/<li data-p="coral">.*npx -y zoorik assess coral/);
    expect(html).toMatch(/<li data-p="amoeba">.*npx -y zoorik assess amoeba/);
    /* The booking line is one sentence before hydration: both names, no per-product copies. */
    expect(html).toContain(
      'Walk through your report with the people who build <span translate="no">Coral</span> and <span translate="no">Amoeba</span>.',
    );
    expect(html).not.toContain('<span data-if-p="coral"><span translate="no">Coral</span></span>');
    expect(html).toMatch(/<nav class="as-switch ax-switch" aria-label="Product" data-boot="">/);
  });
});
