import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/docs" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import AmoebaTroubleshooting, {
  metadata as amoebaTroubleshootingMeta,
} from "@/app/amoeba-troubleshooting/page";
import CoralTroubleshooting, {
  metadata as coralTroubleshootingMeta,
} from "@/app/coral-troubleshooting/page";
import { keepsHash, navState, routes } from "@/config/site";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { sectionSlug } from "@/features/open-source/os-guide-page";

/**
 * The two troubleshooting pages, one per product, in the guides' article frame: their metadata and card, the top line
 * with their own date, one section per topic (its short answer, then each check as an h3, with the mocks' command
 * wells and tables), then Still stuck? with the contact routes, the foot links, and the closing row on the page's own
 * product.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const sections = (root: HTMLElement) =>
  [...root.querySelectorAll("article.ar-frame > section.fq-sec")].map((section) => [
    section.id,
    text(section.querySelector("h2")),
  ]);
/** A topic's checks: the h3s in its section, in order. */
const checks = (root: HTMLElement, id: string) =>
  [...root.querySelectorAll(`section#${id} .fq-sec-b > h3`)].map((h3) => text(h3));
/** What one check holds: the blocks after its h3, up to the next. */
function check(root: HTMLElement, title: string): Element[] {
  const h3 = [...root.querySelectorAll(".fq-sec-b > h3")].find((el) => text(el) === title)!;
  const blocks: Element[] = [];
  for (let el = h3.nextElementSibling; el && el.tagName !== "H3"; el = el.nextElementSibling) {
    blocks.push(el);
  }
  return blocks;
}

const pages = [
  {
    route: routes.coralTroubleshooting,
    Page: CoralTroubleshooting,
    meta: coralTroubleshootingMeta,
    guide: troubleshootingGuides.coral,
    product: "coral",
    title: "Coral troubleshooting",
    topics: [
      ["coral-is-not-connecting-to-my-cluster", "Coral is not connecting to my cluster"],
      ["coral-is-not-removing-a-node", "Coral is not removing a node"],
    ],
  },
  {
    route: routes.amoebaTroubleshooting,
    Page: AmoebaTroubleshooting,
    meta: amoebaTroubleshootingMeta,
    guide: troubleshootingGuides.amoeba,
    product: "amoeba",
    title: "Amoeba troubleshooting",
    topics: [
      ["amoeba-is-not-showing-my-vm", "Amoeba is not showing my VM"],
      ["amoeba-has-not-rightsized-my-disks-yet", "Amoeba has not rightsized my disks yet"],
    ],
  },
] as const;

const draw = (page: (typeof pages)[number]) => {
  pathname.current = page.route;
  const { Page } = page;
  return render(<Page />).container;
};

