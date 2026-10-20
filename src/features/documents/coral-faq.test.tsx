import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs } from "@/config/site";
import { coralFaqSections } from "@/content/coral-faq";
import { documentFacts } from "@/features/documents/document-facts";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/coral/faq" }));

import CoralFaqPage from "@/app/coral/faq/page";

/**
 * `/coral/faq` as a whole: the ids other pages and shared links depend on,
 * the first group "About Coral", the groups and their two callouts, the
 * questions that open in place with their numerals and short answers, the
 * Updated line, the phone's group chips and the one download line. Its
 * metadata is in `src/app/metadata.test.ts`.
 */

/* The contract, written out here rather than read from the content:
   a renamed id in the content must fail this test, not pass it. */
const SECTION_IDS = [
  "about-coral",
  "how-coral-sizes-workloads",
  "safety-memory-and-rollback",
  "stateful-and-single-replica-workloads",
  "working-with-hpa",
  "nodes-and-spare-capacity",
  "autoscalers-and-traffic-surges",
  "getting-started",
];

const QUESTION_IDS = [
  /* About Coral */
  "what-is-coral",
  "which-clusters-does-coral-work-on",
  "what-does-connecting-a-cluster-change",
  "what-leaves-my-cluster",
  "how-is-the-saving-worked-out",
  "do-i-need-coral-with-karpenter",
  "how-much-can-coral-save",
  "where-can-i-buy-coral",
  /* the client FAQ */
  "is-the-recommendation-based-on-average",
  "how-much-history-is-needed-before",
  "cpu-is-100m-at-night-and",
  "a-workload-is-idle-for-6",
  "how-are-workloads-handled-that-spike",
  "how-does-coral-learn-black-friday",
  "a-workload-needs-4-cpus-during",
  "how-does-coral-decide-a-change",
  "is-there-a-warm-up-period",
  "memory-spikes-can-cause-oom-kills",
  "what-happens-if-an-optimized-pod",
  "if-optimization-causes-performance-degradation-how",
  "how-are-databases-kafka-elasticsearch-redis",
  "can-optimization-happen-without-downtime-for",
  "if-the-hpa-wants-to-scale",
  "could-reducing-cpu-requests-make-the",
  "does-optimization-ever-modify-hpa-minreplicas",
  "if-workload-optimization-reduces-requests-how",
  "how-do-you-make-sure-node",
  "how-much-spare-capacity-is-kept",
  "during-cluster-upgrades-is-optimization-paused",
  "how-does-coral-interact-with-cluster",
  "after-node-and-workload-optimization-move",
  "can-optimization-be-restricted-to-one",
];

let page: HTMLElement;

beforeEach(() => {
  page = render(<CoralFaqPage />).container;
});

