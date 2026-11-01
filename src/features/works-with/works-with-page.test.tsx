import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import AksCostOptimization from "@/app/aks-cost-optimization/page";
import CoralFaq from "@/app/coral-faq/page";
import CoralGuide from "@/app/coral-guide/page";
import CoralWorksWithNodeAutoProvisioning, {
  metadata as napMeta,
} from "@/app/coral-works-with-aks-node-auto-provisioning/page";
import CoralWorksWithClusterAutoscaler, {
  metadata as clusterAutoscalerMeta,
} from "@/app/coral-works-with-cluster-autoscaler/page";
import CoralWorksWithHelm, { metadata as helmMeta } from "@/app/coral-works-with-helm/page";
import CoralWorksWithKarpenter, {
  metadata as karpenterMeta,
} from "@/app/coral-works-with-karpenter/page";
import CoralWorksWithKeda, { metadata as kedaMeta } from "@/app/coral-works-with-keda/page";
import CoralWorksWithTerraform, {
  metadata as terraformMeta,
} from "@/app/coral-works-with-terraform/page";
import InstallCoralWithHelm from "@/app/docs/install-coral-with-helm/page";
import InstallCoralWithTerraform from "@/app/docs/install-coral-with-terraform/page";
import EksCostOptimization from "@/app/eks-cost-optimization/page";
import Trust from "@/app/trust/page";
import { keepsHash, navState, routes } from "@/config/site";
import { findTerm, glossarySlugOf } from "@/content/learn/glossary";
import { findArticle, isLiveHref, learnSlugOf } from "@/content/learn/published";
import { worksWithLastUpdated, worksWithPages } from "@/content/works-with";
import { sectionSlug } from "@/features/open-source/os-guide-page";

/**
 * The six works-with pages, one template in the Helm guide's article frame: their metadata, the eyebrow over the h1
 * and the short answer, the six sections in order at their anchors, Who does what's three columns, the numbered
 * steps, the questions as /pricing's rows (closed, no numerals), the Read more links, that every link lands (an anchor
 * on another page among the ids that page prints), the sheet's scope, and the closing row on Coral.
 * The copy is the checked drafts' (docs/website-seo/new-pages-2026-10-31/<slug>/page.md), so it holds no figure and
 * no price.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
/** What a line of the guides' markup-lite prints: its code, bold and link words, without the marks. */
const printed = (line: string): string =>
  line.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1").replace(/`|\*\*/g, "");

