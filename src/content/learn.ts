import { routes } from "@/config/site";
import { caseStudiesHub } from "@/content/case-studies";
import { socialProfiles } from "@/content/footer";
import { type ArticleId, articleByline, articles } from "@/content/learn-articles";
import { marketGroups } from "@/content/learn-market";
import { newsPage, newsRadar } from "@/content/news";
import type { ProductId } from "@/content/products";

/**
 * `/learn`, the hub: every string it prints, verbatim from the approved mock. Ordered by how the reader thinks: Start
 * here, Find the right fix, Compare, Guides, Watch and read, More from Zoorik, then the case study. Always the three
 * subjects, Cloud cost, Kubernetes and Block storage. Learn teaches only: the market map and the comparisons against
 * the market are /compare's, the news /news's and the community /community's, and the hub links each from More from
 * Zoorik, so /learn names no tool of the market.
 *
 * ─── ONLY WHAT IS PUBLISHED ─────────────────────────────────────────────────
 * The mock also draws the planned articles as "Coming" cards: they are the plan, and the hub does not show them. A
 * card here is an article of `learn-articles.ts`, and reads that article's own h1, card line, date and author, so the
 * hub and the article never disagree. Start here's "Coming next" line, under each subject's card, is drawn as the mock
 * draws it while `learnComingNext` is true. Watch and read holds only what is out: the two product films and the one
 * live Medium post.
 *
 * ─── WHERE THE REST COMES FROM ──────────────────────────────────────────────
 * The films are `product-films.ts`'s, the channels the footer's profiles (`socialProfiles`), the case study
 * `case-studies.ts`'s, the week's headline `news.ts`'s and the tools' count and groups `learn-market.ts`'s, so a weekly
 * refresh of /news or a new check of the market moves the cards too. /community reads the events Learn follows
 * (`learnEvents`) and the wider community (`learnCommunities`) from here.
 */

/** The three subjects, in the hub's order: the chips, the cards' tags and each card's `data-p`. */
export type LearnSubject = "cloud" | "k8s" | "storage";

export const learnSubjects: readonly { readonly id: LearnSubject; readonly label: string }[] = [
  { id: "cloud", label: "Cloud cost" },
  { id: "k8s", label: "Kubernetes" },
  { id: "storage", label: "Block storage" },
];

/**
 * Each product's subject: where its comparison cards on /compare file (Coral's under Kubernetes, Amoeba's under Block
 * storage).
 */
export const learnProductSubject: Readonly<Record<ProductId, LearnSubject>> = {
  coral: "k8s",
  amoeba: "storage",
};

/**
 * Start here's "Coming next" line: true draws each subject's planned guide under its
 * card, as the mock does; false leaves each card on its article's date, as the other cards are.
 */
export const learnComingNext = true;

export const learnPage = {
  path: routes.learn,
  meta: {
    /** "Zoorik Learn": the page's and the share card's title as is, never followed by " · Zoorik",
     *  which would name the company twice. The h1 stays "Learn cloud cost optimization"; the menus still say "Learn". */
    title: "Zoorik Learn: cloud cost optimization guides",
    description:
      "Guides and comparisons for Kubernetes, block storage and the whole cloud bill on Azure and AWS, from where the money goes to the right fix.",
  },
  hero: {
    title: "Learn cloud cost optimization",
    deck: "Guides, comparisons and what changed this week, for Kubernetes, block storage and the whole cloud bill on Azure and AWS.",
  },
  /** The day the hub's own content last changed (the new hub), for the sitemap; it is not printed. */
  updated: "Updated 19 October 2026",
  /** The search in the hero: its name for a screen reader, and what the empty field says. */
  search: {
    label: "Search Learn",
    placeholder: "Search guides, comparisons, tools and news",
  },
  /** The subject chips, beside Start here's head. */
  subjects: { label: "Subject", all: "All" },
  start: {
    id: "start",
    title: "Start here",
    lede: "One guide per subject: where the money goes and what moves it most.",
    next: "Coming next",
    /** When the search and the subject leave nothing: the line and its button, which shows everything again. */
    empty: "Nothing matches.",
    reset: "Show everything",
  },
  fix: {
    id: "fix",
    title: "Find the right fix",
    lede: "Pick what is costing you. See what helps, the native tools, and where Zoorik fits.",
    /** The list of questions: its name and its heading. */
    question: "What is costing you?",
    helps: "What helps",
    tools: "The native tools",
    fits: "Where Zoorik fits",
    read: "Read: ",
  },
  compare: {
    id: "compare",
    title: "Compare",
    lede: "Native tools and approaches, side by side.",
    /** Between the two names on a comparison's cover. */
    vs: "vs",
  },
  guides: {
    id: "guides",
    title: "Guides and best practices",
    lede: "Plain explainers, each with its sources.",
  },
  /**
   * Watch and read: the two product films, each opening on YouTube, then the Medium
   * panel, with the live post and the follow links.
   */
  watch: {
    id: "watch",
    title: "Watch and read",
    lede: "Two-minute films on YouTube, and longer reads on Medium.",
    /** The small line over each film's title, and its link's words. */
    film: { kicker: "YouTube", go: "Watch on YouTube" },
    /** The navy panel: its small line, the post's link words and the two follow links' words. */
    medium: {
      kicker: "On Medium",
      go: "Read on Medium",
      follow: "Follow on Medium",
      subscribe: "Subscribe on YouTube",
    },
  },
  /** More from Zoorik: its h2, which has no lede, and each card's link words. */
  more: {
    id: "more",
    title: "More from Zoorik",
    open: "Open",
  },
  /** On a real cluster, on the band. */
  proof: {
    id: "proof",
    title: "On a real cluster",
    lede: "What the practices add up to, measured.",
  },
} as const;

