import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { assessmentCopy } from "@/content/assessment";

import { AssessmentPage } from "./assessment-page";

/**
 * `/assessment` as the reader meets it: the hero and its one command to copy, What you get, What it does, Before you
 * run it and After the run. One command for Kubernetes and disks alike, so there is no product to choose.
 */

const text = (el: Element | null | undefined): string =>
  (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const at = (search: string) => window.history.replaceState(null, "", `/assessment${search}`);
const page = () => render(<AssessmentPage />).container;

beforeEach(() => at(""));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const copyButton = (container: HTMLElement) =>
  container.querySelector<HTMLButtonElement>(".ax-hero .ax-copy")!;
const live = (container: HTMLElement) =>
  container.querySelector('.ax-hero-r > [aria-live="polite"]');

describe("the hero", () => {
  it("opens on Built for, the h1 and its one line, and on the right the one command", () => {
    const hero = page().querySelector("header.hero.ax-hero")!;
    const badge = hero.querySelector(".ax-hero-t > .hero-badges > p.az-badge.hero-badge")!;
    expect(text(badge)).toBe("Built for Azure and AWS");
    expect(text(hero.querySelector(".ax-hero-t > .hero-badges + h1"))).toBe(
      "Cloud cost assessment",
    );
    expect(text(hero.querySelector(".ax-hero-t > h1 + p.doc-deck.ax-lead"))).toBe(
      "One command reads your Kubernetes clusters and VM disks, and writes one PDF of everything you could save.",
    );
    expect(hero.querySelector(".ax-lead + *")).toBeNull();
    /* On the right, What you get's terminal: its bar, then the one line. */
    const term = hero.querySelector(".ax-hero-in > .ax-hero-r > .ax-term.ax-cmds")!;
    expect(term.querySelector(":scope > .ax-term-bar")).toHaveAttribute("aria-hidden", "true");
    expect(term.querySelectorAll(":scope > .ax-term-bar > i")).toHaveLength(3);
    const line = term.querySelector(":scope > .ax-term-bar + .ax-line")!;
    expect(line.querySelector("pre")).toHaveAttribute("translate", "no");
    expect(text(line.querySelector("pre"))).toBe("$ npx zoorik assess");
    expect(line.querySelector('pre > i[aria-hidden="true"]')).toHaveTextContent("$");
    const copy = line.querySelector("pre + button.ax-copy")!;
    expect(copy).toHaveAttribute("type", "button");
    expect(copy).toHaveAttribute("aria-label", "Copy the command");
    expect(text(copy)).toBe("Copy");
    expect(hero.querySelectorAll("pre")).toHaveLength(1);
  });

  it("has no product switch, no product marks and no lines under the command", () => {
    const container = page();
    expect(container.querySelector('nav[aria-label="Product"], .ax-switch, .ax-pick')).toBeNull();
    expect(container.querySelector(".ax-hero .ax-pm, .ax-hero .ax-under, .ax-lines")).toBeNull();
    expect(document.documentElement.hasAttribute("data-ap")).toBe(false);
  });

  it("drops an older link's ?p= and ?c= from the address, and keeps the rest", () => {
    at("?p=amoeba&c=aws&utm_source=x#run");
    page();
    expect(window.location.search).toBe("?utm_source=x");
    expect(window.location.hash).toBe("#run");
    at("?p=coral");
    page();
    expect(window.location.search).toBe("");
  });

  it("copies the command and says Copied for 1.6s", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    vi.stubGlobal("isSecureContext", true);
    const container = page();
    const copy = copyButton(container);
    await act(async () => {
      copy.click();
    });
    expect(writeText).toHaveBeenLastCalledWith("npx zoorik assess");
    expect(copy).toHaveAttribute("data-done", "");
    expect(text(copy)).toBe("Copied");
    expect(text(live(container))).toBe("Copied");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });
    expect(copy).not.toHaveAttribute("data-done");
    expect(text(copy)).toBe("Copy");
  });

  it("names a copy that worked to Clarity, the action alone", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    vi.stubGlobal("isSecureContext", true);
    const clarity = vi.fn();
    vi.stubGlobal("clarity", clarity);
    const container = page();
    await act(async () => {
      copyButton(container).click();
    });
    expect(clarity).toHaveBeenCalledExactlyOnceWith("event", "assessment_command_copied");
  });

  it("selects the line and says to copy it with the keyboard when there is no clipboard", async () => {
    vi.stubGlobal("navigator", { ...navigator, clipboard: undefined });
    const clarity = vi.fn();
    vi.stubGlobal("clarity", clarity);
    const container = page();
    await act(async () => {
      copyButton(container).click();
    });
    /* Nothing was copied, so nothing is counted. */
    expect(clarity).not.toHaveBeenCalled();
    expect(text(live(container))).toBe("The line is selected; copy it with your keyboard.");
    expect(window.getSelection()?.toString()).toContain("npx zoorik assess");
  });
});

