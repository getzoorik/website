import type { MetadataRoute } from "next";

import { amoebaDocs, routes, site } from "@/config/site";
import { aboutLastUpdated } from "@/content/about";
import { amoebaFaqPage } from "@/content/amoeba-faq";
import { amoebaGuide } from "@/content/amoeba-guide";
import { amoebaPageLastUpdated } from "@/content/amoeba-page";
import { assessmentLastUpdated } from "@/content/assessment";
import { brandAssetsLastUpdated } from "@/content/brand-assets";
import { careersLastUpdated } from "@/content/careers";
import { communityLastUpdated } from "@/content/community";
import { designPartnersLastUpdated } from "@/content/design-partners";
import { amoebaStudy, caseStudiesHubLastUpdated, caseStudy } from "@/content/case-studies";
import { coralFaqPage } from "@/content/coral-faq";
import { coralGuide } from "@/content/coral-guide";
import { coralPageLastUpdated } from "@/content/coral-page";
import { docsHubLastUpdated } from "@/content/documents";
import { eventsLastUpdated } from "@/content/events";
import { newsLastUpdated } from "@/content/news";
import { homeLastUpdated } from "@/content/hero";
import { learnPage } from "@/content/learn";
import {
  alternativesPages,
  cloudCostToolsLastUpdated,
  learnCompareLastUpdated,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import { marketplacesLastUpdated } from "@/content/marketplaces";
import { partnersLastUpdated } from "@/content/partners";
import { openSourceGuides, openSourceLastUpdated, openSourceUpdated } from "@/content/open-source";
import { glossaryPage, glossaryTerms, termRoute } from "@/content/learn/glossary";
import { articleRoute, learnArticles } from "@/content/learn/published";
import { privacy } from "@/content/privacy";
import { referralsLastUpdated } from "@/content/referrals";
import { researchLastUpdated } from "@/content/research";
import { securityPage } from "@/content/security";
import { termsCopy } from "@/content/terms";
import { troubleshootingGuides, troubleshootingUpdated } from "@/content/troubleshooting";
import { isoDay } from "@/lib/content-date";

/**
 * Each page's date. A page that prints one gives it: "Updated 9 October 2026"
 * on the guides, the FAQs and /security; the study's date; the policy's and the
 * terms' "Effective" line. A page that prints no day (the home page, the two
 * products, /assessment, the /docs and /case-studies hubs, /events, /about,
 * /careers, /brand-assets, /partners and /referrals) gives its content file's
 * `lastUpdated`: the day its content last changed, which whoever changes it
 * moves in the same PR. So every page has a date, and none is the build's.
 *
 * Learn's are ISO days already (`learnDates`): each article its `updated` day,
 * and the hub the later of its own day and its newest article's, as a new
 * article changes the hub too. The glossary's the same way: each term its
 * `updated` day, and its hub the later of its own day and its newest term's.
 */
const learnDates: Readonly<Record<string, string>> = (() => {
  const latest = (own: string, days: readonly string[]): string =>
    days.reduce((day, other) => (other > day ? other : day), own);
  return Object.fromEntries([
    [
      routes.learn,
      latest(
        isoDay(learnPage.updated),
        learnArticles.map((article) => article.updated),
      ),
    ],
    ...learnArticles.map((article) => [articleRoute(article), article.updated] as const),
    [
      routes.learnGlossary,
      latest(
        isoDay(glossaryPage.updated),
        glossaryTerms.map((term) => term.updated),
      ),
    ],
    ...glossaryTerms.map((term) => [termRoute(term), term.updated] as const),
  ]);
})();

const contentDates: Partial<Record<string, string>> = {
  "/": homeLastUpdated,
  [routes.coral]: coralPageLastUpdated,
  [routes.amoeba]: amoebaPageLastUpdated,
  [routes.assessment]: assessmentLastUpdated,
  [routes.docs]: docsHubLastUpdated,
  [routes.coralGuide]: coralGuide.updated,
  [routes.coralFaq]: coralFaqPage.updated,
  [routes.amoebaGuide]: amoebaGuide.updated,
  [routes.amoebaFaq]: amoebaFaqPage.updated,
  [routes.cloudCostTools]: cloudCostToolsLastUpdated,
  /* The comparison pages (under Cloud cost optimization tools) print "checked 19 October 2026": one content date. */
  ...Object.fromEntries(
    [...alternativesPages.map((page) => page.route), ...versusPages.map(versusRoute)].map(
      (route) => [route, learnCompareLastUpdated] as const,
    ),
  ),
  [routes.valueLab]: caseStudiesHubLastUpdated,
  [routes.caseStudyCoralDevCluster]: caseStudy.band.date,
  [routes.caseStudyAmoebaLabVms]: amoebaStudy.band.date,
  [routes.events]: eventsLastUpdated,
  [routes.news]: newsLastUpdated,
  [routes.community]: communityLastUpdated,
  [routes.marketplaces]: marketplacesLastUpdated,
  [routes.about]: aboutLastUpdated,
  [routes.careers]: careersLastUpdated,
  [routes.brandAssets]: brandAssetsLastUpdated,
  [routes.referrals]: referralsLastUpdated,
  [routes.partners]: partnersLastUpdated,
  [routes.designPartners]: designPartnersLastUpdated,
  [routes.privacy]: privacy.effective,
  [routes.terms]: termsCopy.effective,
  [routes.security]: securityPage.updated,
  /* /open-source prints no day; the three guides print "Updated 16 October 2026". */
  [routes.openSource]: openSourceLastUpdated,
  [openSourceGuides.helm.route]: openSourceUpdated,
  [openSourceGuides.terraform.route]: openSourceUpdated,
  [openSourceGuides.contributing.route]: openSourceUpdated,
  /* The four troubleshooting pages print "Updated 29 October 2026". */
  ...Object.fromEntries(
    Object.values(troubleshootingGuides).map(
      (guide) => [guide.route, guide.updated ?? troubleshootingUpdated] as const,
    ),
  ),
  /* The research page prints no day: its content file's. */
  [routes.research]: researchLastUpdated,
};

/**
 * Every indexed page: home first, then the two products (Coral first), the
 * assessment, the documents section (the hub, then Coral's guide and FAQ, then
 * Amoeba's once `amoebaDocs` publishes them, the install and contributing
 * guides and the troubleshooting pages), Learn and every article in the
 * Learn index (A–Z by slug), the glossary and every term in its index (A–Z by
 * slug), the case studies, the research papers, /events, /about, /careers,
 * /brand-assets, /partners, /referrals, the privacy policy, the terms, and
 * security and data handling.
 * A held page answers 404, so it is never listed.
 *
 * `lastModified` is the page's date from `learnDates` or `contentDates`, never the build's.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    routes.coral,
    routes.amoeba,
    routes.assessment,
    routes.marketplaces,
    routes.docs,
    routes.coralGuide,
    routes.coralFaq,
    ...(amoebaDocs ? [routes.amoebaGuide, routes.amoebaFaq] : []),
    routes.docsInstallHelm,
    routes.docsInstallTerraform,
    routes.docsContributing,
    routes.docsCoralNotConnecting,
    routes.docsCoralNotRemovingNodes,
    ...(amoebaDocs ? [routes.docsAmoebaNotShowingVm, routes.docsAmoebaNotRightsizing] : []),
    routes.openSource,
    routes.learn,
    ...learnArticles.map(articleRoute),
    routes.learnGlossary,
    ...glossaryTerms.map(termRoute),
    routes.cloudCostTools,
    ...alternativesPages.map((page) => page.route),
    ...versusPages.map(versusRoute),
    routes.valueLab,
    routes.caseStudyCoralDevCluster,
    routes.caseStudyAmoebaLabVms,
    routes.research,
    routes.events,
    routes.news,
    routes.community,
    routes.about,
    routes.careers,
    routes.brandAssets,
    routes.referrals,
    routes.partners,
    routes.designPartners,
    routes.privacy,
    routes.terms,
    routes.security,
  ].map((path) => {
    const printed = contentDates[path];
    const date = learnDates[path] ?? (printed ? isoDay(printed) : undefined);
    return {
      url: `${site.url}${path}`,
      ...(date ? { lastModified: date } : {}),
    };
  });
}