/** One card of the hub: a published article, as its own page writes it. */
export interface LearnCard {
  readonly href: string;
  readonly subject: LearnSubject;
  /** The article's h1. */
  readonly title: string;
  /** Its card line. */
  readonly line: string;
  /** Its date as a card prints it, "9 Oct", with its author where it has one: "14 Oct · By Vineet". */
  readonly date: string;
  /** A comparison's cover: the two sides it compares, drawn in place of the subject's motif. */
  readonly versus?: readonly [string, string];
}

/** "Updated 14 October 2026" → "14 Oct": the card's short date, read from the article's own Updated line. */
const shortDate = (updated: string): string => {
  const found = /(\d{1,2}) ([A-Z][a-z]{2})[a-z]* \d{4}$/.exec(updated);
  if (!found) throw new Error(`An article's Updated line reads "${updated}", which has no date.`);
  return `${found[1]} ${found[2]}`;
};

/** A published article as a hub card: its title, line, date and author are the article's own. */
const card = (
  id: ArticleId,
  subject: LearnSubject,
  extra: { readonly versus?: readonly [string, string] } = {},
): LearnCard => {
  const article = articles[id];
  const by = article.author ? `${articleByline.author}${article.author.name}` : "";
  return {
    href: article.route,
    subject,
    title: article.hero.title,
    line: article.card,
    date: `${shortDate(article.updated)}${by}`,
    ...(extra.versus ? { versus: extra.versus } : {}),
  };
};

/** Each published article once, by id, with its subject (and, for a comparison, its cover's two sides). */
const cards: Readonly<Record<ArticleId, LearnCard>> = {
  "poor-architecture-cloud-bill": card("poor-architecture-cloud-bill", "cloud"),
  "shrink-azure-managed-disk": card("shrink-azure-managed-disk", "storage"),
  "vpa-vs-hpa": card("vpa-vs-hpa", "k8s", { versus: ["VPA", "HPA"] }),
  "coral-and-native-autoscalers": card("coral-and-native-autoscalers", "k8s", {
    versus: ["Coral", "Native"],
  }),
};

/** Start here: one guide per subject, the best published one, and the subject's planned guide as Coming next. */
export const learnStart: readonly {
  readonly card: LearnCard;
  readonly next: { readonly title: string; readonly when: string };
}[] = [
  {
    card: cards["poor-architecture-cloud-bill"],
    next: { title: "How to reduce cloud costs in 2026", when: "soon" },
  },
  {
    card: cards["coral-and-native-autoscalers"],
    next: {
      title: "How to reduce Kubernetes cost: rebalance requests, then remove spare nodes",
      when: "8 Dec",
    },
  },
  {
    card: cards["shrink-azure-managed-disk"],
    next: {
      title: "Azure disk cost optimization: stop paying for empty disk space",
      when: "3 Nov",
    },
  },
];

