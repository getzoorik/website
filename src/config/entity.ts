/**
 * Where Zoorik is described outside its own site, for the structured data's
 * `sameAs`. Pointing at the company's entries in the public knowledge bases
 * lets a search engine tie zoorik.com to this Zoorik and tell it apart from the
 * other companies of the same name. None is shown on a page.
 */

/** Zoorik's Wikidata entry (Q141717592). It names zoorik.com as the official website. */
export const wikidataEntity = "https://www.wikidata.org/wiki/Q141717592";

/** Zoorik's Crunchbase profile. Wikidata's Crunchbase ID for Zoorik is "zoorik". */
export const crunchbaseProfile = "https://www.crunchbase.com/organization/zoorik";

/**
 * Zoorik's Bluesky account. Its handle is the domain itself, @zoorik.com, which
 * Bluesky checks against the `_atproto` TXT record on zoorik.com.
 */
export const blueskyProfile = "https://bsky.app/profile/zoorik.com";

/** Zoorik's public GitLab group, with the same name, logo and description. */
export const gitlabGroup = "https://gitlab.com/zoorik";

/** Zoorik's Substack publication. */
export const substackPublication = "https://zoorik.substack.com";

/** Zoorik's Instagram account. */
export const instagramProfile = "https://www.instagram.com/getzoorik/";

/** Zoorik's packages on Artifact Hub (Verified Publisher); it has no organization page of its own. */
export const artifactHubOrg = "https://artifacthub.io/packages/search?org=zoorik";

/** The names Zoorik holds on npm and Quay, and its Gravatar profile. */
export const npmOrg = "https://www.npmjs.com/org/zoorik";
export const quayOrg = "https://quay.io/organization/zoorik";
export const gravatarProfile = "https://gravatar.com/getzoorik";

/** Zoorik on Hacker News, dev.to, Mastodon and Wellfound. */
export const hackerNewsProfile = "https://news.ycombinator.com/user?id=zoorik";
export const devToOrg = "https://dev.to/zoorik";
export const mastodonProfile = "https://mastodon.social/@zoorik";
export const wellfoundCompany = "https://wellfound.com/company/zoorik";

/**
 * Zoorik in the company and software directories: F6S, Tracxn (the company, and Zoorik Private
 * Limited as a legal entity; Google's first Tracxn result for "zoorik" is a namesake, Zoorik Industry LLP), G2's
 * seller page and SaaSBrowser. Coral's own G2 page names the product, so it sits on Coral's app (`g2Coral`).
 */
export const f6sCompany = "https://www.f6s.com/company/zoorik";
export const tracxnCompany =
  "https://tracxn.com/d/companies/zoorik/__0-HfxD5kpG4SADDRpAEc8XzSUYQVK-7bAubR7EZJjts";
export const tracxnLegalEntity =
  "https://tracxn.com/d/legal-entities/india/zoorik-private-limited/__9ZpZy4SmPoVfqekVAwReCtuqusqZ9_HeIkXu1AWCU84";
export const g2Seller = "https://www.g2.com/sellers/zoorik";
export const saasBrowserProfile = "https://saasbrowser.com/en/saas/1707340/zoorik";

/** Coral's page on G2, on Coral's app beside its two marketplace listings. */
export const g2Coral = "https://www.g2.com/products/zoorik-coral/reviews";
