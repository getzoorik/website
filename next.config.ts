import type { NextConfig } from "next";

/**
 * The one hostname the site is served on. Everything else 308s here.
 *
 * Zoorik owns four registrable domains — zoorik.com, zoorik.in, zoorik.net and
 * zoorick.com — and serving the same pages on more than one of them is not a
 * nicety to fix later: search engines treat it as duplicate content and split
 * the ranking signal between the copies. One canonical host, everything else
 * redirected, keeps that signal in one place.
 */
const CANONICAL_HOST = "zoorik.com";

/**
 * Hosts that must redirect rather than serve.
 *
 * Each of these is also declared as a `custom_domain` route in wrangler.jsonc —
 * a redirect only fires if the request reaches this Worker in the first place,
 * so the two lists have to stay in step. A host added here but not there is
 * dead config; a host added there but not here silently SERVES the site on a
 * second domain, which is the outcome this file exists to prevent.
 *
 * www.zoorik.com redirects too: it served a full second copy of every page,
 * which search engines count as duplicate content. zoorik.com itself must never
 * be listed: OpenNext matches the host as an unanchored regex, so that entry
 * would also match zoorik.com and loop.
 */
const REDIRECT_HOSTS = [
  "www.zoorik.com",
  "zoorik.in",
  "www.zoorik.in",
  "zoorik.net",
  "www.zoorik.net",
  // The misspelling people type. Its zone is on this Cloudflare account.
  "zoorick.com",
  "www.zoorick.com",
] as const;

/**
 * The Docs hub's old address, and the PDFs that were served under it.
 *
 * zoorik.com once served the hub at `/resources` and three PDFs beside it,
 * before the relaunch moved them to `/docs` and `/docs/*.pdf`. Those
 * addresses may already be in a search index, a bookmark or an e-mail, so each
 * one 308s to where its content lives now. The hash rides along on its own: a
 * browser keeps `#coral` across a redirect, so `/resources#coral` lands on the
 * hub's Coral group.
 *
 * 🔴 BY NAME, NEVER A PATTERN. A `/resources/:file` rule would also send the
 * internal FAQ's old address, which once answered 200, to a `/docs/` URL;
 * it must answer 404 where it was (src/app/internal-docs.test.ts). Only the
 * three files the site still publishes move.
 */
