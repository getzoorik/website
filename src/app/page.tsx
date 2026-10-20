import type { Metadata } from "next";

import { SiteNav } from "@/components/layout/site-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { homeUrl, site } from "@/config/site";
import { baseOpenGraph } from "@/config/social";
import { homeStructuredData } from "@/config/structured-data";
import { AssessSection } from "@/features/assess/assess-section";
import { ByDesignSection } from "@/features/by-design/by-design-section";
import { CaseBand } from "@/features/case-band/case-band";
import { ElasticSection } from "@/features/elastic/elastic-section";
import { FooterSection } from "@/features/footer/footer-section";
import { HeroSection } from "@/features/hero/hero-section";
import { HomeMotion } from "@/features/home-motion/home-motion";
import { KubernetesSection } from "@/features/kubernetes/kubernetes-section";
import { OffersSection } from "@/features/offers/offers-section";

/**
 * The home page, in the mock's order.
 *
 * ─── THE ORDER IS AN ARGUMENT, NOT A LAYOUT ────────────────────────────────
 * What the two products do (hero) → each product and what it has done, Coral
 * first, as the whole site lists them → what both promise (the By design band)
 * → what Coral did on our own cluster (the case study band) → what we offer,
 * and what each saves → where to find your own number, and how to reach a
 * human. Moving a section moves the argument. How it works is no longer
 * here: each product's page carries its own steps.
 *
 * Pricing and the FAQ are not in it. Both were removed on purpose, with the
 * contact form; the page closes on the assessment and the calendar instead.
 *
 * ─── A SERVER COMPONENT, AND ALMOST ALL OF ITS CHILDREN ARE TOO ────────────
 * Only the parts that genuinely move ship to the browser: the nav's menus and
 * drawer, the hero photo's failure handler, the reveal primitive and the motion
 * pass's one observer, which also plays the two product films. Everything else
 * — every heading, every figure, every sentence — is rendered on the server,
 * which is also what makes the copy readable with scripting off.
 */
/* No `title`: a layout's template does not apply to a page in the same segment,
   so the home page takes `title.default`. The card repeats the title and the
   description. */
const description = site.homeDescription;

/* No `alternates` and no og:url here: Next prints the root as "https://zoorik.com", without
   its slash, so the page draws both tags itself, with `homeUrl` (React places them in <head>).
   The sitemap and the JSON-LD print the same string. */
export const metadata: Metadata = {
  description,
  openGraph: { ...baseOpenGraph, title: site.title, description },
};

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <link rel="canonical" href={homeUrl} />
      <meta property="og:url" content={homeUrl} />
      <JsonLd data={homeStructuredData} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <KubernetesSection />
        <ElasticSection />
        <ByDesignSection />
        <CaseBand />
        <OffersSection />
        <AssessSection />
        <HomeMotion />
      </main>
      <FooterSection />
    </>
  );
}
