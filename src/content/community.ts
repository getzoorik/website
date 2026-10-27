import { contactEmail, routes } from "@/config/site";
import { designPartnerPlaces } from "@/content/design-partners";
import { socialProfiles } from "@/content/footer";

/**
 * `/community`, Zoorik Community: every string the page prints, verbatim from the approved mock.
 *
 * r/zoorik and Medium are read from the footer's profiles (`socialProfiles`). The other communities are the most
 * important three per group, each checked on its own page on the day `communities.checked` names, and none run by a
 * cloud cost vendor; each shows its own logo.
 */

/**
 * The day /community's content last changed, for the sitemap's `lastmod` only: the page does not print it. Whoever
 * changes /community's content moves this to that day in the same PR; never the build's date.
 */
export const communityLastUpdated = "21 October 2026";

/** A profile of the footer's list, by its platform. */
const profile = (platform: (typeof socialProfiles)[number]["platform"]): string =>
  socialProfiles.find((entry) => entry.platform === platform)!.href;

/**
 * Whose logo a community's tile shows: Reddit's and Medium's marks are drawn in the page; Azure's and AWS's are the
 * site's cloud marks; the FinOps Foundation's, Karpenter's and OpenCost's are their own files under
 * `public/community-logos/`.
 */
export type CommunityLogo =
  "reddit" | "azure" | "aws" | "finops-foundation" | "karpenter" | "opencost";

/** One community: its name, what it is for, its own page, and its logo. */
export interface Community {
  readonly name: string;
  readonly what: string;
  readonly href: string;
  readonly logo: CommunityLogo;
}

/** One group of communities under its plain grey name. */
export interface CommunityGroup {
  readonly name: string;
  readonly communities: readonly Community[];
}

/** One tile of More from Zoorik: a page of this site. */
export interface CommunityMore {
  readonly title: string;
  readonly line: string;
  readonly href: string;
}

export const communityPage = {
  /** The `<title>`'s own words, before " | Zoorik", and the description. */
  meta: {
    title: "Community",
    description:
      "The communities that matter for FinOps and cloud cost on Kubernetes, Azure and AWS, with r/zoorik and Zoorik News on Medium.",
  },
  /** The page's name (its h1) and the deck under it. */
  hero: {
    title: "Zoorik Community",
    deck: "Talk to the people who build Coral and Amoeba, and find the communities that matter for FinOps and cloud cost on Kubernetes, Azure and AWS.",
  },
  /** Our own two, on the band: r/zoorik on the white card, Zoorik News on Medium on the navy one. */
  ours: {
    id: "ours",
    label: "Zoorik on Reddit and Medium",
    reddit: {
      title: "r/zoorik",
      line: "Our community on Reddit. Ask about Coral and Amoeba, share your results and talk to the people who build them.",
      join: { label: "Join r/zoorik", href: profile("reddit") },
    },
    news: {
      title: "Zoorik News",
      line: "Our newsletter on Medium: what we ship, and each week’s Zoorik Radar, by email.",
      subscribe: { label: "Subscribe on Medium", href: profile("medium") },
    },
  },
  /** The communities, three per group, each its own page in a new tab; then the day they were checked. */
  communities: {
    id: "communities",
    title: "FinOps and cloud cost communities",
    groups: [
      {
        name: "FinOps",
        communities: [
          {
            name: "FinOps Foundation Slack",
            what: "The FinOps Foundation’s Slack: practitioners discuss cloud cost by topic.",
            href: "https://www.finops.org/community/community-slack/",
            logo: "finops-foundation",
          },
          {
            name: "r/FinOps",
            what: "Questions and discussion on cloud cost; vendors must say when they promote.",
            href: "https://www.reddit.com/r/FinOps/",
            logo: "reddit",
          },
          {
            name: "FinOps meetups",
            what: "The FinOps Foundation’s in-person meetups for practitioners, city by city.",
            href: "https://www.finops.org/community/events/?prod_COR_EVENTS%5BrefinementList%5D%5Bevent_type%5D%5B0%5D=FinOps%20Meetup",
            logo: "finops-foundation",
          },
        ],
      },
      {
        name: "Kubernetes",
        communities: [
          {
            name: "r/kubernetes",
            what: "Kubernetes subreddit; cluster cost and resource requests come up often.",
            href: "https://www.reddit.com/r/kubernetes/",
            logo: "reddit",
          },
          {
            name: "#karpenter on Kubernetes Slack",
            what: "Configuring and troubleshooting Karpenter node autoscaling.",
            href: "https://slack.k8s.io/",
            logo: "karpenter",
          },
          {
            name: "#opencost on CNCF Slack",
            what: "OpenCost users and maintainers on Kubernetes cost monitoring and allocation.",
            href: "https://slack.cncf.io/",
            logo: "opencost",
          },
        ],
      },
      {
        name: "Azure",
        communities: [
          {
            name: "r/AZURE",
            what: "Azure subreddit; cost and billing questions come up regularly.",
            href: "https://www.reddit.com/r/AZURE/",
            logo: "reddit",
          },
          {
            name: "FinOps on Microsoft Community Hub",
            what: "Microsoft’s board for FinOps on Microsoft Cloud, FOCUS and the FinOps toolkit.",
            href: "https://techcommunity.microsoft.com/category/azure/discussions/finops",
            logo: "azure",
          },
          {
            name: "Cost Management on Microsoft Q&A",
            what: "Questions on Azure cost tracking, billing and charges.",
            href: "https://learn.microsoft.com/en-us/answers/tags/118/azure-cost-management/",
            logo: "azure",
          },
        ],
      },
      {
        name: "AWS",
        communities: [
          {
            name: "r/aws",
            what: "AWS subreddit; surprise bills and cost optimization are regular threads.",
            href: "https://www.reddit.com/r/aws/",
            logo: "reddit",
          },
          {
            name: "AWS re:Post: Cloud Financial Management",
            what: "AWS’s Q&A on billing, budgets, Savings Plans and cost optimization.",
            href: "https://repost.aws/topics/TAF-OeSePUTO6-bKAVIv7NqQ/cloud-financial-management",
            logo: "aws",
          },
          {
            name: "AWS User Groups",
            what: "AWS’s directory of community-led local user groups, by country.",
            href: "https://builder.aws.com/community/user-groups",
            logo: "aws",
          },
        ],
      },
    ] as readonly CommunityGroup[],
    /** "Checked on each community’s own page, 20 October 2026. Something missing? Write to founders@zoorik.com." */
    checked: "20 October 2026",
    note: {
      before: "Checked on each community’s own page, ",
      ask: ". Something missing? Write to ",
      email: contactEmail,
      end: ".",
    },
  },
  /** Two pages of this site: /events and /design-partners. */
  more: {
    id: "more",
    title: "More from Zoorik",
    tiles: [
      {
        title: "Events",
        line: "The conferences and meetups on cloud cost, Kubernetes and FinOps.",
        href: routes.events,
      },
      {
        title: "Design partners",
        line: `The first ${designPartnerPlaces} run Coral and Amoeba free on non-production infrastructure.`,
        href: routes.designPartners,
      },
    ] as readonly CommunityMore[],
  },
} as const;
