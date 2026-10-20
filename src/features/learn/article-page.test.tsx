import { readFileSync } from "node:fs";

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { articleOrder, articles, type ArticleId } from "@/content/learn-articles";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/learn/vpa-vs-hpa" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

import CoralAutoscalers, {
  metadata as coralAutoscalersMeta,
} from "@/app/learn/coral-and-native-autoscalers/page";
import PoorArchitecture, {
  metadata as poorArchitectureMeta,
} from "@/app/learn/poor-architecture-cloud-bill/page";
import ShrinkAzureDisk, {
  metadata as shrinkAzureDiskMeta,
} from "@/app/learn/shrink-azure-managed-disk/page";
import VpaVsHpa, { metadata as vpaVsHpaMeta } from "@/app/learn/vpa-vs-hpa/page";

/**
 * The Learn articles (laid out like /security, and the architecture essay): the
 * metadata, the outline and its addresses, the frame (each section's name
 * beside its text, the names as chips, no "On this page" list), the byline, the
 * short answer, the diagrams and pictures, the help box, the sources, the
 * Related row and the closing row for the article's product, and no
 * placeholder. The contract is written out here, so the content file cannot
 * redefine it. Their sitemap entries are in `src/app/sitemap.test.ts`.
 */

afterEach(() => {
  vi.restoreAllMocks();
});

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

interface Contract {
  readonly Page: () => React.JSX.Element;
  readonly meta: typeof vpaVsHpaMeta;
  readonly route: string;
  readonly title: string;
  readonly description: string;
  readonly h1: string;
  readonly deck: string;
  readonly sections: readonly string[];
  readonly parts: readonly string[];
  /** The byline as read, the new-tab hint included. */
  readonly byline: string;
  /** Whether it opens on "Short answer." (the essay does not). */
  readonly short: boolean;
  readonly figures: number;
  /** Pictures carried as files (`figure.ar-img`). */
  readonly images: number;
  readonly sources: number;
  /** The help box's title and its two links; none on the essay. */
  readonly help: readonly [string, string, string] | null;
  readonly related: readonly string[];
  readonly product: "coral" | "amoeba";
}

/** The first three articles' byline, unchanged by the essay. */
const ZOORIK_BYLINE = "Updated 9 October 2026 · Published by Zoorik";