/** Compare: the published comparisons of the native tools (the market's are /compare's). */
export const learnComparisons: readonly LearnCard[] = [
  cards["vpa-vs-hpa"],
  cards["coral-and-native-autoscalers"],
];

/** Guides and best practices: the published guides. */
export const learnGuides: readonly LearnCard[] = [
  cards["poor-architecture-cloud-bill"],
  cards["shrink-azure-managed-disk"],
];

/** Where a fix's "Read:" link goes: an article (its own h1), or the free assessment. */
const read = (id: ArticleId) => ({ title: articles[id].hero.title, href: articles[id].route });

/** Find the right fix: what hurts, what helps, the native tools, where Zoorik fits, and what to read. */
export const learnFixes: readonly {
  readonly subject: LearnSubject;
  readonly question: string;
  readonly helps: string;
  readonly tools: readonly string[];
  readonly fits: string;
  readonly read: { readonly title: string; readonly href: string };
}[] = [
  {
    subject: "k8s",
    question: "Machines sit half empty",
    helps: "Pack the pods tighter and remove the machines the cluster no longer needs.",
    tools: ["Cluster Autoscaler", "Karpenter", "AKS node auto provisioning"],
    fits: "Coral rebalances workloads onto fewer, cheaper machines and removes the spare ones, within each app’s safety limits.",
    read: read("coral-and-native-autoscalers"),
  },
  {
    subject: "k8s",
    question: "Pods reserve more than they use",
    helps: "Set each pod’s requests from what it really uses.",
    tools: ["Vertical Pod Autoscaler"],
    /* The mock has Coral "right-size" apps: Coral rebalances, and rightsizing is Amoeba's verb. */
    fits: "Coral rebalances apps to what they use, and raises them when an app needs more.",
    read: read("vpa-vs-hpa"),
  },
  {
    subject: "k8s",
    question: "Load spikes, then sits idle",
    helps: "Scale the number of pods with demand, from metrics or events.",
    tools: ["Horizontal Pod Autoscaler", "KEDA"],
    fits: "Coral works alongside them: it sizes each pod, they decide how many.",
    read: read("coral-and-native-autoscalers"),
  },
  {
    subject: "storage",
    question: "Disks are bigger than their data",
    helps: "Bring each disk back to the space its data needs.",
    tools: ["Azure: no in-place shrink", "Amazon EBS: volumes only grow"],
    fits: "Amoeba rightsizes block storage, Azure managed disks and Amazon EBS, autonomously, without any downtime.",
    read: read("shrink-azure-managed-disk"),
  },
  {
    subject: "cloud",
    question: "You can’t see where the money goes",
    helps: "See the bill by cluster, node pool and disk before you change anything.",
    tools: ["Azure Cost Management", "AWS Cost Explorer", "OpenCost"],
    fits: "The free assessment reads your clusters or disks and writes one PDF with your estimated saving at list price.",
    read: { title: "The free assessment", href: routes.assessment },
  },
  {
    subject: "cloud",
    question: "The architecture itself costs too much",
    helps: "Fix the design decisions that make every environment expensive.",
    tools: ["Architecture review", "Right environment sizes"],
    fits: "Start with the article; Coral and Amoeba reduce what remains.",
    read: read("poor-architecture-cloud-bill"),
  },
];

/**
 * On a real cluster: the case study's card, every word and figure read from the study (`caseStudiesHub.studies`):
 * what it is ("Validation Lab · Coral on AKS", its card's kicker without the month), its big figure, its title, its
 * card's line without the line's subject, and the card's own "Read the case study".
 */
const study = caseStudiesHub.studies[0]!;

export const learnProof = {
  href: study.href,
  kicker: study.kicker.split(" · ").slice(0, 2).join(" · "),
  figure: study.figure,
  title: study.title,
  line: study.line.slice(study.line.indexOf(": ") + 2),
  read: caseStudiesHub.card.read,
} as const;

/** A profile of the footer's list, by its platform. */
const profile = (platform: (typeof socialProfiles)[number]["platform"]): string =>
  socialProfiles.find((entry) => entry.platform === platform)!.href;

/**
 * Watch and read's films: each product's film (`product-films.ts`: its title, length, poster and address) with the
 * line under it, which says what the film shows. A film not on YouTube yet (`url` null) is left out, as the product
 * pages leave out its band.
 */