const MOVED_DOCUMENTS = [
  "coral-product-guide.pdf",
  "coral-faq.pdf",
  "coral-one-pager.pdf",
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    resolveAlias: {
      // Next's polyfill module, swapped for ours in the browser bundle only. Why
      // it is safe is in src/lib/next-polyfills.ts.
      //
      // 🔴 THE KEY IS THE RELATIVE REQUEST NEXT ITSELF MAKES, from
      // next/dist/client/app-globals.js. The package path
      // ("next/dist/build/polyfills/polyfill-module") matches nothing: built
      // with it, the polyfills were still in the chunk. If a Next upgrade
      // renames the import, the alias stops matching and the polyfills simply
      // come back; nothing breaks.
      "../build/polyfills/polyfill-module": { browser: "./src/lib/next-polyfills.ts" },
    },
  },
  // Pages rendered on the Worker. Static files get the same two headers from
  // public/_headers, which Cloudflare's static assets apply before the Worker.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    // Two rules per host, and the split is load-bearing.
    //
    // A single `/:path*` rule looks right and passes locally, but `:path*`
    // matches the EMPTY string at the root and OpenNext does not substitute an
    // empty match -- it emits the literal `https://zoorik.com/:path*`. Verified
    // in production: `/pricing` and `/a/b?x=1` rewrote correctly while `/`, the
    // case almost everyone hits, redirected to a URL containing ":path*".
    // `next start` substitutes it, so local testing does not catch this.
    //
    // `:path+` requires at least one segment, so the empty match never occurs
    // and the root is handled by its own literal rule.
    //
    // The host rules come first, so an alias host's request reaches the apex
    // before any path moves; the path rules after them are literal paths with
    // no parameter, which OpenNext emits as written.
    const hosts = REDIRECT_HOSTS.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: `https://${CANONICAL_HOST}/`,
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host" as const, value: host }],
        destination: `https://${CANONICAL_HOST}/:path+`,
        // Permanent, not temporary. A 302 tells search engines to keep indexing
        // the alias, which leaves the duplicate-content problem in place.
        //
        // Next emits 308 for this, not 301. Both are permanent and Google treats
        // them the same for canonicalisation; 308 additionally preserves the
        // request method, where 301 historically allowed clients to downgrade a
        // POST to GET. Verified against a running build: 308 with the path and
        // query carried through.
        permanent: true,
      },
    ]);
    const moved = [
      { source: "/resources", destination: "/docs", permanent: true },
      /* The case studies' hub is Value Lab, and each study is at the site's root (owner, 29 Oct 2026): the old
         addresses, the hub's and each study's, go straight there, never through a second redirect. The Coral study was
         the only one ever under /case-studies. */
      { source: "/case-studies", destination: "/value-lab", statusCode: 301 },
      {
        source: "/case-studies/coral-dev-cluster",
        destination: "/coral-value-lab",
        statusCode: 301,
      },
      { source: "/value-lab/coral-dev-cluster", destination: "/coral-value-lab", statusCode: 301 },
      { source: "/value-lab/amoeba-lab-vms", destination: "/amoeba-value-lab", statusCode: 301 },
      /* The four troubleshooting pages under /docs are two now, one per product at the site's root: each old page
         goes to its product's. */
      {
        source: "/docs/coral-not-connecting-to-cluster",
        destination: "/coral-troubleshooting",
        statusCode: 301,
      },
      {
        source: "/docs/coral-not-removing-nodes",
        destination: "/coral-troubleshooting",
        statusCode: 301,
      },
      {
        source: "/docs/amoeba-not-showing-my-vm",
        destination: "/amoeba-troubleshooting",
        statusCode: 301,
      },
      {
        source: "/docs/amoeba-not-rightsizing-disks",
        destination: "/amoeba-troubleshooting",
        statusCode: 301,
      },
      /* Each product's guide and FAQ, at the site's root since 29 Oct 2026. */
      { source: "/coral/guide", destination: "/coral-guide", statusCode: 301 },
      { source: "/coral/faq", destination: "/coral-faq", statusCode: 301 },
      { source: "/amoeba/guide", destination: "/amoeba-guide", statusCode: 301 },
      { source: "/amoeba/faq", destination: "/amoeba-faq", statusCode: 301 },
      /* The research papers' first address. */
      {
        source: "/research-cloud-cost-optimization",
        destination: "/cloud-cost-optimization-research-papers",
        statusCode: 301,
      },
      /* Cloud cost optimization tools and the comparison pages under it live at /cloud-cost-optimization-library: its
         old address and each page under it move there. */
      {
        source: "/cloud-cost-optimization-tools",
        destination: "/cloud-cost-optimization-library",
        statusCode: 301,
      },
      {
        source: "/cloud-cost-optimization-tools/:slug",
        destination: "/cloud-cost-optimization-library/:slug",
        statusCode: 301,
      },
      /* The comparison pages' first addresses, under /compare, go straight to the new ones too. */
      { source: "/compare", destination: "/cloud-cost-optimization-library", statusCode: 301 },
      {
        source: "/compare/:slug",
        destination: "/cloud-cost-optimization-library/:slug",
        statusCode: 301,
      },
      /* Their older addresses under /learn go straight to the new ones, never through a second redirect. */
      {
        source: "/learn/compare/:slug",
        destination: "/cloud-cost-optimization-library/:slug",
        statusCode: 301,
      },
      {
        source: "/learn/coral-alternatives",
        destination: "/cloud-cost-optimization-library/coral-alternatives",
        statusCode: 301,
      },
      {
        source: "/learn/amoeba-alternatives",
        destination: "/cloud-cost-optimization-library/amoeba-alternatives",
        statusCode: 301,
      },
      /* The comparison of Coral and the native autoscalers is replaced by Kubernetes autoscaling, at its own address
         since 1 Nov 2026: straight there, never through the article's old address. */
      {
        source: "/learn/coral-and-native-autoscalers",
        destination: "/learn/kubernetes-autoscaling",
        statusCode: 301,
      },
      /* Two Learn articles at the address of their search (owner, 1 Nov 2026), each old address one hop from the new:
         HPA vs VPA vs Cluster Autoscaler is Kubernetes autoscaling, and Azure disk cost optimization is Azure disk
         reservations. */
      {
        source: "/learn/hpa-vs-vpa-vs-cluster-autoscaler",
        destination: "/learn/kubernetes-autoscaling",
        statusCode: 301,
      },
      {
        source: "/learn/azure-disk-cost-optimization",
        destination: "/learn/azure-disk-reservations",
        statusCode: 301,
      },
      /* Eight pages at the address of their search (D230, owner, 1 Nov 2026), each old address one hop from the new,
         kept at least a year. The two pillar articles leave /learn for the site's root: these rules run before the
         /learn/[slug] route, which no longer serves them. */
      {
        source: "/learn/how-to-reduce-cloud-costs",
        destination: "/cloud-cost-optimization",
        statusCode: 301,
      },
      {
        source: "/learn/reduce-kubernetes-cost",
        destination: "/kubernetes-cost-optimization",
        statusCode: 301,
      },
      {
        source: "/disk-cost-calculator",
        destination: "/ebs-and-azure-disk-pricing",
        statusCode: 301,
      },
      {
        source: "/node-cost-calculator",
        destination: "/eks-and-aks-pricing-calculator",
        statusCode: 301,
      },
      { source: "/coral-for-aks", destination: "/aks-cost-optimization", statusCode: 301 },
      { source: "/coral-for-eks", destination: "/eks-cost-optimization", statusCode: 301 },
      { source: "/amoeba-for-aws", destination: "/ebs-cost-optimization", statusCode: 301 },
      {
        source: "/amoeba-for-azure",
        destination: "/azure-managed-disk-cost-optimization",
        statusCode: 301,
      },
      ...MOVED_DOCUMENTS.map((file) => ({
        source: `/resources/${file}`,
        destination: `/docs/${file}`,
        permanent: true,
      })),
    ];
    return [...hosts, ...moved];
  },
};

export default nextConfig;
