import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/site";
import { pageOpenGraph } from "@/config/social";
import { pageStructuredData } from "@/config/structured-data";
import { communityPage } from "@/content/community";
import { CommunityPage } from "@/features/community/community-page";
import { dayOf } from "@/features/events/event-facts";

import "@/styles/learn.css";
import "@/styles/community.css";

/**
 * `/community`: Zoorik Community: r/zoorik, where Zoorik posts, the next big events and the wider community.
 * Indexed, listed in the sitemap, and prerendered at build like every page here; linked from the footer's Resources
 * column, after Compare. It is drawn on Learn's frame and carries Learn's sheet, as the mock does, then its own.
 *
 * The build's day trims the events, as on /events: what had ended by then is left out, and the reader's browser drops
 * what has ended since (`CommunityEvents`).
 */
/* ITS TITLE IS ABSOLUTE, like /learn's and /news's: "Zoorik Community: …" names the company already. */
export const metadata: Metadata = {
  title: { absolute: communityPage.meta.title },
  description: communityPage.meta.description,
  alternates: { canonical: routes.community },
  openGraph: pageOpenGraph(routes.community, communityPage.meta),
};

export default function Community(): React.JSX.Element {
  return (
    <>
      <JsonLd data={pageStructuredData(routes.community)} />
      <CommunityPage buildDay={dayOf(new Date())} />
    </>
  );
}