export const learnFilmLines: Readonly<Record<ProductId, string>> = {
  coral: "How Coral rebalances Kubernetes on AKS and EKS.",
  amoeba: "How Amoeba rightsizes block storage on Azure and AWS.",
};

/**
 * Watch and read's Medium panel: the one live post, in its own title and subtitle and on its day, then the two follow
 * links, to the publication and the YouTube channel (the footer's profiles). The post's address is the one Medium
 * serves; the mock's is cut short after its id's first four characters.
 */
export const learnMedium = {
  post: {
    date: "12 Oct 2026",
    title: "Why your Kubernetes cluster pays for capacity it doesn’t use",
    line: "Pods often reserve more CPU and memory than they use, and you pay for the nodes that hold them.",
    url: "https://medium.com/zoorik/why-your-kubernetes-cluster-pays-for-capacity-it-doesnt-use-66863320dca3",
  },
  follow: profile("medium"),
  subscribe: profile("youtube"),
} as const;

/* "four groups": a count of groups in words. */
const inWords = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/**
 * The short name of each group of the market map, as the Cloud cost optimization tools card lists them, by the
 * group's id in `learn-market.ts`.
 */
export const learnMarketGroupNames: Readonly<Record<string, string>> = {
  k8s: "Kubernetes",
  storage: "Block storage",
  finops: "FinOps",
  native: "Cloud providers",
};

const toolCount = marketGroups.reduce((sum, group) => sum + group.tools.length, 0);

/**
 * More from Zoorik: one card each for /news, /compare and /community, each its name, its line and one more line.
 * Zoorik News's is the week's first headline of the Radar's first stream (`newsRadar`), as the mock picks it; the
 * tools' is the market map's count and groups, in its order (`marketGroups`).
 */
export const learnMore: readonly {
  readonly href: string;
  readonly title: string;
  readonly line: string;
  readonly extra: string;
}[] = [
  {
    href: routes.news,
    title: newsPage.hero.title,
    line: "What we ship, and Zoorik Radar: what changed this week in cloud, Kubernetes and FinOps.",
    extra: `This week: ${newsRadar.streams[0].items[0]!.title}`,
  },
  {
    href: routes.compare,
    title: "Cloud cost optimization tools",
    line: `${toolCount} tools by name in ${inWords[marketGroups.length]} groups: what each does, how it acts and where it runs.`,
    extra: marketGroups.map((group) => learnMarketGroupNames[group.id]).join(" · "),
  },
  {
    href: routes.community,
    title: "Community",
    line: "r/zoorik on Reddit, the events worth going to, and where to ask.",
    extra: "Join r/zoorik",
  },
];

/**
 * The events Learn follows, read by /community (its Events): the three big ones, by name (the event's name before its
 * year), read from `events.ts` with /events's rules: only events not yet ended, with their days known, by date, the
 * first `count`.
 */
export const learnEvents: { readonly names: readonly string[]; readonly count: number } = {
  names: ["KubeCon + CloudNativeCon North America", "Microsoft Ignite", "AWS re:Invent"],
  count: 3,
};

/**
 * Where people who pay these bills meet, read by /community (its wider community): each community's own page, opened
 * in a new tab.
 */
export const learnCommunities: readonly {
  readonly name: string;
  readonly line: string;
  readonly url: `https://${string}`;
}[] = [
  {
    name: "Kubernetes Slack",
    line: "The project’s own chat, with a channel for each group, autoscaling included.",
    url: "https://slack.k8s.io/",
  },
  {
    name: "CNCF Slack",
    line: "Chat for every CNCF project and community group.",
    url: "https://slack.cncf.io/",
  },
  {
    name: "FinOps Foundation community",
    line: "Practitioner calls, chapters and meetups, India included.",
    url: "https://www.finops.org/community/",
  },
  {
    name: "Kubernetes Community Days",
    line: "Local, community-run Kubernetes days around the world.",
    url: "https://www.cncf.io/kcds/",
  },
  {
    name: "r/kubernetes · r/FinOps",
    line: "Where engineers ask what their bill is doing.",
    url: "https://www.reddit.com/r/kubernetes/",
  },
  {
    name: "r/AZURE · r/aws",
    line: "Questions on disks, prices and quotas, answered by people who run them.",
    url: "https://www.reddit.com/r/AZURE/",
  },
];
