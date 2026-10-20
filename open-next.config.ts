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
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