describe("What you get", () => {
  const demo = (container: HTMLElement) =>
    container.querySelector<HTMLElement>(".ax-get .ax-demo")!;

  it("puts the heading beside one run, its output and the example report", () => {
    const container = page();
    const section = container.querySelector("section#run")!;
    expect(section).toHaveClass("sec", "sec-band", "ax-get");
    expect(section).toHaveAttribute("aria-labelledby", "ax-get-h");
    expect(text(section.querySelector(".ax-get-in > .ax-head > h2#ax-get-h"))).toBe("What you get");
    expect(section.querySelectorAll(".ax-demo")).toHaveLength(1);
    expect(section.querySelector(".ax-get-in > .ax-head + .ax-demo")).not.toBeNull();
    const run = demo(container);
    expect(run.querySelector(".ax-term")).toHaveAttribute("aria-hidden", "true");
    expect([...run.querySelectorAll(".ax-term-b .ln")].map(text)).toEqual([
      "$ npx zoorik assess",
      "✓ 3 clusters and 10 VMs read",
      "Cost today $8,396 a month (example)",
      "Saving $3,530 a month (42%, example)",
      "Report zoorik-assessment-20261126-0930.pdf",
    ]);
    expect(
      [...run.querySelectorAll(".ax-term-b .ln.out .k + span")].map((s) => s.className),
    ).toEqual(["f", "v", "f"]);
  });

  it("offers the example report with its facts read from the file, and its own download name", () => {
    const run = demo(page());
    const dl = run.querySelector(".ax-file > .ax-file-t + a.ax-dl")!;
    expect(text(run.querySelector(".ax-file-t b"))).toBe("Example report");
    expect(run.querySelector(".ax-file-t span")!.textContent).toBe("PDF · 4 pages · 219\u00a0KB");
    expect(dl).toHaveAttribute("href", "/docs/assessment-example.pdf");
    expect(dl).toHaveAttribute("download", "zoorik-assessment-example.pdf");
    expect(dl).toHaveAttribute("aria-label", "Download the example report, PDF, 4 pages, 219 KB");
    expect(text(dl)).toBe("Download");
    expect(run.querySelector(".ax-file-th")).toBeNull();
  });

  it("draws the run finished, with nothing armed, where there is no IntersectionObserver or motion is reduced", () => {
    expect(demo(page())).not.toHaveClass("is-armed");
    vi.stubGlobal("IntersectionObserver", class {});
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    expect(demo(page())).not.toHaveClass("is-armed");
  });

  it("plays the run once as its terminal comes into view, then raises the report", async () => {
    vi.useFakeTimers();
    let fire: () => void = () => {};
    const observed: Element[] = [];
    let disconnected = false;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
          fire = () => callback([{ isIntersecting: true }]);
        }
        observe(target: Element) {
          observed.push(target);
        }
        disconnect() {
          disconnected = true;
        }
      },
    );
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const container = page();
    const run = demo(container);
    /* Armed: what is still to come is hidden, the command is empty, the card is down. */
    expect(run).toHaveClass("is-armed");
    expect(observed).toEqual([run.querySelector(".ax-term")]);
    expect(run.querySelectorAll(".ln.on")).toHaveLength(0);
    expect(text(run.querySelector(".ty"))).toBe("");
    expect(run.querySelector(".ax-file")).not.toHaveClass("on");

    act(() => fire());
    expect(disconnected).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(run.querySelectorAll(".ln.on")).toHaveLength(1);
    expect(run.querySelector(".ty.is-typing")).not.toBeNull();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20000);
    });
    expect(run.querySelectorAll(".ln.on")).toHaveLength(5);
    expect(run.querySelector(".ty.is-typing")).toBeNull();
    expect(text(run.querySelector(".ty"))).toBe("npx zoorik assess");
    expect(run.querySelector(".ax-file")).toHaveClass("on");
  });
});

describe("What it does", () => {
  it("says Reads, Runs and Sends, and under Nothing. the code on GitHub", () => {
    const section = page().querySelector("#what-it-does")!;
    expect(section).toHaveClass("sec", "oc");
    expect(text(section.querySelector("h2"))).toBe("What it does");
    expect([...section.querySelectorAll(".oc-facts dt")].map(text)).toEqual([
      "Reads",
      "Runs",
      "Sends",
    ]);
    const [reads, runs, sends] = [...section.querySelectorAll(".oc-facts dd")];
    expect(text(reads)).toBe(assessmentCopy.what.reads.text);
    expect(text(reads)).toMatch(/Never Secrets or ConfigMaps\.$/);
    expect(text(runs)).toBe(
      "az aks command invoke, only for a private AKS cluster or one limited to authorized IP ranges. A read of used space inside running Linux VMs, only after you answer y.",
    );
    expect([...runs!.querySelectorAll('code[translate="no"]')].map(text)).toEqual([
      "az aks command invoke",
      "y",
    ]);
    expect(text(sends!.querySelector(":scope > b"))).toBe("Nothing.");
    const code = sends!.querySelector<HTMLAnchorElement>(":scope > b + a.br")!;
    expect(text(code.querySelector(".br-t b"))).toBe("GitHub");
    expect(text(code.querySelector(".br-t > span"))).toBe("Open source · Apache-2.0");
    expect(code).toHaveAttribute("href", "https://github.com/getzoorik/assessment");
    expect(code.target).toBe("_blank");
    expect(section.querySelectorAll("a.br")).toHaveLength(1);
    expect(section.querySelector(".brs, .ro")).toBeNull();
  });
});

