import type { JSX } from "react";

import { site } from "@/config/site";

/** The Tag Manager container for zoorik.com. Not a secret: every page carries it. */
export const GTM_CONTAINER_ID = "GTM-MB7QLD5D";

/** The Google Analytics stream the container sends to. Not a secret either. */
export const GA_MEASUREMENT_ID = "G-DPV4MD0ZBX";

/** The one host that reports. Read from `site.url`, so it cannot drift from the canonical host. */
export const GOOGLE_TAG_HOST = new URL(site.url).hostname;

/** The EEA, the UK and Switzerland, as ISO 3166 codes: the regions with no Analytics cookies. */
// prettier-ignore
export const NO_COOKIE_REGIONS = [
  "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI",
  "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU",
  "LV", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
] as const;

const NO_COOKIES = {
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: "denied",
  region: NO_COOKIE_REGIONS,
};

/**
 * Google's install snippet, inside two guards of ours.
 *
 * 🔴 ONLY ON zoorik.com, DECIDED IN THE BROWSER, for the reason clarity.tsx gives:
 * every page is one prerendered file, so `location.hostname` is what keeps local
 * runs, previews and Lighthouse on localhost out of the live stream.
 *
 * 🔴 ON EVERY PAGE'S LOAD. The window's `load` event starts it, so its 180 KB
 * script never competes with the stylesheet, the hero image or hydration. The
 * cost is the reader who leaves before the page has loaded: they are not counted.
 * Pages opened inside the site are counted too: the container's own history
 * listener sends a page_view on each client-side navigation.
 *
 * 🔴 THE CONSENT LINE COMES FIRST. Google reads the default as the container
 * starts, so it must already be in the queue. Privacy policy §4.6 says Analytics
 * sets no cookies in these regions; there is no banner to change that.
 *
 * 🔴 `arguments`, NEVER AN ARRAY. Google's queue reads an Arguments object as a
 * command; an array is ignored.
 */
export const googleTagSnippet =
  `if(location.hostname===${JSON.stringify(GOOGLE_TAG_HOST)}){window.addEventListener("load",function(){` +
  `window.dataLayer=window.dataLayer||[];` +
  `function gtag(){window.dataLayer.push(arguments);}` +
  `gtag("consent","default",${JSON.stringify(NO_COOKIES)});` +
  `gtag("js",new Date());` +
  `gtag("config",${JSON.stringify(GA_MEASUREMENT_ID)});` +
  `var t=document.createElement("script");t.async=1;` +
  `t.src="https://www.googletagmanager.com/gtm.js?id="+${JSON.stringify(GTM_CONTAINER_ID)};` +
  `document.head.appendChild(t);});}`;

export const GOOGLE_TAG_SCRIPT_ID = "google-tag";

/**
 * Google Tag Manager, which sends Google Analytics. A plain <script>, not
 * next/script, for the reason clarity.tsx gives: no JavaScript chunk of ours on
 * every page. It runs once per page load, and the root layout survives
 * client-side navigation.
 */
export function GoogleTag(): JSX.Element {
  return (
    <script id={GOOGLE_TAG_SCRIPT_ID} dangerouslySetInnerHTML={{ __html: googleTagSnippet }} />
  );
}
