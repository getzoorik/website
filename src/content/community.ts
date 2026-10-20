import { blueskyProfile, mastodonProfile, substackPublication } from "@/config/entity";
import { routes } from "@/config/site";
import { designPartnerPlaces } from "@/content/design-partners";
import { socialProfiles } from "@/content/footer";
import { learnCommunities, learnEvents } from "@/content/learn";
import { newsPage } from "@/content/news";

/**
 * `/community`, Zoorik Community: every string the page prints, verbatim from the approved mock.
 *
 * Every address is read from where the site already holds it: r/zoorik and five of the channels from the footer's
 * profiles (`socialProfiles`), Bluesky, Mastodon and Substack from `src/config/entity.ts`, the events from
 * `src/content/events.ts` by the names Learn follows (`learnEvents`), and the wider community from Learn's list
 * (`learnCommunities`), the same list the mock draws.
 */

/**
 * The day /community's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /community's content moves this to that day in the same PR; never the build's date.
 */
export const communityLastUpdated = "19 October 2026";

/** A profile of the footer's list, by its platform. */
const profile = (platform: (typeof socialProfiles)[number]["platform"]): string =>
  socialProfiles.find((entry) => entry.platform === platform)!.href;

/** One channel of "Zoorik everywhere": the platform's name, our handle there, what we post, and the address. */
export interface CommunityChannel {
  readonly name: string;
  readonly handle: string;
  readonly what: string;
  readonly href: string;
}

export const communityPage = {
  /** The page's `<title>` and share title as is: "Zoorik Community: …" names the company already, so no " · Zoorik". */
  meta: {
    title: "Zoorik Community: Reddit, events and the cloud cost community",
    description:
      "Join r/zoorik, follow Zoorik where you read, and find the events and communities for cloud cost, Kubernetes and FinOps.",
  },
  /** The page's name (its h1) and the deck under it. */
  hero: {
    title: "Zoorik Community",
    deck: "Ask questions, share what Coral and Amoeba did on your systems, and meet the people who pay these bills: on Reddit, at events and across the cloud cost community.",
  },
  /** r/zoorik on the navy panel: join it, or read this week's Zoorik Radar on /news. */
  reddit: {
    id: "reddit",
    kicker: "Our community on Reddit",
    title: "r/zoorik",
    line: "Ask about Coral and Amoeba, share your results, and talk to the people who build them. We post each week’s Zoorik Radar, new releases and Validation Lab results there.",
    join: { label: "Join r/zoorik", href: profile("reddit") },
    radar: { label: "This week’s Zoorik Radar", href: `${routes.news}#${newsPage.radar.id}` },
  },
  /** Every place Zoorik posts, in the mock's order. */
  channels: {
    id: "channels",
    title: "Zoorik everywhere",
    lede: "Follow along where you already read.",
    links: [
      {
        name: "LinkedIn",
        handle: "Zoorik",
        what: "Company news and posts",
        href: profile("linkedin"),
      },
      { name: "X", handle: "@getzoorik", what: "Short updates", href: profile("x") },
      { name: "Bluesky", handle: "@zoorik.com", what: "Short updates", href: blueskyProfile },
      {
        name: "Mastodon",
        handle: "@zoorik@mastodon.social",
        what: "Short updates",
        href: mastodonProfile,
      },
      {
        name: "GitHub",
        handle: "getzoorik",
        what: "Code, the Helm chart and the issues",
        href: profile("github"),
      },
      { name: "YouTube", handle: "@getzoorik", what: "Product films", href: profile("youtube") },
      {
        name: "Medium",
        handle: "medium.com/zoorik",
        what: "Articles and Zoorik News",
        href: profile("medium"),
      },
      {
        name: "Substack",
        handle: "zoorik.substack.com",
        what: "Zoorik News by email",
        href: substackPublication,
      },
    ] as readonly CommunityChannel[],
  },
  /**
   * The next big events, with /events's rules: only events not yet ended, with their days known, in /events's order,
   * the first `count` of those Learn follows (`learnEvents`); then the link to /events.
   */
  events: {
    id: "events",
    title: "Events",
    lede: "The next big ones on cloud cost, Kubernetes and FinOps. Every event is on its own page.",
    names: learnEvents.names,
    count: learnEvents.count,
    all: { label: "All events", href: routes.events },
  },
  /** Where people who pay these bills meet: each community's own page, in a new tab. */
  wider: {
    id: "wider",
    title: "The wider community",
    lede: "Where people who pay these bills ask, answer and meet.",
    links: learnCommunities,
  },
  /** The closing card: a link to /design-partners, with the program's one offer. */
  shape: {
    title: "Want to shape what we build?",
    line: `The first ${designPartnerPlaces} design partners run Coral and Amoeba free on non-production infrastructure.`,
    go: "Become a design partner",
    href: routes.designPartners,
  },
} as const;
