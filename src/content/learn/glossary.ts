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
 * `/learn/glossary`, the hub: every string it prints. Its title goes through the layout's template ("Glossary |
 * Zoorik"); its h1 names what the glossary is about. Each term's trail names the hub by `crumb`.
 */
export const glossaryPage = {
  path: routes.learnGlossary,
  meta: {
    title: "Glossary",
    description:
      "Plain answers to the cloud cost terms on AKS, EKS, Azure and AWS: Kubernetes requests and limits, disk IOPS and throughput, and spot and reserved pricing.",
  },
  hero: {
    /** The small line over the h1, a link back to /learn. */
    kicker: "Learn",
    title: "Cloud cost glossary",
    deck: "Plain answers to the Kubernetes, block storage and pricing terms on your cloud bill.",
  },
  /**
   * The day the hub's own content last changed, for the sitemap; it is not printed. A new term moves the hub's sitemap
   * day on its own (`sitemap.ts`), so this moves only when the hub itself changes.
   */
  updated: "Updated 25 October 2026",
  /** The hub's name in each term's trail, over its h1 and in the structured data. */
  crumb: "Glossary",
  /** After a group's count, beside its head: "10 terms". */
  count: { one: "term", many: "terms" },
  /** Its tile in /learn's More from Zoorik: the line under the h1. */
  line: "Plain answers to the terms on your cloud bill.",
} as const;

/** A group of the hub: its id (the section's anchor), its heading, and its terms A–Z by name. */
export interface GlossaryHubGroup {
  readonly id: GlossaryGroupId;
  readonly title: string;
  readonly terms: readonly GlossaryTerm[];
}

/** The hub's groups, in the glossary's order; a group with no published term is left out. */
export const glossaryHubGroups: readonly GlossaryHubGroup[] = glossaryGroups
  .map((group) => ({
    ...group,
    terms: glossaryTerms
      .filter((term) => term.group === group.id)
      .sort((a, b) => termName(a).localeCompare(termName(b), "en", { sensitivity: "base" })),
  }))
  .filter((group) => group.terms.length > 0);
