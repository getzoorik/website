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
import { caseStudiesHubLastUpdated, caseStudy } from "@/content/case-studies";
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
  learnCompareLastUpdated,
  versusPages,
  versusRoute,
} from "@/content/learn-compare";
import { marketplacesLastUpdated } from "@/content/marketplaces";
import { partnersLastUpdated } from "@/content/partners";
import { openSourceGuides, openSourceLastUpdated, openSourceUpdated } from "@/content/open-source";
import { articleRoute, learnArticles } from "@/content/learn/published";
import { privacy } from "@/content/privacy";
import { referralsLastUpdated } from "@/content/referrals";
import { securityPage } from "@/content/security";
import { termsCopy } from "@/content/terms";
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
 * article changes the hub too.
 */
const learnDates: Readonly<Record<string, string>> = (() => {
  const own = isoDay(learnPage.updated);
  const newest = learnArticles.reduce(
    (day, article) => (article.updated > day ? article.updated : day),
    own,
  );
  return Object.fromEntries([
    [routes.learn, newest],
    ...learnArticles.map((article) => [articleRoute(article), article.updated] as const),
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
  /* The comparison pages (at /compare) print "checked 19 October 2026": one content date. */
  ...Object.fromEntries(
    [
      routes.compare,
      ...alternativesPages.map((page) => page.route),
      ...versusPages.map(versusRoute),
    ].map((route) => [route, learnCompareLastUpdated] as const),
  ),
  [routes.caseStudies]: caseStudiesHubLastUpdated,
  [routes.caseStudyCoralDevCluster]: caseStudy.band.date,
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
};

/**
 * Every indexed page: home first, then the two products (Coral first), the
 * assessment, the documents section (the hub, then Coral's guide and FAQ, then
 * Amoeba's once `amoebaDocs` publishes them), Learn and every article in the
 * Learn index (A–Z by slug), the case studies, /events, /about, /careers,
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
    routes.openSource,
    routes.learn,
    ...learnArticles.map(articleRoute),
    routes.compare,
    ...alternativesPages.map((page) => page.route),
    ...versusPages.map(versusRoute),
    routes.caseStudies,
    routes.caseStudyCoralDevCluster,
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