describe("Before you run it", () => {
  it("follows What it does and comes before After the run, three questions under its h2", () => {
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
      "A little over 5 minutes: it samples usage for 5 minutes. Private AKS clusters, many or large clusters, and many VMs take longer.",
    );
    expect([...access!.querySelectorAll(":scope > ul > li")].map(text)).toEqual([
      "AKS: read access to your clusters and the Azure Kubernetes Service Cluster User Role on each, plus Run Command for a private or IP-limited cluster.",
      "EKS: read-only EKS, EC2 and pricing actions, and an EKS access entry.",
      "Disks on Azure: Reader on the subscriptions, plus Run Command for the used-space read.",
      "Disks on AWS: read-only EC2, CloudWatch and pricing actions, plus Systems Manager Run Command for the used-space read.",
    ]);
    const [how, more] = [...saving!.querySelectorAll(":scope > p")];
    expect(text(how)).toBe(
      "Each Kubernetes step works on what the step before left: smaller pods, spare machines, cheaper machine types, packing across pools, fewer copies at quiet times, and spot. Disks are counted on their own, all at public list prices.",
    );
    const link = more!.querySelector("a.alink")!;
    expect(text(link)).toBe("How the estimate works (opens in a new tab)");
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/getzoorik/assessment#how-the-estimate-works",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("the page's description", () => {
  it("says what the assessment is in 143 characters, and never says bill", () => {
    const { description } = assessmentCopy.meta;
    expect(description).toBe(
      "A free, read-only assessment for AKS, EKS and block storage on Azure and AWS. One command in your terminal, one PDF with your estimated saving.",
    );
    expect(description).toHaveLength(143);
    expect(description).not.toMatch(/\bbill/i);
  });
});

describe("After the run", () => {
  it("offers the PDF to the founders and a booking with the people who build both products", () => {
    const section = page().querySelector("#after")!;
    expect(text(section.querySelector("h2"))).toBe("After the run");
    const card = section.querySelector(".as-grid > .as-card.as-mini")!;
    expect(text(card.querySelector("h3"))).toBe("Send us your PDF");
    expect(text(card.querySelector("p"))).toBe("A founder replies within 24 hours.");
    const mail = card.querySelector("a.btn-ink")!;
    expect(text(mail)).toBe("Email founders@zoorik.com");
    expect(mail).toHaveAttribute(
      "href",
      "mailto:founders@zoorik.com?subject=Cloud%20cost%20assessment",
    );
    const cal = section.querySelector(".as-grid > .as-card + .as-cal")!;
    expect(text(cal.querySelector("h3"))).toBe("Book 30 minutes");
    expect(text(cal.querySelector("p"))).toBe(
      "Walk through your report with the people who build Coral and Amoeba.",
    );
    expect([...cal.querySelectorAll('p [translate="no"]')].map(text)).toEqual(["Coral", "Amoeba"]);
    expect(cal.querySelector("a.cta-go")).toHaveAttribute("href", "https://cal.com/zoorik/talk");
    expect(cal.querySelector("a.cta-go")).toHaveAttribute("target", "_blank");
    expect(section.querySelector(".ax-foot")).toBeNull();
  });
});

describe("what the page no longer says", () => {
  it("names no per-product command, no Python, no PyPI and no Cloud Shell steps", () => {
    const container = page();
    const words = text(container.querySelector("main"));
    for (const gone of [
      "zoorik assess coral",
      "zoorik assess amoeba",
      "npx -y",
      "Choose what to assess",
      "PyPI",
      "pip install",
      "curl",
      "Read-only",
      "Sign in to your cloud first",
      "Manage files",
      "Talk to the builders",
    ]) {
      expect(words).not.toContain(gone);
    }
  });

  it("prerenders the one command and the finished run, with no first-paint script", () => {
    const html = renderToString(<AssessmentPage />);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("data-ap");
    expect(html).not.toContain("data-if-p");
    expect(html.match(/npx zoorik assess/g)).toHaveLength(2);
    expect(html).toMatch(/<div class="ax-demo">/);
    expect(html).toContain(
      'Walk through your report with the people who build <span translate="no">Coral</span> and <span translate="no">Amoeba</span>.',
    );
  });
});