const pages = [
  {
    route: routes.coralWorksWithClusterAutoscaler,
    Page: CoralWorksWithClusterAutoscaler,
    meta: clusterAutoscalerMeta,
    copy: worksWithPages.clusterAutoscaler,
    h1: "Coral works with Cluster Autoscaler",
    description:
      "On AKS and EKS, Coral rebalances pod requests and empties spare nodes one at a time. The Cluster Autoscaler adds nodes and removes the ones Coral empties.",
    tool: "Cluster Autoscaler",
    rows: 5,
    leaves: "What Coral leaves to the Cluster Autoscaler",
    questions: [
      "Will Coral fight my Cluster Autoscaler?",
      "Can Coral move work to cheaper machines with only the Cluster Autoscaler?",
      "Does Coral change my Cluster Autoscaler’s minimums?",
      "What about pools the Cluster Autoscaler doesn’t run?",
      "What happens in a sudden surge?",
    ],
    readMore: [
      "/coral-guide#node-optimization",
      "/coral-faq#how-does-coral-interact-with-cluster",
      "/learn/cluster-autoscaler-not-scaling-down",
      "/coral-works-with-aks-node-auto-provisioning",
      "/coral-works-with-karpenter",
    ],
  },
  {
    route: routes.coralWorksWithKarpenter,
    Page: CoralWorksWithKarpenter,
    meta: karpenterMeta,
    copy: worksWithPages.karpenter,
    h1: "Coral works with Karpenter",
    description:
      "Karpenter picks machines; Coral rebalances pod requests so Karpenter can run fewer or smaller nodes. How they work together on EKS, and what Coral leaves alone.",
    tool: "Karpenter",
    rows: 5,
    leaves: "What Coral leaves to Karpenter",
    questions: [
      "Do I need Coral if I already run Karpenter?",
      "What does a rebalance need on EKS?",
      "What happens in a surge after Coral moves work to smaller machines?",
      "Does Coral respect karpenter.sh/do-not-disrupt?",
      "What stays if I disconnect?",
    ],
    readMore: [
      "/coral-guide#rebalancing",
      "/coral-faq#do-i-need-coral-with-karpenter",
      "/learn/keda-vs-karpenter",
      "/coral-works-with-aks-node-auto-provisioning",
      "/coral-works-with-keda",
    ],
  },
  {
    route: routes.coralWorksWithNodeAutoProvisioning,
    Page: CoralWorksWithNodeAutoProvisioning,
    meta: napMeta,
    copy: worksWithPages.nodeAutoProvisioning,
    h1: "Coral works with AKS node auto provisioning",
    description:
      "AKS node auto provisioning (NAP) launches machines, and Coral rebalances the pod requests that NAP reads. What connect turns on, and how rebalancing uses NAP.",
    tool: "NAP",
    rows: 4,
    leaves: "What Coral leaves to NAP",
    questions: [
      "Do I need Coral if I run NAP?",
      "Is NAP the same as Karpenter?",
      "My AKS cluster runs the Cluster Autoscaler. Will connect turn on NAP?",
      "What does rebalancing need on AKS?",
      "What stays if I disconnect?",
    ],
    readMore: [
      "/coral-guide#rebalancing",
      "/coral-faq#do-i-need-coral-with-karpenter",
      "/learn/aks-node-auto-provisioning",
      "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
      "/coral-works-with-cluster-autoscaler",
      "/coral-works-with-karpenter",
    ],
  },
  {
    route: routes.coralWorksWithKeda,
    Page: CoralWorksWithKeda,
    meta: kedaMeta,
    copy: worksWithPages.keda,
    h1: "Coral works with KEDA",
    description:
      "On AKS and EKS, KEDA sets how many pods run and Coral rebalances each pod's CPU and memory requests. See how they work together and what Coral leaves to KEDA.",
    tool: "KEDA",
    rows: 5,
    leaves: "What Coral leaves to KEDA",
    questions: [
      "Will Coral and KEDA fight over the replica count?",
      "Does Coral ever change my ScaledObject?",
      "Could smaller requests make KEDA add more pods?",
      "Does Coral create its own HPA for a KEDA workload?",
      "What happens to KEDA’s pods when Coral empties a spare node?",
    ],
    readMore: [
      "/coral-guide#hpas-and-vpas",
      "/coral-faq#working-with-hpa",
      "/learn/keda-vs-karpenter",
      "/learn/glossary/horizontal-pod-autoscaler",
      "/coral-works-with-karpenter",
    ],
  },
  {
    route: routes.coralWorksWithHelm,
    Page: CoralWorksWithHelm,
    meta: helmMeta,
    copy: worksWithPages.helm,
    h1: "Coral works with Helm",
    description:
      "Install Coral's agent with Helm, Argo CD or Flux, and upgrade it when you choose. Coral rebalances what your charts deploy and never edits your templates.",
    tool: "Helm",
    rows: 5,
    leaves: "What stays yours",
    questions: [
      "Does Coral edit my charts or templates?",
      "Will Coral add HPAs that my chart doesn’t have?",
      "Does a CPU or memory limit in my chart cap Coral?",
      "Can my chart keep a workload out of Coral’s sizing?",
      "How do I remove Coral if I installed it with Helm?",
    ],
    readMore: [
      "/docs/install-coral-with-helm",
      "/coral-guide#workload-optimization",
      "/coral-faq#does-coral-change-my-git-or",
      "/learn/glossary/kubernetes-resource-requests",
      "/coral-works-with-terraform",
    ],
  },
  {
    route: routes.coralWorksWithTerraform,
    Page: CoralWorksWithTerraform,
    meta: terraformMeta,
    copy: worksWithPages.terraform,
    h1: "Coral works with Terraform",
    description:
      "Create Coral's cloud permissions for AKS and EKS with our Terraform modules. See which node pool fields Coral changes, so each apply doesn't undo them.",
    tool: "Terraform",
    rows: 5,
    leaves: "What stays yours",
    questions: [
      "What do Coral’s Terraform modules create?",
      "Will terraform apply undo what Coral changes?",
      "Can I keep every pool minimum as I set it?",
      "Do I need Terraform to use Coral?",
      "How do I revoke Coral’s cloud access?",
    ],
    readMore: [
      "/docs/install-coral-with-terraform",
      "/coral-guide#node-optimization",
      "/coral-faq#nodes-and-spare-capacity",
      "/learn/glossary/node-pool",
      "/coral-works-with-helm",
    ],
  },
] as const;

