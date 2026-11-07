import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { amoebaDocs } from "@/config/site";
import { amoebaFaqPage, amoebaFaqQuestionIds, amoebaFaqSections } from "@/content/amoeba-faq";
import { Faq } from "@/features/documents/faq";

/* The nav and the footer read the pathname; the route's `notFound()` stays real. */
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => "/amoeba-faq",
}));

import AmoebaFaqPage from "@/app/amoeba-faq/page";

/**
 * `/amoeba-faq`: the ids shared links depend on, the first group "About
 * Amoeba", the groups and their two callouts, the 30 questions that open in
 * place with their short answers, no fact still to come, and what the page
 * never carries. The body is rendered on its own, as it renders whatever
 * the flag says; the route is checked held (404) and, with the flag mocked on,
 * published. Its metadata is in `src/app/metadata.test.ts`.
 */

/* The contract, written out here rather than read from the content:
   a renamed id in the content must fail this test, not pass it. */
const SECTION_IDS = [
  "about-amoeba",
  "safety-and-data",
  "downtime-and-performance",
  "expanding-when-data-grows",
  "the-agent",
  "platforms-and-disk-types",
  "costs-and-savings",
  "getting-started",
];

const QUESTION_IDS = [
  "what-is-amoeba",
  "which-disks-does-amoeba-work-on",
  "what-does-onboarding-a-vm-change",
  "do-my-applications-need-changes",
  "how-much-can-amoeba-save",
  "how-do-i-get-amoeba",
  "can-a-shrink-lose-data",
  "what-happens-if-the-switch-onto",
  "can-i-go-back-to-my",
  "which-resources-does-amoeba-delete",
  "is-there-downtime",
  "does-the-copy-slow-down-my",
  "what-disk-performance-does-the-pool",
  "how-fast-does-amoeba-expand-when",
  "when-does-amoeba-shrink-the-pool",
  "does-manual-stop-amoeba-from-expanding",
  "what-happens-if-the-agent-stops",
  "what-does-the-agent-send-to",
  "how-is-the-agent-installed-and",
  "which-linux-distributions-does-amoeba-support",
  "does-amoeba-work-on-windows-vms",
  "does-amoeba-work-on-aws",
  "which-disk-types-does-the-pool",
  "how-is-the-saving-worked-out",
  "do-i-pay-for-both-sets",
  "what-does-amoeba-cost",
  "how-do-i-see-what-my",
  "can-i-start-with-one-vm",
  "what-does-amoeba-need-in-my",
  "what-does-amoeba-need-on-aws",
];

/* The bullets per question, 01 to 30. */
const BULLETS = [
  3, 3, 5, 2, 3, 2, 4, 4, 3, 4, 3, 2, 4, 3, 5, 1, 4, 6, 3, 3, 1, 2, 5, 4, 3, 3, 3, 2, 3, 4,
];

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

