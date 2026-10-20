import { readFileSync } from "node:fs";

import { act, render } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { blueskyProfile, mastodonProfile, substackPublication } from "@/config/entity";
import { routes } from "@/config/site";
import { communityLastUpdated, communityPage } from "@/content/community";
import { designPartnerPlaces } from "@/content/design-partners";
import { events } from "@/content/events";
import { socialProfiles } from "@/content/footer";
import { learnCommunities, learnEvents } from "@/content/learn";
import { newsPage } from "@/content/news";
import { ended, upcoming, when } from "@/features/events/event-facts";

/* The nav and the footer read the pathname. */
vi.mock("next/navigation", () => ({ usePathname: () => "/community" }));

import CommunityRoute, { metadata } from "@/app/community/page";

import { CommunityEvents } from "./community-events";
import { communityEvents } from "./community-page";

/**
 * `/community`, Zoorik Community: the metadata, the hero, r/zoorik,
 * the eight channels, the next three events with /events's rules (left out at build, dropped in the browser), the
 * wider community, the design partners' card and the closing row. Its sitemap entry is in `src/app/sitemap.test.ts`,
 * its page graph in `src/config/structured-data.test.ts`, and that it names no competitor in
 * `src/features/learn/market-names.test.ts`.
 */

const text = (el: Element | null): string => (el?.textContent ?? "").replace(/[\s ]+/g, " ").trim();

/** Noon on a day in the reader's own time zone. */
const at = (day: string) => {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  vi.setSystemTime(new Date(y, m - 1, d, 12));
};
afterEach(() => {
  vi.useRealTimers();
});

const page = (day = "2026-10-19") => {
  at(day);
  return render(<CommunityRoute />).container;
};

const profile = (platform: string) => socialProfiles.find((p) => p.platform === platform)!.href;