describe("the troubleshooting pages", () => {
  it("are one per product, at the site's root", () => {
    expect(pages.map((page) => page.route)).toEqual([
      "/coral-troubleshooting",
      "/amoeba-troubleshooting",
    ]);
    expect(Object.keys(troubleshootingGuides)).toEqual(["coral", "amoeba"]);
  });

  it.each(pages)("$route: titled, described and canonicalised, with its own card", (page) => {
    expect(page.meta.title).toBe(page.title);
    expect(`${page.title} | Zoorik`.length).toBeLessThanOrEqual(60);
    expect(String(page.meta.description).length).toBeLessThanOrEqual(160);
    expect(page.meta.alternates).toEqual({ canonical: page.route });
    expect(page.meta.openGraph).toMatchObject({
      url: page.route,
      title: `${page.title} | Zoorik`,
      images: [{ url: `/og/pages/${page.route.slice(1)}.png`, alt: `Zoorik. ${page.title}.` }],
    });
  });

  it.each(pages)(
    "$route: its h1, its own date and no page-level short answer, then the closing row on its product",
    (page) => {
      const root = draw(page);
      expect(text(root.querySelector("h1"))).toBe(page.title);
      expect(text(root.querySelector(".doc-updated"))).toBe(
        "Updated 1 November 2026 · Published by Zoorik",
      );
      expect(page.guide.short).toBeUndefined();
      expect(root.querySelector(".ar-short")).toBeNull();
      const row = root.querySelector("section#assess")!;
      expect(row.querySelector("a.btn-ink")).toHaveAttribute(
        "href",
        `/assessment?p=${page.product}`,
      );
      /* Docs is marked in the header; the page keeps its hash as the article frame does. */
      expect(navState(page.route)).toEqual({ current: "docs" });
      expect(keepsHash(page.route)).toBe(true);
    },
  );

  it.each(pages)(
    "$route: its two topics, then one Still stuck? with the only two contact routes",
    (page) => {
      const root = draw(page);
      expect(sections(root)).toEqual([...page.topics, ["still-stuck", "Still stuck?"]]);
      expect(
        [...root.querySelectorAll("nav.fq-chips a")].map((a) => [
          a.getAttribute("href"),
          a.innerHTML,
        ]),
      ).toEqual(
        [...page.topics, ["still-stuck", "Still stuck?"]].map(([id, title]) => [`#${id}`, title]),
      );
      const stuck = root.querySelector("section#still-stuck")!;
      expect(stuck.querySelector("h3")).toBeNull();
      expect(stuck.querySelector('a[href="mailto:founders@zoorik.com"]')).not.toBeNull();
      const cal = stuck.querySelector('a[href="https://cal.com/zoorik/talk"]')!;
      expect(cal).toHaveAttribute("target", "_blank");
      expect(text(cal)).toBe("pick a time to talk (opens in a new tab)");
    },
  );

  it.each(pages)("$route: each topic opens on its short answer, then its checks as h3s", (page) => {
    const root = draw(page);
    for (const [id] of page.topics) {
      const body = root.querySelector(`section#${id} .fq-sec-b`)!;
      const first = body.firstElementChild!;
      expect(first.tagName, id).toBe("P");
      expect(first.querySelector("b:first-child"), id).toHaveTextContent(/^Short answer\.$/);
      expect(first.nextElementSibling!.tagName, id).toBe("H3");
    }
  });

  it.each(pages)("$route: every in-page link lands on a section of the page", (page) => {
    const root = draw(page);
    for (const a of root.querySelectorAll<HTMLAnchorElement>("article.ar-frame a[href^='#']")) {
      expect(root.querySelector(a.getAttribute("href")!), a.getAttribute("href")!).not.toBeNull();
    }
  });

  it("addresses each section as the mocks do: its first seven words, apostrophes dropped", () => {
    expect(sectionSlug("Coral is not connecting to my cluster")).toBe(
      "coral-is-not-connecting-to-my-cluster",
    );
    expect(sectionSlug("Amoeba has not rightsized my disks yet")).toBe(
      "amoeba-has-not-rightsized-my-disks-yet",
    );
    expect(sectionSlug("Check the command points at the right cluster")).toBe(
      "check-the-command-points-at-the-right",
    );
    expect(sectionSlug("Read why a shrink can’t run")).toBe("read-why-a-shrink-cant-run");
    expect(sectionSlug("Still stuck?")).toBe("still-stuck");
    /* The guides' own sections keep their addresses. */
    expect(sectionSlug("With Argo CD or Flux")).toBe("with-argo-cd-or-flux");
  });

  it("Coral: a cluster not connecting in ten checks, then a node not removed in eight, with four command wells and three tables", () => {
    const root = draw(pages[0]);
    expect(checks(root, "coral-is-not-connecting-to-my-cluster")).toEqual([
      "Check the cluster is supported",
      "Check the command points at the right cluster",
      "Check the connect command is new",
      "Check your cloud tools and permissions",
      "Check the network",
      "Check what connect set up in your cloud",
      "Wait for the first report",
      "Check your Helm install if it says a resource already exists",
      "If the cluster shows “Not reporting”",
      "If the Agent release card says “Re-run connect”",
    ]);
    expect(checks(root, "coral-is-not-removing-a-node")).toEqual([
      "Check Node optimization and the Evictor are on",
      "Check the node’s pool is enabled",
      "Check what is holding the node",
      "Check the other nodes have room",
      "Check the pool is above its minimum",
      "Check who removes the empty node",
      "Check the node is not cordoned",
      "Check the drain finished",
    ]);
    const wells = [...root.querySelectorAll(".as-well.doc-well:not(.is-yaml) pre")];
    expect(wells.map((pre) => pre.textContent!.split("\n")[0])).toEqual([
      "$ helm upgrade coral-agent \\",
      "$ kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent",
      "$ zoorikctl cluster grant-node-deletion",
      "$ zoorikctl cluster grant-node-deletion",
    ]);
    expect(root.querySelectorAll("table.doc-tbl")).toHaveLength(3);
  });

  it("Coral: only hostPath data holds a node, as the Learn article it links says", () => {
    const table = check(draw(pages[0]), "Check what is holding the node").find(
      (el) => el.tagName === "TABLE",
    )!;
    const reasons = [...table.querySelectorAll("tbody tr")].map((row) =>
      text(row.querySelector("th, td")),
    );
    expect(reasons).toContain("Data on the node’s own disk (hostPath).");
    expect(reasons.join(" ")).not.toMatch(/emptyDir/);
  });

  it("Amoeba: a VM not showing in eight checks, then disks not rightsized in seven, a link from one to the other", () => {
    const root = draw(pages[1]);
    expect(checks(root, "amoeba-is-not-showing-my-vm")).toEqual([
      "Read the line under the list",
      "Check the cloud connection",
      "Check the VM’s subscription is included",
      "Check the VM is running and has a data disk",
      "Give the list a moment",
      "On AWS, check the instance and Systems Manager",
      "Check the agent has reported",
      "If the install failed or the agent stopped",
    ]);
    expect(checks(root, "amoeba-has-not-rightsized-my-disks-yet")).toEqual([
      "Check the agent is reporting",
      "Check whether Amoeba declined the VM",
      "Check whether the move paused",
      "Check the Linux requirements",
      "Check the shrink setting",
      "Give it time after the move",
      "Read why a shrink can’t run",
    ]);
    /* Where the agent has not reported, the second topic sends the reader up to the first. */
    const up = check(root, "Check the agent is reporting")
      .flatMap((el) => [...el.querySelectorAll("a")])
      .map((a) => [text(a), a.getAttribute("href")]);
    expect(up).toEqual([["Amoeba is not showing my VM", "#amoeba-is-not-showing-my-vm"]]);
  });

  it.each(pages)(
    "$route: ends on its foot links, none to the page itself, each link's words in one span",
    (page) => {
      const root = draw(page);
      const links = [...root.querySelectorAll(".ar-foot .nw-links a.alink")];
      expect(links.map((a) => [text(a), a.getAttribute("href")])).toEqual(
        page.guide.related.map((link) => [link.text, link.href]),
      );
      const hrefs = links.map((a) => a.getAttribute("href"));
      expect(new Set(hrefs).size).toBe(hrefs.length);
      expect(hrefs.filter((href) => href!.split("#")[0] === page.route)).toEqual([]);
      for (const a of links) expect(a.firstElementChild!.tagName).toBe("SPAN");
    },
  );

  it("prints no figure-like internals: no percentages, GiB or seconds, and no “bill” in our words", () => {
    for (const guide of Object.values(troubleshootingGuides)) {
      /* Every word the page prints: its fields, its blocks and its links, not the tables' column widths. */
      const words = JSON.stringify({ ...guide, sections: guide.sections }, (key, value: unknown) =>
        key === "widths" ? undefined : value,
      );
      expect(words, guide.route).not.toMatch(/\d\s?%|\d\s?GiB|\d\s?(ms|s|min|seconds)\b/);
      expect(words, guide.route).not.toMatch(/\b(bill|billed|billing)\b/i);
    }
  });
});