const CONTRACTS: Record<ArticleId, Contract> = {
  "vpa-vs-hpa": {
    Page: VpaVsHpa,
    meta: vpaVsHpaMeta,
    route: "/learn/vpa-vs-hpa",
    title: "VPA vs HPA: rebalance first, then scale out",
    description:
      "The VPA sets how much CPU and memory a pod requests; the HPA sets how many pods run. Why they clash on CPU, and why rebalancing comes first.",
    h1: "VPA vs HPA: rebalance first, then scale out",
    deck: "What each Kubernetes autoscaler changes, why they clash on CPU, and the order that works.",
    sections: [
      "what-are-the-vpa-and-the-hpa",
      "requests-decide-what-you-pay-for",
      "why-they-clash-on-cpu",
      "rebalance-first-then-scale-out",
      "where-coral-fits",
    ],
    parts: ["what-is-the-vpa", "what-is-the-hpa"],
    byline: ZOORIK_BYLINE,
    short: true,
    figures: 5,
    images: 0,
    sources: 5,
    help: ["How Coral helps", "/coral", "/assessment?p=coral"],
    related: [
      "/learn/coral-and-native-autoscalers",
      "/coral/faq#working-with-hpa",
      "/coral/guide#hpas-and-vpas",
    ],
    product: "coral",
  },
  "coral-and-native-autoscalers": {
    Page: CoralAutoscalers,
    meta: coralAutoscalersMeta,
    route: "/learn/coral-and-native-autoscalers",
    title: "Coral and the native Kubernetes autoscalers",
    description:
      "What VPA, HPA, KEDA, Cluster Autoscaler, NAP and Karpenter each do on AKS and EKS, what Coral adds, and how they work together.",
    h1: "Coral and the native Kubernetes autoscalers",
    deck: "What VPA, HPA, KEDA, the Cluster Autoscaler, NAP and Karpenter each do, and what Coral adds.",
    sections: [
      "what-each-autoscaler-does",
      "what-coral-does-with-each",
      "what-coral-adds",
      "how-they-work-together-in-a-surge",
      "what-coral-doesnt-do",
    ],
    parts: [],
    byline: ZOORIK_BYLINE,
    short: true,
    figures: 0,
    images: 0,
    sources: 6,
    help: ["How Coral helps", "/coral", "/assessment?p=coral"],
    related: [
      "/learn/vpa-vs-hpa",
      "/coral/faq#nodes-and-spare-capacity",
      "/coral/guide#labels-and-annotations",
    ],
    product: "coral",
  },
  "shrink-azure-managed-disk": {
    Page: ShrinkAzureDisk,
    meta: shrinkAzureDiskMeta,
    route: "/learn/shrink-azure-managed-disk",
    title: "Can you shrink an Azure managed disk?",
    description:
      "No, not in place: Azure managed disks and Amazon EBS volumes only grow. The manual copy route, its downtime, and how Amoeba resizes a pool online.",
    h1: "Can you shrink an Azure managed disk?",
    deck: "Not in place. What works instead, what it costs you, and how Amoeba does it online.",
    sections: [
      "why-the-space-you-bought-stays-on",
      "why-a-disk-cant-shrink-in-place",
      "the-manual-route-copy-to-a-smaller",
      "how-amoeba-does-it-online",
      "what-about-amazon-ebs",
    ],
    parts: [],
    byline: ZOORIK_BYLINE,
    short: true,
    figures: 0,
    images: 0,
    sources: 3,
    help: ["How Amoeba helps", "/amoeba", "/assessment?p=amoeba"],
    related: [
      "/amoeba/guide#how-the-pool-is-sized",
      "/amoeba/faq#is-there-downtime",
      "/amoeba/faq#can-a-shrink-lose-data",
    ],
    product: "amoeba",
  },
  "poor-architecture-cloud-bill": {
    Page: PoorArchitecture,
    meta: poorArchitectureMeta,
    route: "/learn/poor-architecture-cloud-bill",
    title: "How poor architecture increases your cloud bill",
    description:
      "Cloud waste is often an architecture problem, not a billing problem: VMs vs containers, where poor design adds cost, and how one client cut compute 44%.",
    h1: "How Poor Infrastructure Architecture Quietly Increases Your Cloud Bill",
    deck: "Why cloud waste is often an architecture problem, not a billing problem.",
    sections: [
      "the-hidden-cost-of-architectural-decisions",
      "vms-versus-containers-understanding-the-architectural-trade-off",
      "where-poor-architecture-translates-into-higher-costs",
      "how-we-approach-cloud-cost-optimization-as",
      "what-we-found-in-that-engagement",
      "the-bigger-lesson-cloud-waste-is-often",
      "final-thoughts",
    ],
    parts: [
      "overprovisioning-compute-and-storage",
      "running-workloads-in-isolation-when-they-could",
      "scaling-infrastructure-instead-of-optimizing-applications",
      "ignoring-non-production-environments",
      "designing-for-peak-traffic-without-a-scaling",
      "establish-a-baseline",
      "understand-the-workload",
      "compare-realistic-architecture-options",
      "model-the-expected-savings",
      "validate-through-measurement",
      "prevent-the-same-waste-from-returning",
    ],
    byline:
      "Updated 14 October 2026 · By Vineet (opens in a new tab), infrastructure engineer · Published by Zoorik",
    short: false,
    figures: 0,
    images: 2,
    sources: 0,
    help: null,
    related: [
      "/case-studies/coral-dev-cluster",
      "/learn/shrink-azure-managed-disk",
      "/learn/vpa-vs-hpa",
    ],
    product: "coral",
  },
};

/** Where each page a Related tile links to keeps its anchors. */
const ANCHOR_SOURCES: Record<string, string> = {
  "/coral/faq": "src/content/coral-faq.ts",
  "/coral/guide": "src/content/coral-guide.ts",
  "/amoeba/faq": "src/content/amoeba-faq.ts",
  "/amoeba/guide": "src/content/amoeba-guide.ts",
};