/** An off-site link the site's way: a new tab, no opener, the hidden hint, and the arrow. */
function expectOffSite(link: Element, href: string) {
  expect(link).toHaveAttribute("href", href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(text(link.querySelector(".sr-only"))).toBe("(opens in a new tab)");
  expect(link.querySelector("svg.ext")).toHaveAttribute("aria-hidden", "true");
}

/** The events the card shows, as [day, month, name, place]. */
const shown = (root: ParentNode) =>
  [...root.querySelectorAll(".cm-evs li")].map((li) => [
    text(li.querySelector(".cm-date b")),
    text(li.querySelector(".cm-date span")),
    text(li.querySelector(":scope > span:last-child > b")),
    text(li.querySelector("small")),
  ]);

/** What the card must show on a day: the first three followed events still to come, by /events's helpers. */
const expected = (day: string) =>
  upcoming(events, day)
    .filter(
      (event) =>
        event.startDate.length === 10 && learnEvents.names.includes(event.name.split(" 20")[0]!),
    )
    .slice(0, 3)
    .map((event) => [
      when(event).day,
      when(event).month,
      event.name,
      `${event.city}, ${event.country}`,
    ]);

describe("/community's metadata", () => {
  it("titles the page as is, with no ' · Zoorik' after it, and describes and canonicalises it", () => {
    expect(metadata.title).toEqual({
      absolute: "Zoorik Community: Reddit, events and the cloud cost community",
    });
    expect(metadata.description).toBe(
      "Join r/zoorik, follow Zoorik where you read, and find the events and communities for cloud cost, Kubernetes and FinOps.",
    );
    expect(metadata.alternates).toEqual({ canonical: "/community" });
    expect(metadata).not.toHaveProperty("robots");
    expect(metadata.openGraph).toMatchObject({
      url: "/community",
      title: "Zoorik Community: Reddit, events and the cloud cost community",
    });
    expect(routes.community).toBe("/community");
    expect(communityLastUpdated).toBe("19 October 2026");
  });
});

describe("/community", () => {
  it("names the page Zoorik Community, with its deck", () => {
    const root = page();
    expect(root.querySelectorAll("h1")).toHaveLength(1);
    expect(text(root.querySelector("header.hero.doc-hero h1"))).toBe("Zoorik Community");
    expect(text(root.querySelector("header.hero .doc-deck"))).toBe(
      "Ask questions, share what Coral and Amoeba did on your systems, and meet the people who pay these bills: on Reddit, at events and across the cloud cost community.",
    );
    expect(root.querySelector("a.skip")).toHaveAttribute("href", "#main");
  });

  it("has r/zoorik, the channels on the band, the events, the wider community on the band, the card, then the closing row", () => {
    const root = page();
    expect(
      [...root.querySelectorAll("main > section")].map((s) => [
        s.id,
        s.className,
        s.getAttribute("aria-labelledby"),
      ]),
    ).toEqual([
      ["reddit", "sec lv-sec", "reddit-h"],
      ["channels", "sec lv-sec sec-band", "channels-h"],
      ["events", "sec lv-sec", "events-h"],
      ["wider", "sec lv-sec sec-band", "wider-h"],
      ["", "sec lv-sec", null],
      ["assess", "sec", null],
    ]);
    expect(
      [...root.querySelectorAll("main > section .lv-head")].map((head) => [
        text(head.querySelector("h2")),
        text(head.querySelector("p")),
      ]),
    ).toEqual([
      ["Zoorik everywhere", "Follow along where you already read."],
      [
        "Events",
        "The next big ones on cloud cost, Kubernetes and FinOps. Every event is on its own page.",
      ],
      ["The wider community", "Where people who pay these bills ask, answer and meet."],
    ]);
    /* The company's name is kept from translation in the channels' heading, as the mock marks it. */
    expect(root.querySelector('#channels-h span[translate="no"]')).toHaveTextContent("Zoorik");
  });

  it("puts r/zoorik on the navy panel: join it in a new tab, or read this week's Zoorik Radar on /news", () => {
    const root = page();
    const panel = root.querySelector("#reddit .cm-rd")!;
    expect(text(panel.querySelector(".cm-k"))).toBe("Our community on Reddit");
    expect(text(panel.querySelector("h2#reddit-h"))).toBe("r/zoorik");
    expect(text(panel.querySelector(".cm-rdc > p:not(.cm-k)"))).toBe(
      "Ask about Coral and Amoeba, share your results, and talk to the people who build them. We post each week’s Zoorik Radar, new releases and Validation Lab results there.",
    );
    const [join, radar] = [...panel.querySelectorAll(".cm-acts a")];
    expect(join).toHaveClass("cm-btn");
    expect(text(join!).replace(" (opens in a new tab)", "")).toBe("Join r/zoorik");
    expectOffSite(join!, profile("reddit"));
    expect(radar).toHaveClass("cm-btn2");
    expect(text(radar!)).toBe("This week’s Zoorik Radar");
    expect(radar).toHaveAttribute("href", `/news#${newsPage.radar.id}`);
    expect(radar).not.toHaveAttribute("target");
    /* The threads beside it are a drawing: hidden from assistive tech, four of them, each two bars. */
    const feed = panel.querySelector(".cm-feed")!;
    expect(feed).toHaveAttribute("aria-hidden", "true");
    expect(
      [...feed.querySelectorAll(".cm-th")].map((th) => [
        (th.querySelector("b") as HTMLElement).style.width,
        (th.querySelector("em") as HTMLElement).style.width,
      ]),
    ).toEqual([
      ["78%", "52%"],
      ["64%", "40%"],
      ["86%", "58%"],
      ["58%", "34%"],
    ]);
  });

  it("lists the eight places Zoorik posts, each with our handle there, read from the site's own profiles", () => {
    const root = page();
    const links = [...root.querySelectorAll("#channels .cm-ch > a")];
    expect(
      links.map((a) => [
        text(a.querySelector("b")),
        text(a.querySelector(":scope > span:not(.sr-only)")),
        text(a.querySelector("small")),
      ]),
    ).toEqual([
      ["LinkedIn", "Zoorik", "Company news and posts"],
      ["X", "@getzoorik", "Short updates"],
      ["Bluesky", "@zoorik.com", "Short updates"],
      ["Mastodon", "@zoorik@mastodon.social", "Short updates"],
      ["GitHub", "getzoorik", "Code, the Helm chart and the issues"],
      ["YouTube", "@getzoorik", "Product films"],
      ["Medium", "medium.com/zoorik", "Articles and Zoorik News"],
      ["Substack", "zoorik.substack.com", "Zoorik News by email"],
    ]);
    const hrefs = [
      profile("linkedin"),
      profile("x"),
      blueskyProfile,
      mastodonProfile,
      profile("github"),
      profile("youtube"),
      profile("medium"),
      substackPublication,
    ];
    links.forEach((a, i) => expectOffSite(a, hrefs[i]!));
    /* The handle and the line carry no span of their own: `.cm-ch span` sizes every span in a card. */
    for (const a of links) expect(a.querySelectorAll("span")).toHaveLength(2);
  });

  it("shows the next three big events, each with its date tile, name and place, and links to /events", () => {
    const root = page();
    expect(shown(root)).toEqual([
      [
        "9–12",
        "Nov",
        "KubeCon + CloudNativeCon North America 2026",
        "Salt Lake City, United States",
      ],
      ["17–20", "Nov", "Microsoft Ignite 2026", "San Francisco, United States"],
      ["30–4", "Nov–Dec", "AWS re:Invent 2026", "Las Vegas, United States"],
    ]);
    expect(shown(root)).toEqual(expected("2026-10-19"));
    const all = root.querySelector("#events .cm-evs > a")!;
    expect(all).toHaveClass("cm-btn2", "dark");
    expect(all).toHaveAttribute("href", "/events");
    expect(text(all)).toBe("All events");
    expect(all).not.toHaveAttribute("target");
  });

  it("lists the wider community, each in a new tab, from Learn's list", () => {
    const root = page();
    const links = [...root.querySelectorAll("#wider .cm-list > a.cm-c")];
    expect(links.map((a) => [text(a.querySelector("b")), text(a.querySelector("small"))])).toEqual(
      learnCommunities.map((entry) => [entry.name, entry.line]),
    );
    expect(links.map((a) => text(a.querySelector("b")))).toEqual([
      "Kubernetes Slack",
      "CNCF Slack",
      "FinOps Foundation community",
      "Kubernetes Community Days",
      "r/kubernetes · r/FinOps",
      "r/AZURE · r/aws",
    ]);
    links.forEach((a, i) => expectOffSite(a, learnCommunities[i]!.url));
  });

  it("ends on the design partners' card, then the site's closing row for both products", () => {
    const root = page();
    const card = root.querySelector("main > section:not([id]) a.cm-shape")!;
    expect(card).toHaveAttribute("href", "/design-partners");
    expect(text(card.querySelector("b"))).toBe("Want to shape what we build?");
    expect(text(card.querySelector("small"))).toBe(
      `The first ${designPartnerPlaces} design partners run Coral and Amoeba free on non-production infrastructure.`,
    );
    expect(
      [...card.querySelectorAll('small span[translate="no"]')].map((el) => el.textContent),
    ).toEqual(["Coral", "Amoeba"]);
    expect(text(card.querySelector(".fx-read"))).toBe("Become a design partner");
    const row = root.querySelector("main > section#assess")!;
    expect(row.querySelector('a[href="/assessment"]')).not.toBeNull();
    expect(text(row)).toContain("Thirty minutes with the people who build Coral and Amoeba.");
  });

  it("opens every off-site link in a new tab, and no other", () => {
    const root = page();
    for (const a of root.querySelectorAll("main a")) {
      const href = a.getAttribute("href")!;
      if (/^https?:\/\//.test(href)) expect(a, href).toHaveAttribute("target", "_blank");
      else expect(a, href).not.toHaveAttribute("target");
    }
  });

  it("stores nothing in the browser", () => {
    for (const file of [
      "src/features/community/community-page.tsx",
      "src/features/community/community-events.tsx",
    ]) {
      expect(readFileSync(file, "utf8")).not.toMatch(
        /localStorage|sessionStorage|indexedDB|document\.cookie/,
      );
    }
  });
});

describe("/community's past events", () => {
  it("leaves out at build what had ended by the build's day", () => {
    const root = page("2026-11-13");
    expect(shown(root)).toEqual(expected("2026-11-13"));
    expect(shown(root).map(([, , name]) => name)).toEqual([
      "Microsoft Ignite 2026",
      "AWS re:Invent 2026",
      "KubeCon + CloudNativeCon North America 2027",
    ]);
  });

  it("drops in the browser what has ended since the build, by the reader's own day, and the next takes its place", () => {
    at("2026-11-13");
    const root = render(
      <CommunityEvents
        events={communityEvents("2026-10-19")}
        buildDay="2026-10-19"
        count={communityPage.events.count}
        all={communityPage.events.all}
      />,
    ).container;
    expect(shown(root)).toEqual(expected("2026-11-13"));
    for (const event of events.filter((e) => ended(e, "2026-11-13")))
      expect(shown(root).map(([, , name]) => name)).not.toContain(event.name);
  });

  it("keeps its link to /events when nothing is left to show", () => {
    at("2026-10-19");
    const root = render(
      <CommunityEvents
        events={[]}
        buildDay="2026-10-19"
        count={3}
        all={communityPage.events.all}
      />,
    ).container;
    expect(root.querySelector("ol")).toBeNull();
    expect(root.querySelector(".cm-evs > a")).toHaveAttribute("href", "/events");
  });

  it("hydrates the build's HTML without an error, then follows the reader's day", async () => {
    const list = communityEvents("2026-10-19");
    const card = (
      <CommunityEvents
        events={list}
        buildDay="2026-10-19"
        count={communityPage.events.count}
        all={communityPage.events.all}
      />
    );
    at("2026-10-19");
    const host = document.createElement("div");
    host.innerHTML = renderToString(card);
    document.body.append(host);
    expect(shown(host)).toEqual(expected("2026-10-19"));

    at("2026-11-13");
    const failures: unknown[] = [];
    const error = vi.spyOn(console, "error").mockImplementation((...args) => failures.push(args));
    const root = await act(async () =>
      hydrateRoot(host, card, { onRecoverableError: (e) => failures.push(e) }),
    );
    expect(failures).toEqual([]);
    expect(shown(host)).toEqual(expected("2026-11-13"));
    error.mockRestore();
    act(() => root.unmount());
    host.remove();
  });
});