describe("the body", () => {
  let page: HTMLElement;

  beforeEach(() => {
    page = render(<Faq updated={amoebaFaqPage.updated} sections={amoebaFaqSections} />).container;
  });

  describe("its ids", () => {
    it("has all 8 group ids and all 30 question ids, each exactly once", () => {
      for (const id of [...SECTION_IDS, ...QUESTION_IDS]) {
        expect(page.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
      }
    });

    it("puts each group id on a section labelled by its h2, in order", () => {
      const sections = [...page.querySelectorAll("article.fq-main > section.fq-sec")];
      expect(sections.map((section) => section.id)).toEqual(SECTION_IDS);
      expect(sections.map((section) => text(section.querySelector(":scope > h2")))).toEqual([
        "About Amoeba",
        "Data safety",
        "Downtime and performance",
        "Expanding and shrinking",
        "The agent",
        "Platforms and disk types",
        "Costs and savings",
        "Getting started",
      ]);
      for (const section of sections) {
        expect(section.querySelector(":scope > h2")).toHaveAttribute("id", `${section.id}-h`);
        expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      }
    });

    it("puts each question id on its closed <details>, in order", () => {
      const questions = [...page.querySelectorAll("details.fq")];
      expect(questions.map((question) => question.id)).toEqual(QUESTION_IDS);
      expect(page.querySelectorAll("details.fq[open]")).toHaveLength(0);
    });

    it("matches the content's ids to the contract", () => {
      expect(amoebaFaqSections.map((section) => section.id)).toEqual(SECTION_IDS);
      expect(amoebaFaqSections.flatMap((s) => s.questions.map((q) => q.id))).toEqual(QUESTION_IDS);
      expect([...amoebaFaqQuestionIds]).toEqual(QUESTION_IDS);
    });
  });

  it("names its groups in the phone's chip row, ahead of the article", () => {
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
        text(aside.querySelector("p:not(.doc-call-t)")),
      ]),
    ).toEqual([
      [
        "downtime-and-performance",
        "No downtime to grow or shrink",
        "The pool stays mounted while it grows and shrinks. Only the move onto the pool restarts the services that use the data mounts.",
      ],
      [
        "expanding-when-data-grows",
        "Expands run on their own",
        "Amoeba expands a pool on its own as it fills. Only shrinks can wait for you, in “Manual”.",
      ],
    ]);
    for (const aside of callouts) expect(aside.nextElementSibling).toHaveClass("fq-list");
  });

  it("opens its column on the Updated line, over the questions", () => {
    const top = page.querySelector("article.fq-main > .fq-upd")!;
    expect(top).toBe(page.querySelector("article.fq-main")!.firstElementChild);
    expect(text(top)).toBe("Updated 8 November 2026");
  });

  it("ends with the ask line after question 30: no download line, no PDF, and links out only where an answer needs it", () => {
    const article = page.querySelector("article.fq-main")!;
    const ask = article.lastElementChild!;
    expect(ask).toHaveClass("fq-ask");
    expect(ask.previousElementSibling).toHaveAttribute("id", "getting-started");
    expect(text(ask.firstElementChild)).toBe("Didn’t find your answer?");
    const link = ask.querySelector("a")!;
    expect(link).toHaveAttribute(
      "href",
      "https://zoorik.atlassian.net/helpcenter/support/contact-us/dfec30ca-e82d-46b0-aa27-05d1b48d5d25",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(link)).toBe("Ask a question (opens in a new tab)");
    expect(page.querySelector(".fq-dl, a[download], a[href$='.pdf']")).toBeNull();
    expect(
      [...page.querySelectorAll(".fq-body a, .doc-call a")].map((a) => [
        a.closest("details")!.id,
        text(a),
        a.getAttribute("href"),
      ]),
    ).toEqual([
      ["what-is-amoeba", "block storage optimization", "/amoeba"],
      ["what-is-amoeba", "btrfs", "/learn/glossary/btrfs"],
      ["what-does-onboarding-a-vm-change", "Amoeba product guide", "/amoeba-guide"],
      ["how-much-can-amoeba-save", "free assessment", "/assessment?p=amoeba"],
      ["how-much-can-amoeba-save", "Amoeba case study", "/amoeba-value-lab"],
      [
        "when-does-amoeba-shrink-the-pool",
        "Amoeba troubleshooting",
        "/amoeba-troubleshooting#amoeba-has-not-rightsized-my-disks-yet",
      ],
      ["what-does-amoeba-cost", "priced per GB it manages", "/pricing"],
      ["how-do-i-see-what-my", "block storage cost assessment", "/assessment?p=amoeba"],
    ]);
  });

  describe("each question", () => {
    it("is a summary of its numeral, its h3 and a chevron, and a body of short bullets", () => {
      const questions = [...page.querySelectorAll("details.fq")];
      expect(questions).toHaveLength(30);
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
        expect(question.querySelectorAll(":scope > .fq-body > *")).toHaveLength(1);
        expect(
          question.querySelectorAll(":scope > .fq-body > ul.fq-a > li"),
          question.id,
        ).toHaveLength(BULLETS[index]!);
      });
    });

    it("keeps the mock's typography: curly quotes, apostrophes, and a no-break space before a unit", () => {
      /* No figure in an answer carries a unit today; one that comes back takes a no-break space. */
      expect(page.textContent).not.toMatch(
        /\d (?:h|GiB|GB|MiB|MB|TiB|days?|hours?|minutes?|seconds?)\b/,
      );
      const snapshot = page.querySelector("#can-i-go-back-to-my li:nth-child(2)")!.textContent!;
      expect(snapshot).toBe(
        "It deletes the disk only after that snapshot is complete, and keeps the snapshot for 7\u00a0days.",
      );
      expect(text(page.querySelector("#does-manual-stop-amoeba-from-expanding h3"))).toBe(
        "Does “Manual” stop Amoeba from expanding?",
      );
    });

    it("opens in place without touching the address", async () => {
      window.history.replaceState(null, "", "/amoeba-faq");
      const question = page.querySelector("details.fq") as HTMLDetailsElement;
      await userEvent.click(question.querySelector("summary")!);
      expect(question.open).toBe(true);
      expect(window.location.hash).toBe("");
    });
  });

  it("answers every question: no fact is still to come", () => {
    expect(page.querySelectorAll(".ph")).toHaveLength(0);
    expect(page.textContent).not.toContain("To come");
  });

  describe("what it never carries", () => {
    it("has no internal answer, no detail disclosure and no FAQPage data", () => {
      const html = page.innerHTML;
      for (const internal of [
        "More detail",
        "Less detail",
        "In detail",
        "A shrink runs in 8 steps",
        "rollback receipt",
        "curl -fsSL",
        "systemctl",
        "technical",
      ]) {
        expect(html, internal).not.toContain(internal);
      }
      expect(html).not.toMatch(/FAQPage|"@type":\s*"Question"/);
      expect(page.querySelector(".fq-more, .fq-detail")).toBeNull();
    });

    /* The old names are spelled in halves, as in `src/app/page.test.tsx`, so this
       file does not itself contain what the source-wide check forbids. */
    it("names no price, no old product name, no retired wording and no dash", () => {
      const forbidden = new RegExp(
        [
          ["storage", "tax"],
          ["elastic", "vol"],
          ["k8s", "pilot"],
          ["disk", " storage"],
          ["rightsiz", ""],
          ["rebalanc", ""],
        ]
          .map(([head, tail]) => head + tail)
          .join("|"),
        "i",
      );
      const all = page.textContent ?? "";
      expect(all).not.toMatch(forbidden);
      expect(all).not.toMatch(/[$€£₹]\s?\d|\b(USD|EUR|INR)\b/);
      /* No dash in the prose; the one en dash is the saving's range, "50–60%". */
      expect(all.replace(/(\d)–(\d)/g, "$1$2")).not.toMatch(/[–—]/);
    });
  });
});

