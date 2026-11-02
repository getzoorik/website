import { glossaryPath, routes } from "@/config/site";
import { cardFor, type ShareImage } from "@/config/social";

import { glossaryFiles } from "./glossary.generated";
import { glossaryGroups, type GlossaryGroupId, type GlossaryTerm } from "./glossary-term";

/**
 * The glossary: every published term, read from the generated list of term files, and the hub's words. Everything per
 * term reads it (the page and its metadata, the structured data, the sitemap and the hub), so publishing a term is
 * adding its file, and a link to a term that is not published is never drawn (`isLiveHref`, `@/content/learn/published`).
 */

/** Every published term, A–Z by slug. */
export const glossaryTerms: readonly GlossaryTerm[] = glossaryFiles.map((entry) => entry.term);

const bySlug = new Map(glossaryTerms.map((term) => [term.slug, term]));

/** The published term with this slug, if there is one. */
export function findTerm(slug: string): GlossaryTerm | undefined {
  return bySlug.get(slug);
}

/** A term's address. */
export const termRoute = (term: GlossaryTerm): `/learn/glossary/${string}` =>
  glossaryPath(term.slug);

/** The slug a link names when it leads to a glossary term (`/learn/glossary/<slug>`, with or without a hash or query). */
export function glossarySlugOf(href: string): string | null {
  const match = /^\/learn\/glossary\/([^/?#]+)(?:[?#].*)?$/.exec(href);
  return match ? match[1]! : null;
}

/** A term's name: its words before the brackets that hold its other names ("Spot instance"). */
export const termName = (term: GlossaryTerm): string => term.term.replace(/\s*\(.*\)\s*$/, "");

/** A term's share card: its own where it has one, else the glossary's (`cardFor`). */
export function termCard(term: GlossaryTerm): ShareImage {
  return cardFor(termRoute(term));
}

/**
 * `/learn/glossary`, the hub: every string it prints. Its title goes through the layout's template ("Cloud computing
 * terms: a cloud cost glossary | Zoorik"), and its h1 is the same words. Each term's trail names the hub by `crumb`.
 */
export const glossaryPage = {
  path: routes.learnGlossary,
  meta: {
    title: "Cloud computing terms: a cloud cost glossary",
    description:
      "Cloud computing terminology in plain words: AWS terms and definitions, Azure and Kubernetes terms, and the block storage and FinOps vocabulary of cloud cost.",
  },
  hero: {
    /** The small line over the h1, a link back to /learn. */
    kicker: "Learn",
    title: "Cloud computing terms: a cloud cost glossary",
    deck: "Every definition comes from the AWS, Azure, Kubernetes or Linux docs it cites.",
  },
  /**
   * The day the hub's own content last changed, for the sitemap; it is not printed. A new term moves the hub's sitemap
   * day on its own (`sitemap.ts`), so this moves only when the hub itself changes.
   */
  updated: "Updated 2 November 2026",
  /** The hub's name in each term's trail, over its h1 and in the structured data. */
  crumb: "Glossary",
  /** After a group's count, beside its head: "10 terms", then the group's `about`. */
  count: { one: "term", many: "terms" },
  /** Its tile in /learn's More from Zoorik: the line under the h1. */
  line: "Plain answers to the terms behind your cloud cost.",
  /** Each group's heading on the hub, naming its terms as people search for them. */
  groups: {
    kubernetes: "Kubernetes terms",
    "block-storage": "Block storage terms",
    "finops-pricing": "FinOps and pricing terms",
  } satisfies Record<GlossaryGroupId, string>,
  /** The words after each group's count, beside its head: "17 terms, a Kubernetes glossary from …". */
  about: {
    kubernetes: "a Kubernetes glossary from requests and limits to AKS and EKS",
    "block-storage": "the AWS and Azure glossary of disks, volumes and Linux filesystems",
    "finops-pricing":
      "a cheat sheet of AWS and Azure terminology for pricing, discounts and FinOps",
  } satisfies Record<GlossaryGroupId, string>,
} as const;

/**
 * A group of the hub: its id (the section's anchor), its heading, the words after its count, and its terms A–Z by
 * name.
 */
export interface GlossaryHubGroup {
  readonly id: GlossaryGroupId;
  readonly title: string;
  readonly about: string;
  readonly terms: readonly GlossaryTerm[];
}

/** The hub's groups, in the glossary's order; a group with no published term is left out. */
export const glossaryHubGroups: readonly GlossaryHubGroup[] = glossaryGroups
  .map((group) => ({
    id: group.id,
    title: glossaryPage.groups[group.id],
    about: glossaryPage.about[group.id],
    terms: glossaryTerms
      .filter((term) => term.group === group.id)
      .sort((a, b) => termName(a).localeCompare(termName(b), "en", { sensitivity: "base" })),
  }))
  .filter((group) => group.terms.length > 0);