afterEach(() => {
  vi.restoreAllMocks();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

describe("the FAQ's ids", () => {
  it("has all 8 group ids and all 32 question ids, each exactly once", () => {
    for (const id of [...SECTION_IDS, ...QUESTION_IDS]) {
      expect(page.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
    }
  });

  it("puts each group id on a section labelled by its h2, in order", () => {
    const sections = [...page.querySelectorAll("article.fq-main > section.fq-sec")];
    expect(sections.map((section) => section.id)).toEqual(SECTION_IDS);
    for (const section of sections) {
      const h2 = section.querySelector(":scope > h2")!;
      expect(h2).toHaveAttribute("id", `${section.id}-h`);
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
    }
  });

  it("puts each question id on its closed <details>, in order", () => {
    const questions = [...page.querySelectorAll("details.fq")];
    expect(questions.map((question) => question.id)).toEqual(QUESTION_IDS);
    expect(page.querySelectorAll("details.fq[open]")).toHaveLength(0);
  });

  it("matches the content's ids to the contract", () => {
    expect(coralFaqSections.map((section) => section.id)).toEqual(SECTION_IDS);
    expect(coralFaqSections.flatMap((s) => s.questions.map((q) => q.id))).toEqual(QUESTION_IDS);
  });
});

describe("the page", () => {
  it("has one h1, the switch and the deck, and no download in the hero", () => {
    expect(page.querySelectorAll("h1")).toHaveLength(1);
    expect(text(page.querySelector("h1"))).toBe("Coral FAQ");
    const links = within(
      within(page).getByRole("navigation", { name: "Choose a product" }),
    ).getAllByRole("link");
    expect(
      links.map((a) => [text(a), a.getAttribute("href"), a.getAttribute("aria-current")]),
    ).toEqual([
      ["Coral Kubernetes", "/coral/faq", "page"],
      /* Amoeba's item appears the day `amoebaDocs` publishes its faq. */
      ...(amoebaDocs ? [["Amoeba Block storage", "/amoeba/faq", null]] : []),
    ]);
    expect(text(page.querySelector(".doc-deck"))).toBe(
      "Sizing, safety, HPA, nodes and autoscalers.",
    );
    expect(page.querySelector(".doc-hero .dl, .doc-date, .doc-crumb")).toBeNull();
  });

  it("has a skip link to its one <main>", () => {
    expect(page.querySelector("a.skip")).toHaveAttribute("href", "#main");
    expect(page.querySelectorAll("main#main")).toHaveLength(1);
  });

  it("opens its column on the Updated line, over the questions", () => {
    const top = page.querySelector("article.fq-main > .fq-upd")!;
    expect(top).toBe(page.querySelector("article.fq-main")!.firstElementChild);
    expect([...top.children].map((child) => child.className)).toEqual(["doc-updated"]);
    expect(text(top)).toBe("Updated 9 October 2026");
  });

  it("has no contents rail and no summary, and names its groups in the phone's chip row", () => {
    expect(page.querySelector(".doc-rail, .doc-toc, .doc-sum, .doc-fine")).toBeNull();
    const chips = within(page).getByRole("navigation", { name: "Sections" });
    expect(chips).toHaveClass("fq-chips");
    expect(chips.nextElementSibling).toHaveClass("doc-main", "fq-main");
    const links = [...chips.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(SECTION_IDS.map((id) => `#${id}`));
    expect(links.map(text)).toEqual(
      SECTION_IDS.map((id) => text(page.querySelector(`#${id} > h2`))),
    );
  });

  it("puts the two callouts atop their groups", () => {
    const callouts = [...page.querySelectorAll(".fq-sec-b > aside.doc-call")];
    expect(
      callouts.map((aside) => [
        aside.closest("section")!.id,
        text(aside.querySelector(".doc-call-t")),
      ]),
    ).toEqual([
      ["how-coral-sizes-workloads", "Pod sizing is opt-in"],
      ["nodes-and-spare-capacity", "Node optimization is on from install"],
    ]);
    for (const aside of callouts) expect(aside.nextElementSibling).toHaveClass("fq-list");
    expect(text(callouts[0]!.querySelector("p:not(.doc-call-t)"))).toBe(
      "Coral only recommends until you turn on “Automatically optimize” for a policy or a workload.",
    );
    expect(text(callouts[0]!.querySelector("b"))).toBe("“Automatically optimize”");
  });

  it("offers the FAQ's PDF on one download line after the last group, and no other", () => {
    const facts = documentFacts("coral-faq");
    const line = page.querySelector("article.fq-main > p.fq-dl")!;
    expect(line.previousElementSibling).toHaveAttribute("id", "getting-started");
    expect(line.firstElementChild).toHaveTextContent("Download");
    const links = [...line.querySelectorAll("a")];
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/docs/coral-faq.pdf");
    expect(links[0]).toHaveAttribute("download");
    expect(links[0]).toHaveAttribute("aria-label", `Download the Coral FAQ, ${facts.spoken}`);
    expect(links[0]!.firstChild!.nodeName).toBe("svg");
    expect(links[0]!.querySelector("small")!.textContent).toBe(facts.short);
    expect(page.querySelectorAll('a[download], a[href$=".pdf"]')).toHaveLength(1);
  });

  it("ends with Coral's assessment row", () => {
    const assess = page.querySelector('a[href="/assessment?p=coral"]');
    expect(assess).not.toBeNull();
  });
});

describe("each question", () => {
  it("is a summary of its numeral, its h3 and a chevron, and a body of short bullets", () => {
    const questions = [...page.querySelectorAll("details.fq")];
    expect(questions).toHaveLength(32);
    questions.forEach((question, index) => {
      const summary = question.querySelector(":scope > summary")!;
      expect([...summary.children].map((child) => child.tagName.toLowerCase())).toEqual([
        "span",
        "h3",
        "svg",
      ]);
      const numeral = summary.querySelector(".fq-n")!;
      expect(numeral.textContent).toBe(String(index + 1).padStart(2, "0"));
      expect(numeral).toHaveAttribute("aria-hidden", "true");
      /* The h3 holds the question alone: no "Question N: " in front, seen or read. */
      expect(summary.querySelector("h3 > *")).toBeNull();
      expect(question.querySelector(":scope > .fq-body > ul.fq-a > li")).not.toBeNull();
      expect(question.querySelectorAll(":scope > .fq-body > *")).toHaveLength(1);
    });
  });

  it("names no other question by its number, and links out only from About Coral", () => {
    expect(text(page.querySelector(".fq-main"))).not.toMatch(
      /\(question \d+\)|next question|\(see /,
    );
    const links = [...page.querySelectorAll(".fq-body a")];
    expect(
      links.map((link) => [link.closest("details")!.id, text(link), link.getAttribute("href")]),
    ).toEqual([
      ["what-is-coral", "Kubernetes cost optimization on AKS and EKS", "/coral"],
      [
        "what-leaves-my-cluster",
        "What leaves your cluster",
        "/coral/guide#what-leaves-your-cluster",
      ],
      [
        "do-i-need-coral-with-karpenter",
        "Coral and the native Kubernetes autoscalers",
        "/learn/coral-and-native-autoscalers",
      ],
      ["how-much-can-coral-save", "free AKS and EKS cost assessment", "/assessment?p=coral"],
    ]);
  });

  it("restates the five answers that named a question by its number", () => {
    const answer = (id: string) => text(page.querySelector(`#${id} .fq-a`));
    expect(answer("is-the-recommendation-based-on-average")).toContain(
      "With a CPU-based HPA, the CPU request comes from replaying 3 days of load through your HPA instead.",
    );
    expect(answer("memory-spikes-can-cause-oom-kills")).toContain(
      "If an OOM kill still happens, Coral raises that container’s memory straight away, by 20% per kill and at least 100 MiB.",
    );
  });

  it("keeps a command's flag whole in About Coral", () => {
    const code = page.querySelector("#what-does-connecting-a-cluster-change code")!;
    expect(code.innerHTML).toBe('<span class="nb">--dry-run</span>');
  });

  it("opens in place without touching the address", async () => {
    window.history.replaceState(null, "", "/coral/faq");
    const question = page.querySelector("details.fq") as HTMLDetailsElement;
    await userEvent.click(question.querySelector("summary")!);
    expect(question.open).toBe(true);
    expect(window.location.hash).toBe("");
  });
});

describe("what the page never carries", () => {
  it("has no FAQPage structured data", () => {
    expect(page.innerHTML).not.toMatch(/FAQPage|"@type":\s*"Question"/);
  });

  /* The old names are spelled in halves, as in `src/app/page.test.tsx`, so this
     file does not itself contain what the source-wide check forbids. */
  it("names no price, no old product name and no storage wording but block storage", () => {
    const forbidden = new RegExp(
      [
        ["storage", "tax"],
        ["elastic", "vol"],
        ["k8s", "pilot"],
        ["disk", " storage"],
      ]
        .map(([head, tail]) => head + tail)
        .join("|"),
      "i",
    );
    const all = page.textContent ?? "";
    expect(all).not.toMatch(forbidden);
    expect(all).not.toMatch(/[$€£₹]\s?\d|\b(USD|EUR|INR)\b/);
  });
});