describe.each(articleOrder)("/learn/%s", (id) => {
  const c = CONTRACTS[id];
  const main = () => {
    pathname.current = c.route;
    return render(<c.Page />).container.querySelector("main")!;
  };

  it("titles, describes and canonicalises the page in the mock's words", () => {
    expect(c.meta.title).toBe(c.title);
    expect(c.meta.description).toBe(c.description);
    expect(c.meta.alternates).toEqual({ canonical: c.route });
    expect(c.meta).not.toHaveProperty("robots");
    expect(c.meta.openGraph).toMatchObject({ url: c.route, title: `${c.title} · Zoorik` });
    expect(articles[id].route).toBe(c.route);
  });

  it("opens on the utility hero, with no date, photo or author", () => {
    const hero = main().querySelector("header.hero.doc-hero#top")!;
    expect(text(hero.querySelector("h1"))).toBe(c.h1);
    expect(text(hero.querySelector(".doc-deck"))).toBe(c.deck);
    expect(hero.querySelector(".as-switch, .dl, img")).toBeNull();
  });

  it("keeps the mock's section ids, in order, each its name beside its open text", () => {
    const frame = main().querySelector("article.doc-main.fq-main.ar-frame")!;
    const sections = [...frame.querySelectorAll(":scope > section.fq-sec")];
    expect(sections.map((section) => section.id)).toEqual(c.sections);
    for (const section of sections) {
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
      expect(section.firstElementChild).toHaveAttribute("id", `${section.id}-h`);
      expect(section.firstElementChild!.tagName).toBe("H2");
      expect(section.lastElementChild).toHaveClass("fq-sec-b", "doc-prose");
    }
    expect([...frame.querySelectorAll("h3[id]")].map((h3) => h3.id)).toEqual(c.parts);
    /* Nothing is folded, and nothing lists the sections but the chips. */
    expect(frame.querySelector("details")).toBeNull();
  });

  it("names the sections as chips on a phone, and has no On this page list", () => {
    const container = main();
    expect(
      [...container.querySelectorAll("nav.fq-chips a")].map((a) => a.getAttribute("href")),
    ).toEqual(c.sections.map((section) => `#${section}`));
    expect(container.querySelector(".doc-rail, .doc-toc, .rl")).toBeNull();
  });

  it("opens the frame on its Updated line, published by Zoorik, then the short answer where it has one", () => {
    const top = main().querySelector(".ar-frame > .fq-upd.doc-prose:first-child")!;
    const updated = top.querySelector(":scope > p.doc-updated:first-child")!;
    expect(text(updated)).toBe(c.byline);
    expect([...updated.querySelectorAll("a")].at(-1)).toHaveAttribute("href", "/about");
    const short = top.querySelector(":scope > p.ar-short");
    if (!c.short) {
      expect(short).toBeNull();
      return;
    }
    expect(short!.querySelector("b")).toHaveTextContent("Short answer.");
    expect(text(short)).toMatch(/^Short answer\. \S/);
  });

  it("carries its pictures as files, each with its alt text and caption", () => {
    const images = [...main().querySelectorAll("figure.ar-img")];
    expect(images).toHaveLength(c.images);
    for (const figure of images) {
      const img = figure.querySelector("img")!;
      expect(img.getAttribute("src")).toMatch(/^\/articles\/[a-z0-9-]+\.(webp|svg)$/);
      expect(img.getAttribute("alt")!.length).toBeGreaterThan(40);
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("decoding", "async");
      expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
      expect(text(figure.querySelector("figcaption")).length).toBeGreaterThan(20);
    }
  });

  it("draws the diagrams the mock draws, each one image with its words", () => {
    const figures = [...main().querySelectorAll("figure.ln-d")];
    expect(figures).toHaveLength(c.figures);
    for (const figure of figures) {
      expect(figure).toHaveAttribute("role", "img");
      expect(figure.getAttribute("aria-label")).toMatch(/^Diagram\. /);
      for (const svg of figure.querySelectorAll("svg")) {
        expect(svg).toHaveAttribute("aria-hidden", "true");
      }
    }
    const strip = main().querySelectorAll(".ln-strip > li");
    expect(strip).toHaveLength(c.figures ? 3 : 0);
  });

  it("closes the frame on the help box and the sources, each source a new tab", () => {
    const foot = main().querySelector(".ar-frame > .fq-upd.ar-foot");
    if (!c.help) {
      /* An essay has neither, so the frame has no closing block. */
      expect(c.sources).toBe(0);
      expect(foot).toBeNull();
      return;
    }
    const prose = main().querySelector(".ar-frame > .fq-upd.ar-foot.doc-prose:last-child")!;
    const help = prose.querySelector(":scope > aside.doc-call.doc-help")!;
    expect(text(help.querySelector(".doc-call-t"))).toBe(c.help[0]);
    expect([...help.querySelectorAll("a.alink")].map((a) => a.getAttribute("href"))).toEqual([
      c.help[1],
      c.help[2],
    ]);
    const sources = prose.lastElementChild!;
    expect(sources).toHaveClass("ar-src");
    expect(text(sources)).toMatch(/^Sources: .*\.$/);
    const links = [...sources.querySelectorAll("a")];
    expect(links).toHaveLength(c.sources);
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.textContent).toMatch(/ \(opens in a new tab\)$/);
    }
  });

  it("relates three pages, each to an anchor its page still has", () => {
    const related = main().querySelector("section.sec.ar-rel#related")!;
    expect(related).toHaveAttribute("aria-labelledby", "related-h");
    expect(text(related.querySelector("h2#related-h"))).toBe("Related");
    const hrefs = [...related.querySelectorAll("article.dt > a.dt-a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(c.related);
    for (const href of hrefs) {
      const [path, anchor] = href!.split("#");
      if (!anchor) continue;
      expect(readFileSync(ANCHOR_SOURCES[path!]!, "utf8"), href!).toContain(`"${anchor}"`);
    }
  });

  it("ends on the closing row for its product", () => {
    const row = main().querySelector("section#assess")!;
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", `/assessment?p=${c.product}`);
    expect(text(row.querySelector("#contact p"))).toBe(
      `Thirty minutes with the people who build ${c.product === "coral" ? "Coral" : "Amoeba"}.`,
    );
  });

  it("keeps product names out of translation and ships no placeholder", () => {
    const container = main();
    expect(container.innerHTML).not.toMatch(/\[OWNER|ph-chip|To come/);
    const prose = container.querySelector(".ar-frame")!;
    /* Every Coral and Amoeba in running text sits in a translate="no" span, as the mock marks them; the help box's title is the mock's plain text. */
    const loose = [...prose.querySelectorAll("p, li, td, th, h2, h3")].filter((el) => {
      if (el.matches(".doc-call-t")) return false;
      const own = [...el.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join("");
      return /\b(Coral|Amoeba|Zoorik)\b/.test(own);
    });
    expect(loose.map(text)).toEqual([]);
  });
});

/**
 * The architecture essay: first published here, every word as its source
 * article writes it. Its headings are listed here from that source, so a drift
 * from the source fails.
 */
describe("/learn/poor-architecture-cloud-bill, against its source", () => {
  const main = () => {
    pathname.current = "/learn/poor-architecture-cloud-bill";
    return render(<PoorArchitecture />).container.querySelector("main")!;
  };

  it("renders every h3 of the source as a section, in order, and every h4 as a part", () => {
    const frame = main().querySelector(".ar-frame")!;
    expect([...frame.querySelectorAll("section.fq-sec > h2")].map(text)).toEqual([
      "The hidden cost of architectural decisions",
      "VMs versus containers: understanding the architectural trade-off",
      "Where poor architecture translates into higher costs",
      "How we approach cloud cost optimization as engineers",
      "What we found in that engagement",
      "The bigger lesson: cloud waste is often an architecture problem",
      "Final thoughts",
    ]);
    expect([...frame.querySelectorAll("h3[id]")].map(text)).toEqual([
      "1. Overprovisioning compute and storage",
      "2. Running workloads in isolation when they could share capacity",
      "3. Scaling infrastructure instead of optimizing applications",
      "4. Ignoring non-production environments",
      "5. Designing for peak traffic without a scaling strategy",
      "1. Establish a baseline",
      "2. Understand the workload",
      "3. Compare realistic architecture options",
      "4. Model the expected savings",
      "5. Validate through measurement",
      "6. Prevent the same waste from returning",
    ]);
  });

  it("opens under the byline on its five paragraphs, its question and the infographic, in the source's order", () => {
    const top = main().querySelector(".ar-frame > .fq-upd.doc-prose:first-child")!;
    const kinds = [...top.children].map((el) =>
      el.matches("p.doc-updated") ? "byline" : el.tagName.toLowerCase(),
    );
    expect(kinds).toEqual(["byline", "p", "p", "p", "p", "blockquote", "p", "figure"]);
    expect(text(top.querySelector("blockquote"))).toBe(
      "Are we paying for the computing power our applications actually need, or are we paying for the way we chose to architect them?",
    );
  });

  it("names Vineet in the byline, a new tab to his profile, and does not print his byline twice", () => {
    const container = main();
    const vineet = container.querySelector("p.doc-updated a[href^='https://www.linkedin.com']")!;
    expect(vineet).toHaveAttribute("href", "https://www.linkedin.com/in/yadavvineet/");
    expect(vineet).toHaveAttribute("target", "_blank");
    expect(vineet).toHaveAttribute("rel", "noopener noreferrer");
    expect(text(container.querySelector(".ar-frame")).match(/By Vineet/g)).toHaveLength(1);
  });

  it("gives both pictures the source's alt text, and the infographic its smaller copy", () => {
    const [infographic, diagram] = [...main().querySelectorAll("figure.ar-img img")];
    expect(infographic).toHaveAttribute(
      "alt",
      "Infographic comparing the VM approach, where each app runs on its own VM with fixed resources even when idle, with the Kubernetes approach, where containers share a compute pool, plus when to use each.",
    );
    expect(infographic).toHaveAttribute(
      "src",
      "/articles/vm-vs-kubernetes-cloud-cost-infographic.webp",
    );
    expect(infographic!.getAttribute("srcset")).toContain(
      "vm-vs-kubernetes-cloud-cost-infographic-700.webp 700w",
    );
    expect(diagram).toHaveAttribute(
      "alt",
      "Five apps, each on its own mostly idle VM, compared with the same five apps sharing one pool of capacity with headroom, so fewer machines are needed.",
    );
    expect(diagram).toHaveAttribute("src", "/articles/dedicated-vms-vs-shared-pool.svg");
  });

  it("links only words already in the text: the disk article, the case study twice, the assessment", () => {
    const links = [...main().querySelectorAll(".ar-frame .fq-sec-b a")].map((a) => [
      text(a),
      a.getAttribute("href"),
    ]);
    expect(links).toEqual([
      ["On our own Kubernetes development cluster", "/case-studies/coral-dev-cluster"],
      ["cut the cluster’s machine bill by 58% in eight days", "/case-studies/coral-dev-cluster"],
      [
        "Azure managed disks and AWS EBS volumes can grow but cannot be shrunk in place",
        "/learn/shrink-azure-managed-disk",
      ],
      ["zoorik.com/assessment", "/assessment"],
    ]);
  });

  it("ships its pictures, and none heavier than its size budget allows", () => {
    for (const [file, kb] of [
      ["public/articles/vm-vs-kubernetes-cloud-cost-infographic.webp", 150],
      ["public/articles/vm-vs-kubernetes-cloud-cost-infographic-700.webp", 150],
      ["public/articles/dedicated-vms-vs-shared-pool.svg", 20],
      ["public/og/zoorik-learn-poor-architecture-cloud-bill-1200x630.png", 200],
    ] as const) {
      expect(readFileSync(file).length / 1024, file).toBeLessThan(kb);
    }
  });
});
