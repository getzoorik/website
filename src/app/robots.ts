import type { MetadataRoute } from "next";

import { site } from "@/config/site";

/** Never crawled, by anyone: the lead API, and the assessment scripts' redirects. */
const disallow = ["/api/", "/assess/"];

/**
 * The three AI crawlers allowed by name. Cloudflare lets them through as well;
 * it once answered 403 while this file allowed everyone.
 */
export const namedCrawlers = ["GPTBot", "ClaudeBot", "CCBot"] as const;

/**
 * Every crawler may read every page but the two paths above. A crawler that
 * finds a group naming it reads that group instead of `*`, so the named group
 * repeats the disallows.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...namedCrawlers], allow: "/", disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