describe("the route", () => {
  it.runIf(!amoebaDocs)("answers 404 while it is held", () => {
    let thrown: unknown;
    try {
      AmoebaFaqPage();
    } catch (error) {
      thrown = error;
    }
    expect((thrown as { digest?: string } | undefined)?.digest).toBe(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
  });

  describe("once published", () => {
    let Published: typeof AmoebaFaqPage;
    let page: HTMLElement;

    /* The flag is read where the page is imported, so the page is imported again
       with it on; the render is per test, as the testing library unmounts after
       each one. */
    beforeAll(async () => {
      vi.resetModules();
      vi.doMock("@/config/site", async (original) => ({
        ...(await original<typeof import("@/config/site")>()),
        amoebaDocs: true,
      }));
      Published = (await import("@/app/amoeba-faq/page")).default;
    });

    beforeEach(() => {
      page = render(<Published />).container;
    });

    afterAll(() => {
      vi.doUnmock("@/config/site");
      vi.resetModules();
    });

    it("has one h1, the deck and no download in the hero, then the body", () => {
      expect(page.querySelectorAll("h1")).toHaveLength(1);
      expect(text(page.querySelector("h1"))).toBe("Amoeba FAQ");
      expect(text(page.querySelector(".doc-deck"))).toBe(
        "Data safety, downtime, requirements and costs.",
      );
      expect(page.querySelector(".doc-hero .dl, .doc-hero-grid, .doc-date, .doc-crumb")).toBeNull();
      expect(within(page).getByRole("navigation", { name: "Choose a product" })).toHaveClass(
        "as-switch",
      );
      expect(page.querySelectorAll("details.fq")).toHaveLength(30);
      expect(page.querySelector(".doc-rail, .doc-toc, .doc-sum, .doc-fine")).toBeNull();
    });

    it("has a skip link to its one <main>", () => {
      expect(page.querySelector("a.skip")).toHaveAttribute("href", "#main");
      expect(page.querySelectorAll("main#main")).toHaveLength(1);
    });

    it("ends with Amoeba's closing row", () => {
      expect(page.querySelector('main a[href="/assessment?p=amoeba"]')).not.toBeNull();
      expect(page.querySelector('main a[href="/assessment?p=coral"]')).toBeNull();
      expect(text(page.querySelector("main"))).toContain(
        "Thirty minutes with the people who build Amoeba.",
      );
    });

    it("offers no PDF anywhere on the page", () => {
      expect(page.querySelectorAll('a[download], a[href$=".pdf"]')).toHaveLength(0);
    });
  });
});
