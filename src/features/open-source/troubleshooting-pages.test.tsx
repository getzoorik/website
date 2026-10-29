import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* The nav and the footer read the pathname. */
const pathname = vi.hoisted(() => ({ current: "/docs" }));
vi.mock("next/navigation", async (original) => ({
  ...(await original<typeof import("next/navigation")>()),
  usePathname: () => pathname.current,
}));

import AmoebaNotRightsizing, {
  metadata as amoebaNotRightsizingMeta,
} from "@/app/docs/amoeba-not-rightsizing-disks/page";
import AmoebaNotShowingVm, {
  metadata as amoebaNotShowingVmMeta,
} from "@/app/docs/amoeba-not-showing-my-vm/page";
import CoralNotConnecting, {
  metadata as coralNotConnectingMeta,
} from "@/app/docs/coral-not-connecting-to-cluster/page";
import CoralNotRemovingNodes, {
  metadata as coralNotRemovingNodesMeta,
} from "@/app/docs/coral-not-removing-nodes/page";
import { keepsHash, navState, routes } from "@/config/site";
import { troubleshootingGuides } from "@/content/troubleshooting";
import { sectionSlug } from "@/features/open-source/os-guide-page";

/**
 * The four troubleshooting pages under /docs, in the guides' article frame: their metadata and card, the top line
 * with their own date and the short answer, a section per check with the mocks' addresses, the command wells, the
 * Still stuck? section's contact routes, the foot links, and the closing row on each page's own product.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();
const sections = (root: HTMLElement) =>
  [...root.querySelectorAll("article.ar-frame > section.fq-sec")].map((section) => [
    section.id,
    text(section.querySelector("h2")),
  ]);

const pages = [
  {
    route: routes.docsCoralNotConnecting,
    Page: CoralNotConnecting,
    meta: coralNotConnectingMeta,
    product: "coral",
    title: "Coral is not connecting to my cluster",
    h1: "Coral is not connecting to my cluster: what to check",
  },
  {
    route: routes.docsCoralNotRemovingNodes,
    Page: CoralNotRemovingNodes,
    meta: coralNotRemovingNodesMeta,
    product: "coral",
    title: "Why Coral is not removing a node",
    h1: "Why Coral is not removing a node",
  },
  {
    route: routes.docsAmoebaNotShowingVm,
    Page: AmoebaNotShowingVm,
    meta: amoebaNotShowingVmMeta,
    product: "amoeba",
    title: "Amoeba is not showing my VM",
    h1: "Amoeba is not showing my VM: what to check",
  },
  {
    route: routes.docsAmoebaNotRightsizing,
    Page: AmoebaNotRightsizing,
    meta: amoebaNotRightsizingMeta,
    product: "amoeba",
    title: "Why Amoeba has not rightsized my disks yet",
    h1: "Why Amoeba has not rightsized my disks yet",
  },
] as const;

const draw = (page: (typeof pages)[number]) => {
  pathname.current = page.route;
  const { Page } = page;
  return render(<Page />).container;
};

describe("the troubleshooting pages", () => {
  it.each(pages)(
    "$route: titled, described and canonicalised as its mock, with its own card",
    (page) => {
      expect(page.meta.title).toBe(page.title);
      expect(`${page.title} | Zoorik`.length).toBeLessThanOrEqual(60);
      expect(String(page.meta.description).length).toBeLessThanOrEqual(160);
      expect(page.meta.alternates).toEqual({ canonical: page.route });
      expect(page.meta.openGraph).toMatchObject({
        url: page.route,
        title: `${page.title} | Zoorik`,
        images: [
          {
            url: `/og/pages/${page.route.slice(1).replace("/", "-")}.png`,
            alt: `Zoorik. ${page.title}.`,
          },
        ],
      });
    },
  );

  it.each(pages)(
    "$route: its h1, its own date and the short answer, then the closing row on its product",
    (page) => {
      const root = draw(page);
      expect(text(root.querySelector("h1"))).toBe(page.h1);
      expect(text(root.querySelector(".doc-updated"))).toBe(
        "Updated 29 October 2026 · Published by Zoorik",
      );
      expect(root.querySelector(".ar-short > b:first-child")).toHaveTextContent(/^Short answer\.$/);
      const row = root.querySelector("section#assess")!;
      expect(row.querySelector("a.btn-ink")).toHaveAttribute(
        "href",
        `/assessment?p=${page.product}`,
      );
      /* Docs is marked in the header; the page keeps its hash as the article frame does. */
      expect(navState(page.route)).toEqual({ current: "docs" });
      expect(keepsHash(page.route)).toBe(true);
      /* The last section is Still stuck?, with the only two contact routes. */
      const stuck = root.querySelector("section#still-stuck")!;
      expect(stuck.querySelector('a[href="mailto:founders@zoorik.com"]')).not.toBeNull();
      const cal = stuck.querySelector('a[href="https://cal.com/zoorik/talk"]')!;
      expect(cal).toHaveAttribute("target", "_blank");
      expect(text(cal)).toBe("pick a time to talk (opens in a new tab)");
    },
  );

  it("addresses each section as the mocks do: its first seven words, apostrophes dropped", () => {
    expect(sectionSlug("Check the command points at the right cluster")).toBe(
      "check-the-command-points-at-the-right",
    );
    expect(sectionSlug("If the Agent release card says “Re-run connect”")).toBe(
      "if-the-agent-release-card-says-re",
    );
    expect(sectionSlug("Read why a shrink can’t run")).toBe("read-why-a-shrink-cant-run");
    expect(sectionSlug("Still stuck?")).toBe("still-stuck");
    /* The guides' own sections keep their addresses. */
    expect(sectionSlug("With Argo CD or Flux")).toBe("with-argo-cd-or-flux");
  });

  it("Coral is not connecting: its eleven checks in order, two command wells and the Helm table", () => {
    const root = draw(pages[0]);
    expect(sections(root)).toEqual([
      ["check-the-cluster-is-supported", "Check the cluster is supported"],
      ["check-the-command-points-at-the-right", "Check the command points at the right cluster"],
      ["check-the-connect-command-is-fresh", "Check the connect command is fresh"],
      ["check-your-cloud-tools-and-rights", "Check your cloud tools and rights"],
      ["check-the-network", "Check the network"],
      ["check-what-connect-set-up-in-your", "Check what connect set up in your cloud"],
      ["wait-for-the-first-report", "Wait for the first report"],
      ["check-your-helm-install", "Check your Helm install"],
      ["if-the-cluster-shows-not-reporting", "If the cluster shows “Not reporting”"],
      ["if-the-agent-release-card-says-re", "If the Agent release card says “Re-run connect”"],
      ["still-stuck", "Still stuck?"],
    ]);
    const wells = [...root.querySelectorAll(".as-well.doc-well:not(.is-yaml) pre")];
    expect(wells.map((pre) => pre.textContent!.split("\n")[0])).toEqual([
      "$ helm upgrade coral-agent \\",
      "$ kubectl --context <context> -n zoorik-agent rollout restart deployment/zoorik-agent",
      "$ zoorikctl cluster grant-node-deletion",
    ]);
    expect(root.querySelectorAll("table.doc-tbl")).toHaveLength(2);
    /* A chip is plain text, as the mock draws it. */
    expect(root.querySelector("nav.fq-chips a")!.innerHTML).toBe("Check the cluster is supported");
  });

  it("ends each page on its foot links, each link's words in one span", () => {
    const root = draw(pages[1]);
    const links = [...root.querySelectorAll(".ar-foot .nw-links a.alink")];
    expect(links.map((a) => [text(a), a.getAttribute("href")])).toEqual(
      troubleshootingGuides.coralNotRemovingNodes.related.map((link) => [link.text, link.href]),
    );
    for (const a of links) expect(a.firstElementChild!.tagName).toBe("SPAN");
    expect(links.at(-1)).toHaveAttribute("href", "/docs/coral-not-connecting-to-cluster");
  });

  it("Why Coral is not removing a node: only hostPath data holds a node, as the Learn article it links says", () => {
    const root = draw(pages[1]);
    const reasons = [
      ...root.querySelectorAll("section#check-what-is-holding-the-node table.doc-tbl tbody tr"),
    ].map((row) => text(row.querySelector("th, td")));
    expect(reasons).toContain("Data on the node’s own disk (hostPath).");
    expect(reasons.join(" ")).not.toMatch(/emptyDir/);
  });

  it("Amoeba's two pages: their checks in order, ending on Still stuck?", () => {
    expect(sections(draw(pages[2])).map(([id]) => id)).toEqual([
      "read-the-line-under-the-list",
      "check-the-cloud-connection",
      "check-the-vms-subscription-is-included",
      "check-the-vm-is-running-and-has",
      "give-the-list-a-moment",
      "on-aws-check-the-instance",
      "check-the-agent-has-reported",
      "if-the-install-failed-or-the-agent",
      "still-stuck",
    ]);
    expect(sections(draw(pages[3])).map(([id]) => id)).toEqual([
      "check-the-agent-is-reporting",
      "check-whether-amoeba-declined-the-vm",
      "check-whether-the-move-paused",
      "check-the-linux-requirements",
      "check-the-shrink-setting",
      "give-it-time-after-the-move",
      "read-why-a-shrink-cant-run",
      "still-stuck",
    ]);
  });

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