const draw = (page: (typeof pages)[number]) => {
  pathname.current = page.route;
  const { Page } = page;
  return render(<Page />).container;
};

/**
 * The pages these link to with an anchor, each drawn once: an anchor must be an id the page itself prints (a guide's
 * or the FAQ's row, a /trust part, an install guide's section, a cloud page's Set up). A FAQ question's id is its first
 * seven words, so a reworded question fails here.
 */
const ANCHORED: Readonly<Record<string, () => React.JSX.Element>> = {
  [routes.coralGuide]: CoralGuide,
  [routes.coralFaq]: CoralFaq,
  [routes.trust]: Trust,
  [routes.docsInstallHelm]: InstallCoralWithHelm,
  [routes.docsInstallTerraform]: InstallCoralWithTerraform,
  [routes.aksCostOptimization]: AksCostOptimization,
  [routes.eksCostOptimization]: EksCostOptimization,
};
const printedIds = new Map<string, ReadonlySet<string>>();
const idsOn = (route: string): ReadonlySet<string> | undefined => {
  const Page = ANCHORED[route];
  if (!Page) return undefined;
  if (!printedIds.has(route)) {
    const drawn = render(<Page />);
    printedIds.set(
      route,
      new Set([...drawn.container.querySelectorAll("[id]")].map((element) => element.id)),
    );
    drawn.unmount();
  }
  return printedIds.get(route);
};

/** The six sections, in the template's order, at their anchors; the third is the page's own. */
const sectionsOf = (page: (typeof pages)[number]) => [
  ["who-does-what", "Who does what"],
  ["together", "How they work together"],
  ["leaves", page.leaves],
  ["setup", "Set up"],
  ["questions", "Questions"],
  ["read-more", "Read more"],
];

