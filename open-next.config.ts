import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * The incremental cache reads the prerendered pages from static assets. Every
 * page on this site is static (○), so without it the Worker re-rendered each
 * page on every request, at 35-530 ms of CPU, which took zoorik.com's pages
 * down while static files kept answering.
 *
 * This cache is read-only and does no ISR, which fits a site with no
 * revalidation; the one dynamic route (`src/app/api/lead/route.ts`) still runs on
 * the Worker. The prerendered pages reach the assets only through
 * `opennextjs-cloudflare populateCache local`, which deploy.yml runs between
 * the build and the deploy.
 */
/**
 * `enableCacheInterception: true` serves each cached page from static assets
 * BEFORE the Next.js handler boots. Without it, every request still cold-boots
 * the full app inside the Worker and then reads the cache, which on Workers
 * Free (10 ms CPU) produces the 1102 "exceeded resource limits" errors and
 * ~45 s cold-start hangs that took /coral and /amoeba down. Every route here
 * is static except `/api/lead`, which still boots the handler as before.
 *
 * Must stay `false` if PPR is ever enabled in next.config.ts.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