describe("the works-with pages", () => {
  it("are six, at the site's root, in the footer's order, each dated for the sitemap", () => {
    expect(pages.map((page) => page.route)).toEqual([
      "/coral-works-with-cluster-autoscaler",
      "/coral-works-with-karpenter",
      "/coral-works-with-aks-node-auto-provisioning",
      "/coral-works-with-keda",
      "/coral-works-with-helm",
      "/coral-works-with-terraform",
    ]);
    expect(Object.values(worksWithPages).map((copy) => copy.route)).toEqual(
      pages.map((page) => page.route),
    );
    expect(worksWithLastUpdated).toBe("1 November 2026");
    for (const copy of Object.values(worksWithPages)) {
      expect(copy.lastUpdated).toBe(worksWithLastUpdated);
    }
  });

  it("start every rule of their sheet at the page's own hero, so a visited page's sheet touches no other page", () => {
    const css = readFileSync(
      join(process.cwd(), "src", "styles", "works-with.css"),
      "utf8",
    ).replace(/\/\*[\s\S]*?\*\//g, "");
    const selectors = css
      .split("}")
      .filter((chunk) => chunk.includes("{"))
      .map((chunk) => chunk.slice(0, chunk.lastIndexOf("{")))
      .map((head) => head.slice(head.lastIndexOf("{") + 1).trim())
      .filter((prelude) => prelude !== "" && !prelude.startsWith("@"))
      .flatMap((prelude) => prelude.split(",").map((selector) => selector.trim()));
    expect(selectors).toEqual([
      ".doc-hero .hero-ey",
      ".doc-hero ~ .doc-body .pr-faq .fq summary",
      ".doc-hero ~ .doc-body .pr-faq .fq > .fq-body",
    ]);
  });

  it.each(pages)("$route: titled, described and canonicalised as its draft", (page) => {
    expect(page.meta.title).toBe(page.h1);
    expect(`${page.h1} | Zoorik`.length).toBeLessThanOrEqual(60);
    expect(page.description.length).toBeLessThanOrEqual(160);
    expect(page.meta.description).toBe(page.description);
    expect(page.meta.alternates).toEqual({ canonical: page.route });
    expect(page.meta.openGraph).toMatchObject({
      url: page.route,
      title: `${page.h1} | Zoorik`,
      description: page.description,
    });
  });

  it.each(pages)("$route: the eyebrow over the h1, the short answer, no date line", (page) => {
    const root = draw(page);
    const hero = root.querySelector("header.hero.doc-hero#top > .wrap.hero-in")!;
    expect([...hero.children].map((child) => child.tagName.toLowerCase())).toEqual([
      "p",
      "h1",
      "p",
    ]);
    const eyebrow = hero.querySelector(":scope > p.hero-ey")!;
    expect(text(eyebrow)).toBe("Works with");
    expect(eyebrow.nextElementSibling!.tagName).toBe("H1");
    expect(text(root.querySelector("h1"))).toBe(page.h1);
    expect(root.querySelector("h1 > span[translate='no']")).toHaveTextContent(/^Coral$/);
    expect(text(hero.querySelector(":scope > p.doc-deck"))).toBe(page.copy.hero.deck);
    expect(root.querySelector(".doc-updated, .ar-short, .fq-upd")).toBeNull();
    /* These pages are not under Docs: the header marks nothing. They keep their hash, as the article frame does and
       as the mocks' data-keep-hash says. */
    expect(navState(page.route)).toEqual({});
    expect(root.querySelector("nav [aria-current='page'], nav .is-cur")).toBeNull();
    expect(keepsHash(page.route)).toBe(true);
  });

  it.each(pages)("$route: six sections in order at their anchors, and a chip for each", (page) => {
    const root = draw(page);
    const article = root.querySelector(
      ".sec.doc-body > .wrap > article.doc-main.fq-main.ar-frame",
    )!;
    const sections = [...article.children];
    expect(sections.every((section) => section.matches("section.fq-sec"))).toBe(true);
    expect(sections.map((section) => [section.id, text(section.querySelector("h2"))])).toEqual(
      sectionsOf(page),
    );
    for (const section of sections) {
      expect(section.querySelector(":scope > h2")).toHaveAttribute("id", `${section.id}-h`);
      expect(section).toHaveAttribute("aria-labelledby", `${section.id}-h`);
    }
    expect(
      [...root.querySelectorAll("nav.fq-chips a")].map((a) => [a.getAttribute("href"), text(a)]),
    ).toEqual(sectionsOf(page).map(([id, title]) => [`#${id}`, title]));
  });

  it.each(pages)("$route: Who does what is the docs' table, Job / tool / Coral", (page) => {
    const root = draw(page);
    const table = root.querySelector("section#who-does-what > .fq-sec-b.doc-prose > table")!;
    expect(table.className).toBe("doc-tbl nw-tbl");
    expect([...table.querySelectorAll("col")].map((col) => col.getAttribute("style"))).toEqual([
      "width: 24%;",
      "width: 38%;",
      "width: 38%;",
    ]);
    expect([...table.querySelectorAll("thead th")].map((th) => text(th))).toEqual([
      "Job",
      page.tool,
      "Coral",
    ]);
    const rows = [...table.querySelectorAll("tbody tr")];
    expect(rows).toHaveLength(page.rows);
    expect(rows.map((row) => [...row.children].map((cell) => text(cell)))).toEqual(
      page.copy.who.rows.map((row) => row.map(printed)),
    );
    for (const row of rows) {
      expect([...row.children].map((cell) => cell.getAttribute("data-label"))).toEqual([
        "Job",
        page.tool,
        "Coral",
      ]);
    }
  });

  it.each(pages)("$route: the steps in the guides' numerals, the bullets after", (page) => {
    const root = draw(page);
    const steps = [...root.querySelectorAll("section#together ol.doc-steps[role='list'] > li")];
    expect(steps.length).toBeGreaterThanOrEqual(3);
    expect(steps.length).toBeLessThanOrEqual(5);
    expect(steps.map((li) => text(li.querySelector(":scope > div > p")))).toEqual(
      page.copy.together.map(printed),
    );
    for (const id of ["leaves", "setup"]) {
      const items = [...root.querySelectorAll(`section#${id} > .fq-sec-b.doc-prose > ul > li`)];
      expect(items.length, id).toBeGreaterThanOrEqual(2);
      /* Each bullet leads with its bold words. */
      for (const li of items) expect(li.firstElementChild?.tagName, id).toBe("B");
    }
  });

  it.each(pages)("$route: the questions are /pricing's rows, closed and unnumbered", (page) => {
    const root = draw(page);
    const section = root.querySelector("section#questions")!;
    expect(section.className).toBe("fq-sec pr-faq");
    const column = section.querySelector(":scope > .fq-sec-b")!;
    expect(column.className).toBe("fq-sec-b");
    const rows = [...column.querySelectorAll(":scope > .fq-list > details.fq")];
    expect(rows.map((row) => text(row.querySelector("summary > h3")))).toEqual(page.questions);
    for (const row of rows) {
      expect(row.className).toBe("fq");
      expect(row).not.toHaveAttribute("open");
      expect(row.querySelector(".fq-n")).toBeNull();
      expect(
        [...row.querySelector(":scope > summary")!.children].map((child) =>
          child.tagName.toLowerCase(),
        ),
      ).toEqual(["h3", "svg"]);
      expect(row.querySelector(":scope > summary > svg")).toHaveClass("fq-chev");
      expect(row.querySelector(":scope > .fq-body")!.className).toBe("fq-body doc-prose");
      expect(row.querySelector(":scope > .fq-body > p")).not.toBeNull();
    }
    /* Addressed as the mocks address a row: the question's first seven words. */
    expect(rows.map((row) => row.id)).toEqual(
      page.copy.questions.map((row) => sectionSlug(row.question)),
    );
  });

  it.each(pages)("$route: Read more's links, each live, each with its line", (page) => {
    const root = draw(page);
    const items = [...root.querySelectorAll("section#read-more > .fq-sec-b.doc-prose > ul > li")];
    expect(items.map((li) => li.querySelector("a")!.getAttribute("href"))).toEqual(page.readMore);
    for (const li of items) {
      const a = li.firstElementChild!;
      expect(a.tagName).toBe("A");
      expect(a).not.toHaveAttribute("target");
      expect(text(li).slice(text(a).length)).toMatch(/^: \S/);
      expect(isLiveHref(a.getAttribute("href")!)).toBe(true);
    }
    expect(page.readMore).not.toContain(page.route);
  });

  it.each(pages)("$route: every in-page link lands, and no id is used twice", (page) => {
    const root = draw(page);
    for (const a of root.querySelectorAll<HTMLAnchorElement>("main a[href^='#']")) {
      expect(root.querySelector(a.getAttribute("href")!), a.getAttribute("href")!).not.toBeNull();
    }
    const ids = [...root.querySelectorAll("[id]")].map((el) => el.id);
    expect(ids.filter((id, at) => ids.indexOf(id) !== at)).toEqual([]);
  });

  it.each(pages)("$route: links only pages and anchors that exist", (page) => {
    const main = draw(page).querySelector("main")!;
    const live = new Set<string>(Object.values(routes));
    const own = [...main.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")!);
    expect(own.length).toBeGreaterThan(0);
    for (const href of own) {
      const [address, hash] = href.split("#") as [string, string | undefined];
      const where = address.split("?")[0]!;
      const article = learnSlugOf(where);
      const term = glossarySlugOf(where);
      if (article) expect(findArticle(article), href).toBeDefined();
      else if (term) expect(findTerm(term), href).toBeDefined();
      else expect(live.has(where), href).toBe(true);
      if (hash) {
        const ids = idsOn(where);
        expect(ids, `${href}: draw ${where} in ANCHORED`).toBeDefined();
        expect(ids!.has(hash), href).toBe(true);
      }
    }
  });

  it.each(pages)("$route: no figure and no price, then the closing row on Coral", (page) => {
    const root = draw(page);
    const main = root.querySelector("main")!;
    expect(text(main)).not.toMatch(/\d/);
    expect(text(main)).not.toMatch(/[$€£₹]/);
    const copy = text(main.querySelector("header.hero")) + text(main.querySelector("article"));
    expect(copy).not.toMatch(/\b(price|prices|priced|pricing|cost per|per month)\b/i);
    const row = main.querySelector("section#assess")!;
    expect(row).toBe(main.lastElementChild);
    expect(row.querySelector("a.btn-ink")).toHaveAttribute("href", "/assessment?p=coral");
    expect(text(row.querySelector(".as-cal"))).toMatch(/Coral\./);
  });
});
